import { conceptLabel, formatClinicalDate } from "./fhir-utils";
import {
  DermatologyStateSurface,
  PanelHeading,
  ReportStatus,
  SectionFrame,
  SyntheticBadge,
} from "./shared";
import type { DermatologyDetectedIssue, DermatologyStateProps } from "./types";

export interface DermatologyVigilanceBoardProps extends DermatologyStateProps {
  issues: DermatologyDetectedIssue[];
  onAction?: (issue: DermatologyDetectedIssue) => void;
}

export function DermatologyVigilanceBoard({
  issues,
  onAction,
  state = "ready",
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: DermatologyVigilanceBoardProps) {
  const ordered = [...issues].sort((a, b) => {
    const rank = { high: 0, moderate: 1, low: 2 } as const;
    return rank[a.severity ?? "low"] - rank[b.severity ?? "low"];
  });
  const resolvedState = state === "ready" && issues.length === 0 ? "empty" : state;

  return (
    <SectionFrame
      className="derm-vigilance"
      label="Vigilances dermatologiques"
      dataMode={dataMode}
      presentation={presentation}
    >
      <PanelHeading
        eyebrow="Coordination & populations particulières"
        title="Vigilances"
        description="Infectiologie, iatrogénie, phototype et expositions tropicales priorisés."
        action={<SyntheticBadge />}
      />
      <DermatologyStateSurface state={resolvedState} message={stateMessage} compact>
        <div className="derm-vigilance__summary">
          <div>
            <strong>{issues.filter((issue) => issue.severity === "high").length}</strong>
            <span>critique(s)</span>
          </div>
          <div>
            <strong>{issues.filter((issue) => issue.severity === "moderate").length}</strong>
            <span>à traiter</span>
          </div>
          <div>
            <strong>{issues.filter((issue) => issue.severity === "low").length}</strong>
            <span>à documenter</span>
          </div>
        </div>
        <ol className="derm-vigilance-list">
          {ordered.map((issue) => {
            const severity = issue.severity ?? "low";
            return (
              <li key={issue.id} data-severity={severity}>
                <div className="derm-vigilance-list__symbol" aria-hidden="true">
                  {severity === "high" ? "!" : severity === "moderate" ? "△" : "i"}
                </div>
                <div className="derm-vigilance-list__content">
                  <header>
                    <div>
                      <span>{conceptLabel(issue.category?.[0], "Vigilance")}</span>
                      <h3>{conceptLabel(issue.code)}</h3>
                    </div>
                    <ReportStatus status={severity === "high" ? "critical" : "preliminary"} />
                  </header>
                  <p>{issue.detail}</p>
                  {issue.mitigation?.[0] ? (
                    <div className="derm-vigilance-list__action">
                      <div>
                        <span>Action attendue</span>
                        <strong>{conceptLabel(issue.mitigation[0].action)}</strong>
                      </div>
                      <button
                        type="button"
                        className="derm-button derm-button--quiet"
                        onClick={() => onAction?.(issue)}
                      >
                        Prendre en charge
                      </button>
                    </div>
                  ) : null}
                  <footer>
                    <time dateTime={issue.identifiedDateTime}>
                      {formatClinicalDate(issue.identifiedDateTime)}
                    </time>
                    <code>DetectedIssue/{issue.id}</code>
                  </footer>
                </div>
              </li>
            );
          })}
        </ol>
      </DermatologyStateSurface>
    </SectionFrame>
  );
}
