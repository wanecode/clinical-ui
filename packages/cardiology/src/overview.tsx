import { ClinicalStatusBadge } from "@clinical-ui/core";
import type { ReactNode } from "react";
import {
  DataOriginBadge,
  DecisionCallout,
  SourceReference,
  WorkbenchHeader,
  WorkbenchState,
} from "./shared";
import type { CardiologyViewState, RiskScoreModel, SummaryDatum } from "./types";

export interface CardiovascularSummaryProps {
  data: SummaryDatum[];
  riskScore: RiskScoreModel;
  state?: CardiologyViewState;
  patientLabel?: string;
  decisionOwner?: string;
  onReviewDecision?: () => void;
}

export function CardiovascularSummary({
  data,
  riskScore,
  state = "ready",
  patientLabel = "Patient synthétique",
  decisionOwner = "Équipe cardiologie",
  onReviewDecision,
}: CardiovascularSummaryProps) {
  return (
    <section className="cardio-workbench cardio-summary" aria-label="Synthèse cardiovasculaire">
      <WorkbenchHeader
        eyebrow="Dossier cardiovasculaire · FHIR R5"
        title="Vue cardiovasculaire"
        description={`${patientLabel} · données cliniques explicitement synthétiques`}
        status={riskScore.status === "calculated" ? "validated" : "warning"}
      />
      <WorkbenchState state={state} label="Synthèse cardiovasculaire">
        <div className="cardio-summary__grid">
          {data.map((datum) => (
            <article className="cardio-summary-card" key={datum.id}>
              <div className="cardio-summary-card__topline">
                <span>{datum.label}</span>
                <ClinicalStatusBadge status={datum.status} compact />
              </div>
              <strong>{datum.value}</strong>
              {datum.detail ? <p>{datum.detail}</p> : null}
              <div className="cardio-summary-card__meta">
                <DataOriginBadge origin={datum.origin} />
                <SourceReference>{datum.sourceReference}</SourceReference>
              </div>
            </article>
          ))}
        </div>
        <DecisionCallout
          title={
            riskScore.status === "calculated"
              ? "Mettre en contexte le risque avant toute décision"
              : "Compléter les données avant le calcul"
          }
          detail={
            riskScore.status === "calculated"
              ? `${riskScore.name} ${riskScore.version} : ${riskScore.value?.toLocaleString("fr-FR")} % à ${riskScore.horizon}. Ce résultat dérivé ne constitue pas une prescription.`
              : `Données manquantes : ${riskScore.missingInputs.join(", ") || "non précisées"}. Le score n'est pas calculé.`
          }
          owner={decisionOwner}
          action={
            onReviewDecision ? (
              <button className="cardio-button" type="button" onClick={onReviewDecision}>
                Ouvrir la revue
              </button>
            ) : undefined
          }
        />
      </WorkbenchState>
    </section>
  );
}

export interface RiskScoreWorkbenchProps {
  score: RiskScoreModel;
  state?: CardiologyViewState;
  footer?: ReactNode;
}

export function RiskScoreWorkbench({ score, state = "ready", footer }: RiskScoreWorkbenchProps) {
  const scoreValue = score.value;
  const calculated = score.status === "calculated" && scoreValue !== undefined;
  return (
    <section className="cardio-workbench cardio-risk" aria-label="Atelier de score de risque">
      <WorkbenchHeader
        eyebrow="Score dérivé et explicable"
        title="Atelier de risque"
        description={`${score.name} · modèle ${score.version} · horizon ${score.horizon}`}
        status={calculated ? "validated" : "warning"}
      />
      <WorkbenchState state={state} label="Atelier de risque">
        <div className="cardio-risk__layout">
          <div className="cardio-risk__result" data-calculated={calculated}>
            <p className="cardio-eyebrow">Résultat</p>
            {calculated ? (
              <>
                <strong>
                  {scoreValue?.toLocaleString("fr-FR")} <small>{score.unit}</small>
                </strong>
                <p>Risque estimé à {score.horizon}</p>
              </>
            ) : (
              <>
                <strong className="cardio-risk__not-calculated">Non calculé</strong>
                <p>Les entrées manquantes restent visibles ci-contre.</p>
              </>
            )}
            <div
              className="cardio-risk__scale"
              role="img"
              aria-label="Repères textuels de risque : faible, modéré, élevé"
            >
              <span>Faible</span>
              <span>Modéré</span>
              <span>Élevé</span>
            </div>
            <SourceReference>{score.sourceReference}</SourceReference>
          </div>
          <div className="cardio-risk__inputs">
            <div className="cardio-section-heading">
              <div>
                <p className="cardio-eyebrow">Entrées du modèle</p>
                <h3>{score.inputs.length} facteurs tracés</h3>
              </div>
              <span className="cardio-count">{score.missingInputs.length} manquante(s)</span>
            </div>
            <table className="cardio-table">
              <caption className="cardio-visually-hidden">
                Entrées, valeurs, origine et références utilisées par le score
              </caption>
              <thead>
                <tr>
                  <th scope="col">Facteur</th>
                  <th scope="col">Valeur</th>
                  <th scope="col">Origine</th>
                  <th scope="col">Ressource</th>
                </tr>
              </thead>
              <tbody>
                {score.inputs.map((input) => (
                  <tr key={input.id} data-missing={!input.value}>
                    <th scope="row">{input.label}</th>
                    <td>{input.value ?? "Manquante"}</td>
                    <td>
                      <DataOriginBadge origin={input.origin} />
                    </td>
                    <td>
                      {input.sourceReference ? (
                        <SourceReference>{input.sourceReference}</SourceReference>
                      ) : (
                        <span className="cardio-missing">Aucune source</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {score.missingInputs.length > 0 ? (
          <div className="cardio-inline-alert" role="status">
            <strong>Calcul suspendu.</strong> Données manquantes : {score.missingInputs.join(", ")}.
          </div>
        ) : null}
        {footer}
      </WorkbenchState>
    </section>
  );
}
