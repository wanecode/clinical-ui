import type { ClinicalStatus } from "@clinical-ui/core";

export type Eye = "OD" | "OG";
export type Laterality = Eye | "OU";
export type ClinicalDataState = "ready" | "loading" | "empty" | "error" | "forbidden" | "partial";
export type OphthalmologyDataMode = "clinical" | "synthetic";
export type DataKind = "observed" | "imported" | "derived" | "projected";

export interface EyeSource {
  label: string;
  reference: string;
  context?: string;
  status?: ClinicalStatus;
}

export interface EyeSummary {
  eye: Eye;
  visualAcuity?: string | undefined;
  iop?: number | undefined;
  pachymetry?: number | undefined;
  pupil?: string | undefined;
  anteriorSegment?: string | undefined;
  gonioscopy?: string | undefined;
  fundus?: string | undefined;
  source?: string | undefined;
  sourceContext?: string | undefined;
  sources?: EyeSource[];
  status?: ClinicalStatus | undefined;
}

export interface BilateralAlert {
  id: string;
  severity: "information" | "warning" | "critical";
  label: string;
  detail: string;
}

export interface AcuityReading {
  eye: Eye;
  distanceUncorrected?: number | undefined;
  distanceCorrected?: number | undefined;
  pinhole?: number | undefined;
  near?: string | undefined;
  scale: "decimal" | "logmar";
  status: ClinicalStatus;
  note?: string | undefined;
}

export interface RefractionReading {
  eye: Eye;
  sphere?: number | undefined;
  cylinder?: number | undefined;
  axis?: number | undefined;
  addition?: number | undefined;
  vertexDistance?: number | undefined;
  status: ClinicalStatus;
}

export interface TrajectoryPoint {
  id: string;
  date: string;
  value: number;
  eye: Eye;
  kind: DataKind;
  source: string;
  status: ClinicalStatus;
}

export interface GlaucomaProgressionData {
  iop: TrajectoryPoint[];
  rnfl: TrajectoryPoint[];
  targetIop?: number;
  targetIopByEye?: Partial<Record<Eye, number>>;
  stageByEye?: Partial<Record<Eye, string>>;
  visualField: Array<{
    date: string;
    eye: Eye;
    md: number;
    psd?: number;
    vfi?: number;
    reliability?: string;
  }>;
  vigilance?: {
    tone: "information" | "warning" | "critical";
    label: string;
    detail?: string;
  };
}

export interface RetinaImage {
  id: string;
  date: string;
  eye: Eye;
  modality: "OCT" | "Fundus" | "OCTA";
  quality: "good" | "insufficient" | "unavailable";
  qualityLabel: string;
  source: string;
  cst?: number;
  note?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface RetinaCareEvent {
  id: string;
  date: string;
  kind: "visit" | "imaging" | "injection" | "amsler";
  label: string;
  status: ClinicalStatus;
}

export interface CorneaMapPoint {
  zone: string;
  value: number;
  interpretation: string;
}

export interface CorneaData {
  eye: Eye;
  k1: number;
  k2: number;
  axis: number;
  thinnest: number;
  dryEyeScore: number;
  lensStatus: string;
  trajectory: TrajectoryPoint[];
  map: CorneaMapPoint[];
}

export interface CataractPlan {
  eye: Eye;
  axialLength: number;
  anteriorChamberDepth: number;
  keratometry: number;
  targetRefraction: number;
  selectedIol: string;
  plannedPower: number;
  procedureStatus: ClinicalStatus;
  documents: Array<{ label: string; status: "complete" | "missing" | "signed" }>;
  audit: Array<{ label: string; target: string; observed?: string }>;
}

export interface OrthopticsCell {
  id: string;
  row: number;
  column: number;
  gaze: string;
  value: string;
  finding: "normal" | "limited" | "not-tested";
}

export interface OrthopticsData {
  cooperation: "good" | "variable" | "not-testable";
  coverDistance: string;
  coverNear: string;
  stereopsis: string;
  amblyopiaRisk: string;
  cells: OrthopticsCell[];
}

export interface EmergencyFinding {
  id: string;
  label: string;
  present: boolean;
  severity: "routine" | "urgent" | "critical";
}

export interface OcularEmergencyData {
  onset: string;
  painScore: number;
  affectedEye: Laterality;
  mechanism: string;
  findings: EmergencyFinding[];
  disposition: string;
  lowVisionReferral?: string;
  fitnessStatement?: string;
}

export interface OphthalmologyResourceMeta {
  versionId?: string;
  lastUpdated?: string;
  tag?: Array<{ system?: string; code?: string; display?: string }>;
}

export interface OphthalmologyObservationR5 {
  resourceType: "Observation";
  id: string;
  meta: OphthalmologyResourceMeta;
  status: "registered" | "preliminary" | "final" | "amended";
  category?: Array<{ coding?: Array<{ system?: string; code?: string; display?: string }> }>;
  code: { coding?: Array<{ system?: string; code?: string; display?: string }>; text?: string };
  subject: { reference: string; display?: string };
  effectiveDateTime: string;
  bodySite?: {
    coding?: Array<{ system?: string; code?: string; display?: string }>;
    text?: string;
  };
  valueQuantity?: { value: number; unit: string; system: string; code: string };
  valueString?: string;
  component?: Array<{
    code: { coding?: Array<{ system?: string; code?: string; display?: string }>; text?: string };
    valueQuantity?: { value: number; unit: string; system: string; code: string };
    valueString?: string;
  }>;
  derivedFrom?: Array<{ reference: string; display?: string }>;
  note?: Array<{ text: string }>;
}

export interface OphthalmologyImagingStudyR5 {
  resourceType: "ImagingStudy";
  id: string;
  meta: OphthalmologyResourceMeta;
  status: "registered" | "available" | "cancelled" | "entered-in-error" | "unknown";
  modality: Array<{ system?: string; code?: string; display?: string }>;
  subject: { reference: string; display?: string };
  started: string;
  numberOfSeries: number;
  numberOfInstances: number;
  description: string;
  series: Array<{
    uid: string;
    number: number;
    modality: { system?: string; code?: string; display?: string };
    description: string;
    bodySite?: { system?: string; code?: string; display?: string };
    numberOfInstances: number;
    instance: Array<{
      uid: string;
      sopClass: { system?: string; code?: string };
      number: number;
      title: string;
    }>;
  }>;
}

export interface OphthalmologyServiceRequestR5 {
  resourceType: "ServiceRequest";
  id: string;
  meta: OphthalmologyResourceMeta;
  status: "draft" | "active" | "on-hold" | "revoked" | "completed" | "entered-in-error" | "unknown";
  intent:
    | "proposal"
    | "plan"
    | "directive"
    | "order"
    | "original-order"
    | "reflex-order"
    | "filler-order"
    | "instance-order"
    | "option";
  priority?: "routine" | "urgent" | "asap" | "stat";
  code: {
    concept: {
      coding?: Array<{ system?: string; code?: string; display?: string }>;
      text?: string;
    };
  };
  subject: { reference: string; display?: string };
  authoredOn: string;
  reason?: Array<{ concept: { text?: string } }>;
  note?: Array<{ text: string }>;
}

export interface OphthalmologyBundleR5 {
  resourceType: "Bundle";
  id: string;
  meta: OphthalmologyResourceMeta;
  type: "collection";
  timestamp: string;
  entry: Array<{
    fullUrl: string;
    resource:
      | OphthalmologyObservationR5
      | OphthalmologyImagingStudyR5
      | OphthalmologyServiceRequestR5;
  }>;
}
