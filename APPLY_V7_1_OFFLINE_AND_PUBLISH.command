#!/bin/zsh
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
TARGET="$HOME/Quetzal/Confidential/Spanish App/poco-a-poco-github"

echo "Poco a Poco v7.1 — remove paid AI and publish"
echo "Target: $TARGET"

if [ ! -d "$TARGET/.git" ]; then
  echo "Could not find the existing Git repository at:"
  echo "$TARGET"
  exit 1
fi

echo "1/5 Updating application files and removing AI backend files from the repo..."
rsync -av --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude 'dist/' \
  "$HERE/" "$TARGET/"

cd "$TARGET"

echo "2/5 Installing clean dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "3/5 Security and production validation..."
npm audit
npm run build
npm audit

echo "4/5 Committing..."
git add -A
if git diff --cached --quiet; then
  echo "No code changes to commit."
else
  git commit -m "Poco a Poco v7.1 - Offline Smart Coach"
fi

echo "5/5 Publishing..."
git push

echo ""
echo "✓ v7.1 published. OpenAI/Cloudflare AI dependencies are removed from the app."
echo "Wait for GitHub Actions to turn green, then reopen the iPhone app."
read "?Press Return to close."
