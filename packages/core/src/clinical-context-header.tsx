import { CalendarDays, Fingerprint, Stethoscope, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { ClinicalStatusBadge } from "./clinical-status-badge";
import { ClinicalInfoTooltip, ClinicalTooltipProvider } from "./clinical-tooltip";
import type { ClinicalEncounterSummary, ClinicalPatientSummary, ClinicalStatus } from "./types";

export interface ClinicalContextHeaderProps {
  patient: ClinicalPatientSummary;
  encounter?: ClinicalEncounterSummary;
  status?: ClinicalStatus;
  title?: string;
  sourceLabel?: string;
  actions?: ReactNode;
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="cui-context-detail">
      <dt>
        {icon}
        <span>{label}</span>
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

export function ClinicalContextHeader({
  patient,
  encounter,
  status = "unknown",
  title = "Contexte clinique",
  sourceLabel,
  actions,
}: ClinicalContextHeaderProps) {
  const demographics = [patient.ageLabel, patient.sexLabel].filter(Boolean).join(" · ");

  return (
    <ClinicalTooltipProvider>
      <header className="cui-context-header">
        <div className="cui-context-header__identity">
          <div className="cui-context-avatar" aria-hidden="true">
            <UserRound size={22} strokeWidth={1.9} />
          </div>
          <div className="cui-context-header__patient">
            <div className="cui-context-header__kicker">
              <span>{title}</span>
              {sourceLabel ? <span className="cui-context-source">{sourceLabel}</span> : null}
            </div>
            <div className="cui-context-header__name-row">
              <h2>{patient.label}</h2>
              <ClinicalStatusBadge status={status} compact />
              <ClinicalInfoTooltip label="Comprendre le statut clinique">
                Le statut décrit la maturité de la donnée affichée. Il ne remplace pas la validation
                médicale.
              </ClinicalInfoTooltip>
            </div>
            {demographics ? <p>{demographics}</p> : null}
          </div>
        </div>

        <dl className="cui-context-header__details">
          {patient.mrn ? (
            <Detail icon={<Fingerprint aria-hidden="true" size={15} />} label="Identifiant patient">
              <span className="cui-data-value">{patient.mrn}</span>
            </Detail>
          ) : null}
          {patient.birthDate ? (
            <Detail icon={<CalendarDays aria-hidden="true" size={15} />} label="Date de naissance">
              <time dateTime={patient.birthDate}>{patient.birthDate}</time>
            </Detail>
          ) : null}
          {encounter ? (
            <Detail
              icon={<Stethoscope aria-hidden="true" size={15} />}
              label={encounter.service ?? "Épisode de soins"}
            >
              <time dateTime={encounter.effectiveAt}>{encounter.effectiveAt}</time>
              {encounter.practitioner ? <span> · {encounter.practitioner}</span> : null}
            </Detail>
          ) : null}
        </dl>

        {actions ? <div className="cui-context-header__actions">{actions}</div> : null}
      </header>
    </ClinicalTooltipProvider>
  );
}
