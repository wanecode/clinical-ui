export const OPHTHALMOLOGY_UI_CONTRACT = {
  domain: "ophthalmology",
  planDefinition: "clinical-specialty-ophthalmology-2026-2",
  version: "2026.2",
} as const;

export * from "./bilateral-clinical-rail";
export * from "./cataract-surgery-planner";
export * from "./cornea-workbench";
export * from "./fixtures";
export * from "./glaucoma-progression-workbench";
export * from "./ocular-emergency-summary";
export * from "./orthoptics-workbench";
export * from "./retina-imaging-timeline";
export * from "./types";
export * from "./visual-acuity-refraction-workbench";
