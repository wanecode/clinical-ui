import type { CodeableConcept } from "@clinical-ui/fhir";
import type {
  BodyMapView,
  DermatologyBodyStructure,
  DermatologyDataOrigin,
  DermatologyExtension,
  DermatologyObservation,
} from "./types";

export const DERMATOLOGY_SYSTEM = "https://clinical-ui.dev/fhir/CodeSystem/dermatology-synthetic";
export const DERMATOLOGY_EXTENSION = "https://clinical-ui.dev/fhir/StructureDefinition/dermatology";
export const SYNTHETIC_TAG_SYSTEM = "https://clinical-ui.dev/fhir/CodeSystem/fixture-kind";

export function conceptCode(concept: CodeableConcept | undefined) {
  return concept?.coding?.[0]?.code;
}

export function conceptLabel(concept: CodeableConcept | undefined, fallback = "Non renseigné") {
  return concept?.text ?? concept?.coding?.find((coding) => coding.display)?.display ?? fallback;
}

export function extensionBySuffix(extensions: DermatologyExtension[] | undefined, suffix: string) {
  return extensions?.find((extension) => extension.url.endsWith(suffix));
}

export function lesionId(lesion: DermatologyBodyStructure) {
  return lesion.identifier?.find((identifier) => identifier.value)?.value ?? lesion.id ?? "Lésion";
}

export function lesionPlacement(lesion: DermatologyBodyStructure) {
  const rawView = extensionBySuffix(lesion.extension, "/body-map-view")?.valueCode;
  const view: BodyMapView =
    rawView === "posterior" || rawView === "left-lateral" || rawView === "right-lateral"
      ? rawView
      : "anterior";
  return {
    view,
    x: extensionBySuffix(lesion.extension, "/body-map-x")?.valueDecimal ?? 0.5,
    y: extensionBySuffix(lesion.extension, "/body-map-y")?.valueDecimal ?? 0.5,
  };
}

export function observationOrigin(observation: DermatologyObservation): DermatologyDataOrigin {
  const value = extensionBySuffix(observation.extension, "/data-origin")?.valueCode;
  if (value === "imported" || value === "derived" || value === "projected") return value;
  return "observed";
}

export function observationValue(observation: DermatologyObservation) {
  if (observation.valueQuantity?.value !== undefined) {
    return `${observation.valueQuantity.value.toLocaleString("fr-FR")} ${observation.valueQuantity.unit ?? ""}`.trim();
  }
  if (observation.valueInteger !== undefined) return String(observation.valueInteger);
  if (observation.valueBoolean !== undefined) return observation.valueBoolean ? "Oui" : "Non";
  if (observation.valueString) return observation.valueString;
  return conceptLabel(observation.valueCodeableConcept);
}

export function formatClinicalDate(value: string | undefined, includeYear = true) {
  if (!value) return "Date non renseignée";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    ...(includeYear ? { year: "numeric" } : {}),
  }).format(date);
}

export function isSyntheticDermatologyResource(resource: {
  meta?: { tag?: Array<{ system?: string; code?: string }> };
}) {
  return (
    resource.meta?.tag?.some(
      (tag) => tag.system === SYNTHETIC_TAG_SYSTEM && tag.code === "synthetic",
    ) ?? false
  );
}
