import { conceptCode, conceptLabel, formatClinicalDate } from "./fhir-utils";
import { DermatologyStateSurface, PanelHeading, SectionFrame, SyntheticBadge } from "./shared";
import type { DermatologyObservation, DermatologyStateProps } from "./types";

export interface PhotographyQualityGateProps extends DermatologyStateProps {
  checks: DermatologyObservation[];
  onDecision?: (decision: "accept" | "repeat") => void;
}

export function PhotographyQualityGate({
  checks,
  onDecision,
  state = "ready",
  stateMessage,
}: PhotographyQualityGateProps) {
  const resolvedState = state === "ready" && checks.length === 0 ? "empty" : state;
  const failures = checks.filter((check) => !check.valueBoolean);
  const hardFailures = failures.filter(
    (check) => conceptCode(check.interpretation?.[0]) === "fail",
  );
  const usable = hardFailures.length === 0;

  return (
    <SectionFrame className="derm-quality-gate" label="Contrôle qualité photographique">
      <PanelHeading
        eyebrow="Avant comparaison"
        title="Qualité photographique"
        description="Contrôles codés, résultat lisible sans dépendre de la couleur."
        action={<SyntheticBadge />}
      />
      <DermatologyStateSurface state={resolvedState} message={stateMessage} compact>
        <div className="derm-quality-gate__result" data-usable={usable} role="status">
          <span aria-hidden="true">{usable ? "✓" : "×"}</span>
          <div>
            <strong>{usable ? "Qualité exploitable" : "Qualité insuffisante"}</strong>
            <p>
              {usable
                ? "Tous les critères bloquants sont conformes."
                : `${hardFailures.length} critère(s) bloquant(s) nécessitent une nouvelle acquisition.`}
            </p>
          </div>
        </div>
        <ul className="derm-check-list">
          {checks.map((check) => {
            const interpretation = conceptCode(check.interpretation?.[0]) ?? "warning";
            const status = check.valueBoolean ? "pass" : interpretation;
            return (
              <li key={check.id} data-check={status}>
                <span className="derm-check-list__symbol" aria-hidden="true">
                  {status === "pass" ? "✓" : status === "fail" ? "×" : "!"}
                </span>
                <div>
                  <strong>{conceptLabel(check.code)}</strong>
                  <span>{conceptLabel(check.interpretation?.[0])}</span>
                </div>
                <time dateTime={check.effectiveDateTime}>
                  {formatClinicalDate(check.effectiveDateTime, false)}
                </time>
              </li>
            );
          })}
        </ul>
        <div className="derm-quality-gate__footer">
          <button
            type="button"
            className="derm-button derm-button--primary"
            disabled={!usable}
            onClick={() => onDecision?.("accept")}
          >
            Accepter l’acquisition
          </button>
          <button
            type="button"
            className="derm-button derm-button--quiet"
            onClick={() => onDecision?.("repeat")}
          >
            Demander une reprise
          </button>
        </div>
      </DermatologyStateSurface>
    </SectionFrame>
  );
}
