# Décomposition retenue

Les prototypes convergent vers un langage d'« atelier clinique éditorial » : densité maîtrisée,
bordures franches, typographie de données tabulaires et statuts toujours doublés d'un libellé ou
d'un motif. Les images sont des explorations, pas des spécifications pixel-perfect.

## Modules React

- `CardiovascularSummary` : contexte, risques, stades, vigilances et décision humaine.
- `RiskScoreWorkbench` : modèle/version, entrées, données manquantes et calcul explicable.
- `EcgWorkbench` : tracé, calibration, mesures, interprétation, qualité et provenance.
- `EchocardiographyWorkbench` : mesures, observations, comparaison et cycle de validation.
- `AmbulatoryBloodPressureChart` et `HolterSummary` : courbes/événements et tables alternatives.
- `CardiacTrajectory` : événements observés, importés, dérivés et projetés.
- `PrescriptionSafetyBoard` : prescription, interactions, vigilances et confirmation humaine.
- `ImplantedDeviceTimeline` : implantation, contrôles et indisponibilité de l'appareil.
- `CardiologyReportLifecycle` : préliminaire, amendé et signé avec provenance.
- `CardiologyVigilanceBoard` : criticité, responsable, échéance et décision explicite.

## Primitives internes au domaine

- coque de workbench et états asynchrones/non autorisés ;
- badges de provenance (`observé`, `importé`, `dérivé`, `projeté`) avec motif et texte ;
- panneau de décision humaine ;
- bascule courbe/table accessible ;
- graphiques SVG portant un titre, une description et des styles de lignes non chromatiques ;
- tables responsives avec unités conservées dans les en-têtes ou cellules.

## Principes retenus

- Le modèle multithème reste piloté uniquement par les variables sémantiques Clinical UI.
- Les scores ne masquent jamais leur version, leurs entrées ou leurs données manquantes.
- Les signaux, pressions, projections et seuils restent distinguables sans couleur.
- Les décisions thérapeutiques critiques restent attribuées à un humain et confirmables.
- Toutes les fixtures FHIR R5 portent un tag `synthetic` et des identifiants non productifs.
