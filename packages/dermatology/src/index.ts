export * from "./body-lesion-map";
export * from "./dermatology-procedure-timeline";
export * from "./dermatology-vigilance-board";
export * from "./dermoscopic-comparison-viewer";
export * from "./fhir-utils";
export * from "./fixtures";
export * from "./inflammatory-score-workbench";
export * from "./lesion-longitudinal-card";
export * from "./photography-quality-gate";
export * from "./pigmented-lesion-workbench";
export * from "./treatment-safety-panel";
export * from "./types";
export * from "./wound-trajectory";

export const DERMATOLOGY_UI_CONTRACT = {
  domain: "dermatology",
  fhirVersion: "R5",
  planDefinition: "clinical-specialty-dermatology-2026-1",
  version: "2026.1",
  syntheticFixturesOnly: true,
} as const;
