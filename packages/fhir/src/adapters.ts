import type {
  ClinicalPatientSummary,
  ClinicalProvenanceSummary,
  ClinicalStatus,
} from "@clinical-ui/core";
import type {
  CodeableConcept,
  DiagnosticReportStatus,
  HumanName,
  Patient,
  Provenance,
  Reference,
} from "./types";

export interface PatientSummaryOptions {
  identifierSystem?: string;
  asOf?: string;
  locale?: string;
}

export type ReferenceDisplayResolver = (reference: string) => string | undefined;

function firstConceptLabel(concept?: CodeableConcept) {
  return concept?.text ?? concept?.coding?.find((coding) => coding.display)?.display;
}

function referenceLabel(reference: Reference | undefined, resolve?: ReferenceDisplayResolver) {
  if (!reference) return undefined;
  if (reference.display) return reference.display;
  if (reference.reference && resolve) return resolve(reference.reference);
  return reference.reference;
}

export function formatHumanName(name: HumanName | undefined) {
  if (!name) return undefined;
  if (name.text?.trim()) return name.text.trim();
  const given = name.given?.filter(Boolean).join(" ");
  const composed = [given, name.family].filter(Boolean).join(" ").trim();
  return composed || undefined;
}

export function ageAtDate(birthDate: string, asOf: string) {
  const birth = new Date(`${birthDate}T00:00:00Z`);
  const at = new Date(asOf);
  if (Number.isNaN(birth.valueOf()) || Number.isNaN(at.valueOf()) || birth > at) return undefined;

  let age = at.getUTCFullYear() - birth.getUTCFullYear();
  const beforeBirthday =
    at.getUTCMonth() < birth.getUTCMonth() ||
    (at.getUTCMonth() === birth.getUTCMonth() && at.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function patientSummaryFromFhir(
  patient: Patient,
  { identifierSystem, asOf = new Date().toISOString(), locale = "fr" }: PatientSummaryOptions = {},
): ClinicalPatientSummary {
  const preferredName =
    patient.name?.find((name) => name.use === "usual") ??
    patient.name?.find((name) => name.use === "official") ??
    patient.name?.[0];
  const identifier =
    patient.identifier?.find((item) => identifierSystem && item.system === identifierSystem) ??
    patient.identifier?.find((item) => item.use === "official") ??
    patient.identifier?.[0];
  const age = patient.birthDate ? ageAtDate(patient.birthDate, asOf) : undefined;
  const genderLabels: Record<NonNullable<Patient["gender"]>, string> = {
    female: "Femme",
    male: "Homme",
    other: "Autre",
    unknown: "Non renseigné",
  };

  return {
    id: patient.id ?? "patient-without-id",
    label: formatHumanName(preferredName) ?? "Patient sans identité affichable",
    ...(identifier?.value ? { mrn: identifier.value } : {}),
    ...(patient.birthDate ? { birthDate: patient.birthDate } : {}),
    ...(age !== undefined
      ? {
          ageLabel:
            new Intl.NumberFormat(locale).format(age) +
            (locale.startsWith("fr") ? " ans" : " years"),
        }
      : {}),
    ...(patient.gender ? { sexLabel: genderLabels[patient.gender] } : {}),
  };
}

export function clinicalStatusFromDiagnosticReport(status: DiagnosticReportStatus): ClinicalStatus {
  switch (status) {
    case "final":
      return "validated";
    case "amended":
    case "corrected":
    case "appended":
    case "modified":
      return "amended";
    case "registered":
    case "partial":
    case "preliminary":
      return "preliminary";
    case "cancelled":
    case "entered-in-error":
      return "warning";
    default:
      return "unknown";
  }
}

export interface ProvenanceSummaryOptions {
  targetReference?: string;
  resolveDisplay?: ReferenceDisplayResolver;
  deviceReference?: string;
  digest?: string;
  status?: ClinicalStatus;
}

export function provenanceSummaryFromFhir(
  provenance: Provenance,
  {
    targetReference,
    resolveDisplay,
    deviceReference,
    digest,
    status = "unknown",
  }: ProvenanceSummaryOptions = {},
): ClinicalProvenanceSummary {
  const target =
    provenance.target.find((item) => item.reference === targetReference) ?? provenance.target[0];
  const author =
    provenance.agent.find((agent) => {
      const type = firstConceptLabel(agent.type)?.toLowerCase();
      return type?.includes("author") || type?.includes("auteur");
    }) ?? provenance.agent[0];
  const source = provenance.entity?.find((entity) => entity.role === "source")?.what;
  const recordedAt = provenance.recorded ?? provenance.occurredDateTime;
  const authorLabel = referenceLabel(author?.who, resolveDisplay);
  const methodLabel = firstConceptLabel(provenance.activity);
  const sourceLabel = referenceLabel(source, resolveDisplay);

  return {
    resourceReference: target?.reference ?? "Resource/unknown",
    status,
    ...(recordedAt ? { recordedAt } : {}),
    ...(authorLabel ? { author: authorLabel } : {}),
    ...(methodLabel ? { method: methodLabel } : {}),
    ...(deviceReference ? { device: resolveDisplay?.(deviceReference) ?? deviceReference } : {}),
    ...(sourceLabel ? { source: sourceLabel } : {}),
    ...(provenance.meta?.versionId ? { version: provenance.meta.versionId } : {}),
    ...(digest ? { digest } : {}),
  };
}
