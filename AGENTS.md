# Clinical UI agent contract

## Isolation

- Treat the repository root as the standalone Clinical UI boundary.
- Never import source code or configuration from outside this repository.
- Never edit the host repository manifests, lockfile, application code, API code, or generated FHIR IG.
- Use public FHIR R5 shapes and semantic CSS variables as the only integration contracts.

## Specialty branches

On `feature/<domain>`, changes are limited to:

- `packages/<domain>/`;
- `prototypes/<domain>/`;
- `domains/<domain>/`.

Do not change the shared lockfile or transverse packages. Record a missing transverse primitive in
`domains/<domain>/CORE-REQUESTS.md` for a separate foundation change.

The workflow is prototype-first: use the `imagegen` skill, preserve the prompts and generated images,
then decompose the accepted direction into React components and Storybook stories. Generated medical
images and every FHIR fixture must be explicitly synthetic.

## Definition of done

- Every public component has nominal and non-nominal stories.
- Curves, maps, grids, images and laterality have non-color and accessible alternatives.
- Observed, imported, derived, projected, preliminary and validated data remain distinguishable.
- Stories pass interaction and a11y tests in all six theme combinations.
- `pnpm verify` passes on Node 24.12.
- `scripts/verify-domain-scope.sh <domain>` passes before handoff of a specialty branch.
