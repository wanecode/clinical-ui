import { useState } from "react";
import {
  DataMaturityBadge,
  EntStatePanel,
  EntWorkbenchFrame,
  LateralityMark,
  Metric,
  SegmentedControl,
  SourceLine,
} from "./common";
import type {
  EntDisplayState,
  RhinologyDataset,
  SleepDataset,
  VestibularFinding,
  VoiceSwallowingFinding,
} from "./types";

export interface VestibularWorkbenchProps {
  findings: VestibularFinding[];
  state?: EntDisplayState;
}

export function VestibularWorkbench({ findings, state = "ready" }: VestibularWorkbenchProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = findings[selectedIndex];
  return (
    <EntWorkbenchFrame
      title="Équilibre et vertiges"
      eyebrow="Vestibulaire"
      description="Séquence de tests, côté provoqué, symptômes et provenance sans conclusion automatique."
      status="Série observée"
      statusTone="neutral"
    >
      {state !== "ready" ? (
        <EntStatePanel state={state} />
      ) : findings.length === 0 ? (
        <EntStatePanel state="empty" />
      ) : (
        <div className="ent-module-grid ent-module-grid--vestibular">
          <nav className="ent-test-list" aria-label="Tests vestibulaires">
            {findings.map((finding, index) => (
              <button
                key={`${finding.test}-${finding.side}`}
                type="button"
                aria-current={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{finding.test}</strong>
                <small>{finding.maturity === "imported" ? "Importé" : "Observé"}</small>
              </button>
            ))}
          </nav>
          {selected ? (
            <section className="ent-panel ent-vestibular-focus" aria-live="polite">
              <div className="ent-section-heading">
                <div>
                  <p className="ent-eyebrow">Test sélectionné</p>
                  <h3>{selected.test}</h3>
                </div>
                <DataMaturityBadge maturity={selected.maturity} />
              </div>
              <div
                className="ent-balance-trace"
                role="img"
                aria-label="Trace synthétique de stabilité, complétée par les valeurs textuelles"
              >
                <span />
                <span />
                <span />
                <span />
              </div>
              <dl className="ent-metric-grid ent-metric-grid--two">
                <Metric label="Résultat consigné" value={selected.result} />
                <Metric label="Côté" value={<LateralityMark laterality={selected.side} />} />
              </dl>
              <p className="ent-clinical-note">
                Le tracé est une visualisation synthétique de démonstration. L’interprétation reste
                celle du compte rendu source.
              </p>
            </section>
          ) : null}
          <aside className="ent-facts">
            <h3>Contexte du symptôme</h3>
            <dl>
              <Metric label="Durée" value="3 semaines" />
              <Metric label="Déclencheur" value="Positionnel déclaré" />
              <Metric label="DHI synthétique" value="22 / 100" note="Questionnaire observé" />
            </dl>
            <div className="ent-inline-notice">
              <strong>Drapeau rouge</strong>
              <span>
                Aucun drapeau rouge consigné dans cette fixture. Cette absence n’est pas une
                conclusion clinique.
              </span>
            </div>
          </aside>
        </div>
      )}
    </EntWorkbenchFrame>
  );
}

export interface VoiceSwallowingWorkbenchProps {
  findings: VoiceSwallowingFinding[];
  state?: EntDisplayState;
}

export function VoiceSwallowingWorkbench({
  findings,
  state = "ready",
}: VoiceSwallowingWorkbenchProps) {
  const [domain, setDomain] = useState<"voice" | "swallowing">("voice");
  const visible = findings.filter((finding) => finding.domain === domain);
  return (
    <EntWorkbenchFrame
      title="Voix et déglutition"
      eyebrow="Fonction laryngée"
      description="Mesures instrumentales, questionnaires et disponibilité des examens séparés par domaine."
      status={
        visible.some((finding) => finding.maturity === "preliminary") ? "Préliminaire" : "Observé"
      }
      statusTone={
        visible.some((finding) => finding.maturity === "preliminary") ? "pending" : "neutral"
      }
      actions={
        <SegmentedControl
          label="Choisir le domaine"
          value={domain}
          onChange={setDomain}
          options={[
            { value: "voice", label: "Voix" },
            { value: "swallowing", label: "Déglutition" },
          ]}
        />
      }
    >
      {state !== "ready" ? (
        <EntStatePanel state={state} />
      ) : (
        <div className="ent-module-grid ent-module-grid--voice">
          <section className="ent-panel">
            <div className="ent-section-heading">
              <div>
                <p className="ent-eyebrow">
                  {domain === "voice" ? "Phonation" : "Sécurité de déglutition"}
                </p>
                <h3>{domain === "voice" ? "Mesures vocales" : "Mesures de déglutition"}</h3>
              </div>
            </div>
            <div
              className="ent-waveform"
              role="img"
              aria-label="Forme d’onde décorative ; les mesures sont listées textuellement"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <ul className="ent-finding-list">
              {visible.map((finding) => (
                <li key={finding.measure}>
                  <div>
                    <strong>{finding.measure}</strong>
                    <span>{finding.value}</span>
                  </div>
                  <DataMaturityBadge maturity={finding.maturity} />
                </li>
              ))}
            </ul>
          </section>
          <aside className="ent-facts">
            <h3>Questionnaires</h3>
            <dl>
              <Metric label="VHI-10" value="6 / 40" note="Observé · synthétique" />
              <Metric label="EAT-10" value="7 / 40" note="Observé · synthétique" />
            </dl>
            <div className="ent-inline-notice" data-tone="warning">
              <strong>Disponibilité</strong>
              <span>
                La vidéo instrumentale n’est pas disponible. Aucun média de substitution n’est
                affiché.
              </span>
            </div>
          </aside>
        </div>
      )}
    </EntWorkbenchFrame>
  );
}

export interface RhinologyWorkbenchProps {
  data: RhinologyDataset;
  state?: EntDisplayState;
}

export function RhinologyWorkbench({ data, state = "ready" }: RhinologyWorkbenchProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  return (
    <EntWorkbenchFrame
      title="Nez et sinus"
      eyebrow="Rhinologie"
      description="Latéralité, durée, risques, drapeaux rouges, score rapporté et examen local."
      status={acknowledged ? "Vigilance acquittée" : "Vigilance à relire"}
      statusTone={acknowledged ? "success" : "warning"}
    >
      {state !== "ready" ? (
        <EntStatePanel state={state} />
      ) : (
        <div className="ent-rhinology">
          <section className="ent-rhinology__index" aria-labelledby="ent-rhino-summary">
            <div className="ent-section-heading">
              <div>
                <p className="ent-eyebrow">Socle ORL</p>
                <h3 id="ent-rhino-summary">Contexte structuré</h3>
              </div>
              <DataMaturityBadge maturity="observed" />
            </div>
            <dl className="ent-metric-grid ent-metric-grid--four">
              <Metric label="Durée" value={data.duration} />
              <Metric label="Latéralité" value={<LateralityMark laterality={data.laterality} />} />
              <Metric
                label="Score local droit"
                value={data.rightNasalScore ?? "Non coté"}
                note="Valeur observée"
              />
              <Metric
                label="Score local gauche"
                value={data.leftNasalScore ?? "Non coté"}
                note="Valeur observée"
              />
            </dl>
          </section>
          <div className="ent-module-grid ent-module-grid--rhino">
            <section className="ent-panel">
              <div className="ent-section-heading">
                <div>
                  <p className="ent-eyebrow">Questionnaire</p>
                  <h3>{data.questionnaire.label}</h3>
                </div>
                <SourceLine reference={data.questionnaire.source.reference} />
              </div>
              <div className="ent-score-band">
                <strong>{data.questionnaire.score}</strong>
                <span>/ {data.questionnaire.maximum}</span>
                <div aria-hidden="true">
                  <i
                    style={{
                      width: `${(data.questionnaire.score / data.questionnaire.maximum) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <p className="ent-clinical-note">
                Score rapporté tel quel. Aucun seuil d’indication n’est appliqué par le composant.
              </p>
            </section>
            <section className="ent-panel ent-risk-register">
              <h3>Facteurs de risque</h3>
              <ul>
                {data.riskFactors.length ? (
                  data.riskFactors.map((risk) => <li key={risk}>{risk}</li>)
                ) : (
                  <li>Aucun facteur consigné</li>
                )}
              </ul>
            </section>
            <section
              className="ent-panel ent-risk-register"
              data-alert={data.redFlags.length > 0 || undefined}
            >
              <div className="ent-section-heading">
                <div>
                  <p className="ent-eyebrow">À confronter</p>
                  <h3>Drapeaux rouges</h3>
                </div>
                {data.redFlags.length ? (
                  <span className="ent-alert-count">{data.redFlags.length}</span>
                ) : null}
              </div>
              <ul>
                {data.redFlags.length ? (
                  data.redFlags.map((flag) => <li key={flag}>{flag}</li>)
                ) : (
                  <li>Aucun drapeau consigné</li>
                )}
              </ul>
              {data.redFlags.length ? (
                <button
                  type="button"
                  className="ent-button"
                  onClick={() => setAcknowledged((current) => !current)}
                  aria-pressed={acknowledged}
                >
                  {acknowledged ? "Annuler l’acquittement" : "Acquitter la lecture"}
                </button>
              ) : null}
            </section>
          </div>
        </div>
      )}
    </EntWorkbenchFrame>
  );
}

export interface SleepWorkbenchProps {
  data: SleepDataset;
  state?: EntDisplayState;
}

export function SleepWorkbench({ data, state = "ready" }: SleepWorkbenchProps) {
  const [showSignals, setShowSignals] = useState(false);
  return (
    <EntWorkbenchFrame
      title="Sommeil"
      eyebrow="Respiration nocturne"
      description="Questionnaires, provenance du résultat importé et complétude des signaux nocturnes."
      status={data.signalsMissing.length ? "Données partielles" : "Données complètes"}
      statusTone={data.signalsMissing.length ? "warning" : "success"}
      actions={
        <button
          type="button"
          className="ent-button ent-button--quiet"
          aria-expanded={showSignals}
          onClick={() => setShowSignals((current) => !current)}
        >
          {showSignals ? "Masquer" : "Voir"} les signaux
        </button>
      }
    >
      {state !== "ready" ? (
        <EntStatePanel state={state} />
      ) : (
        <div className="ent-sleep">
          <section className="ent-panel ent-sleep__import">
            <div className="ent-section-heading">
              <div>
                <p className="ent-eyebrow">Rapport externe</p>
                <h3>Index importé</h3>
              </div>
              <DataMaturityBadge maturity="imported" />
            </div>
            <div className="ent-hero-metric">
              <strong>{data.importedAhi ?? "—"}</strong>
              <span>événements / h</span>
            </div>
            <p>
              Importé le {data.importedAt ?? "date inconnue"}. Le composant ne produit ni diagnostic
              ni indication.
            </p>
          </section>
          <section className="ent-panel">
            <div className="ent-section-heading">
              <div>
                <p className="ent-eyebrow">Autoquestionnaires</p>
                <h3>Scores rapportés</h3>
              </div>
              <DataMaturityBadge maturity="observed" />
            </div>
            <dl className="ent-metric-grid ent-metric-grid--two">
              {data.questionnaires.map((questionnaire) => (
                <Metric
                  key={questionnaire.code}
                  label={questionnaire.label}
                  value={`${questionnaire.score} / ${questionnaire.maximum}`}
                  note={<SourceLine reference={questionnaire.source.reference} />}
                />
              ))}
            </dl>
          </section>
          {showSignals ? (
            <section className="ent-panel ent-signal-ledger" aria-live="polite">
              <h3>Complétude des signaux</h3>
              <ul>
                {data.signalsAvailable.map((signal) => (
                  <li key={signal} data-available="true">
                    <span aria-hidden="true">✓</span>
                    {signal}
                    <small>Disponible</small>
                  </li>
                ))}
                {data.signalsMissing.map((signal) => (
                  <li key={signal} data-available="false">
                    <span aria-hidden="true">—</span>
                    {signal}
                    <small>Manquant</small>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </EntWorkbenchFrame>
  );
}
