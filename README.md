# Clinical UI

[![CI](https://github.com/wanecode/clinical-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/wanecode/clinical-ui/actions/workflows/ci.yml)
[![CodeQL](https://github.com/wanecode/clinical-ui/actions/workflows/codeql.yml/badge.svg)](https://github.com/wanecode/clinical-ui/actions/workflows/codeql.yml)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785)](https://wanecode.github.io/clinical-ui/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

Clinical UI is a FHIR R5-native React component system for specialist clinical
workstations. Storybook is its executable specification: every component is
developed in isolation, against deterministic synthetic FHIR fixtures, across
all supported palettes and color modes.

The project is a standalone workspace. It does not import application routes,
API clients, authentication state, or private host-application components.

Explore the public component catalog at
[wanecode.github.io/clinical-ui](https://wanecode.github.io/clinical-ui/).

## Packages

- `@clinical-ui/theme`: shadcn/tweakcn-compatible semantic token contract.
- `@clinical-ui/core`: accessible, specialty-neutral clinical components.
- `@clinical-ui/fhir`: pure FHIR R5-to-view-model adapters.
- `@clinical-ui/testing`: deterministic synthetic FHIR fixtures and test tools.
- `@clinical-ui/ophthalmology`, `ent`, `odontology`, `dermatology`, `cardiology`: isolated specialty
  component systems.
- `@clinical-ui/storybook`: the public development and documentation surface.

Specialty packages are added as peers of these packages, never inside the
Storybook app.

Specialty development can use sibling worktrees based on `main`. See
[`DOMAIN-WORKTREES.md`](./DOMAIN-WORKTREES.md) and the clinical scope contracts
under [`domains/`](./domains/).

## Release status

The current checkpoint is `v0.1.0-rc.1`. Source code and Storybook are public.
The `@clinical-ui/*` packages are not yet distributed through npm: publishing
will begin only after ownership and governance of that npm scope are verified.

## Local development

The workspace requires Node 24.12 and pnpm 11.20.

```bash
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

Visual QA requires the Storybook development server and Python Playwright:

```bash
python3 -m pip install -r requirements-qa.txt
python3 -m playwright install chromium
pnpm storybook
# In another terminal:
pnpm qa:visual
```

The audit covers every executable story at desktop, tablet and mobile widths,
then captures a cross-domain sentinel set in all six palette/mode combinations.
Evidence is written to `.artifacts/visual-qa/` and stays outside Git.

## Clinical safety boundary

Clinical UI renders and explains supplied data. It does not invent clinical
measurements, infer diagnoses, or silently apply thresholds. Demonstration data
must be synthetic and labeled as such. Generated prototype imagery is design
reference only and must never be represented as validated clinical evidence.

## Licensing

Clinical UI is licensed under Apache-2.0. The explicit patent grant and contribution terms make the
boundary suitable for a reusable clinical component ecosystem. The Storybook application is a public
documentation surface but remains marked `private` in npm metadata so it cannot be published as a
package accidentally.
