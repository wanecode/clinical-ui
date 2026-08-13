import { useState } from "react";
import { EntStatePanel, EntWorkbenchFrame, Metric, SourceLine } from "./common";
import type {
  EndoscopeTraceabilityRecord,
  EntDisplayState,
  EntHostPresentationProps,
} from "./types";

export interface EndoscopeTraceabilityProps extends EntHostPresentationProps {
  record: EndoscopeTraceabilityRecord;
  state?: EntDisplayState;
}

export function EndoscopeTraceability({
  record,
  state = "ready",
  dataMode = "clinical",
  presentation = "standalone",
}: EndoscopeTraceabilityProps) {
  const [showAudit, setShowAudit] = useState(false);
  const released =
    record.leakTest === "passed" &&
    record.cleaning === "complete" &&
    record.disinfection === "released";
  return (
    <EntWorkbenchFrame
      dataMode={dataMode}
      presentation={presentation}
      title="Traçabilité de l’endoscope"
      eyebrow="Désinfection et mise à disposition"
      description="Chaîne de retraitement liée sans ambiguïté au dispositif et à la procédure."
      status={released ? "Libéré" : "Non libéré"}
      statusTone={released ? "success" : "warning"}
      actions={
        <button
          type="button"
          className="ent-button ent-button--quiet"
          aria-expanded={showAudit}
          onClick={() => setShowAudit((current) => !current)}
        >
          {showAudit ? "Masquer" : "Voir"} la piste d’audit
        </button>
      }
    >
      {state !== "ready" ? (
        <EntStatePanel state={state} />
      ) : (
        <div className="ent-traceability">
          <section className="ent-traceability__identity">
            <p className="ent-eyebrow">Dispositif</p>
            <strong>{record.scopeIdentifier}</strong>
            <SourceLine reference={record.procedureReference} />
          </section>
          <ol className="ent-process" aria-label="Étapes de retraitement">
            <li data-status={record.leakTest === "passed" ? "complete" : "incomplete"}>
              <span>01</span>
              <div>
                <strong>Test d’étanchéité</strong>
                <small>
                  {record.leakTest === "passed"
                    ? "Réussi"
                    : record.leakTest === "failed"
                      ? "Échec"
                      : "Non enregistré"}
                </small>
              </div>
            </li>
            <li data-status={record.cleaning === "complete" ? "complete" : "incomplete"}>
              <span>02</span>
              <div>
                <strong>Nettoyage</strong>
                <small>{record.cleaning === "complete" ? "Complet" : "Incomplet"}</small>
              </div>
            </li>
            <li data-status={record.disinfection === "released" ? "complete" : "incomplete"}>
              <span>03</span>
              <div>
                <strong>Désinfection</strong>
                <small>
                  {record.disinfection === "released"
                    ? "Cycle libéré"
                    : record.disinfection === "quarantined"
                      ? "Quarantaine"
                      : "En attente"}
                </small>
              </div>
            </li>
            <li data-status={record.vigilanceAcknowledged ? "complete" : "incomplete"}>
              <span>04</span>
              <div>
                <strong>Vigilance</strong>
                <small>{record.vigilanceAcknowledged ? "Acquittée" : "À relire"}</small>
              </div>
            </li>
          </ol>
          <dl className="ent-metric-grid ent-metric-grid--four">
            <Metric label="Cycle" value={record.cycleIdentifier} />
            <Metric label="Opérateur" value={record.operator ?? "Non consigné"} />
            <Metric label="Libéré le" value={record.releasedAt ?? "Non libéré"} />
            <Metric label="État final" value={released ? "Disponible" : "Bloqué"} />
          </dl>
          {showAudit ? (
            <div className="ent-audit" aria-live="polite">
              <strong>
                {dataMode === "synthetic" ? "Piste d’audit synthétique" : "Piste d’audit"}
              </strong>
              <code>
                {record.cycleIdentifier} → {record.scopeIdentifier} → {record.procedureReference}
              </code>
              {dataMode === "synthetic" ? (
                <span>
                  Les identifiants sont synthétiques et ne correspondent à aucun dispositif réel.
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </EntWorkbenchFrame>
  );
}
