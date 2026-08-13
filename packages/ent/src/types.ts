import type {
  CodeableConcept,
  FhirMeta,
  FhirResource,
  Identifier,
  Reference,
} from "@clinical-ui/fhir";

export type EntDisplayState =
  | "ready"
  | "loading"
  | "empty"
  | "error"
  | "forbidden"
  | "partial"
  | "not-calculable";

export type EntDataMode = "clinical" | "synthetic";
export type EntPresentation = "standalone" | "embedded";

export interface EntHostPresentationProps {
  dataMode?: EntDataMode;
  presentation?: EntPresentation;
}

export type EntDataMaturity =
  | "observed"
  | "imported"
  | "derived"
  | "projected"
  | "preliminary"
  | "validated";

export type EntLaterality = "right" | "left" | "bilateral" | "midline" | "unknown";
export type EarSide = Extract<EntLaterality, "right" | "left">;

export interface EntSourceReference {
  reference: string;
  maturity: EntDataMaturity;
  recordedAt: string;
  author?: string;
}

export interface QuestionnaireScore {
  code: string;
  label: string;
  score: number;
  maximum: number;
  source: EntSourceReference;
}

export interface AudiogramPoint {
  frequencyHz: number;
  thresholdDbHl: number;
  side: EarSide;
  conduction: "air" | "bone";
  masked?: boolean;
  noResponse?: boolean;
  source: EntSourceReference;
}

export interface SpeechAudiometryResult {
  side: EarSide;
  srtDbHl?: number;
  wordRecognitionPercent?: number;
  presentationLevelDbHl?: number;
  source: EntSourceReference;
}

export interface AudiogramDataset {
  id: string;
  status: "preliminary" | "signed" | "unknown";
  device: string;
  calibrationDate: string;
  quality: "acceptable" | "limited" | "unknown";
  transducer: string;
  points: AudiogramPoint[];
  speech: SpeechAudiometryResult[];
  previousAirPoints?: AudiogramPoint[];
}

export interface TympanogramResult {
  side: EarSide;
  peakPressureDapa?: number;
  complianceMl?: number;
  canalVolumeMl?: number;
  gradientDapa?: number;
  curveType?: "A" | "As" | "Ad" | "B" | "C";
  source: EntSourceReference;
}

export interface AcousticReflexResult {
  side: EarSide;
  stimulus: "ipsilateral" | "contralateral";
  frequencyHz: number;
  thresholdDbHl?: number;
  outcome: "present" | "absent" | "not-tested";
}

export interface MiddleEarDataset {
  device: string;
  probeToneHz?: number;
  quality: "acceptable" | "limited" | "unknown";
  tympanograms: TympanogramResult[];
  reflexes: AcousticReflexResult[];
}

export interface EndoscopyMedia {
  id: string;
  title: string;
  availability: "available" | "unavailable" | "restricted";
  laterality: EntLaterality;
  bodySite: string;
  capturedAt?: string;
  consent: "recorded" | "missing" | "withdrawn";
  /** URL of host-authorized media. The component never invents clinical imagery. */
  imageUrl?: string;
  /** Explicit fixture provenance for demos and Storybook. */
  synthetic?: boolean;
  source: EntSourceReference;
}

export interface VestibularFinding {
  test: string;
  result: string;
  side: EntLaterality;
  maturity: EntDataMaturity;
}

export interface VoiceSwallowingFinding {
  domain: "voice" | "swallowing";
  measure: string;
  value: string;
  maturity: EntDataMaturity;
}

export interface RhinologyDataset {
  duration: string;
  laterality: EntLaterality;
  riskFactors: string[];
  redFlags: string[];
  questionnaire?: QuestionnaireScore;
  rightNasalScore?: number;
  leftNasalScore?: number;
}

export interface SleepDataset {
  questionnaires: QuestionnaireScore[];
  importedAhi?: number;
  importedAt?: string;
  signalsAvailable: string[];
  signalsMissing: string[];
}

export interface OncologyTimelineEvent {
  id: string;
  at: string;
  title: string;
  detail: string;
  kind: "lesion" | "specimen" | "staging" | "coordination" | "procedure" | "report";
  maturity: EntDataMaturity;
  signedBy?: string;
  sourceReference: string;
}

export interface SafetyChecklistItem {
  id: string;
  label: string;
  group: "pre-procedure" | "implant" | "postoperative" | "emergency";
  status: "checked" | "pending" | "not-applicable";
  checkedBy?: string;
  checkedAt?: string;
}

export interface EndoscopeTraceabilityRecord {
  scopeIdentifier: string;
  procedureReference: string;
  cycleIdentifier: string;
  leakTest: "passed" | "failed" | "not-recorded";
  cleaning: "complete" | "incomplete" | "not-recorded";
  disinfection: "released" | "quarantined" | "pending" | "not-recorded";
  operator?: string;
  releasedAt?: string;
  vigilanceAcknowledged?: boolean;
}

export interface Quantity {
  value?: number;
  unit?: string;
  system?: string;
  code?: string;
}

export interface Annotation {
  authorReference?: Reference;
  time?: string;
  text: string;
}

export interface ObservationComponent {
  code: CodeableConcept;
  valueQuantity?: Quantity;
  valueString?: string;
  dataAbsentReason?: CodeableConcept;
}

export interface EntObservation extends FhirResource {
  resourceType: "Observation";
  status: "registered" | "preliminary" | "final" | "amended" | "cancelled" | "unknown";
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  effectiveDateTime?: string;
  issued?: string;
  performer?: Reference[];
  device?: Reference;
  bodySite?: CodeableConcept;
  valueQuantity?: Quantity;
  valueString?: string;
  component?: ObservationComponent[];
  note?: Annotation[];
  derivedFrom?: Reference[];
}

export interface QuestionnaireResponseItemAnswer {
  valueInteger?: number;
  valueString?: string;
  valueBoolean?: boolean;
}

export interface QuestionnaireResponseItem {
  linkId: string;
  text?: string;
  answer?: QuestionnaireResponseItemAnswer[];
}

export interface EntQuestionnaireResponse extends FhirResource {
  resourceType: "QuestionnaireResponse";
  identifier?: Identifier;
  questionnaire: string;
  status: "in-progress" | "completed" | "amended" | "entered-in-error" | "stopped";
  subject?: Reference;
  authored?: string;
  author?: Reference;
  item?: QuestionnaireResponseItem[];
}

export interface EntProcedure extends FhirResource {
  resourceType: "Procedure";
  status: "preparation" | "in-progress" | "not-done" | "on-hold" | "stopped" | "completed";
  code?: CodeableConcept;
  subject: Reference;
  occurrenceDateTime?: string;
  performer?: Array<{ actor: Reference; function?: CodeableConcept }>;
  used?: Reference[];
  report?: Reference[];
  complication?: CodeableConcept[];
  note?: Annotation[];
}

export interface EntSpecimen extends FhirResource {
  resourceType: "Specimen";
  identifier?: Identifier[];
  status?: "available" | "unavailable" | "unsatisfactory" | "entered-in-error";
  type?: CodeableConcept;
  subject?: Reference;
  receivedTime?: string;
  collection?: { collectedDateTime?: string; bodySite?: CodeableConcept; collector?: Reference };
}

export interface Attachment {
  contentType?: string;
  url?: string;
  title?: string;
  creation?: string;
}

export interface EntDocumentReference extends FhirResource {
  resourceType: "DocumentReference";
  status: "current" | "superseded" | "entered-in-error";
  docStatus?: "preliminary" | "final" | "amended" | "entered-in-error";
  type?: CodeableConcept;
  subject?: Reference;
  date?: string;
  author?: Reference[];
  content: Array<{ attachment: Attachment }>;
}

export interface EntBundle extends FhirResource {
  resourceType: "Bundle";
  type: "collection";
  timestamp?: string;
  entry: Array<{ fullUrl?: string; resource: FhirResource }>;
}

export interface EntSyntheticMeta extends FhirMeta {
  tag: Array<{ system: string; code: "synthetic"; display: string }>;
}
