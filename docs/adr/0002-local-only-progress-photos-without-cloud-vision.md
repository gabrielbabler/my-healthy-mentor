---
status: accepted
---

# Store progress photos locally without cloud vision APIs in v1

Progress Photos submitted in Weekly Check-ins are compressed to WebP (EXIF/GPS stripped), stored strictly on the self-hosted VPS persistent volume, and served only through authenticated routes—never transmitted to external cloud vision models in v1. Because v1 targets \$0/month operation using free-tier cloud LLMs whose terms may allow prompt/media retention for training, keeping sensitive physique photos off third-party APIs protects member privacy while still delivering side-by-side visual comparison and export in the web app.

## Consequences

- Weekly Check-in AI reviews in v1 operate strictly on structured text data (fasting weight trends, daily adherence, and subjective notes).
- The check-in evaluation pipeline should expose a clean adapter boundary so an optional zero-retention or self-hosted vision analyzer can be plugged in later without changing photo storage or check-in UX.
- Telegram voice notes (audio) remain permitted to use free-tier transcription (Gemini / Groq Whisper) since they do not carry visual body-photo sensitivity.
