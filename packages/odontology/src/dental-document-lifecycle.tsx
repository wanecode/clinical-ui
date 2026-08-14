import { DentalPanel, DentalStateBoundary } from "./primitives";
import type { DentalDocumentStatus, DentalDocumentVersion, DentalStateProps } from "./types";

const documentStatus: Record<DentalDocumentStatus, { symbol: string; label: string }> = {
  draft: { symbol: "✎", label: "Brouillon" },
  preliminary: { symbol: "△", label: "À valider" },
  validated: { symbol: "✓", label: "Validé" },
  signed: { symbol: "⌁", label: "Signé" },
  superseded: { symbol: "↻", label: "Supersédé" },
  "entered-in-error": { symbol: "×", label: "Saisi par erreur" },
};

export interface DentalDocumentLifecycleProps extends DentalStateProps {
  documents: DentalDocumentVersion[];
}

export function DentalDocumentLifecycle({
  documents,
  state,
  stateMessage,
  dataMode = "clinical",
  presentation = "standalone",
}: DentalDocumentLifecycleProps) {
  return (
    <DentalPanel
      eyebrow="Traçabilité documentaire"
      title="Cycle de vie des documents"
      description="Les versions remplacées restent identifiables sans être confondues avec la version courante."
      className="od-panel--documents"
      dataMode={dataMode}
      presentation={presentation}
    >
      <DentalStateBoundary state={state} stateMessage={stateMessage}>
        <ol className="od-document-flow">
          {documents.map((document, index) => {
            const status = documentStatus[document.status];
            return (
              <li key={document.id} data-status={document.status}>
                <div className="od-document-flow__paper" aria-hidden="true">
                  <span>{document.version}</span>
                </div>
                <div className="od-document-flow__content">
                  <span className="od-document-status" data-status={document.status}>
                    <span aria-hidden="true">{status.symbol}</span>
                    {status.label}
                  </span>
                  <h3>{document.title}</h3>
                  <dl>
                    <div>
                      <dt>Version</dt>
                      <dd>{document.version}</dd>
                    </div>
                    <div>
                      <dt>Auteur</dt>
                      <dd>{document.author}</dd>
                    </div>
                    <div>
                      <dt>Date</dt>
                      <dd>
                        <time dateTime={document.date}>{document.date}</time>
                      </dd>
                    </div>
                    {document.replaces ? (
                      <div>
                        <dt>Remplace</dt>
                        <dd>{document.replaces}</dd>
                      </div>
                    ) : null}
                  </dl>
                  <code>{document.resourceRef}</code>
                </div>
                {index < documents.length - 1 ? (
                  <span className="od-document-flow__arrow" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
        <details className="od-table-alternative">
          <summary>Registre tabulaire des versions</summary>
          <table>
            <caption>Versions documentaires dentaires</caption>
            <thead>
              <tr>
                <th scope="col">Version</th>
                <th scope="col">Document</th>
                <th scope="col">Statut</th>
                <th scope="col">Auteur</th>
                <th scope="col">Remplace</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.id}>
                  <th scope="row">v{document.version}</th>
                  <td>{document.title}</td>
                  <td>
                    {documentStatus[document.status].symbol} {documentStatus[document.status].label}
                  </td>
                  <td>{document.author}</td>
                  <td>{document.replaces ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </DentalStateBoundary>
    </DentalPanel>
  );
}
