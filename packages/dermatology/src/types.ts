import type {
  CodeableConcept,
  Coding,
  FhirMeta,
  FhirResource,
  Identifier,
  Reference,
} from "@clinical-ui/fhir";

export type DermatologyViewState = "ready" | "loading" | "empty" | "error" | "forbidden";
export type DermatologyDataOrigin = "observed" | "imported" | "derived" | "projected";
export type BodyMapView = "anterior" | "posterior" | "left-lateral" | "right-lateral";
export type DermatologyDataMode = "clinical" | "synthetic";
export type DermatologyPresentation = "standalone" | "embedded";

export interface DermatologyHostPresentationProps {
  /** Explicitly identifies whether the host supplied clinical data or demo fixtures. */
  dataMode?: DermatologyDataMode;
  /** Embedded workbenches delegate their module heading and outer surface to the host. */
  presentation?: DermatologyPresentation;
}

export interface DermatologyExtension {
  url: string;
  valueBoolean?: boolean;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueInteger?: number;
  valueString?: string;
  valueReference?: Reference;
}

export interface DermatologyQuantity {
  value?: number;
  comparator?: "<" | "<=" | ">=" | ">";
  unit?: string;
  system?: string;
  code?: string;
}

export interface DermatologyCodeableReference {
  concept?: CodeableConcept;
  reference?: Reference;
}

export interface DermatologyAttachment {
  contentType?: string;
  language?: string;
  url?: string;
  title?: string;
  creation?: string;
  extension?: DermatologyExtension[];
}

export interface DermatologyBodyStructure extends FhirResource {
  resourceType: "BodyStructure";
  meta?: FhirMeta;
  identifier?: Identifier[];
  active?: boolean;
  morphology?: CodeableConcept;
  includedStructure: Array<{
    structure: CodeableConcept;
    laterality?: CodeableConcept;
    qualifier?: CodeableConcept[];
    bodyLandmarkOrientation?: Array<{
      landmarkDescription?: CodeableConcept[];
      surfaceOrientation?: CodeableConcept[];
    }>;
  }>;
  patient: Reference;
  description?: string;
  extension?: DermatologyExtension[];
}

export type DermatologyObservationStatus =
  | "registered"
  | "preliminary"
  | "final"
  | "amended"
  | "corrected"
  | "cancelled"
  | "entered-in-error"
  | "unknown";

export interface DermatologyObservationComponent {
  code: CodeableConcept;
  valueBoolean?: boolean;
  valueCodeableConcept?: CodeableConcept;
  valueInteger?: number;
  valueQuantity?: DermatologyQuantity;
  valueString?: string;
  interpretation?: CodeableConcept[];
  extension?: DermatologyExtension[];
}

export interface DermatologyObservation extends FhirResource {
  resourceType: "Observation";
  meta?: FhirMeta;
  identifier?: Identifier[];
  status: DermatologyObservationStatus;
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  focus?: Reference[];
  effectiveDateTime?: string;
  issued?: string;
  performer?: Reference[];
  valueBoolean?: boolean;
  valueCodeableConcept?: CodeableConcept;
  valueInteger?: number;
  valueQuantity?: DermatologyQuantity;
  valueString?: string;
  interpretation?: CodeableConcept[];
  note?: Array<{ text: string }>;
  component?: DermatologyObservationComponent[];
  derivedFrom?: Reference[];
  extension?: DermatologyExtension[];
}

export interface DermatologyConsent extends FhirResource {
  resourceType: "Consent";
  meta?: FhirMeta;
  status: "draft" | "active" | "inactive" | "not-done" | "entered-in-error" | "unknown";
  category: CodeableConcept[];
  subject?: Reference;
  date?: string;
  decision?: "deny" | "permit";
  controller?: Reference[];
  sourceAttachment?: DermatologyAttachment[];
  provision?: Array<{
    period?: { start?: string; end?: string };
    purpose?: Coding[];
    actor?: Array<{ role: CodeableConcept; reference: Reference }>;
  }>;
  extension?: DermatologyExtension[];
}

export interface DermatologyDocumentReference extends FhirResource {
  resourceType: "DocumentReference";
  meta?: FhirMeta;
  status: "current" | "superseded" | "entered-in-error";
  docStatus?:
    | "registered"
    | "partial"
    | "preliminary"
    | "final"
    | "amended"
    | "corrected"
    | "appended"
    | "cancelled"
    | "entered-in-error"
    | "deprecated"
    | "unknown";
  type?: CodeableConcept;
  subject?: Reference;
  date?: string;
  author?: Reference[];
  description?: string;
  content: Array<{
    attachment: DermatologyAttachment;
    profile?: Array<{ valueCoding?: Coding }>;
  }>;
  context?: Reference[];
  event?: DermatologyCodeableReference[];
  bodySite?: DermatologyCodeableReference[];
  extension?: DermatologyExtension[];
}

export interface DermatologyProcedure extends FhirResource {
  resourceType: "Procedure";
  meta?: FhirMeta;
  identifier?: Identifier[];
  status:
    | "preparation"
    | "in-progress"
    | "not-done"
    | "on-hold"
    | "stopped"
    | "completed"
    | "entered-in-error"
    | "unknown";
  code: CodeableConcept;
  subject: Reference;
  focus?: Reference;
  occurrenceDateTime?: string;
  performer?: Array<{ actor: Reference; function?: CodeableConcept }>;
  reason?: DermatologyCodeableReference[];
  report?: Reference[];
  note?: Array<{ text: string }>;
  extension?: DermatologyExtension[];
}

export interface DermatologyMedicationRequest extends FhirResource {
  resourceType: "MedicationRequest";
  meta?: FhirMeta;
  identifier?: Identifier[];
  status:
    | "active"
    | "on-hold"
    | "ended"
    | "stopped"
    | "completed"
    | "cancelled"
    | "entered-in-error"
    | "draft"
    | "unknown";
  intent:
    | "proposal"
    | "plan"
    | "order"
    | "original-order"
    | "reflex-order"
    | "filler-order"
    | "instance-order"
    | "option";
  medication: DermatologyCodeableReference;
  subject: Reference;
  authoredOn?: string;
  requester?: Reference;
  dosageInstruction?: Array<{ text?: string }>;
  reason?: DermatologyCodeableReference[];
  extension?: DermatologyExtension[];
}

export interface DermatologyDetectedIssue extends FhirResource {
  resourceType: "DetectedIssue";
  meta?: FhirMeta;
  status: "preliminary" | "final" | "entered-in-error" | "mitigated";
  category?: CodeableConcept[];
  code?: CodeableConcept;
  severity?: "high" | "moderate" | "low";
  subject?: Reference;
  identifiedDateTime?: string;
  implicated?: Reference[];
  detail?: string;
  mitigation?: Array<{
    action: CodeableConcept;
    date?: string;
    author?: Reference;
  }>;
  extension?: DermatologyExtension[];
}

export type DermatologyResource =
  | DermatologyBodyStructure
  | DermatologyObservation
  | DermatologyConsent
  | DermatologyDocumentReference
  | DermatologyProcedure
  | DermatologyMedicationRequest
  | DermatologyDetectedIssue;

export interface LesionPlacement {
  view: BodyMapView;
  x: number;
  y: number;
}

export interface DermatologyStateProps extends DermatologyHostPresentationProps {
  state?: DermatologyViewState;
  stateMessage?: string;
}
