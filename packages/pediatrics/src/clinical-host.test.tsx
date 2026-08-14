import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  syntheticActorContexts,
  syntheticAgeContext,
  syntheticDevelopmentWindows,
  syntheticDisposition,
  syntheticDoseCalculation,
  syntheticGrowthSeries,
  syntheticNorms,
  syntheticPreventionItems,
  syntheticRedFlags,
  syntheticServiceItems,
  syntheticTrajectoryEvents,
  syntheticTransitionItems,
  syntheticTriageObservations,
  syntheticVigilanceItems,
  syntheticWeights,
} from "./fixtures";
import {
  ChildFamilyContextWorkbench,
  GrowthDevelopmentWorkbench,
  PediatricChronicCareTrajectory,
  PediatricContextWorkbench,
  PediatricDoseSafetyWorkbench,
  PediatricPreventionTimeline,
  PediatricServiceCatalog,
  PediatricsCockpit,
  PediatricTriageWorkbench,
  TransitionReadinessWorkbench,
} from "./workbenches";

const embeddedClinicalWorkbenches = [
  <PediatricContextWorkbench
    key="context"
    age={syntheticAgeContext}
    weights={syntheticWeights}
    norms={syntheticNorms}
  />,
  <PediatricsCockpit key="cockpit" items={syntheticVigilanceItems} />,
  <GrowthDevelopmentWorkbench
    key="growth"
    series={syntheticGrowthSeries}
    windows={syntheticDevelopmentWindows}
  />,
  <PediatricDoseSafetyWorkbench key="dose" calculation={syntheticDoseCalculation} />,
  <PediatricPreventionTimeline key="prevention" items={syntheticPreventionItems} />,
  <PediatricTriageWorkbench
    key="triage"
    observations={syntheticTriageObservations}
    redFlags={syntheticRedFlags}
    disposition={syntheticDisposition}
  />,
  <PediatricChronicCareTrajectory key="chronic" events={syntheticTrajectoryEvents} />,
  <ChildFamilyContextWorkbench key="family" actors={syntheticActorContexts} />,
  <TransitionReadinessWorkbench key="transition" items={syntheticTransitionItems} />,
  <PediatricServiceCatalog key="catalog" items={syntheticServiceItems} />,
].map((workbench) => ({
  ...workbench,
  props: { ...workbench.props, dataMode: "clinical", presentation: "embedded" },
}));

describe("pediatrics clinical host contract", () => {
  it("delegates the outer heading and surface for every embedded workbench", () => {
    for (const workbench of embeddedClinicalWorkbenches) {
      const markup = renderToStaticMarkup(workbench);
      expect(markup).toContain('data-mode="clinical"');
      expect(markup).toContain('data-presentation="embedded"');
      expect(markup).not.toContain("<h2");
      expect(markup).not.toContain("Données synthétiques");
    }
  });

  it("labels synthetic fixtures only when explicitly requested", () => {
    const clinical = renderToStaticMarkup(<PediatricsCockpit items={syntheticVigilanceItems} />);
    const synthetic = renderToStaticMarkup(
      <PediatricsCockpit items={syntheticVigilanceItems} dataMode="synthetic" />,
    );
    expect(clinical).not.toContain("Données synthétiques");
    expect(synthetic).toContain("Données synthétiques");
  });

  it("renders an empty dose workbench without invented clinical data", () => {
    const markup = renderToStaticMarkup(
      <PediatricDoseSafetyWorkbench
        calculation={null}
        state="empty"
        stateMessage="Aucune prescription documentée."
      />,
    );
    expect(markup).toContain("Aucune prescription documentée.");
    expect(markup).not.toContain("MedicationRequest/");
  });
});
