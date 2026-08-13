# Changelog

All notable changes are documented here. The project follows Semantic
Versioning once package distribution begins.

## 0.1.0-rc.8 — 2026-08-13

- Reduce the ocular-emergency headline to the same restrained hierarchy as the other clinical workbenches.
- Apply that hierarchy consistently in standalone and embedded presentation modes.

## 0.1.0-rc.7 — 2026-08-13

- Extend embedded presentation mode to every ophthalmology workbench.
- Make clinical-host rendering explicit: no substitute retina scan, corneal map, motility grid, implant option or emergency protocol is generated from missing data.
- Add partial clinical-host stories and regression tests for provenance-safe rendering.

## 0.1.0-rc.6 — 2026-08-13

- Rebalance ophthalmology workbench headings for dense clinical interfaces.
- Add an embedded presentation mode that removes redundant module titles inside host applications.
- Document and test both standalone Storybook and embedded application usage.

## 0.1.0-rc.5 — 2026-08-13

- Add an explicit host-theme token contract for independent application integration.
- Make ophthalmology data provenance safe for real clinical hosts: synthetic labels are opt-in.
- Preserve multiple FHIR sources when a bilateral summary aggregates several observations.
- Support eye-specific glaucoma targets and stages, optional field indices and host-provided vigilance states.
- Remove hard-coded clinical vigilance and suppress projection guidance when no projection is shown.

## 0.1.0-rc.4 — 2026-08-13

- Remove internal domain-goal documents and their automation references from the public snapshot.
- Keep the public domain matrix focused on implemented package coverage and clinical validation boundaries.
- Preserve the component APIs and launch-readiness assets introduced in RC.3.

## 0.1.0-rc.3 — 2026-08-13

- Add an adoption-focused README with an ophthalmology flagship and runnable quick start.
- Add reproducible launch media covering bilateral, longitudinal, emergency and multitheme states.
- Add a structured clinical-pattern review path for clinicians, informaticians and designers.
- Qualify the first tokenless npm release through GitHub Actions trusted publishing with provenance.

## 0.1.0-rc.2 — 2026-08-13

- Publish the nine `@clinical-ui/*` release-candidate packages through the npm `next` channel.
- Normalize relative ESM specifiers for direct Node.js consumption as well as bundler consumption.
- Add release manifest checks, packed-package smoke tests and an npm trusted-publishing workflow.

## 0.1.0-rc.1 — 2026-08-13

- Introduced the standalone FHIR R5-native Clinical UI workspace.
- Added Core, Theme, FHIR and deterministic testing packages.
- Added Ophthalmology, ORL, Odontology, Dermatology and Cardiology workbenches.
- Added 178 executable stories and 49 generated documentation entries.
- Qualified six theme combinations across desktop, tablet and mobile.
- Added reproducible visual QA and public Storybook delivery.
