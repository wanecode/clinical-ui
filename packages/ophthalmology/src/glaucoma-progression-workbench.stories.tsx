import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticGlaucomaData } from "./fixtures";
import { GlaucomaProgressionWorkbench } from "./glaucoma-progression-workbench";

const meta = {
  title: "Ophthalmology/GlaucomaProgressionWorkbench",
  component: GlaucomaProgressionWorkbench,
  tags: ["autodocs", "test"],
  args: { data: syntheticGlaucomaData },
  parameters: {
    docs: {
      description: {
        component:
          "PIO, RNFL et champ visuel avec projections en tirets explicitement non observées.",
      },
    },
  },
} satisfies Meta<typeof GlaucomaProgressionWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Progression: Story = {};

export const NavigationClavierEtTable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstPoint = canvas.getAllByRole("button", { name: /OD.*mmHg.*Observé/ }).at(0);
    if (!firstPoint) throw new Error("Point de trajectoire OD introuvable");
    firstPoint.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getAllByRole("button", { pressed: true }).length).toBeGreaterThan(0);
    const tableToggle = canvas
      .getAllByRole("button", { name: "Afficher l’alternative tabulaire" })
      .at(0);
    if (!tableToggle) throw new Error("Commande d’alternative tabulaire introuvable");
    await userEvent.click(tableToggle);
    await expect(
      canvas.getByRole("table", {
        name: "Évolution de la pression intraoculaire — valeurs de la courbe",
      }),
    ).toBeVisible();
    const tableHide = canvas
      .getAllByRole("button", { name: "Masquer l’alternative tabulaire" })
      .at(0);
    if (!tableHide) throw new Error("Commande de fermeture tabulaire introuvable");
    await userEvent.click(tableHide);
    firstPoint.focus();
    await userEvent.keyboard("{Home}");
    await expect(firstPoint).toHaveAttribute("aria-pressed", "true");
  },
};

export const PreliminaireEtPartiel: Story = {
  args: {
    state: "partial",
    data: { ...syntheticGlaucomaData, visualField: syntheticGlaucomaData.visualField.slice(0, 1) },
  },
};

export const SansProjection: Story = {
  args: {
    data: {
      ...syntheticGlaucomaData,
      iop: syntheticGlaucomaData.iop.filter((point) => point.kind !== "projected"),
      rnfl: syntheticGlaucomaData.rnfl.filter((point) => point.kind !== "projected"),
    },
  },
};
