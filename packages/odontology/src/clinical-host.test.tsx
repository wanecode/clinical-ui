import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DentalDocumentLifecycle } from "./dental-document-lifecycle";
import { DentalImagingContext } from "./dental-imaging-context";
import { EndodonticWorkbench } from "./endodontic-workbench";
import { ExtractionSafetyChecklist } from "./extraction-safety-checklist";
import {
  syntheticDentalImages,
  syntheticDentalPrescription,
  syntheticDocumentVersions,
  syntheticEndodonticCanals,
  syntheticExtractionSafetyItems,
  syntheticOrthodonticTimeline,
  syntheticPeriodontalSites,
  syntheticProsthesisTimeline,
  syntheticTeeth,
  syntheticTreatmentPhases,
} from "./fixtures";
import { LongitudinalOdontogram } from "./longitudinal-odontogram";
import { OralHealthSummary } from "./oral-health-summary";
import { OrthodonticWorkbench } from "./orthodontic-workbench";
import { PeriodontalChart } from "./periodontal-chart";
import { PhasedTreatmentPlan } from "./phased-treatment-plan";
import { ProsthesisImplantTimeline } from "./prosthesis-implant-timeline";
import { SafeDentalPrescription } from "./safe-dental-prescription";
import { ToothSurfaceInspector } from "./tooth-surface-inspector";

const tooth = syntheticTeeth[0];
if (!tooth) throw new Error("The odontology host contract requires a tooth fixture.");

const embeddedClinicalWorkbenches = [
  <LongitudinalOdontogram key="odontogram" teeth={syntheticTeeth} />,
  <ToothSurfaceInspector key="surface" tooth={tooth} />,
  <PeriodontalChart key="periodontal" sites={syntheticPeriodontalSites} />,
  <PhasedTreatmentPlan key="plan" phases={syntheticTreatmentPhases} consent="obtained" />,
  <EndodonticWorkbench key="endodontic" tooth="16" canals={syntheticEndodonticCanals} />,
  <ProsthesisImplantTimeline key="implant" tooth="36" events={syntheticProsthesisTimeline} />,
  <OrthodonticWorkbench
    key="orthodontic"
    events={syntheticOrthodonticTimeline}
    currentStep={4}
    totalSteps={12}
  />,
  <DentalImagingContext key="imaging" images={syntheticDentalImages} />,
  <ExtractionSafetyChecklist key="safety" tooth="36" items={syntheticExtractionSafetyItems} />,
  <SafeDentalPrescription key="prescription" prescription={syntheticDentalPrescription} />,
  <DentalDocumentLifecycle key="documents" documents={syntheticDocumentVersions} />,
  <OralHealthSummary
    key="summary"
    teeth={syntheticTeeth}
    periodontalSites={syntheticPeriodontalSites}
  />,
].map((workbench) => ({
  ...workbench,
  props: { ...workbench.props, dataMode: "clinical", presentation: "embedded" },
}));

describe("odontology clinical host contract", () => {
  it("removes standalone headings and synthetic claims from every embedded workbench", () => {
    for (const workbench of embeddedClinicalWorkbenches) {
      const markup = renderToStaticMarkup(workbench);
      expect(markup).toContain('data-mode="clinical"');
      expect(markup).toContain('data-presentation="embedded"');
      expect(markup).not.toContain("<h2");
      expect(markup).not.toContain("Données 100 % synthétiques");
      expect(markup).not.toContain("IMAGE SYNTHÉTIQUE");
      expect(markup).not.toContain("entièrement synthétique");
    }
  });

  it("does not invent dental imagery when a clinical preview URL is absent", () => {
    const markup = renderToStaticMarkup(
      <DentalImagingContext images={syntheticDentalImages} dataMode="clinical" />,
    );

    expect(markup).toContain("Aperçu non transmis");
    expect(markup).not.toContain("IMAGE SYNTHÉTIQUE");
  });

  it("keeps synthetic provenance explicit only when requested", () => {
    const syntheticMarkup = renderToStaticMarkup(
      <LongitudinalOdontogram teeth={syntheticTeeth} dataMode="synthetic" />,
    );
    const clinicalMarkup = renderToStaticMarkup(<LongitudinalOdontogram teeth={syntheticTeeth} />);

    expect(syntheticMarkup).toContain("Données 100 % synthétiques");
    expect(clinicalMarkup).not.toContain("Données 100 % synthétiques");
  });

  it("keeps undocumented clinical measurements explicit instead of applying demo defaults", () => {
    const orthodonticMarkup = renderToStaticMarkup(
      <OrthodonticWorkbench
        events={syntheticOrthodonticTimeline}
        currentStep={1}
        totalSteps={2}
        dataMode="clinical"
      />,
    );
    const summaryMarkup = renderToStaticMarkup(
      <OralHealthSummary
        teeth={syntheticTeeth}
        periodontalSites={syntheticPeriodontalSites}
        dataMode="clinical"
      />,
    );

    expect(orthodonticMarkup).toContain("Non renseigné");
    expect(orthodonticMarkup).not.toContain("3.2 mm");
    expect(summaryMarkup).toContain("Non renseignée");
    expect(summaryMarkup).not.toContain("0 / 10");
  });
});
