# Contributing

## Story-first workflow

1. Describe the clinical question the component helps answer.
2. Add or reuse synthetic FHIR fixtures.
3. Write the empty, incomplete and non-interpretable stories first.
4. Implement the smallest reusable specialty component.
5. Compose workbenches only from components already represented in Storybook.
6. Validate all six theme combinations and keyboard interaction.

Every story must be deterministic: freeze dates, avoid random identifiers and
never call a live service.

Before proposing an integration checkpoint, run `pnpm verify` and the visual
audit documented in the README. The visual audit must complete without document
overflow, runtime errors, failed requests or empty renders. Review its sentinel
screenshots manually; a structurally valid screen can still have poor hierarchy.

## Required states

At minimum, clinically meaningful components document:

- nominal;
- empty;
- incomplete;
- non-comparable or non-interpretable where applicable;
- warning and critical states where applicable;
- long content and constrained viewport;
- light/dark behavior and every supported palette.

## Prototype policy

The domain workflow starts with image prototypes generated through the Codex
`imagegen` skill. Store the selected prototypes and their exact prompts under
`prototypes/<domain>/`. Images are design inputs, not source data and not
clinical truth.
