import { DentalPanel, DentalStateBoundary, EvidenceBadge } from "./primitives";
import type { DentalPrescription, DentalStateProps } from "./types";

export interface SafeDentalPrescriptionProps extends DentalStateProps {
  prescription: DentalPrescription;
}

export function SafeDentalPrescription({
  prescription,
  state,
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: SafeDentalPrescriptionProps) {
  const missingWeight = prescription.pediatric && prescription.patientWeightKg === undefined;
  const checks = [
    {
      id: "allergies",
      label: "Allergies vérifiées",
      passed: prescription.allergiesChecked,
    },
    {
      id: "interactions",
      label: "Interactions vérifiées",
      passed: prescription.interactionsChecked,
    },
    {
      id: "weight",
      label: prescription.pediatric
        ? "Poids pédiatrique documenté"
        : "Poids non requis pour ce schéma",
      passed: !missingWeight,
    },
    {
      id: "maximum",
      label: "Dose maximale explicite",
      passed: Boolean(prescription.maximumDailyDose),
    },
  ];
  const blocked = prescription.status === "blocked" || checks.some((check) => !check.passed);

  return (
    <DentalPanel
      eyebrow="Prescription sûre"
      title={prescription.medication}
      description={prescription.indication}
      className="od-panel--prescription"
      dataMode={dataMode}
      presentation={presentation}
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        <div className="od-prescription">
          <div className="od-prescription__order">
            <div
              className="od-prescription__status"
              data-blocked={blocked || undefined}
              role="status"
            >
              <span aria-hidden="true">{blocked ? "!" : "✓"}</span>
              <strong>
                {blocked ? "Prescription bloquée" : "Contrôles de sécurité satisfaits"}
              </strong>
            </div>
            <dl>
              <div>
                <dt>Dose</dt>
                <dd>{prescription.dose}</dd>
              </div>
              <div>
                <dt>Voie</dt>
                <dd>{prescription.route}</dd>
              </div>
              <div>
                <dt>Fréquence</dt>
                <dd>{prescription.frequency}</dd>
              </div>
              <div>
                <dt>Durée</dt>
                <dd>{prescription.duration}</dd>
              </div>
              <div>
                <dt>Maximum</dt>
                <dd>{prescription.maximumDailyDose}</dd>
              </div>
              <div>
                <dt>Population</dt>
                <dd>
                  {prescription.pediatric
                    ? `Pédiatrique · ${prescription.patientWeightKg ?? "poids absent"}`
                    : "Adulte"}
                </dd>
              </div>
            </dl>
            <p>
              <strong>{prescription.author}</strong> ·{" "}
              <time dateTime={prescription.authoredOn}>{prescription.authoredOn}</time>
            </p>
            <code>{prescription.resourceRef}</code>
          </div>
          <ul className="od-prescription__checks" aria-label="Contrôles de prescription">
            {checks.map((check) => (
              <li key={check.id} data-passed={check.passed || undefined}>
                <span aria-hidden="true">{check.passed ? "✓" : "×"}</span>
                <strong>{check.label}</strong>
                <span>{check.passed ? "Documenté" : "Action requise"}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="od-prescription__provenance">
          <EvidenceBadge kind="preliminary" />
          <span>
            MedicationRequest FHIR R5
            {dataMode === "synthetic" ? " · aucune ordonnance réelle" : " · source clinique"}
          </span>
        </div>
      </DentalStateBoundary>
    </DentalPanel>
  );
}
