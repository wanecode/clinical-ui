# Gynecology and obstetrics domain

Clinical UI Gynecology Obstetrics translates 40 governed capabilities into
eleven reusable workbenches. Components are pure renderers; hosts own FHIR
retrieval, authorization, persistence and clinical decisions.

| Workbench | Governed capabilities |
| --- | --- |
| `PregnancyEpisodeContext` | GO-001, GO-002, GO-003, GO-062 |
| `GynecologyObstetricsCockpit` | GO-004, GO-060, GO-061 |
| `ReproductiveHealthWorkbench` | GO-010–GO-019 |
| `PrenatalTimeline` | GO-020, GO-021, GO-022, GO-026–GO-030 |
| `FetalAssessmentWorkbench` | GO-023, GO-024, GO-025 |
| `LaborPartogram` | GO-040, GO-041 |
| `BirthDecisionBoard` | GO-042, GO-045 |
| `HemorrhageSafetyWorkbench` | GO-043, GO-044 |
| `NewbornTransitionWorkbench` | GO-046 |
| `PostpartumWorkbench` | GO-050–GO-053 |
| `GynecologyObstetricsServiceCatalog` | GO-063 |

## Safety invariants

- Gestational age names its dating source and revision history.
- Mother, fetus and newborn retain distinct identifiers and provenance.
- A structure not seen is never rendered as normal.
- Monitoring and decision clocks expose the observation time and owner.
- Sensitive information can be represented without exposing its content.
- Synthetic fixtures never become component defaults.
