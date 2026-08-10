# Poco a Poco v4 — Focus & Fluency

This update keeps the working GitHub Pages / PWA architecture and preserves the existing v3 progress storage key.

## New in v4

- Premium Tutor landing screen with faster scenario selection
- Eight realistic speaking scenarios: terminal, meeting, restaurant, vendor escalation, safety intervention, network incident, backup & recovery, and executive update
- Per-response Tutor scoring stored locally
- Tutor trend analytics in Avance
- Weakest Tutor scenario surfaced as the next focus area
- Daily practice formula on the home screen
- Updated mobile polish for iPhone use
- GitHub Pages and offline PWA behavior retained

## Important

Live open-ended AI is intentionally not called directly from the browser. A static GitHub Pages app cannot safely contain a private API secret. The next layer should be a small authenticated server-side API/worker while keeping this PWA as the front end.
