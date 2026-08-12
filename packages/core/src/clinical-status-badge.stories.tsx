import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClinicalStatusBadge } from "./clinical-status-badge";
import type { ClinicalStatus } from "./types";

const STATUSES: ClinicalStatus[] = [
  "validated",
  "preliminary",
  "amended",
  "warning",
  "critical",
  "unknown",
];

function StatusGallery() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: ".7rem" }}>
      {STATUSES.map((status) => (
        <ClinicalStatusBadge key={status} status={status} />
      ))}
    </div>
  );
}

const meta = {
  title: "Core/ClinicalStatusBadge",
  component: ClinicalStatusBadge,
  tags: ["autodocs", "test"],
  args: { status: "validated" },
  argTypes: {
    status: { control: "select", options: STATUSES },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Statut clinique lisible sans dépendre de la couleur : icône, libellé et contraste sémantique restent associés.",
      },
    },
  },
} satisfies Meta<typeof ClinicalStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const AllStatuses: Story = { render: () => <StatusGallery /> };
