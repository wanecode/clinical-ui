import { useState } from "react";
import {
  DataModeStamp,
  EyeLabel,
  OphthalmologyDataBoundary,
  OphthalmologyPanel,
} from "./primitives";
import type {
  ClinicalDataState,
  OcularEmergencyData,
  OphthalmologyDataMode,
  OphthalmologyPresentation,
} from "./types";

export interface OcularEmergencySummaryProps {
  data: OcularEmergencyData;
  state?: ClinicalDataState;
  dataMode?: OphthalmologyDataMode;
  presentation?: OphthalmologyPresentation;
  readOnly?: boolean;
  onDisposition?: (disposition: string) => void;
}

export function OcularEmergencySummary({
  data,
  state = "ready",
  dataMode = "clinical",
  presentation = "standalone",
  readOnly = false,
  onDisposition,
}: OcularEmergencySummaryProps) {
  const [findings, setFindings] = useState(data.findings);
  const activeCritical = findings.filter(
    (finding) => finding.present && finding.severity === "critical",
  );
  const disposition = data.disposition;
  const toggle = (id: string) =>
    setFindings((items) =>
      items.map((item) => (item.id === id ? { ...item, present: !item.present } : item)),
    );
  const Heading = presentation === "embedded" ? "h3" : "h2";
  const headline = activeCritical.length
    ? `${activeCritical.length} signe${activeCritical.length > 1 ? "s" : ""} critique${activeCritical.length > 1 ? "s" : ""}`
    : findings.length
      ? "Aucun drapeau rouge actif"
      : (data.triageLevel ?? "Drapeaux rouges non documentés");
  return (
    <OphthalmologyDataBoundary state={state} label="Urgence oculaire">
      <article className="oph-workbench oph-emergency" data-presentation={presentation}>
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
            <Heading>{headline}</Heading>
            <span>{data.disposition ?? "Orientation non documentée"}</span>
          </div>
          <div className="oph-emergency__signals">
            <DataModeStamp mode={dataMode} />
            <div className="oph-pain-score">
              <span>Douleur</span>
              <strong>{data.painScore ?? "—"}</strong>
              <small>/10</small>
            </div>
          </div>
        </header>
        <div className="oph-emergency__context">
          <div>
            <span>Latéralité</span>
            {data.affectedEye === "OU" ? (
              <strong>OU · Bilatéral</strong>
            ) : data.affectedEye ? (
              <EyeLabel eye={data.affectedEye} long />
            ) : (
              <strong>Non documentée</strong>
            )}
          </div>
          <div>
            <span>Début</span>
            <strong>{data.onset ?? "Non documenté"}</strong>
          </div>
          <div>
            <span>Mécanisme</span>
            <strong>{data.mechanism ?? "Non documenté"}</strong>
          </div>
        </div>
        <div className="oph-emergency__grid">
          <OphthalmologyPanel title="Drapeaux rouges" eyebrow="Triage interactif">
            {findings.length ? (
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
                        disabled={readOnly}
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
            ) : (
              <div className="oph-structured-empty" role="status">
                <strong>Drapeaux rouges non renseignés</strong>
                <span>Le résumé de triage ne permet pas de déduire des signes absents.</span>
              </div>
            )}
          </OphthalmologyPanel>
          <OphthalmologyPanel title="Conduite immédiate" eyebrow="Safety net">
            {data.immediateActions?.length ? (
              <ol className="oph-emergency-steps">
                {data.immediateActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            ) : (
              <div className="oph-structured-empty" role="status">
                <strong>Conduite non documentée</strong>
                <span>Aucune recommandation générique n’est injectée par le composant.</span>
              </div>
            )}
            {disposition && onDisposition ? (
              <button
                className="oph-primary-action"
                type="button"
                disabled={readOnly}
                onClick={() => onDisposition(disposition)}
              >
                <span aria-hidden="true">→</span> Confirmer l’orientation
              </button>
            ) : null}
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
        {dataMode === "synthetic" ? (
          <footer className="oph-emergency__footer">
            <strong>Scénario synthétique uniquement.</strong>
            <span>
              Cette interface démontre une hiérarchie d’information ; elle ne remplace pas un
              protocole local.
            </span>
          </footer>
        ) : null}
        {data.source ? (
          <p className="oph-source-line">
            <span>Source</span>
            <code>{data.source}</code>
          </p>
        ) : null}
      </article>
    </OphthalmologyDataBoundary>
  );
}
