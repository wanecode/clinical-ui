import { conceptLabel, extensionBySuffix, formatClinicalDate } from "./fhir-utils";
import {
  DermatologyStateSurface,
  PanelHeading,
  ReportStatus,
  SectionFrame,
  SyntheticBadge,
} from "./shared";
import type { DermatologyProcedure, DermatologyStateProps } from "./types";

export interface DermatologyProcedureTimelineProps extends DermatologyStateProps {
  procedures: DermatologyProcedure[];
  onAddProcedure?: () => void;
}

export function DermatologyProcedureTimeline({
  procedures,
  onAddProcedure,
  state = "ready",
  stateMessage,
}: DermatologyProcedureTimelineProps) {
  const ordered = [...procedures].sort((a, b) =>
    (a.occurrenceDateTime ?? "").localeCompare(b.occurrenceDateTime ?? ""),
  );
  const resolvedState = state === "ready" && procedures.length === 0 ? "empty" : state;

  return (
    <SectionFrame className="derm-procedures" label="Chronologie des procédures dermatologiques">
      <PanelHeading
        eyebrow="Actes & procédures"
        title="Chronologie procédurale"
        description="Versions préliminaires, amendements et validations restent visibles."
        action={<SyntheticBadge />}
      />
      <DermatologyStateSurface state={resolvedState} message={stateMessage} compact>
        <ol className="derm-procedure-list">
          {ordered.map((procedure, index) => {
            const reportStatus = extensionBySuffix(
              procedure.extension,
              "/report-status",
            )?.valueCode;
            return (
              <li key={procedure.id}>
                <div className="derm-procedure-list__date">
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <time dateTime={procedure.occurrenceDateTime}>
                    {formatClinicalDate(procedure.occurrenceDateTime)}
                  </time>
                </div>
                <div className="derm-procedure-list__content">
                  <div>
                    <h3>{conceptLabel(procedure.code)}</h3>
                    <ReportStatus status={reportStatus ?? procedure.status} />
                  </div>
                  <dl>
                    <div>
                      <dt>Statut FHIR</dt>
                      <dd>{procedure.status}</dd>
                    </div>
                    <div>
                      <dt>Opérateur</dt>
                      <dd>{procedure.performer?.[0]?.actor.display ?? "Non renseigné"}</dd>
                    </div>
                    <div>
                      <dt>Ressource</dt>
                      <dd>
                        <code>Procedure/{procedure.id}</code>
                      </dd>
                    </div>
                  </dl>
                  {procedure.note?.map((note) => (
                    <p key={note.text}>{note.text}</p>
                  ))}
                  {reportStatus === "amended" ? (
                    <div className="derm-amendment-note">
                      <span aria-hidden="true">↺</span>
                      Amendé le{" "}
                      {formatClinicalDate(
                        extensionBySuffix(procedure.extension, "/amended-at")?.valueDateTime,
                      )}
                      . La version antérieure reste traçable dans l’historique FHIR.
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
        <button type="button" className="derm-button derm-button--primary" onClick={onAddProcedure}>
          Ajouter une procédure
        </button>
      </DermatologyStateSurface>
    </SectionFrame>
  );
}
