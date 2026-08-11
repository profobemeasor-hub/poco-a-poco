#!/bin/zsh
set -e
cd "$(dirname "$0")"

echo "Poco a Poco — GitHub Pages publisher"
echo "======================================"
echo ""

if ! command -v git >/dev/null 2>&1; then
  echo "Git is not available. Install Apple's Command Line Tools with: xcode-select --install"
  read -k 1 "?Press any key to close..."
  exit 1
fi

read "GHUSER?Your GitHub username: "
if [ -z "$GHUSER" ]; then
  echo "GitHub username is required."
  exit 1
fi

REPO="poco-a-poco"

echo ""
echo "Step 1 of 3 — GitHub repository"
echo "A browser will open. Create a PUBLIC repository named: $REPO"
echo "IMPORTANT: leave README, .gitignore and license UNCHECKED so the repository is empty."
echo ""
open "https://github.com/new?name=$REPO&description=Personal%20Spanish%20practice%20PWA"
read "?After you have clicked 'Create repository' in the browser, press RETURN here... "

echo ""
echo "Step 2 of 3 — preparing local repository"
if [ ! -d .git ]; then
  git init
fi

git branch -M main
git add .
if ! git diff --cached --quiet; then
  git commit -m "Deploy Poco a Poco PWA"
fi

git remote remove origin >/dev/null 2>&1 || true
git remote add origin "https://github.com/$GHUSER/$REPO.git"

echo ""
echo "Step 3 of 3 — pushing to GitHub"
echo "If GitHub asks you to authenticate, follow the browser/login prompt."
git push -u origin main

echo ""
echo "============================================================"
echo "Files uploaded successfully."
echo ""
echo "Now open your repository Settings > Pages and make sure"
echo "Source is set to: GitHub Actions"
echo ""
echo "Your app will be available at:"
echo "https://$GHUSER.github.io/$REPO/"
echo ""
echo "The first deployment normally takes a minute or two."
echo "============================================================"
open "https://github.com/$GHUSER/$REPO/actions"
read -k 1 "?Press any key to close..."
