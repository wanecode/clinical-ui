import { DentalPanel, DentalStateBoundary, EvidenceBadge, SyntheticFlag } from "./primitives";
import type { DentalStateProps, TimelineEvent } from "./types";

export interface ProsthesisImplantTimelineProps extends DentalStateProps {
  tooth: string;
  events: TimelineEvent[];
  deviceLabel?: string;
}

const eventStatus = {
  completed: { symbol: "✓", label: "Terminé" },
  current: { symbol: "●", label: "En cours" },
  planned: { symbol: "◌", label: "Projeté" },
  cancelled: { symbol: "×", label: "Annulé" },
  postponed: { symbol: "Ⅱ", label: "Reporté" },
} as const;

export function ProsthesisImplantTimeline({
  tooth,
  events,
  deviceLabel = "Implant synthétique Ø4,1 × 10 mm",
  state,
  stateMessage,
}: ProsthesisImplantTimelineProps) {
  return (
    <DentalPanel
      eyebrow={`Prothèse / implant · ${tooth}`}
      title="Chronologie implantaire"
      description={deviceLabel}
      actions={<SyntheticFlag />}
      className="od-panel--timeline"
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        <ol className="od-timeline">
          {events.map((event) => {
            const status = eventStatus[event.status];
            return (
              <li key={event.id} data-status={event.status}>
                <div className="od-timeline__marker" aria-hidden="true">
                  {status.symbol}
                </div>
                <time dateTime={event.date}>{event.date}</time>
                <h3>{event.title}</h3>
                <p>{event.detail}</p>
                <div>
                  <span className="od-event-status" data-status={event.status}>
                    <span aria-hidden="true">{status.symbol}</span>
                    {status.label}
                  </span>
                  <EvidenceBadge kind={event.evidence} />
                </div>
                <code>{event.resourceRef}</code>
              </li>
            );
          })}
        </ol>
      </DentalStateBoundary>
    </DentalPanel>
  );
}
