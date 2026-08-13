import { ClinicalContextHeader } from "@clinical-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId, useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { BilateralClinicalRail } from "./bilateral-clinical-rail";
import {
  syntheticBilateralAlerts,
  syntheticBilateralEyes,
  syntheticEmergencyData,
  syntheticGlaucomaData,
  syntheticRetinaCareEvents,
  syntheticRetinaImages,
} from "./fixtures";
import { GlaucomaProgressionWorkbench } from "./glaucoma-progression-workbench";
import { OcularEmergencySummary } from "./ocular-emergency-summary";
import { RetinaImagingTimeline } from "./retina-imaging-timeline";

const retinaImageAssets = {
  "oct-2026-od": new URL("./assets/oct-od-current-synthetic.png", import.meta.url).href,
  "oct-2026-og": new URL("./assets/oct-og-current-low-signal-synthetic.png", import.meta.url).href,
  "oct-2025-od": new URL("./assets/oct-od-prior-synthetic.png", import.meta.url).href,
} as const;

const workspaceRetinaImages = syntheticRetinaImages.map((image) => {
  const imageUrl = retinaImageAssets[image.id as keyof typeof retinaImageAssets];
  return imageUrl
    ? {
        ...image,
        imageUrl,
        imageAlt: `OCT synthétique ${image.eye} du ${image.date}, coupe maculaire simulée`,
      }
    : image;
});

const modules = [
  { id: "synthesis", label: "Synthèse bilatérale" },
  { id: "glaucoma", label: "Glaucome" },
  { id: "retina", label: "Rétine" },
  { id: "emergency", label: "Urgence" },
] as const;

type ModuleId = (typeof modules)[number]["id"];

function OphthalmologyClinicalWorkspace() {
  const [activeModule, setActiveModule] = useState<ModuleId>("synthesis");
  const panelId = useId();

  return (
    <main className="oph-clinical-workspace">
      <ClinicalContextHeader
        patient={{
          id: "patient-synthetic-oph-001",
          label: "Mariam Diop — patiente synthétique",
          mrn: "SYN-OPH-0042",
          birthDate: "1984-02-17",
          ageLabel: "42 ans",
          sexLabel: "Femme",
        }}
        encounter={{
          id: "encounter-synthetic-oph-001",
          effectiveAt: "12 août 2026 · 10:15",
          service: "Consultation d’ophtalmologie",
          practitioner: "Dr A. Fall",
        }}
        sourceLabel="Données synthétiques"
        status="validated"
        title="Dossier ophtalmologique"
      />
      <nav className="oph-clinical-workspace__nav" aria-label="Modules ophtalmologiques">
        <div role="tablist" aria-label="Parcours clinique">
          {modules.map((module) => (
            <button
              key={module.id}
              id={`${panelId}-${module.id}-tab`}
              type="button"
              role="tab"
              aria-controls={`${panelId}-panel`}
              aria-selected={activeModule === module.id}
              onClick={() => setActiveModule(module.id)}
            >
              {module.label}
            </button>
          ))}
        </div>
        <span>Scénario de démonstration · aucune donnée patient réelle</span>
      </nav>
      <section
        className="oph-clinical-workspace__body"
        id={`${panelId}-panel`}
        role="tabpanel"
        aria-labelledby={`${panelId}-${activeModule}-tab`}
      >
        {activeModule === "synthesis" ? (
          <BilateralClinicalRail
            right={syntheticBilateralEyes.OD}
            left={syntheticBilateralEyes.OG}
            alerts={syntheticBilateralAlerts}
            dataMode="synthetic"
          />
        ) : null}
        {activeModule === "glaucoma" ? (
          <GlaucomaProgressionWorkbench data={syntheticGlaucomaData} dataMode="synthetic" />
        ) : null}
        {activeModule === "retina" ? (
          <RetinaImagingTimeline
            images={workspaceRetinaImages}
            careEvents={syntheticRetinaCareEvents}
          />
        ) : null}
        {activeModule === "emergency" ? (
          <OcularEmergencySummary data={syntheticEmergencyData} />
        ) : null}
      </section>
    </main>
  );
}

const meta = {
  title: "Ophthalmology/ClinicalWorkspace",
  component: OphthalmologyClinicalWorkspace,
  tags: ["autodocs", "test"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Composition de référence avec identité, rencontre et source partagées au-dessus des modules spécialisés.",
      },
    },
  },
} satisfies Meta<typeof OphthalmologyClinicalWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DossierLongitudinal: Story = {};

export const NavigationEntreModules: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const retinaTab = canvas.getByRole("tab", { name: "Rétine" });
    await userEvent.click(retinaTab);
    await expect(retinaTab).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("heading", { name: "Imagerie dans le temps" })).toBeVisible();
    await userEvent.click(canvas.getByRole("tab", { name: "Synthèse bilatérale" }));
  },
};
