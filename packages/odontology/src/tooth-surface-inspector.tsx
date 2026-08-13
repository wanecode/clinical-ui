import { useState } from "react";
import {
  DentalPanel,
  DentalStateBoundary,
  EvidenceBadge,
  SyntheticFlag,
  ToothStatusBadge,
  toothLateralityLabel,
  toothStatusConfig,
} from "./primitives";
import type { DentalStateProps, ToothRecord, ToothStatus, ToothSurface } from "./types";

const surfaceLabels: Record<ToothSurface, string> = {
  occlusal: "Occlusale",
  mesial: "Mésiale",
  distal: "Distale",
  buccal: "Vestibulaire",
  lingual: "Linguale / palatine",
};

export interface ToothSurfaceInspectorProps extends DentalStateProps {
  tooth: ToothRecord;
  selectedSurface?: ToothSurface;
  onSurfaceChange?: (surface: ToothSurface) => void;
}

export function ToothSurfaceInspector({
  tooth,
  selectedSurface = "occlusal",
  onSurfaceChange,
  state,
  stateMessage,
}: ToothSurfaceInspectorProps) {
  const [activeSurface, setActiveSurface] = useState(selectedSurface);
  const surfaceStatus = (surface: ToothSurface): ToothStatus =>
    tooth.surfaces?.[surface] ?? tooth.status;
  const select = (surface: ToothSurface) => {
    setActiveSurface(surface);
    onSurfaceChange?.(surface);
  };

  return (
    <DentalPanel
      eyebrow={`Dent ${tooth.fdi} · notation FDI`}
      title="Inspecteur des faces"
      description="Vue topologique et équivalent tabulaire de chaque face dentaire."
      actions={<SyntheticFlag />}
      className="od-panel--surface"
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        <div className="od-surface-inspector">
          <fieldset className="od-surface-map">
            <legend className="od-sr-only">Faces de la dent {tooth.fdi}</legend>
            {(Object.keys(surfaceLabels) as ToothSurface[]).map((surface) => {
              const status = surfaceStatus(surface);
              return (
                <button
                  key={surface}
                  type="button"
                  className="od-surface"
                  data-surface={surface}
                  data-tooth-status={status}
                  aria-pressed={activeSurface === surface}
                  aria-label={`${surfaceLabels[surface]} — ${toothStatusConfig[status].label}`}
                  onClick={() => select(surface)}
                >
                  <span aria-hidden="true">{toothStatusConfig[status].symbol}</span>
                  <small>{surfaceLabels[surface]}</small>
                  <em>{toothStatusConfig[status].label}</em>
                </button>
              );
            })}
          </fieldset>

          <div className="od-surface-detail" aria-live="polite">
            <p className="od-eyebrow">Face sélectionnée</p>
            <h3>{surfaceLabels[activeSurface]}</h3>
            <div className="od-inspector-summary">
              <ToothStatusBadge status={surfaceStatus(activeSurface)} />
              <EvidenceBadge kind={tooth.evidence} />
            </div>
            <dl>
              <div>
                <dt>Dent</dt>
                <dd>
                  {tooth.fdi} · {tooth.label}
                </dd>
              </div>
              <div>
                <dt>Arcade</dt>
                <dd>{toothLateralityLabel(tooth.fdi)}</dd>
              </div>
              <div>
                <dt>Denture</dt>
                <dd>{tooth.dentition === "permanent" ? "Permanente" : "Temporaire"}</dd>
              </div>
              <div>
                <dt>Ressource</dt>
                <dd>
                  <code>{tooth.resourceRef}</code>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <details className="od-table-alternative">
          <summary>Alternative textuelle des faces</summary>
          <table>
            <caption>État de chaque face de la dent {tooth.fdi}</caption>
            <thead>
              <tr>
                <th scope="col">Face</th>
                <th scope="col">Symbole</th>
                <th scope="col">État</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(surfaceLabels) as ToothSurface[]).map((surface) => {
                const status = surfaceStatus(surface);
                return (
                  <tr key={surface} data-selected={surface === activeSurface || undefined}>
                    <th scope="row">{surfaceLabels[surface]}</th>
                    <td aria-hidden="true">{toothStatusConfig[status].symbol}</td>
                    <td>{toothStatusConfig[status].label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </details>
      </DentalStateBoundary>
    </DentalPanel>
  );
}
