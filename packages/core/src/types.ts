export type ClinicalStatus =
  | "validated"
  | "preliminary"
  | "amended"
  | "warning"
  | "critical"
  | "unknown";

export interface ClinicalPatientSummary {
  id: string;
  label: string;
  mrn?: string;
  birthDate?: string;
  ageLabel?: string;
  sexLabel?: string;
}

export interface ClinicalEncounterSummary {
  id?: string;
  effectiveAt: string;
  service?: string;
  practitioner?: string;
}

export interface ClinicalProvenanceSummary {
  resourceReference: string;
  status: ClinicalStatus;
  recordedAt?: string;
  author?: string;
  method?: string;
  device?: string;
  source?: string;
  version?: string;
  digest?: string;
}
