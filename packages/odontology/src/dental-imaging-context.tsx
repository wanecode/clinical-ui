import { useState } from "react";
import { DentalPanel, DentalStateBoundary, EvidenceBadge, SyntheticFlag } from "./primitives";
import type { DentalImagingItem, DentalStateProps } from "./types";

export interface DentalImagingContextProps extends DentalStateProps {
  images: DentalImagingItem[];
  selectedImage?: string;
  onImageChange?: (image: DentalImagingItem) => void;
}

const modalityLabels: Record<DentalImagingItem["modality"], string> = {
  panoramic: "Panoramique",
  bitewing: "Bitewing",
  periapical: "Rétro-alvéolaire",
  cbct: "CBCT",
  photo: "Photographie",
};

export function DentalImagingContext({
  images,
  selectedImage,
  onImageChange,
  state,
  stateMessage,
}: DentalImagingContextProps) {
  const [activeId, setActiveId] = useState(selectedImage ?? images[0]?.id);
  const active = images.find((image) => image.id === activeId) ?? images[0];
  const select = (image: DentalImagingItem) => {
    setActiveId(image.id);
    onImageChange?.(image);
  };
  return (
    <DentalPanel
      eyebrow="Imagerie et provenance"
      title="Contexte dentaire multimodal"
      description="Les aperçus synthétiques conservent modalité, région, date et source visibles."
      actions={<SyntheticFlag />}
      className="od-panel--imaging"
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        {active ? (
          <div className="od-imaging-layout">
            <div className="od-image-viewer" data-modality={active.modality}>
              <div className="od-image-viewer__toolbar">
                <strong>{active.title}</strong>
                <EvidenceBadge kind={active.evidence} />
              </div>
              <div
                className="od-radiograph"
                role="img"
                aria-label={`Aperçu ${modalityLabels[active.modality]} entièrement synthétique de ${active.region}`}
              >
                <span
                  className="od-radiograph__arch od-radiograph__arch--upper"
                  aria-hidden="true"
                />
                <span
                  className="od-radiograph__arch od-radiograph__arch--lower"
                  aria-hidden="true"
                />
                <span className="od-radiograph__marker" aria-hidden="true">
                  R
                </span>
                <strong>IMAGE SYNTHÉTIQUE</strong>
              </div>
              <dl>
                <div>
                  <dt>Modalité</dt>
                  <dd>{modalityLabels[active.modality]}</dd>
                </div>
                <div>
                  <dt>Région</dt>
                  <dd>{active.region}</dd>
                </div>
                <div>
                  <dt>Acquisition</dt>
                  <dd>
                    <time dateTime={active.date}>{active.date}</time>
                  </dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>{active.source}</dd>
                </div>
              </dl>
              <code>{active.resourceRef}</code>
            </div>
            <ul className="od-image-strip" aria-label="Séries d'imagerie disponibles">
              {images.map((image) => (
                <li key={image.id}>
                  <button
                    type="button"
                    aria-pressed={image.id === active.id}
                    onClick={() => select(image)}
                  >
                    <span className="od-image-thumb" aria-hidden="true">
                      <i />
                      <i />
                    </span>
                    <span>
                      <strong>{image.title}</strong>
                      <small>
                        {image.date} · {image.region}
                      </small>
                      <EvidenceBadge kind={image.evidence} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </DentalStateBoundary>
    </DentalPanel>
  );
}
