import { conceptCode, conceptLabel, formatClinicalDate, observationValue } from "./fhir-utils";
import { DermatologyStateSurface, PanelHeading, SectionFrame, SyntheticBadge } from "./shared";
import type { DermatologyObservation, DermatologyStateProps } from "./types";

const scoreDefinitions = [
  { code: "pasi", label: "PASI", ceiling: 72, context: "Psoriasis" },
  { code: "scorad", label: "SCORAD", ceiling: 103, context: "Dermatite atopique" },
  { code: "dlqi", label: "DLQI", ceiling: 30, context: "Qualité de vie" },
  { code: "body-surface-area", label: "Surface", ceiling: 100, context: "Corps atteint" },
] as const;

export interface InflammatoryScoreWorkbenchProps extends DermatologyStateProps {
  observations: DermatologyObservation[];
  phototype?: DermatologyObservation;
}

export function InflammatoryScoreWorkbench({
  observations,
  phototype,
  state = "ready",
  stateMessage,
}: InflammatoryScoreWorkbenchProps) {
  const resolvedState = state === "ready" && observations.length === 0 ? "empty" : state;

  return (
    <SectionFrame className="derm-inflammatory" label="Scores inflammatoires">
      <PanelHeading
        eyebrow="Dermatoses inflammatoires"
        title="Scores & surfaces datés"
        description="PASI, SCORAD, DLQI et surface corporelle conservent leur date et leur échelle."
        action={<SyntheticBadge />}
      />
      <DermatologyStateSurface state={resolvedState} message={stateMessage}>
        {!phototype ? (
          <div className="derm-vigilance-strip" data-severity="warning" role="status">
            <span aria-hidden="true">!</span>
            <div>
              <strong>Phototype non renseigné</strong>
              <p>Compléter le phototype avant de contextualiser la photoprotection.</p>
            </div>
            <button type="button" className="derm-button derm-button--quiet">
              Renseigner
            </button>
          </div>
        ) : (
          <div className="derm-vigilance-strip" data-severity="information">
            <span aria-hidden="true">i</span>
            <div>
              <strong>Phototype documenté</strong>
              <p>
                {conceptLabel(phototype.valueCodeableConcept)} ·{" "}
                {formatClinicalDate(phototype.effectiveDateTime)}
              </p>
            </div>
          </div>
        )}

        <div className="derm-score-grid">
          {scoreDefinitions.map((definition) => {
            const scoreObservations = observations
              .filter((observation) => conceptCode(observation.code) === definition.code)
              .sort((a, b) => (a.effectiveDateTime ?? "").localeCompare(b.effectiveDateTime ?? ""));
            const first = scoreObservations[0]?.valueQuantity?.value;
            const latest = scoreObservations.at(-1);
            const latestValue = latest?.valueQuantity?.value;
            const delta =
              first !== undefined && latestValue !== undefined ? latestValue - first : undefined;
            return (
              <article key={definition.code} className="derm-score-card">
                <header>
                  <div>
                    <span>{definition.context}</span>
                    <h3>{definition.label}</h3>
                  </div>
                  <strong>{latest ? observationValue(latest) : "—"}</strong>
                </header>
                <div className="derm-score-card__plot">
                  {scoreObservations.map((observation) => {
                    const value = observation.valueQuantity?.value ?? 0;
                    return (
                      <div key={observation.id} className="derm-score-bar">
                        <div className="derm-score-bar__track">
                          <span
                            style={{
                              height: `${Math.max(4, (value / definition.ceiling) * 100)}%`,
                            }}
                          />
                        </div>
                        <strong>{value.toLocaleString("fr-FR")}</strong>
                        <time dateTime={observation.effectiveDateTime}>
                          {formatClinicalDate(observation.effectiveDateTime, false)}
                        </time>
                      </div>
                    );
                  })}
                </div>
                <footer>
                  <span>Échelle 0–{definition.ceiling}</span>
                  <strong>
                    {delta === undefined
                      ? "Tendance indisponible"
                      : `${delta > 0 ? "+" : ""}${delta.toLocaleString("fr-FR")} points`}
                  </strong>
                </footer>
              </article>
            );
          })}
        </div>
        <p className="derm-clinical-note">
          <span aria-hidden="true">↘</span>
          Les valeurs exactes et leurs dates restent visibles; la hauteur des barres n’est qu’une
          aide de lecture secondaire.
        </p>
      </DermatologyStateSurface>
    </SectionFrame>
  );
}
