import { useId } from "react";
import {
  GynecologyObstetricsEmptyValue,
  GynecologyObstetricsOriginBadge,
  GynecologyObstetricsSeverity,
  GynecologyObstetricsShell,
  GynecologyObstetricsSourceReference,
} from "./shared";
import type {
  BirthDecision,
  FetalMeasure,
  GynecologyObstetricsServiceItem,
  GynecologyObstetricsStateProps,
  HemorrhageSafetyItem,
  LaborObservation,
  NewbornTransitionItem,
  ObstetricVigilanceItem,
  PostpartumItem,
  PregnancyEpisode,
  PrenatalEvent,
  ReproductiveHealthEvent,
} from "./types";

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    complete: "Réalisé",
    current: "Fenêtre actuelle",
    upcoming: "À venir",
    overdue: "En retard",
    unavailable: "Indisponible",
    ready: "Prêt",
    pending: "En attente",
    blocked: "Bloqué",
    triggered: "Déclenché",
    support: "Soutien requis",
    normal: "Dans la référence",
    unknown: "Non qualifié",
    due: "À faire",
    "follow-up": "Suivi requis",
    critical: "Critique",
  };
  return labels[status] ?? status;
}

export function PregnancyEpisodeContext({
  episode,
  ...stateProps
}: GynecologyObstetricsStateProps & { episode?: PregnancyEpisode | null }) {
  return (
    <GynecologyObstetricsShell
      eyebrow="Contexte obstétrical"
      title="Épisode, terme et acteurs"
      description="Le terme actif reste lié à sa méthode de datation et à son historique."
      status={episode?.clinicalStatus ?? "unknown"}
      {...stateProps}
    >
      <div className="go-context-grid">
        <section className="go-panel go-context-age">
          <p className="go-panel__label">Terme actif</p>
          <strong>{episode?.gestationalAge ?? "Non transmis"}</strong>
          <span>
            {episode?.estimatedDueDate
              ? `Terme estimé · ${episode.estimatedDueDate}`
              : "Date estimée absente"}
          </span>
        </section>
        <section className="go-panel">
          <p className="go-panel__label">Datation</p>
          <dl className="go-definition-list">
            <div>
              <dt>Base</dt>
              <dd>{episode?.datingBasis ?? <GynecologyObstetricsEmptyValue />}</dd>
            </div>
            <div>
              <dt>Révision</dt>
              <dd>
                {episode?.revisedFrom ?? (
                  <GynecologyObstetricsEmptyValue label="Aucune révision transmise" />
                )}
              </dd>
            </div>
            <div>
              <dt>Gestité / parité</dt>
              <dd>{episode?.parity ?? <GynecologyObstetricsEmptyValue />}</dd>
            </div>
          </dl>
          {episode ? (
            <GynecologyObstetricsSourceReference>
              {episode.sourceReference}
            </GynecologyObstetricsSourceReference>
          ) : null}
        </section>
        <section className="go-panel">
          <p className="go-panel__label">Identités liées, non fusionnées</p>
          <div className="go-actor-list">
            <div>
              <span>Mère</span>
              <code>{episode?.maternalReference ?? "Non transmise"}</code>
            </div>
            <div>
              <span>Fœtus</span>
              {episode?.fetusReferences.length ? (
                episode.fetusReferences.map((reference) => <code key={reference}>{reference}</code>)
              ) : (
                <GynecologyObstetricsEmptyValue />
              )}
            </div>
            <div>
              <span>Épisode</span>
              <code>{episode?.episodeReference ?? "Non transmis"}</code>
            </div>
          </div>
        </section>
      </div>
    </GynecologyObstetricsShell>
  );
}

export function GynecologyObstetricsCockpit({
  items,
  ...stateProps
}: GynecologyObstetricsStateProps & { items: ObstetricVigilanceItem[] }) {
  const status = items.some((item) => item.severity === "critical")
    ? "critical"
    : items.some((item) => item.severity === "warning")
      ? "warning"
      : "validated";
  return (
    <GynecologyObstetricsShell
      eyebrow="Fenêtres et vigilance"
      title="Cockpit gynéco-obstétrical"
      description="Les échéances exposent leur conséquence, leur propriétaire et leur source."
      status={status}
      {...stateProps}
    >
      <div className="go-vigilance-list">
        {items.map((item) => (
          <article key={item.id} className="go-vigilance" data-severity={item.severity}>
            <GynecologyObstetricsSeverity severity={item.severity} />
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
            <GynecologyObstetricsSourceReference>
              {item.sourceReference}
            </GynecologyObstetricsSourceReference>
          </article>
        ))}
      </div>
    </GynecologyObstetricsShell>
  );
}

export function ReproductiveHealthWorkbench({
  events,
  ...stateProps
}: GynecologyObstetricsStateProps & { events: ReproductiveHealthEvent[] }) {
  return (
    <GynecologyObstetricsShell
      eyebrow="Santé reproductive"
      title="Archive clinique et confidentialité"
      description="Cycles, prévention, traitements et procédures restent datés et cloisonnés."
      status={events.some((event) => event.clinicalStatus === "amended") ? "amended" : "validated"}
      {...stateProps}
    >
      <div className="go-reproductive-timeline">
        {events.map((event) => (
          <article key={event.id} data-visibility={event.visibility}>
            <time>{event.at}</time>
            <span className="go-timeline-mark" aria-hidden="true" />
            <div>
              <div className="go-row">
                <small>{event.kind}</small>
                <span className="go-privacy" data-visibility={event.visibility}>
                  {event.visibility === "restricted"
                    ? "Accès restreint"
                    : event.visibility === "sensitive"
                      ? "Sensible"
                      : "Standard"}
                </span>
              </div>
              <strong>{event.label}</strong>
              <p>
                {event.visibility === "restricted"
                  ? "Contenu masqué — autorisation requise."
                  : event.detail}
              </p>
              <GynecologyObstetricsOriginBadge origin={event.origin} />
              <GynecologyObstetricsSourceReference>
                {event.sourceReference}
              </GynecologyObstetricsSourceReference>
            </div>
          </article>
        ))}
      </div>
    </GynecologyObstetricsShell>
  );
}

export function PrenatalTimeline({
  events,
  ...stateProps
}: GynecologyObstetricsStateProps & { events: PrenatalEvent[] }) {
  const warning = events.some(
    (event) => event.windowStatus === "overdue" || event.clinicalStatus === "preliminary",
  );
  return (
    <GynecologyObstetricsShell
      eyebrow="Suivi prénatal"
      title="Trajectoire des fenêtres prénatales"
      description="Visites, examens, imagerie et plans partagent un axe gestationnel révisable."
      status={warning ? "warning" : "validated"}
      {...stateProps}
    >
      <div className="go-prenatal-list">
        {events.map((event) => (
          <article key={event.id} data-status={event.windowStatus}>
            <div className="go-ga">
              <strong>{event.gestationalAge}</strong>
              <time>{event.at}</time>
            </div>
            <span className="go-prenatal-mark" aria-hidden="true" />
            <div>
              <small>{event.kind}</small>
              <strong>{event.label}</strong>
              <p>{event.detail}</p>
              <div className="go-row">
                <span className="go-status" data-status={event.windowStatus}>
                  {statusLabel(event.windowStatus)}
                </span>
                <GynecologyObstetricsOriginBadge origin={event.origin} />
              </div>
            </div>
            <GynecologyObstetricsSourceReference>
              {event.sourceReference}
            </GynecologyObstetricsSourceReference>
          </article>
        ))}
      </div>
    </GynecologyObstetricsShell>
  );
}

export function FetalAssessmentWorkbench({
  measures,
  ...stateProps
}: GynecologyObstetricsStateProps & { measures: FetalMeasure[] }) {
  const fetusCount = new Set(measures.map((measure) => measure.fetusReference)).size;
  return (
    <GynecologyObstetricsShell
      eyebrow="Évaluation fœtale"
      title="Mesures, références et complétude"
      description="Chaque mesure garde l’identité fœtale, la référence active et son niveau de preuve."
      status={
        measures.some((measure) => measure.interpretation === "unknown") ? "warning" : "validated"
      }
      {...stateProps}
    >
      <div className="go-fetal-summary">
        <span>Identités fœtales distinctes</span>
        <strong>{fetusCount}</strong>
      </div>
      <div className="go-measure-grid">
        {measures.map((measure) => (
          <article key={measure.id} data-interpretation={measure.interpretation}>
            <small>{measure.fetusReference}</small>
            <strong>{measure.label}</strong>
            <span className="go-measure-value">
              {measure.value ?? <GynecologyObstetricsEmptyValue label="Structure non visualisée" />}
            </span>
            <span>{measure.reference ?? "Référence non transmise"}</span>
            <GynecologyObstetricsSeverity
              severity={
                measure.interpretation === "within"
                  ? "normal"
                  : measure.interpretation === "outside"
                    ? "critical"
                    : measure.interpretation === "borderline"
                      ? "warning"
                      : "unknown"
              }
            />
            <GynecologyObstetricsSourceReference>
              {measure.sourceReference}
            </GynecologyObstetricsSourceReference>
          </article>
        ))}
      </div>
    </GynecologyObstetricsShell>
  );
}

function LaborChart({ observations }: { observations: LaborObservation[] }) {
  const titleId = useId();
  const duration = Math.max(...observations.map((item) => item.elapsedMinutes), 1);
  const x = (minutes: number) => 48 + (minutes / duration) * 520;
  const y = (dilation: number) => 190 - (dilation / 10) * 145;
  const dilationPoints = observations.filter(
    (item): item is LaborObservation & { cervicalDilation: number } =>
      item.cervicalDilation !== undefined,
  );
  return (
    <figure className="go-labor-chart">
      <svg viewBox="0 0 620 225" role="img" aria-labelledby={titleId}>
        <title id={titleId}>Progression du travail — dilatation cervicale documentée</title>
        {[0, 2, 4, 6, 8, 10].map((value) => (
          <g key={value}>
            <line x1="48" x2="568" y1={y(value)} y2={y(value)} className="go-chart-grid" />
            <text x="16" y={y(value) + 4}>
              {value}
            </text>
          </g>
        ))}
        <polyline
          className="go-chart-line"
          points={dilationPoints
            .map((item) => `${x(item.elapsedMinutes)},${y(item.cervicalDilation)}`)
            .join(" ")}
        />
        {dilationPoints.map((item) => (
          <circle
            key={item.id}
            cx={x(item.elapsedMinutes)}
            cy={y(item.cervicalDilation)}
            r="5"
            className="go-chart-point"
          >
            <title>
              {item.at} — {item.cervicalDilation} cm
            </title>
          </circle>
        ))}
        <text x="48" y="216">
          Minutes depuis le début de la série
        </text>
      </svg>
      <figcaption>Dilatation en cm · observations reçues, sans extrapolation</figcaption>
      <details>
        <summary>Tableau accessible du partogramme</summary>
        <table>
          <thead>
            <tr>
              <th>Heure</th>
              <th>Dilatation</th>
              <th>RCF</th>
              <th>Contractions</th>
              <th>Membranes</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((item) => (
              <tr key={`${item.id}-table`}>
                <td>{item.at}</td>
                <td>{item.cervicalDilation ?? "Non mesurée"}</td>
                <td>{item.fetalHeartRate ?? "Non mesuré"}</td>
                <td>{item.contractions ?? "Non mesurées"}</td>
                <td>{item.membraneStatus ?? "Non documenté"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

export function LaborPartogram({
  observations,
  ...stateProps
}: GynecologyObstetricsStateProps & { observations: LaborObservation[] }) {
  const latest = observations.at(-1);
  return (
    <GynecologyObstetricsShell
      eyebrow="Travail"
      title="Partogramme clinique accessible"
      description="Progression, rythme fœtal, contractions et membranes restent synchronisés par heure."
      status={latest && (latest.fetalHeartRate ?? 0) > 160 ? "warning" : "validated"}
      {...stateProps}
    >
      <div className="go-labor-layout">
        <section className="go-panel">
          <LaborChart observations={observations} />
        </section>
        <aside className="go-panel">
          <p className="go-panel__label">Dernière observation</p>
          <dl className="go-definition-list">
            <div>
              <dt>Heure</dt>
              <dd>{latest?.at ?? <GynecologyObstetricsEmptyValue />}</dd>
            </div>
            <div>
              <dt>Dilatation</dt>
              <dd>
                {latest?.cervicalDilation !== undefined ? (
                  `${latest.cervicalDilation} cm`
                ) : (
                  <GynecologyObstetricsEmptyValue />
                )}
              </dd>
            </div>
            <div>
              <dt>Rythme fœtal</dt>
              <dd>
                {latest?.fetalHeartRate !== undefined ? (
                  `${latest.fetalHeartRate}/min`
                ) : (
                  <GynecologyObstetricsEmptyValue />
                )}
              </dd>
            </div>
            <div>
              <dt>Contractions</dt>
              <dd>{latest?.contractions ?? <GynecologyObstetricsEmptyValue />}</dd>
            </div>
          </dl>
          {latest ? (
            <GynecologyObstetricsSourceReference>
              {latest.sourceReference}
            </GynecologyObstetricsSourceReference>
          ) : null}
        </aside>
      </div>
    </GynecologyObstetricsShell>
  );
}

export function BirthDecisionBoard({
  decision,
  ...stateProps
}: GynecologyObstetricsStateProps & { decision?: BirthDecision | null }) {
  const blocked = decision?.readiness.some(
    (item) => item.status === "blocked" || item.status === "unknown",
  );
  return (
    <GynecologyObstetricsShell
      eyebrow="Décision de naissance"
      title="Décision, horloge et préparation"
      description="L’interface restitue la décision reçue ; elle ne choisit pas le mode d’accouchement."
      status={
        blocked
          ? "critical"
          : decision?.readiness.some((item) => item.status === "pending")
            ? "warning"
            : decision
              ? "validated"
              : "unknown"
      }
      {...stateProps}
    >
      {decision ? (
        <div className="go-decision-layout">
          <section className="go-panel go-decision">
            <p className="go-panel__label">Décision documentée</p>
            <strong>{decision.decision}</strong>
            <p>
              {decision.indication ?? (
                <GynecologyObstetricsEmptyValue label="Indication non transmise" />
              )}
            </p>
            <dl className="go-definition-list">
              <div>
                <dt>Décidée à</dt>
                <dd>{decision.decidedAt ?? <GynecologyObstetricsEmptyValue />}</dd>
              </div>
              <div>
                <dt>Cible</dt>
                <dd>{decision.targetAt ?? <GynecologyObstetricsEmptyValue />}</dd>
              </div>
              <div>
                <dt>Responsable</dt>
                <dd>{decision.owner ?? "Non attribué"}</dd>
              </div>
            </dl>
            <GynecologyObstetricsSourceReference>
              {decision.sourceReference}
            </GynecologyObstetricsSourceReference>
          </section>
          <section className="go-panel">
            <p className="go-panel__label">Préparation</p>
            <div className="go-readiness">
              {decision.readiness.map((item) => (
                <article key={item.id} data-status={item.status}>
                  <span aria-hidden="true">
                    {item.status === "ready" ? "✓" : item.status === "blocked" ? "!!" : "○"}
                  </span>
                  <strong>{item.label}</strong>
                  <small>{statusLabel(item.status)}</small>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </GynecologyObstetricsShell>
  );
}

export function HemorrhageSafetyWorkbench({
  items,
  quantifiedLoss,
  ...stateProps
}: GynecologyObstetricsStateProps & {
  items: HemorrhageSafetyItem[];
  quantifiedLoss?: string | null;
}) {
  const critical = items.some((item) => item.status === "triggered" && item.kind === "response");
  return (
    <GynecologyObstetricsShell
      eyebrow="Sécurité hémorragique"
      title="Risque, préparation et réponse"
      description="Les barrières sont explicites avant l’urgence ; les valeurs absentes restent absentes."
      status={
        critical
          ? "critical"
          : items.some((item) => item.status === "pending")
            ? "warning"
            : "validated"
      }
      {...stateProps}
    >
      <div className="go-hemorrhage-summary">
        <span>Perte quantifiée reçue</span>
        <strong>{quantifiedLoss ?? "Non transmise"}</strong>
      </div>
      <div className="go-safety-grid">
        {items.map((item) => (
          <article key={item.id} data-status={item.status}>
            <div className="go-row">
              <small>{item.kind}</small>
              <span className="go-status" data-status={item.status}>
                {statusLabel(item.status)}
              </span>
            </div>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
            <GynecologyObstetricsOriginBadge origin={item.origin} />
            <GynecologyObstetricsSourceReference>
              {item.sourceReference}
            </GynecologyObstetricsSourceReference>
          </article>
        ))}
      </div>
    </GynecologyObstetricsShell>
  );
}

export function NewbornTransitionWorkbench({
  items,
  ...stateProps
}: GynecologyObstetricsStateProps & { items: NewbornTransitionItem[] }) {
  const critical = items.some((item) => item.status === "critical");
  return (
    <GynecologyObstetricsShell
      eyebrow="Transition néonatale"
      title="Adaptation et continuité du nouveau-né"
      description="Le nouveau-né possède sa propre identité, ses observations et son plan."
      status={
        critical
          ? "critical"
          : items.some((item) => item.status === "support")
            ? "warning"
            : "validated"
      }
      {...stateProps}
    >
      <div className="go-newborn-list">
        {items.map((item) => (
          <article key={item.id} data-status={item.status}>
            <div>
              <strong>{item.minute}</strong>
              <small>{item.newbornReference}</small>
            </div>
            <span className="go-newborn-mark" aria-hidden="true" />
            <div>
              <strong>{item.label}</strong>
              <p>{item.value ?? <GynecologyObstetricsEmptyValue />}</p>
              <span className="go-status" data-status={item.status}>
                {statusLabel(item.status)}
              </span>
              <GynecologyObstetricsSourceReference>
                {item.sourceReference}
              </GynecologyObstetricsSourceReference>
            </div>
          </article>
        ))}
      </div>
    </GynecologyObstetricsShell>
  );
}

export function PostpartumWorkbench({
  items,
  ...stateProps
}: GynecologyObstetricsStateProps & { items: PostpartumItem[] }) {
  const status = items.some((item) => item.status === "critical")
    ? "critical"
    : items.some((item) => item.status === "follow-up" || item.status === "unavailable")
      ? "warning"
      : "validated";
  return (
    <GynecologyObstetricsShell
      eyebrow="Postpartum"
      title="Mère, nouveau-né et dyade"
      description="Les responsabilités, suivis et informations sensibles restent séparés mais coordonnés."
      status={status}
      {...stateProps}
    >
      <div className="go-postpartum-grid">
        {(["mother", "newborn", "dyad"] as const).map((actor) => {
          const actorItems = items.filter((item) => item.actor === actor);
          return (
            <section key={actor} className="go-panel">
              <p className="go-panel__label">
                {actor === "mother" ? "Mère" : actor === "newborn" ? "Nouveau-né" : "Dyade"}
              </p>
              <div className="go-postpartum-list">
                {actorItems.length ? (
                  actorItems.map((item) => (
                    <article
                      key={item.id}
                      data-status={item.status}
                      data-visibility={item.visibility}
                    >
                      <div className="go-row">
                        <strong>{item.label}</strong>
                        <span className="go-status" data-status={item.status}>
                          {statusLabel(item.status)}
                        </span>
                      </div>
                      <p>
                        {item.visibility === "restricted"
                          ? "Contenu masqué — autorisation requise."
                          : item.detail}
                      </p>
                      {item.visibility !== "standard" ? (
                        <span className="go-privacy" data-visibility={item.visibility}>
                          {item.visibility === "sensitive" ? "Sensible" : "Restreint"}
                        </span>
                      ) : null}
                      <GynecologyObstetricsSourceReference>
                        {item.sourceReference}
                      </GynecologyObstetricsSourceReference>
                    </article>
                  ))
                ) : (
                  <GynecologyObstetricsEmptyValue label="Aucun élément transmis" />
                )}
              </div>
            </section>
          );
        })}
      </div>
    </GynecologyObstetricsShell>
  );
}

export function GynecologyObstetricsServiceCatalog({
  items,
  ...stateProps
}: GynecologyObstetricsStateProps & { items: GynecologyObstetricsServiceItem[] }) {
  return (
    <GynecologyObstetricsShell
      eyebrow="Organisation"
      title="Catalogue gynéco-obstétrical"
      description="Durée et niveau de recours font partie du contrat de service."
      status="validated"
      {...stateProps}
    >
      <div className="go-service-list">
        {items.map((item) => (
          <article key={item.id}>
            <code>{item.id}</code>
            <div>
              <strong>{item.label}</strong>
              <span>{item.duration}</span>
            </div>
            <span className="go-level" data-level={item.level}>
              {item.level}
            </span>
            <GynecologyObstetricsSourceReference>
              {item.sourceReference}
            </GynecologyObstetricsSourceReference>
          </article>
        ))}
      </div>
    </GynecologyObstetricsShell>
  );
}
