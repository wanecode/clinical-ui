import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildTrajectoryGeometry } from "./accessible-trajectory";
import {
  isSyntheticOphthalmologyResource,
  OPHTHALMOLOGY_SYNTHETIC_TAG_SYSTEM,
  syntheticGlaucomaData,
  syntheticOctImagingStudy,
  syntheticOphthalmologyBundle,
  syntheticVisualAcuityObservation,
} from "./fixtures";
import { convertDecimalAcuity } from "./visual-acuity-refraction-workbench";

const stylesheet = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

describe("FHIR R5 ophthalmology fixtures", () => {
  it("marks the bundle and every contained resource as explicitly synthetic", () => {
    expect(isSyntheticOphthalmologyResource(syntheticOphthalmologyBundle)).toBe(true);
    expect(syntheticOphthalmologyBundle.entry.length).toBeGreaterThan(3);
    for (const { fullUrl, resource } of syntheticOphthalmologyBundle.entry) {
      expect(fullUrl).toContain(`/${resource.resourceType}/`);
      expect(isSyntheticOphthalmologyResource(resource), resource.id).toBe(true);
      expect(resource.meta.tag?.[0]?.system).toBe(OPHTHALMOLOGY_SYNTHETIC_TAG_SYSTEM);
    }
  });

  it("uses native R5 resource shapes and standard terminologies", () => {
    expect(syntheticVisualAcuityObservation.resourceType).toBe("Observation");
    expect(syntheticVisualAcuityObservation.code.coding?.[0]?.system).toBe("http://loinc.org");
    expect(syntheticVisualAcuityObservation.valueQuantity?.system).toBe(
      "http://unitsofmeasure.org",
    );
    expect(syntheticOctImagingStudy.resourceType).toBe("ImagingStudy");
    expect(syntheticOctImagingStudy.series).toHaveLength(2);
    expect(syntheticOctImagingStudy.series.every((series) => series.instance.length === 1)).toBe(
      true,
    );
  });
});

describe("ophthalmology measurement semantics", () => {
  it("converts decimal acuity without mutating the source scale", () => {
    expect(convertDecimalAcuity(1, "decimal")).toBe("1");
    expect(convertDecimalAcuity(1, "logmar")).toBe("0,00");
    expect(convertDecimalAcuity(0.5, "logmar")).toBe("0,30");
    expect(convertDecimalAcuity(0.5, "snellen")).toBe("20/40");
    expect(convertDecimalAcuity(0, "snellen")).toBe("—");
  });

  it("never labels projected glaucoma points as observed", () => {
    const projected = [...syntheticGlaucomaData.iop, ...syntheticGlaucomaData.rnfl].filter(
      (point) => point.kind === "projected",
    );
    expect(projected.length).toBeGreaterThan(0);
    expect(projected.every((point) => point.status === "preliminary")).toBe(true);
    expect(projected.every((point) => point.source.includes("non observée"))).toBe(true);
  });

  it("aligns both eyes on a shared chronological chart axis", () => {
    const { positioned, dateTicks, valueTicks } = buildTrajectoryGeometry(
      syntheticGlaucomaData.iop,
      syntheticGlaucomaData.targetIop,
    );
    const od2026 = positioned.find((point) => point.eye === "OD" && point.date === "2026-08-12");
    const og2026 = positioned.find((point) => point.eye === "OG" && point.date === "2026-08-12");

    expect(od2026?.x).toBe(og2026?.x);
    expect(dateTicks).toHaveLength(6);
    expect(valueTicks).toHaveLength(4);
    expect(positioned.every((point) => point.x >= 10 && point.x <= 96)).toBe(true);
  });
});

describe("neutral clinical viewer contract", () => {
  it("styles retinal viewers exclusively through the complete viewer token family", () => {
    for (const token of [
      "viewer-surface",
      "viewer-panel",
      "viewer-foreground",
      "viewer-muted-foreground",
      "viewer-border",
      "viewer-accent",
    ]) {
      expect(stylesheet, `missing viewer usage --${token}`).toContain(`var(--${token})`);
    }
    expect(stylesheet).toContain(".oph-retina-viewer");
    expect(stylesheet).toContain(".oph-synthetic-scan");
  });
});
