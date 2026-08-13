import { useRef, useState } from "react";
import {
  OphthalmologyDataBoundary,
  OphthalmologyPanel,
  OphthalmologyWorkbenchHeader,
} from "./primitives";
import type {
  ClinicalDataState,
  OphthalmologyDataMode,
  OphthalmologyPresentation,
  OrthopticsData,
} from "./types";

export interface OrthopticsWorkbenchProps {
  data: OrthopticsData;
  state?: ClinicalDataState;
  dataMode?: OphthalmologyDataMode;
  presentation?: OphthalmologyPresentation;
}

const COOPERATION_LABEL = {
  good: "Bonne",
  variable: "Variable",
  "not-testable": "Non testable",
} as const;

export function OrthopticsWorkbench({
  data,
  state = "ready",
  dataMode = "clinical",
  presentation = "standalone",
}: OrthopticsWorkbenchProps) {
  const [selectedIndex, setSelectedIndex] = useState(
    Math.min(4, Math.max(0, data.cells.length - 1)),
  );
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = data.cells[selectedIndex];
  const move = (rowDelta: number, columnDelta: number) => {
    const current = data.cells[selectedIndex];
    if (!current) return;
    const row = Math.max(0, Math.min(2, current.row + rowDelta));
    const column = Math.max(0, Math.min(2, current.column + columnDelta));
    const next = data.cells.findIndex((cell) => cell.row === row && cell.column === column);
    if (next >= 0) {
      setSelectedIndex(next);
      refs.current[next]?.focus();
    }
  };
  return (
    <OphthalmologyDataBoundary state={state} label="Bilan orthoptique">
      <article className="oph-workbench oph-orthoptics" data-presentation={presentation}>
        <OphthalmologyWorkbenchHeader
          kicker="Pédiatrie & orthoptie"
          title="Alignement en neuf positions"
          description="Motilité, stéréoscopie, amblyopie et coopération restent liées."
          dataMode={dataMode}
          presentation={presentation}
        />
        <div className="oph-orthoptics__summary">
          <div data-cooperation={data.cooperation}>
            <span>Coopération</span>
            <strong>
              {data.cooperation ? COOPERATION_LABEL[data.cooperation] : "Non documentée"}
            </strong>
            <small>
              {data.cooperation === "variable" ? "Interpréter les mesures répétées" : ""}
            </small>
          </div>
          <div>
            <span>Cover test loin</span>
            <strong>{data.coverDistance ?? "Non documenté"}</strong>
          </div>
          <div>
            <span>Cover test près</span>
            <strong>{data.coverNear ?? "Non documenté"}</strong>
          </div>
          <div>
            <span>Stéréoscopie</span>
            <strong>{data.stereopsis ?? "Non documentée"}</strong>
          </div>
        </div>
        {data.cells.length ? (
          <>
            <div className="oph-orthoptics__layout">
              <OphthalmologyPanel title="Grille de motilité" eyebrow="Navigation au clavier">
                <p className="oph-help-text">
                  Utilisez les quatre flèches pour explorer les neuf positions du regard.
                </p>
                <table className="oph-motility-grid" aria-label="Motilité en neuf positions">
                  <tbody>
                    {[0, 1, 2].map((row) => (
                      <tr key={`motility-row-${row}`}>
                        {data.cells
                          .filter((cell) => cell.row === row)
                          .map((cell) => {
                            const index = data.cells.findIndex((item) => item.id === cell.id);
                            return (
                              <td
                                key={cell.id}
                                data-finding={cell.finding}
                                data-selected={selectedIndex === index || undefined}
                              >
                                <button
                                  ref={(node) => {
                                    refs.current[index] = node;
                                  }}
                                  type="button"
                                  aria-pressed={selectedIndex === index}
                                  onClick={() => setSelectedIndex(index)}
                                  onKeyDown={(event) => {
                                    if (event.key === "ArrowUp") {
                                      event.preventDefault();
                                      move(-1, 0);
                                    }
                                    if (event.key === "ArrowDown") {
                                      event.preventDefault();
                                      move(1, 0);
                                    }
                                    if (event.key === "ArrowLeft") {
                                      event.preventDefault();
                                      move(0, -1);
                                    }
                                    if (event.key === "ArrowRight") {
                                      event.preventDefault();
                                      move(0, 1);
                                    }
                                  }}
                                  aria-label={`${cell.gaze}, ${cell.value}, ${cell.finding === "limited" ? "limitation" : "normal"}`}
                                >
                                  <span aria-hidden="true" className="oph-eye-glyph">
                                    ◉
                                  </span>
                                  <strong>{cell.value}</strong>
                                  <small>{cell.gaze}</small>
                                </button>
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </OphthalmologyPanel>
              <OphthalmologyPanel title="Lecture sélectionnée" eyebrow="Position active">
                <div className="oph-motility-inspector" aria-live="polite">
                  <span className="oph-eye-glyph" aria-hidden="true">
                    ◉
                  </span>
                  <strong>{selected?.gaze}</strong>
                  <b>{selected?.value}</b>
                  <small>
                    {selected?.finding === "limited"
                      ? "△ Limitation documentée"
                      : "✓ Motilité libre"}
                  </small>
                </div>
                <dl className="oph-metric-grid">
                  <div className="oph-metric">
                    <dt>Risque amblyopie</dt>
                    <dd>
                      <span>{data.amblyopiaRisk ?? "Non documenté"}</span>
                    </dd>
                  </div>
                </dl>
              </OphthalmologyPanel>
            </div>
            <div className="oph-table-wrap">
              <table className="oph-table">
                <caption>Alternative tabulaire de la motilité</caption>
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Mesure</th>
                    <th>Interprétation</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cells.map((cell) => (
                    <tr key={cell.id}>
                      <th scope="row">{cell.gaze}</th>
                      <td>{cell.value}</td>
                      <td>{cell.finding === "limited" ? "Limitation" : "Dans les limites"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="oph-structured-empty" role="status">
            <strong>Motilité détaillée non documentée</strong>
            <span>Aucune position du regard n’est générée à partir d’un résumé textuel.</span>
          </div>
        )}
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
