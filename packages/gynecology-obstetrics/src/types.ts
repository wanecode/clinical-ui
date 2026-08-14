import type { ClinicalStatus } from "@clinical-ui/core";

export type GynecologyObstetricsViewState = "ready" | "loading" | "empty" | "error" | "forbidden";
export type GynecologyObstetricsDataMode = "clinical" | "synthetic";
export type GynecologyObstetricsPresentation = "standalone" | "embedded";
export type GynecologyObstetricsOrigin =
  | "patient-reported"
  | "observed"
  | "imported"
  | "derived"
  | "projected";

export interface GynecologyObstetricsHostProps {
  dataMode?: GynecologyObstetricsDataMode;
  presentation?: GynecologyObstetricsPresentation;
}

export interface GynecologyObstetricsStateProps extends GynecologyObstetricsHostProps {
  state?: GynecologyObstetricsViewState;
  stateMessage?: string;
}

export interface GynecologyObstetricsSource {
  sourceReference: string;
  origin: GynecologyObstetricsOrigin;
  clinicalStatus: ClinicalStatus;
  recordedAt?: string;
  author?: string;
}

export interface PregnancyEpisode extends GynecologyObstetricsSource {
  episodeReference: string;
  maternalReference: string;
  fetusReferences: string[];
  gestationalAge: string;
  datingBasis: string;
  estimatedDueDate?: string;
  revisedFrom?: string;
  parity?: string;
}

export interface ObstetricVigilanceItem extends GynecologyObstetricsSource {
  id: string;
  label: string;
  detail: string;
  severity: "information" | "warning" | "critical";
  dueAt?: string;
  owner?: string;
}

export interface ReproductiveHealthEvent extends GynecologyObstetricsSource {
  id: string;
  at: string;
  kind: "cycle" | "contraception" | "fertility" | "pathology" | "screening" | "procedure";
  label: string;
  detail?: string;
  visibility: "standard" | "sensitive" | "restricted";
}

export interface PrenatalEvent extends GynecologyObstetricsSource {
  id: string;
  gestationalAge: string;
  at: string;
  kind: "visit" | "laboratory" | "imaging" | "screening" | "plan";
  label: string;
  detail: string;
  windowStatus: "complete" | "current" | "upcoming" | "overdue" | "unavailable";
}

export interface FetalMeasure extends GynecologyObstetricsSource {
  id: string;
  fetusReference: string;
  label: string;
  value?: string;
  reference?: string;
  interpretation: "within" | "borderline" | "outside" | "unknown";
}

export interface LaborObservation extends GynecologyObstetricsSource {
  id: string;
  at: string;
  elapsedMinutes: number;
  cervicalDilation?: number;
  fetalHeartRate?: number;
  contractions?: number;
  membraneStatus?: string;
}

export interface BirthDecision extends GynecologyObstetricsSource {
  decision: string;
  indication?: string;
  decidedAt?: string;
  targetAt?: string;
  owner?: string;
  readiness: { id: string; label: string; status: "ready" | "pending" | "blocked" | "unknown" }[];
}

export interface HemorrhageSafetyItem extends GynecologyObstetricsSource {
  id: string;
  label: string;
  kind: "risk" | "preparation" | "response";
  status: "ready" | "pending" | "triggered" | "unavailable";
  detail?: string;
}

export interface NewbornTransitionItem extends GynecologyObstetricsSource {
  id: string;
  newbornReference: string;
  minute: string;
  label: string;
  value?: string;
  status: "normal" | "support" | "critical" | "unknown";
}

export interface PostpartumItem extends GynecologyObstetricsSource {
  id: string;
  actor: "mother" | "newborn" | "dyad";
  label: string;
  detail?: string;
  status: "complete" | "due" | "follow-up" | "critical" | "unavailable";
  visibility: "standard" | "sensitive" | "restricted";
}

export interface GynecologyObstetricsServiceItem {
  id: string;
  label: string;
  duration: string;
  level: "essential" | "intermediate" | "reference";
  sourceReference: string;
}
