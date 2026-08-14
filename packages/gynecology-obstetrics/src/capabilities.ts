export const GYNECOLOGY_OBSTETRICS_CAPABILITY_MAP = {
  "GO-001": "pregnancy-context",
  "GO-002": "pregnancy-context",
  "GO-003": "pregnancy-context",
  "GO-004": "cockpit",
  "GO-010": "reproductive-health",
  "GO-011": "reproductive-health",
  "GO-012": "reproductive-health",
  "GO-013": "reproductive-health",
  "GO-014": "reproductive-health",
  "GO-015": "reproductive-health",
  "GO-016": "reproductive-health",
  "GO-017": "reproductive-health",
  "GO-018": "reproductive-health",
  "GO-019": "reproductive-health",
  "GO-020": "prenatal",
  "GO-021": "prenatal",
  "GO-022": "prenatal",
  "GO-023": "fetal-assessment",
  "GO-024": "fetal-assessment",
  "GO-025": "fetal-assessment",
  "GO-026": "prenatal",
  "GO-027": "prenatal",
  "GO-028": "prenatal",
  "GO-029": "prenatal",
  "GO-030": "prenatal",
  "GO-040": "labor",
  "GO-041": "labor",
  "GO-042": "birth-decision",
  "GO-043": "hemorrhage-safety",
  "GO-044": "hemorrhage-safety",
  "GO-045": "birth-decision",
  "GO-046": "newborn-transition",
  "GO-050": "postpartum",
  "GO-051": "postpartum",
  "GO-052": "postpartum",
  "GO-053": "postpartum",
  "GO-060": "cockpit",
  "GO-061": "cockpit",
  "GO-062": "pregnancy-context",
  "GO-063": "service-catalog",
} as const;

export type GynecologyObstetricsModule =
  (typeof GYNECOLOGY_OBSTETRICS_CAPABILITY_MAP)[keyof typeof GYNECOLOGY_OBSTETRICS_CAPABILITY_MAP];

export function gynecologyObstetricsModuleForCapability(
  capabilityId: string,
): GynecologyObstetricsModule {
  return (
    GYNECOLOGY_OBSTETRICS_CAPABILITY_MAP[
      capabilityId as keyof typeof GYNECOLOGY_OBSTETRICS_CAPABILITY_MAP
    ] ?? "cockpit"
  );
}
