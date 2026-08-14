import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { syntheticLaborObservations } from "./fixtures";
import "./styles.css";
import { LaborPartogram } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/LaborPartogram",
  component: LaborPartogram,
  tags: ["autodocs", "test"],
  args: { observations: syntheticLaborObservations, dataMode: "synthetic" },
} satisfies Meta<typeof LaborPartogram>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nominal: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("img", { name: /Progression du travail/ }),
    ).toBeVisible();
  },
};
export const SansObservation: Story = { args: { observations: [], state: "empty" } };
