# Goal — Odontology UI

## Objectif à créer dans Codex

> Construire toutes les stories du package `@clinical-ui/odontology`, FHIR R5 natif et totalement
> isolé du main applicatif : produire d'abord trois prototypes originaux avec le skill imagegen, puis
> implémenter les composants React, les fixtures synthétiques, les interactions et les tests dans les
> six combinaisons du contrat multithème Clinical UI.

## Périmètre métier capturé

Source : `PlanDefinition/clinical-specialty-odontology-2026-1`, version `2026.1`.

- Dent et face comme unités longitudinales : FDI, denture, état et transitions conservées.
- Diagnostic, imagerie et synthèse de santé orale.
- Plan de traitement phasé, séances et dépendances.
- Soins conservateurs, endodontie et extraction.
- Parodontologie à six sites, indices, récession, saignement et plaque.
- Prothèse, implant, orthodontie, pédodontie, prescription sûre et traçabilité documentaire.

## Modules et stories obligatoires

- `LongitudinalOdontogram` : permanente/temporaire/mixte, clavier, sélection dent/face, historique,
  densité desktop et défilement mobile.
- `ToothSurfaceInspector`, `PeriodontalChart`, `OralHealthSummary` avec alternatives tabulaires.
- `PhasedTreatmentPlan` : phases, séances, dépendances, réalisé/annulé/reporté et consentement.
- `EndodonticWorkbench`, `ProsthesisImplantTimeline`, `OrthodonticWorkbench`.
- `DentalImagingContext`, `ExtractionSafetyChecklist`, `DentalDocumentLifecycle`.
- Loading, vide, erreur, interdit, historique absent, notation reçue non convertie, conflit de saisie.

Les couleurs d'états dentaires sont toujours doublées par symbole et libellé ; aucune dent ne dépend
uniquement d'une couleur ou d'un survol.
