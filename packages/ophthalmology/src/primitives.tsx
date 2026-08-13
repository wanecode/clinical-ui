import { ClinicalStatusBadge } from "@clinical-ui/core";
import type { HTMLAttributes, ReactNode } from "react";
import type { ClinicalDataState, Eye, OphthalmologyDataMode } from "./types";

export interface OphthalmologyDataBoundaryProps {
  state?: ClinicalDataState;
  children: ReactNode;
  label?: string;
}

const STATE_CONTENT: Record<
  Exclude<ClinicalDataState, "ready" | "partial">,
  [string, string, string]
> = {
  loading: [
    "◌",
    "Chargement de l’examen",
    "Les données ophtalmologiques sont en cours de préparation.",
  ],
  empty: ["○", "Aucune donnée", "Aucune mesure n’est disponible pour cette période."],
  error: [
    "!",
    "Données indisponibles",
    "La source n’a pas pu être lue. Réessayer ou consulter la traçabilité.",
  ],
  forbidden: ["⊘", "Accès restreint", "Votre rôle ne permet pas d’afficher ces données cliniques."],
};

export function OphthalmologyDataBoundary({
  state = "ready",
  children,
  label = "module",
}: OphthalmologyDataBoundaryProps) {
  if (state !== "ready" && state !== "partial") {
    const [symbol, title, detail] = STATE_CONTENT[state];
    return (
      <section className="oph-data-state" data-state={state} aria-busy={state === "loading"}>
        <span className="oph-data-state__symbol" aria-hidden="true">
          {symbol}
        </span>
        <div>
          <p className="oph-data-state__title">{title}</p>
          <p>{detail}</p>
        </div>
        <span className="oph-data-state__context">{label}</span>
      </section>
    );
  }

  return (
    <div className="oph-data-boundary" data-partial={state === "partial" || undefined}>
      {state === "partial" ? (
        <div className="oph-inline-notice" data-tone="warning" role="status">
          <span aria-hidden="true">△</span>
          <span>
            <strong>Données partielles.</strong> Les valeurs absentes restent explicitement
            signalées.
          </span>
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function SyntheticStamp({ compact = false }: { compact?: boolean }) {
  return (
    <span className="oph-synthetic-stamp" data-compact={compact || undefined}>
      <span aria-hidden="true">◇</span> 100 % synthétique
    </span>
  );
}

export function DataModeStamp({
  mode,
  compact = false,
}: {
  mode: OphthalmologyDataMode;
  compact?: boolean;
}) {
  return mode === "synthetic" ? <SyntheticStamp compact={compact} /> : null;
}

export function EyeLabel({ eye, long = false }: { eye: Eye; long?: boolean }) {
  return (
    <span className="oph-eye-label" data-eye={eye}>
      <strong>{eye}</strong>
      {long ? <span>{eye === "OD" ? "Œil droit" : "Œil gauche"}</span> : null}
    </span>
  );
}

export interface OphthalmologyPanelProps extends HTMLAttributes<HTMLElement> {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  as?: "section" | "article";
}

export function OphthalmologyPanel({
  title,
  eyebrow,
  action,
  children,
  as: Component = "section",
  className,
  ...props
}: OphthalmologyPanelProps) {
  return (
    <Component {...props} className={["oph-panel", className].filter(Boolean).join(" ")}>
      <header className="oph-panel__header">
        <div>
          {eyebrow ? <p className="oph-kicker">{eyebrow}</p> : null}
          <h3>{title}</h3>
        </div>
        {action ? <div className="oph-panel__action">{action}</div> : null}
      </header>
      <div className="oph-panel__body">{children}</div>
    </Component>
  );
}

export function Metric({
  label,
  value,
  unit,
  missing = false,
}: {
  label: string;
  value?: string | number | undefined;
  unit?: string;
  missing?: boolean;
}) {
  return (
    <div className="oph-metric" data-missing={missing || value === undefined || undefined}>
      <dt>{label}</dt>
      <dd>
        <span>{value ?? "Non mesuré"}</span>
        {unit && value !== undefined ? <small>{unit}</small> : null}
      </dd>
    </div>
  );
}

export function StatusLine({
  status,
  children,
}: {
  status: "validated" | "preliminary" | "amended" | "warning" | "critical" | "unknown";
  children: ReactNode;
}) {
  return (
    <div className="oph-status-line">
      <ClinicalStatusBadge status={status} compact />
      <span>{children}</span>
    </div>
  );
}
