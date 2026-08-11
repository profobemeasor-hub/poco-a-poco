#!/bin/zsh
set -e
cd "$(dirname "$0")"

echo "Poco a Poco v2 — local setup"
echo "=============================="

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install the current Node.js LTS release, then run this file again."
  read -k 1 "?Press any key to close..."
  exit 1
fi

npm config set registry https://registry.npmjs.org/

if [ ! -d node_modules ]; then
  echo "Installing packages..."
  npm install
fi

echo "Starting Poco a Poco v2..."
(sleep 2; open "http://localhost:5173") &
npm run dev
