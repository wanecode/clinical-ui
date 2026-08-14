import { type KeyboardEvent, type RefCallback, useMemo, useRef, useState } from "react";
import {
  DentalPanel,
  DentalStateBoundary,
  EvidenceBadge,
  ToothStatusBadge,
  toothLateralityLabel,
  toothStatusConfig,
} from "./primitives";
import type { DentalStateProps, Dentition, ToothRecord, ToothSurface } from "./types";

const surfaceLabels: Record<ToothSurface, string> = {
  occlusal: "Occlusale",
  mesial: "Mésiale",
  distal: "Distale",
  buccal: "Vestibulaire",
  lingual: "Linguale / palatine",
};

const surfaces = Object.keys(surfaceLabels) as ToothSurface[];

export interface LongitudinalOdontogramProps extends DentalStateProps {
  teeth: ToothRecord[];
  dentition?: Dentition;
  selectedTooth?: string;
  selectedSurface?: ToothSurface;
  density?: "comfortable" | "compact";
  historiesAvailable?: boolean;
  notation?: "FDI" | string;
  entryConflict?: {
    localAuthor: string;
    remoteAuthor: string;
    localTime: string;
    remoteTime: string;
  };
  onSelectionChange?: (selection: { tooth: string; surface: ToothSurface }) => void;
}

export function LongitudinalOdontogram({
  teeth,
  dentition = "permanent",
  selectedTooth,
  selectedSurface = "occlusal",
  density = "comfortable",
  historiesAvailable = true,
  notation = "FDI",
  entryConflict,
  onSelectionChange,
  state,
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: LongitudinalOdontogramProps) {
  const visibleTeeth = useMemo(
    () =>
      teeth.filter((tooth) =>
        dentition === "mixed"
          ? true
          : dentition === "primary"
            ? tooth.dentition === "primary"
            : tooth.dentition === "permanent",
      ),
    [dentition, teeth],
  );
  const initialTooth =
    visibleTeeth.find((tooth) => tooth.fdi === selectedTooth)?.fdi ?? visibleTeeth[0]?.fdi ?? "";
  const [activeTooth, setActiveTooth] = useState(initialTooth);
  const [activeSurface, setActiveSurface] = useState<ToothSurface>(selectedSurface);
  const toothRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = visibleTeeth.find((tooth) => tooth.fdi === activeTooth) ?? visibleTeeth[0];

  const select = (tooth: string, surface = activeSurface) => {
    setActiveTooth(tooth);
    setActiveSurface(surface);
    onSelectionChange?.({ tooth, surface });
  };

  const onToothKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const columns = Math.max(1, Math.floor(visibleTeeth.length / 2));
    let next = index;
    if (event.key === "ArrowRight") next = Math.min(visibleTeeth.length - 1, index + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, index - 1);
    else if (event.key === "ArrowDown") next = Math.min(visibleTeeth.length - 1, index + columns);
    else if (event.key === "ArrowUp") next = Math.max(0, index - columns);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = visibleTeeth.length - 1;
    else return;
    event.preventDefault();
    const tooth = visibleTeeth[next];
    if (tooth) {
      select(tooth.fdi);
      toothRefs.current[next]?.focus();
    }
  };

  const content = (
    <div className="od-odontogram" data-density={density}>
      {entryConflict ? (
        <div className="od-conflict" role="alert">
          <span aria-hidden="true">⚠</span>
          <div>
            <strong>Conflit de saisie</strong>
            <p>
              Version locale · {entryConflict.localAuthor} à {entryConflict.localTime} — version
              distante · {entryConflict.remoteAuthor} à {entryConflict.remoteTime}
            </p>
          </div>
          <button type="button">Comparer les versions</button>
        </div>
      ) : null}

      {notation !== "FDI" ? (
        <div className="od-notation-warning" role="status">
          <span aria-hidden="true">?</span>
          <div>
            <strong>Notation reçue non convertie</strong>
            <p>
              La notation « {notation} » est conservée telle quelle. Confirmez la correspondance
              avant toute saisie.
            </p>
          </div>
        </div>
      ) : null}

      <div className="od-odontogram__layout">
        <div className="od-odontogram__chart">
          <section className="od-tooth-legend" aria-label="Légende des états dentaires">
            {(
              ["sound", "caries", "filled", "crown", "missing", "implant", "endodontic"] as const
            ).map((status) => (
              <ToothStatusBadge key={status} status={status} />
            ))}
          </section>
          <p className="od-scroll-hint">
            <span aria-hidden="true">↔</span> Faire défiler horizontalement sur écran étroit
          </p>
          <section
            className="od-laterality"
            aria-label="Repères de latéralité, point de vue du patient"
          >
            <span>← Droit patient</span>
            <span>Gauche patient →</span>
          </section>
          <section className="od-arches" aria-label={`Odontogramme ${dentition} en notation FDI`}>
            {(["maxillary", "mandibular"] as const).map((arch) => {
              const archTeeth = visibleTeeth.filter((tooth) => tooth.arch === arch);
              return (
                <div className="od-arch" key={arch}>
                  <span className="od-arch__label">
                    {arch === "maxillary" ? "Maxillaire" : "Mandibule"}
                  </span>
                  <div className="od-arch__teeth">
                    {archTeeth.map((tooth) => {
                      const index = visibleTeeth.indexOf(tooth);
                      const status = toothStatusConfig[tooth.status];
                      const selected = tooth.fdi === current?.fdi;
                      return (
                        <button
                          type="button"
                          className="od-tooth"
                          data-tooth-status={tooth.status}
                          data-selected={selected || undefined}
                          aria-pressed={selected}
                          aria-label={`${tooth.label} — ${toothLateralityLabel(tooth.fdi)} — ${status.label} — ${tooth.evidence}`}
                          key={tooth.fdi}
                          onClick={() => select(tooth.fdi)}
                          onKeyDown={(event) => onToothKeyDown(event, index)}
                          ref={
                            ((node) => {
                              toothRefs.current[index] = node;
                            }) as RefCallback<HTMLButtonElement>
                          }
                          tabIndex={selected || (!current && index === 0) ? 0 : -1}
                        >
                          <span className="od-tooth__fdi">{tooth.fdi}</span>
                          <span className="od-tooth__shape" aria-hidden="true">
                            <span>{status.symbol}</span>
                          </span>
                          <span className="od-tooth__status">{status.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        {current ? (
          <aside
            className="od-odontogram__inspector"
            aria-label={`Inspection de la dent ${current.fdi}`}
          >
            <p className="od-eyebrow">Unité longitudinale</p>
            <h3>Dent {current.fdi}</h3>
            <div className="od-inspector-summary">
              <ToothStatusBadge status={current.status} />
              <EvidenceBadge kind={current.evidence} />
            </div>
            <fieldset className="od-surface-picker">
              <legend>Face sélectionnée</legend>
              {surfaces.map((surface) => (
                <button
                  key={surface}
                  type="button"
                  aria-pressed={activeSurface === surface}
                  onClick={() => select(current.fdi, surface)}
                >
                  <span aria-hidden="true">{surface === "occlusal" ? "◎" : "◇"}</span>
                  {surfaceLabels[surface]}
                </button>
              ))}
            </fieldset>
            <div className="od-history">
              <div className="od-history__heading">
                <h4>Historique</h4>
                <span>{current.history?.length ?? 0} entrée(s)</span>
              </div>
              {!historiesAvailable ? (
                <div className="od-inline-empty" role="status">
                  <strong>Historique absent</strong>
                  <span>Aucune version antérieure n'a été transmise.</span>
                </div>
              ) : current.history?.length ? (
                <ol>
                  {current.history.map((event) => (
                    <li key={event.id}>
                      <time dateTime={event.date}>{event.date}</time>
                      <strong>{event.label}</strong>
                      {event.detail ? <span>{event.detail}</span> : null}
                      <EvidenceBadge kind={event.evidence} />
                      <code>{event.resourceRef}</code>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="od-inline-empty" role="status">
                  <strong>Aucun événement longitudinal</strong>
                  <span>La dent est connue, sans transition documentée.</span>
                </div>
              )}
            </div>
          </aside>
        ) : null}
      </div>

      <details className="od-table-alternative">
        <summary>Vue alternative — tableau dentaire</summary>
        <div className="od-table-scroll">
          <table>
            <caption>État des dents affichées, équivalent textuel de l'odontogramme</caption>
            <thead>
              <tr>
                <th scope="col">FDI</th>
                <th scope="col">Denture</th>
                <th scope="col">Arcade</th>
                <th scope="col">Latéralité</th>
                <th scope="col">État</th>
                <th scope="col">Provenance</th>
                <th scope="col">Ressource</th>
              </tr>
            </thead>
            <tbody>
              {visibleTeeth.map((tooth) => (
                <tr key={tooth.fdi} data-selected={tooth.fdi === current?.fdi || undefined}>
                  <th scope="row">{tooth.fdi}</th>
                  <td>{tooth.dentition === "permanent" ? "Permanente" : "Temporaire"}</td>
                  <td>{tooth.arch === "maxillary" ? "Maxillaire" : "Mandibule"}</td>
                  <td>{toothLateralityLabel(tooth.fdi)}</td>
                  <td>{toothStatusConfig[tooth.status].label}</td>
                  <td>
                    <EvidenceBadge kind={tooth.evidence} />
                  </td>
                  <td>
                    <code>{tooth.resourceRef}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );

  return (
    <DentalPanel
      eyebrow="Parcours bucco-dentaire"
      title="Odontogramme longitudinal"
      description="La dent et la face restent sélectionnables, historisées et identifiables au clavier."
      className="od-panel--odontogram"
      dataMode={dataMode}
      presentation={presentation}
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        {content}
      </DentalStateBoundary>
    </DentalPanel>
  );
}
