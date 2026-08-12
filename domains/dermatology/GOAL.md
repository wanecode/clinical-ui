# Goal — Dermatology UI

## Objectif à créer dans Codex

> Construire toutes les stories du package `@clinical-ui/dermatology`, FHIR R5 natif et totalement
> isolé du main applicatif : produire d'abord trois prototypes originaux avec le skill imagegen, puis
> implémenter les composants React, les fixtures synthétiques, les interactions et les tests dans les
> six combinaisons du contrat multithème Clinical UI.

## Périmètre métier capturé

Source : `PlanDefinition/clinical-specialty-dermatology-2026-1`, version `2026.1`.

- Socle : identité persistante d'une lésion, site codé, repère anatomique et état longitudinal.
- Examen et sémiologie : type, distribution, dimensions, couleur, surface, symptômes et phototype.
- Lésions pigmentées, dermatoses inflammatoires, scores et surfaces datés.
- Infectiologie, plaies, brûlures et maladies tropicales négligées.
- Thérapeutique, procédures, populations particulières, coordination et vigilances.

## Modules et stories obligatoires

- `BodyLesionMap` : vues antérieure/postérieure/latérale, placement clavier, regroupement, zoom et liste
  textuelle équivalente.
- `LesionLongitudinalCard`, `DermoscopicComparisonViewer`, `PhotographyQualityGate`.
- `WoundTrajectory`, `InflammatoryScoreWorkbench`, `PigmentedLesionWorkbench`.
- `DermatologyProcedureTimeline`, `TreatmentSafetyPanel`, `DermatologyVigilanceBoard`.
- Consentement image, provenance, image manquante, qualité insuffisante, phototype non renseigné,
  loading, vide, erreur, interdit, préliminaire, amendé et critique.

Toutes les photographies et dermoscopies sont générées/synthétiques, marquées comme telles et
accompagnées d'un mode sans image exploitable.
