import type { Meta, StoryObj } from "@storybook/react-vite";
import { CLINICAL_UI_MODES, CLINICAL_UI_PALETTES, ClinicalThemeScope } from "./index";

function TokenSample({ token, label }: { token: string; label: string }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        display: "flex",
        gap: ".75rem",
        padding: ".75rem",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          background: `var(--${token})`,
          border: "1px solid var(--border)",
          borderRadius: ".35rem",
          display: "block",
          height: "2rem",
          width: "2rem",
        }}
      />
      <span>
        <strong style={{ display: "block", fontSize: ".875rem" }}>{label}</strong>
        <code
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-mono)",
            fontSize: ".72rem",
          }}
        >
          --{token}
        </code>
      </span>
    </div>
  );
}

function ThemeContract() {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <header style={{ maxWidth: "48rem" }}>
        <p className="cui-eyebrow">Fondations</p>
        <h1 className="cui-display-title">Un contrat, six ambiances cliniques</h1>
        <p className="cui-lead">
          Le mode et la palette changent l’atmosphère. La sémantique, le contraste et la hiérarchie
          clinique restent stables.
        </p>
      </header>
      <div className="cui-theme-matrix">
        {CLINICAL_UI_MODES.flatMap((mode) =>
          CLINICAL_UI_PALETTES.map((palette) => (
            <ClinicalThemeScope key={`${mode}-${palette}`} mode={mode} palette={palette}>
              <section className="cui-theme-swatch">
                <div className="cui-theme-swatch__heading">
                  <div>
                    <strong>
                      {palette === "clinical"
                        ? "Clinique"
                        : palette === "ocean"
                          ? "Océan"
                          : "Sauge"}
                    </strong>
                    <span>{mode === "light" ? "Clair" : "Sombre"}</span>
                  </div>
                  <button className="cui-button" type="button">
                    Action
                  </button>
                </div>
                <div className="cui-token-grid">
                  <TokenSample token="primary" label="Primaire" />
                  <TokenSample token="clinical-warning" label="Vigilance" />
                  <TokenSample token="clinical-critical" label="Critique" />
                  <TokenSample token="status-success" label="Validé" />
                </div>
              </section>
            </ClinicalThemeScope>
          )),
        )}
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Theme contract",
  component: ThemeContract,
  tags: ["autodocs", "test"],
  parameters: {
    docs: {
      description: {
        component:
          "The six supported combinations rendered simultaneously. Components consume semantic CSS variables compatible with shadcn and tweakcn.",
      },
    },
  },
} satisfies Meta<typeof ThemeContract>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SixThemeMatrix: Story = {};
