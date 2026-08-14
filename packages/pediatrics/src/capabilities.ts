export const PEDIATRICS_CAPABILITY_MAP = {
  "PE-001": "context",
  "PE-002": "context",
  "PE-003": "context",
  "PE-004": "cockpit",
  "PE-010": "growth-development",
  "PE-011": "growth-development",
  "PE-012": "growth-development",
  "PE-013": "growth-development",
  "PE-014": "growth-development",
  "PE-015": "growth-development",
  "PE-020": "dose-safety",
  "PE-021": "dose-safety",
  "PE-022": "dose-safety",
  "PE-023": "dose-safety",
  "PE-024": "dose-safety",
  "PE-030": "prevention",
  "PE-031": "prevention",
  "PE-032": "prevention",
  "PE-033": "prevention",
  "PE-034": "prevention",
  "PE-035": "prevention",
  "PE-040": "triage",
  "PE-041": "triage",
  "PE-042": "triage",
  "PE-043": "triage",
  "PE-044": "triage",
  "PE-045": "triage",
  "PE-046": "triage",
  "PE-050": "chronic-care",
  "PE-051": "chronic-care",
  "PE-052": "chronic-care",
  "PE-053": "chronic-care",
  "PE-060": "family-context",
  "PE-061": "family-context",
  "PE-062": "family-context",
  "PE-063": "family-context",
  "PE-064": "family-context",
  "PE-070": "context",
  "PE-071": "transition",
  "PE-072": "service-catalog",
} as const;

export type PediatricsModule =
  (typeof PEDIATRICS_CAPABILITY_MAP)[keyof typeof PEDIATRICS_CAPABILITY_MAP];

export function pediatricsModuleForCapability(capabilityId: string): PediatricsModule {
  return (
    PEDIATRICS_CAPABILITY_MAP[capabilityId as keyof typeof PEDIATRICS_CAPABILITY_MAP] ?? "cockpit"
  );
}
