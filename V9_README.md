# Poco a Poco v9 — Speaking Lab

v9 adds a voice-first speaking layer without using any paid API.

## New
- Speaking Lab tab
- 12 everyday shadowing drills
- slow and natural playback
- target-hiding for true shadowing
- browser speech recognition in es-GT
- recognition-match score
- fluency timing proxy
- weighted overall speaking score
- repeat / best-score history per phrase
- total speaking time and speaking trend in Progress
- local history only
- no OpenAI API
- no Cloudflare Worker
- no paid pronunciation service

## Accuracy note
The "Match" result is a pronunciation proxy. It measures whether browser speech
recognition understood the expected words and word order. It does not perform
phoneme-level accent analysis.
