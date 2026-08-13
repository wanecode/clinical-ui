import { useState } from "react";
import { AccessibleTrajectory } from "./accessible-trajectory";
import {
  EyeLabel,
  Metric,
  OphthalmologyDataBoundary,
  OphthalmologyPanel,
  OphthalmologyWorkbenchHeader,
} from "./primitives";
import type {
  ClinicalDataState,
  CorneaData,
  OphthalmologyDataMode,
  OphthalmologyPresentation,
} from "./types";

export interface CorneaWorkbenchProps {
  data: CorneaData;
  state?: ClinicalDataState;
  dataMode?: OphthalmologyDataMode;
  presentation?: OphthalmologyPresentation;
}

export function CorneaWorkbench({
  data,
  state = "ready",
  dataMode = "clinical",
  presentation = "standalone",
}: CorneaWorkbenchProps) {
  const [selectedZone, setSelectedZone] = useState(0);
  const zone = data.map[selectedZone];
  return (
    <OphthalmologyDataBoundary state={state} label="Cornée et surface oculaire">
      <article className="oph-workbench oph-cornea" data-presentation={presentation}>
        <OphthalmologyWorkbenchHeader
          kicker="Cornée & surface"
          title="Topographie en contexte"
          description="La carte, ses mesures et sa trajectoire restent lisibles ensemble."
          dataMode={dataMode}
          presentation={presentation}
          actions={<EyeLabel eye={data.eye} long />}
        />
        <div className="oph-cornea__layout">
          <OphthalmologyPanel title="Carte kératométrique" eyebrow="Synthèse topographique">
            {data.map.length ? (
              <>
                <div className="oph-cornea-map-layout">
                  <div
                    className="oph-cornea-map"
                    role="listbox"
                    aria-label="Zones de la carte cornéenne"
                  >
                    {data.map.map((point, index) => (
                      <button
                        key={point.zone}
                        type="button"
                        role="option"
                        aria-selected={selectedZone === index}
                        data-zone={index}
                        onClick={() => setSelectedZone(index)}
                        aria-label={`${point.zone}, ${point.value} dioptries, ${point.interpretation}`}
                      >
                        <span>{index + 1}</span>
                      </button>
                    ))}
                    <i
                      className="oph-cornea-map__ring oph-cornea-map__ring--outer"
                      aria-hidden="true"
                    />
                    <i
                      className="oph-cornea-map__ring oph-cornea-map__ring--inner"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="oph-cornea-map__inspector" aria-live="polite">
                    <span>Zone sélectionnée</span>
                    <strong>{zone?.zone ?? "Aucune"}</strong>
                    <b>{zone?.value.toFixed(1) ?? "—"} D</b>
                    <small>{zone?.interpretation}</small>
                  </div>
                </div>
                <div className="oph-table-wrap">
                  <table className="oph-table">
                    <caption>Alternative tabulaire de la carte cornéenne</caption>
                    <thead>
                      <tr>
                        <th>Zone</th>
                        <th>K</th>
                        <th>Interprétation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map.map((point) => (
                        <tr key={point.zone}>
                          <th scope="row">{point.zone}</th>
                          <td>{point.value.toFixed(1)} D</td>
                          <td>{point.interpretation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="oph-structured-empty" role="status">
                <strong>Carte topographique non transmise</strong>
                <span>
                  Les mesures disponibles restent affichées sans générer de carte de substitution.
                </span>
              </div>
            )}
          </OphthalmologyPanel>
          <div className="oph-cornea__side">
            <OphthalmologyPanel title="Mesures" eyebrow="Kératométrie">
              <dl className="oph-metric-grid">
                <Metric label="Kmax" value={data.kmax?.toFixed(1)} unit="D" />
                <Metric label="K1" value={data.k1?.toFixed(1)} unit="D" />
                <Metric label="K2" value={data.k2?.toFixed(1)} unit="D" />
                <Metric label="Axe" value={data.axis} unit="°" />
                <Metric label="Point le plus fin" value={data.thinnest} unit="µm" />
              </dl>
            </OphthalmologyPanel>
            <OphthalmologyPanel title="Surface & lentille" eyebrow="Parcours thérapeutique">
              <dl className="oph-metric-grid">
                <Metric label="Score symptomatique" value={data.dryEyeScore} unit="/ 100" />
                <Metric label="Lentille" value={data.lensStatus} />
              </dl>
            </OphthalmologyPanel>
          </div>
        </div>
        <OphthalmologyPanel title="Trajectoire cornéenne" eyebrow="Observations longitudinales">
          {data.trajectory.length ? (
            <AccessibleTrajectory
              points={data.trajectory}
              label={data.trajectoryLabel ?? "Évolution du point cornéen le plus fin"}
              unit={data.trajectoryUnit ?? "µm"}
            />
          ) : (
            <div className="oph-structured-empty" role="status">
              <strong>Trajectoire non calculable</strong>
              <span>Au moins deux mesures comparables sont nécessaires.</span>
            </div>
          )}
        </OphthalmologyPanel>
        {data.source ? (
          <p className="oph-source-line">
            <span>Source</span>
            <code>{data.source}</code>
          </p>
        ) : null}
      </article>
    </OphthalmologyDataBoundary>
  );
}
