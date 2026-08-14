import { ClinicalStatusBadge } from "@clinical-ui/core";
import { type ReactNode, useId, useState } from "react";
import type {
  CardiologyDataMode,
  CardiologyDataOrigin,
  CardiologyPresentation,
  CardiologyViewState,
} from "./types";

const ORIGIN_LABELS: Record<CardiologyDataOrigin, string> = {
  observed: "Observé",
  imported: "Importé",
  derived: "Dérivé",
  projected: "Projeté",
};

export function DataOriginBadge({ origin }: { origin: CardiologyDataOrigin }) {
  return (
    <span className="cardio-origin" data-origin={origin}>
      <span className="cardio-origin__mark" aria-hidden="true" />
      {ORIGIN_LABELS[origin]}
    </span>
  );
}

const STATE_COPY: Record<
  Exclude<CardiologyViewState, "ready">,
  { title: string; detail: string }
> = {
  loading: {
    title: "Chargement des données cardiologiques",
    detail: "Les ressources FHIR R5 sont en cours de lecture.",
  },
  empty: {
    title: "Aucune donnée disponible",
    detail: "Aucune ressource compatible n'est associée à cet épisode de soins.",
  },
  error: {
    title: "Données temporairement indisponibles",
    detail: "La source clinique n'a pas pu être lue. Les décisions restent suspendues.",
  },
  forbidden: {
    title: "Accès non autorisé",
    detail: "Votre rôle ne permet pas de consulter ces données cardiologiques.",
  },
};

export function WorkbenchState({
  state,
  label,
  message,
  children,
}: {
  state: CardiologyViewState;
  label: string;
  message?: string | undefined;
  children: ReactNode;
}) {
  if (state === "ready") return <>{children}</>;
  const copy = STATE_COPY[state];
  return (
    <section
      className="cardio-state"
      aria-busy={state === "loading"}
      aria-live={state === "loading" ? "polite" : "off"}
      data-state={state}
    >
      <span className="cardio-state__glyph" aria-hidden="true">
        {state === "loading" ? "⋯" : state === "empty" ? "○" : state === "forbidden" ? "⊘" : "!"}
      </span>
      <p className="cardio-eyebrow">{label}</p>
      <h3>{copy.title}</h3>
      <p>{message ?? copy.detail}</p>
    </section>
  );
}

export function WorkbenchHeader({
  eyebrow,
  title,
  description,
  status,
  actions,
  presentation = "standalone",
}: {
  eyebrow: string;
  title: string;
  description: string;
  status?: "validated" | "preliminary" | "amended" | "warning" | "critical" | "unknown";
  actions?: ReactNode;
  presentation?: CardiologyPresentation;
}) {
  if (presentation === "embedded") {
    return status || actions ? (
      <div className="cardio-header cardio-header--embedded">
        {status ? <ClinicalStatusBadge status={status} compact /> : null}
        {actions ? <div className="cardio-header__actions">{actions}</div> : null}
      </div>
    ) : null;
  }
  return (
    <header className="cardio-header">
      <div>
        <p className="cardio-eyebrow">{eyebrow}</p>
        <div className="cardio-header__title">
          <h2>{title}</h2>
          {status ? <ClinicalStatusBadge status={status} compact /> : null}
        </div>
        <p className="cardio-header__description">{description}</p>
      </div>
      {actions ? <div className="cardio-header__actions">{actions}</div> : null}
    </header>
  );
}

export function SourceReference({ children }: { children: ReactNode }) {
  return <code className="cardio-source-reference">{children}</code>;
}

export function ChartTableToggle({
  chart,
  table,
  chartLabel = "Afficher la courbe",
  tableLabel = "Afficher le tableau",
  defaultView = "chart",
}: {
  chart: ReactNode;
  table: ReactNode;
  chartLabel?: string;
  tableLabel?: string;
  defaultView?: "chart" | "table";
}) {
  const [view, setView] = useState<"chart" | "table">(defaultView);
  const panelId = useId();
  return (
    <div className="cardio-chart-toggle">
      <fieldset className="cardio-segmented">
        <legend className="cardio-visually-hidden">Mode de visualisation</legend>
        <button
          type="button"
          aria-controls={panelId}
          aria-pressed={view === "chart"}
          onClick={() => setView("chart")}
        >
          Courbe
        </button>
        <button
          type="button"
          aria-controls={panelId}
          aria-pressed={view === "table"}
          onClick={() => setView("table")}
        >
          Tableau
        </button>
      </fieldset>
      <section id={panelId} aria-label={view === "chart" ? chartLabel : tableLabel}>
        {view === "chart" ? chart : table}
      </section>
    </div>
  );
}

export function DecisionCallout({
  title,
  detail,
  owner,
  critical = false,
  action,
}: {
  title: string;
  detail: string;
  owner: string;
  critical?: boolean;
  action?: ReactNode;
}) {
  return (
    <aside className="cardio-decision" data-critical={critical}>
      <span className="cardio-decision__mark" aria-hidden="true">
        !
      </span>
      <div>
        <p className="cardio-eyebrow">Décision humaine requise</p>
        <h3>{title}</h3>
        <p>{detail}</p>
        <p className="cardio-decision__owner">Responsable : {owner}</p>
      </div>
      {action ? <div className="cardio-decision__action">{action}</div> : null}
    </aside>
  );
}

export function SyntheticNotice({ dataMode = "clinical" }: { dataMode?: CardiologyDataMode }) {
  if (dataMode !== "synthetic") return null;
  return (
    <span className="cardio-synthetic">
      <span aria-hidden="true">◇</span> Données synthétiques
    </span>
  );
}
