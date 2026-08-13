import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticOrthopticsData } from "./fixtures";
import { OrthopticsWorkbench } from "./orthoptics-workbench";

const meta = {
  title: "Ophthalmology/OrthopticsWorkbench",
  component: OrthopticsWorkbench,
  tags: ["autodocs", "test"],
  args: { data: syntheticOrthopticsData, dataMode: "synthetic" },
  parameters: {
    docs: {
      description: {
        component:
          "Grille de motilité navigable au clavier avec coopération, stéréoscopie et risque d’amblyopie.",
      },
    },
  },
} satisfies Meta<typeof OrthopticsWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bilan: Story = {};

export const NavigationClavier: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const center = canvas.getByRole("button", { name: /Primaire · Centre/ });
    center.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: /Primaire · Droite/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.keyboard("{ArrowUp}");
    await expect(canvas.getByRole("button", { name: /Haut · Droite/ })).toHaveFocus();
    await userEvent.click(center);
    await expect(center).toHaveAttribute("aria-pressed", "true");
  },
};

export const NonTestable: Story = {
  args: {
    data: {
      ...syntheticOrthopticsData,
      cooperation: "not-testable",
      cells: syntheticOrthopticsData.cells.map((cell) => ({
        ...cell,
        value: "Non testé",
        finding: "not-tested" as const,
      })),
    },
  },
};

export const CompactMobile: Story = { parameters: { viewport: { defaultViewport: "mobile1" } } };

export const EmbarqueSansMotiliteDetaillee: Story = {
  args: {
    presentation: "embedded",
    dataMode: "clinical",
    state: "partial",
    data: {
      cells: [],
      coverDistance: "Ésotropie 18 Δ",
      stereopsis: "100 sec d’arc",
      source: "FHIR Observation/orthoptics-1",
    },
  },
};
