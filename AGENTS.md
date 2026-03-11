# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 15 single-page application (community website). See `CLAUDE.md` for standard dev commands (`pnpm dev`, `pnpm lint`, `pnpm build`). Uses pnpm (version pinned in `packageManager` field).

### Key caveats

- **ESLint**: Already configured via `eslint.config.mjs` (flat config). No extra setup needed — just `pnpm install`.
- **sharp build script**: pnpm may warn about an ignored build script for `sharp`. The dev server and build work fine without it; if image optimisation issues arise, allow it via `pnpm.onlyBuiltDependencies` in `package.json`.
- **No test framework**: No automated tests exist. Validation is done via `pnpm lint` and manual browser testing against the dev server at `http://localhost:3000`.
- **No external services required**: All data is static (YAML files in `/public/`). The Google Calendar API (`GOOGLE_CALENDAR_ID`, `GOOGLE_CALENDAR_API_KEY` env vars) is optional and only powers the `/e` events page.
- **Dev server**: `pnpm dev` uses Turbopack and serves on port 3000. Pages to verify: `/` (home), `/c` (companies), `/h` (hackathons), `/brand` (brand guidelines), `/d` (demos).
