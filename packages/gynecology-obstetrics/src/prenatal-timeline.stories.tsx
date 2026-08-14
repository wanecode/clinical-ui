import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticPrenatalEvents } from "./fixtures";
import "./styles.css";
import { PrenatalTimeline } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/PrenatalTimeline",
  component: PrenatalTimeline,
  tags: ["autodocs", "test"],
  args: { events: syntheticPrenatalEvents, dataMode: "synthetic" },
} satisfies Meta<typeof PrenatalTimeline>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nominal: Story = {};
export const ResultatIndisponible: Story = {
  args: {
    events: syntheticPrenatalEvents
      .filter((event) => event.windowStatus === "upcoming")
      .map((event) => ({ ...event, windowStatus: "unavailable" as const })),
  },
};
export const EchecSource: Story = { args: { state: "error" } };
