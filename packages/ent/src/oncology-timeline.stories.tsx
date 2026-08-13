import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticOncologyTimeline } from "./fixtures";
import { EntOncologyTimeline } from "./oncology-timeline";

const meta = {
  title: "ORL/07 Oncologie/EntOncologyTimeline",
  component: EntOncologyTimeline,
  tags: ["autodocs", "test"],
  args: { events: syntheticOncologyTimeline, dataMode: "synthetic" },
  parameters: {
    docs: {
      description: {
        component:
          "Chronologie de lésion, prélèvement, stade, coordination, projection et compte rendu signé, sans indication thérapeutique automatique.",
      },
    },
  },
} satisfies Meta<typeof EntOncologyTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignedLongitudinalCase: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const coordination = canvas.getByRole("button", { name: "Coordination" });
    await userEvent.click(coordination);
    await expect(coordination).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByText("Réunion de coordination")).toBeVisible();
    await expect(canvas.queryByText("Lésion décrite")).not.toBeInTheDocument();
  },
};

export const Empty: Story = { args: { state: "empty" } };

export const EmbeddedClinical: Story = {
  args: { dataMode: "clinical", presentation: "embedded" },
};
