import { type KeyboardEvent, useId, useMemo, useState } from "react";
import { conceptLabel, extensionBySuffix, lesionId, lesionPlacement } from "./fhir-utils";
import { DermatologyStateSurface, PanelHeading, SectionFrame, SyntheticBadge } from "./shared";
import type {
  BodyMapView,
  DermatologyBodyStructure,
  DermatologyStateProps,
  LesionPlacement,
} from "./types";

const viewLabels: Record<BodyMapView, string> = {
  anterior: "Antérieure",
  posterior: "Postérieure",
  "left-lateral": "Latérale gauche",
  "right-lateral": "Latérale droite",
};

function BodyDiagram({ view }: { view: BodyMapView }) {
  const isLateral = view.includes("lateral");
  return (
    <svg
      className="derm-body-diagram"
      viewBox="0 0 280 520"
      role="img"
      aria-label={`Schéma corporel abstrait, vue ${viewLabels[view].toLowerCase()}`}
    >
      <title>Repère corporel non photographique</title>
      <desc>
        Silhouette abstraite entièrement vêtue utilisée uniquement pour le repérage clinique.
      </desc>
      <line x1="18" y1="48" x2="262" y2="48" className="derm-body-grid" />
      <line x1="18" y1="250" x2="262" y2="250" className="derm-body-grid" />
      <line x1="18" y1="450" x2="262" y2="450" className="derm-body-grid" />
      <circle cx={isLateral ? 145 : 140} cy="63" r="35" className="derm-body-shape" />
      <path
        className="derm-body-shape"
        d={
          isLateral
            ? "M125 99 C100 118 103 165 111 211 L117 281 L101 350 L108 485 L145 485 L149 350 L154 281 L168 205 C177 153 171 111 150 99 Z"
            : "M102 99 C76 114 70 145 68 211 L76 281 L103 278 L99 485 L134 485 L140 310 L146 485 L181 485 L177 278 L204 281 L212 211 C210 145 204 114 178 99 Z"
        }
      />
      <path
        d={isLateral ? "M126 103 L151 103" : "M102 104 Q140 128 178 104"}
        className="derm-body-seam"
      />
      <path d={isLateral ? "M116 282 L153 282" : "M76 279 L204 279"} className="derm-body-seam" />
      <text x="18" y="30" className="derm-body-caption">
        {viewLabels[view].toUpperCase()}
      </text>
    </svg>
  );
}

interface MarkerCluster {
  key: string;
  x: number;
  y: number;
  lesions: DermatologyBodyStructure[];
}

function clusterLesions(lesions: DermatologyBodyStructure[]) {
  const clusters = new Map<string, MarkerCluster>();
  for (const lesion of lesions) {
    const placement = lesionPlacement(lesion);
    const key = `${Math.round(placement.x * 12)}-${Math.round(placement.y * 12)}`;
    const current = clusters.get(key);
    if (current) current.lesions.push(lesion);
    else clusters.set(key, { key, x: placement.x, y: placement.y, lesions: [lesion] });
  }
  return [...clusters.values()];
}

export interface BodyLesionMapProps extends DermatologyStateProps {
  lesions: DermatologyBodyStructure[];
  selectedLesionId?: string;
  initialView?: BodyMapView;
  onSelectLesion?: (lesion: DermatologyBodyStructure) => void;
  onPlaceLesion?: (placement: LesionPlacement) => void;
}

export function BodyLesionMap({
  lesions,
  selectedLesionId,
  initialView = "anterior",
  onSelectLesion,
  onPlaceLesion,
  state = "ready",
  stateMessage,
}: BodyLesionMapProps) {
  const [view, setView] = useState<BodyMapView>(initialView);
  const [zoom, setZoom] = useState(1);
  const [placement, setPlacement] = useState({ x: 0.5, y: 0.5 });
  const [placing, setPlacing] = useState(false);
  const instructionsId = useId();
  const visibleLesions = useMemo(
    () => lesions.filter((lesion) => lesionPlacement(lesion).view === view),
    [lesions, view],
  );
  const clusters = useMemo(() => clusterLesions(visibleLesions), [visibleLesions]);
  const resolvedState = state === "ready" && lesions.length === 0 ? "empty" : state;

  function handleMapKeyDown(event: KeyboardEvent<HTMLFieldSetElement>) {
    if (!placing) return;
    const delta = event.shiftKey ? 0.05 : 0.015;
    const next = { ...placement };
    if (event.key === "ArrowLeft") next.x = Math.max(0.08, next.x - delta);
    else if (event.key === "ArrowRight") next.x = Math.min(0.92, next.x + delta);
    else if (event.key === "ArrowUp") next.y = Math.max(0.08, next.y - delta);
    else if (event.key === "ArrowDown") next.y = Math.min(0.92, next.y + delta);
    else if (event.key === "Enter") {
      event.preventDefault();
      onPlaceLesion?.({ view, ...placement });
      setPlacing(false);
      return;
    } else if (event.key === "Escape") {
      event.preventDefault();
      setPlacing(false);
      return;
    } else return;
    event.preventDefault();
    setPlacement(next);
  }

  return (
    <SectionFrame className="derm-body-map" label="Carte lésionnelle corporelle">
      <PanelHeading
        eyebrow="Identité spatiale persistante"
        title="Carte lésionnelle"
        description="Repérage codé FHIR R5, regroupement et liste textuelle équivalente."
        action={<SyntheticBadge />}
      />
      <DermatologyStateSurface state={resolvedState} message={stateMessage}>
        <div className="derm-body-map__toolbar">
          <fieldset className="derm-segmented">
            <legend className="derm-sr-only">Vues anatomiques</legend>
            {(Object.keys(viewLabels) as BodyMapView[]).map((candidate) => (
              <button
                key={candidate}
                type="button"
                aria-pressed={candidate === view}
                onClick={() => setView(candidate)}
              >
                {viewLabels[candidate]}
              </button>
            ))}
          </fieldset>
          <fieldset className="derm-map-zoom">
            <legend className="derm-sr-only">Zoom de la carte</legend>
            <button
              type="button"
              aria-label="Réduire le zoom"
              onClick={() => setZoom((value) => Math.max(0.8, value - 0.2))}
            >
              −
            </button>
            <output aria-live="polite">{Math.round(zoom * 100)} %</output>
            <button
              type="button"
              aria-label="Augmenter le zoom"
              onClick={() => setZoom((value) => Math.min(1.6, value + 0.2))}
            >
              +
            </button>
            <button type="button" onClick={() => setZoom(1)}>
              Réinitialiser
            </button>
          </fieldset>
        </div>

        <div className="derm-body-map__layout">
          <fieldset
            className="derm-map-canvas"
            tabIndex={placing ? 0 : -1}
            onKeyDown={handleMapKeyDown}
            aria-describedby={instructionsId}
            data-placing={placing || undefined}
          >
            <legend className="derm-sr-only">Zone de placement lésionnel au clavier</legend>
            <div className="derm-map-canvas__scaled" style={{ transform: `scale(${zoom})` }}>
              <BodyDiagram view={view} />
              {clusters.map((cluster) => {
                const selected = cluster.lesions.some((lesion) => lesion.id === selectedLesionId);
                const markerLabel = cluster.lesions.map(lesionId).join(", ");
                return (
                  <button
                    type="button"
                    key={cluster.key}
                    className="derm-lesion-marker"
                    data-selected={selected || undefined}
                    style={{ left: `${cluster.x * 100}%`, top: `${cluster.y * 100}%` }}
                    aria-label={
                      cluster.lesions.length > 1
                        ? `Groupe de ${cluster.lesions.length} lésions : ${markerLabel}`
                        : `Sélectionner ${markerLabel}`
                    }
                    onClick={() => onSelectLesion?.(cluster.lesions[0] as DermatologyBodyStructure)}
                  >
                    {cluster.lesions.length > 1 ? cluster.lesions.length : "•"}
                  </button>
                );
              })}
              {placing ? (
                <span
                  className="derm-placement-cursor"
                  style={{ left: `${placement.x * 100}%`, top: `${placement.y * 100}%` }}
                  aria-hidden="true"
                >
                  +
                </span>
              ) : null}
            </div>
          </fieldset>

          <aside className="derm-lesion-registry" aria-label="Liste textuelle des lésions">
            <div className="derm-lesion-registry__heading">
              <div>
                <span>Vue {viewLabels[view].toLowerCase()}</span>
                <strong>{visibleLesions.length} lésion(s)</strong>
              </div>
              <button
                type="button"
                className="derm-button derm-button--primary"
                aria-pressed={placing}
                onClick={() => setPlacing((value) => !value)}
              >
                {placing ? "Annuler le placement" : "Placer au clavier"}
              </button>
            </div>
            <p id={instructionsId} className="derm-keyboard-hint">
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              <kbd>←</kbd>
              <kbd>→</kbd> déplacer · <kbd>Maj</kbd> pas large ·<kbd>Entrée</kbd> confirmer ·{" "}
              <kbd>Échap</kbd> annuler
            </p>
            <div className="derm-table-wrap">
              <table>
                <caption className="derm-sr-only">Lésions visibles et repères anatomiques</caption>
                <thead>
                  <tr>
                    <th scope="col">Lésion</th>
                    <th scope="col">Site codé</th>
                    <th scope="col">Repère</th>
                    <th scope="col">État</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleLesions.map((lesion) => (
                    <tr key={lesion.id} data-selected={lesion.id === selectedLesionId || undefined}>
                      <th scope="row">
                        <button type="button" onClick={() => onSelectLesion?.(lesion)}>
                          {lesionId(lesion)}
                        </button>
                      </th>
                      <td>{conceptLabel(lesion.includedStructure[0]?.structure)}</td>
                      <td>
                        {extensionBySuffix(lesion.extension, "/anatomical-landmark")?.valueString ??
                          "Non renseigné"}
                      </td>
                      <td>{lesion.active === false ? "Historique" : "Active"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </DermatologyStateSurface>
    </SectionFrame>
  );
}
