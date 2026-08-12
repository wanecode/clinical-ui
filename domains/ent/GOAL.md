# Goal — ENT / ORL UI

## Objectif à créer dans Codex

> Construire toutes les stories du package `@clinical-ui/ent`, FHIR R5 natif et totalement isolé du
> main applicatif : produire d'abord trois prototypes originaux avec le skill imagegen, puis
> implémenter les composants React, les fixtures synthétiques, les interactions et les tests dans les
> six combinaisons du contrat multithème Clinical UI.

## Périmètre métier capturé

Source : `PlanDefinition/clinical-specialty-ent-2026-1`, version `2026.1`.

- Socle ORL : anatomie, côté, durée, facteurs de risque, drapeaux rouges, questionnaires.
- Audition : audiométrie tonale point par point, masquage/non-réponse, voix, tympanométrie, réflexes,
  OEA, PEA, appareils et tendances.
- Équilibre et vertiges ; nez et sinus ; voix et déglutition ; sommeil ; pédiatrie.
- Cancérologie cervico-faciale : lésions, stades, prélèvements et coordination.
- Sécurité et chirurgie : endoscopie, implants, postopératoire, urgences et désinfection des endoscopes.

## Modules et stories obligatoires

- `AudiogramWorkbench` avec conventions droite/gauche, voies, masquage, flèche non-réponse, PTA
  gouvernée et table textuelle équivalente.
- `MiddleEarWorkbench` : tympanogramme, réflexes, séries incomplètes, qualité et appareil.
- `EntEndoscopyViewer` : acquisition, latéralité, disponibilité, consentement et provenance.
- `VestibularWorkbench`, `VoiceSwallowingWorkbench`, `RhinologyWorkbench`, `SleepWorkbench`.
- `EntOncologyTimeline`, `EntSurgerySafetyPanel`, `EndoscopeTraceability`.
- Loading, vide, erreur, interdit, partiel, non calculable, préliminaire, signé, vigilance acquittée.

Aucun résultat dérivé (PTA, écart air-os, indication) n'est présenté comme un diagnostic automatique.
