#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="$HOME/Quetzal/Confidential/Spanish App/poco-a-poco-github"

if [ ! -d "$TARGET/.git" ]; then
  echo "Could not find the existing GitHub repository at:"
  echo "$TARGET"
  echo
  echo "If you moved it, drag the poco-a-poco-github folder into this Terminal window after typing: cd "
  read -p "Press Return to exit."
  exit 1
fi

echo "Updating existing Poco a Poco repository to v4..."
rsync -av --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude 'dist' \
  "$SCRIPT_DIR/" "$TARGET/"

cd "$TARGET"

echo
echo "Cleaning the previous dependency install..."
rm -rf node_modules package-lock.json

echo "Installing clean dependencies..."
npm install

echo
echo "Building locally first..."
npm run build

echo
echo "Publishing to GitHub..."
git add .
if git diff --cached --quiet; then
  echo "No changes to publish."
else
  git commit -m "Hotfix Poco a Poco v4 dependency build"
  git push
fi

echo
echo "Done. Watch GitHub Actions, then reopen the installed app on iPhone."
read -p "Press Return to close."
