import { ClinicalStatusBadge } from "@clinical-ui/core";
import { useState } from "react";
import {
  EyeLabel,
  Metric,
  OphthalmologyDataBoundary,
  OphthalmologyPanel,
  SyntheticStamp,
} from "./primitives";
import type { CataractPlan, ClinicalDataState } from "./types";

export interface CataractSurgeryPlannerProps {
  plan: CataractPlan;
  state?: ClinicalDataState;
}

const IOL_OPTIONS = [
  "Monofocale asphérique — modèle synthétique A",
  "Monofocale torique — modèle synthétique B",
  "Profondeur de champ — modèle synthétique C",
];

export function CataractSurgeryPlanner({ plan, state = "ready" }: CataractSurgeryPlannerProps) {
  const [selectedIol, setSelectedIol] = useState(plan.selectedIol);
  const [power, setPower] = useState(plan.plannedPower);
  return (
    <OphthalmologyDataBoundary state={state} label="Planification de chirurgie de cataracte">
      <article className="oph-workbench oph-cataract">
        <header className="oph-workbench-heading">
          <div>
            <p className="oph-kicker">Cataracte & chirurgie</p>
            <h2>Planifier, opérer, auditer</h2>
            <p>Une continuité documentaire de la biométrie au résultat réfractif.</p>
          </div>
          <div className="oph-heading-actions">
            <EyeLabel eye={plan.eye} long />
            <SyntheticStamp />
          </div>
        </header>
        <nav className="oph-cataract__flow" aria-label="Cycle chirurgical">
          {["Biométrie", "Choix implant", "Validation", "Procédure", "Audit"].map((step, index) => (
            <div key={step} data-current={index === 1 || undefined}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </nav>
        <div className="oph-cataract__grid">
          <OphthalmologyPanel title="Biométrie" eyebrow="Mesures importées">
            <dl className="oph-metric-grid">
              <Metric label="Longueur axiale" value={plan.axialLength.toFixed(2)} unit="mm" />
              <Metric
                label="Profondeur chambre"
                value={plan.anteriorChamberDepth.toFixed(2)}
                unit="mm"
              />
              <Metric label="K moyenne" value={plan.keratometry.toFixed(2)} unit="D" />
              <Metric label="Cible" value={plan.targetRefraction.toFixed(2)} unit="D" />
            </dl>
            <p className="oph-source-line">
              <span>Nature</span>
              <code>Importé · biomètre synthétique</code>
            </p>
          </OphthalmologyPanel>
          <OphthalmologyPanel
            title="Implant & puissance"
            eyebrow="Décision préliminaire"
            action={<ClinicalStatusBadge status={plan.procedureStatus} compact />}
          >
            <fieldset className="oph-iol-options">
              <legend>Type d’implant intraoculaire</legend>
              {IOL_OPTIONS.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="iol"
                    checked={selectedIol === option}
                    onChange={() => setSelectedIol(option)}
                  />
                  <span>
                    <strong>{option}</strong>
                    <small>
                      {option === plan.selectedIol ? "Proposition calculée" : "Alternative"}
                    </small>
                  </span>
                </label>
              ))}
            </fieldset>
            <label className="oph-power-control">
              <span>Puissance planifiée</span>
              <input
                type="number"
                step="0.5"
                value={power}
                onChange={(event) => setPower(Number(event.target.value))}
              />
              <b>D</b>
            </label>
          </OphthalmologyPanel>
          <OphthalmologyPanel title="Cycle documentaire" eyebrow="Complétude">
            <ul className="oph-document-list">
              {plan.documents.map((document) => (
                <li key={document.label} data-status={document.status}>
                  <span aria-hidden="true">
                    {document.status === "signed"
                      ? "✓"
                      : document.status === "complete"
                        ? "●"
                        : "!"}
                  </span>
                  <strong>{document.label}</strong>
                  <small>
                    {document.status === "signed"
                      ? "Signé"
                      : document.status === "complete"
                        ? "Complet"
                        : "Manquant"}
                  </small>
                </li>
              ))}
            </ul>
          </OphthalmologyPanel>
        </div>
        <OphthalmologyPanel title="Audit réfractif" eyebrow="Cible versus résultat">
          <div className="oph-table-wrap">
            <table className="oph-table">
              <caption>Résultats postopératoires synthétiques</caption>
              <thead>
                <tr>
                  <th>Indicateur</th>
                  <th>Cible</th>
                  <th>Observé</th>
                  <th>Écart</th>
                </tr>
              </thead>
              <tbody>
                {plan.audit.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.target}</td>
                    <td>{row.observed ?? "Non encore mesuré"}</td>
                    <td>{row.observed && row.observed !== "En attente" ? "À calculer" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </OphthalmologyPanel>
      </article>
    </OphthalmologyDataBoundary>
  );
}
