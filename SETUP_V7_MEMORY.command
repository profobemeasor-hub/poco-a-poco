#!/bin/bash
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
TARGET="$(dirname "$HERE")/poco-a-poco-github"
WORKER="$TARGET/worker"
DB_NAME="poco-a-poco-memory"

echo "Poco a Poco v7 — AI Memory setup"
echo "Frontend: $TARGET"

if [ ! -d "$TARGET/.git" ]; then
  echo "Could not find existing Git repository at: $TARGET"
  exit 1
fi

echo "1/7 Copying v7 files..."
rsync -av --delete \
  --exclude '.git/' --exclude 'node_modules/' --exclude 'dist/' --exclude '.wrangler/' \
  "$HERE/" "$TARGET/"

echo "2/7 Installing and validating frontend..."
cd "$TARGET"
rm -rf node_modules package-lock.json
npm install
npm run build
npm audit

echo "3/7 Installing Worker tooling..."
cd "$WORKER"
rm -rf node_modules package-lock.json
npm install
npm audit

if ! npx wrangler whoami >/dev/null 2>&1; then
  echo "Cloudflare login required. Opening login..."
  npx wrangler login
fi

echo "4/7 Ensuring D1 memory database exists..."
if ! grep -q '"binding"[[:space:]]*:[[:space:]]*"MEMORY"' wrangler.jsonc; then
  echo "Creating Cloudflare D1 database: $DB_NAME"
  npx wrangler d1 create "$DB_NAME" --binding MEMORY --update-config --use-remote
else
  echo "D1 MEMORY binding already present. Reusing it."
fi

echo "5/7 Applying memory schema and deploying Worker..."
npx wrangler d1 execute "$DB_NAME" --remote --file=./schema.sql --yes
npx wrangler deploy

echo "6/7 Final frontend build..."
cd "$TARGET"
npm run build
npm audit

echo "7/7 Committing and publishing v7..."
git add .
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "Poco a Poco v7 - AI Memory"
  git push
fi

echo
echo "✓ v7 published."
echo "✓ AI memory is stored in Cloudflare D1."
echo "✓ Existing OPENAI_API_KEY and APP_PIN secrets are reused; you do not need to enter them again."
echo "Wait for GitHub Actions to turn green, then reopen the iPhone app."
read -r -p "Press Return to close."
