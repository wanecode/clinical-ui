import { useMemo, useState } from "react";
import { EntStatePanel, EntWorkbenchFrame, SegmentedControl } from "./common";
import type { EntDisplayState, EntHostPresentationProps, SafetyChecklistItem } from "./types";

const GROUP_LABELS: Record<SafetyChecklistItem["group"], string> = {
  "pre-procedure": "Avant le geste",
  implant: "Implants",
  postoperative: "Postopératoire",
  emergency: "Urgence",
};

export interface EntSurgerySafetyPanelProps extends EntHostPresentationProps {
  items: SafetyChecklistItem[];
  state?: EntDisplayState;
  initialVigilanceAcknowledged?: boolean;
}

export function EntSurgerySafetyPanel({
  items,
  state = "ready",
  initialVigilanceAcknowledged = false,
  dataMode = "clinical",
  presentation = "standalone",
}: EntSurgerySafetyPanelProps) {
  const [scope, setScope] = useState<"all" | SafetyChecklistItem["group"]>("all");
  const [vigilanceAcknowledged, setVigilanceAcknowledged] = useState(initialVigilanceAcknowledged);
  const visible = useMemo(
    () => items.filter((item) => scope === "all" || item.group === scope),
    [items, scope],
  );
  const pending = items.filter((item) => item.status === "pending").length;
  return (
    <EntWorkbenchFrame
      dataMode={dataMode}
      presentation={presentation}
      title="Sécurité chirurgicale ORL"
      eyebrow="Procédure et postopératoire"
      description="Contrôles avant geste, implants, consignes postopératoires et préparation aux urgences."
      status={vigilanceAcknowledged ? "Vigilance acquittée" : `${pending} point en attente`}
      statusTone={vigilanceAcknowledged ? "success" : "warning"}
    >
      {state !== "ready" ? (
        <EntStatePanel state={state} />
      ) : (
        <div className="ent-safety">
          <SegmentedControl
            label="Filtrer les contrôles"
            value={scope}
            onChange={setScope}
            options={[
              { value: "all", label: "Tous" },
              { value: "pre-procedure", label: "Avant geste" },
              { value: "implant", label: "Implants" },
              { value: "postoperative", label: "Postop." },
              { value: "emergency", label: "Urgence" },
            ]}
          />
          <div className="ent-safety__layout">
            <section className="ent-panel">
              <h3>Registre de contrôle</h3>
              <ul className="ent-checklist" aria-live="polite">
                {visible.map((item) => (
                  <li key={item.id} data-status={item.status}>
                    <span className="ent-checklist__box" aria-hidden="true">
                      {item.status === "checked"
                        ? "✓"
                        : item.status === "not-applicable"
                          ? "—"
                          : "!"}
                    </span>
                    <div>
                      <strong>{item.label}</strong>
                      <span>
                        {GROUP_LABELS[item.group]}
                        {item.checkedBy ? ` · ${item.checkedBy}` : ""}
                        {item.checkedAt ? ` · ${item.checkedAt}` : ""}
                      </span>
                    </div>
                    <em>
                      {item.status === "checked"
                        ? "Vérifié"
                        : item.status === "not-applicable"
                          ? "Non applicable"
                          : "En attente"}
                    </em>
                  </li>
                ))}
              </ul>
            </section>
            <aside
              className="ent-panel ent-vigilance"
              data-acknowledged={vigilanceAcknowledged || undefined}
            >
              <span className="ent-vigilance__shield" aria-hidden="true">
                ◇
              </span>
              <p className="ent-eyebrow">Vigilance</p>
              <h3>{vigilanceAcknowledged ? "Lecture acquittée" : "Lecture requise"}</h3>
              <p>
                Un point postopératoire reste en attente. L’acquittement enregistre la lecture, pas
                la réalisation du contrôle.
              </p>
              <button
                type="button"
                className="ent-button"
                aria-pressed={vigilanceAcknowledged}
                onClick={() => setVigilanceAcknowledged((current) => !current)}
              >
                {vigilanceAcknowledged ? "Annuler l’acquittement" : "Acquitter la vigilance"}
              </button>
            </aside>
          </div>
        </div>
      )}
    </EntWorkbenchFrame>
  );
}
