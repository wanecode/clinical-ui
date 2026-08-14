import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BodyLesionMap } from "./body-lesion-map";
import { DermatologyProcedureTimeline } from "./dermatology-procedure-timeline";
import { DermatologyVigilanceBoard } from "./dermatology-vigilance-board";
import { DermoscopicComparisonViewer } from "./dermoscopic-comparison-viewer";
import {
  syntheticDermoscopyDocuments,
  syntheticImageConsent,
  syntheticInflammatoryScores,
  syntheticLesionMeasurements,
  syntheticLesions,
  syntheticPhotographyQuality,
  syntheticPigmentedAssessment,
  syntheticProcedures,
  syntheticSafetyMonitoring,
  syntheticTreatments,
  syntheticVigilanceIssues,
  syntheticWoundTrajectory,
} from "./fixtures";
import { InflammatoryScoreWorkbench } from "./inflammatory-score-workbench";
import { LesionLongitudinalCard } from "./lesion-longitudinal-card";
import { PhotographyQualityGate } from "./photography-quality-gate";
import { PigmentedLesionWorkbench } from "./pigmented-lesion-workbench";
import { TreatmentSafetyPanel } from "./treatment-safety-panel";
import { WoundTrajectory } from "./wound-trajectory";

const lesion = syntheticLesions[0];
if (!lesion) throw new Error("The dermatology host contract requires a lesion fixture.");

const embeddedClinicalWorkbenches = [
  <BodyLesionMap key="map" lesions={syntheticLesions} />,
  <LesionLongitudinalCard
    key="longitudinal"
    lesion={lesion}
    observations={syntheticLesionMeasurements}
  />,
  <DermoscopicComparisonViewer
    key="dermoscopy"
    documents={syntheticDermoscopyDocuments}
    consent={syntheticImageConsent}
  />,
  <PhotographyQualityGate key="quality" checks={syntheticPhotographyQuality} />,
  <WoundTrajectory key="wound" observations={syntheticWoundTrajectory} />,
  <InflammatoryScoreWorkbench key="scores" observations={syntheticInflammatoryScores} />,
  <PigmentedLesionWorkbench
    key="pigmented"
    lesion={lesion}
    assessment={syntheticPigmentedAssessment}
  />,
  <DermatologyProcedureTimeline key="procedures" procedures={syntheticProcedures} />,
  <TreatmentSafetyPanel
    key="treatment"
    treatments={syntheticTreatments}
    monitoring={syntheticSafetyMonitoring}
  />,
  <DermatologyVigilanceBoard key="vigilance" issues={syntheticVigilanceIssues} />,
].map((workbench) => ({
  ...workbench,
  props: { ...workbench.props, dataMode: "clinical", presentation: "embedded" },
}));

describe("dermatology clinical host contract", () => {
  it("removes standalone headings and synthetic claims from every embedded workbench", () => {
    for (const workbench of embeddedClinicalWorkbenches) {
      const markup = renderToStaticMarkup(workbench);
      expect(markup).toContain('data-mode="clinical"');
      expect(markup).toContain('data-presentation="embedded"');
      expect(markup).not.toContain("<h2");
      expect(markup).not.toContain("Données synthétiques");
      expect(markup).not.toContain("SYNTHÉTIQUE");
      expect(markup).not.toContain("Fixture synthétique");
    }
  });

  it("does not invent dermoscopy imagery when clinical previews are absent", () => {
    const markup = renderToStaticMarkup(
      <DermoscopicComparisonViewer
        documents={syntheticDermoscopyDocuments}
        consent={syntheticImageConsent}
        dataMode="clinical"
      />,
    );

    expect(markup).toContain("Aperçu non transmis");
    expect(markup).not.toContain("SYNTHÉTIQUE");
    expect(markup).not.toContain("data-texture");
  });

  it("keeps fixture provenance explicit only when synthetic mode is requested", () => {
    const syntheticMarkup = renderToStaticMarkup(
      <BodyLesionMap lesions={syntheticLesions} dataMode="synthetic" />,
    );
    const clinicalMarkup = renderToStaticMarkup(<BodyLesionMap lesions={syntheticLesions} />);

    expect(syntheticMarkup).toContain("Données synthétiques");
    expect(clinicalMarkup).not.toContain("Données synthétiques");
  });
});
