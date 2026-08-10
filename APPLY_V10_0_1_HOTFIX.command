#!/bin/zsh
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
TARGET="$HOME/Quetzal/Confidential/Spanish App/poco-a-poco-github"

echo "Poco a Poco v10.0.1 — Personas hotfix"
echo "Target: $TARGET"

if [ ! -d "$TARGET/.git" ]; then
  echo "Could not find existing Git repository:"
  echo "$TARGET"
  exit 1
fi

echo "1/5 Updating application..."
rsync -av --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude 'dist/' \
  "$HERE/" "$TARGET/"

cd "$TARGET"

echo "2/5 Installing dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "3/5 Security + production validation..."
npm audit
npm run build
npm audit

echo "4/5 Committing..."
git add -A
if git diff --cached --quiet; then
  echo "No code changes to commit."
else
  git commit -m "Poco a Poco v10.0.1 - Personas hotfix"
fi

echo "5/5 Publishing..."
git push

echo ""
echo "✓ v10.0.1 published."
echo "Wait for GitHub Actions to turn green, then fully close and reopen the iPhone PWA."
read "?Press Return to close."
