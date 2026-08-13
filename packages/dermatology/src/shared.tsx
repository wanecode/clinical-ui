import type { ReactNode } from "react";
import type { DermatologyDataOrigin, DermatologyViewState } from "./types";

export function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const stateCopy: Record<
  Exclude<DermatologyViewState, "ready">,
  { icon: string; title: string; message: string }
> = {
  loading: {
    icon: "◌",
    title: "Chargement des données dermatologiques",
    message: "Les ressources FHIR R5 sont en cours de préparation.",
  },
  empty: {
    icon: "○",
    title: "Aucune donnée disponible",
    message: "Aucune ressource ne correspond à cet épisode de soins.",
  },
  error: {
    icon: "!",
    title: "Données indisponibles",
    message: "La récupération a échoué. Vérifiez la connexion puis réessayez.",
  },
  forbidden: {
    icon: "⊘",
    title: "Accès interdit",
    message: "Votre rôle ou le consentement actif ne permet pas d’afficher ces données.",
  },
};

export function DermatologyStateSurface({
  state,
  message,
  children,
  compact = false,
}: {
  state: DermatologyViewState;
  message?: string | undefined;
  children: ReactNode;
  compact?: boolean;
}) {
  if (state === "ready") return children;
  const copy = stateCopy[state];
  return (
    <section
      className={joinClasses("derm-state", compact && "derm-state--compact")}
      data-state={state}
      aria-busy={state === "loading" || undefined}
      aria-live={state === "error" ? "assertive" : "polite"}
    >
      <span className="derm-state__icon" aria-hidden="true">
        {copy.icon}
      </span>
      <div>
        <h3>{copy.title}</h3>
        <p>{message ?? copy.message}</p>
      </div>
    </section>
  );
}

export function SyntheticBadge({ label = "Données synthétiques" }: { label?: string }) {
  return (
    <span className="derm-synthetic-badge">
      <span aria-hidden="true">◇</span>
      {label}
    </span>
  );
}

export function PanelHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string | undefined;
  action?: ReactNode;
}) {
  return (
    <header className="derm-panel-heading">
      <div>
        <p className="derm-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description ? <p className="derm-panel-heading__description">{description}</p> : null}
      </div>
      {action ? <div className="derm-panel-heading__action">{action}</div> : null}
    </header>
  );
}

const originLabels: Record<DermatologyDataOrigin, string> = {
  observed: "Observé",
  imported: "Importé",
  derived: "Dérivé",
  projected: "Projeté",
};

export function DataOriginBadge({ origin }: { origin: DermatologyDataOrigin }) {
  return (
    <span className="derm-origin" data-origin={origin}>
      <span aria-hidden="true">
        {origin === "observed"
          ? "●"
          : origin === "imported"
            ? "↓"
            : origin === "derived"
              ? "◆"
              : "◇"}
      </span>
      {originLabels[origin]}
    </span>
  );
}

export function ReportStatus({ status }: { status: string | undefined }) {
  const normalized =
    status === "final" || status === "validated" || status === "completed"
      ? "validated"
      : status === "amended" || status === "corrected"
        ? "amended"
        : status === "critical"
          ? "critical"
          : "preliminary";
  const labels = {
    validated: "Validé",
    amended: "Amendé",
    preliminary: "Préliminaire",
    critical: "Critique",
  } as const;
  return (
    <span className="derm-report-status" data-status={normalized}>
      <span aria-hidden="true">
        {normalized === "validated"
          ? "✓"
          : normalized === "amended"
            ? "↺"
            : normalized === "critical"
              ? "!"
              : "◷"}
      </span>
      {labels[normalized]}
    </span>
  );
}

export function SectionFrame({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string | undefined;
  label?: string | undefined;
}) {
  return (
    <section className={joinClasses("derm-panel", className)} aria-label={label}>
      {children}
    </section>
  );
}
