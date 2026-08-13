import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CataractSurgeryPlanner } from "./cataract-surgery-planner";
import { CorneaWorkbench } from "./cornea-workbench";
import { OcularEmergencySummary } from "./ocular-emergency-summary";
import { OrthopticsWorkbench } from "./orthoptics-workbench";
import { RetinaImagingTimeline } from "./retina-imaging-timeline";
import { VisualAcuityRefractionWorkbench } from "./visual-acuity-refraction-workbench";

describe("ophthalmology clinical host mode", () => {
  it("removes standalone headings from every embedded workbench", () => {
    const markups = [
      renderToStaticMarkup(
        <VisualAcuityRefractionWorkbench
          acuities={[]}
          refractions={[]}
          presentation="embedded"
          readOnly
        />,
      ),
      renderToStaticMarkup(
        <CorneaWorkbench data={{ eye: "OD", map: [], trajectory: [] }} presentation="embedded" />,
      ),
      renderToStaticMarkup(<RetinaImagingTimeline images={[]} presentation="embedded" />),
      renderToStaticMarkup(
        <CataractSurgeryPlanner
          plan={{ eye: "OD", procedureStatus: "unknown", documents: [], audit: [] }}
          presentation="embedded"
          readOnly
        />,
      ),
      renderToStaticMarkup(<OrthopticsWorkbench data={{ cells: [] }} presentation="embedded" />),
    ];

    for (const markup of markups) {
      expect(markup).not.toContain("100 % synthétique");
    }
    expect(markups[0]).not.toContain("Du mesuré à la prescription");
    expect(markups[1]).not.toContain("Topographie en contexte");
    expect(markups[2]).not.toContain("Imagerie dans le temps");
    expect(markups[3]).not.toContain("Planifier, opérer, auditer");
    expect(markups[4]).not.toContain("Alignement en neuf positions");
  });

  it("does not fabricate images, maps, motility cells, implants or emergency protocols", () => {
    const retina = renderToStaticMarkup(
      <RetinaImagingTimeline
        images={[
          {
            id: "oct-1",
            eye: "OD",
            date: "2026-08-13",
            modality: "OCT",
            quality: "good",
            qualityLabel: "Exploitable",
            source: "FHIR Observation/oct-1",
          },
        ]}
        presentation="embedded"
      />,
    );
    const cornea = renderToStaticMarkup(
      <CorneaWorkbench data={{ eye: "OD", map: [], trajectory: [] }} presentation="embedded" />,
    );
    const orthoptics = renderToStaticMarkup(
      <OrthopticsWorkbench data={{ cells: [] }} presentation="embedded" />,
    );
    const cataract = renderToStaticMarkup(
      <CataractSurgeryPlanner
        plan={{ eye: "OD", procedureStatus: "unknown", documents: [], audit: [] }}
        presentation="embedded"
        readOnly
      />,
    );
    const emergency = renderToStaticMarkup(
      <OcularEmergencySummary
        data={{ findings: [], triageLevel: "Urgent" }}
        presentation="embedded"
        readOnly
      />,
    );

    expect(retina).toContain("Aperçu non transmis");
    expect(retina).not.toContain("oph-synthetic-scan__fallback");
    expect(cornea).toContain("Carte topographique non transmise");
    expect(orthoptics).toContain("Motilité détaillée non documentée");
    expect(cataract).toContain("Aucun implant documenté");
    expect(emergency).toContain("Conduite non documentée");
    expect(emergency).not.toContain("Protéger l’œil");
  });
});
