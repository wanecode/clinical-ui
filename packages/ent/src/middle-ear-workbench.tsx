// biome-ignore-all lint/a11y/noNoninteractiveTabindex: scrollable clinical tables must be keyboard focusable
import { useState } from "react";
import { EntStatePanel, EntWorkbenchFrame, Metric, SegmentedControl } from "./common";
import type {
  EarSide,
  EntDisplayState,
  EntHostPresentationProps,
  MiddleEarDataset,
  TympanogramResult,
} from "./types";

function TympanogramPlot({ result }: { result: TympanogramResult | undefined }) {
  if (!result || result.peakPressureDapa === undefined || result.complianceMl === undefined) {
    return <EntStatePanel state="partial" compact />;
  }
  const peakX = 38 + ((result.peakPressureDapa + 400) / 600) * 500;
  const peakY = 280 - (result.complianceMl / 1.5) * 220;
  const curve = `M 38 280 C ${peakX - 120} 278 ${peakX - 65} ${peakY} ${peakX} ${peakY} C ${peakX + 65} ${peakY} ${peakX + 120} 278 538 280`;
  return (
    <svg
      viewBox="0 0 576 320"
      role="img"
      aria-labelledby={`tymp-${result.side}-title tymp-${result.side}-desc`}
    >
      <title id={`tymp-${result.side}-title`}>
        Tympanogramme {result.side === "right" ? "droit" : "gauche"}
      </title>
      <desc id={`tymp-${result.side}-desc`}>
        Pression du pic {result.peakPressureDapa} daPa, compliance {result.complianceMl} mL. Les
        valeurs figurent aussi dans la table adjacente.
      </desc>
      <rect width="576" height="320" rx="12" className="ent-chart-paper" />
      {[-400, -300, -200, -100, 0, 100, 200].map((pressure) => {
        const x = 38 + ((pressure + 400) / 600) * 500;
        return (
          <g key={pressure}>
            <line x1={x} x2={x} y1="28" y2="280" className="ent-chart-grid" />
            <text x={x} y="302" textAnchor="middle" className="ent-chart-axis">
              {pressure > 0 ? `+${pressure}` : pressure}
            </text>
          </g>
        );
      })}
      {[0, 0.5, 1, 1.5].map((compliance) => {
        const y = 280 - (compliance / 1.5) * 220;
        return (
          <g key={compliance}>
            <line x1="38" x2="538" y1={y} y2={y} className="ent-chart-grid" />
            <text x="28" y={y + 4} textAnchor="end" className="ent-chart-axis">
              {compliance.toFixed(1)}
            </text>
          </g>
        );
      })}
      <path d={curve} className="ent-tymp-curve" data-side={result.side} />
      <line x1={peakX} x2={peakX} y1={peakY} y2="280" className="ent-tymp-peak" />
      <circle cx={peakX} cy={peakY} r="6" className="ent-tymp-point" data-side={result.side} />
    </svg>
  );
}

export interface MiddleEarWorkbenchProps extends EntHostPresentationProps {
  data: MiddleEarDataset;
  state?: EntDisplayState;
}

export function MiddleEarWorkbench({
  data,
  state = "ready",
  dataMode = "clinical",
  presentation = "standalone",
}: MiddleEarWorkbenchProps) {
  const [side, setSide] = useState<EarSide>("right");
  const result = data.tympanograms.find((item) => item.side === side);
  const seriesComplete = data.reflexes.every((reflex) => reflex.outcome !== "not-tested");
  return (
    <EntWorkbenchFrame
      dataMode={dataMode}
      presentation={presentation}
      title="Oreille moyenne"
      eyebrow="Impédancemétrie"
      description="Tympanogrammes, réflexes acoustiques, qualité de série et dispositif d’acquisition."
      status={seriesComplete ? "Série complète" : "Série partielle"}
      statusTone={seriesComplete ? "success" : "warning"}
      actions={
        <SegmentedControl
          label="Choisir l’oreille"
          value={side}
          onChange={setSide}
          options={[
            { value: "right", label: "Droite · O" },
            { value: "left", label: "Gauche · X" },
          ]}
        />
      }
    >
      {state !== "ready" ? (
        <EntStatePanel state={state} />
      ) : (
        <>
          <div className="ent-instrument-bar">
            <span>
              <strong>Appareil</strong>
              {data.device}
            </span>
            <span>
              <strong>Sonde</strong>
              {data.probeToneHz} Hz
            </span>
            <span>
              <strong>Qualité</strong>
              {data.quality === "acceptable"
                ? "Acceptable"
                : data.quality === "limited"
                  ? "Limitée · bruit intermittent"
                  : "Non renseignée"}
            </span>
          </div>
          <div className="ent-middle-ear__layout">
            <section className="ent-panel" aria-labelledby="ent-tymp-title">
              <div className="ent-section-heading">
                <div>
                  <p className="ent-eyebrow">Courbe pression / compliance</p>
                  <h3 id="ent-tymp-title">
                    Tympanogramme · {side === "right" ? "droite" : "gauche"}
                  </h3>
                </div>
                <span className="ent-side-symbol" data-side={side}>
                  {side === "right" ? "O" : "X"}
                </span>
              </div>
              <TympanogramPlot result={result} />
              <dl className="ent-metric-grid ent-metric-grid--four">
                <Metric label="Type de courbe" value={result?.curveType ?? "Non classé"} />
                <Metric
                  label="Pression du pic"
                  value={
                    result?.peakPressureDapa === undefined ? "—" : `${result.peakPressureDapa} daPa`
                  }
                />
                <Metric
                  label="Compliance"
                  value={result?.complianceMl === undefined ? "—" : `${result.complianceMl} mL`}
                />
                <Metric
                  label="Volume du conduit"
                  value={result?.canalVolumeMl === undefined ? "—" : `${result.canalVolumeMl} mL`}
                />
              </dl>
            </section>
            <section className="ent-panel" aria-labelledby="ent-reflex-title">
              <div className="ent-section-heading">
                <div>
                  <p className="ent-eyebrow">Présence / absence / non testé</p>
                  <h3 id="ent-reflex-title">Réflexes acoustiques</h3>
                </div>
              </div>
              <section
                className="ent-table-scroll"
                aria-label="Table des réflexes acoustiques"
                tabIndex={0}
              >
                <table className="ent-table">
                  <caption>Réflexes par côté, stimulus et fréquence</caption>
                  <thead>
                    <tr>
                      <th scope="col">Côté</th>
                      <th scope="col">Stimulus</th>
                      <th scope="col">Fréquence</th>
                      <th scope="col">Résultat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.reflexes.map((reflex) => (
                      <tr
                        key={`${reflex.side}-${reflex.stimulus}-${reflex.frequencyHz}`}
                        data-side={reflex.side}
                      >
                        <th scope="row">{reflex.side === "right" ? "Droite · O" : "Gauche · X"}</th>
                        <td>
                          {reflex.stimulus === "ipsilateral" ? "Ipsilatéral" : "Controlatéral"}
                        </td>
                        <td>{reflex.frequencyHz} Hz</td>
                        <td>
                          {reflex.outcome === "present"
                            ? `Présent${reflex.thresholdDbHl ? ` · ${reflex.thresholdDbHl} dB HL` : ""}`
                            : reflex.outcome === "absent"
                              ? "Absent"
                              : "Non testé"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              {!seriesComplete ? (
                <div className="ent-inline-notice" data-tone="warning">
                  <strong>Série incomplète</strong>
                  <span>
                    Les cellules non testées restent explicitement vides et n’entrent dans aucune
                    synthèse.
                  </span>
                </div>
              ) : null}
            </section>
          </div>
        </>
      )}
    </EntWorkbenchFrame>
  );
}
