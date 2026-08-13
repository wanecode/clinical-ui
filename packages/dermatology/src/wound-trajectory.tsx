import { useId } from "react";
import { formatClinicalDate, observationOrigin, observationValue } from "./fhir-utils";
import {
  DataOriginBadge,
  DermatologyStateSurface,
  PanelHeading,
  SectionFrame,
  SyntheticBadge,
} from "./shared";
import type { DermatologyObservation, DermatologyStateProps } from "./types";

export interface WoundTrajectoryProps extends DermatologyStateProps {
  observations: DermatologyObservation[];
  targetValue?: number;
}

export function WoundTrajectory({
  observations,
  targetValue = 2,
  state = "ready",
  stateMessage,
}: WoundTrajectoryProps) {
  const chartTitleId = useId();
  const ordered = [...observations]
    .filter((observation) => observation.valueQuantity?.value !== undefined)
    .sort((a, b) => (a.effectiveDateTime ?? "").localeCompare(b.effectiveDateTime ?? ""));
  const resolvedState = state === "ready" && ordered.length === 0 ? "empty" : state;
  const values = ordered.map((observation) => observation.valueQuantity?.value ?? 0);
  const max = Math.max(...values, 1);
  const points = ordered.map((observation, index) => ({
    observation,
    x: ordered.length === 1 ? 50 : 10 + (index / (ordered.length - 1)) * 80,
    y: 88 - ((observation.valueQuantity?.value ?? 0) / max) * 70,
  }));
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const initial = values[0];
  const latestObserved = [...ordered]
    .reverse()
    .find((observation) => observationOrigin(observation) !== "projected");
  const reduction =
    initial !== undefined && latestObserved?.valueQuantity?.value !== undefined && initial !== 0
      ? ((initial - latestObserved.valueQuantity.value) / initial) * 100
      : undefined;

  return (
    <SectionFrame className="derm-wound" label="Trajectoire de plaie">
      <PanelHeading
        eyebrow="Plaies, brûlures et cicatrisation"
        title="Trajectoire de surface"
        description="Mesures observées, valeurs dérivées et projection clairement distinguées."
        action={<SyntheticBadge />}
      />
      <DermatologyStateSurface state={resolvedState} message={stateMessage}>
        <div className="derm-wound__summary">
          <div>
            <span>Réduction observée</span>
            <strong>
              {reduction === undefined
                ? "Non calculable"
                : `${reduction.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`}
            </strong>
          </div>
          <div>
            <span>Dernière surface</span>
            <strong>{latestObserved ? observationValue(latestObserved) : "Non renseignée"}</strong>
          </div>
          <div>
            <span>Objectif</span>
            <strong>≤ {targetValue.toLocaleString("fr-FR")} cm²</strong>
          </div>
        </div>

        <div className="derm-wound__layout">
          <figure className="derm-chart-card" aria-labelledby={chartTitleId}>
            <figcaption id={chartTitleId}>
              Évolution datée de la surface de la plaie, en centimètres carrés
            </figcaption>
            <svg viewBox="0 0 100 100" role="img" aria-labelledby={chartTitleId}>
              <title>Courbe de surface de plaie au fil des visites</title>
              <line x1="10" y1="88" x2="94" y2="88" className="derm-chart-axis" />
              <line x1="10" y1="12" x2="10" y2="88" className="derm-chart-axis" />
              {[18, 36, 54, 72].map((y) => (
                <line key={y} x1="10" y1={y} x2="94" y2={y} className="derm-chart-grid" />
              ))}
              <path d={path} className="derm-chart-line" />
              {points.map(({ observation, x, y }) => {
                const origin = observationOrigin(observation);
                return (
                  <g key={observation.id} data-origin={origin}>
                    {origin === "projected" ? (
                      <path
                        d={`M ${x} ${y - 3} L ${x + 3} ${y} L ${x} ${y + 3} L ${x - 3} ${y} Z`}
                        className="derm-chart-point"
                      />
                    ) : origin === "derived" ? (
                      <rect
                        x={x - 2.5}
                        y={y - 2.5}
                        width="5"
                        height="5"
                        className="derm-chart-point"
                      />
                    ) : (
                      <circle cx={x} cy={y} r="2.6" className="derm-chart-point" />
                    )}
                    <text x={x} y={Math.max(9, y - 6)} className="derm-chart-value">
                      {observation.valueQuantity?.value}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="derm-chart-legend">
              <DataOriginBadge origin="observed" />
              <DataOriginBadge origin="derived" />
              <DataOriginBadge origin="projected" />
            </div>
          </figure>

          <div className="derm-table-wrap">
            <table>
              <caption>Valeurs exactes de la trajectoire</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Surface</th>
                  <th scope="col">Nature</th>
                  <th scope="col">Statut</th>
                </tr>
              </thead>
              <tbody>
                {ordered.map((observation) => (
                  <tr key={observation.id}>
                    <td>{formatClinicalDate(observation.effectiveDateTime)}</td>
                    <td>
                      <strong>{observationValue(observation)}</strong>
                    </td>
                    <td>
                      <DataOriginBadge origin={observationOrigin(observation)} />
                    </td>
                    <td>{observation.status === "final" ? "Validé" : "Préliminaire"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="derm-clinical-note">
          <span aria-hidden="true">i</span>
          Tendance synthétique favorable. La projection n’est pas une observation clinique et doit
          être confirmée lors de la visite prévue.
        </p>
      </DermatologyStateSurface>
    </SectionFrame>
  );
}
