# Worktrees de spécialité

Clinical UI est développé comme une ligne de produit autonome. Le `main` applicatif peut continuer à
évoluer fortement : aucune branche de spécialité ne le fusionne, ne le rebase et n'importe son code.

## Topologie Git

```text
main (application active)
└── codex/clinical-ui-foundation        intégration Clinical UI
    ├── codex/clinical-ui-ophthalmology
    ├── codex/clinical-ui-ent
    ├── codex/clinical-ui-odontology
    ├── codex/clinical-ui-dermatology
    └── codex/clinical-ui-cardiology
```

Chaque branche métier part du même commit de fondation. Une spécialité ne modifie que :

- `clinical-ui/packages/<domaine>/` ;
- `clinical-ui/prototypes/<domaine>/` ;
- `clinical-ui/domains/<domaine>/`.

Le glob du workspace et celui de Storybook découvrent automatiquement le nouveau package et ses
stories. Il n'est donc pas nécessaire de modifier Storybook, les manifests racine ou les autres
packages. Si une primitive transverse manque, la demande est consignée dans
`clinical-ui/domains/<domaine>/CORE-REQUESTS.md`, puis traitée séparément dans la fondation.

## Création

Depuis le worktree de fondation propre et commité :

```bash
clinical-ui/scripts/create-domain-worktree.sh ophthalmology
clinical-ui/scripts/create-domain-worktree.sh ent
clinical-ui/scripts/create-domain-worktree.sh odontology
clinical-ui/scripts/create-domain-worktree.sh dermatology
clinical-ui/scripts/create-domain-worktree.sh cardiology
```

Le chemin par défaut est un worktree frère : `/home/mwane/dundal-clinical-ui-<domaine>`.

Dans un worktree métier, installer les dépendances sans réécrire le verrou commun :

```bash
cd clinical-ui
pnpm install --lockfile=false
```

Le lockfile est régénéré une seule fois dans la branche d'intégration après fusion des domaines.

## Contrat d'une session Codex métier

La session commence par lire `clinical-ui/domains/<domaine>/GOAL.md`, puis crée un goal Codex avec
l'objectif exact indiqué dans ce fichier. Elle suit cet ordre :

1. lire le périmètre métier capturé et les contrats FHIR R5 ;
2. utiliser le skill `imagegen` pour produire trois prototypes originaux ;
3. archiver prompts, images et décomposition dans `prototypes/<domaine>/` ;
4. implémenter les composants React dans `packages/<domaine>/` ;
5. développer toutes les stories et leurs interactions en isolation totale ;
6. vérifier les six thèmes, les états non nominaux, le clavier, le contraste, le mobile et les données
   synthétiques ;
7. exécuter types, tests, lint, build Storybook et smoke visuel ;
8. vérifier la portée Git avec `scripts/verify-domain-scope.sh <domaine>`.

Une image générée est une intention visuelle, jamais une source de vérité clinique. Les composants
restent pilotés par des view-models typés, eux-mêmes produits par des adaptateurs FHIR explicites.

## Intégration ultérieure

Les branches métier sont fusionnées dans `codex/clinical-ui-foundation`, pas dans `main`. Après les
cinq fusions :

```bash
cd clinical-ui
pnpm install --lockfile-only
pnpm typecheck
pnpm test
pnpm lint
pnpm build:storybook
```

La branche de fondation devenue branche d'intégration ne contient que `clinical-ui/**`. Elle peut
ensuite être fusionnée dans le `main` du moment comme un ajout circonscrit, même si le reste de
l'application a beaucoup changé.
