import type { ClinicalStatus } from "@clinical-ui/core";
import type { CodeableConcept, FhirMeta, Reference } from "@clinical-ui/fhir";

export type CardiologyViewState = "ready" | "loading" | "empty" | "error" | "forbidden";
export type CardiologyDataMode = "clinical" | "synthetic";
export type CardiologyPresentation = "standalone" | "embedded";

export interface CardiologyHostPresentationProps {
  /** Identifies whether the host supplied real clinical data or demo fixtures. */
  dataMode?: CardiologyDataMode;
  /** Embedded workbenches delegate their module heading and outer surface to the host. */
  presentation?: CardiologyPresentation;
}

export interface CardiologyStateProps extends CardiologyHostPresentationProps {
  state?: CardiologyViewState;
  /** Lets the host explain loading, absence, access, or retrieval failures precisely. */
  stateMessage?: string;
}

export type CardiologyDataOrigin = "observed" | "imported" | "derived" | "projected";

export interface Quantity {
  value: number;
  unit: string;
  system?: string;
  code?: string;
}

export interface ObservationComponent {
  code: CodeableConcept;
  valueQuantity?: Quantity;
  valueString?: string;
}

export interface CardiologyObservation {
  resourceType: "Observation";
  id: string;
  meta: FhirMeta;
  status: "registered" | "preliminary" | "final" | "amended" | "corrected";
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject: Reference;
  effectiveDateTime: string;
  issued?: string;
  performer?: Reference[];
  valueQuantity?: Quantity;
  valueString?: string;
  component?: ObservationComponent[];
  interpretation?: CodeableConcept[];
  note?: Array<{ text: string }>;
  device?: Reference;
  derivedFrom?: Reference[];
}

export interface CardiologyRiskAssessment {
  resourceType: "RiskAssessment";
  id: string;
  meta: FhirMeta;
  status: "registered" | "preliminary" | "final" | "amended";
  subject: Reference;
  occurrenceDateTime: string;
  method: CodeableConcept;
  basis: Reference[];
  prediction?: Array<{
    outcome: CodeableConcept;
    probabilityDecimal?: number;
    whenRange?: { low?: Quantity; high?: Quantity };
    rationale?: string;
  }>;
  note?: Array<{ text: string }>;
}

export type CodeableReference =
  | { concept: CodeableConcept; reference?: never }
  | { reference: Reference; concept?: never };

export interface CardiologyMedicationRequest {
  resourceType: "MedicationRequest";
  id: string;
  meta: FhirMeta;
  status: "active" | "on-hold" | "ended" | "stopped" | "draft";
  intent: "proposal" | "plan" | "order";
  medication: CodeableReference;
  subject: Reference;
  authoredOn: string;
  requester?: Reference;
  dosageInstruction?: Array<{ text?: string }>;
  reason?: CodeableReference[];
}

export interface CardiologyDetectedIssue {
  resourceType: "DetectedIssue";
  id: string;
  meta: FhirMeta;
  status: "preliminary" | "final" | "entered-in-error";
  severity?: "high" | "moderate" | "low";
  code: CodeableConcept;
  subject: Reference;
  identifiedDateTime: string;
  implicated?: Reference[];
  detail?: string;
  mitigation?: Array<{
    action: CodeableConcept;
    date?: string;
    author?: Reference;
  }>;
}

export interface RiskScoreInput {
  id: string;
  label: string;
  value?: string;
  sourceReference?: string;
  origin: CardiologyDataOrigin;
}

export interface RiskScoreModel {
  name: string;
  version: string;
  status: "calculated" | "incomplete" | "not-calculated";
  value?: number;
  unit: "%";
  horizon: string;
  inputs: RiskScoreInput[];
  missingInputs: string[];
  sourceReference: string;
}

export interface SummaryDatum {
  id: string;
  label: string;
  value: string;
  detail?: string;
  status: ClinicalStatus;
  origin: CardiologyDataOrigin;
  sourceReference: string;
}

export interface TracePoint {
  millisecond: number;
  millivolt: number;
}

export interface EcgLead {
  name: string;
  points: TracePoint[];
}

export interface EcgStudy {
  id: string;
  recordedAt: string;
  speed: string;
  gain: string;
  quality: "good" | "acceptable" | "poor" | "absent";
  origin: CardiologyDataOrigin;
  rawSourceLabel: string;
  sourceReference: string;
  deviceLabel?: string;
  leads: EcgLead[];
  measurements: Array<{ label: string; value: string; reference?: string }>;
  interpretation: string[];
  reportStatus: ClinicalStatus;
}

export interface EchocardiographyMeasure {
  label: string;
  value: string;
  previous?: string;
  reference?: string;
  trend: "up" | "down" | "stable" | "unknown";
  sourceReference: string;
}

export interface BloodPressureReading {
  at: string;
  period: "day" | "night";
  systolic: number;
  diastolic: number;
  pulse?: number;
  valid: boolean;
}

export interface HolterEvent {
  at: string;
  kind: "pvc" | "couplet" | "run" | "pause" | "artifact";
  label: string;
  severity: ClinicalStatus;
  duration?: string;
}

export interface TrajectoryEvent {
  id: string;
  at: string;
  lane: "symptom" | "imaging" | "treatment" | "device" | "report";
  title: string;
  detail: string;
  origin: CardiologyDataOrigin;
  status: ClinicalStatus;
  sourceReference: string;
}

export interface PrescriptionSafetyItem {
  id: string;
  medication: string;
  dosage: string;
  status: "confirmed" | "to-confirm" | "on-hold";
  interaction?: string;
  renalNote?: string;
  sourceReference: string;
}

export interface DeviceTimelineEvent {
  id: string;
  at: string;
  title: string;
  detail: string;
  origin: CardiologyDataOrigin;
  status: ClinicalStatus;
  sourceReference: string;
}

export interface ReportLifecycleItem {
  id: string;
  at: string;
  title: string;
  status: "preliminary" | "amended" | "signed";
  author: string;
  version: string;
  sourceReference: string;
  changeSummary?: string;
}

export interface VigilanceItem {
  id: string;
  at: string;
  title: string;
  detail: string;
  severity: "warning" | "critical";
  owner?: string;
  dueAt?: string;
  status: "open" | "acknowledged" | "resolved";
  sourceReference: string;
}
