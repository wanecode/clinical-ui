import { useState } from "react";
import {
  EyeLabel,
  OphthalmologyDataBoundary,
  OphthalmologyPanel,
  SyntheticStamp,
} from "./primitives";
import type { ClinicalDataState, OcularEmergencyData } from "./types";

export interface OcularEmergencySummaryProps {
  data: OcularEmergencyData;
  state?: ClinicalDataState;
  onDisposition?: (disposition: string) => void;
}

export function OcularEmergencySummary({
  data,
  state = "ready",
  onDisposition,
}: OcularEmergencySummaryProps) {
  const [findings, setFindings] = useState(data.findings);
  const activeCritical = findings.filter(
    (finding) => finding.present && finding.severity === "critical",
  );
  const toggle = (id: string) =>
    setFindings((items) =>
      items.map((item) => (item.id === id ? { ...item, present: !item.present } : item)),
    );
  return (
    <OphthalmologyDataBoundary state={state} label="Urgence oculaire">
      <article className="oph-workbench oph-emergency">
        <header
          className="oph-emergency__banner"
          data-critical={activeCritical.length > 0 || undefined}
        >
          <span className="oph-emergency__icon" aria-hidden="true">
            !
          </span>
          <div>
            <p>
              {activeCritical.length > 0 ? "Drapeau rouge · haute urgence" : "Évaluation urgente"}
            </p>
            <h2>
              {activeCritical.length > 0
                ? `${activeCritical.length} signe${activeCritical.length > 1 ? "s" : ""} critique${activeCritical.length > 1 ? "s" : ""}`
                : "Aucun drapeau rouge actif"}
            </h2>
            <span>{data.disposition}</span>
          </div>
          <div className="oph-emergency__signals">
            <SyntheticStamp />
            <div className="oph-pain-score">
              <span>Douleur</span>
              <strong>{data.painScore}</strong>
              <small>/10</small>
            </div>
          </div>
        </header>
        <div className="oph-emergency__context">
          <div>
            <span>Latéralité</span>
            {data.affectedEye === "OU" ? (
              <strong>OU · Bilatéral</strong>
            ) : (
              <EyeLabel eye={data.affectedEye} long />
            )}
          </div>
          <div>
            <span>Début</span>
            <strong>{data.onset}</strong>
          </div>
          <div>
            <span>Mécanisme</span>
            <strong>{data.mechanism}</strong>
          </div>
        </div>
        <div className="oph-emergency__grid">
          <OphthalmologyPanel title="Drapeaux rouges" eyebrow="Triage interactif">
            <ul className="oph-emergency-checklist">
              {findings.map((finding) => (
                <li
                  key={finding.id}
                  data-severity={finding.severity}
                  data-present={finding.present || undefined}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={finding.present}
                      onChange={() => toggle(finding.id)}
                    />
                    <span aria-hidden="true">
                      {finding.severity === "critical"
                        ? "!"
                        : finding.severity === "urgent"
                          ? "△"
                          : "○"}
                    </span>
                    <strong>{finding.label}</strong>
                    <small>
                      {finding.severity === "critical"
                        ? "Critique"
                        : finding.severity === "urgent"
                          ? "Urgent"
                          : "Routine"}
                    </small>
                  </label>
                </li>
              ))}
            </ul>
          </OphthalmologyPanel>
          <OphthalmologyPanel title="Conduite immédiate" eyebrow="Safety net">
            <ol className="oph-emergency-steps">
              <li>Protéger l’œil sans compression.</li>
              <li>Maintenir à jeun selon le contexte clinique.</li>
              <li>Ne pas retirer un corps étranger pénétrant.</li>
              <li>Tracer l’heure, la latéralité et l’évolution.</li>
            </ol>
            <button
              className="oph-primary-action"
              type="button"
              onClick={() => onDisposition?.(data.disposition)}
            >
              <span aria-hidden="true">→</span> Confirmer l’orientation
            </button>
            <p className="oph-low-vision">
              <span>Basse vision / orientation</span>
              <strong>{data.lowVisionReferral ?? "Non évaluée"}</strong>
            </p>
            <p className="oph-low-vision">
              <span>Aptitude</span>
              <strong>{data.fitnessStatement ?? "Non évaluée"}</strong>
            </p>
          </OphthalmologyPanel>
        </div>
        <footer className="oph-emergency__footer">
          <strong>Scénario synthétique uniquement.</strong>
          <span>
            Cette interface démontre une hiérarchie d’information ; elle ne remplace pas un
            protocole local.
          </span>
        </footer>
      </article>
    </OphthalmologyDataBoundary>
  );
}
