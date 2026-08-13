import { ClinicalStatusBadge } from "@clinical-ui/core";
import { useState } from "react";
import {
  ChartTableToggle,
  DataOriginBadge,
  DecisionCallout,
  SourceReference,
  WorkbenchHeader,
  WorkbenchState,
} from "./shared";
import type {
  CardiologyViewState,
  DeviceTimelineEvent,
  PrescriptionSafetyItem,
  ReportLifecycleItem,
  TrajectoryEvent,
  VigilanceItem,
} from "./types";

const LANE_LABELS: Record<TrajectoryEvent["lane"], string> = {
  symptom: "Symptômes",
  imaging: "Imagerie",
  treatment: "Traitements",
  device: "Dispositifs",
  report: "Suivi / rapports",
};

function TrajectoryVisual({ events }: { events: TrajectoryEvent[] }) {
  const lanes = Object.keys(LANE_LABELS) as TrajectoryEvent["lane"][];
  const sortedDates = events.map((event) => new Date(event.at).valueOf());
  const min = Math.min(...sortedDates);
  const max = Math.max(...sortedDates);
  const span = Math.max(1, max - min);
  return (
    <div
      className="cardio-trajectory-visual"
      role="img"
      aria-label="Trajectoire cardiologique multiligne. Une alternative tabulaire est disponible."
    >
      <div className="cardio-trajectory-legend" aria-hidden="true">
        <DataOriginBadge origin="observed" />
        <DataOriginBadge origin="imported" />
        <DataOriginBadge origin="derived" />
        <DataOriginBadge origin="projected" />
      </div>
      {lanes.map((lane) => (
        <div className="cardio-trajectory-lane" key={lane}>
          <strong>{LANE_LABELS[lane]}</strong>
          <div className="cardio-trajectory-lane__track">
            {events
              .filter((event) => event.lane === lane)
              .map((event) => {
                const left = 2 + ((new Date(event.at).valueOf() - min) / span) * 80;
                return (
                  <article
                    className="cardio-trajectory-event"
                    data-origin={event.origin}
                    key={event.id}
                    style={{ left: `${left}%` }}
                  >
                    <span className="cardio-trajectory-event__pin" aria-hidden="true" />
                    <time dateTime={event.at}>{event.at.slice(0, 10)}</time>
                    <b>{event.title}</b>
                    <span>{event.detail}</span>
                  </article>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

function TrajectoryTable({ events }: { events: TrajectoryEvent[] }) {
  return (
    <div className="cardio-table-scroll">
      <table className="cardio-table">
        <caption>Chronologie cardiologique synthétique</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Filière</th>
            <th scope="col">Événement</th>
            <th scope="col">Détail</th>
            <th scope="col">Origine</th>
            <th scope="col">Statut</th>
            <th scope="col">Ressource</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <th scope="row">
                <time dateTime={event.at}>{event.at.slice(0, 10)}</time>
              </th>
              <td>{LANE_LABELS[event.lane]}</td>
              <td>{event.title}</td>
              <td>{event.detail}</td>
              <td>
                <DataOriginBadge origin={event.origin} />
              </td>
              <td>
                <ClinicalStatusBadge status={event.status} compact />
              </td>
              <td>
                <SourceReference>{event.sourceReference}</SourceReference>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface CardiacTrajectoryProps {
  events: TrajectoryEvent[];
  state?: CardiologyViewState;
}

export function CardiacTrajectory({ events, state = "ready" }: CardiacTrajectoryProps) {
  return (
    <section className="cardio-workbench cardio-trajectory" aria-label="Trajectoire cardiaque">
      <WorkbenchHeader
        eyebrow="Parcours longitudinal"
        title="Trajectoire cardiaque"
        description="Événements observés, importés, dérivés et projetés"
      />
      <WorkbenchState state={state} label="Trajectoire cardiaque">
        <ChartTableToggle
          chart={<TrajectoryVisual events={events} />}
          table={<TrajectoryTable events={events} />}
          chartLabel="Afficher la trajectoire"
          tableLabel="Voir la chronologie en tableau"
        />
      </WorkbenchState>
    </section>
  );
}

const PRESCRIPTION_LABELS: Record<PrescriptionSafetyItem["status"], string> = {
  confirmed: "Confirmée",
  "to-confirm": "À confirmer",
  "on-hold": "Suspendue",
};

export interface PrescriptionSafetyBoardProps {
  items: PrescriptionSafetyItem[];
  state?: CardiologyViewState;
  owner?: string;
  onConfirm?: (id: string) => void;
}

export function PrescriptionSafetyBoard({
  items,
  state = "ready",
  owner = "Dr Synthèse",
  onConfirm,
}: PrescriptionSafetyBoardProps) {
  const [locallyConfirmed, setLocallyConfirmed] = useState<string[]>([]);
  const pending = items.filter(
    (item) => item.status === "to-confirm" && !locallyConfirmed.includes(item.id),
  );
  const confirm = (id: string) => {
    setLocallyConfirmed((current) => [...current, id]);
    onConfirm?.(id);
  };
  return (
    <section
      className="cardio-workbench cardio-prescriptions"
      aria-label="Sécurité des prescriptions"
    >
      <WorkbenchHeader
        eyebrow="Thérapeutique"
        title="Sécurité des prescriptions"
        description={`${pending.length} décision(s) à confirmer`}
        status={pending.length > 0 ? "critical" : "validated"}
      />
      <WorkbenchState state={state} label="Prescriptions">
        <div className="cardio-prescription-list">
          {items.map((item) => {
            const confirmed = item.status === "confirmed" || locallyConfirmed.includes(item.id);
            return (
              <article
                className="cardio-prescription"
                data-status={confirmed ? "confirmed" : item.status}
                key={item.id}
              >
                <div className="cardio-prescription__status" aria-hidden="true">
                  {confirmed ? "✓" : item.status === "to-confirm" ? "!" : "Ⅱ"}
                </div>
                <div className="cardio-prescription__main">
                  <div>
                    <h3>{item.medication}</h3>
                    <p>{item.dosage}</p>
                  </div>
                  <span className="cardio-label">
                    {confirmed ? "Confirmée" : PRESCRIPTION_LABELS[item.status]}
                  </span>
                  {item.interaction ? (
                    <p className="cardio-prescription__alert">
                      <strong>Interaction potentielle :</strong> {item.interaction}
                    </p>
                  ) : null}
                  {item.renalNote ? (
                    <p className="cardio-prescription__note">{item.renalNote}</p>
                  ) : null}
                  <SourceReference>{item.sourceReference}</SourceReference>
                </div>
                {item.status === "to-confirm" && !confirmed ? (
                  <button className="cardio-button" type="button" onClick={() => confirm(item.id)}>
                    Confirmer après revue
                  </button>
                ) : null}
                {confirmed && item.status === "to-confirm" ? (
                  <span className="cardio-confirmed-message" role="status">
                    Confirmation humaine enregistrée
                  </span>
                ) : null}
              </article>
            );
          })}
        </div>
        {pending.length > 0 ? (
          <DecisionCallout
            title="Revoir la proposition thérapeutique"
            detail="Une interaction potentielle et la fonction rénale doivent être évaluées avant confirmation."
            owner={owner}
            critical
          />
        ) : null}
      </WorkbenchState>
    </section>
  );
}

export interface ImplantedDeviceTimelineProps {
  events: DeviceTimelineEvent[];
  state?: CardiologyViewState;
  deviceAvailable?: boolean;
  deviceLabel?: string;
  serialNumber?: string;
}

export function ImplantedDeviceTimeline({
  events,
  state = "ready",
  deviceAvailable = true,
  deviceLabel = "DAI bicaméral synthétique",
  serialNumber = "SYN-DAI-042",
}: ImplantedDeviceTimelineProps) {
  return (
    <section
      className="cardio-workbench cardio-device"
      aria-label="Chronologie du dispositif implanté"
    >
      <WorkbenchHeader
        eyebrow="Dispositif / prothèse"
        title="Dispositif implanté"
        description={`${deviceLabel} · ${serialNumber}`}
        status={deviceAvailable ? "validated" : "warning"}
      />
      <WorkbenchState state={state} label="Dispositif implanté">
        {!deviceAvailable ? (
          <div className="cardio-signal-state" data-state="device-unavailable" role="status">
            <span aria-hidden="true">⌁</span>
            <div>
              <h3>Appareil indisponible</h3>
              <p>
                La télémétrie distante n'est pas joignable. Les contrôles déjà importés restent
                visibles.
              </p>
            </div>
          </div>
        ) : null}
        <ol className="cardio-device-timeline">
          {events.map((event) => (
            <li key={event.id} data-origin={event.origin}>
              <span className="cardio-device-timeline__marker" aria-hidden="true" />
              <div>
                <div className="cardio-device-timeline__topline">
                  <time dateTime={event.at}>{event.at}</time>
                  <DataOriginBadge origin={event.origin} />
                  <ClinicalStatusBadge status={event.status} compact />
                </div>
                <h3>{event.title}</h3>
                <p>{event.detail}</p>
                <SourceReference>{event.sourceReference}</SourceReference>
              </div>
            </li>
          ))}
        </ol>
      </WorkbenchState>
    </section>
  );
}

const REPORT_STATUS: Record<
  ReportLifecycleItem["status"],
  { label: string; clinical: "preliminary" | "amended" | "validated" }
> = {
  preliminary: { label: "Préliminaire", clinical: "preliminary" },
  amended: { label: "Amendé", clinical: "amended" },
  signed: { label: "Signé", clinical: "validated" },
};

export interface CardiologyReportLifecycleProps {
  items: ReportLifecycleItem[];
  state?: CardiologyViewState;
}

export function CardiologyReportLifecycle({
  items,
  state = "ready",
}: CardiologyReportLifecycleProps) {
  const latest = items.at(-1);
  return (
    <section className="cardio-workbench cardio-reports" aria-label="Cycle de vie du compte rendu">
      <WorkbenchHeader
        eyebrow="Compte rendu"
        title="Cycle de vie documentaire"
        description={`${items.length} version(s) tracée(s)`}
        status={latest ? REPORT_STATUS[latest.status].clinical : "unknown"}
      />
      <WorkbenchState state={state} label="Comptes rendus">
        <ol className="cardio-report-lifecycle">
          {items.map((item, index) => {
            const status = REPORT_STATUS[item.status];
            return (
              <li key={item.id}>
                <div className="cardio-report-lifecycle__number" aria-hidden="true">
                  {index + 1}
                </div>
                <div>
                  <div className="cardio-report-lifecycle__topline">
                    <ClinicalStatusBadge status={status.clinical} label={status.label} compact />
                    <time dateTime={item.at}>{item.at.replace("T", " ").slice(0, 16)}</time>
                  </div>
                  <h3>
                    {item.title} · version {item.version}
                  </h3>
                  <p>Auteur : {item.author}</p>
                  {item.changeSummary ? (
                    <p className="cardio-report-lifecycle__change">
                      <strong>Modification :</strong> {item.changeSummary}
                    </p>
                  ) : null}
                  <SourceReference>{item.sourceReference}</SourceReference>
                </div>
              </li>
            );
          })}
        </ol>
      </WorkbenchState>
    </section>
  );
}

export interface CardiologyVigilanceBoardProps {
  items: VigilanceItem[];
  state?: CardiologyViewState;
  onAcknowledge?: (id: string) => void;
}

export function CardiologyVigilanceBoard({
  items,
  state = "ready",
  onAcknowledge,
}: CardiologyVigilanceBoardProps) {
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const acknowledge = (id: string) => {
    setAcknowledged((current) => [...current, id]);
    onAcknowledge?.(id);
  };
  const critical = items.filter(
    (item) => item.severity === "critical" && item.status !== "resolved",
  ).length;
  return (
    <section
      className="cardio-workbench cardio-vigilance"
      aria-label="Tableau de vigilance cardiologique"
    >
      <WorkbenchHeader
        eyebrow="Vigilances"
        title="Tableau de vigilance"
        description={`${critical} alerte(s) critique(s) active(s)`}
        status={critical ? "critical" : "validated"}
      />
      <WorkbenchState state={state} label="Vigilances">
        <div className="cardio-table-scroll">
          <table className="cardio-table">
            <caption>Alertes, responsables et décisions humaines</caption>
            <thead>
              <tr>
                <th scope="col">Alerte</th>
                <th scope="col">Criticité</th>
                <th scope="col">Responsable</th>
                <th scope="col">Échéance</th>
                <th scope="col">Statut</th>
                <th scope="col">Décision</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isAcknowledged =
                  item.status === "acknowledged" || acknowledged.includes(item.id);
                return (
                  <tr key={item.id} data-critical={item.severity === "critical"}>
                    <th scope="row">
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                      <SourceReference>{item.sourceReference}</SourceReference>
                    </th>
                    <td>
                      <ClinicalStatusBadge status={item.severity} compact />
                    </td>
                    <td>{item.owner}</td>
                    <td>
                      <time dateTime={item.dueAt}>{item.dueAt.replace("T", " ").slice(0, 16)}</time>
                    </td>
                    <td>
                      {item.status === "resolved"
                        ? "Résolue"
                        : isAcknowledged
                          ? "Prise en compte"
                          : "Ouverte"}
                    </td>
                    <td>
                      {item.status !== "resolved" && !isAcknowledged ? (
                        <button
                          className="cardio-button cardio-button--quiet"
                          type="button"
                          onClick={() => acknowledge(item.id)}
                        >
                          Prendre en compte
                        </button>
                      ) : (
                        <span className="cardio-confirmed-message" role="status">
                          {item.status === "resolved" ? "Résolution tracée" : "Décision tracée"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </WorkbenchState>
    </section>
  );
}
