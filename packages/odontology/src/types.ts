import type { FhirResource } from "@clinical-ui/fhir";

export type DentalUiState = "ready" | "loading" | "empty" | "error" | "forbidden";

export type DentalDataMode = "clinical" | "synthetic";
export type DentalPresentation = "standalone" | "embedded";

export interface DentalHostPresentationProps {
  /** Explicitly identifies whether the host supplied clinical data or demo fixtures. */
  dataMode?: DentalDataMode;
  /** Embedded workbenches delegate their module heading and outer surface to the host. */
  presentation?: DentalPresentation;
}

export interface DentalStateProps extends DentalHostPresentationProps {
  state?: DentalUiState | undefined;
  stateMessage?: string | undefined;
}

export type DentalEvidenceKind =
  | "observed"
  | "imported"
  | "derived"
  | "projected"
  | "preliminary"
  | "validated";

export type Dentition = "permanent" | "primary" | "mixed";

export type ToothSurface = "occlusal" | "mesial" | "distal" | "buccal" | "lingual";

export type ToothStatus =
  | "sound"
  | "caries"
  | "filled"
  | "crown"
  | "missing"
  | "extracted"
  | "implant"
  | "endodontic"
  | "bridge"
  | "unerupted";

export interface ToothHistoryEvent {
  id: string;
  date: string;
  label: string;
  detail?: string;
  evidence: DentalEvidenceKind;
  resourceRef: string;
}

export interface ToothRecord {
  fdi: string;
  label: string;
  dentition: "permanent" | "primary";
  arch: "maxillary" | "mandibular";
  status: ToothStatus;
  surfaces?: Partial<Record<ToothSurface, ToothStatus>>;
  history?: ToothHistoryEvent[];
  evidence: DentalEvidenceKind;
  resourceRef: string;
}

export interface PeriodontalSite {
  id: string;
  tooth: string;
  site: "MB" | "B" | "DB" | "ML" | "L" | "DL";
  pocketDepth: number;
  recession: number;
  bleeding: boolean;
  plaque: boolean;
  evidence: DentalEvidenceKind;
}

export type TreatmentSessionStatus =
  | "planned"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "postponed";

export interface TreatmentSession {
  id: string;
  title: string;
  tooth?: string;
  date?: string;
  status: TreatmentSessionStatus;
  dependsOn?: string[];
  evidence: DentalEvidenceKind;
  resourceRef: string;
}

export interface TreatmentPhase {
  id: string;
  number: number;
  title: string;
  objective: string;
  sessions: TreatmentSession[];
}

export interface EndodonticCanal {
  id: string;
  name: string;
  observedLength?: number;
  projectedLength?: number;
  referencePoint: string;
  status: "unmeasured" | "measured" | "prepared" | "filled";
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  detail: string;
  status: "completed" | "current" | "planned" | "cancelled" | "postponed";
  evidence: DentalEvidenceKind;
  resourceRef: string;
}

export interface DentalImagingItem {
  id: string;
  title: string;
  modality: "panoramic" | "bitewing" | "periapical" | "cbct" | "photo";
  date: string;
  region: string;
  evidence: DentalEvidenceKind;
  source: string;
  resourceRef: string;
  /** Host-authorized media URL. Clinical mode never invents an image when it is absent. */
  previewUrl?: string;
  /** Explicit fixture provenance for Storybook and demonstrations. */
  synthetic?: boolean;
}

export interface SafetyItem {
  id: string;
  label: string;
  detail?: string;
  checked: boolean;
  critical?: boolean;
  resourceRef: string;
}

export interface DentalPrescription {
  id: string;
  medication: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  maximumDailyDose: string;
  indication: string;
  status: "draft" | "active" | "blocked";
  patientWeightKg?: number;
  pediatric: boolean;
  allergiesChecked: boolean;
  interactionsChecked: boolean;
  author: string;
  authoredOn: string;
  resourceRef: string;
}

export type DentalDocumentStatus =
  | "draft"
  | "preliminary"
  | "validated"
  | "signed"
  | "superseded"
  | "entered-in-error";

export interface DentalDocumentVersion {
  id: string;
  version: number;
  title: string;
  date: string;
  author: string;
  status: DentalDocumentStatus;
  replaces?: string;
  resourceRef: string;
}

export interface FhirBundleEntry<T extends FhirResource = FhirResource> {
  fullUrl: string;
  resource: T;
}

export interface FhirBundle<T extends FhirResource = FhirResource> extends FhirResource {
  resourceType: "Bundle";
  type: "collection";
  timestamp: string;
  entry: FhirBundleEntry<T>[];
}
