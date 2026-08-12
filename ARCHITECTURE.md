# Architecture

## Dependency direction

```text
FHIR R5 resources
       │
       ▼
@clinical-ui/fhir ──► typed view models
                              │
                              ▼
                    @clinical-ui/core
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
       Ophtha UI            ORL UI            Cardio UI …
          └───────────────────┬───────────────────┘
                              ▼
                         Workbenches
```

Components are pure renderers of view models. FHIR adapters are pure functions.
Only integration applications may fetch resources or access routing and
authentication state.

## Isolation rules

1. Everything required to install, build and test lives below `clinical-ui/`.
2. No package imports `apps/web`, `apps/api`, or an `@ecomed/*` package.
3. Story discovery is glob-based; a specialty never edits central Storybook
   configuration merely to add stories.
4. Cross-specialty behavior belongs in `core`; clinical geometry remains in its
   specialty package.
5. Every public package declares React as a peer dependency.
6. Fixtures are deterministic, synthetic, and composed from FHIR R5 resources.
7. Domain worktrees modify only their own package, prototype folder and domain
   documentation.

## Theme compatibility

The token names intentionally match the host application's shadcn/tweakcn
contract (`--background`, `--card`, `--primary`, `--ring`, semantic clinical
families, chart tokens and stable viewer tokens). Components contain no literal
operational colors.

Compatibility is pinned to the ecoMed24 theme snapshot dated `2026-08-12` and
verified by `packages/theme/src/theme-contract.test.ts`. This is a compatibility
contract, not a source dependency: a later host theme can be compared and
adopted without merging application code into Clinical UI.

`ClinicalThemeScope` makes the library standalone in Storybook. In an
integrating application, components can instead inherit the application's
existing variables without a provider.

Color is never the sole carrier of meaning. Clinical states also use text,
icons, border styles, line patterns or explicit legends.
