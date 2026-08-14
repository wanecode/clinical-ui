# Pediatrics domain

Clinical UI Pediatrics translates 40 governed capabilities into ten reusable
workbenches. Components are pure renderers; hosts own FHIR retrieval, identity,
authorization, persistence and clinical decisions.

| Workbench | Governed capabilities |
| --- | --- |
| `PediatricContextWorkbench` | PE-001, PE-002, PE-003, PE-070 |
| `PediatricsCockpit` | PE-004 |
| `GrowthDevelopmentWorkbench` | PE-010–PE-015 |
| `PediatricDoseSafetyWorkbench` | PE-020–PE-024 |
| `PediatricPreventionTimeline` | PE-030–PE-035 |
| `PediatricTriageWorkbench` | PE-040–PE-046 |
| `PediatricChronicCareTrajectory` | PE-050–PE-053 |
| `ChildFamilyContextWorkbench` | PE-060–PE-064 |
| `TransitionReadinessWorkbench` | PE-071 |
| `PediatricServiceCatalog` | PE-072 |

## Safety invariants

- Age and weight are dated inputs, never implicit constants.
- Growth curves identify their population, version and active age basis.
- Calculations expose inputs and units; the UI does not choose a dose.
- Patient, caregiver and confidential contexts remain distinct.
- Missing, preliminary, imported, derived and validated data stay explicit.
- Synthetic fixtures never become component defaults.
