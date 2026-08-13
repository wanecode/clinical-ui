# Clinical UI 0.1.0 RC quality report

Audit date: 2026-08-13

Published repository: `wanecode/clinical-ui`

Baseline before QA fixes: `7e48454`

Release-candidate checkpoint: `v0.1.0-rc.1`

## Decision

**GO for a local `0.1.0-rc.1` integration checkpoint.**

This decision qualifies the isolated Clinical UI component system and its
Storybook. It is not a medical-device validation and does not authorize use of
synthetic fixtures as clinical evidence.

## Scope

- Foundations, Core and FHIR R5 context.
- Ophthalmology, ORL, Odontology, Dermatology and Cardiology.
- 227 Storybook index entries: 178 executable stories and 49 documentation
  entries.
- Three responsive viewports: 1440 × 1000, 1024 × 768 and 390 × 844.
- Six theme combinations: `clinical`, `ocean` and `sage`, each in light and
  dark mode.
- Chromium through Python Playwright 1.56.0.

## Automated evidence

The full visual sweep completed **678/678 checks**:

- 534 responsive checks: 178 stories × 3 viewports in the default theme.
- 144 multitheme baselines: 8 cross-domain sentinels × 6 themes × 3 viewports.
- zero document-level horizontal overflow;
- zero browser console errors;
- zero page exceptions;
- zero failed network requests;
- zero empty renders;
- zero warnings.

The repository verification also completed successfully:

- package builds and TypeScript checks;
- unit tests;
- 294 Storybook test files and 1,068 story tests across the six themes;
- Storybook accessibility rules configured as errors;
- Biome lint;
- isolation boundary check;
- static Storybook production build.

Generated screenshots and the machine-readable report are stored locally under
`.artifacts/visual-qa/`. They are intentionally not versioned.

## Finding resolved during the audit

The preliminary ORL audiogram created 180 px of document-level horizontal
overflow on mobile. The clinical table and plot already used intentional local
scroll containers; the actual cause was visually hidden accessible text whose
absolute position escaped the viewport. The shared ORL visually-hidden pattern
now anchors and clips that content without removing it from assistive
technology.

The theme-contract story contains six nested theme scopes by design. The audit
now targets the outer Storybook viewport scope so this composition is measured
without selector ambiguity.

## Manual visual review

Representative captures were reviewed across domains, modes and sizes. The
review confirmed:

- stable clinical hierarchy and semantic state colors across all palettes;
- readable bilateral reflow in ophthalmology;
- intentional local scrolling for dense audiology and dental instruments;
- preserved provenance, preliminary and human-validation cues;
- coherent dark surfaces for image, signal and diagnostic viewers;
- usable mobile stacking without document-level lateral drift.

Long integrated demonstration stories remain intentionally vertical. Their
atomic workbenches are separately available and testable in Storybook.

## Residual limits

- The baseline currently detects structural regressions and supports manual
  screenshot review; pixel-diff thresholds are not yet enforced in CI.
- Automated browser coverage is Chromium-only.
- Screen-reader and real touch-device sessions still require manual acceptance.
- All fixtures and clinical images are synthetic.
