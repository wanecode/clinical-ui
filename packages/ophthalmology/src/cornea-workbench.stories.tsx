import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { CorneaWorkbench } from "./cornea-workbench";
import { syntheticCorneaData } from "./fixtures";

const meta = {
  title: "Ophthalmology/CorneaWorkbench",
  component: CorneaWorkbench,
  tags: ["autodocs", "test"],
  args: { data: syntheticCorneaData, dataMode: "synthetic" },
  parameters: {
    docs: {
      description: {
        component:
          "Kératométrie, topographie, surface oculaire, lentilles et trajectoire cornéenne.",
      },
    },
  },
} satisfies Meta<typeof CorneaWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Topographie: Story = {};

export const InteractionCarte: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inferiorZone = canvas.getByRole("option", { name: /Inférieur/ });
    await userEvent.click(inferiorZone);
    await expect(inferiorZone).toHaveAttribute("aria-selected", "true");
    await userEvent.click(canvas.getByRole("option", { name: /Central/ }));
  },
};

export const SurfacePartielle: Story = {
  args: {
    state: "partial",
    data: { ...syntheticCorneaData, dryEyeScore: 0, lensStatus: "Non documenté" },
  },
};

export const MonoculaireOG: Story = { args: { data: { ...syntheticCorneaData, eye: "OG" } } };

export const EmbarqueSansCarteTransmise: Story = {
  args: {
    presentation: "embedded",
    dataMode: "clinical",
    state: "partial",
    data: {
      eye: "OD",
      map: [],
      trajectory: [],
      kmax: 47.2,
      thinnest: 482,
      source: "FHIR Observation/keratometry-od",
    },
  },
};
