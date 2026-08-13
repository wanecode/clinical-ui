import { useState } from "react";
import {
  DataMaturityBadge,
  EntStatePanel,
  EntWorkbenchFrame,
  LateralityMark,
  SourceLine,
} from "./common";
import type { EndoscopyMedia, EntDisplayState, EntHostPresentationProps } from "./types";

export interface EntEndoscopyViewerProps extends EntHostPresentationProps {
  media: EndoscopyMedia[];
  state?: EntDisplayState;
}

export function EntEndoscopyViewer({
  media,
  state = "ready",
  dataMode = "clinical",
  presentation = "standalone",
}: EntEndoscopyViewerProps) {
  const [selectedId, setSelectedId] = useState(media[0]?.id ?? "");
  const selected = media.find((item) => item.id === selectedId) ?? media[0];
  const hasRenderableMedia =
    selected?.availability === "available" &&
    (dataMode === "synthetic" || Boolean(selected.imageUrl));
  return (
    <EntWorkbenchFrame
      dataMode={dataMode}
      presentation={presentation}
      title="Endoscopie ORL"
      eyebrow="Sterile lightbox · Acquisition"
      description="Disponibilité, consentement, latéralité et provenance restent visibles autour du média."
      status={hasRenderableMedia ? "Média disponible" : "Média non chargé"}
      statusTone={hasRenderableMedia ? "success" : "warning"}
    >
      {state !== "ready" ? (
        <EntStatePanel state={state} />
      ) : !selected ? (
        <EntStatePanel state="empty" />
      ) : (
        <div className="ent-endoscopy">
          <aside className="ent-endoscopy__rail" aria-label="Métadonnées d’acquisition">
            <div>
              <span>Disponibilité</span>
              <strong>
                {selected.availability === "available"
                  ? "Disponible"
                  : selected.availability === "restricted"
                    ? "Restreint"
                    : "Non disponible"}
              </strong>
            </div>
            <div>
              <span>Site consigné</span>
              <strong>{selected.bodySite}</strong>
            </div>
            <div>
              <span>Latéralité</span>
              <LateralityMark laterality={selected.laterality} />
            </div>
            <div>
              <span>Consentement</span>
              <strong>
                {selected.consent === "recorded"
                  ? "Recueilli"
                  : selected.consent === "withdrawn"
                    ? "Retiré"
                    : "Non documenté"}
              </strong>
            </div>
            <div>
              <span>Capture</span>
              <strong>{selected.capturedAt ?? "Non disponible"}</strong>
            </div>
            <div>
              <span>Provenance</span>
              <SourceLine reference={selected.source.reference} />
            </div>
          </aside>

          <div className="ent-endoscopy__stage" data-availability={selected.availability}>
            <div className="ent-viewer-label">
              <span>{dataMode === "synthetic" ? "Média synthétique" : "Média source"}</span>
              <DataMaturityBadge maturity={selected.source.maturity} />
            </div>
            {selected.availability === "available" && dataMode === "synthetic" ? (
              <div
                className="ent-test-pattern"
                role="img"
                aria-label="Mire technique synthétique, sans donnée anatomique"
              >
                <span className="ent-test-pattern__cross" aria-hidden="true" />
                <span className="ent-test-pattern__bars" aria-hidden="true" />
                <strong>MIRE SYNTHÉTIQUE</strong>
                <small>Aucune image patient</small>
              </div>
            ) : selected.availability === "available" && selected.imageUrl ? (
              <img
                className="ent-endoscopy__media"
                src={selected.imageUrl}
                alt={`${selected.title} — ${selected.bodySite}`}
              />
            ) : selected.availability === "available" ? (
              <EntStatePanel state="partial" compact />
            ) : (
              <EntStatePanel
                state={selected.availability === "restricted" ? "forbidden" : "empty"}
                compact
              />
            )}
            <div className="ent-viewer-scale" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <nav className="ent-endoscopy__strip" aria-label="Acquisitions disponibles">
            {media.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-current={item.id === selected.id}
                onClick={() => setSelectedId(item.id)}
              >
                <span className="ent-media-index">{String(index + 1).padStart(2, "0")}</span>
                <span
                  className="ent-media-thumb"
                  data-availability={item.availability}
                  aria-hidden="true"
                />
                <strong>{item.title}</strong>
                <small>
                  {item.availability === "available"
                    ? "Disponible"
                    : item.availability === "restricted"
                      ? "Restreint"
                      : "Non disponible"}
                </small>
              </button>
            ))}
          </nav>
        </div>
      )}
    </EntWorkbenchFrame>
  );
}
