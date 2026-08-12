#!/usr/bin/env bash
set -euo pipefail

domain_slug="${1:-}"
requested_target="${2:-}"
foundation_branch="${CLINICAL_UI_FOUNDATION_BRANCH:-codex/clinical-ui-foundation}"

case "$domain_slug" in
  ophthalmology|ent|odontology|dermatology|cardiology) ;;
  *)
    echo "Usage: $0 {ophthalmology|ent|odontology|dermatology|cardiology} [target-path]" >&2
    exit 64
    ;;
esac

repository_root="$(git rev-parse --show-toplevel)"
repository_parent="$(dirname "$repository_root")"
target_path="${requested_target:-$repository_parent/dundal-clinical-ui-$domain_slug}"
domain_branch="codex/clinical-ui-$domain_slug"

if ! git show-ref --verify --quiet "refs/heads/$foundation_branch"; then
  echo "Missing foundation branch: $foundation_branch" >&2
  exit 65
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "The current worktree must be clean before creating a domain worktree." >&2
  exit 66
fi

if git show-ref --verify --quiet "refs/heads/$domain_branch"; then
  echo "Domain branch already exists: $domain_branch" >&2
  exit 67
fi

if [[ -e "$target_path" ]]; then
  echo "Target already exists: $target_path" >&2
  exit 68
fi

git worktree add -b "$domain_branch" "$target_path" "$foundation_branch"

echo "Created $domain_branch"
echo "Worktree: $target_path"
echo "Goal: $target_path/clinical-ui/domains/$domain_slug/GOAL.md"
