import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticPeriodontalSites } from "./fixtures";
import { PeriodontalChart } from "./periodontal-chart";

const meta = {
  title: "Odontology/PeriodontalChart",
  component: PeriodontalChart,
  tags: ["autodocs", "test"],
  args: { sites: syntheticPeriodontalSites, defaultView: "chart", dataMode: "synthetic" },
  parameters: {
    docs: {
      description: {
        component:
          "Sondage parodontal à six sites : profondeur, récession, BOP et plaque avec bascule vers un tableau complet.",
      },
    },
  },
} satisfies Meta<typeof PeriodontalChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SixSiteChart: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tableButton = canvas.getByRole("button", { name: "Tableau" });
    await userEvent.click(tableButton);
    await expect(tableButton).toHaveAttribute("aria-pressed", "true");
    await expect(
      canvas.getByRole("table", { name: "Mesures parodontales à six sites" }),
    ).toBeVisible();
  },
};

export const EmbeddedClinical: Story = { args: { dataMode: "clinical", presentation: "embedded" } };

export const TableFirst: Story = { args: { defaultView: "table" } };
export const NoMeasurements: Story = { args: { sites: [], state: "empty" } };
