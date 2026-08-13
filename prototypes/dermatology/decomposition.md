# Prototype decomposition

The implementation combines the three directions into a coherent dermatology workbench language:
paper-like mapping surfaces for spatial identity, a neutral dark light table for clinical images, and
graph-paper plots for measured trajectories. All production components consume semantic Clinical UI
tokens; no prototype pixels are shipped in the React package.

| Prototype region | Public component | Reusable implementation units |
| --- | --- | --- |
| Lesion atlas, views, markers, registry | `BodyLesionMap` | view tabs, keyboard placement cursor, zoom toolbar, marker cluster, equivalent lesion table |
| Longitudinal evidence rail | `LesionLongitudinalCard` | identity header, dated measurements, observed/imported/derived labels, amendment trail |
| Dermoscopy light table | `DermoscopicComparisonViewer` | synthetic-image viewport, before/after selector, image-off alternative, consent and provenance bands |
| Quality checklist | `PhotographyQualityGate` | coded checks, pass/warn/fail symbols, missing-image and forbidden states |
| Wound graph paper | `WoundTrajectory` | accessible SVG plot, dated table, observed/derived/projected legend and textual trend |
| Score small multiples | `InflammatoryScoreWorkbench` | PASI/SCORAD/DLQI summaries, body-surface dates, missing-phototype callout |
| ABCDE evidence column | `PigmentedLesionWorkbench` | coded ABCDE findings, risk summary, linked lesion identity and escalation action |
| Episode/procedure ledger | `DermatologyProcedureTimeline` | chronological entries, preliminary/amended/validated badges, amendment detail |
| Laboratory due-date ledger | `TreatmentSafetyPanel` | drug monitoring rows, overdue and planned checks, special-population context |
| Operational warning column | `DermatologyVigilanceBoard` | critical/warning/information items, antimicrobial and tropical/infectious vigilance, coordination actions |

Common state primitives cover loading, empty, error, forbidden, missing image, insufficient image
quality, missing phototype, preliminary, amended and critical presentations. Every image-bearing component
also exposes a usable no-image rendering.
