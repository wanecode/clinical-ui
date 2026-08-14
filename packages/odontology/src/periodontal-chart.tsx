// biome-ignore-all lint/a11y/noNoninteractiveTabindex: the horizontally scrollable clinical chart must be keyboard reachable
import { useId, useState } from "react";
import { DentalPanel, DentalStateBoundary, EvidenceBadge } from "./primitives";
import type { DentalStateProps, PeriodontalSite } from "./types";

export interface PeriodontalChartProps extends DentalStateProps {
  sites: PeriodontalSite[];
  defaultView?: "chart" | "table";
}

export function PeriodontalChart({
  sites,
  defaultView = "chart",
  state,
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: PeriodontalChartProps) {
  const [view, setView] = useState(defaultView);
  const tableId = useId();
  const teeth = Array.from(new Set(sites.map((site) => site.tooth)));
  const bleedingRate = sites.length
    ? Math.round((sites.filter((site) => site.bleeding).length / sites.length) * 100)
    : 0;
  const plaqueRate = sites.length
    ? Math.round((sites.filter((site) => site.plaque).length / sites.length) * 100)
    : 0;

  return (
    <DentalPanel
      eyebrow="Parodonte · six sites"
      title="Cartographie parodontale"
      description="Profondeur, récession, saignement et plaque restent consultables site par site."
      actions={
        <fieldset className="od-view-switch">
          <legend className="od-sr-only">Mode de représentation</legend>
          <button type="button" aria-pressed={view === "chart"} onClick={() => setView("chart")}>
            Graphique
          </button>
          <button type="button" aria-pressed={view === "table"} onClick={() => setView("table")}>
            Tableau
          </button>
        </fieldset>
      }
      className="od-panel--periodontal"
      dataMode={dataMode}
      presentation={presentation}
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        <div className="od-periodontal-summary">
          <div>
            <strong>{bleedingRate} %</strong>
            <span>
              <i data-marker="bleeding" /> Saignement (BOP)
            </span>
          </div>
          <div>
            <strong>{plaqueRate} %</strong>
            <span>
              <i data-marker="plaque" /> Plaque visible
            </span>
          </div>
          <div>
            <strong>{Math.max(0, ...sites.map((site) => site.pocketDepth))} mm</strong>
            <span>Profondeur maximale</span>
          </div>
        </div>

        {view === "chart" ? (
          <section
            className="od-perio-chart"
            aria-describedby={`${tableId}-description`}
            aria-label="Graphique parodontal à défilement horizontal"
            tabIndex={0}
          >
            <p id={`${tableId}-description`} className="od-sr-only">
              Graphique de profondeurs parodontales. Le tableau propose les mêmes valeurs.
            </p>
            {teeth.map((tooth) => {
              const toothSites = sites.filter((site) => site.tooth === tooth);
              return (
                <section key={tooth} className="od-perio-tooth" aria-label={`Dent ${tooth}`}>
                  <header>
                    <strong>{tooth}</strong>
                    <span>6 sites</span>
                  </header>
                  <div className="od-perio-sites">
                    {toothSites.map((site) => (
                      <div className="od-perio-site" key={site.id}>
                        <span
                          className="od-perio-site__value"
                          data-alert={site.pocketDepth >= 4 || undefined}
                        >
                          {site.pocketDepth}
                        </span>
                        <span className="od-perio-site__plot" aria-hidden="true">
                          <i style={{ height: `${Math.min(100, site.pocketDepth * 14)}%` }} />
                        </span>
                        <span className="od-perio-site__flags">
                          {site.bleeding ? (
                            <i data-marker="bleeding" title="Saignement" />
                          ) : (
                            <i data-marker="none" title="Pas de saignement" />
                          )}
                          {site.plaque ? (
                            <i data-marker="plaque" title="Plaque" />
                          ) : (
                            <i data-marker="none" title="Pas de plaque" />
                          )}
                        </span>
                        <small>{site.site}</small>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </section>
        ) : null}

        <div className={view === "table" ? "od-table-scroll" : "od-sr-only"} id={tableId}>
          <table>
            <caption>Mesures parodontales à six sites</caption>
            <thead>
              <tr>
                <th scope="col">Dent</th>
                <th scope="col">Site</th>
                <th scope="col">Poche</th>
                <th scope="col">Récession</th>
                <th scope="col">Saignement</th>
                <th scope="col">Plaque</th>
                <th scope="col">Statut</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id}>
                  <th scope="row">{site.tooth}</th>
                  <td>{site.site}</td>
                  <td>{site.pocketDepth} mm</td>
                  <td>{site.recession} mm</td>
                  <td>{site.bleeding ? "● Oui" : "○ Non"}</td>
                  <td>{site.plaque ? "■ Oui" : "□ Non"}</td>
                  <td>
                    <EvidenceBadge kind={site.evidence} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DentalStateBoundary>
    </DentalPanel>
  );
}
