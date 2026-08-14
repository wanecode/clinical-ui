# Specialty worktrees

Clinical UI supports isolated specialty development while `main` remains
stable. A specialty branch is based on `main` and changes only its package,
prototype archive and clinical scope documentation.

```text
main
├── feature/ophthalmology
├── feature/ent
├── feature/odontology
├── feature/dermatology
├── feature/cardiology
├── feature/pediatrics
└── feature/gynecology-obstetrics
```

## Create a worktree

From a clean checkout:

```bash
scripts/create-domain-worktree.sh ophthalmology
scripts/create-domain-worktree.sh ent
scripts/create-domain-worktree.sh pediatrics
scripts/create-domain-worktree.sh gynecology-obstetrics
```

The default target is a sibling directory named `clinical-ui-<domain>`. An
explicit second argument can select another path.

## Scope contract

A specialty branch may modify only:

- `packages/<domain>/`;
- `prototypes/<domain>/`;
- `domains/<domain>/`.

Shared primitives belong in a separate focused change to `packages/core`,
`packages/fhir` or `packages/theme`.

Before handoff:

```bash
scripts/verify-domain-scope.sh ophthalmology
pnpm verify
```

Generated prototype images are design references, never clinical evidence. All
FHIR fixtures must remain deterministic, synthetic and visibly labeled.
