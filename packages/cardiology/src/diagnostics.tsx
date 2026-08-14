import { ClinicalStatusBadge } from "@clinical-ui/core";
import { useId } from "react";
import {
  ChartTableToggle,
  DataOriginBadge,
  DecisionCallout,
  SourceReference,
  WorkbenchHeader,
  WorkbenchState,
} from "./shared";
import type {
  BloodPressureReading,
  CardiologyDataMode,
  CardiologyStateProps,
  EcgStudy,
  EchocardiographyMeasure,
  HolterEvent,
} from "./types";

function tracePath(study: EcgStudy) {
  const lead = study.leads[0];
  if (!lead || lead.points.length === 0) return "";
  return lead.points
    .map((point, index) => {
      const x = 30 + (point.millisecond / 1120) * 940;
      const y = 145 - point.millivolt * 82;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function EcgTrace({ study, dataMode }: { study: EcgStudy; dataMode: CardiologyDataMode }) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg
      className="cardio-ecg-trace"
      viewBox="0 0 1000 260"
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
      preserveAspectRatio="none"
    >
      <title
        id={titleId}
      >{`Tracé ECG${dataMode === "synthetic" ? " synthétique" : ""}, dérivation ${study.leads[0]?.name ?? "inconnue"}`}</title>
      <desc id={descriptionId}>
        {dataMode === "synthetic" ? "Signal de démonstration. " : ""}Calibration {study.speed},{" "}
        {study.gain}. La table adjacente fournit une alternative numérique.
      </desc>
      <defs>
        <pattern id="cardio-ecg-small-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" className="cardio-ecg-grid cardio-ecg-grid--small" />
        </pattern>
        <pattern id="cardio-ecg-grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="url(#cardio-ecg-small-grid)" />
          <path d="M 50 0 L 0 0 0 50" className="cardio-ecg-grid cardio-ecg-grid--major" />
        </pattern>
        <pattern id="cardio-artifact-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M-2 2 L2 -2 M0 8 L8 0 M6 10 L10 6" className="cardio-artifact-hatch" />
        </pattern>
      </defs>
      <rect width="1000" height="260" fill="url(#cardio-ecg-grid)" />
      <path d="M14 215 v-35 h18 v35 h18" className="cardio-ecg-calibration" />
      <text x="14" y="238" className="cardio-svg-label">
        1 mV · {study.speed}
      </text>
      <rect
        x="760"
        y="24"
        width="122"
        height="205"
        fill="url(#cardio-artifact-pattern)"
        className="cardio-artifact-zone"
      />
      <text x="770" y="48" className="cardio-svg-label cardio-svg-label--artifact">
        Zone d'artefact
      </text>
      <path d={tracePath(study)} className="cardio-ecg-signal" />
      <text x="28" y="32" className="cardio-svg-label cardio-svg-label--lead">
        Dérivation {study.leads[0]?.name}
      </text>
    </svg>
  );
}

function TraceTable({ study, dataMode }: { study: EcgStudy; dataMode: CardiologyDataMode }) {
  const sampled = study.leads[0]?.points.filter((_, index) => index % 4 === 0) ?? [];
  return (
    <div className="cardio-table-scroll">
      <table className="cardio-table">
        <caption>
          Échantillons du signal ECG{dataMode === "synthetic" ? " synthétique" : ""}
        </caption>
        <thead>
          <tr>
            <th scope="col">Temps (ms)</th>
            <th scope="col">Amplitude (mV)</th>
          </tr>
        </thead>
        <tbody>
          {sampled.map((point) => (
            <tr key={point.millisecond}>
              <td>{point.millisecond}</td>
              <td>{point.millivolt.toLocaleString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface EcgWorkbenchProps extends CardiologyStateProps {
  study: EcgStudy;
  availability?: "available" | "signal-absent" | "device-unavailable";
  onValidate?: () => void;
}

export function EcgWorkbench({
  study,
  state = "ready",
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
  availability = "available",
  onValidate,
}: EcgWorkbenchProps) {
  return (
    <section
      className="cardio-workbench cardio-ecg"
      aria-label="Atelier ECG"
      data-mode={dataMode}
      data-presentation={presentation}
    >
      <WorkbenchHeader
        eyebrow="Signal diagnostique"
        title="Atelier ECG"
        description={`${study.recordedAt} · ${study.speed} · ${study.gain}`}
        status={study.reportStatus}
        actions={<DataOriginBadge origin={study.origin} />}
        presentation={presentation}
      />
      <WorkbenchState state={state} label="Atelier ECG" message={stateMessage}>
        {availability !== "available" || study.quality === "absent" ? (
          <div className="cardio-signal-state" data-state={availability} role="status">
            <span aria-hidden="true">⌁</span>
            <div>
              <h3>
                {availability === "device-unavailable" ? "Appareil indisponible" : "Signal absent"}
              </h3>
              <p>
                {availability === "device-unavailable"
                  ? "La connexion au dispositif d'acquisition est indisponible. Aucun signal temps réel n'est affiché."
                  : "Aucun échantillon interprétable n'est présent. Une nouvelle acquisition est nécessaire."}
              </p>
            </div>
          </div>
        ) : (
          <div className="cardio-ecg__layout">
            <div>
              <div className="cardio-signal-toolbar">
                <span>
                  <strong>Qualité :</strong>{" "}
                  {study.quality === "good"
                    ? "bonne"
                    : study.quality === "acceptable"
                      ? "acceptable"
                      : "médiocre"}
                </span>
                <span>
                  <strong>Source brute :</strong> {study.rawSourceLabel}
                </span>
              </div>
              <ChartTableToggle
                chart={<EcgTrace study={study} dataMode={dataMode} />}
                table={<TraceTable study={study} dataMode={dataMode} />}
              />
            </div>
            <aside className="cardio-diagnostic-rail">
              <div className="cardio-section-heading">
                <div>
                  <p className="cardio-eyebrow">Mesures structurées</p>
                  <h3>Intervalles</h3>
                </div>
              </div>
              <dl className="cardio-measure-list">
                {study.measurements.map((measure) => (
                  <div key={measure.label}>
                    <dt>{measure.label}</dt>
                    <dd>
                      {measure.value}
                      {measure.reference ? <small>{measure.reference}</small> : null}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="cardio-interpretation">
                <ClinicalStatusBadge
                  status={study.reportStatus}
                  label="Interprétation préliminaire"
                />
                <ul>
                  {study.interpretation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <SourceReference>{study.sourceReference}</SourceReference>
            </aside>
          </div>
        )}
        {availability === "available" && study.reportStatus === "preliminary" ? (
          <DecisionCallout
            title="Valider l'interprétation structurée"
            detail="Le texte préliminaire et les mesures automatiques doivent être confrontés au tracé brut."
            owner="Cardiologue lecteur"
            action={
              onValidate ? (
                <button className="cardio-button" type="button" onClick={onValidate}>
                  Valider humainement
                </button>
              ) : undefined
            }
          />
        ) : null}
      </WorkbenchState>
    </section>
  );
}

export interface EchocardiographyWorkbenchProps extends CardiologyStateProps {
  measures: EchocardiographyMeasure[];
  reportStatus?: "preliminary" | "amended" | "validated" | "unknown";
  conclusion?: string;
}

const TREND_LABELS = {
  up: "hausse",
  down: "baisse",
  stable: "stable",
  unknown: "inconnue",
} as const;

export function EchocardiographyWorkbench({
  measures,
  state = "ready",
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
  reportStatus = "unknown",
  conclusion,
}: EchocardiographyWorkbenchProps) {
  return (
    <section
      className="cardio-workbench cardio-echo"
      aria-label="Atelier d'échocardiographie"
      data-mode={dataMode}
      data-presentation={presentation}
    >
      <WorkbenchHeader
        eyebrow="Imagerie structurée"
        title="Échocardiographie"
        description="Mesures actuelles, comparaisons et références"
        status={reportStatus}
        presentation={presentation}
      />
      <WorkbenchState state={state} label="Échocardiographie" message={stateMessage}>
        <div className="cardio-echo__layout">
          <div className="cardio-table-scroll">
            <table className="cardio-table">
              <caption>
                Mesures échocardiographiques{dataMode === "synthetic" ? " synthétiques" : ""} et
                comparaison
              </caption>
              <thead>
                <tr>
                  <th scope="col">Mesure</th>
                  <th scope="col">Actuelle</th>
                  <th scope="col">Précédente</th>
                  <th scope="col">Référence</th>
                  <th scope="col">Tendance</th>
                </tr>
              </thead>
              <tbody>
                {measures.map((measure) => (
                  <tr key={measure.label}>
                    <th scope="row">{measure.label}</th>
                    <td>{measure.value}</td>
                    <td>{measure.previous ?? "—"}</td>
                    <td>{measure.reference ?? "—"}</td>
                    <td>
                      <span className="cardio-trend" data-trend={measure.trend}>
                        <span aria-hidden="true">
                          {measure.trend === "up"
                            ? "↑"
                            : measure.trend === "down"
                              ? "↓"
                              : measure.trend === "stable"
                                ? "→"
                                : "?"}
                        </span>{" "}
                        {TREND_LABELS[measure.trend]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="cardio-report-note">
            <p className="cardio-eyebrow">Conclusion clinique</p>
            <ClinicalStatusBadge status={reportStatus} />
            <p>{conclusion ?? "Conclusion non transmise"}</p>
            <SourceReference>
              {measures[0]?.sourceReference ?? "Observation/unknown"}
            </SourceReference>
          </aside>
        </div>
      </WorkbenchState>
    </section>
  );
}

function pressurePoints(readings: BloodPressureReading[], key: "systolic" | "diastolic") {
  return readings
    .map((reading, index) => {
      const x = 55 + (index / Math.max(1, readings.length - 1)) * 870;
      const y = 235 - ((reading[key] - 45) / 115) * 185;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function PressureChart({ readings }: { readings: BloodPressureReading[] }) {
  const titleId = useId();
  const descriptionId = useId();
  const nightStart = Math.max(
    0,
    readings.findIndex((reading) => reading.period === "night"),
  );
  const nightX = 55 + (nightStart / Math.max(1, readings.length - 1)) * 870;
  return (
    <svg
      className="cardio-pressure-chart"
      viewBox="0 0 980 285"
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>Pressions ambulatoires systolique et diastolique</title>
      <desc id={descriptionId}>
        Courbes pleines avec marqueurs différents. Les seuils sont en pointillés et étiquetés. La
        période nocturne est hachurée.
      </desc>
      <defs>
        <pattern
          id="cardio-night-hatch"
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="9" className="cardio-night-line" />
        </pattern>
      </defs>
      <rect
        x={nightX}
        y="30"
        width={925 - nightX}
        height="205"
        fill="url(#cardio-night-hatch)"
        className="cardio-night-zone"
      />
      {[60, 100, 140, 160].map((value) => {
        const y = 235 - ((value - 45) / 115) * 185;
        return (
          <g key={value}>
            <line x1="55" x2="925" y1={y} y2={y} className="cardio-chart-gridline" />
            <text x="18" y={y + 4} className="cardio-svg-label">
              {value}
            </text>
          </g>
        );
      })}
      <line
        x1="55"
        x2="925"
        y1="90"
        y2="90"
        className="cardio-threshold cardio-threshold--systolic"
      />
      <text x="748" y="84" className="cardio-svg-label">
        Seuil systolique jour 135
      </text>
      <line
        x1="55"
        x2="925"
        y1="170"
        y2="170"
        className="cardio-threshold cardio-threshold--diastolic"
      />
      <text x="748" y="165" className="cardio-svg-label">
        Seuil diastolique jour 85
      </text>
      <polyline
        points={pressurePoints(readings, "systolic")}
        className="cardio-pressure-line cardio-pressure-line--systolic"
      />
      <polyline
        points={pressurePoints(readings, "diastolic")}
        className="cardio-pressure-line cardio-pressure-line--diastolic"
      />
      {readings.map((reading, index) => {
        const x = 55 + (index / Math.max(1, readings.length - 1)) * 870;
        const sysY = 235 - ((reading.systolic - 45) / 115) * 185;
        const diaY = 235 - ((reading.diastolic - 45) / 115) * 185;
        return (
          <g key={reading.at} opacity={reading.valid ? 1 : 0.38}>
            <circle
              cx={x}
              cy={sysY}
              r="4"
              className="cardio-pressure-dot cardio-pressure-dot--systolic"
            />
            <rect
              x={x - 3.5}
              y={diaY - 3.5}
              width="7"
              height="7"
              className="cardio-pressure-dot cardio-pressure-dot--diastolic"
            />
          </g>
        );
      })}
      <g className="cardio-chart-legend">
        <circle
          cx="70"
          cy="270"
          r="4"
          className="cardio-pressure-dot cardio-pressure-dot--systolic"
        />
        <text x="82" y="274">
          Systolique observée
        </text>
        <rect
          x="250"
          y="266"
          width="7"
          height="7"
          className="cardio-pressure-dot cardio-pressure-dot--diastolic"
        />
        <text x="264" y="274">
          Diastolique observée
        </text>
        <line x1="445" x2="475" y1="270" y2="270" className="cardio-threshold" />
        <text x="483" y="274">
          Seuils
        </text>
        <rect x="565" y="263" width="26" height="12" fill="url(#cardio-night-hatch)" />
        <text x="598" y="274">
          Période nocturne
        </text>
      </g>
    </svg>
  );
}

function PressureTable({ readings }: { readings: BloodPressureReading[] }) {
  return (
    <div className="cardio-table-scroll">
      <table className="cardio-table">
        <caption>Mesures de pression ambulatoire</caption>
        <thead>
          <tr>
            <th scope="col">Date/heure</th>
            <th scope="col">Période</th>
            <th scope="col">Systolique (mmHg)</th>
            <th scope="col">Diastolique (mmHg)</th>
            <th scope="col">Pouls (bpm)</th>
            <th scope="col">Qualité</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((reading) => (
            <tr key={reading.at}>
              <th scope="row">
                <time dateTime={reading.at}>{reading.at.slice(11, 16)}</time>
              </th>
              <td>{reading.period === "day" ? "Jour" : "Nuit"}</td>
              <td>{reading.systolic}</td>
              <td>{reading.diastolic}</td>
              <td>{reading.pulse ?? "—"}</td>
              <td>{reading.valid ? "Valide" : "Écartée"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface AmbulatoryBloodPressureChartProps extends CardiologyStateProps {
  readings: BloodPressureReading[];
  deviceAvailable?: boolean;
  origin?: "observed" | "imported";
}

export function AmbulatoryBloodPressureChart({
  readings,
  state = "ready",
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
  deviceAvailable = true,
  origin = "imported",
}: AmbulatoryBloodPressureChartProps) {
  const valid = readings.filter((reading) => reading.valid);
  const day = valid.filter((reading) => reading.period === "day");
  const night = valid.filter((reading) => reading.period === "night");
  const average = (set: BloodPressureReading[], key: "systolic" | "diastolic") =>
    set.length
      ? Math.round(set.reduce((sum, reading) => sum + reading[key], 0) / set.length)
      : undefined;
  return (
    <section
      className="cardio-workbench cardio-pressure"
      aria-label="Pression ambulatoire"
      data-mode={dataMode}
      data-presentation={presentation}
    >
      <WorkbenchHeader
        eyebrow="Exploration ambulatoire"
        title="MAPA · 24 heures"
        description={`${valid.length}/${readings.length} mesures exploitables`}
        actions={<DataOriginBadge origin={origin} />}
        presentation={presentation}
      />
      <WorkbenchState state={state} label="MAPA" message={stateMessage}>
        {!deviceAvailable ? (
          <div className="cardio-signal-state" data-state="device-unavailable" role="status">
            <span aria-hidden="true">⌁</span>
            <div>
              <h3>Appareil indisponible</h3>
              <p>
                Le boîtier MAPA ne transmet pas de nouvelles mesures. Les données importées restent
                consultables.
              </p>
            </div>
          </div>
        ) : null}
        {readings.length > 0 ? (
          <>
            <div className="cardio-stat-strip">
              <div>
                <span>Moyenne jour</span>
                <strong>
                  {average(day, "systolic") ?? "—"} / {average(day, "diastolic") ?? "—"}{" "}
                  <small>mmHg</small>
                </strong>
              </div>
              <div>
                <span>Moyenne nuit</span>
                <strong>
                  {average(night, "systolic") ?? "—"} / {average(night, "diastolic") ?? "—"}{" "}
                  <small>mmHg</small>
                </strong>
              </div>
              <div>
                <span>Mesures écartées</span>
                <strong>{readings.length - valid.length}</strong>
              </div>
            </div>
            <ChartTableToggle
              chart={<PressureChart readings={readings} />}
              table={<PressureTable readings={readings} />}
            />
          </>
        ) : (
          <div className="cardio-signal-state" data-state="signal-absent">
            <span aria-hidden="true">○</span>
            <div>
              <h3>Signal absent</h3>
              <p>Aucune mesure de pression ambulatoire n'a été reçue.</p>
            </div>
          </div>
        )}
      </WorkbenchState>
    </section>
  );
}

function HolterChart({ events }: { events: HolterEvent[] }) {
  const titleId = useId();
  return (
    <svg className="cardio-holter-chart" viewBox="0 0 980 190" role="img" aria-labelledby={titleId}>
      <title id={titleId}>Chronologie des événements Holter sur 24 heures</title>
      <line x1="45" x2="935" y1="105" y2="105" className="cardio-holter-axis" />
      {[0, 4, 8, 12, 16, 20, 24].map((hour) => (
        <g key={hour}>
          <line
            x1={45 + (hour / 24) * 890}
            x2={45 + (hour / 24) * 890}
            y1="98"
            y2="112"
            className="cardio-holter-tick"
          />
          <text x={45 + (hour / 24) * 890} y="132" textAnchor="middle" className="cardio-svg-label">
            {String(hour).padStart(2, "0")}:00
          </text>
        </g>
      ))}
      {events.map((event, index) => {
        const date = new Date(event.at);
        const hour = date.getUTCHours() + date.getUTCMinutes() / 60;
        const x = 45 + (hour / 24) * 890;
        const y = index % 2 === 0 ? 58 : 78;
        return (
          <g
            key={`${event.at}-${event.kind}`}
            className="cardio-holter-event"
            data-kind={event.kind}
          >
            <line x1={x} x2={x} y1={y + 8} y2="105" />
            <path
              d={
                event.kind === "run"
                  ? `M${x - 7},${y} l7,-7 l7,7 l-7,7 z`
                  : event.kind === "pause"
                    ? `M${x - 7},${y - 7} h14 v14 h-14 z`
                    : `M${x},${y - 8} a8,8 0 1,0 .1,0`
              }
            />
            <text x={x} y={y - 14} textAnchor="middle" className="cardio-svg-label">
              {event.label}
            </text>
          </g>
        );
      })}
      <text x="45" y="168" className="cardio-svg-label">
        Formes : cercle = ESV/couplet · losange = salve · carré = pause
      </text>
    </svg>
  );
}

function HolterTable({ events }: { events: HolterEvent[] }) {
  return (
    <div className="cardio-table-scroll">
      <table className="cardio-table">
        <caption>Événements Holter détectés</caption>
        <thead>
          <tr>
            <th scope="col">Heure</th>
            <th scope="col">Type</th>
            <th scope="col">Libellé</th>
            <th scope="col">Durée</th>
            <th scope="col">Statut</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={`${event.at}-${event.kind}`}>
              <th scope="row">
                <time dateTime={event.at}>{event.at.slice(11, 16)}</time>
              </th>
              <td>{event.kind}</td>
              <td>{event.label}</td>
              <td>{event.duration ?? "—"}</td>
              <td>
                <ClinicalStatusBadge status={event.severity} compact />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface HolterSummaryProps extends CardiologyStateProps {
  events: HolterEvent[];
  signalAvailable?: boolean;
  analyzedDuration?: string;
}

export function HolterSummary({
  events,
  state = "ready",
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
  signalAvailable = true,
  analyzedDuration,
}: HolterSummaryProps) {
  const critical = events.filter((event) => event.severity === "critical").length;
  return (
    <section
      className="cardio-workbench cardio-holter"
      aria-label="Synthèse Holter"
      data-mode={dataMode}
      data-presentation={presentation}
    >
      <WorkbenchHeader
        eyebrow="Exploration ambulatoire"
        title="Synthèse Holter"
        description={`Durée analysée : ${analyzedDuration ?? "non transmise"}`}
        status={critical > 0 ? "critical" : "validated"}
        presentation={presentation}
      />
      <WorkbenchState state={state} label="Holter" message={stateMessage}>
        {!signalAvailable ? (
          <div className="cardio-signal-state" data-state="signal-absent" role="status">
            <span aria-hidden="true">⌁</span>
            <div>
              <h3>Signal absent</h3>
              <p>
                Le fichier ne contient aucun segment exploitable. Aucun résumé automatique n'est
                produit.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="cardio-stat-strip">
              <div>
                <span>Événements</span>
                <strong>{events.length}</strong>
              </div>
              <div>
                <span>Critiques</span>
                <strong>{critical}</strong>
              </div>
              <div>
                <span>Validation</span>
                <strong>Humaine requise</strong>
              </div>
            </div>
            <ChartTableToggle
              chart={<HolterChart events={events} />}
              table={<HolterTable events={events} />}
            />
          </>
        )}
      </WorkbenchState>
    </section>
  );
}
