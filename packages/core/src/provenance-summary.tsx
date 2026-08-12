import {
  Cpu,
  Database,
  FileClock,
  GitCommitHorizontal,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";
import { type ReactNode, useId } from "react";
import { ClinicalStatusBadge } from "./clinical-status-badge";
import type { ClinicalProvenanceSummary } from "./types";

export interface ProvenanceSummaryProps {
  provenance: ClinicalProvenanceSummary;
  heading?: string;
}

function ProvenanceDatum({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: ReactNode;
  label: string;
  value?: string | undefined;
  mono?: boolean;
}) {
  return (
    <div className="cui-provenance-datum" data-missing={!value || undefined}>
      <dt>
        {icon}
        {label}
      </dt>
      <dd className={mono ? "cui-data-value" : undefined}>{value ?? "Non renseigné"}</dd>
    </div>
  );
}

export function ProvenanceSummary({ provenance, heading = "Traçabilité" }: ProvenanceSummaryProps) {
  const headingId = useId();

  return (
    <section className="cui-provenance" aria-labelledby={headingId}>
      <header className="cui-provenance__header">
        <div>
          <p className="cui-eyebrow">FHIR Provenance</p>
          <h3 id={headingId}>{heading}</h3>
        </div>
        <ClinicalStatusBadge status={provenance.status} compact />
      </header>

      <p className="cui-provenance__target">
        <Database aria-hidden="true" size={15} />
        <span>Ressource</span>
        <code>{provenance.resourceReference}</code>
      </p>

      <dl className="cui-provenance__grid">
        <ProvenanceDatum
          icon={<UserRoundCog aria-hidden="true" size={15} />}
          label="Auteur"
          value={provenance.author}
        />
        <ProvenanceDatum
          icon={<FileClock aria-hidden="true" size={15} />}
          label="Enregistré"
          value={provenance.recordedAt}
        />
        <ProvenanceDatum
          icon={<Cpu aria-hidden="true" size={15} />}
          label="Dispositif / méthode"
          value={provenance.device ?? provenance.method}
        />
        <ProvenanceDatum
          icon={<GitCommitHorizontal aria-hidden="true" size={15} />}
          label="Version"
          value={provenance.version}
          mono
        />
      </dl>

      {provenance.digest ? (
        <div className="cui-provenance__digest">
          <ShieldCheck aria-hidden="true" size={15} />
          <span>Empreinte</span>
          <code>{provenance.digest}</code>
        </div>
      ) : null}
    </section>
  );
}
