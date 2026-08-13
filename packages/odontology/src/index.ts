export const ODONTOLOGY_UI_CONTRACT = {
  domain: "odontology",
  planDefinition: "clinical-specialty-odontology-2026-1",
  version: "2026.1",
} as const;

export * from "./dental-document-lifecycle";
export * from "./dental-imaging-context";
export * from "./endodontic-workbench";
export * from "./extraction-safety-checklist";
export * from "./fixtures";
export * from "./longitudinal-odontogram";
export * from "./oral-health-summary";
export * from "./orthodontic-workbench";
export * from "./periodontal-chart";
export * from "./phased-treatment-plan";
export * from "./prosthesis-implant-timeline";
export * from "./safe-dental-prescription";
export * from "./tooth-surface-inspector";
export * from "./types";
