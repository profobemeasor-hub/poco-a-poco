# Poco a Poco v7 — AI Memory

Version 7 adds persistent learning memory using Cloudflare D1.

The coach now remembers:
- recent communication scores
- recurring corrections
- useful vocabulary from prior sessions
- common everyday-life practice topics
- recent learner responses

The AI Coach uses this memory automatically before each reply. The Progress screen shows what is stored and includes a protected Reset AI memory control.

## Deploy
Double-click `SETUP_V7_MEMORY.command`.

The script reuses the existing Cloudflare Worker, `OPENAI_API_KEY`, `APP_PIN`, GitHub repository and Worker URL. It creates the D1 database if necessary, applies `worker/schema.sql`, deploys the Worker, validates both npm trees, builds the frontend, and pushes to GitHub only after successful builds.
