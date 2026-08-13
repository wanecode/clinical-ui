import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticPrimaryTeeth, syntheticTeeth } from "./fixtures";
import { LongitudinalOdontogram } from "./longitudinal-odontogram";

const allTeeth = [...syntheticTeeth, ...syntheticPrimaryTeeth];

const meta = {
  title: "Odontology/LongitudinalOdontogram",
  component: LongitudinalOdontogram,
  tags: ["autodocs", "test"],
  args: {
    teeth: allTeeth,
    dentition: "permanent",
    selectedTooth: "16",
    selectedSurface: "occlusal",
  },
  argTypes: {
    dentition: { control: "inline-radio", options: ["permanent", "primary", "mixed"] },
    density: { control: "inline-radio", options: ["comfortable", "compact"] },
    state: { control: "select", options: ["ready", "loading", "empty", "error", "forbidden"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Odontogramme FDI longitudinal accessible au clavier, avec sélection de face, états doublés par symbole et libellé, historique et alternative tabulaire.",
      },
    },
  },
} satisfies Meta<typeof LongitudinalOdontogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PermanentDentition: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tooth = canvas.getByRole("button", { name: /Dent permanente 16/ });
    await expect(tooth).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(canvas.getByRole("button", { name: /Mésiale/ }));
    await expect(canvas.getByRole("button", { name: /Mésiale/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(canvas.getByText("Lésion carieuse occlusale")).toBeVisible();
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tooth16 = canvas.getByRole("button", { name: /Dent permanente 16/ });
    tooth16.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: /Dent permanente 15/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

export const PrimaryDentition: Story = {
  args: { dentition: "primary", selectedTooth: "64" },
};

export const MixedDentition: Story = {
  args: { dentition: "mixed", selectedTooth: "64" },
};

export const CompactDesktop: Story = { args: { density: "compact" } };

export const MobileHorizontalScroll: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const Loading: Story = { args: { state: "loading" } };
export const Empty: Story = { args: { state: "empty" } };
export const DataError: Story = { args: { state: "error" } };
export const Forbidden: Story = { args: { state: "forbidden" } };
export const HistoryAbsent: Story = { args: { historiesAvailable: false } };
export const UnsupportedNotation: Story = { args: { notation: "Universal / reçu : UR6" } };
export const EntryConflict: Story = {
  args: {
    entryConflict: {
      localAuthor: "Dr M. Ba",
      remoteAuthor: "Dr S. Kane",
      localTime: "10:24",
      remoteTime: "10:25",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent("Conflit de saisie");
    await userEvent.click(canvas.getByRole("button", { name: "Comparer les versions" }));
  },
};
