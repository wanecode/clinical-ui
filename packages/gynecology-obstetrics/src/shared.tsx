import type { ClinicalStatus } from "@clinical-ui/core";
import { ClinicalStatusBadge } from "@clinical-ui/core";
import type { ReactNode } from "react";
import type {
  GynecologyObstetricsDataMode,
  GynecologyObstetricsOrigin,
  GynecologyObstetricsPresentation,
  GynecologyObstetricsViewState,
} from "./types";

const ORIGIN_LABELS: Record<GynecologyObstetricsOrigin, string> = {
  "patient-reported": "Déclaré par la patiente",
  observed: "Observé",
  imported: "Importé",
  derived: "Dérivé",
  projected: "Projeté",
};

const STATE_COPY: Record<
  Exclude<GynecologyObstetricsViewState, "ready">,
  { title: string; detail: string; glyph: string }
> = {
  loading: {
    title: "Chargement du parcours clinique",
    detail: "Les ressources sont en cours de lecture.",
    glyph: "⋯",
  },
  empty: {
    title: "Aucune donnée disponible",
    detail: "Aucune donnée compatible n’est documentée.",
    glyph: "○",
  },
  error: {
    title: "Données temporairement indisponibles",
    detail: "La source clinique n’a pas pu être lue.",
    glyph: "!",
  },
  forbidden: {
    title: "Accès non autorisé",
    detail: "Le rôle actif ne permet pas de consulter ces informations.",
    glyph: "⊘",
  },
};

export function GynecologyObstetricsOriginBadge({
  origin,
}: {
  origin: GynecologyObstetricsOrigin;
}) {
  return (
    <span className="go-origin" data-origin={origin}>
      <span className="go-origin__mark" aria-hidden="true" />
      {ORIGIN_LABELS[origin]}
    </span>
  );
}

export function GynecologyObstetricsSourceReference({ children }: { children: ReactNode }) {
  return <code className="go-source">{children}</code>;
}

export function GynecologyObstetricsSeverity({
  severity,
}: {
  severity: "normal" | "information" | "warning" | "critical" | "unknown";
}) {
  const labels = {
    normal: "Dans la référence",
    information: "Information",
    warning: "À surveiller",
    critical: "Critique",
    unknown: "Non qualifié",
  } as const;
  return (
    <span className="go-severity" data-severity={severity}>
      <span aria-hidden="true">
        {severity === "normal"
          ? "✓"
          : severity === "critical"
            ? "!!"
            : severity === "warning"
              ? "!"
              : "○"}
      </span>
      {labels[severity]}
    </span>
  );
}

export function GynecologyObstetricsEmptyValue({ label = "Non documenté" }: { label?: string }) {
  return (
    <span className="go-empty">
      <span aria-hidden="true">—</span> {label}
    </span>
  );
}

export function GynecologyObstetricsShell({
  eyebrow,
  title,
  description,
  status = "unknown",
  state = "ready",
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  status?: ClinicalStatus;
  state?: GynecologyObstetricsViewState;
  stateMessage?: string;
  dataMode?: GynecologyObstetricsDataMode;
  presentation?: GynecologyObstetricsPresentation;
  children: ReactNode;
}) {
  const ready = state === "ready";
  const stateCopy = ready ? undefined : STATE_COPY[state];
  const syntheticNotice =
    dataMode === "synthetic" ? (
      <span className="go-synthetic">
        <span aria-hidden="true">◇</span>Données synthétiques
      </span>
    ) : null;
  return (
    <section
      className="go-workbench"
      data-mode={dataMode}
      data-presentation={presentation}
      data-state={state}
    >
      {presentation === "standalone" ? (
        <header className="go-header">
          <div>
            <p className="go-eyebrow">{eyebrow}</p>
            <div className="go-header__title">
              <h2>{title}</h2>
              {ready ? <ClinicalStatusBadge status={status} compact /> : null}
            </div>
            <p className="go-header__description">{description}</p>
          </div>
          {syntheticNotice}
        </header>
      ) : ready && (status !== "unknown" || syntheticNotice) ? (
        <div className="go-header go-header--embedded">
          {status !== "unknown" ? <ClinicalStatusBadge status={status} compact /> : null}
          {syntheticNotice}
        </div>
      ) : null}
      {ready ? (
        children
      ) : (
        <section
          className="go-state"
          data-state={state}
          aria-busy={state === "loading"}
          aria-live={state === "loading" ? "polite" : "off"}
        >
          <span className="go-state__glyph" aria-hidden="true">
            {stateCopy?.glyph}
          </span>
          <p className="go-eyebrow">{eyebrow}</p>
          <h3>{stateCopy?.title}</h3>
          <p>{stateMessage ?? stateCopy?.detail}</p>
        </section>
      )}
    </section>
  );
}
