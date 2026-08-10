#!/bin/bash
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
CANDIDATES=("$HOME/Quetzal/Confidential/Spanish App/poco-a-poco-github" "$HOME/Quetzal/Confidential/Spanish App/poco-a-poco" "$HOME/poco-a-poco")
TARGET=""
for d in "${CANDIDATES[@]}"; do [ -d "$d/.git" ] && TARGET="$d" && break; done
if [ -z "$TARGET" ]; then
  echo "Could not find the existing poco-a-poco Git repository."
  echo "Drag the repository folder into this Terminal window, then press Return:"
  read -r TARGET
fi
if [ ! -d "$TARGET/.git" ]; then echo "That folder is not the Git repository."; read -p "Press Return to close."; exit 1; fi

echo "Updating: $TARGET"
rsync -av --delete --exclude='.git' --exclude='node_modules' --exclude='dist' "$HERE/" "$TARGET/"
cd "$TARGET"
rm -rf node_modules package-lock.json
echo "Installing v5.0.1 dependencies..."
npm install
echo "Running production build..."
npm run build

git add .
if git diff --cached --quiet; then echo "No new changes to publish."; else
 git commit -m "Poco a Poco v5.0.1 - Live Guatemala"
 git push
fi

echo ""
echo "✓ v5 published. Wait for GitHub Actions to turn green, then reopen the iPhone app."
read -p "Press Return to close."
