import { useState } from "react";
import { DentalPanel, DentalStateBoundary, EvidenceBadge } from "./primitives";
import type { DentalStateProps, TimelineEvent } from "./types";

export interface OrthodonticWorkbenchProps extends DentalStateProps {
  events: TimelineEvent[];
  currentStep: number;
  totalSteps: number;
  overjetMm?: number;
  overbitePercent?: number;
}

export function OrthodonticWorkbench({
  events,
  currentStep,
  totalSteps,
  overjetMm,
  overbitePercent,
  state,
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: OrthodonticWorkbenchProps) {
  const [comparison, setComparison] = useState<"initial" | "current" | "projected">("current");
  const progress = Math.round((currentStep / totalSteps) * 100);
  const archTeeth = ["16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26"];
  return (
    <DentalPanel
      eyebrow="Orthodontie"
      title="Progression et jalons"
      description={`Étape ${currentStep} sur ${totalSteps} · progression ${progress} %`}
      className="od-panel--ortho"
      dataMode={dataMode}
      presentation={presentation}
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        <div className="od-ortho-measures">
          <div>
            <span>Surplomb</span>
            <strong>
              {overjetMm === undefined ? "Non renseigné" : `${overjetMm.toFixed(1)} mm`}
            </strong>
            {overjetMm === undefined ? null : <EvidenceBadge kind="observed" />}
          </div>
          <div>
            <span>Recouvrement</span>
            <strong>
              {overbitePercent === undefined ? "Non renseigné" : `${overbitePercent} %`}
            </strong>
            {overbitePercent === undefined ? null : <EvidenceBadge kind="observed" />}
          </div>
          <div>
            <span>Progression</span>
            <strong>{progress} %</strong>
            <EvidenceBadge kind="derived" />
          </div>
        </div>
        <div className="od-ortho-comparison">
          <fieldset className="od-view-switch">
            <legend className="od-sr-only">Comparer les positions dentaires</legend>
            {(["initial", "current", "projected"] as const).map((view) => (
              <button
                type="button"
                key={view}
                aria-pressed={comparison === view}
                onClick={() => setComparison(view)}
              >
                {view === "initial" ? "Initial" : view === "current" ? "Actuel" : "Projeté"}
              </button>
            ))}
          </fieldset>
          <div
            className="od-ortho-arch"
            data-view={comparison}
            role="img"
            aria-label={`Schéma ${comparison}`}
          >
            {archTeeth.map((tooth, index) => (
              <i
                key={tooth}
                style={{
                  transform: `translateY(${Math.abs(index - 5.5) * (comparison === "projected" ? 1.5 : comparison === "current" ? 2.5 : 4)}px) rotate(${(index - 5.5) * (comparison === "projected" ? 1 : 2)}deg)`,
                }}
              />
            ))}
            <span>
              {comparison === "initial"
                ? "Position initiale"
                : comparison === "current"
                  ? "Position observée"
                  : "Position projetée"}
            </span>
          </div>
        </div>
        <ol className="od-ortho-events">
          {events.map((event) => (
            <li key={event.id} data-status={event.status}>
              <time dateTime={event.date}>{event.date}</time>
              <span aria-hidden="true">
                {event.status === "completed" ? "✓" : event.status === "current" ? "●" : "◌"}
              </span>
              <div>
                <strong>{event.title}</strong>
                <p>{event.detail}</p>
              </div>
              <EvidenceBadge kind={event.evidence} />
            </li>
          ))}
        </ol>
        <details className="od-table-alternative">
          <summary>Alternative tabulaire de la comparaison orthodontique</summary>
          <div className="od-table-scroll">
            <table>
              <caption>Position relative des dents maxillaires dans les trois états</caption>
              <thead>
                <tr>
                  <th scope="col">Dent FDI</th>
                  <th scope="col">Initiale</th>
                  <th scope="col">Actuelle</th>
                  <th scope="col">Projetée</th>
                </tr>
              </thead>
              <tbody>
                {archTeeth.map((tooth, index) => {
                  const distance = Math.abs(index - 5.5);
                  return (
                    <tr key={tooth}>
                      <th scope="row">{tooth}</th>
                      <td>
                        Décalage relatif {Math.round(distance * 4)} px · rotation{" "}
                        {Math.round((index - 5.5) * 2)}°
                      </td>
                      <td>
                        Décalage relatif {Math.round(distance * 2.5)} px · rotation{" "}
                        {Math.round((index - 5.5) * 2)}°
                      </td>
                      <td>
                        Décalage relatif {Math.round(distance * 1.5)} px · rotation{" "}
                        {Math.round(index - 5.5)}°
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      </DentalStateBoundary>
    </DentalPanel>
  );
}
