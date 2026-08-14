import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticPeriodontalSites, syntheticTeeth } from "./fixtures";
import { OralHealthSummary } from "./oral-health-summary";

const meta = {
  title: "Odontology/OralHealthSummary",
  component: OralHealthSummary,
  tags: ["autodocs", "test"],
  args: {
    teeth: syntheticTeeth,
    periodontalSites: syntheticPeriodontalSites,
    painScore: 1,
    hygieneLabel: "À renforcer",
    dataMode: "synthetic",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Synthèse dérivée et explicable de la santé orale, avec tous les constats accessibles dans un tableau.",
      },
    },
  },
} satisfies Meta<typeof OralHealthSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DerivedSummary: Story = {};
export const EmbeddedClinical: Story = { args: { dataMode: "clinical", presentation: "embedded" } };
export const SourceError: Story = { args: { state: "error" } };
