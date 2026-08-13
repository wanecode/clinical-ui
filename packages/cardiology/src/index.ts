export const CARDIOLOGY_UI_CONTRACT = {
  domain: "cardiology",
  planDefinition: "clinical-specialty-cardiology-2026-2",
  version: "2026.2",
} as const;

export * from "./care";
export * from "./diagnostics";
export * from "./fixtures";
export * from "./overview";
export * from "./types";
