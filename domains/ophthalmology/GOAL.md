# Goal — Ophthalmology UI

## Objectif à créer dans Codex

> Construire toutes les stories du package `@clinical-ui/ophthalmology`, FHIR R5 natif et totalement
> isolé du main applicatif : produire d'abord trois prototypes originaux avec le skill imagegen, puis
> implémenter les composants React, les fixtures synthétiques, les interactions et les tests dans les
> six combinaisons du contrat multithème Clinical UI.

## Périmètre métier capturé

Source de cadrage : `PlanDefinition/clinical-specialty-ophthalmology-2026-2`, version `2026.2`.

- Socle spécifique : latéralité OD/OG/binoculaire, asymétrie, conversion d'échelles, vigilances.
- Réfraction et acuité : loin/près, correction, trou sténopéique, réfraction, prescription optique.
- Examen clinique : tonométrie, pachymétrie, segment antérieur, gonioscopie, fond d'œil, pupilles.
- Glaucome : pression, RNFL/OCT, champ visuel, progression et trajectoires explicables.
- Rétine médicale : OCT maculaire, Amsler, imagerie, injections et suivi longitudinal.
- Cornée : kératométrie/topographie, surface oculaire, lentilles et trajectoires.
- Cataracte et chirurgie : biométrie, planification, procédure, audit réfractif, cycle documentaire.
- Pédiatrie et orthoptie : alignement, motilité, stéréoscopie, amblyopie et coopération.
- Urgences et aptitudes : trauma, douleur/baisse brutale, basse vision et orientation.

## Modules et stories obligatoires

- `BilateralClinicalRail` : nominal, monoculaire, asymétrie, données discordantes, compact/mobile.
- `VisualAcuityRefractionWorkbench` : saisie, lecture, conversion expliquée, incomplet, amendé.
- `GlaucomaProgressionWorkbench` : IOP, RNFL, champ visuel, projection distinguée de l'observé.
- `RetinaImagingTimeline` : OCT/fundus, comparaison, indisponible, qualité insuffisante, provenance.
- `CorneaWorkbench`, `CataractSurgeryPlanner`, `OrthopticsWorkbench`, `OcularEmergencySummary`.
- États transverses : loading, vide, erreur, interdit, partiel, préliminaire, final, critique.
- Tests clavier et interactions des grilles, courbes et comparaisons ; alternative tabulaire accessible.

Les images cliniques sont synthétiques. Le viewer emploie les tokens neutres `--viewer-*`, stables
dans tous les thèmes.
