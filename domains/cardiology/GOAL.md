# Goal — Cardiology UI

## Objectif à créer dans Codex

> Construire toutes les stories du package `@clinical-ui/cardiology`, FHIR R5 natif et totalement
> isolé du main applicatif : produire d'abord trois prototypes originaux avec le skill imagegen, puis
> implémenter les composants React, les fixtures synthétiques, les interactions et les tests dans les
> six combinaisons du contrat multithème Clinical UI.

## Périmètre métier capturé

Source : `PlanDefinition/clinical-specialty-cardiology-2026-2`, version `2026.2`.

- Socle clinique : référentiels versionnés, vigilances et décisions humaines explicites.
- Dossier patient : synthèse, risques, stades et scores avec données manquantes visibles.
- ECG, échocardiographie, MAPA, Holter et explorations ambulatoires.
- Thérapeutique et prescriptions ; parcours de suivi et trajectoires.
- Dispositifs/prothèses, actes spécifiques et cycle des comptes rendus.

## Modules et stories obligatoires

- `CardiovascularSummary` et `RiskScoreWorkbench` : modèle/version, facteurs, incomplet et non calculé.
- `EcgWorkbench` : tracés, mesures, interprétation structurée, source brute, qualité et provenance.
- `EchocardiographyWorkbench`, `AmbulatoryBloodPressureChart`, `HolterSummary`.
- `CardiacTrajectory`, `PrescriptionSafetyBoard`, `ImplantedDeviceTimeline`.
- `CardiologyReportLifecycle` et `CardiologyVigilanceBoard`.
- Loading, vide, erreur, interdit, signal absent, appareil indisponible, donnée importée, préliminaire,
  amendée, signée et critique ; alternative tabulaire pour toute courbe.

Les tracés, pressions, projections et seuils restent distingués visuellement et textuellement. Un
score dérivé expose toujours sa version, ses entrées et les données manquantes.
