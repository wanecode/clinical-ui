import { type ReactNode, useId } from "react";
import type { EntDataMaturity, EntDisplayState, EntLaterality } from "./types";

const STATE_CONTENT: Record<
  Exclude<EntDisplayState, "ready">,
  { eyebrow: string; title: string; detail: string }
> = {
  loading: {
    eyebrow: "Chargement",
    title: "Récupération des données ORL",
    detail:
      "Les ressources FHIR sont en cours de lecture. Aucun résultat intermédiaire n’est déduit.",
  },
  empty: {
    eyebrow: "Vide",
    title: "Aucune donnée disponible",
    detail: "Le dossier ne contient pas encore de donnée affichable pour ce module.",
  },
  error: {
    eyebrow: "Erreur",
    title: "Données temporairement illisibles",
    detail:
      "La ressource source n’a pas pu être interprétée. Les valeurs précédentes ne sont pas substituées.",
  },
  forbidden: {
    eyebrow: "Accès interdit",
    title: "Contenu clinique restreint",
    detail:
      "Votre contexte d’accès ne permet pas d’afficher ces données. Aucune vignette n’est révélée.",
  },
  partial: {
    eyebrow: "Série partielle",
    title: "Acquisition incomplète",
    detail:
      "Seules les mesures effectivement reçues sont présentées. Les absences restent visibles.",
  },
  "not-calculable": {
    eyebrow: "Non calculable",
    title: "Résultat dérivé indisponible",
    detail: "Les entrées gouvernées sont insuffisantes. Aucune valeur n’a été imputée.",
  },
};

const MATURITY_LABELS: Record<EntDataMaturity, string> = {
  observed: "Observé",
  imported: "Importé",
  derived: "Dérivé",
  projected: "Projeté",
  preliminary: "Préliminaire",
  validated: "Validé",
};

const LATERALITY_LABELS: Record<EntLaterality, string> = {
  right: "Droite",
  left: "Gauche",
  bilateral: "Bilatéral",
  midline: "Médian",
  unknown: "Non précisée",
};

export interface EntWorkbenchFrameProps {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
  status?: string;
  statusTone?: "neutral" | "pending" | "success" | "warning";
  actions?: ReactNode;
  className?: string;
}

export function EntWorkbenchFrame({
  title,
  eyebrow,
  description,
  children,
  status = "Données synthétiques",
  statusTone = "neutral",
  actions,
  className,
}: EntWorkbenchFrameProps) {
  const titleId = useId();
  return (
    <section
      className={["ent-workbench", className].filter(Boolean).join(" ")}
      aria-labelledby={titleId}
    >
      <header className="ent-workbench__header">
        <div className="ent-workbench__heading">
          <p className="ent-eyebrow">{eyebrow}</p>
          <h2 id={titleId}>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="ent-workbench__meta">
          <span className="ent-status" data-tone={statusTone}>
            <span aria-hidden="true" className="ent-status__mark" />
            {status}
          </span>
          {actions ? <div className="ent-workbench__actions">{actions}</div> : null}
        </div>
      </header>
      {children}
      <footer className="ent-workbench__footer">
        <span>Données entièrement synthétiques</span>
        <span>Aucun diagnostic automatique</span>
      </footer>
    </section>
  );
}

export function EntStatePanel({
  state,
  compact = false,
}: {
  state: Exclude<EntDisplayState, "ready">;
  compact?: boolean;
}) {
  const content = STATE_CONTENT[state];
  const isError = state === "error";
  return (
    <div
      className="ent-state"
      data-compact={compact || undefined}
      data-state={state}
      role={isError ? "alert" : "status"}
    >
      <span className="ent-state__glyph" aria-hidden="true">
        {state === "loading"
          ? "···"
          : state === "forbidden"
            ? "×"
            : state === "error"
              ? "!"
              : state === "partial"
                ? "½"
                : state === "not-calculable"
                  ? "∅"
                  : "—"}
      </span>
      <div>
        <p>{content.eyebrow}</p>
        <strong>{content.title}</strong>
        <span>{content.detail}</span>
      </div>
    </div>
  );
}

export function DataMaturityBadge({ maturity }: { maturity: EntDataMaturity }) {
  return (
    <span className="ent-maturity" data-maturity={maturity}>
      <span aria-hidden="true" className="ent-maturity__mark" />
      {MATURITY_LABELS[maturity]}
    </span>
  );
}

export function LateralityMark({ laterality }: { laterality: EntLaterality }) {
  const abbreviated =
    laterality === "right"
      ? "D"
      : laterality === "left"
        ? "G"
        : laterality === "bilateral"
          ? "D/G"
          : "·";
  return (
    <span className="ent-laterality" data-laterality={laterality}>
      <span aria-hidden="true">{abbreviated}</span>
      {LATERALITY_LABELS[laterality]}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="ent-segments">
      <legend className="ent-visually-hidden">{label}</legend>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}

export function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="ent-metric">
      <dt>{label}</dt>
      <dd>
        <span className="ent-metric__value">{value}</span>
        {note ? <small className="ent-metric__note">{note}</small> : null}
      </dd>
    </div>
  );
}

export function SourceLine({ reference }: { reference: string }) {
  return (
    <code className="ent-source" title={reference}>
      {reference}
    </code>
  );
}
