import {
  conceptLabel,
  formatClinicalDate,
  lesionId,
  observationOrigin,
  observationValue,
} from "./fhir-utils";
import {
  DataOriginBadge,
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

export interface LesionLongitudinalCardProps extends DermatologyStateProps {
  lesion?: DermatologyBodyStructure;
  observations: DermatologyObservation[];
}

export function LesionLongitudinalCard({
  lesion,
  observations,
  state = "ready",
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: LesionLongitudinalCardProps) {
  const resolvedState = state === "ready" && !lesion ? "empty" : state;
  const ordered = [...observations].sort((a, b) =>
    (b.effectiveDateTime ?? "").localeCompare(a.effectiveDateTime ?? ""),
  );
  const latest = ordered[0];
  const earliest = ordered.at(-1);
  const delta =
    latest?.valueQuantity?.value !== undefined && earliest?.valueQuantity?.value !== undefined
      ? latest.valueQuantity.value - earliest.valueQuantity.value
      : undefined;

  return (
    <SectionFrame
      className="derm-longitudinal"
      label="Suivi longitudinal de la lésion"
      dataMode={dataMode}
      presentation={presentation}
    >
      <PanelHeading
        eyebrow="Identité persistante"
        title={lesion ? lesionId(lesion) : "Suivi longitudinal"}
        description={
          lesion
            ? conceptLabel(lesion.includedStructure[0]?.structure)
            : "Mesures datées et traçables"
        }
        action={<SyntheticBadge />}
      />
      <DermatologyStateSurface state={resolvedState} message={stateMessage} compact>
        {lesion ? (
          <>
            <div className="derm-longitudinal__summary">
              <div>
                <span>Mesure actuelle</span>
                <strong>{latest ? observationValue(latest) : "Non mesuré"}</strong>
              </div>
              <div>
                <span>Évolution absolue</span>
                <strong>
                  {delta === undefined
                    ? "Non calculable"
                    : `${delta > 0 ? "+" : ""}${delta.toLocaleString("fr-FR")} ${latest?.valueQuantity?.unit ?? ""}`}
                </strong>
              </div>
              <div>
                <span>État de la lésion</span>
                <strong>{lesion.active === false ? "Historique" : "Suivie activement"}</strong>
              </div>
            </div>
            <ol className="derm-timeline-list">
              {ordered.map((observation) => (
                <li key={observation.id}>
                  <span className="derm-timeline-list__rail" aria-hidden="true" />
                  <div className="derm-timeline-list__header">
                    <time dateTime={observation.effectiveDateTime}>
                      {formatClinicalDate(observation.effectiveDateTime)}
                    </time>
                    <ReportStatus status={observation.status} />
                  </div>
                  <strong>{observationValue(observation)}</strong>
                  <div className="derm-timeline-list__meta">
                    <DataOriginBadge origin={observationOrigin(observation)} />
                    <code>Observation/{observation.id}</code>
                  </div>
                  {observation.note?.[0]?.text ? <p>{observation.note[0].text}</p> : null}
                </li>
              ))}
            </ol>
          </>
        ) : null}
      </DermatologyStateSurface>
    </SectionFrame>
  );
}
