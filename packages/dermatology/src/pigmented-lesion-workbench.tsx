import { conceptCode, conceptLabel, formatClinicalDate, lesionId } from "./fhir-utils";
import {
  DermatologyStateSurface,
  PanelHeading,
  ReportStatus,
  SectionFrame,
  SyntheticBadge,
} from "./shared";
import type {
  DermatologyBodyStructure,
  DermatologyObservation,
  DermatologyStateProps,
} from "./types";

const abcdeLetters: Record<string, string> = {
  "a-asymmetry": "A",
  "b-border": "B",
  "c-color": "C",
  "d-diameter": "D",
  "e-evolution": "E",
};

function componentValue(component: NonNullable<DermatologyObservation["component"]>[number]) {
  if (component.valueInteger !== undefined) return `${component.valueInteger} / 2`;
  if (component.valueQuantity?.value !== undefined)
    return `${component.valueQuantity.value.toLocaleString("fr-FR")} ${component.valueQuantity.unit ?? ""}`;
  return conceptLabel(component.valueCodeableConcept);
}

export interface PigmentedLesionWorkbenchProps extends DermatologyStateProps {
  lesion?: DermatologyBodyStructure;
  assessment?: DermatologyObservation;
  onEscalate?: () => void;
}

export function PigmentedLesionWorkbench({
  lesion,
  assessment,
  onEscalate,
  state = "ready",
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: PigmentedLesionWorkbenchProps) {
  const resolvedState = state === "ready" && (!lesion || !assessment) ? "empty" : state;
  return (
    <SectionFrame
      className="derm-pigmented"
      label="Évaluation de lésion pigmentée"
      dataMode={dataMode}
      presentation={presentation}
    >
      <PanelHeading
        eyebrow="Lésions pigmentées"
        title={lesion ? `${lesionId(lesion)} · ABCDE` : "Évaluation ABCDE"}
        description="Constats codés, identité liée et interprétation clinique distincte."
        action={<SyntheticBadge />}
      />
      <DermatologyStateSurface state={resolvedState} message={stateMessage} compact>
        {lesion && assessment ? (
          <>
            <div className="derm-pigmented__identity">
              <div>
                <span>Site</span>
                <strong>{conceptLabel(lesion.includedStructure[0]?.structure)}</strong>
              </div>
              <div>
                <span>Évaluation</span>
                <strong>{formatClinicalDate(assessment.effectiveDateTime)}</strong>
              </div>
              <ReportStatus status={assessment.status} />
            </div>
            <ol className="derm-abcde-list">
              {(assessment.component ?? []).map((component) => {
                const code = conceptCode(component.code) ?? "finding";
                return (
                  <li key={code}>
                    <span className="derm-abcde-list__letter" aria-hidden="true">
                      {abcdeLetters[code] ?? "•"}
                    </span>
                    <div>
                      <strong>{conceptLabel(component.code)}</strong>
                      <span>{componentValue(component)}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="derm-pigmented__interpretation">
              <div>
                <span>Interprétation dérivée</span>
                <strong>{conceptLabel(assessment.interpretation?.[0])}</strong>
                <p>{assessment.note?.[0]?.text}</p>
              </div>
              <button
                type="button"
                className="derm-button derm-button--primary"
                onClick={onEscalate}
              >
                Prioriser l’avis
              </button>
            </div>
            <p className="derm-resource-reference">
              Liens FHIR : <code>BodyStructure/{lesion.id}</code> ·{" "}
              <code>Observation/{assessment.id}</code>
            </p>
          </>
        ) : null}
      </DermatologyStateSurface>
    </SectionFrame>
  );
}
