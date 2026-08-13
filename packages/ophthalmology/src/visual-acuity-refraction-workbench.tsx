import { ClinicalStatusBadge } from "@clinical-ui/core";
import { useMemo, useState } from "react";
import {
  EyeLabel,
  OphthalmologyDataBoundary,
  OphthalmologyPanel,
  SyntheticStamp,
} from "./primitives";
import type { AcuityReading, ClinicalDataState, Eye, RefractionReading } from "./types";

export type AcuityDisplayScale = "decimal" | "logmar" | "snellen";

export function convertDecimalAcuity(value: number, scale: AcuityDisplayScale) {
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (scale === "decimal")
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value);
  if (scale === "logmar") {
    const logmar = -Math.log10(value);
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(logmar) < 0.005 ? 0 : logmar);
  }
  return `20/${Math.round(20 / value)}`;
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value?: number | undefined;
  onChange: (value: number | undefined) => void;
  suffix?: string;
}) {
  return (
    <label className="oph-number-field">
      <span>{label}</span>
      <span className="oph-number-field__control">
        <input
          aria-label={label}
          inputMode="decimal"
          type="number"
          value={value ?? ""}
          onChange={(event) =>
            onChange(event.target.value === "" ? undefined : Number(event.target.value))
          }
        />
        {suffix ? <small>{suffix}</small> : null}
      </span>
    </label>
  );
}

export interface VisualAcuityRefractionWorkbenchProps {
  acuities: AcuityReading[];
  refractions: RefractionReading[];
  state?: ClinicalDataState;
  initialScale?: AcuityDisplayScale;
  readOnly?: boolean;
  onRefractionChange?: (readings: RefractionReading[]) => void;
}

export function VisualAcuityRefractionWorkbench({
  acuities,
  refractions,
  state = "ready",
  initialScale = "decimal",
  readOnly = false,
  onRefractionChange,
}: VisualAcuityRefractionWorkbenchProps) {
  const [scale, setScale] = useState<AcuityDisplayScale>(initialScale);
  const [draft, setDraft] = useState(refractions);
  const scaleLabel = { decimal: "Décimale", logmar: "logMAR", snellen: "Snellen" }[scale];

  const amend = (eye: Eye, key: keyof RefractionReading, value: number | undefined) => {
    const next = draft.map((item) =>
      item.eye === eye ? { ...item, [key]: value, status: "amended" as const } : item,
    );
    setDraft(next);
    onRefractionChange?.(next);
  };

  const rows = useMemo(
    () =>
      (["OD", "OG"] as Eye[]).map((eye) => ({
        eye,
        acuity: acuities.find((item) => item.eye === eye),
        refraction: draft.find((item) => item.eye === eye),
      })),
    [acuities, draft],
  );

  return (
    <OphthalmologyDataBoundary state={state} label="Acuité et réfraction">
      <article className="oph-workbench oph-refraction">
        <header className="oph-workbench-heading">
          <div>
            <p className="oph-kicker">Réfraction & acuité</p>
            <h2>Du mesuré à la prescription</h2>
            <p>La valeur source ne change jamais ; seule sa représentation est convertie.</p>
          </div>
          <SyntheticStamp />
        </header>

        <fieldset className="oph-scale-switch">
          <legend>Afficher</legend>
          {(["decimal", "logmar", "snellen"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={scale === option}
              onClick={() => setScale(option)}
            >
              {{ decimal: "Décimale", logmar: "logMAR", snellen: "Snellen" }[option]}
            </button>
          ))}
        </fieldset>

        <div className="oph-refraction__eyes">
          {rows.map(({ eye, acuity, refraction }) => (
            <OphthalmologyPanel
              key={eye}
              title={eye === "OD" ? "Œil droit" : "Œil gauche"}
              eyebrow="Lecture monoculaire"
              action={<EyeLabel eye={eye} />}
            >
              <div className="oph-acuity-band">
                <div>
                  <span>Sans correction</span>
                  <strong>
                    {acuity?.distanceUncorrected !== undefined
                      ? convertDecimalAcuity(acuity.distanceUncorrected, scale)
                      : "Non mesuré"}
                  </strong>
                </div>
                <div>
                  <span>Avec correction</span>
                  <strong>
                    {acuity?.distanceCorrected !== undefined
                      ? convertDecimalAcuity(acuity.distanceCorrected, scale)
                      : "Non mesuré"}
                  </strong>
                </div>
                <div>
                  <span>Trou sténopéique</span>
                  <strong>
                    {acuity?.pinhole !== undefined
                      ? convertDecimalAcuity(acuity.pinhole, scale)
                      : "Non réalisé"}
                  </strong>
                </div>
                <div>
                  <span>Près</span>
                  <strong>{acuity?.near ?? "Non mesuré"}</strong>
                </div>
              </div>
              {acuity ? (
                <div className="oph-reading-status">
                  <ClinicalStatusBadge status={acuity.status} compact />
                  {acuity.note ? <span>{acuity.note}</span> : null}
                </div>
              ) : null}
              <fieldset className="oph-refraction-fields" disabled={readOnly}>
                <legend>Réfraction subjective</legend>
                <NumberField
                  label={`${eye} · Sphère`}
                  value={refraction?.sphere}
                  suffix="D"
                  onChange={(value) => amend(eye, "sphere", value)}
                />
                <NumberField
                  label={`${eye} · Cylindre`}
                  value={refraction?.cylinder}
                  suffix="D"
                  onChange={(value) => amend(eye, "cylinder", value)}
                />
                <NumberField
                  label={`${eye} · Axe`}
                  value={refraction?.axis}
                  suffix="°"
                  onChange={(value) => amend(eye, "axis", value)}
                />
                <NumberField
                  label={`${eye} · Addition`}
                  value={refraction?.addition}
                  suffix="D"
                  onChange={(value) => amend(eye, "addition", value)}
                />
              </fieldset>
            </OphthalmologyPanel>
          ))}
        </div>

        <aside className="oph-conversion-note">
          <strong>Conversion expliquée · {scaleLabel}</strong>
          <span>
            {scale === "decimal"
              ? "Valeur décimale source, par exemple 0,8."
              : scale === "logmar"
                ? "logMAR = −log₁₀(acuité décimale). Une valeur plus basse indique une meilleure acuité."
                : "Équivalent Snellen calculé à partir de la valeur décimale, arrondi au dénominateur entier."}
          </span>
        </aside>

        <OphthalmologyPanel title="Prescription optique" eyebrow="Synthèse amendable">
          <div className="oph-table-wrap">
            <table className="oph-table">
              <caption>Prescription issue des valeurs synthétiques saisies ci-dessus</caption>
              <thead>
                <tr>
                  <th>Œil</th>
                  <th>Sphère</th>
                  <th>Cylindre</th>
                  <th>Axe</th>
                  <th>Addition</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {draft.map((item) => (
                  <tr key={item.eye}>
                    <th scope="row">{item.eye}</th>
                    <td>
                      {item.sphere === undefined ? "Non renseigné" : `${item.sphere.toFixed(2)} D`}
                    </td>
                    <td>
                      {item.cylinder === undefined
                        ? "Non renseigné"
                        : `${item.cylinder.toFixed(2)} D`}
                    </td>
                    <td>{item.axis === undefined ? "Non renseigné" : `${item.axis}°`}</td>
                    <td>
                      {item.addition === undefined
                        ? "Non renseigné"
                        : `${item.addition.toFixed(2)} D`}
                    </td>
                    <td>
                      <ClinicalStatusBadge status={item.status} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </OphthalmologyPanel>
      </article>
    </OphthalmologyDataBoundary>
  );
}
