# Poco a Poco — GitHub Pages setup

This edition is configured specifically for a GitHub repository named `poco-a-poco`.

## First publication

1. Make sure you have a GitHub account.
2. Double-click `PUBLISH_TO_GITHUB.command`.
3. Enter your GitHub username.
4. The script opens GitHub's new-repository page. Create a **Public** repository named exactly `poco-a-poco` and leave README, .gitignore and License unchecked.
5. Return to Terminal and press Return.
6. Follow any GitHub authentication prompt.
7. In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions** if it is not already selected.
8. Open **Actions** and wait until `Deploy Poco a Poco to GitHub Pages` is green.

Your permanent address will be:

`https://YOUR-GITHUB-USERNAME.github.io/poco-a-poco/`

## Install on iPhone

1. Open the permanent HTTPS address in Safari while online.
2. Use the app for a moment so the service worker can cache the application.
3. Tap Share → Add to Home Screen → Add.
4. Launch `Poco a Poco` from the Home Screen.
5. For an offline test, turn on Airplane Mode and reopen the installed app.

Core lessons, flashcards, grammar, quizzes and locally saved progress are designed to work without a network after the app has been cached. Browser speech/audio support can vary by iOS version and installed voices.

## Updating later

Edit the project, then from Terminal inside the project folder run:

```bash
git add .
git commit -m "Update Poco a Poco"
git push
```

GitHub Actions rebuilds and republishes the app automatically.

## Local Mac use

`START_ON_MAC.command` still works for local development and opens `http://localhost:5173`.
