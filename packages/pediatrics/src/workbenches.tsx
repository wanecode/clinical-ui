import { useId } from "react";
import {
  PediatricsEmptyValue,
  PediatricsOriginBadge,
  PediatricsSeverityMark,
  PediatricsSourceReference,
  PediatricsWorkbenchShell,
} from "./shared";
import type {
  DevelopmentWindow,
  DoseCalculation,
  GrowthSeries,
  PediatricActorContext,
  PediatricAgeContext,
  PediatricDisposition,
  PediatricNormDatum,
  PediatricServiceItem,
  PediatricsStateProps,
  PediatricTrajectoryEvent,
  PediatricTriageDatum,
  PediatricVigilanceItem,
  PediatricWeightEvidence,
  PreventionItem,
  TransitionReadinessItem,
} from "./types";

export function PediatricContextWorkbench({
  age,
  weights,
  norms,
  ...stateProps
}: PediatricsStateProps & {
  age?: PediatricAgeContext | null;
  weights: PediatricWeightEvidence[];
  norms: PediatricNormDatum[];
}) {
  return (
    <PediatricsWorkbenchShell
      eyebrow="Contexte pédiatrique"
      title="Âge, poids et normes actives"
      description="Les dénominateurs sont datés et leur usage reste explicite."
      status={age ? age.clinicalStatus : "unknown"}
      {...stateProps}
    >
      <div className="peds-context-grid">
        <section className="peds-panel peds-age-card">
          <p className="peds-panel__label">Base d’interprétation</p>
          <strong>{age?.chronologicalAge ?? "Âge non transmis"}</strong>
          <dl className="peds-definition-list">
            <div>
              <dt>Âge corrigé</dt>
              <dd>{age?.correctedAge ?? <PediatricsEmptyValue />}</dd>
            </div>
            <div>
              <dt>Base active</dt>
              <dd>{age?.referenceBasis === "corrected" ? "Âge corrigé" : "Âge chronologique"}</dd>
            </div>
            <div>
              <dt>Terme de naissance</dt>
              <dd>{age?.gestationalAgeAtBirth ?? <PediatricsEmptyValue />}</dd>
            </div>
          </dl>
          {age ? (
            <PediatricsSourceReference>{age.sourceReference}</PediatricsSourceReference>
          ) : null}
        </section>
        <section className="peds-panel">
          <p className="peds-panel__label">Poids documentés</p>
          <div className="peds-weight-list">
            {weights.map((weight) => (
              <article key={`${weight.sourceReference}-${weight.use}`} className="peds-weight">
                <div>
                  <span>{weight.use === "dose" ? "Pour la dose" : "Pour la croissance"}</span>
                  <strong>
                    {weight.value} {weight.unit}
                  </strong>
                </div>
                <span className="peds-freshness" data-status={weight.freshnessStatus}>
                  {weight.freshnessStatus === "fresh"
                    ? "Frais"
                    : weight.freshnessStatus === "stale"
                      ? "Ancien"
                      : "Fraîcheur inconnue"}
                </span>
                <small>{weight.measuredAt}</small>
              </article>
            ))}
          </div>
        </section>
        <section className="peds-panel">
          <p className="peds-panel__label">Normes pour l’âge</p>
          <div className="peds-norm-list">
            {norms.map((norm) => (
              <article key={norm.id}>
                <span>{norm.label}</span>
                <strong>{norm.value}</strong>
                <small>{norm.reference}</small>
                <PediatricsSeverityMark
                  severity={
                    norm.interpretation === "within"
                      ? "normal"
                      : norm.interpretation === "outside"
                        ? "critical"
                        : norm.interpretation === "borderline"
                          ? "warning"
                          : "unknown"
                  }
                />
              </article>
            ))}
          </div>
        </section>
      </div>
    </PediatricsWorkbenchShell>
  );
}

export function PediatricsCockpit({
  items,
  ...stateProps
}: PediatricsStateProps & { items: PediatricVigilanceItem[] }) {
  return (
    <PediatricsWorkbenchShell
      eyebrow="Fenêtres et trajectoires"
      title="Cockpit pédiatrique"
      description="Les échéances sont classées par conséquence clinique, pas par couleur."
      status={items.some((item) => item.severity === "critical") ? "critical" : "warning"}
      {...stateProps}
    >
      <div className="peds-vigilance-list">
        {items.map((item) => (
          <article key={item.id} className="peds-vigilance" data-severity={item.severity}>
            <PediatricsSeverityMark severity={item.severity} />
            <div>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </div>
            <dl>
              <div>
                <dt>Échéance</dt>
                <dd>{item.dueAt ?? "Non transmise"}</dd>
              </div>
              <div>
                <dt>Responsable</dt>
                <dd>{item.owner ?? "Non attribué"}</dd>
              </div>
            </dl>
            <PediatricsSourceReference>{item.sourceReference}</PediatricsSourceReference>
          </article>
        ))}
      </div>
    </PediatricsWorkbenchShell>
  );
}

function GrowthChart({ series }: { series: GrowthSeries }) {
  const titleId = useId();
  const points = series.points;
  const values = points.map((point) => point.value);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const ageMax = Math.max(...points.map((point) => point.ageMonths), 1);
  const y = (value: number) => 188 - ((value - min) / Math.max(max - min, 1)) * 136;
  const x = (age: number) => 52 + (age / ageMax) * 536;
  const path = points.map((point) => `${x(point.ageMonths)},${y(point.value)}`).join(" ");
  return (
    <figure className="peds-growth-chart">
      <svg viewBox="0 0 640 230" role="img" aria-labelledby={titleId}>
        <title id={titleId}>
          {series.label} — {series.curveLabel}
        </title>
        {[0, 1, 2, 3, 4].map((line) => (
          <line
            key={line}
            x1="52"
            x2="588"
            y1={52 + line * 34}
            y2={52 + line * 34}
            className="peds-chart-grid"
          />
        ))}
        <polyline points={path} className="peds-chart-line" />
        {points.map((point) => (
          <circle
            key={`${point.at}-${point.value}`}
            cx={x(point.ageMonths)}
            cy={y(point.value)}
            r="5"
            className="peds-chart-point"
          >
            <title>
              {point.at} — {point.value} {series.unit}
              {point.percentile ? ` — p${point.percentile}` : ""}
            </title>
          </circle>
        ))}
        <text x="52" y="218">
          Âge en mois ({series.ageBasis === "corrected" ? "corrigé" : "chronologique"})
        </text>
      </svg>
      <figcaption>
        <strong>{series.curveLabel}</strong>
        <span>Version {series.curveVersion}</span>
      </figcaption>
      <details>
        <summary>Tableau accessible des mesures</summary>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Âge</th>
              <th>Valeur</th>
              <th>Percentile</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={`${point.at}-table`}>
                <td>{point.at}</td>
                <td>{point.ageMonths} mois</td>
                <td>
                  {point.value} {series.unit}
                </td>
                <td>{point.percentile ? `p${point.percentile}` : "Non calculé"}</td>
                <td>{point.sourceReference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

export function GrowthDevelopmentWorkbench({
  series,
  windows,
  ...stateProps
}: PediatricsStateProps & { series: GrowthSeries[]; windows: DevelopmentWindow[] }) {
  return (
    <PediatricsWorkbenchShell
      eyebrow="Croissance et développement"
      title="Trajectoires pédiatriques"
      description="Les points, la courbe active et les fenêtres restent lisibles ensemble."
      status="validated"
      {...stateProps}
    >
      <div className="peds-growth-layout">
        <section className="peds-panel peds-panel--wide">
          {series.map((item) => (
            <GrowthChart key={item.id} series={item} />
          ))}
        </section>
        <aside className="peds-panel">
          <p className="peds-panel__label">Fenêtres de développement</p>
          <div className="peds-window-list">
            {windows.map((window) => (
              <article key={window.id} data-status={window.status}>
                <span className="peds-window__line" aria-hidden="true" />
                <div>
                  <strong>{window.label}</strong>
                  <span>
                    {window.opensAt} → {window.closesAt}
                  </span>
                  <small>
                    {window.status === "follow-up"
                      ? "Suivi requis"
                      : window.status === "unavailable"
                        ? "Donnée absente"
                        : window.status === "acquired"
                          ? "Acquis"
                          : window.status === "current"
                            ? "Fenêtre actuelle"
                            : "Fenêtre future"}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </PediatricsWorkbenchShell>
  );
}

export function PediatricDoseSafetyWorkbench({
  calculation,
  ...stateProps
}: PediatricsStateProps & { calculation: DoseCalculation }) {
  return (
    <PediatricsWorkbenchShell
      eyebrow="Prescription et sécurité"
      title="Chaîne de calcul pédiatrique"
      description="L’interface expose le calcul reçu sans choisir la prescription."
      status={
        calculation.status === "verified"
          ? "validated"
          : calculation.status === "to-review"
            ? "warning"
            : "unknown"
      }
      {...stateProps}
    >
      <div className="peds-dose-layout">
        <section className="peds-panel peds-dose-equation">
          <p className="peds-panel__label">Calcul documenté</p>
          <strong>{calculation.medication}</strong>
          {calculation.weight ? (
            <div className="peds-equation">
              <span>
                {calculation.weight.value} {calculation.weight.unit}
              </span>
              <b aria-hidden="true">×</b>
              <span>{calculation.dosePerKg ?? "Dose absente"}</span>
              <b aria-hidden="true">=</b>
              <span>{calculation.computedDose ?? "Non calculé"}</span>
            </div>
          ) : (
            <PediatricsEmptyValue label="Poids de dose absent" />
          )}
          <PediatricsOriginBadge origin={calculation.origin} />
          <PediatricsSourceReference>{calculation.sourceReference}</PediatricsSourceReference>
        </section>
        <section className="peds-panel">
          <p className="peds-panel__label">Barrières</p>
          <dl className="peds-definition-list">
            <div>
              <dt>Maximum documenté</dt>
              <dd>{calculation.maximumDose ?? <PediatricsEmptyValue />}</dd>
            </div>
            <div>
              <dt>Volume administrable</dt>
              <dd>{calculation.administrableVolume ?? <PediatricsEmptyValue />}</dd>
            </div>
            <div>
              <dt>Fraîcheur du poids</dt>
              <dd>{calculation.weight?.freshnessStatus ?? "Inconnue"}</dd>
            </div>
          </dl>
          {calculation.missingInputs.length ? (
            <div className="peds-missing">
              <strong>Entrées manquantes</strong>
              <ul>
                {calculation.missingInputs.map((input) => (
                  <li key={input}>{input}</li>
                ))}
              </ul>
            </div>
          ) : (
            <span className="peds-confirmed">✓ Entrées documentées</span>
          )}
        </section>
      </div>
    </PediatricsWorkbenchShell>
  );
}

export function PediatricPreventionTimeline({
  items,
  ...stateProps
}: PediatricsStateProps & { items: PreventionItem[] }) {
  return (
    <PediatricsWorkbenchShell
      eyebrow="Prévention"
      title="Fenêtres, rattrapage et dépistage"
      description="Chaque action garde sa fenêtre, son statut et sa source."
      status={
        items.some((item) => item.status === "overdue" || item.status === "follow-up")
          ? "warning"
          : "validated"
      }
      {...stateProps}
    >
      <div className="peds-prevention-list">
        {items.map((item) => (
          <article key={item.id} data-status={item.status}>
            <span className="peds-prevention__glyph" aria-hidden="true">
              {item.status === "complete"
                ? "✓"
                : item.status === "contraindicated"
                  ? "×"
                  : item.status === "unavailable"
                    ? "—"
                    : "○"}
            </span>
            <div>
              <small>{item.kind}</small>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </div>
            <div>
              <span>{item.window}</span>
              <strong>
                {item.status === "follow-up"
                  ? "Suivi requis"
                  : item.status === "overdue"
                    ? "En retard"
                    : item.status === "complete"
                      ? "Réalisé"
                      : item.status === "due"
                        ? "À faire"
                        : item.status === "contraindicated"
                          ? "Contre-indiqué"
                          : "Donnée absente"}
              </strong>
            </div>
            <PediatricsSourceReference>{item.sourceReference}</PediatricsSourceReference>
          </article>
        ))}
      </div>
    </PediatricsWorkbenchShell>
  );
}

export function PediatricTriageWorkbench({
  observations,
  redFlags,
  disposition,
  ...stateProps
}: PediatricsStateProps & {
  observations: PediatricTriageDatum[];
  redFlags: PediatricTriageDatum[];
  disposition?: PediatricDisposition | null;
}) {
  return (
    <PediatricsWorkbenchShell
      eyebrow="Urgences et PCIME"
      title="Triage dépendant de l’âge"
      description="Valeur, norme active, signe de gravité et disposition restent liés."
      status={redFlags.some((item) => item.severity === "critical") ? "critical" : "warning"}
      {...stateProps}
    >
      <div className="peds-triage-layout">
        <section className="peds-panel">
          <p className="peds-panel__label">Observations</p>
          <table>
            <thead>
              <tr>
                <th>Paramètre</th>
                <th>Valeur</th>
                <th>Référence</th>
                <th>Lecture</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((item) => (
                <tr key={item.id}>
                  <th>{item.label}</th>
                  <td>{item.value}</td>
                  <td>{item.ageReference ?? "Non transmise"}</td>
                  <td>
                    <PediatricsSeverityMark severity={item.severity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="peds-panel">
          <p className="peds-panel__label">Signes de gravité</p>
          <ul className="peds-red-flags">
            {redFlags.map((item) => (
              <li key={item.id} data-severity={item.severity}>
                <span aria-hidden="true">{item.severity === "critical" ? "!!" : "○"}</span>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.value}</p>
                </div>
              </li>
            ))}
          </ul>
          {disposition ? (
            <section className="peds-disposition" data-status={disposition.status}>
              <small>Disposition documentée</small>
              <strong>{disposition.label}</strong>
              <p>{disposition.detail}</p>
              <span>Responsable : {disposition.owner ?? "Non attribué"}</span>
            </section>
          ) : (
            <PediatricsEmptyValue label="Disposition non documentée" />
          )}
        </aside>
      </div>
    </PediatricsWorkbenchShell>
  );
}

export function PediatricChronicCareTrajectory({
  events,
  ...stateProps
}: PediatricsStateProps & { events: PediatricTrajectoryEvent[] }) {
  return (
    <PediatricsWorkbenchShell
      eyebrow="Maladies chroniques"
      title="Trajectoire de contrôle et d’action"
      description="Épisodes, traitements et plans conservent leur origine et leur maturité."
      status="preliminary"
      {...stateProps}
    >
      <div className="peds-trajectory">
        <div className="peds-trajectory__axis" aria-hidden="true" />
        {events.map((event) => (
          <article key={event.id} data-lane={event.lane}>
            <time>{event.at}</time>
            <span className="peds-trajectory__mark" aria-hidden="true" />
            <div>
              <small>{event.lane}</small>
              <strong>{event.label}</strong>
              <p>{event.detail}</p>
              <PediatricsOriginBadge origin={event.origin} />
              <PediatricsSourceReference>{event.sourceReference}</PediatricsSourceReference>
            </div>
          </article>
        ))}
      </div>
    </PediatricsWorkbenchShell>
  );
}

export function ChildFamilyContextWorkbench({
  actors,
  ...stateProps
}: PediatricsStateProps & { actors: PediatricActorContext[] }) {
  return (
    <PediatricsWorkbenchShell
      eyebrow="Enfant et famille"
      title="Acteurs, confidentialité et partage"
      description="L’identité de l’interlocuteur et les limites de partage restent visibles."
      status={actors.some((actor) => actor.sharingStatus === "unknown") ? "warning" : "validated"}
      {...stateProps}
    >
      <div className="peds-actor-grid">
        {actors.map((actor) => (
          <article key={actor.id} data-role={actor.role}>
            <span className="peds-actor__glyph" aria-hidden="true">
              {actor.role === "confidential"
                ? "▣"
                : actor.role === "caregiver"
                  ? "◉"
                  : actor.role === "child"
                    ? "◎"
                    : "◇"}
            </span>
            <small>{actor.role}</small>
            <strong>{actor.label}</strong>
            <span>{actor.relationship}</span>
            <p>{actor.detail}</p>
            <span className="peds-sharing" data-status={actor.sharingStatus}>
              {actor.sharingStatus === "allowed"
                ? "Partage autorisé"
                : actor.sharingStatus === "restricted"
                  ? "Accès restreint"
                  : "Partage inconnu"}
            </span>
            <PediatricsSourceReference>{actor.sourceReference}</PediatricsSourceReference>
          </article>
        ))}
      </div>
    </PediatricsWorkbenchShell>
  );
}

export function TransitionReadinessWorkbench({
  items,
  targetAge,
  ...stateProps
}: PediatricsStateProps & { items: TransitionReadinessItem[]; targetAge?: string | null }) {
  const ready = items.filter((item) => item.status === "ready").length;
  return (
    <PediatricsWorkbenchShell
      eyebrow="Transition"
      title="Préparation vers les soins adultes"
      description="La progression est lisible sans masquer les éléments manquants."
      status={items.some((item) => item.status === "missing") ? "warning" : "validated"}
      {...stateProps}
    >
      <div className="peds-transition-summary">
        <div>
          <span>Éléments prêts</span>
          <strong>
            {ready} / {items.length}
          </strong>
        </div>
        <div>
          <span>Âge cible documenté</span>
          <strong>{targetAge ?? "Non transmis"}</strong>
        </div>
      </div>
      <div className="peds-transition-list">
        {items.map((item) => (
          <article key={item.id} data-status={item.status}>
            <span aria-hidden="true">
              {item.status === "ready"
                ? "✓"
                : item.status === "in-progress"
                  ? "↻"
                  : item.status === "missing"
                    ? "○"
                    : "—"}
            </span>
            <div>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </div>
            <small>
              {item.status === "ready"
                ? "Prêt"
                : item.status === "in-progress"
                  ? "En cours"
                  : item.status === "missing"
                    ? "Manquant"
                    : "Non applicable"}
            </small>
          </article>
        ))}
      </div>
    </PediatricsWorkbenchShell>
  );
}

export function PediatricServiceCatalog({
  items,
  ...stateProps
}: PediatricsStateProps & { items: PediatricServiceItem[] }) {
  return (
    <PediatricsWorkbenchShell
      eyebrow="Organisation"
      title="Catalogue pédiatrique"
      description="La durée et le niveau de chaque acte font partie du contrat de service."
      status="validated"
      {...stateProps}
    >
      <div className="peds-service-list">
        {items.map((item) => (
          <article key={item.id}>
            <code>{item.id}</code>
            <div>
              <strong>{item.label}</strong>
              <span>{item.duration}</span>
            </div>
            <span className="peds-level" data-level={item.level}>
              {item.level}
            </span>
            <PediatricsSourceReference>{item.sourceReference}</PediatricsSourceReference>
          </article>
        ))}
      </div>
    </PediatricsWorkbenchShell>
  );
}
