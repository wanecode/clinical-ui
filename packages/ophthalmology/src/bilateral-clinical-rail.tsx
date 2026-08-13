import { ClinicalStatusBadge } from "@clinical-ui/core";
import { DataModeStamp, EyeLabel, Metric, OphthalmologyDataBoundary } from "./primitives";
import type { BilateralAlert, ClinicalDataState, EyeSummary, OphthalmologyDataMode } from "./types";

export interface BilateralClinicalRailProps {
  right?: EyeSummary | undefined;
  left?: EyeSummary | undefined;
  alerts?: BilateralAlert[];
  state?: ClinicalDataState;
  compact?: boolean;
  dataMode?: OphthalmologyDataMode;
}

function EyeColumn({ eye, fallback }: { eye?: EyeSummary | undefined; fallback: "OD" | "OG" }) {
  if (!eye) {
    return (
      <section
        className="oph-bilateral-eye"
        data-missing="true"
        aria-label={`${fallback} non documenté`}
      >
        <EyeLabel eye={fallback} long />
        <div className="oph-eye-empty">
          <span aria-hidden="true">○</span>
          <strong>Œil non documenté</strong>
          <small>Aucune donnée latéralisée disponible</small>
        </div>
      </section>
    );
  }

  return (
    <section
      className="oph-bilateral-eye"
      aria-label={eye.eye === "OD" ? "Œil droit" : "Œil gauche"}
    >
      <header>
        <EyeLabel eye={eye.eye} long />
        <ClinicalStatusBadge status={eye.status ?? "unknown"} compact />
      </header>
      <dl className="oph-metric-grid">
        <Metric label="Acuité corrigée" value={eye.visualAcuity} />
        <Metric label="Pression" value={eye.iop} unit="mmHg" />
        <Metric label="Pachymétrie" value={eye.pachymetry} unit="µm" />
        <Metric label="Pupille" value={eye.pupil} />
        <Metric label="Segment antérieur" value={eye.anteriorSegment} />
        <Metric label="Gonioscopie" value={eye.gonioscopy} />
        <Metric label="Fond d’œil" value={eye.fundus} />
      </dl>
      {eye.sources?.length ? (
        <details className="oph-source-details">
          <summary>
            <span>Provenance FHIR</span>
            <strong>
              {eye.sources.length} source{eye.sources.length > 1 ? "s" : ""}
            </strong>
          </summary>
          <ul>
            {eye.sources.map((source) => (
              <li key={`${source.label}-${source.reference}`}>
                <span>{source.label}</span>
                <code>{source.reference}</code>
                {source.context ? <small>{source.context}</small> : null}
              </li>
            ))}
          </ul>
        </details>
      ) : (
        <p className="oph-source-line">
          <span>Source</span>
          <code>{eye.source ?? "Non renseignée"}</code>
        </p>
      )}
    </section>
  );
}

export function BilateralClinicalRail({
  right,
  left,
  alerts = [],
  state = "ready",
  compact = false,
  dataMode = "clinical",
}: BilateralClinicalRailProps) {
  const discordant = Boolean(
    right?.sourceContext && left?.sourceContext && right.sourceContext !== left.sourceContext,
  );

  return (
    <OphthalmologyDataBoundary state={state} label="Comparaison bilatérale">
      <article className="oph-bilateral" data-compact={compact || undefined}>
        <header className="oph-workbench-heading">
          <div>
            <p className="oph-kicker">Rail clinique bilatéral</p>
            <h2>Lecture OD / OG</h2>
            <p>Deux yeux, une seule trajectoire clinique lisible.</p>
          </div>
          <DataModeStamp mode={dataMode} />
        </header>

        {discordant ? (
          <div className="oph-inline-notice" data-tone="information" role="status">
            <span aria-hidden="true">↯</span>
            <span>
              <strong>Sources distinctes.</strong> Vérifier dates et dispositifs avant comparaison.
            </span>
          </div>
        ) : null}

        <div className="oph-bilateral__grid">
          <EyeColumn eye={right} fallback="OD" />
          <aside className="oph-binocular-axis" aria-label="Synthèse binoculaire">
            <div className="oph-binocular-glyph" aria-hidden="true">
              <span>○</span>
              <i />
              <span>○</span>
            </div>
            <strong>Binoculaire</strong>
            <span>{right && left ? "Comparaison active" : "Monoculaire"}</span>
            {alerts.map((alert) => (
              <div className="oph-bilateral-alert" data-severity={alert.severity} key={alert.id}>
                <span aria-hidden="true">{alert.severity === "critical" ? "!" : "△"}</span>
                <div>
                  <strong>{alert.label}</strong>
                  <small>{alert.detail}</small>
                </div>
              </div>
            ))}
          </aside>
          <EyeColumn eye={left} fallback="OG" />
        </div>
      </article>
    </OphthalmologyDataBoundary>
  );
}
