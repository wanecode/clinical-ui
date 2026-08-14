import { describe, expect, it } from "vitest";
import * as fixtures from "./fixtures";

describe("gynecology and obstetrics fixtures", () => {
  it("keeps every fixture explicitly synthetic", () => {
    const serialized = JSON.stringify(fixtures).toLowerCase();
    expect(serialized).toContain("synthetic");
    expect(serialized).not.toContain("patient/real");
  });

  it("keeps distinct maternal, fetal and newborn identities", () => {
    expect(fixtures.syntheticPregnancyEpisode.maternalReference).not.toBe(
      fixtures.syntheticPregnancyEpisode.fetusReferences[0],
    );
    expect(fixtures.syntheticNewbornItems[0]?.newbornReference).not.toBe(
      fixtures.syntheticPregnancyEpisode.maternalReference,
    );
  });

  it("does not convert unavailable findings into normal findings", () => {
    expect(fixtures.syntheticFetalMeasures.some((item) => item.interpretation === "unknown")).toBe(
      true,
    );
    expect(fixtures.syntheticPostpartumItems.some((item) => item.status === "unavailable")).toBe(
      true,
    );
  });
});
