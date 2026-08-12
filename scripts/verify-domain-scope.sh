#!/usr/bin/env bash
set -euo pipefail

domain_slug="${1:-}"
foundation_ref="${2:-codex/clinical-ui-foundation}"

case "$domain_slug" in
  ophthalmology|ent|odontology|dermatology|cardiology) ;;
  *)
    echo "Usage: $0 {ophthalmology|ent|odontology|dermatology|cardiology} [foundation-ref]" >&2
    exit 64
    ;;
esac

unexpected_paths="$(
  {
    git diff --name-only "$foundation_ref...HEAD" --
    git diff --name-only --
    git diff --cached --name-only --
  } | sort -u | while IFS= read -r changed_path; do
    case "$changed_path" in
      "clinical-ui/packages/$domain_slug/"*|"clinical-ui/prototypes/$domain_slug/"*|"clinical-ui/domains/$domain_slug/"*) ;;
      *) printf '%s\n' "$changed_path" ;;
    esac
  done
)"

if [[ -n "$unexpected_paths" ]]; then
  echo "Changes escape the $domain_slug domain boundary:" >&2
  printf '%s\n' "$unexpected_paths" >&2
  exit 1
fi

echo "Domain scope verified: $domain_slug"
