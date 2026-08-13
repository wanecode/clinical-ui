import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BilateralClinicalRail } from "./bilateral-clinical-rail";
import { syntheticBilateralAlerts, syntheticBilateralEyes } from "./fixtures";

const meta = {
  title: "Ophthalmology/BilateralClinicalRail",
  component: BilateralClinicalRail,
  tags: ["autodocs", "test"],
  args: {
    right: syntheticBilateralEyes.OD,
    left: syntheticBilateralEyes.OG,
    alerts: syntheticBilateralAlerts,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Rail de latéralité explicite : OD, OG et synthèse binoculaire sans dépendre de la couleur.",
      },
    },
  },
} satisfies Meta<typeof BilateralClinicalRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "Œil droit" })).toBeVisible();
    await expect(
      canvas.getByRole("complementary", { name: "Synthèse binoculaire" }),
    ).toHaveTextContent("Comparaison active");
  },
};

export const Monoculaire: Story = { args: { left: undefined, alerts: [] } };

export const Asymetrie: Story = {
  args: {
    alerts: [
      {
        id: "iop",
        severity: "critical",
        label: "Asymétrie pressionnelle",
        detail: "Écart OD/OG de 9 mmHg confirmé deux fois.",
      },
    ],
    right: { ...syntheticBilateralEyes.OD, iop: 24, status: "critical" },
  },
};

export const DonneesDiscordantes: Story = {
  args: {
    right: {
      ...syntheticBilateralEyes.OD,
      source: "Observation/import-tonometer-a",
      sourceContext: "Import DICOM SR · 2026-08-12 · dispositif A",
    },
    left: {
      ...syntheticBilateralEyes.OG,
      source: "Observation/manual-entry-b",
      sourceContext: "Saisie manuelle · 2026-08-11 · auteur B",
      status: "preliminary",
    },
  },
};

export const CompactMobile: Story = {
  args: { compact: true },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const Partiel: Story = { args: { state: "partial", left: undefined } };
