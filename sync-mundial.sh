#!/usr/bin/env zsh
set -e

REPO_ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

cd "$REPO_ROOT/mundial"
git fetch origin
BEHIND=$(git log --oneline HEAD..origin/main)

if [[ -z "$BEHIND" ]]; then
  echo "mundial is already up to date."
  exit 0
fi

echo "Pulling:"
echo "$BEHIND"
git pull origin main

cd "$REPO_ROOT"
SUMMARY=$(cd mundial && git log --oneline -1)
git add mundial
git commit -m "mundial: update submodule — ${SUMMARY}

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin master
