import { describe, expect, it } from "vitest";
import {
  calculateAirBoneGap,
  calculateGovernedPta,
  GOVERNED_PTA_FREQUENCIES,
} from "./calculations";
import { syntheticAudiogram } from "./fixtures";

describe("governed ENT calculations", () => {
  it("calculates PTA only from the four declared air-conduction frequencies", () => {
    const result = calculateGovernedPta(syntheticAudiogram.points, "right");
    expect(result.state).toBe("calculated");
    expect(result.frequenciesHz).toEqual(GOVERNED_PTA_FREQUENCIES);
    expect(result.valueDbHl).toBe(45);
    expect(result.explanation).toContain("sans valeur diagnostique automatique");
  });

  it("returns not-calculable instead of imputing a missing value", () => {
    const points = syntheticAudiogram.points.filter(
      (point) =>
        !(point.side === "left" && point.frequencyHz === 2000 && point.conduction === "air"),
    );
    const result = calculateGovernedPta(points, "left");
    expect(result.state).toBe("not-calculable");
    expect(result.valueDbHl).toBeUndefined();
  });

  it("does not calculate an air-bone gap from a no-response point", () => {
    expect(calculateAirBoneGap(syntheticAudiogram.points, "right", 8000)).toBeUndefined();
    expect(calculateAirBoneGap(syntheticAudiogram.points, "right", 1000)).toBe(15);
  });
});
