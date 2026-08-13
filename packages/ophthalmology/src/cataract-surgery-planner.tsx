import { ClinicalStatusBadge } from "@clinical-ui/core";
import { useState } from "react";
import {
  EyeLabel,
  Metric,
  OphthalmologyDataBoundary,
  OphthalmologyPanel,
  OphthalmologyWorkbenchHeader,
} from "./primitives";
import type {
  CataractPlan,
  ClinicalDataState,
  OphthalmologyDataMode,
  OphthalmologyPresentation,
} from "./types";

export interface CataractSurgeryPlannerProps {
  plan: CataractPlan;
  state?: ClinicalDataState;
  dataMode?: OphthalmologyDataMode;
  presentation?: OphthalmologyPresentation;
  readOnly?: boolean;
  iolOptions?: string[];
}

const IOL_OPTIONS = [
  "Monofocale asphérique — modèle synthétique A",
  "Monofocale torique — modèle synthétique B",
  "Profondeur de champ — modèle synthétique C",
];

export function CataractSurgeryPlanner({
  plan,
  state = "ready",
  dataMode = "clinical",
  presentation = "standalone",
  readOnly = false,
  iolOptions,
}: CataractSurgeryPlannerProps) {
  const [selectedIol, setSelectedIol] = useState(plan.selectedIol);
  const [power, setPower] = useState(plan.plannedPower);
  const options =
    iolOptions ??
    (dataMode === "synthetic" ? IOL_OPTIONS : plan.selectedIol ? [plan.selectedIol] : []);
  return (
    <OphthalmologyDataBoundary state={state} label="Planification de chirurgie de cataracte">
      <article className="oph-workbench oph-cataract" data-presentation={presentation}>
        <OphthalmologyWorkbenchHeader
          kicker="Cataracte & chirurgie"
          title="Planifier, opérer, auditer"
          description="Une continuité documentaire de la biométrie au résultat réfractif."
          dataMode={dataMode}
          presentation={presentation}
          actions={<EyeLabel eye={plan.eye} long />}
        />
        <nav className="oph-cataract__flow" aria-label="Cycle chirurgical">
          {["Biométrie", "Choix implant", "Validation", "Procédure", "Audit"].map((step, index) => (
            <div key={step} data-current={index === plan.currentStep || undefined}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </nav>
        <div className="oph-cataract__grid">
          <OphthalmologyPanel title="Biométrie" eyebrow="Mesures importées">
            <dl className="oph-metric-grid">
              <Metric label="Longueur axiale" value={plan.axialLength?.toFixed(2)} unit="mm" />
              <Metric
                label="Profondeur chambre"
                value={plan.anteriorChamberDepth?.toFixed(2)}
                unit="mm"
              />
              <Metric label="K moyenne" value={plan.keratometry?.toFixed(2)} unit="D" />
              <Metric label="Cible" value={plan.targetRefraction?.toFixed(2)} unit="D" />
            </dl>
            <p className="oph-source-line">
              <span>Source</span>
              <code>{plan.source ?? "Non renseignée"}</code>
            </p>
          </OphthalmologyPanel>
          <OphthalmologyPanel
            title="Implant & puissance"
            eyebrow="Décision préliminaire"
            action={<ClinicalStatusBadge status={plan.procedureStatus} compact />}
          >
            <fieldset className="oph-iol-options" disabled={readOnly}>
              <legend>Type d’implant intraoculaire</legend>
              {options.length ? (
                options.map((option) => (
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
                        {option === plan.selectedIol ? "Proposition documentée" : "Alternative"}
                      </small>
                    </span>
                  </label>
                ))
              ) : (
                <p className="oph-empty-inline">Aucun implant documenté</p>
              )}
            </fieldset>
            <label className="oph-power-control">
              <span>Puissance planifiée</span>
              <input
                type="number"
                step="0.5"
                value={power ?? ""}
                disabled={readOnly}
                onChange={(event) =>
                  setPower(event.target.value === "" ? undefined : Number(event.target.value))
                }
              />
              <b>D</b>
            </label>
          </OphthalmologyPanel>
          <OphthalmologyPanel title="Cycle documentaire" eyebrow="Complétude">
            {plan.documents.length ? (
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
            ) : (
              <p className="oph-empty-inline">Cycle documentaire non renseigné</p>
            )}
          </OphthalmologyPanel>
        </div>
        <OphthalmologyPanel title="Audit réfractif" eyebrow="Cible versus résultat">
          <div className="oph-table-wrap">
            <table className="oph-table">
              <caption>
                Résultats postopératoires {dataMode === "synthetic" ? "synthétiques" : "documentés"}
              </caption>
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
                    <td>{row.delta ?? "—"}</td>
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
