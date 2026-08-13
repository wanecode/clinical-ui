import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { BodyLesionMap } from "./body-lesion-map";
import { DermatologyProcedureTimeline } from "./dermatology-procedure-timeline";
import { DermatologyVigilanceBoard } from "./dermatology-vigilance-board";
import { DermoscopicComparisonViewer } from "./dermoscopic-comparison-viewer";
import {
  syntheticDermoscopyDocuments,
  syntheticImageConsent,
  syntheticInflammatoryScores,
  syntheticLesionMeasurements,
  syntheticLesions,
  syntheticPhotographyQuality,
  syntheticPhototype,
  syntheticPigmentedAssessment,
  syntheticProcedures,
  syntheticSafetyMonitoring,
  syntheticTreatments,
  syntheticVigilanceIssues,
  syntheticWoundTrajectory,
} from "./fixtures";
import { InflammatoryScoreWorkbench } from "./inflammatory-score-workbench";
import { LesionLongitudinalCard } from "./lesion-longitudinal-card";
import { PhotographyQualityGate } from "./photography-quality-gate";
import { PigmentedLesionWorkbench } from "./pigmented-lesion-workbench";
import { TreatmentSafetyPanel } from "./treatment-safety-panel";
import type { LesionPlacement } from "./types";
import { WoundTrajectory } from "./wound-trajectory";

function requireFixture<T>(fixture: T | undefined): T {
  if (!fixture) throw new Error("La fixture lésionnelle principale est absente");
  return fixture;
}

const syntheticPrimaryLesion = requireFixture(syntheticLesions[0]);

function StoryColumn({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "1rem", margin: "0 auto", maxWidth: "96rem" }}>
      {children}
    </div>
  );
}

function BodyMapInteractionHarness() {
  const [selectedId, setSelectedId] = useState<string>(syntheticPrimaryLesion.id ?? "");
  const [lastPlacement, setLastPlacement] = useState<LesionPlacement>();
  return (
    <StoryColumn>
      <BodyLesionMap
        lesions={syntheticLesions}
        selectedLesionId={selectedId}
        onSelectLesion={(lesion) => setSelectedId(lesion.id ?? "")}
        onPlaceLesion={setLastPlacement}
      />
      <output aria-live="polite" style={{ fontFamily: "var(--font-mono)", fontSize: ".75rem" }}>
        {lastPlacement
          ? `Placement confirmé · ${lastPlacement.view} · ${lastPlacement.x.toFixed(3)} / ${lastPlacement.y.toFixed(3)}`
          : "Aucun placement confirmé"}
      </output>
    </StoryColumn>
  );
}

const meta = {
  title: "Dermatology/Clinical workbenches",
  tags: ["autodocs", "test"],
  parameters: {
    docs: {
      description: {
        component:
          "Composants dermatologiques FHIR R5 isolés. Toutes les données, identités et images sont synthétiques; les stories sont exécutées dans les six combinaisons de thème.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BodyLesionMapNominal: Story = {
  render: () => <BodyMapInteractionHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Antérieure" }));
    await expect(canvas.getByText("2 lésion(s)")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Augmenter le zoom" }));
    await expect(canvas.getByText("120 %")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Placer au clavier" }));
    const map = canvas.getByRole("img", { name: /schéma corporel abstrait/i }).parentElement;
    if (!map) throw new Error("Carte de placement absente");
    await userEvent.type(map.parentElement as HTMLElement, "{ArrowRight}{ArrowDown}{Enter}");
    await expect(canvas.getByText(/Placement confirmé · anterior/)).toBeVisible();
  },
};

export const BodyLesionMapLoading: Story = {
  render: () => <BodyLesionMap lesions={syntheticLesions} state="loading" />,
};

export const LesionLongitudinalCardNominal: Story = {
  render: () => (
    <StoryColumn>
      <LesionLongitudinalCard
        lesion={syntheticPrimaryLesion}
        observations={syntheticLesionMeasurements}
      />
    </StoryColumn>
  ),
};

export const LesionLongitudinalCardEmpty: Story = {
  render: () => <LesionLongitudinalCard observations={[]} state="empty" />,
};

export const DermoscopicComparisonViewerNominal: Story = {
  render: () => (
    <StoryColumn>
      <DermoscopicComparisonViewer
        documents={syntheticDermoscopyDocuments}
        consent={syntheticImageConsent}
        lesionLabel="LES-024"
      />
    </StoryColumn>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Masquer les images" }));
    await expect(canvas.getByText("Mode sans image actif")).toBeVisible();
    await expect(canvas.getByRole("table", { name: /alternative textuelle/i })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Afficher les images" }));
    await expect(canvas.getAllByText("SYNTHÉTIQUE")).toHaveLength(2);
  },
};

export const DermoscopicComparisonViewerMissingImage: Story = {
  render: () => (
    <DermoscopicComparisonViewer
      documents={[]}
      consent={syntheticImageConsent}
      stateMessage="Aucune dermoscopie n’a été jointe à LES-024. La saisie clinique reste disponible."
    />
  ),
};

export const DermoscopicComparisonViewerForbidden: Story = {
  render: () => (
    <DermoscopicComparisonViewer
      documents={syntheticDermoscopyDocuments}
      stateMessage="Le consentement image actif est absent ou ne permet pas cet usage."
    />
  ),
};

export const PhotographyQualityGateNominal: Story = {
  render: () => (
    <PhotographyQualityGate
      checks={syntheticPhotographyQuality.filter((check) => check.valueBoolean)}
      onDecision={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accept = canvas.getByRole("button", { name: "Accepter l’acquisition" });
    await expect(accept).toBeEnabled();
    await userEvent.click(accept);
  },
};

export const PhotographyQualityGateInsufficient: Story = {
  render: () => <PhotographyQualityGate checks={syntheticPhotographyQuality} onDecision={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Qualité insuffisante")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Accepter l’acquisition" })).toBeDisabled();
  },
};

export const WoundTrajectoryNominal: Story = {
  render: () => (
    <StoryColumn>
      <WoundTrajectory observations={syntheticWoundTrajectory} />
    </StoryColumn>
  ),
};

export const WoundTrajectoryError: Story = {
  render: () => (
    <WoundTrajectory
      observations={syntheticWoundTrajectory}
      state="error"
      stateMessage="La série de mesures de surface n’a pas pu être chargée."
    />
  ),
};

export const InflammatoryScoreWorkbenchNominal: Story = {
  render: () => (
    <StoryColumn>
      <InflammatoryScoreWorkbench
        observations={syntheticInflammatoryScores}
        phototype={syntheticPhototype}
      />
    </StoryColumn>
  ),
};

export const InflammatoryScoreWorkbenchMissingPhototype: Story = {
  render: () => (
    <StoryColumn>
      <InflammatoryScoreWorkbench observations={syntheticInflammatoryScores} />
    </StoryColumn>
  ),
};

export const InflammatoryScoreWorkbenchEmpty: Story = {
  render: () => <InflammatoryScoreWorkbench observations={[]} state="empty" />,
};

export const PigmentedLesionWorkbenchPreliminary: Story = {
  render: () => (
    <PigmentedLesionWorkbench
      lesion={syntheticPrimaryLesion}
      assessment={syntheticPigmentedAssessment}
      onEscalate={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Préliminaire")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Prioriser l’avis" }));
  },
};

export const PigmentedLesionWorkbenchForbidden: Story = {
  render: () => (
    <PigmentedLesionWorkbench
      lesion={syntheticPrimaryLesion}
      assessment={syntheticPigmentedAssessment}
      state="forbidden"
    />
  ),
};

export const DermatologyProcedureTimelineNominal: Story = {
  render: () => (
    <DermatologyProcedureTimeline procedures={syntheticProcedures} onAddProcedure={fn()} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Amendé")).toBeVisible();
    await expect(canvas.getByText(/La version antérieure reste traçable/)).toBeVisible();
  },
};

export const DermatologyProcedureTimelineEmpty: Story = {
  render: () => <DermatologyProcedureTimeline procedures={[]} state="empty" />,
};

export const TreatmentSafetyPanelNominal: Story = {
  render: () => (
    <TreatmentSafetyPanel
      treatments={syntheticTreatments}
      monitoring={syntheticSafetyMonitoring}
      onPlanMonitoring={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText(/En retard|Surveillance à planifier/).length).toBeGreaterThan(
      0,
    );
  },
};

export const TreatmentSafetyPanelLoading: Story = {
  render: () => (
    <TreatmentSafetyPanel treatments={syntheticTreatments} monitoring={[]} state="loading" />
  ),
};

export const DermatologyVigilanceBoardCritical: Story = {
  render: () => <DermatologyVigilanceBoard issues={syntheticVigilanceIssues} onAction={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Critique")).toBeVisible();
    await expect(canvas.getByText(/zone d’endémie/i)).toBeVisible();
  },
};

export const DermatologyVigilanceBoardError: Story = {
  render: () => (
    <DermatologyVigilanceBoard
      issues={syntheticVigilanceIssues}
      state="error"
      stateMessage="Les vigilances ne peuvent pas être consolidées pour le moment."
    />
  ),
};

export const IntegratedSyntheticEpisode: Story = {
  render: () => (
    <StoryColumn>
      <BodyLesionMap lesions={syntheticLesions} initialView="posterior" />
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 28rem), 1fr))",
        }}
      >
        <LesionLongitudinalCard
          lesion={syntheticPrimaryLesion}
          observations={syntheticLesionMeasurements}
        />
        <PigmentedLesionWorkbench
          lesion={syntheticPrimaryLesion}
          assessment={syntheticPigmentedAssessment}
        />
      </div>
      <DermoscopicComparisonViewer
        documents={syntheticDermoscopyDocuments}
        consent={syntheticImageConsent}
        lesionLabel="LES-024"
      />
      <PhotographyQualityGate checks={syntheticPhotographyQuality} />
      <WoundTrajectory observations={syntheticWoundTrajectory} />
      <InflammatoryScoreWorkbench observations={syntheticInflammatoryScores} />
      <DermatologyProcedureTimeline procedures={syntheticProcedures} />
      <TreatmentSafetyPanel
        treatments={syntheticTreatments}
        monitoring={syntheticSafetyMonitoring}
      />
      <DermatologyVigilanceBoard issues={syntheticVigilanceIssues} />
    </StoryColumn>
  ),
};
