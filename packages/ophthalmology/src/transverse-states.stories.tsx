import { ClinicalStatusBadge } from "@clinical-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OphthalmologyDataBoundary } from "./primitives";
import type { ClinicalDataState } from "./types";

function TransverseStateGallery() {
  const dataStates: ClinicalDataState[] = ["loading", "empty", "error", "forbidden", "partial"];
  return (
    <div className="oph-state-gallery">
      <header className="oph-workbench-heading">
        <div>
          <p className="oph-kicker">Contrat transverse</p>
          <h2>États sans ambiguïté</h2>
          <p>Chaque absence ou maturité conserve un libellé, une forme et une sémantique.</p>
        </div>
      </header>
      <div
        style={{
          display: "grid",
          gap: ".75rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
        }}
      >
        {dataStates.map((state) => (
          <OphthalmologyDataBoundary key={state} state={state} label={`État ${state}`}>
            <div className="oph-panel">
              <div className="oph-panel__body">
                <strong>Contenu clinique partiel</strong>
              </div>
            </div>
          </OphthalmologyDataBoundary>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".55rem", marginTop: "1rem" }}>
        <ClinicalStatusBadge status="preliminary" label="Préliminaire" />
        <ClinicalStatusBadge status="validated" label="Final / validé" />
        <ClinicalStatusBadge status="amended" label="Amendé" />
        <ClinicalStatusBadge status="critical" label="Critique" />
      </div>
    </div>
  );
}

const meta = {
  title: "Ophthalmology/Transverse states",
  component: TransverseStateGallery,
  tags: ["autodocs", "test"],
  parameters: {
    docs: {
      description: {
        component:
          "Loading, vide, erreur, interdit, partiel, préliminaire, final, amendé et critique.",
      },
    },
  },
} satisfies Meta<typeof TransverseStateGallery>;

export default meta;
type Story = StoryObj<typeof meta>;
export const TousLesEtats: Story = {};
