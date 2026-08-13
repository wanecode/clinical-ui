import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { EndoscopeTraceability } from "./endoscope-traceability";
import { syntheticTraceability } from "./fixtures";

const meta = {
  title: "ORL/09 Traçabilité/EndoscopeTraceability",
  component: EndoscopeTraceability,
  tags: ["autodocs", "test"],
  args: { record: syntheticTraceability, dataMode: "synthetic" },
} satisfies Meta<typeof EndoscopeTraceability>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Released: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const audit = canvas.getByRole("button", { name: "Voir la piste d’audit" });
    await userEvent.click(audit);
    await expect(canvas.getByText("Piste d’audit synthétique")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Masquer la piste d’audit" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  },
};

export const Incomplete: Story = {
  args: {
    record: {
      scopeIdentifier: syntheticTraceability.scopeIdentifier,
      procedureReference: syntheticTraceability.procedureReference,
      cycleIdentifier: syntheticTraceability.cycleIdentifier,
      operator: "IDE M. Sarr — identité synthétique",
      leakTest: "not-recorded",
      cleaning: "incomplete",
      disinfection: "pending",
      vigilanceAcknowledged: false,
    },
  },
};

export const EmbeddedClinical: Story = {
  args: { dataMode: "clinical", presentation: "embedded" },
};
