# Poco a Poco v3 — Tutor Update

This update adds an adaptive Tutor tab to the already-working GitHub Pages PWA.

## New in v3

- Tutor tab with Terminal shift, Morning meeting, and Dinner out scenarios
- Voice or typed Spanish answers
- Communication scoring based on key meaning + closeness to a natural model answer
- Targeted corrections for common English-speaker errors
- Spanish model answer with text-to-speech playback
- Tutor practice contributes to spoken progress/streaks
- Keeps the same local progress store (`espanol:progress:v3`) so existing progress is preserved
- Continues to work as a GitHub Pages PWA

## Important: live AI

This build intentionally does **not** put an OpenAI API key in the React/browser code. A static GitHub Pages app cannot safely keep an API secret. The next AI step is to connect the Tutor UI to a small authenticated server-side endpoint.

## Publish

Double-click `APPLY_V3_AND_PUBLISH.command`. It copies the v3 files into the existing local `poco-a-poco-github` repository, commits, and pushes. GitHub Actions then republishes the site.
