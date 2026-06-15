#!/usr/bin/env bash
# scaffold-app.sh — create the Next.js app at the repo root (stage 04), once.
#
# Idempotent: if the repo already has a Next.js app (package.json or app/), this is
# a no-op. We are ALWAYS inside the customer's repo already — this script never
# creates or initialises a git repository.
#
# It scaffolds into a temp dir then copies in, so the existing pipeline/ machinery,
# CLAUDE.md and .claude/ are never clobbered.
#
# NOTE: create-next-app / shadcn flags drift between versions. The build agent
# should re-read the `next-best-practices` skill and adjust flags to the installed
# version if this errors. Prefer pnpm (this org uses pnpm + turbo).

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

if [ -f "package.json" ] || [ -d "app" ]; then
  echo "scaffold: Next.js app already present at $REPO_ROOT — skipping."
  exit 0
fi

# Pick a package manager (prefer pnpm).
if command -v pnpm >/dev/null 2>&1; then
  PM_FLAG="--use-pnpm"
elif command -v npm >/dev/null 2>&1; then
  PM_FLAG="--use-npm"
else
  echo "scaffold: no pnpm/npm found on PATH." >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "scaffold: running create-next-app (App Router, TS, Tailwind, ESLint)…"
npx --yes create-next-app@latest "$TMP/app" \
  --ts \
  --tailwind \
  --app \
  --eslint \
  --src-dir=false \
  --import-alias "@/*" \
  --disable-git \
  "$PM_FLAG" \
  --yes

# Copy generated files into the repo root without overwriting pipeline machinery.
echo "scaffold: copying app into repo root…"
if command -v rsync >/dev/null 2>&1; then
  rsync -a \
    --exclude '.git' \
    --exclude 'CLAUDE.md' \
    --exclude 'pipeline/' \
    --exclude '.claude/' \
    "$TMP/app/" "$REPO_ROOT/"
else
  # Fallback without rsync: copy each top-level entry, mirroring the rsync excludes.
  # NEVER touch "$REPO_ROOT/.git" — we are already inside the customer's repo and must
  # not create, clobber, or delete its history (see CLAUDE.md).
  ( cd "$TMP/app" && find . -mindepth 1 -maxdepth 1 \
      ! -name '.git' ! -name 'CLAUDE.md' ! -name 'pipeline' ! -name '.claude' \
      -exec cp -R {} "$REPO_ROOT/" \; )
fi

# Initialise shadcn/ui (defaults; the build stage then adds components as needed).
echo "scaffold: initialising shadcn/ui…"
npx --yes shadcn@latest init -d || \
  echo "scaffold: shadcn init needs attention — run it manually and continue."

echo "scaffold: done. Next.js app scaffolded at $REPO_ROOT."
echo "scaffold: install components with 'npx shadcn@latest add <name>' during build."
