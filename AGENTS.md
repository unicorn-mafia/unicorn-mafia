# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 15 single-page application (community website). See `CLAUDE.md` for standard dev commands (`npm run dev`, `npm run lint`, `npm run build`).

### Key caveats

- **ESLint setup**: The repo ships without an ESLint config. On first clone, create `.eslintrc.json` with `{"extends":["next/core-web-vitals","next/typescript"]}` and install `eslint eslint-config-next@15` as devDependencies. Use `@15` to match the Next.js version in `package.json`.
- **`npm run build` fails**: There are pre-existing lint errors in `src/app/_components/about/about.tsx` (unescaped entities) that cause `next build` to fail at the linting step. The dev server (`npm run dev`) is unaffected.
- **No test framework**: No automated tests exist. Validation is done via `npm run lint` and manual browser testing against the dev server at `http://localhost:3000`.
- **No external services required**: All data is static (YAML files in `/public/`). The Google Calendar API (`GOOGLE_CALENDAR_ID`, `GOOGLE_CALENDAR_API_KEY` env vars) is optional and only powers the `/e` events page.
- **Dev server**: `npm run dev` uses Turbopack and serves on port 3000. Pages to verify: `/` (home), `/c` (companies), `/h` (hackathons), `/brand` (brand guidelines).
