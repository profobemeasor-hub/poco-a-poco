#!/bin/zsh
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
TARGET="$HOME/Quetzal/Confidential/Spanish App/poco-a-poco-github"

echo "Poco a Poco v14.1 — Beginner First + Berlitz Reinforcement"
echo "Target: $TARGET"

if [ ! -d "$TARGET/.git" ]; then
  echo "Could not find existing Git repository: $TARGET"
  exit 1
fi

rsync -av --delete --exclude '.git/' --exclude 'node_modules/' --exclude 'dist/' "$HERE/" "$TARGET/"
cd "$TARGET"

rm -rf node_modules package-lock.json
npm install
npm audit
npm run build
npm audit

git add -A
if git diff --cached --quiet; then
  echo "No code changes to commit."
else
  git commit -m "Poco a Poco v14.1 - Berlitz reinforcement"
fi
git push

echo ""
echo "✓ v14.1 published."
echo "Wait for GitHub Actions to turn green, then fully close and reopen the iPhone PWA."
read "?Press Return to close."
