---
status: accepted
---

# Structured context injection over vector RAG

We assemble a deterministic 5-layer prompt context (~3k–5k tokens) on every Mentor turn—Health Profile, active Diet Plan and Training Plan, last 4 Weekly Check-ins and last 7 Daily Logs, a rolling Conversation Summary, and the last 12–15 raw messages—rather than indexing user data into a vector database (RAG). For a single member, core goals and active plans are small enough to always include verbatim, eliminating retrieval misses ("goal amnesia") and staying fast and reliable within free-tier LLM rate limits.

## Considered Options

- **Vector RAG (`pgvector`) from day one**: Adds embedding pipeline complexity, extra API calls/costs, and retrieval failure modes where critical constraints (allergies, injuries, calorie targets) might not be retrieved on a given turn.

## Consequences

- Older Mentor Thread history beyond the recent window is compressed into a rolling Conversation Summary roughly every 20 messages.
- Vector retrieval can be introduced later only if a member accumulates extensive long-term journals or if an external nutrition/exercise knowledge base is added.
