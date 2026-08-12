export interface FhirMeta {
  versionId?: string;
  lastUpdated?: string;
  tag?: Coding[];
  security?: Coding[];
}

export interface FhirResource {
  resourceType: string;
  id?: string;
  meta?: FhirMeta;
}

export interface Coding {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Reference {
  reference?: string;
  type?: string;
  display?: string;
}

export interface Identifier {
  use?: "usual" | "official" | "temp" | "secondary" | "old";
  system?: string;
  value?: string;
}

export interface HumanName {
  use?: "usual" | "official" | "temp" | "nickname" | "anonymous" | "old" | "maiden";
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
}

export interface Patient extends FhirResource {
  resourceType: "Patient";
  identifier?: Identifier[];
  name?: HumanName[];
  gender?: "male" | "female" | "other" | "unknown";
  birthDate?: string;
}

export type DiagnosticReportStatus =
  | "registered"
  | "partial"
  | "preliminary"
  | "modified"
  | "final"
  | "amended"
  | "corrected"
  | "appended"
  | "cancelled"
  | "entered-in-error"
  | "unknown";

export interface DiagnosticReport extends FhirResource {
  resourceType: "DiagnosticReport";
  identifier?: Identifier[];
  basedOn?: Reference[];
  status: DiagnosticReportStatus;
  code: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  effectiveDateTime?: string;
  issued?: string;
  performer?: Reference[];
  resultsInterpreter?: Reference[];
  result?: Reference[];
  conclusion?: string;
}

export interface ProvenanceAgent {
  type?: CodeableConcept;
  role?: CodeableConcept[];
  who: Reference;
  onBehalfOf?: Reference;
}

export interface ProvenanceEntity {
  role: "revision" | "quotation" | "source" | "instantiates" | "removal";
  what: Reference;
  agent?: ProvenanceAgent[];
}

export interface Provenance extends FhirResource {
  resourceType: "Provenance";
  target: Reference[];
  occurredDateTime?: string;
  recorded?: string;
  activity?: CodeableConcept;
  agent: ProvenanceAgent[];
  entity?: ProvenanceEntity[];
}

export interface Device extends FhirResource {
  resourceType: "Device";
  identifier?: Identifier[];
  displayName?: string;
  manufacturer?: string;
  serialNumber?: string;
}
