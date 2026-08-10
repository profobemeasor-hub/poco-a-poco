#!/bin/bash
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
TARGET="$(dirname "$HERE")/poco-a-poco-github"
if [ ! -d "$TARGET/.git" ]; then
  echo "Could not find the existing poco-a-poco-github repository beside this folder."
  echo "Expected: $TARGET"
  read -r -p "Press Return to close."
  exit 1
fi

echo "Poco a Poco v6 — Live AI Coach setup"
echo "Frontend: $TARGET"
echo

echo "1/6 Copying v6 application files..."
rsync -av --delete --exclude='.git' --exclude='node_modules' --exclude='dist' "$HERE/" "$TARGET/"

cd "$TARGET"
echo "2/6 Validating the frontend production build..."
rm -rf node_modules package-lock.json
npm install
npm run build

echo
echo "3/6 Preparing the secure Cloudflare AI Worker..."
cd "$TARGET/worker"
npm install

if ! npx wrangler whoami >/dev/null 2>&1; then
  echo "Cloudflare login will open in your browser. A free Cloudflare account is sufficient for the Worker setup."
  npx wrangler login
fi

# Deploy source once so the Worker exists before secrets are attached.
echo "Creating/updating the Worker..."
npx wrangler deploy >/tmp/poco-worker-first.txt 2>&1 || { cat /tmp/poco-worker-first.txt; exit 1; }
cat /tmp/poco-worker-first.txt

echo
echo "4/6 Adding secrets. Nothing you type here is written into the Git repository."
read -s -p "Paste your OpenAI API key: " OPENAI_KEY
echo
if [ -z "$OPENAI_KEY" ]; then echo "OpenAI key cannot be empty."; exit 1; fi
printf '%s' "$OPENAI_KEY" | npx wrangler secret put OPENAI_API_KEY >/dev/null
unset OPENAI_KEY

read -s -p "Choose a private AI PIN for your phone (6+ characters): " APP_PIN
echo
if [ ${#APP_PIN} -lt 6 ]; then echo "PIN must be at least 6 characters."; exit 1; fi
printf '%s' "$APP_PIN" | npx wrangler secret put APP_PIN >/dev/null
unset APP_PIN

echo "5/6 Final Worker deployment..."
npx wrangler deploy 2>&1 | tee /tmp/poco-worker-final.txt
WORKER_URL="$(grep -Eo 'https://[^ ]+\.workers\.dev' /tmp/poco-worker-final.txt | tail -1 || true)"
if [ -z "$WORKER_URL" ]; then
  echo
  echo "I could not automatically detect the workers.dev URL."
  read -r -p "Paste the Worker HTTPS URL shown above: " WORKER_URL
fi
WORKER_URL="${WORKER_URL%/}"
if [[ "$WORKER_URL" != https://* ]]; then echo "A valid HTTPS Worker URL is required."; exit 1; fi

cd "$TARGET"
printf "export const AI_WORKER_URL = '%s';\n" "$WORKER_URL" > src/config.js

echo "6/6 Rebuilding and publishing GitHub Pages..."
npm run build
git add .
if git diff --cached --quiet; then
  echo "No Git changes to publish."
else
  git commit -m "Poco a Poco v6 - Live AI Coach"
  git push
fi

echo
echo "✓ v6 published."
echo "AI gateway: $WORKER_URL"
echo "Wait for GitHub Actions to turn green, then reopen the iPhone app."
echo "On first AI Coach use, enter the private PIN you just created."
read -r -p "Press Return to close."
