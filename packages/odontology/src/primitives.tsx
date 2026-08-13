import type { ReactNode } from "react";
import type {
  DentalEvidenceKind,
  DentalStateProps,
  DentalUiState,
  ToothStatus,
  TreatmentSessionStatus,
} from "./types";

const evidenceConfig: Record<DentalEvidenceKind, { symbol: string; label: string }> = {
  observed: { symbol: "●", label: "Observé" },
  imported: { symbol: "◆", label: "Importé" },
  derived: { symbol: "✎", label: "Dérivé" },
  projected: { symbol: "◌", label: "Projeté" },
  preliminary: { symbol: "△", label: "Préliminaire" },
  validated: { symbol: "✓", label: "Validé" },
};

export const toothStatusConfig: Record<ToothStatus, { symbol: string; label: string }> = {
  sound: { symbol: "○", label: "Saine" },
  caries: { symbol: "●", label: "Carie" },
  filled: { symbol: "◒", label: "Obturation" },
  crown: { symbol: "♙", label: "Couronne" },
  missing: { symbol: "–", label: "Absente" },
  extracted: { symbol: "×", label: "Extraite" },
  implant: { symbol: "‡", label: "Implant" },
  endodontic: { symbol: "│", label: "Traitement endodontique" },
  bridge: { symbol: "⌒", label: "Bridge" },
  unerupted: { symbol: "⋯", label: "Non éruptée" },
};

export const sessionStatusConfig: Record<
  TreatmentSessionStatus,
  { symbol: string; label: string }
> = {
  planned: { symbol: "◌", label: "Planifiée" },
  "in-progress": { symbol: "◐", label: "En cours" },
  completed: { symbol: "✓", label: "Réalisée" },
  cancelled: { symbol: "×", label: "Annulée" },
  postponed: { symbol: "Ⅱ", label: "Reportée" },
};

export function toothLateralityLabel(fdi: string) {
  const quadrant = fdi[0];
  if (["1", "5"].includes(quadrant ?? "")) return "Supérieur droit · côté patient";
  if (["2", "6"].includes(quadrant ?? "")) return "Supérieur gauche · côté patient";
  if (["3", "7"].includes(quadrant ?? "")) return "Inférieur gauche · côté patient";
  if (["4", "8"].includes(quadrant ?? "")) return "Inférieur droit · côté patient";
  return "Latéralité non déterminée";
}

export function EvidenceBadge({ kind }: { kind: DentalEvidenceKind }) {
  const config = evidenceConfig[kind];
  return (
    <span className="od-evidence" data-evidence={kind}>
      <span aria-hidden="true">{config.symbol}</span>
      {config.label}
    </span>
  );
}

export function ToothStatusBadge({ status }: { status: ToothStatus }) {
  const config = toothStatusConfig[status];
  return (
    <span className="od-tooth-status" data-tooth-status={status}>
      <span aria-hidden="true">{config.symbol}</span>
      {config.label}
    </span>
  );
}

export function SessionStatusBadge({ status }: { status: TreatmentSessionStatus }) {
  const config = sessionStatusConfig[status];
  return (
    <span className="od-session-status" data-session-status={status}>
      <span aria-hidden="true">{config.symbol}</span>
      {config.label}
    </span>
  );
}

export function DentalPanel({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={["od-panel", className].filter(Boolean).join(" ")}>
      <header className="od-panel__header">
        <div>
          <p className="od-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {description ? <p className="od-panel__description">{description}</p> : null}
        </div>
        {actions ? <div className="od-panel__actions">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}

const stateConfig: Record<Exclude<DentalUiState, "ready">, { symbol: string; title: string }> = {
  loading: { symbol: "⋯", title: "Chargement des données dentaires" },
  empty: { symbol: "○", title: "Aucune donnée dentaire" },
  error: { symbol: "!", title: "Données dentaires indisponibles" },
  forbidden: { symbol: "⊘", title: "Accès non autorisé" },
};

export function DentalStateBoundary({
  state = "ready",
  stateMessage,
  children,
}: DentalStateProps & { children: ReactNode }) {
  if (state === "ready") return <>{children}</>;
  const config = stateConfig[state];
  return (
    <div
      className="od-state"
      data-state={state}
      role={state === "error" ? "alert" : "status"}
      aria-live={state === "loading" ? "polite" : undefined}
    >
      <span className="od-state__symbol" aria-hidden="true">
        {config.symbol}
      </span>
      <strong>{config.title}</strong>
      <p>{stateMessage ?? defaultStateMessage(state)}</p>
      {state === "loading" ? <span className="od-state__bar" aria-hidden="true" /> : null}
    </div>
  );
}

function defaultStateMessage(state: Exclude<DentalUiState, "ready">) {
  switch (state) {
    case "loading":
      return "Synchronisation FHIR R5 en cours…";
    case "empty":
      return "Aucune observation ne correspond à ce contexte clinique.";
    case "error":
      return "Vérifiez la source puis relancez le chargement.";
    case "forbidden":
      return "Votre rôle ne permet pas de consulter ces informations.";
  }
}

export function SyntheticFlag() {
  return <span className="od-synthetic-flag">Données 100 % synthétiques</span>;
}

export function EvidenceLegend() {
  return (
    <section className="od-evidence-legend" aria-label="Légende de maturité et provenance">
      {(Object.keys(evidenceConfig) as DentalEvidenceKind[]).map((kind) => (
        <EvidenceBadge key={kind} kind={kind} />
      ))}
    </section>
  );
}
