import { useMemo, useState } from "react";
import { conceptLabel, extensionBySuffix, formatClinicalDate } from "./fhir-utils";
import {
  DermatologyStateSurface,
  PanelHeading,
  ReportStatus,
  SectionFrame,
  SyntheticBadge,
} from "./shared";
import type {
  DermatologyConsent,
  DermatologyDocumentReference,
  DermatologyStateProps,
} from "./types";

function documentTexture(document: DermatologyDocumentReference | undefined) {
  return (
    extensionBySuffix(document?.content[0]?.attachment.extension, "/texture-variant")?.valueCode ??
    "copper"
  );
}

function documentPreviewUrl(document: DermatologyDocumentReference | undefined) {
  const url = document?.content[0]?.attachment.url;
  return url && /^(https?:|blob:|data:image\/|\/)/.test(url) ? url : undefined;
}

export interface DermoscopicComparisonViewerProps extends DermatologyStateProps {
  documents: DermatologyDocumentReference[];
  consent?: DermatologyConsent;
  lesionLabel?: string;
  initialImageMode?: "visible" | "hidden";
}

export function DermoscopicComparisonViewer({
  documents,
  consent,
  lesionLabel = "Lésion liée",
  initialImageMode = "visible",
  state = "ready",
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: DermoscopicComparisonViewerProps) {
  const [imagesVisible, setImagesVisible] = useState(initialImageMode === "visible");
  const [comparePosition, setComparePosition] = useState(50);
  const ordered = useMemo(
    () => [...documents].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")),
    [documents],
  );
  const before = ordered[0];
  const after = ordered.at(-1);
  const consentGranted = consent?.status === "active" && consent.decision === "permit";
  const resolvedState =
    state === "ready" && !consentGranted
      ? "forbidden"
      : state === "ready" && documents.length === 0
        ? "empty"
        : state;

  return (
    <SectionFrame
      className="derm-viewer"
      label="Comparaison dermoscopique"
      dataMode={dataMode}
      presentation={presentation}
    >
      <PanelHeading
        eyebrow="Table lumineuse · FHIR DocumentReference"
        title="Comparaison dermoscopique"
        description={`${lesionLabel} · consentement ${consentGranted ? "actif" : "absent"}`}
        action={
          <div className="derm-viewer__actions">
            <SyntheticBadge label="Images synthétiques" />
            <button
              type="button"
              className="derm-button derm-button--viewer"
              aria-pressed={!imagesVisible}
              onClick={() => setImagesVisible((value) => !value)}
            >
              {imagesVisible ? "Masquer les images" : "Afficher les images"}
            </button>
          </div>
        }
      />
      <DermatologyStateSurface state={resolvedState} message={stateMessage}>
        {before && after ? (
          <>
            {imagesVisible ? (
              <div className="derm-viewer__stage">
                <article className="derm-image-card">
                  <header>
                    <div>
                      <span>Point initial</span>
                      <strong>{formatClinicalDate(before.date)}</strong>
                    </div>
                    <ReportStatus status={before.docStatus} />
                  </header>
                  {dataMode === "synthetic" ? (
                    <div className="derm-dermoscopy-image" data-texture={documentTexture(before)}>
                      <span className="derm-dermoscopy-image__scale">0 · 5 · 10 mm</span>
                      <span className="derm-dermoscopy-image__label">SYNTHÉTIQUE</span>
                    </div>
                  ) : documentPreviewUrl(before) ? (
                    <img
                      className="derm-clinical-image"
                      src={documentPreviewUrl(before)}
                      alt={
                        before.description ?? `Dermoscopie du ${formatClinicalDate(before.date)}`
                      }
                    />
                  ) : (
                    <div className="derm-image-unavailable" role="status">
                      <span aria-hidden="true">▧</span>
                      <strong>Aperçu non transmis</strong>
                    </div>
                  )}
                  <p>{before.description}</p>
                </article>

                <div className="derm-compare-control">
                  <label htmlFor="derm-compare-position">Repère de comparaison</label>
                  <input
                    id="derm-compare-position"
                    type="range"
                    min="0"
                    max="100"
                    value={comparePosition}
                    onChange={(event) => setComparePosition(event.currentTarget.valueAsNumber)}
                  />
                  <output htmlFor="derm-compare-position">{comparePosition} %</output>
                </div>

                <article className="derm-image-card">
                  <header>
                    <div>
                      <span>Point comparé</span>
                      <strong>{formatClinicalDate(after.date)}</strong>
                    </div>
                    <ReportStatus status={after.docStatus} />
                  </header>
                  {dataMode === "synthetic" ? (
                    <div className="derm-dermoscopy-image" data-texture={documentTexture(after)}>
                      <span className="derm-dermoscopy-image__scale">0 · 5 · 10 mm</span>
                      <span className="derm-dermoscopy-image__label">SYNTHÉTIQUE</span>
                    </div>
                  ) : documentPreviewUrl(after) ? (
                    <img
                      className="derm-clinical-image"
                      src={documentPreviewUrl(after)}
                      alt={after.description ?? `Dermoscopie du ${formatClinicalDate(after.date)}`}
                    />
                  ) : (
                    <div className="derm-image-unavailable" role="status">
                      <span aria-hidden="true">▧</span>
                      <strong>Aperçu non transmis</strong>
                    </div>
                  )}
                  <p>{after.description}</p>
                </article>
              </div>
            ) : (
              <div className="derm-image-off" role="status">
                <span aria-hidden="true">▧</span>
                <div>
                  <strong>Mode sans image actif</strong>
                  <p>
                    La comparaison reste exploitable avec les dates, statuts, descriptions, mesures
                    et références FHIR ci-dessous.
                  </p>
                </div>
              </div>
            )}

            <dl
              className="derm-viewer__provenance"
              aria-label="Consentement et provenance des images"
            >
              <div>
                <dt>Consentement image</dt>
                <dd>
                  <span aria-hidden="true">✓</span> Actif · <code>Consent/{consent?.id}</code>
                </dd>
              </div>
              <div>
                <dt>Auteur</dt>
                <dd>{after.author?.[0]?.display ?? "Non renseigné"}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>
                  <code>DocumentReference/{after.id}</code>
                </dd>
              </div>
              <div>
                <dt>Intégrité</dt>
                <dd>
                  <span aria-hidden="true">◇</span>{" "}
                  {dataMode === "synthetic"
                    ? "Fixture synthétique vérifiée"
                    : `Source FHIR documentée${after.meta?.versionId ? ` · version ${after.meta.versionId}` : ""}`}
                </dd>
              </div>
            </dl>

            <div className="derm-table-wrap derm-viewer__alternative">
              <table>
                <caption>Alternative textuelle complète aux images dermoscopiques</caption>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Statut</th>
                    <th scope="col">Description</th>
                    <th scope="col">Type</th>
                    <th scope="col">Référence FHIR</th>
                  </tr>
                </thead>
                <tbody>
                  {ordered.map((document) => (
                    <tr key={document.id}>
                      <td>{formatClinicalDate(document.date)}</td>
                      <td>
                        <ReportStatus status={document.docStatus} />
                      </td>
                      <td>{document.description ?? "Sans description"}</td>
                      <td>{conceptLabel(document.type)}</td>
                      <td>
                        <code>DocumentReference/{document.id}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </DermatologyStateSurface>
    </SectionFrame>
  );
}
