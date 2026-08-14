import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CardiacTrajectory,
  CardiologyReportLifecycle,
  CardiologyVigilanceBoard,
  ImplantedDeviceTimeline,
  PrescriptionSafetyBoard,
} from "./care";
import {
  AmbulatoryBloodPressureChart,
  EcgWorkbench,
  EchocardiographyWorkbench,
  HolterSummary,
} from "./diagnostics";
import {
  syntheticBloodPressureReadings,
  syntheticDeviceTimeline,
  syntheticEcgStudy,
  syntheticEchoMeasures,
  syntheticHolterEvents,
  syntheticPrescriptionItems,
  syntheticReportLifecycle,
  syntheticRiskScore,
  syntheticSummaryData,
  syntheticTrajectoryEvents,
  syntheticVigilanceItems,
} from "./fixtures";
import { CardiovascularSummary, RiskScoreWorkbench } from "./overview";

const embeddedClinicalWorkbenches = [
  <CardiovascularSummary
    key="summary"
    data={syntheticSummaryData}
    riskScore={syntheticRiskScore}
  />,
  <RiskScoreWorkbench key="risk" score={syntheticRiskScore} />,
  <EcgWorkbench key="ecg" study={syntheticEcgStudy} />,
  <EchocardiographyWorkbench key="echo" measures={syntheticEchoMeasures} />,
  <AmbulatoryBloodPressureChart key="mapa" readings={syntheticBloodPressureReadings} />,
  <HolterSummary key="holter" events={syntheticHolterEvents} />,
  <CardiacTrajectory key="trajectory" events={syntheticTrajectoryEvents} />,
  <PrescriptionSafetyBoard key="prescriptions" items={syntheticPrescriptionItems} />,
  <ImplantedDeviceTimeline key="device" events={syntheticDeviceTimeline} />,
  <CardiologyReportLifecycle key="reports" items={syntheticReportLifecycle} />,
  <CardiologyVigilanceBoard key="vigilance" items={syntheticVigilanceItems} />,
].map((workbench) => ({
  ...workbench,
  props: { ...workbench.props, dataMode: "clinical", presentation: "embedded" },
}));

describe("cardiology clinical host contract", () => {
  it("delegates the heading and outer surface for every embedded workbench", () => {
    for (const workbench of embeddedClinicalWorkbenches) {
      const markup = renderToStaticMarkup(workbench);
      expect(markup).toContain('data-mode="clinical"');
      expect(markup).toContain('data-presentation="embedded"');
      expect(markup).not.toContain("<h2");
    }
  });

  it("does not label clinical ECG data or tables as synthetic", () => {
    const markup = renderToStaticMarkup(<EcgWorkbench study={syntheticEcgStudy} />);
    expect(markup).toContain("Tracé ECG, dérivation");
    expect(markup).not.toContain("Tracé ECG synthétique");
    expect(markup).not.toContain("Échantillons du signal ECG synthétique");
  });

  it("keeps synthetic provenance explicit only when requested", () => {
    const syntheticMarkup = renderToStaticMarkup(
      <CardiovascularSummary
        data={syntheticSummaryData}
        riskScore={syntheticRiskScore}
        dataMode="synthetic"
      />,
    );
    const clinicalMarkup = renderToStaticMarkup(
      <CardiovascularSummary data={syntheticSummaryData} riskScore={syntheticRiskScore} />,
    );
    expect(syntheticMarkup).toContain("données synthétiques");
    expect(clinicalMarkup).not.toContain("données synthétiques");
  });
});
