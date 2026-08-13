import { useState } from "react";
import {
  DataMaturityBadge,
  EntStatePanel,
  EntWorkbenchFrame,
  SegmentedControl,
  SourceLine,
} from "./common";
import type { EntDisplayState, EntHostPresentationProps, OncologyTimelineEvent } from "./types";

export interface EntOncologyTimelineProps extends EntHostPresentationProps {
  events: OncologyTimelineEvent[];
  state?: EntDisplayState;
}

export function EntOncologyTimeline({
  events,
  state = "ready",
  dataMode = "clinical",
  presentation = "standalone",
}: EntOncologyTimelineProps) {
  const [filter, setFilter] = useState<"all" | "evidence" | "coordination">("all");
  const visible = events.filter((event) =>
    filter === "all"
      ? true
      : filter === "evidence"
        ? ["lesion", "specimen", "staging", "report"].includes(event.kind)
        : ["coordination", "procedure"].includes(event.kind),
  );
  return (
    <EntWorkbenchFrame
      dataMode={dataMode}
      presentation={presentation}
      title="Parcours oncologique cervico-facial"
      eyebrow="Clinical atlas · Chronologie"
      description="Lésions, stade, prélèvements, coordination et signature avec origine de chaque information."
      status={events.some((event) => event.signedBy) ? "Compte rendu signé" : "Coordination active"}
      statusTone={events.some((event) => event.signedBy) ? "success" : "pending"}
      actions={
        <SegmentedControl
          label="Filtrer la chronologie"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "Tout" },
            { value: "evidence", label: "Éléments" },
            { value: "coordination", label: "Coordination" },
          ]}
        />
      }
    >
      {state !== "ready" ? (
        <EntStatePanel state={state} />
      ) : events.length === 0 ? (
        <EntStatePanel state="empty" />
      ) : (
        <div className="ent-oncology">
          <aside className="ent-oncology__legend" aria-label="États de l’information">
            {(["observed", "imported", "preliminary", "validated", "projected"] as const).map(
              (maturity) => (
                <DataMaturityBadge key={maturity} maturity={maturity} />
              ),
            )}
          </aside>
          <ol className="ent-timeline" aria-live="polite">
            {visible.map((event) => (
              <li key={event.id} data-maturity={event.maturity}>
                <time dateTime={event.at}>
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(event.at))}
                </time>
                <span className="ent-timeline__node" aria-hidden="true" />
                <article>
                  <div className="ent-section-heading">
                    <div>
                      <p className="ent-eyebrow">
                        {event.kind === "lesion"
                          ? "Lésion"
                          : event.kind === "specimen"
                            ? "Prélèvement"
                            : event.kind === "staging"
                              ? "Stade"
                              : event.kind === "coordination"
                                ? "Coordination"
                                : event.kind === "procedure"
                                  ? "Planification"
                                  : "Compte rendu"}
                      </p>
                      <h3>{event.title}</h3>
                    </div>
                    <DataMaturityBadge maturity={event.maturity} />
                  </div>
                  <p>{event.detail}</p>
                  {event.signedBy ? (
                    <p className="ent-signature">
                      <span aria-hidden="true">✓</span> Signé par {event.signedBy}
                    </p>
                  ) : null}
                  <SourceLine reference={event.sourceReference} />
                </article>
              </li>
            ))}
          </ol>
          <p className="ent-clinical-note">
            Les événements projetés représentent une coordination planifiée, jamais une indication
            thérapeutique automatique.
          </p>
        </div>
      )}
    </EntWorkbenchFrame>
  );
}
