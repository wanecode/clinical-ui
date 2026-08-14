import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  syntheticBirthDecision,
  syntheticFetalMeasures,
  syntheticHemorrhageItems,
  syntheticLaborObservations,
  syntheticNewbornItems,
  syntheticPostpartumItems,
  syntheticPregnancyEpisode,
  syntheticPrenatalEvents,
  syntheticReproductiveEvents,
  syntheticServiceItems,
  syntheticVigilanceItems,
} from "./fixtures";
import {
  BirthDecisionBoard,
  FetalAssessmentWorkbench,
  GynecologyObstetricsCockpit,
  GynecologyObstetricsServiceCatalog,
  HemorrhageSafetyWorkbench,
  LaborPartogram,
  NewbornTransitionWorkbench,
  PostpartumWorkbench,
  PregnancyEpisodeContext,
  PrenatalTimeline,
  ReproductiveHealthWorkbench,
} from "./workbenches";

const workbenches = [
  <PregnancyEpisodeContext key="context" episode={syntheticPregnancyEpisode} />,
  <GynecologyObstetricsCockpit key="cockpit" items={syntheticVigilanceItems} />,
  <ReproductiveHealthWorkbench key="reproductive" events={syntheticReproductiveEvents} />,
  <PrenatalTimeline key="prenatal" events={syntheticPrenatalEvents} />,
  <FetalAssessmentWorkbench key="fetal" measures={syntheticFetalMeasures} />,
  <LaborPartogram key="labor" observations={syntheticLaborObservations} />,
  <BirthDecisionBoard key="decision" decision={syntheticBirthDecision} />,
  <HemorrhageSafetyWorkbench key="hemorrhage" items={syntheticHemorrhageItems} />,
  <NewbornTransitionWorkbench key="newborn" items={syntheticNewbornItems} />,
  <PostpartumWorkbench key="postpartum" items={syntheticPostpartumItems} />,
  <GynecologyObstetricsServiceCatalog key="catalog" items={syntheticServiceItems} />,
].map((workbench) => ({
  ...workbench,
  props: { ...workbench.props, dataMode: "clinical", presentation: "embedded" },
}));

describe("gynecology and obstetrics clinical host contract", () => {
  it("delegates heading and outer surface for every embedded workbench", () => {
    for (const workbench of workbenches) {
      const markup = renderToStaticMarkup(workbench);
      expect(markup).toContain('data-mode="clinical"');
      expect(markup).toContain('data-presentation="embedded"');
      expect(markup).not.toContain("<h2");
      expect(markup).not.toContain("Données synthétiques");
    }
  });
  it("labels synthetic data only when explicitly requested", () => {
    const clinical = renderToStaticMarkup(<PrenatalTimeline events={syntheticPrenatalEvents} />);
    const synthetic = renderToStaticMarkup(
      <PrenatalTimeline events={syntheticPrenatalEvents} dataMode="synthetic" />,
    );
    expect(clinical).not.toContain("Données synthétiques");
    expect(synthetic).toContain("Données synthétiques");
  });

  it("renders an empty birth decision without invented provenance", () => {
    const markup = renderToStaticMarkup(
      <BirthDecisionBoard
        decision={null}
        state="empty"
        stateMessage="Aucune décision de naissance documentée."
      />,
    );
    expect(markup).toContain("Aucune décision de naissance documentée.");
    expect(markup).not.toContain("Task/");
  });
});
