import { AccessibleTrajectory } from "./accessible-trajectory";
import { OphthalmologyDataBoundary, OphthalmologyPanel, SyntheticStamp } from "./primitives";
import type { ClinicalDataState, GlaucomaProgressionData } from "./types";

const FIELD_CELLS = Array.from({ length: 36 }, (_, index) => ({
  id: `field-cell-${index + 1}`,
  depth: index % 7 === 0 ? "deep" : index % 4 === 0 ? "medium" : "light",
}));

export interface GlaucomaProgressionWorkbenchProps {
  data: GlaucomaProgressionData;
  state?: ClinicalDataState;
}

export function GlaucomaProgressionWorkbench({
  data,
  state = "ready",
}: GlaucomaProgressionWorkbenchProps) {
  const latestObserved = data.rnfl.filter((point) => point.kind !== "projected").at(-1);
  const firstObserved = data.rnfl.find(
    (point) => point.eye === latestObserved?.eye && point.kind !== "projected",
  );
  const annualized =
    latestObserved && firstObserved
      ? (latestObserved.value - firstObserved.value) /
        Math.max(
          1,
          Number(latestObserved.date.slice(0, 4)) - Number(firstObserved.date.slice(0, 4)),
        )
      : undefined;

  return (
    <OphthalmologyDataBoundary state={state} label="Progression glaucomateuse">
      <article className="oph-workbench oph-glaucoma">
        <header className="oph-workbench-heading">
          <div>
            <p className="oph-kicker">Glaucome longitudinal</p>
            <h2>Trajectoires explicables</h2>
            <p>Mesures observées, imports et projections gardent une grammaire distincte.</p>
          </div>
          <SyntheticStamp />
        </header>
        <div className="oph-glaucoma__summary">
          <div>
            <span>PIO cible</span>
            <strong>≤ {data.targetIop} mmHg</strong>
          </div>
          <div>
            <span>Vitesse RNFL calculée</span>
            <strong>
              {annualized === undefined ? "Non calculable" : `${annualized.toFixed(1)} µm/an`}
            </strong>
            <small>Dérivé des observations</small>
          </div>
          <div data-tone="warning">
            <span>Vigilance</span>
            <strong>Progression structurelle OD</strong>
            <small>À corréler au champ visuel</small>
          </div>
        </div>
        <div className="oph-glaucoma__charts">
          <OphthalmologyPanel title="Pression intraoculaire" eyebrow="Tonométrie">
            <AccessibleTrajectory
              points={data.iop}
              label="Évolution de la pression intraoculaire"
              unit="mmHg"
              referenceValue={data.targetIop}
              referenceLabel="Cible"
            />
          </OphthalmologyPanel>
          <OphthalmologyPanel title="Épaisseur RNFL moyenne" eyebrow="OCT structurel">
            <AccessibleTrajectory
              points={data.rnfl}
              label="Évolution de l’épaisseur RNFL"
              unit="µm"
            />
          </OphthalmologyPanel>
        </div>
        <OphthalmologyPanel title="Champ visuel" eyebrow="Alternative tabulaire permanente">
          <div className="oph-field-layout">
            <div className="oph-field-map" aria-hidden="true">
              {FIELD_CELLS.map((cell) => (
                <span key={cell.id} data-depth={cell.depth} />
              ))}
              <i className="oph-field-map__axis oph-field-map__axis--x" />
              <i className="oph-field-map__axis oph-field-map__axis--y" />
            </div>
            <div className="oph-table-wrap">
              <table className="oph-table">
                <caption>Indices globaux du champ visuel synthétique</caption>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Œil</th>
                    <th>MD</th>
                    <th>PSD</th>
                    <th>VFI</th>
                  </tr>
                </thead>
                <tbody>
                  {data.visualField.map((field) => (
                    <tr key={`${field.date}-${field.eye}`}>
                      <td>{field.date}</td>
                      <td>{field.eye}</td>
                      <td>{field.md.toFixed(2)} dB</td>
                      <td>{field.psd.toFixed(2)} dB</td>
                      <td>{field.vfi} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </OphthalmologyPanel>
        <aside className="oph-projection-caveat">
          <span aria-hidden="true">⌁</span>
          <div>
            <strong>Projection, pas prédiction clinique.</strong>
            <p>
              Les segments en tirets extrapolent une tendance locale. Ils ne sont ni mesurés ni
              validés et ne doivent pas être lus comme un résultat futur acquis.
            </p>
          </div>
        </aside>
      </article>
    </OphthalmologyDataBoundary>
  );
}
