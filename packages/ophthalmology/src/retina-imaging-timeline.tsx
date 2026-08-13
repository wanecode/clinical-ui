import { useId, useRef, useState } from "react";
import {
  DataModeStamp,
  OphthalmologyDataBoundary,
  OphthalmologyWorkbenchHeader,
} from "./primitives";
import type {
  ClinicalDataState,
  OphthalmologyDataMode,
  OphthalmologyPresentation,
  RetinaCareEvent,
  RetinaImage,
} from "./types";

export interface RetinaImagingTimelineProps {
  images: RetinaImage[];
  state?: ClinicalDataState;
  initialImageId?: string;
  careEvents?: RetinaCareEvent[];
  dataMode?: OphthalmologyDataMode;
  presentation?: OphthalmologyPresentation;
}

function RetinaViewer({
  image,
  comparison = false,
  dataMode,
}: {
  image?: RetinaImage | undefined;
  comparison?: boolean;
  dataMode: OphthalmologyDataMode;
}) {
  if (!image || image.quality === "unavailable" || (dataMode === "clinical" && !image.imageUrl)) {
    return (
      <div className="oph-retina-viewer oph-retina-viewer--empty">
        <span aria-hidden="true">⊘</span>
        <strong>
          {image && image.quality !== "unavailable" ? "Aperçu non transmis" : "Image indisponible"}
        </strong>
        <small>
          {image
            ? `${image.modality} · ${image.eye} · ${image.date} · ${image.source}`
            : "Aucune source"}
        </small>
      </div>
    );
  }
  return (
    <figure
      className="oph-retina-viewer"
      data-modality={image.modality}
      data-quality={image.quality}
    >
      <div className="oph-retina-viewer__meta">
        <span>{comparison ? "Comparaison" : "Sélection"}</span>
        <strong>
          {image.modality} · {image.eye}
        </strong>
        <span>{image.date}</span>
      </div>
      <div className="oph-synthetic-scan">
        {image.imageUrl ? (
          <img
            className="oph-synthetic-scan__image"
            src={image.imageUrl}
            alt={
              image.imageAlt ??
              (dataMode === "synthetic"
                ? `${image.modality} synthétique ${image.eye}, ${image.date}, coupe rétinienne simulée`
                : `${image.modality} ${image.eye}, ${image.date}`)
            }
          />
        ) : (
          <div
            className="oph-synthetic-scan__fallback"
            role="img"
            aria-label={`${image.modality} synthétique ${image.eye}, ${image.date}`}
          >
            <span className="oph-scan-layer oph-scan-layer--one" />
            <span className="oph-scan-layer oph-scan-layer--two" />
          </div>
        )}
        <span className="oph-scan-caliper" aria-hidden="true" />
      </div>
      <figcaption>
        <DataModeStamp mode={dataMode} compact />
        <span>{image.cst !== undefined ? `CST ${image.cst} µm` : "Mesure non disponible"}</span>
        <span data-quality={image.quality}>
          {image.quality === "insufficient" ? "△ Qualité insuffisante" : "✓ Qualité exploitable"}
        </span>
      </figcaption>
    </figure>
  );
}

export function RetinaImagingTimeline({
  images,
  state = "ready",
  initialImageId,
  careEvents = [],
  dataMode = "clinical",
  presentation = "standalone",
}: RetinaImagingTimelineProps) {
  const initial = Math.max(
    0,
    images.findIndex((image) => image.id === initialImageId),
  );
  const [selectedIndex, setSelectedIndex] = useState(initial);
  const [comparisonIndex, setComparisonIndex] = useState(Math.min(initial + 1, images.length - 1));
  const [showTable, setShowTable] = useState(false);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const timelineId = useId();
  const selected = images[selectedIndex];
  const comparison = images[comparisonIndex];

  const move = (next: number) => {
    const bounded = Math.max(0, Math.min(images.length - 1, next));
    setSelectedIndex(bounded);
    refs.current[bounded]?.focus();
  };

  return (
    <OphthalmologyDataBoundary state={state} label="Imagerie rétinienne">
      <article className="oph-workbench oph-retina" data-presentation={presentation}>
        <OphthalmologyWorkbenchHeader
          kicker="Rétine médicale"
          title="Imagerie dans le temps"
          description="Comparer sans masquer qualité, absence ni provenance."
          dataMode={dataMode}
          presentation={presentation}
        />
        <div
          className="oph-retina-timeline"
          id={timelineId}
          role="listbox"
          aria-label="Examens d’imagerie rétinienne"
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="option"
              aria-selected={selectedIndex === index}
              data-quality={image.quality}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  move(index + 1);
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  move(index - 1);
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  move(0);
                }
                if (event.key === "End") {
                  event.preventDefault();
                  move(images.length - 1);
                }
              }}
            >
              <span className="oph-retina-timeline__dot" aria-hidden="true" />
              <strong>{image.date}</strong>
              <span>
                {image.modality} · {image.eye}
              </span>
              <small>
                {image.quality === "good" ? "✓" : image.quality === "insufficient" ? "△" : "⊘"}{" "}
                {image.qualityLabel}
              </small>
            </button>
          ))}
        </div>
        <div className="oph-retina__toolbar">
          <label>
            Comparer à
            <select
              value={comparisonIndex}
              onChange={(event) => setComparisonIndex(Number(event.target.value))}
            >
              {images.map((image, index) => (
                <option key={image.id} value={index}>
                  {image.date} · {image.modality} {image.eye}
                </option>
              ))}
            </select>
          </label>
          <button
            className="oph-text-button"
            type="button"
            aria-expanded={showTable}
            onClick={() => setShowTable((value) => !value)}
          >
            {showTable ? "Masquer" : "Afficher"} la liste accessible
          </button>
        </div>
        <div className="oph-retina__comparison">
          <RetinaViewer image={selected} dataMode={dataMode} />
          <RetinaViewer image={comparison} comparison dataMode={dataMode} />
        </div>
        {selected?.quality === "insufficient" || comparison?.quality === "insufficient" ? (
          <div className="oph-inline-notice" data-tone="warning" role="alert">
            <span aria-hidden="true">△</span>
            <span>
              <strong>Qualité insuffisante.</strong> La segmentation et les mesures restent
              visibles, mais doivent être interprétées avec prudence.
            </span>
          </div>
        ) : null}
        <div className="oph-retina__provenance">
          <span>Provenance active</span>
          <code>{selected?.source ?? "Source absente"}</code>
          <span>{selected?.note ?? "Aucune note"}</span>
        </div>
        {careEvents.length ? (
          <section className="oph-retina-care" aria-labelledby={`${timelineId}-care`}>
            <header>
              <p className="oph-kicker">Amsler & traitement</p>
              <h3 id={`${timelineId}-care`}>Trajectoire de prise en charge</h3>
            </header>
            <ol>
              {careEvents.map((event) => (
                <li key={event.id} data-kind={event.kind} data-status={event.status}>
                  <span aria-hidden="true">
                    {event.kind === "injection" ? "✣" : event.kind === "amsler" ? "▦" : "●"}
                  </span>
                  <time dateTime={event.date}>{event.date}</time>
                  <strong>{event.label}</strong>
                  <small>{event.status === "validated" ? "Final / validé" : "Préliminaire"}</small>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
        {showTable ? (
          <div className="oph-table-wrap">
            <table className="oph-table">
              <caption>
                Inventaire d’imagerie {dataMode === "synthetic" ? "synthétique" : "clinique"}
              </caption>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Œil</th>
                  <th>Modalité</th>
                  <th>Qualité</th>
                  <th>CST</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {images.map((image) => (
                  <tr key={image.id}>
                    <td>{image.date}</td>
                    <td>{image.eye}</td>
                    <td>{image.modality}</td>
                    <td>{image.qualityLabel}</td>
                    <td>{image.cst ? `${image.cst} µm` : "Indisponible"}</td>
                    <td>
                      <code>{image.source}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </article>
    </OphthalmologyDataBoundary>
  );
}
