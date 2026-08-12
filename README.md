# Clinical UI

Clinical UI is a FHIR R5-native React component system for specialist clinical
workstations. Storybook is its executable specification: every component is
developed in isolation, against deterministic synthetic FHIR fixtures, across
all supported palettes and color modes.

The project deliberately lives in a self-contained workspace. It does not
import application routes, API clients, authentication state, or private
ecoMed24 components. This directory can later be extracted into its own Git
repository without rewriting package boundaries.

## Packages

- `@clinical-ui/theme`: shadcn/tweakcn-compatible semantic token contract.
- `@clinical-ui/core`: accessible, specialty-neutral clinical components.
- `@clinical-ui/fhir`: pure FHIR R5-to-view-model adapters.
- `@clinical-ui/testing`: deterministic synthetic FHIR fixtures and test tools.
- `@clinical-ui/ophthalmology`, `ent`, `odontology`, `dermatology`, `cardiology`: isolated specialty
  package shells, each completed in its own worktree.
- `@clinical-ui/storybook`: the public development and documentation surface.

Specialty packages are added as peers of these packages, never inside the
Storybook app.

Specialty development uses sibling worktrees based on this foundation branch.
See [`DOMAIN-WORKTREES.md`](./DOMAIN-WORKTREES.md) and the goal contracts under
[`domains/`](./domains/).

## Local development

The workspace requires Node 24, matching the host repository contract.

```bash
cd clinical-ui
pnpm install
pnpm storybook
```

Validation:

```bash
pnpm typecheck
pnpm test
pnpm test:stories
pnpm build:storybook
pnpm lint
pnpm check:isolation
pnpm verify
```

## Clinical safety boundary

Clinical UI renders and explains supplied data. It does not invent clinical
measurements, infer diagnoses, or silently apply thresholds. Demonstration data
must be synthetic and labeled as such. Generated prototype imagery is design
reference only and must never be represented as validated clinical evidence.

## Licensing

Clinical UI is licensed under Apache-2.0. The explicit patent grant and contribution terms make the
boundary suitable for a reusable clinical component ecosystem. The Storybook host remains private as a
development application; the library packages are publishable.
