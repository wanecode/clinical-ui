import { useState } from "react";
import { DentalPanel, DentalStateBoundary, EvidenceBadge, EvidenceLegend } from "./primitives";
import type { DentalStateProps, EndodonticCanal } from "./types";

export interface EndodonticWorkbenchProps extends DentalStateProps {
  tooth: string;
  canals: EndodonticCanal[];
  workingUnit?: "mm";
  onCanalUpdate?: (canalId: string, observedLength: number) => void;
}

const canalStatus = {
  unmeasured: { symbol: "○", label: "Non mesuré" },
  measured: { symbol: "●", label: "Mesuré" },
  prepared: { symbol: "◇", label: "Préparé" },
  filled: { symbol: "✓", label: "Obturé" },
} as const;

export function EndodonticWorkbench({
  tooth,
  canals,
  workingUnit = "mm",
  onCanalUpdate,
  state,
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: EndodonticWorkbenchProps) {
  const [values, setValues] = useState<Record<string, number | undefined>>(
    Object.fromEntries(canals.map((canal) => [canal.id, canal.observedLength])),
  );
  const update = (canalId: string, value: string) => {
    const parsed = value === "" ? undefined : Number(value);
    setValues((current) => ({ ...current, [canalId]: parsed }));
    if (parsed !== undefined && Number.isFinite(parsed)) onCanalUpdate?.(canalId, parsed);
  };

  return (
    <DentalPanel
      eyebrow={`Endodontie · dent ${tooth}`}
      title="Mesures canalaires"
      description="Longueurs observées et trajectoires projetées restent distinctes jusqu'à validation."
      className="od-panel--endo"
      dataMode={dataMode}
      presentation={presentation}
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        <div className="od-endo-layout">
          <div className="od-endo-diagram" aria-hidden="true">
            <span className="od-endo-diagram__crown">Dent {tooth}</span>
            {canals.map((canal, index) => (
              <i
                key={canal.id}
                style={{ left: `${25 + index * (50 / Math.max(1, canals.length - 1))}%` }}
              >
                <span>{canal.name}</span>
              </i>
            ))}
            <small>Apex</small>
          </div>
          <div className="od-table-scroll">
            <table className="od-endo-table">
              <caption>Mesures canalaires de la dent {tooth}</caption>
              <thead>
                <tr>
                  <th scope="col">Canal</th>
                  <th scope="col">Longueur observée</th>
                  <th scope="col">Longueur projetée</th>
                  <th scope="col">Point de référence</th>
                  <th scope="col">État</th>
                </tr>
              </thead>
              <tbody>
                {canals.map((canal) => {
                  const config = canalStatus[canal.status];
                  return (
                    <tr key={canal.id}>
                      <th scope="row">{canal.name}</th>
                      <td>
                        <label className="od-number-input">
                          <span className="od-sr-only">Longueur observée {canal.name}</span>
                          <input
                            type="number"
                            aria-label={`Longueur observée ${canal.name}`}
                            min="0"
                            max="40"
                            step="0.1"
                            value={values[canal.id] ?? ""}
                            onChange={(event) => update(canal.id, event.currentTarget.value)}
                          />
                          <span>{workingUnit}</span>
                        </label>
                        <EvidenceBadge kind="observed" />
                      </td>
                      <td>
                        {canal.projectedLength?.toFixed(1) ?? "—"} {workingUnit}{" "}
                        <EvidenceBadge kind="projected" />
                      </td>
                      <td>{canal.referencePoint}</td>
                      <td>
                        <span className="od-canal-status" data-status={canal.status}>
                          <span aria-hidden="true">{config.symbol}</span>
                          {config.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <EvidenceLegend />
      </DentalStateBoundary>
    </DentalPanel>
  );
}
