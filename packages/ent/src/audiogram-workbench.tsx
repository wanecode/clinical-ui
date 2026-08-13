// biome-ignore-all lint/a11y/noNoninteractiveTabindex: scrollable clinical tables must be keyboard focusable
import { useMemo, useState } from "react";
import { calculateAirBoneGap, calculateGovernedPta } from "./calculations";
import { DataMaturityBadge, EntStatePanel, EntWorkbenchFrame, Metric } from "./common";
import type {
  AudiogramDataset,
  AudiogramPoint,
  EarSide,
  EntDisplayState,
  EntHostPresentationProps,
} from "./types";

const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000] as const;
const LEVELS = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] as const;
const CHART = { left: 56, top: 32, width: 560, height: 352 };

const sideLabel = (side: EarSide) => (side === "right" ? "Droite" : "Gauche");
const markerLabel = (point: AudiogramPoint) => {
  if (point.conduction === "air") return point.side === "right" ? "O" : "X";
  return point.side === "right" ? (point.masked ? "[" : "<") : point.masked ? "]" : ">";
};

function xFor(frequency: number) {
  return (
    CHART.left + FREQUENCIES.indexOf(frequency as (typeof FREQUENCIES)[number]) * (CHART.width / 5)
  );
}

function yFor(level: number) {
  return CHART.top + ((level + 10) / 130) * CHART.height;
}

function pathFor(points: AudiogramPoint[], side: EarSide, conduction: "air" | "bone") {
  return points
    .filter(
      (point) =>
        point.side === side &&
        point.conduction === conduction &&
        FREQUENCIES.includes(point.frequencyHz as (typeof FREQUENCIES)[number]),
    )
    .sort((a, b) => a.frequencyHz - b.frequencyHz)
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${xFor(point.frequencyHz)} ${yFor(point.thresholdDbHl)}`,
    )
    .join(" ");
}

function AudiogramPlot({
  data,
  dataMode,
  showPrevious,
}: {
  data: AudiogramDataset;
  dataMode: EntHostPresentationProps["dataMode"];
  showPrevious: boolean;
}) {
  return (
    <div className="ent-audiogram-plot">
      <svg
        viewBox="0 0 672 430"
        role="img"
        aria-labelledby="ent-audio-plot-title ent-audio-plot-desc"
      >
        <title id="ent-audio-plot-title">
          {dataMode === "synthetic" ? "Audiogramme tonal synthétique" : "Audiogramme tonal"}
        </title>
        <desc id="ent-audio-plot-desc">
          Seuils par fréquence. Cercles rouges pour l’oreille droite, croix bleues pour l’oreille
          gauche, crochets pour les voies osseuses masquées et flèches pour les non-réponses. La
          table adjacente fournit les mêmes valeurs sous forme textuelle.
        </desc>
        <rect x="0" y="0" width="672" height="430" rx="12" className="ent-plot__surface" />
        {LEVELS.map((level) => (
          <g key={level}>
            <line
              x1={CHART.left}
              x2={CHART.left + CHART.width}
              y1={yFor(level)}
              y2={yFor(level)}
              className={
                level % 20 === 0 ? "ent-plot__grid" : "ent-plot__grid ent-plot__grid--minor"
              }
            />
            <text
              x={CHART.left - 12}
              y={yFor(level) + 4}
              textAnchor="end"
              className="ent-plot__axis"
            >
              {level}
            </text>
          </g>
        ))}
        {FREQUENCIES.map((frequency) => (
          <g key={frequency}>
            <line
              x1={xFor(frequency)}
              x2={xFor(frequency)}
              y1={CHART.top}
              y2={CHART.top + CHART.height}
              className="ent-plot__grid"
            />
            <text x={xFor(frequency)} y="19" textAnchor="middle" className="ent-plot__axis">
              {frequency >= 1000 ? `${frequency / 1000}k` : frequency}
            </text>
          </g>
        ))}
        <text
          x="16"
          y="214"
          transform="rotate(-90 16 214)"
          textAnchor="middle"
          className="ent-plot__label"
        >
          Niveau (dB HL)
        </text>
        <text x="336" y="418" textAnchor="middle" className="ent-plot__label">
          Fréquence (Hz)
        </text>

        {showPrevious
          ? (["right", "left"] as const).map((side) => (
              <path
                key={`previous-${side}`}
                d={pathFor(data.previousAirPoints ?? [], side, "air")}
                className="ent-plot__previous"
                data-side={side}
              />
            ))
          : null}

        {(["right", "left"] as const).flatMap((side) =>
          (["air", "bone"] as const).map((conduction) => (
            <path
              key={`${side}-${conduction}`}
              d={pathFor(data.points, side, conduction)}
              className="ent-plot__curve"
              data-conduction={conduction}
              data-side={side}
            />
          )),
        )}

        {data.points.map((point) => {
          const x = xFor(point.frequencyHz);
          const y = yFor(point.thresholdDbHl);
          return (
            <g
              key={`${point.side}-${point.conduction}-${point.frequencyHz}`}
              className="ent-plot__point"
              data-side={point.side}
              data-no-response={point.noResponse || undefined}
            >
              <text x={x} y={y + 7} textAnchor="middle">
                {markerLabel(point)}
              </text>
              {point.noResponse ? (
                <path d={`M ${x + 9} ${y + 7} l 12 12 m -3 -10 l 3 10 l -10 -3`} />
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ThresholdCell({ point }: { point: AudiogramPoint | undefined }) {
  if (!point) {
    return (
      <span>
        <span className="ent-visually-hidden">Non mesuré</span>
        <span aria-hidden="true">—</span>
      </span>
    );
  }
  return (
    <span>
      {point.thresholdDbHl}
      {point.noResponse ? " NR" : ""}
    </span>
  );
}

export interface AudiogramWorkbenchProps extends EntHostPresentationProps {
  data: AudiogramDataset;
  state?: EntDisplayState;
}

export function AudiogramWorkbench({
  data,
  state = "ready",
  dataMode = "clinical",
  presentation = "standalone",
}: AudiogramWorkbenchProps) {
  const [showPrevious, setShowPrevious] = useState(false);
  const pta = useMemo(
    () => ({
      right: calculateGovernedPta(data.points, "right"),
      left: calculateGovernedPta(data.points, "left"),
    }),
    [data.points],
  );

  return (
    <EntWorkbenchFrame
      dataMode={dataMode}
      presentation={presentation}
      title="Audiométrie tonale"
      eyebrow="Signal desk · Audition"
      description="Seuils point par point, conventions audiologiques redondantes et table textuelle équivalente."
      status={
        data.status === "signed"
          ? "Signé"
          : data.status === "preliminary"
            ? "Préliminaire"
            : "Statut non renseigné"
      }
      statusTone={
        data.status === "signed" ? "success" : data.status === "preliminary" ? "pending" : "warning"
      }
      className="ent-audiogram"
      actions={
        <button
          type="button"
          className="ent-button ent-button--quiet"
          aria-pressed={showPrevious}
          onClick={() => setShowPrevious((current) => !current)}
        >
          {showPrevious ? "Masquer" : "Afficher"} la tendance
        </button>
      }
    >
      {state !== "ready" ? (
        <EntStatePanel state={state} />
      ) : (
        <>
          <section className="ent-instrument-bar" aria-label="Qualité et dispositif">
            <span>
              <strong>Appareil</strong>
              {data.device}
            </span>
            <span>
              <strong>Transducteur</strong>
              {data.transducer}
            </span>
            <span>
              <strong>Étalonnage</strong>
              {data.calibrationDate}
            </span>
            <span>
              <strong>Qualité</strong>
              {data.quality === "acceptable"
                ? "Acceptable"
                : data.quality === "limited"
                  ? "Limitée"
                  : "Non renseignée"}
            </span>
          </section>

          <div className="ent-audiogram__layout">
            <div>
              <aside className="ent-legend" aria-label="Légende de l’audiogramme">
                <span data-side="right">
                  <b aria-hidden="true">O</b> Droite · aérienne
                </span>
                <span data-side="left">
                  <b aria-hidden="true">X</b> Gauche · aérienne
                </span>
                <span>
                  <b aria-hidden="true">[ ]</b> Osseuse masquée
                </span>
                <span>
                  <b aria-hidden="true">↘</b> Sans réponse
                </span>
                {showPrevious ? (
                  <span>
                    <b aria-hidden="true">┄</b> Mesure précédente
                  </span>
                ) : null}
              </aside>
              <AudiogramPlot data={data} dataMode={dataMode} showPrevious={showPrevious} />
            </div>

            <div className="ent-audiogram__data">
              <div className="ent-section-heading">
                <div>
                  <p className="ent-eyebrow">Alternative accessible</p>
                  <h3>Seuils tonaux en dB HL</h3>
                </div>
                <DataMaturityBadge maturity="preliminary" />
              </div>
              <section
                className="ent-table-scroll"
                aria-label="Table des seuils tonaux"
                tabIndex={0}
              >
                <table className="ent-table ent-threshold-table">
                  <caption>Valeurs équivalentes au tracé audiométrique</caption>
                  <thead>
                    <tr>
                      <th scope="col">Voie / côté</th>
                      {FREQUENCIES.map((frequency) => (
                        <th scope="col" key={frequency}>
                          {frequency >= 1000 ? `${frequency / 1000} k` : frequency}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(["right", "left"] as const).flatMap((side) =>
                      (["air", "bone"] as const).map((conduction) => (
                        <tr key={`${side}-${conduction}`} data-side={side}>
                          <th scope="row">
                            {sideLabel(side)} · {conduction === "air" ? "air" : "os masqué"}
                          </th>
                          {FREQUENCIES.map((frequency) => (
                            <td key={frequency}>
                              <ThresholdCell
                                point={data.points.find(
                                  (point) =>
                                    point.side === side &&
                                    point.conduction === conduction &&
                                    point.frequencyHz === frequency,
                                )}
                              />
                            </td>
                          ))}
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </section>

              <section className="ent-derived" aria-labelledby="ent-pta-heading">
                <div className="ent-section-heading">
                  <div>
                    <p className="ent-eyebrow">Calcul gouverné</p>
                    <h3 id="ent-pta-heading">PTA dérivée — aide à la lecture</h3>
                  </div>
                  <DataMaturityBadge maturity="derived" />
                </div>
                <dl className="ent-metric-grid ent-metric-grid--two">
                  {(["right", "left"] as const).map((side) => (
                    <Metric
                      key={side}
                      label={`Oreille ${sideLabel(side).toLowerCase()}`}
                      value={
                        pta[side].state === "calculated"
                          ? `${pta[side].valueDbHl} dB HL`
                          : "Non calculable"
                      }
                      note="500 · 1k · 2k · 4k Hz"
                    />
                  ))}
                </dl>
                <p className="ent-clinical-note">{pta.right.explanation}</p>
              </section>
            </div>
          </div>

          <section className="ent-speech" aria-labelledby="ent-speech-heading">
            <div className="ent-section-heading">
              <div>
                <p className="ent-eyebrow">Mesures observées</p>
                <h3 id="ent-speech-heading">Audiométrie vocale</h3>
              </div>
              <DataMaturityBadge maturity="observed" />
            </div>
            <dl className="ent-metric-grid ent-metric-grid--four">
              {data.speech.flatMap((result) => [
                <Metric
                  key={`${result.side}-srt`}
                  label={`${sideLabel(result.side)} · SRT`}
                  value={result.srtDbHl === undefined ? "—" : `${result.srtDbHl} dB HL`}
                />,
                <Metric
                  key={`${result.side}-words`}
                  label={`${sideLabel(result.side)} · intelligibilité`}
                  value={
                    result.wordRecognitionPercent === undefined
                      ? "—"
                      : `${result.wordRecognitionPercent} %`
                  }
                  note={
                    result.presentationLevelDbHl
                      ? `à ${result.presentationLevelDbHl} dB HL`
                      : undefined
                  }
                />,
              ])}
            </dl>
          </section>

          <section className="ent-cross-tests" aria-label="Examens audiologiques associés">
            <span>
              <strong>Tympanométrie</strong>Voir l’oreille moyenne
            </span>
            <span>
              <strong>Réflexes</strong>Série partielle signalée
            </span>
            <span>
              <strong>OEA</strong>Résultat importé
            </span>
            <span>
              <strong>PEA / ABR</strong>Compte rendu disponible
            </span>
            <span>
              <strong>Appareillage</strong>Aucun appareil déclaré
            </span>
            <span>
              <strong>Écart air–os 1 kHz</strong>
              {calculateAirBoneGap(data.points, "right", 1000)} dB · dérivé
            </span>
          </section>
        </>
      )}
    </EntWorkbenchFrame>
  );
}
