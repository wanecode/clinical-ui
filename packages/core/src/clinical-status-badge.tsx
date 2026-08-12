import {
  CheckCircle2,
  CircleAlert,
  CircleHelp,
  Clock3,
  FilePenLine,
  TriangleAlert,
} from "lucide-react";
import type { HTMLAttributes } from "react";
import type { ClinicalStatus } from "./types";

const STATUS_LABELS: Record<ClinicalStatus, string> = {
  validated: "Validé",
  preliminary: "Préliminaire",
  amended: "Corrigé",
  warning: "À surveiller",
  critical: "Critique",
  unknown: "Statut inconnu",
};

const STATUS_ICONS = {
  validated: CheckCircle2,
  preliminary: Clock3,
  amended: FilePenLine,
  warning: TriangleAlert,
  critical: CircleAlert,
  unknown: CircleHelp,
} satisfies Record<ClinicalStatus, typeof CheckCircle2>;

export interface ClinicalStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: ClinicalStatus;
  label?: string;
  compact?: boolean;
}

export function getClinicalStatusLabel(status: ClinicalStatus) {
  return STATUS_LABELS[status];
}

export function ClinicalStatusBadge({
  status,
  label = STATUS_LABELS[status],
  compact = false,
  className,
  ...props
}: ClinicalStatusBadgeProps) {
  const Icon = STATUS_ICONS[status];
  const classes = ["cui-status-badge", compact ? "cui-status-badge--compact" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <span {...props} className={classes} data-status={status}>
      <Icon aria-hidden="true" size={compact ? 13 : 14} strokeWidth={2.25} />
      <span>{label}</span>
    </span>
  );
}
