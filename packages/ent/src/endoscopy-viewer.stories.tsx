import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { EntEndoscopyViewer } from "./endoscopy-viewer";
import { syntheticEndoscopyMedia } from "./fixtures";

const meta = {
  title: "ORL/02 Imagerie/EntEndoscopyViewer",
  component: EntEndoscopyViewer,
  tags: ["autodocs", "test"],
  args: { media: syntheticEndoscopyMedia, dataMode: "synthetic" },
  parameters: {
    docs: {
      description: {
        component:
          "Visionneuse neutre avec disponibilité, consentement, latéralité et provenance persistants. Les médias de story sont des mires synthétiques.",
      },
    },
  },
} satisfies Meta<typeof EntEndoscopyViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Available: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const unavailable = canvas.getByRole("button", { name: /Capture attendue 02/ });
    await userEvent.click(unavailable);
    await expect(unavailable).toHaveAttribute("aria-current", "true");
    await expect(canvas.getByText("Aucune donnée disponible")).toBeVisible();
  },
};

export const Empty: Story = { args: { state: "empty" } };
export const Forbidden: Story = { args: { state: "forbidden" } };

export const EmbeddedClinical: Story = {
  args: { dataMode: "clinical", presentation: "embedded" },
};
