# Poco a Poco v6 — Live AI Coach

v6 adds a secure, open-ended AI conversation coach while keeping the learning path focused on everyday life in Guatemala before workplace/industry Spanish.

## What is new

- Live AI conversations in four modes: Daily life, Social, Practical, Mostly Spanish.
- Voice input through the browser when supported.
- Spoken Spanish replies using the existing device speech engine.
- Brief corrections that prioritize communication and fluency rather than correcting every small error.
- Offline Roleplay remains available when there is no connection.
- The OpenAI API key is never stored in the React/GitHub Pages code.
- A Cloudflare Worker acts as the secure server-side AI gateway.
- A private AI PIN prevents casual use of your public endpoint by visitors to the GitHub Pages app.

## Install / publish

1. Unzip the v6 folder beside your existing `poco-a-poco-github` folder.
2. Double-click `SETUP_AI_COACH.command`.
3. Sign into Cloudflare when the browser opens. Create a free account first if you do not have one.
4. When prompted in Terminal, paste an OpenAI API key. The script sends it directly to Cloudflare as an encrypted Worker secret; it is not written to the repository.
5. Choose a private AI PIN (at least 6 characters) and remember it.
6. The script deploys the Worker, writes only its public URL into `src/config.js`, validates the frontend build, commits and pushes v6 to GitHub.
7. Wait for GitHub Actions to turn green, then reopen the installed iPhone PWA.
8. Open **AI Coach** and enter your private PIN once.

## Cost note

The live AI feature uses your OpenAI API account and can incur API usage charges. Offline lessons and offline Roleplay do not call the OpenAI API.
