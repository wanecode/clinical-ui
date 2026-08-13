import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticAcuityReadings, syntheticRefractions } from "./fixtures";
import { VisualAcuityRefractionWorkbench } from "./visual-acuity-refraction-workbench";

const meta = {
  title: "Ophthalmology/VisualAcuityRefractionWorkbench",
  component: VisualAcuityRefractionWorkbench,
  tags: ["autodocs", "test"],
  args: { acuities: syntheticAcuityReadings, refractions: syntheticRefractions },
  parameters: {
    docs: {
      description: {
        component:
          "Saisie d’acuité et de réfraction avec conversions calculées et statut d’amendement visible.",
      },
    },
  },
} satisfies Meta<typeof VisualAcuityRefractionWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lecture: Story = {};

export const SaisieEtConversion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "logMAR" }));
    await expect(canvas.getByText(/logMAR =/)).toBeVisible();
    const sphere = canvas.getByRole("spinbutton", { name: "OD · Sphère" });
    await userEvent.clear(sphere);
    await userEvent.type(sphere, "-6");
    await expect(canvas.getAllByText("Corrigé").length).toBeGreaterThan(0);
  },
};

export const Incomplet: Story = {
  args: {
    acuities: [
      { ...syntheticAcuityReadings[0], pinhole: undefined },
      { ...syntheticAcuityReadings[1], near: undefined },
    ],
    refractions: [
      { ...syntheticRefractions[0], cylinder: undefined, axis: undefined },
      syntheticRefractions[1],
    ],
    state: "partial",
  },
};

export const Amende: Story = {
  args: {
    acuities: syntheticAcuityReadings.map((reading) => ({
      ...reading,
      status: "amended" as const,
      note: "Correction tracée après relecture.",
    })),
  },
};

export const LectureSeule: Story = { args: { readOnly: true } };
