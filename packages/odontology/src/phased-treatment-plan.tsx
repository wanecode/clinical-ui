import { useState } from "react";
import { DentalPanel, DentalStateBoundary, EvidenceBadge, SessionStatusBadge } from "./primitives";
import type { DentalStateProps, TreatmentPhase, TreatmentSessionStatus } from "./types";

export interface PhasedTreatmentPlanProps extends DentalStateProps {
  phases: TreatmentPhase[];
  consent: "obtained" | "required" | "withdrawn";
  consentResourceRef?: string;
  onSessionStatusChange?: (sessionId: string, status: TreatmentSessionStatus) => void;
}

export function PhasedTreatmentPlan({
  phases,
  consent,
  consentResourceRef,
  onSessionStatusChange,
  state,
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: PhasedTreatmentPlanProps) {
  const [statuses, setStatuses] = useState<Record<string, TreatmentSessionStatus>>({});
  const consentConfig = {
    obtained: { symbol: "✓", label: "Consentement obtenu" },
    required: { symbol: "!", label: "Consentement requis" },
    withdrawn: { symbol: "×", label: "Consentement retiré" },
  }[consent];
  const allSessions = phases.flatMap((phase) => phase.sessions);
  const setStatus = (sessionId: string, status: TreatmentSessionStatus) => {
    setStatuses((current) => ({ ...current, [sessionId]: status }));
    onSessionStatusChange?.(sessionId, status);
  };

  return (
    <DentalPanel
      eyebrow="Plan de traitement"
      title="Parcours phasé et dépendances"
      description="Chaque séance conserve son statut, ses prérequis et son consentement associé."
      className="od-panel--treatment"
      dataMode={dataMode}
      presentation={presentation}
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        <div
          className="od-consent"
          data-consent={consent}
          role={consent === "required" ? "alert" : "status"}
        >
          <span aria-hidden="true">{consentConfig.symbol}</span>
          <div>
            <strong>{consentConfig.label}</strong>
            {consentResourceRef ? <code>{consentResourceRef}</code> : null}
          </div>
        </div>

        <ol className="od-phases">
          {phases.map((phase) => (
            <li key={phase.id} className="od-phase">
              <div className="od-phase__marker" aria-hidden="true">
                {phase.number}
              </div>
              <header>
                <p>Phase {phase.number}</p>
                <h3>{phase.title}</h3>
                <span>{phase.objective}</span>
              </header>
              <ol className="od-sessions">
                {phase.sessions.map((session) => {
                  const status = statuses[session.id] ?? session.status;
                  const dependencies = session.dependsOn?.map(
                    (id) => allSessions.find((item) => item.id === id)?.title ?? id,
                  );
                  return (
                    <li key={session.id}>
                      <div className="od-session__main">
                        <SessionStatusBadge status={status} />
                        <div>
                          <strong>
                            {session.tooth ? `${session.tooth} · ` : ""}
                            {session.title}
                          </strong>
                          {session.date ? (
                            <time dateTime={session.date}>{session.date}</time>
                          ) : null}
                        </div>
                        <EvidenceBadge kind={session.evidence} />
                      </div>
                      {dependencies?.length ? (
                        <p className="od-dependencies">
                          <span aria-hidden="true">↳</span> Dépend de : {dependencies.join(", ")}
                        </p>
                      ) : null}
                      <code>{session.resourceRef}</code>
                      <label className="od-session__status-control">
                        <span>Mettre à jour le statut</span>
                        <select
                          value={status}
                          onChange={(event) =>
                            setStatus(
                              session.id,
                              event.currentTarget.value as TreatmentSessionStatus,
                            )
                          }
                        >
                          <option value="planned">Planifiée</option>
                          <option value="in-progress">En cours</option>
                          <option value="completed">Réalisée</option>
                          <option value="postponed">Reportée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </label>
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </ol>
      </DentalStateBoundary>
    </DentalPanel>
  );
}
