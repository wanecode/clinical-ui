import type { Meta, StoryObj } from "@storybook/react-vite";
import { DentalDocumentLifecycle } from "./dental-document-lifecycle";
import { syntheticDocumentVersions } from "./fixtures";

const meta = {
  title: "Odontology/DentalDocumentLifecycle",
  component: DentalDocumentLifecycle,
  tags: ["autodocs", "test"],
  args: { documents: syntheticDocumentVersions },
  parameters: {
    docs: {
      description: {
        component:
          "Cycle documentaire versionné, signé et supersédé, avec registre tabulaire équivalent.",
      },
    },
  },
} satisfies Meta<typeof DentalDocumentLifecycle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignedAndSuperseded: Story = {};
export const NoDocuments: Story = { args: { documents: [], state: "empty" } };
