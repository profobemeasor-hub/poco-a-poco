# Poco a Poco v7.1 — Offline Smart Coach

This release removes the OpenAI/Cloudflare AI dependency from the app.

## What remains
- Living in Guatemala journey
- Real-world missions
- Offline Smart Coach roleplays
- Microphone speech recognition where the browser supports it
- Spanish text-to-speech
- Confidence scoring
- Local progress and reflections
- PWA/offline support

## What is removed
- OpenAI API calls
- Cloudflare Worker calls
- AI PIN
- API billing dependency
- Cloudflare D1 AI memory from the app

Learning progress remains under the existing local storage key, so normal v5/v6 local progress is preserved.
