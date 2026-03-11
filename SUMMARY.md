# Summary — Serenade Assisted Living Site

## Goal
- Build and launch the public Serenade Assisted Living website.
- Prioritize two core features: Virtual Tour and Waitlist signup.

## Current Status
- Project is scoped to the public marketing site first.
- Document system work is intentionally deferred.
- Technical direction is set: static frontend (HTML/CSS) + backend waitlist API.

## Latest Milestone
- Confirmed deployment approach: frontend site plus a Render-hosted `/api/waitlist` endpoint.
- Confirmed email flow via Resend through backend only (no client-side API keys).

## Next Step
- Scaffold the site pages and wire the Waitlist form to the backend contract (`/api/waitlist`).

## Risks / Blockers
- Ensure Resend API key is never exposed in frontend code.
- Need final content/assets (copy, photos, virtual tour media) to complete polish.
