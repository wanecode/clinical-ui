import { DentalPanel, DentalStateBoundary, EvidenceBadge, ToothStatusBadge } from "./primitives";
import type { DentalStateProps, PeriodontalSite, ToothRecord } from "./types";

export interface OralHealthSummaryProps extends DentalStateProps {
  teeth: ToothRecord[];
  periodontalSites: PeriodontalSite[];
  painScore?: number;
  hygieneLabel?: string;
  functionalNote?: string;
}

export function OralHealthSummary({
  teeth,
  periodontalSites,
  painScore = 0,
  hygieneLabel = "À renforcer",
  functionalNote = "Mastication bilatérale conservée",
  state,
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: OralHealthSummaryProps) {
  const activeConditions = teeth.filter((tooth) => tooth.status === "caries");
  const restorations = teeth.filter((tooth) =>
    ["filled", "crown", "implant", "bridge"].includes(tooth.status),
  );
  const bleeding = periodontalSites.filter((site) => site.bleeding).length;
  const bleedingRate = periodontalSites.length
    ? Math.round((bleeding / periodontalSites.length) * 100)
    : 0;
  const risks = [
    {
      label: "Risque carieux",
      value: activeConditions.length ? "Modéré" : "Faible",
      symbol: activeConditions.length ? "▲" : "○",
    },
    {
      label: "Inflammation parodontale",
      value: bleedingRate > 20 ? "À surveiller" : "Stable",
      symbol: bleedingRate > 20 ? "!" : "✓",
    },
    { label: "Douleur rapportée", value: `${painScore} / 10`, symbol: painScore > 3 ? "!" : "○" },
    { label: "Hygiène", value: hygieneLabel, symbol: "✦" },
  ];

  return (
    <DentalPanel
      eyebrow="Santé orale · synthèse"
      title="Lecture clinique en un regard"
      description="Indicateurs calculés à partir des ressources affichées, sans masquer leur origine."
      className="od-panel--summary"
      dataMode={dataMode}
      presentation={presentation}
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        <div className="od-health-summary">
          <div className="od-health-summary__score">
            <span>Indice composite</span>
            <strong>
              {Math.max(0, 100 - activeConditions.length * 12 - Math.round(bleedingRate / 4))}
            </strong>
            <small>
              sur 100 · <EvidenceBadge kind="derived" />
            </small>
          </div>
          <div className="od-health-summary__risks">
            {risks.map((risk) => (
              <div key={risk.label}>
                <span className="od-health-summary__symbol" aria-hidden="true">
                  {risk.symbol}
                </span>
                <span>{risk.label}</span>
                <strong>{risk.value}</strong>
              </div>
            ))}
          </div>
          <div className="od-health-summary__facts">
            <div>
              <strong>{activeConditions.length}</strong>
              <span>lésion(s) active(s)</span>
            </div>
            <div>
              <strong>{restorations.length}</strong>
              <span>restauration(s)</span>
            </div>
            <div>
              <strong>{bleedingRate} %</strong>
              <span>sites avec saignement</span>
            </div>
            <p>
              <span aria-hidden="true">↔</span>
              {functionalNote}
            </p>
          </div>
        </div>

        <details className="od-table-alternative">
          <summary>Alternative tabulaire de la synthèse</summary>
          <table>
            <caption>Constats utilisés dans la synthèse de santé orale</caption>
            <thead>
              <tr>
                <th scope="col">Domaine</th>
                <th scope="col">Valeur</th>
                <th scope="col">Origine</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((risk) => (
                <tr key={risk.label}>
                  <th scope="row">{risk.label}</th>
                  <td>
                    {risk.symbol} {risk.value}
                  </td>
                  <td>
                    <EvidenceBadge kind="derived" />
                  </td>
                </tr>
              ))}
              {activeConditions.map((tooth) => (
                <tr key={tooth.fdi}>
                  <th scope="row">Dent {tooth.fdi}</th>
                  <td>
                    <ToothStatusBadge status={tooth.status} />
                  </td>
                  <td>
                    <EvidenceBadge kind={tooth.evidence} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </DentalStateBoundary>
    </DentalPanel>
  );
}
