import { useState } from "react";
import { DentalPanel, DentalStateBoundary } from "./primitives";
import type { DentalStateProps, SafetyItem } from "./types";

export interface ExtractionSafetyChecklistProps extends DentalStateProps {
  tooth: string;
  items: SafetyItem[];
  onCompletionChange?: (complete: boolean, checkedIds: string[]) => void;
}

export function ExtractionSafetyChecklist({
  tooth,
  items,
  onCompletionChange,
  state,
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: ExtractionSafetyChecklistProps) {
  const [checked, setChecked] = useState(
    () => new Set(items.filter((item) => item.checked).map((item) => item.id)),
  );
  const remaining = items.filter((item) => !checked.has(item.id));
  const criticalRemaining = remaining.filter((item) => item.critical);
  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
    onCompletionChange?.(next.size === items.length, Array.from(next));
  };
  return (
    <DentalPanel
      eyebrow={`Extraction · dent ${tooth}`}
      title="Sécurité avant extraction"
      description="Les points critiques bloquent la validation tant qu'ils ne sont pas explicitement confirmés."
      className="od-panel--safety"
      dataMode={dataMode}
      presentation={presentation}
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        <div
          className="od-safety-status"
          data-complete={remaining.length === 0 || undefined}
          role={criticalRemaining.length ? "alert" : "status"}
        >
          <span aria-hidden="true">{remaining.length === 0 ? "✓" : "!"}</span>
          <div>
            <strong>
              {remaining.length === 0 ? "Checklist complète" : "Checklist incomplète"}
            </strong>
            <p>
              {remaining.length === 0
                ? "Tous les contrôles sont documentés."
                : `${remaining.length} contrôle(s) restant(s), dont ${criticalRemaining.length} critique(s).`}
            </p>
          </div>
        </div>
        <fieldset className="od-safety-list">
          <legend>Contrôles documentés</legend>
          {items.map((item) => (
            <label key={item.id} data-critical={item.critical || undefined}>
              <input
                type="checkbox"
                checked={checked.has(item.id)}
                onChange={() => toggle(item.id)}
              />
              <span className="od-safety-checkbox" aria-hidden="true">
                {checked.has(item.id) ? "✓" : ""}
              </span>
              <span>
                <strong>{item.label}</strong>
                {item.detail ? <small>{item.detail}</small> : null}
                <code>{item.resourceRef}</code>
              </span>
              {item.critical ? <em>Critique</em> : null}
            </label>
          ))}
        </fieldset>
        <button className="od-primary-action" type="button" disabled={remaining.length > 0}>
          Valider la sécurité préopératoire
        </button>
      </DentalStateBoundary>
    </DentalPanel>
  );
}
