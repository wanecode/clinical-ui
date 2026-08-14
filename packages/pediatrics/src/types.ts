import type { ClinicalStatus } from "@clinical-ui/core";

export type PediatricsViewState = "ready" | "loading" | "empty" | "error" | "forbidden";
export type PediatricsDataMode = "clinical" | "synthetic";
export type PediatricsPresentation = "standalone" | "embedded";
export type PediatricsDataOrigin =
  | "patient-reported"
  | "caregiver-reported"
  | "observed"
  | "imported"
  | "derived"
  | "projected";

export interface PediatricsHostPresentationProps {
  dataMode?: PediatricsDataMode;
  presentation?: PediatricsPresentation;
}

export interface PediatricsStateProps extends PediatricsHostPresentationProps {
  state?: PediatricsViewState;
  stateMessage?: string;
}

export interface PediatricSource {
  sourceReference: string;
  origin: PediatricsDataOrigin;
  clinicalStatus: ClinicalStatus;
  recordedAt?: string;
  author?: string;
}

export interface PediatricAgeContext extends PediatricSource {
  chronologicalAge: string;
  correctedAge?: string;
  bornAt?: string;
  gestationalAgeAtBirth?: string;
  referenceBasis: "chronological" | "corrected";
}

export interface PediatricWeightEvidence extends PediatricSource {
  value: number;
  unit: "kg" | "g";
  measuredAt: string;
  use: "growth" | "dose";
  freshnessStatus: "fresh" | "stale" | "unknown";
}

export interface PediatricNormDatum extends PediatricSource {
  id: string;
  label: string;
  value: string;
  reference: string;
  interpretation: "within" | "borderline" | "outside" | "unknown";
}

export interface PediatricVigilanceItem extends PediatricSource {
  id: string;
  label: string;
  detail: string;
  severity: "information" | "warning" | "critical";
  dueAt?: string;
  owner?: string;
}

export interface GrowthPoint extends PediatricSource {
  at: string;
  ageMonths: number;
  value: number;
  percentile?: number;
}

export interface GrowthSeries {
  id: string;
  label: string;
  unit: string;
  curveLabel: string;
  curveVersion: string;
  ageBasis: "chronological" | "corrected";
  points: GrowthPoint[];
}

export interface DevelopmentWindow extends PediatricSource {
  id: string;
  label: string;
  opensAt: string;
  closesAt: string;
  status: "acquired" | "current" | "future" | "follow-up" | "unavailable";
}

export interface DoseCalculation extends PediatricSource {
  medication: string;
  weight?: PediatricWeightEvidence;
  dosePerKg?: string;
  computedDose?: string;
  maximumDose?: string;
  administrableVolume?: string;
  status: "verified" | "to-review" | "incomplete";
  missingInputs: string[];
}

export interface PreventionItem extends PediatricSource {
  id: string;
  kind: "immunization" | "screening" | "milestone" | "supplement";
  label: string;
  window: string;
  status: "complete" | "due" | "overdue" | "contraindicated" | "follow-up" | "unavailable";
  detail?: string;
}

export interface PediatricTriageDatum extends PediatricSource {
  id: string;
  label: string;
  value: string;
  ageReference?: string;
  severity: "normal" | "warning" | "critical" | "unknown";
}

export interface PediatricDisposition extends PediatricSource {
  label: string;
  detail: string;
  status: "pending" | "documented" | "escalated";
  owner?: string;
}

export interface PediatricTrajectoryEvent extends PediatricSource {
  id: string;
  at: string;
  lane: "episode" | "assessment" | "medication" | "plan" | "school" | "social";
  label: string;
  detail: string;
}

export interface PediatricActorContext extends PediatricSource {
  id: string;
  role: "child" | "caregiver" | "confidential" | "care-team";
  label: string;
  relationship?: string;
  sharingStatus: "allowed" | "restricted" | "unknown";
  detail?: string;
}

export interface TransitionReadinessItem extends PediatricSource {
  id: string;
  label: string;
  status: "ready" | "in-progress" | "missing" | "not-applicable";
  detail?: string;
}

export interface PediatricServiceItem {
  id: string;
  label: string;
  duration: string;
  level: "essential" | "intermediate" | "reference";
  sourceReference: string;
}
