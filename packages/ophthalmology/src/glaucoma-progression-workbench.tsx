import { AccessibleTrajectory } from "./accessible-trajectory";
import { DataModeStamp, OphthalmologyDataBoundary, OphthalmologyPanel } from "./primitives";
import type {
  ClinicalDataState,
  Eye,
  GlaucomaProgressionData,
  OphthalmologyDataMode,
} from "./types";

const FIELD_CELLS = Array.from({ length: 36 }, (_, index) => ({
  id: `field-cell-${index + 1}`,
  depth: index % 7 === 0 ? "deep" : index % 4 === 0 ? "medium" : "light",
}));

export interface GlaucomaProgressionWorkbenchProps {
  data: GlaucomaProgressionData;
  state?: ClinicalDataState;
  dataMode?: OphthalmologyDataMode;
}

function annualizedRate(data: GlaucomaProgressionData, eye: Eye) {
  const observed = [...data.rnfl]
    .filter((point) => point.eye === eye && point.kind !== "projected")
    .sort((left, right) => left.date.localeCompare(right.date));
  const first = observed.at(0);
  const latest = observed.at(-1);
  if (!first || !latest || first.id === latest.id) return undefined;
  const elapsedYears =
    (new Date(`${latest.date}T00:00:00Z`).valueOf() -
      new Date(`${first.date}T00:00:00Z`).valueOf()) /
    (365.25 * 24 * 60 * 60 * 1_000);
  return elapsedYears > 0 ? (latest.value - first.value) / elapsedYears : undefined;
}

export function GlaucomaProgressionWorkbench({
  data,
  state = "ready",
  dataMode = "clinical",
}: GlaucomaProgressionWorkbenchProps) {
  const targetByEye = data.targetIopByEye ?? {
    OD: data.targetIop,
    OG: data.targetIop,
  };
  const targetSummary = (["OD", "OG"] as const)
    .flatMap((eye) => (targetByEye[eye] === undefined ? [] : [`${eye} ≤ ${targetByEye[eye]} mmHg`]))
    .join(" · ");
  const stageSummary = (["OD", "OG"] as const)
    .flatMap((eye) =>
      data.stageByEye?.[eye] === undefined ? [] : [`${eye} · ${data.stageByEye[eye]}`],
    )
    .join(" · ");
  const hasProjection = [...data.iop, ...data.rnfl].some((point) => point.kind === "projected");

  return (
    <OphthalmologyDataBoundary state={state} label="Progression glaucomateuse">
      <article className="oph-workbench oph-glaucoma">
        <header className="oph-workbench-heading">
          <div>
            <p className="oph-kicker">Glaucome longitudinal</p>
            <h2>Trajectoires explicables</h2>
            <p>Mesures observées, imports et projections gardent une grammaire distincte.</p>
          </div>
          <DataModeStamp mode={dataMode} />
        </header>
        <div className="oph-glaucoma__summary">
          <div>
            <span>PIO cible</span>
            <strong>{targetSummary || "Non documentée"}</strong>
            {stageSummary ? <small>Stade {stageSummary}</small> : null}
          </div>
          {(["OD", "OG"] as const).map((eye) => {
            const rate = annualizedRate(data, eye);
            return (
              <div key={eye}>
                <span>Vitesse RNFL {eye}</span>
                <strong>
                  {rate === undefined ? "Non calculable" : `${rate.toFixed(1)} µm/an`}
                </strong>
                <small>Dérivé des observations</small>
              </div>
            );
          })}
          {data.vigilance ? (
            <div data-tone={data.vigilance.tone}>
              <span>Vigilance</span>
              <strong>{data.vigilance.label}</strong>
              {data.vigilance.detail ? <small>{data.vigilance.detail}</small> : null}
            </div>
          ) : null}
        </div>
        <div className="oph-glaucoma__charts">
          <OphthalmologyPanel title="Pression intraoculaire" eyebrow="Tonométrie">
            <AccessibleTrajectory
              points={data.iop}
              label="Évolution de la pression intraoculaire"
              unit="mmHg"
              {...(data.targetIop === undefined ? {} : { referenceValue: data.targetIop })}
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
                <caption>
                  Indices globaux du champ visuel{" "}
                  {dataMode === "synthetic" ? "synthétique" : "clinique"}
                </caption>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Œil</th>
                    <th>MD</th>
                    <th>PSD</th>
                    <th>VFI</th>
                    <th>Fiabilité</th>
                  </tr>
                </thead>
                <tbody>
                  {data.visualField.map((field) => (
                    <tr key={`${field.date}-${field.eye}`}>
                      <td>{field.date}</td>
                      <td>{field.eye}</td>
                      <td>{field.md.toFixed(2)} dB</td>
                      <td>{field.psd === undefined ? "—" : `${field.psd.toFixed(2)} dB`}</td>
                      <td>{field.vfi === undefined ? "—" : `${field.vfi} %`}</td>
                      <td>{field.reliability ?? "Non documentée"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </OphthalmologyPanel>
        {hasProjection ? (
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
        ) : null}
      </article>
    </OphthalmologyDataBoundary>
  );
}
