# Secure live-AI connection — next stage

Poco a Poco is hosted on GitHub Pages, which is static hosting. OpenAI API keys must stay server-side and must not be embedded in browser JavaScript.

The live AI architecture will be:

```
iPhone / Mac PWA (GitHub Pages)
        | HTTPS
        v
Small secure API endpoint
        | OPENAI_API_KEY stored as server secret
        v
OpenAI Responses API
```

The PWA can remain on GitHub Pages. Only the tiny API endpoint needs server-side hosting.
