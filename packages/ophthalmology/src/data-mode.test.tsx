import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BilateralClinicalRail } from "./bilateral-clinical-rail";
import { syntheticBilateralEyes, syntheticGlaucomaData } from "./fixtures";
import { GlaucomaProgressionWorkbench } from "./glaucoma-progression-workbench";

describe("ophthalmology data provenance", () => {
  it("does not label clinical host data as synthetic by default", () => {
    const markup = renderToStaticMarkup(
      <BilateralClinicalRail right={syntheticBilateralEyes.OD} left={syntheticBilateralEyes.OG} />,
    );

    expect(markup).not.toContain("100 % synthétique");
  });

  it("keeps the synthetic label explicit for demos", () => {
    const markup = renderToStaticMarkup(
      <BilateralClinicalRail
        right={syntheticBilateralEyes.OD}
        left={syntheticBilateralEyes.OG}
        dataMode="synthetic"
      />,
    );

    expect(markup).toContain("100 % synthétique");
  });

  it("removes redundant workbench titles when embedded in a clinical host", () => {
    const bilateral = renderToStaticMarkup(
      <BilateralClinicalRail
        right={syntheticBilateralEyes.OD}
        left={syntheticBilateralEyes.OG}
        presentation="embedded"
      />,
    );
    const glaucoma = renderToStaticMarkup(
      <GlaucomaProgressionWorkbench data={syntheticGlaucomaData} presentation="embedded" />,
    );

    expect(bilateral).not.toContain("Lecture OD / OG");
    expect(bilateral).toContain("Œil droit");
    expect(glaucoma).not.toContain("Trajectoires explicables");
    expect(glaucoma).toContain("Pression intraoculaire");
  });

  it("renders eye-specific targets without inventing a vigilance", () => {
    const { targetIop: _targetIop, vigilance: _vigilance, ...trajectory } = syntheticGlaucomaData;
    const markup = renderToStaticMarkup(
      <GlaucomaProgressionWorkbench
        data={{
          ...trajectory,
          targetIopByEye: { OD: 15, OG: 13 },
        }}
      />,
    );

    expect(markup).toContain("OD ≤ 15 mmHg · OG ≤ 13 mmHg");
    expect(markup).not.toContain("Progression structurelle OD");
  });

  it("renders multiple FHIR sources without collapsing an aggregate into one resource", () => {
    const markup = renderToStaticMarkup(
      <BilateralClinicalRail
        right={{
          ...syntheticBilateralEyes.OD,
          sources: [
            {
              label: "Acuité corrigée",
              reference: "Observation/acuity-od",
              context: "2026-08-12 · Monoyer",
              status: "validated",
            },
            {
              label: "Pression intraoculaire",
              reference: "Observation/iop-od",
              context: "2026-08-13 · Goldmann",
              status: "preliminary",
            },
          ],
        }}
      />,
    );

    expect(markup).toContain("Provenance FHIR");
    expect(markup).toContain("Observation/acuity-od");
    expect(markup).toContain("Observation/iop-od");
  });
});
