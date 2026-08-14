import {
  conceptLabel,
  extensionBySuffix,
  formatClinicalDate,
  observationValue,
} from "./fhir-utils";
import {
  DataOriginBadge,
  DermatologyStateSurface,
  PanelHeading,
  SectionFrame,
  SyntheticBadge,
} from "./shared";
import type {
  DermatologyMedicationRequest,
  DermatologyObservation,
  DermatologyStateProps,
} from "./types";

function medicationLabel(medication: DermatologyMedicationRequest["medication"]) {
  if (medication.concept) return conceptLabel(medication.concept);
  return (
    medication.reference?.display ?? medication.reference?.reference ?? "Médicament non renseigné"
  );
}

export interface TreatmentSafetyPanelProps extends DermatologyStateProps {
  treatments: DermatologyMedicationRequest[];
  monitoring: DermatologyObservation[];
  asOf?: string;
  onPlanMonitoring?: (treatment: DermatologyMedicationRequest) => void;
}

export function TreatmentSafetyPanel({
  treatments,
  monitoring,
  asOf,
  onPlanMonitoring,
  state = "ready",
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: TreatmentSafetyPanelProps) {
  const resolvedState = state === "ready" && treatments.length === 0 ? "empty" : state;
  const effectiveAsOf = asOf ?? (dataMode === "synthetic" ? "2026-08-12T10:15:00Z" : undefined);

  return (
    <SectionFrame
      className="derm-treatment"
      label="Sécurité thérapeutique"
      dataMode={dataMode}
      presentation={presentation}
    >
      <PanelHeading
        eyebrow="Traitements & surveillance"
        title="Sécurité thérapeutique"
        description="Échéances biologiques reliées à chaque MedicationRequest FHIR R5."
        action={<SyntheticBadge />}
      />
      <DermatologyStateSurface state={resolvedState} message={stateMessage} compact>
        <div className="derm-treatment-list">
          {treatments.map((treatment) => {
            const reference = `MedicationRequest/${treatment.id}`;
            const observations = monitoring.filter((observation) =>
              observation.focus?.some((focus) => focus.reference === reference),
            );
            const dueDates = observations
              .map(
                (observation) =>
                  extensionBySuffix(observation.extension, "/next-monitoring-date")?.valueDate,
              )
              .filter((date): date is string => Boolean(date));
            const earliestDue = dueDates.sort()[0];
            const overdue = earliestDue
              ? effectiveAsOf
                ? new Date(earliestDue) < new Date(effectiveAsOf)
                : false
              : true;
            return (
              <article
                key={treatment.id}
                className="derm-treatment-card"
                data-overdue={overdue || undefined}
              >
                <header>
                  <div>
                    <span>
                      {treatment.status === "active" ? "Traitement actif" : treatment.status}
                    </span>
                    <h3>{medicationLabel(treatment.medication)}</h3>
                    <p>{treatment.dosageInstruction?.[0]?.text ?? "Posologie non renseignée"}</p>
                  </div>
                  <span className="derm-due-date" data-overdue={overdue || undefined}>
                    <span aria-hidden="true">{overdue ? "!" : "◷"}</span>
                    {earliestDue
                      ? `${overdue ? "En retard" : "Prochain contrôle"} · ${formatClinicalDate(earliestDue)}`
                      : "Surveillance à planifier"}
                  </span>
                </header>
                {observations.length > 0 ? (
                  <div className="derm-table-wrap">
                    <table>
                      <caption>
                        Derniers contrôles pour {medicationLabel(treatment.medication)}
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Contrôle</th>
                          <th scope="col">Résultat</th>
                          <th scope="col">Date</th>
                          <th scope="col">Origine</th>
                        </tr>
                      </thead>
                      <tbody>
                        {observations.map((observation) => (
                          <tr key={observation.id}>
                            <th scope="row">{conceptLabel(observation.code)}</th>
                            <td>{observationValue(observation)}</td>
                            <td>{formatClinicalDate(observation.effectiveDateTime)}</td>
                            <td>
                              <DataOriginBadge origin="imported" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="derm-missing-monitoring">Aucun résultat de surveillance relié.</p>
                )}
                <footer>
                  <code>{reference}</code>
                  <button
                    type="button"
                    className="derm-button derm-button--quiet"
                    onClick={() => onPlanMonitoring?.(treatment)}
                  >
                    Planifier le contrôle
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      </DermatologyStateSurface>
    </SectionFrame>
  );
}
