import { type CSSProperties, useId, useMemo, useRef, useState } from "react";
import type { TrajectoryPoint } from "./types";

export interface AccessibleTrajectoryProps {
  points: TrajectoryPoint[];
  label: string;
  unit: string;
  referenceValue?: number;
  referenceLabel?: string;
}

const KIND_LABELS = {
  observed: "Observé",
  imported: "Importé",
  derived: "Dérivé",
  projected: "Projeté — non observé",
} as const;

const PLOT = { left: 10, right: 96, top: 12, bottom: 78 } as const;

export function buildTrajectoryGeometry(points: TrajectoryPoint[], referenceValue?: number) {
  const values = points.map((point) => point.value);
  if (referenceValue !== undefined) values.push(referenceValue);
  const rawMin = values.length ? Math.min(...values) : 0;
  const rawMax = values.length ? Math.max(...values) : 1;
  const rawRange = rawMax - rawMin;
  const padding = rawRange === 0 ? Math.max(Math.abs(rawMax) * 0.1, 1) : rawRange * 0.12;
  const min = rawMin - padding;
  const max = rawMax + padding;
  const range = max - min || 1;
  const dates = [...new Set(points.map((point) => point.date))].sort();
  const xForDate = (date: string) => {
    const index = dates.indexOf(date);
    return dates.length <= 1
      ? (PLOT.left + PLOT.right) / 2
      : PLOT.left + (index / (dates.length - 1)) * (PLOT.right - PLOT.left);
  };
  const yForValue = (value: number) =>
    PLOT.bottom - ((value - min) / range) * (PLOT.bottom - PLOT.top);
  const fractionDigits = rawRange > 0 && rawRange < 4 ? 1 : 0;
  const numberFormatter = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  });

  return {
    positioned: points.map((point) => ({
      ...point,
      x: xForDate(point.date),
      y: yForValue(point.value),
    })),
    dateTicks: dates.map((date, index) => ({
      date,
      x: xForDate(date),
      label: new Intl.DateTimeFormat("fr-FR", { month: "2-digit", year: "2-digit" }).format(
        new Date(`${date}T00:00:00Z`),
      ),
      align: index === 0 ? "start" : index === dates.length - 1 ? "end" : "middle",
    })),
    valueTicks: Array.from({ length: 4 }, (_, index) => {
      const value = max - (index / 3) * range;
      return { value, y: yForValue(value), label: numberFormatter.format(value) };
    }),
    referenceY: referenceValue === undefined ? undefined : yForValue(referenceValue),
  };
}

export function AccessibleTrajectory({
  points,
  label,
  unit,
  referenceValue,
  referenceLabel = "Référence",
}: AccessibleTrajectoryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const descriptionId = useId();
  const chartLabelId = useId();
  const geometry = useMemo(
    () => buildTrajectoryGeometry(points, referenceValue),
    [points, referenceValue],
  );
  const { positioned, dateTicks, valueTicks, referenceY } = geometry;

  const move = (next: number) => {
    const bounded = Math.max(0, Math.min(points.length - 1, next));
    setSelectedIndex(bounded);
    buttonRefs.current[bounded]?.focus();
  };

  const selected = points[selectedIndex];
  const series = (["OD", "OG"] as const).map((eye) => ({
    eye,
    points: positioned.filter((point) => point.eye === eye),
  }));

  return (
    <div className="oph-trajectory">
      <aside className="oph-trajectory__legend" aria-label={`Légende — ${label}`}>
        <span data-kind="observed">
          <i /> Observé
        </span>
        <span data-kind="imported">
          <i /> Importé
        </span>
        <span data-kind="projected">
          <i /> Projeté — non observé
        </span>
      </aside>
      <p className="oph-sr-only" id={descriptionId}>
        Courbe interactive. Utilisez les flèches gauche et droite, début et fin pour parcourir les
        points.
      </p>
      <section
        className="oph-chart"
        aria-labelledby={chartLabelId}
        aria-describedby={descriptionId}
      >
        <h4 className="oph-sr-only" id={chartLabelId}>
          {label}
        </h4>
        <span className="oph-chart__unit" aria-hidden="true">
          {unit}
        </span>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line
            className="oph-chart__axis"
            x1={PLOT.left}
            y1={PLOT.top}
            x2={PLOT.left}
            y2={PLOT.bottom}
          />
          <line
            className="oph-chart__axis"
            x1={PLOT.left}
            y1={PLOT.bottom}
            x2={PLOT.right}
            y2={PLOT.bottom}
          />
          {valueTicks.map((tick) => (
            <line
              className="oph-chart__grid"
              key={tick.value}
              x1={PLOT.left}
              y1={tick.y}
              x2={PLOT.right}
              y2={tick.y}
            />
          ))}
          {dateTicks.map((tick) => (
            <line
              className="oph-chart__grid oph-chart__grid--vertical"
              key={tick.date}
              x1={tick.x}
              y1={PLOT.top}
              x2={tick.x}
              y2={PLOT.bottom}
            />
          ))}
          {referenceY !== undefined ? (
            <line
              className="oph-chart__reference"
              x1={PLOT.left}
              x2={PLOT.right}
              y1={referenceY}
              y2={referenceY}
            />
          ) : null}
          {series.map(({ eye, points: eyePoints }) => {
            const observed = eyePoints.filter((point) => point.kind !== "projected");
            const projected = eyePoints.filter((point) => point.kind === "projected");
            const bridge = observed.at(-1);
            return (
              <g key={eye} data-eye={eye}>
                <polyline
                  className="oph-chart__line"
                  points={observed.map((point) => `${point.x},${point.y}`).join(" ")}
                />
                {projected.length ? (
                  <polyline
                    className="oph-chart__line oph-chart__line--projected"
                    points={[...(bridge ? [bridge] : []), ...projected]
                      .map((point) => `${point.x},${point.y}`)
                      .join(" ")}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>
        {positioned.map((point, index) => (
          <button
            key={point.id}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            type="button"
            className="oph-chart-point"
            data-eye={point.eye}
            data-kind={point.kind}
            aria-pressed={selectedIndex === index}
            aria-label={`${point.eye}, ${point.date}, ${point.value} ${unit}, ${KIND_LABELS[point.kind]}`}
            style={{ "--point-x": `${point.x}%`, "--point-y": `${point.y}%` } as CSSProperties}
            onClick={() => setSelectedIndex(index)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                move(index + 1);
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                move(index - 1);
              }
              if (event.key === "Home") {
                event.preventDefault();
                move(0);
              }
              if (event.key === "End") {
                event.preventDefault();
                move(points.length - 1);
              }
            }}
          >
            <span aria-hidden="true" />
          </button>
        ))}
        <div className="oph-chart__y-ticks" aria-hidden="true">
          {valueTicks.map((tick) => (
            <span key={tick.value} style={{ "--tick-y": `${tick.y}%` } as CSSProperties}>
              {tick.label}
            </span>
          ))}
        </div>
        <div className="oph-chart__x-ticks" aria-hidden="true">
          {dateTicks.map((tick) => (
            <time
              key={tick.date}
              dateTime={tick.date}
              data-align={tick.align}
              style={{ "--tick-x": `${tick.x}%` } as CSSProperties}
            >
              {tick.label}
            </time>
          ))}
        </div>
        {referenceValue !== undefined && referenceY !== undefined ? (
          <span
            className="oph-chart__reference-label"
            style={{ "--reference-y": `${referenceY}%` } as CSSProperties}
          >
            {referenceLabel} {referenceValue} {unit}
          </span>
        ) : null}
      </section>

      <div className="oph-chart-inspector" aria-live="polite">
        {selected ? (
          <>
            <span className="oph-eye-mini" data-eye={selected.eye}>
              {selected.eye}
            </span>
            <strong>
              {selected.value} {unit}
            </strong>
            <span>
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
                new Date(`${selected.date}T00:00:00Z`),
              )}
            </span>
            <span>{KIND_LABELS[selected.kind]}</span>
            <code>{selected.source}</code>
          </>
        ) : (
          <span>Aucun point</span>
        )}
      </div>

      <button
        className="oph-text-button"
        type="button"
        aria-expanded={showTable}
        onClick={() => setShowTable((value) => !value)}
      >
        {showTable ? "Masquer" : "Afficher"} l’alternative tabulaire
      </button>
      {showTable ? (
        <div className="oph-table-wrap">
          <table className="oph-table">
            <caption>{label} — valeurs de la courbe</caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>Œil</th>
                <th>Valeur</th>
                <th>Nature</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.id}>
                  <td>{point.date}</td>
                  <td>{point.eye}</td>
                  <td>
                    {point.value} {unit}
                  </td>
                  <td>{KIND_LABELS[point.kind]}</td>
                  <td>
                    <code>{point.source}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
