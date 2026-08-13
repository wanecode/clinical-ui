import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AudiogramWorkbench } from "./audiogram-workbench";
import { EndoscopeTraceability } from "./endoscope-traceability";
import { EntEndoscopyViewer } from "./endoscopy-viewer";
import {
  syntheticAudiogram,
  syntheticEndoscopyMedia,
  syntheticMiddleEar,
  syntheticOncologyTimeline,
  syntheticRhinology,
  syntheticSafetyChecklist,
  syntheticSleep,
  syntheticTraceability,
  syntheticVestibularFindings,
  syntheticVoiceSwallowingFindings,
} from "./fixtures";
import { MiddleEarWorkbench } from "./middle-ear-workbench";
import { EntOncologyTimeline } from "./oncology-timeline";
import {
  RhinologyWorkbench,
  SleepWorkbench,
  VestibularWorkbench,
  VoiceSwallowingWorkbench,
} from "./specialty-workbenches";
import { EntSurgerySafetyPanel } from "./surgery-safety-panel";

const embeddedClinicalWorkbenches = [
  <AudiogramWorkbench
    key="audiogram"
    data={syntheticAudiogram}
    dataMode="clinical"
    presentation="embedded"
  />,
  <MiddleEarWorkbench
    key="middle-ear"
    data={syntheticMiddleEar}
    dataMode="clinical"
    presentation="embedded"
  />,
  <EntEndoscopyViewer
    key="endoscopy"
    media={syntheticEndoscopyMedia}
    dataMode="clinical"
    presentation="embedded"
  />,
  <VestibularWorkbench
    key="vestibular"
    findings={syntheticVestibularFindings}
    dataMode="clinical"
    presentation="embedded"
  />,
  <VoiceSwallowingWorkbench
    key="voice-swallowing"
    findings={syntheticVoiceSwallowingFindings}
    dataMode="clinical"
    presentation="embedded"
  />,
  <RhinologyWorkbench
    key="rhinology"
    data={syntheticRhinology}
    dataMode="clinical"
    presentation="embedded"
  />,
  <SleepWorkbench key="sleep" data={syntheticSleep} dataMode="clinical" presentation="embedded" />,
  <EntOncologyTimeline
    key="oncology"
    events={syntheticOncologyTimeline}
    dataMode="clinical"
    presentation="embedded"
  />,
  <EntSurgerySafetyPanel
    key="surgery"
    items={syntheticSafetyChecklist}
    dataMode="clinical"
    presentation="embedded"
  />,
  <EndoscopeTraceability
    key="traceability"
    record={syntheticTraceability}
    dataMode="clinical"
    presentation="embedded"
  />,
];

describe("ENT clinical host contract", () => {
  it("removes standalone headings and synthetic claims from every embedded workbench", () => {
    const componentClaims = [
      "Audiogramme tonal synthétique",
      "Média synthétique",
      "MIRE SYNTHÉTIQUE",
      "Trace synthétique de stabilité",
      "visualisation synthétique de démonstration",
      "DHI synthétique",
      "Observé · synthétique",
      "Piste d’audit synthétique",
      "Les identifiants sont synthétiques",
    ];

    for (const workbench of embeddedClinicalWorkbenches) {
      const markup = renderToStaticMarkup(workbench);
      expect(markup).toContain('data-presentation="embedded"');
      expect(markup).not.toContain("<h2");
      expect(markup).not.toContain("Données entièrement synthétiques");
      for (const claim of componentClaims) expect(markup).not.toContain(claim);
    }
  });

  it("does not invent endoscopy imagery when a clinical media URL is absent", () => {
    const markup = renderToStaticMarkup(
      <EntEndoscopyViewer media={syntheticEndoscopyMedia} dataMode="clinical" />,
    );

    expect(markup).toContain('data-state="partial"');
    expect(markup).not.toContain("MIRE SYNTHÉTIQUE");
  });

  it("keeps synthetic provenance explicit only when requested", () => {
    const syntheticMarkup = renderToStaticMarkup(
      <AudiogramWorkbench data={syntheticAudiogram} dataMode="synthetic" />,
    );
    const clinicalMarkup = renderToStaticMarkup(<AudiogramWorkbench data={syntheticAudiogram} />);

    expect(syntheticMarkup).toContain("Données entièrement synthétiques");
    expect(clinicalMarkup).not.toContain("Données entièrement synthétiques");
  });
});
