import { ClinicalStatusBadge } from "@clinical-ui/core";
import type { ReactNode } from "react";
import type {
  PediatricsDataMode,
  PediatricsDataOrigin,
  PediatricsPresentation,
  PediatricsViewState,
} from "./types";

const ORIGIN_LABELS: Record<PediatricsDataOrigin, string> = {
  "patient-reported": "Déclaré par l’enfant",
  "caregiver-reported": "Rapporté par le responsable",
  observed: "Observé",
  imported: "Importé",
  derived: "Dérivé",
  projected: "Projeté",
};

const STATE_COPY: Record<
  Exclude<PediatricsViewState, "ready">,
  { title: string; detail: string; glyph: string }
> = {
  loading: {
    title: "Chargement des données pédiatriques",
    detail: "Les ressources cliniques sont en cours de lecture.",
    glyph: "⋯",
  },
  empty: {
    title: "Aucune donnée disponible",
    detail: "Aucune donnée compatible n’est documentée pour ce contexte.",
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

export function PediatricsOriginBadge({ origin }: { origin: PediatricsDataOrigin }) {
  return (
    <span className="peds-origin" data-origin={origin}>
      <span className="peds-origin__mark" aria-hidden="true" />
      {ORIGIN_LABELS[origin]}
    </span>
  );
}

export function PediatricsSourceReference({ children }: { children: ReactNode }) {
  return <code className="peds-source">{children}</code>;
}

export function PediatricsSyntheticNotice({ dataMode }: { dataMode: PediatricsDataMode }) {
  return dataMode === "synthetic" ? (
    <span className="peds-synthetic">
      <span aria-hidden="true">◇</span> Données synthétiques
    </span>
  ) : null;
}

export function PediatricsWorkbenchShell({
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
  status?: "validated" | "preliminary" | "amended" | "warning" | "critical" | "unknown";
  state?: PediatricsViewState;
  stateMessage?: string;
  dataMode?: PediatricsDataMode;
  presentation?: PediatricsPresentation;
  children: ReactNode;
}) {
  const ready = state === "ready";
  const stateCopy = ready ? undefined : STATE_COPY[state];
  return (
    <section
      className="peds-workbench"
      data-mode={dataMode}
      data-presentation={presentation}
      data-state={state}
    >
      {presentation === "standalone" ? (
        <header className="peds-header">
          <div>
            <p className="peds-eyebrow">{eyebrow}</p>
            <div className="peds-header__title">
              <h2>{title}</h2>
              {ready ? <ClinicalStatusBadge status={status} compact /> : null}
            </div>
            <p className="peds-header__description">{description}</p>
          </div>
          <PediatricsSyntheticNotice dataMode={dataMode} />
        </header>
      ) : ready && (status !== "unknown" || dataMode === "synthetic") ? (
        <div className="peds-header peds-header--embedded">
          {status !== "unknown" ? <ClinicalStatusBadge status={status} compact /> : null}
          <PediatricsSyntheticNotice dataMode={dataMode} />
        </div>
      ) : null}
      {ready ? (
        children
      ) : (
        <section
          className="peds-state"
          data-state={state}
          aria-busy={state === "loading"}
          aria-live={state === "loading" ? "polite" : "off"}
        >
          <span className="peds-state__glyph" aria-hidden="true">
            {stateCopy?.glyph}
          </span>
          <p className="peds-eyebrow">{eyebrow}</p>
          <h3>{stateCopy?.title}</h3>
          <p>{stateMessage ?? stateCopy?.detail}</p>
        </section>
      )}
    </section>
  );
}

export function PediatricsEmptyValue({ label = "Non documenté" }: { label?: string }) {
  return (
    <span className="peds-empty-value">
      <span aria-hidden="true">—</span> {label}
    </span>
  );
}

export function PediatricsSeverityMark({
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
    <span className="peds-severity" data-severity={severity}>
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
