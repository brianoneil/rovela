# AGENTS.md — Rovela

Rovela is an adventure-first travel companion app. It automatically captures a trip (GPS, photos, workouts, flights, places, weather) plus fast manual entries (notes, voice memos, milestones), then presents it as a beautiful story: cover, map, chronicle, day view, and AI-written Story Mode.

- **Platforms:** iPhone, iPad, Android phones, Android tablets (iOS ships first)
- **Framework:** React Native with Expo (TypeScript)
- **Current phase:** Phase 2 — trips + retroactive import. The data layer (trip repository, photo / health / calendar import, permissions, query hooks) is built; screens are still placeholders until their Paper designs are approved. `src/app/dev/import.tsx` is a dev-only harness for exercising it.

## Read First

| Doc | What it covers |
|---|---|
| `docs/00 - Rovela Overview.md` | Product summary, proposed stack |
| `docs/01 - Capture and Entry.md` | Data sources, manual entry, data model, permissions |
| `docs/02 - Storytelling and Presentation.md` | The five presentation layers, design principles, motion |
| `docs/03 - Monetization and Business Model.md` | Free vs Pro gating, pricing |
| `docs/04 - Build Plan.md` | Phased plan, tech stack decisions, open decisions |

The `docs/` folder is an Obsidian vault. Keep `[[wiki links]]` intact when editing.

## Design Workflow (Paper)

- **Design before build.** Do not build a screen in the app until it has an approved Paper design for both phone and tablet.
- Artboards: phone 390 × 844, tablet portrait 834 × 1194, tablet landscape 1194 × 834.
- Paper tokens are the source of truth for colors, typography, spacing, and day colors. `src/theme/tokens.ts` mirrors them; when tokens change in Paper, re-read with `get_tokens` and update that file. Do not hand-pick values in code.
- When translating Paper designs to code, read exact values with Paper's `get_jsx` / `get_computed_styles` / `get_tokens`. Never estimate sizes or colors from screenshots.
- Design direction: dark mode default, earthy/muted topo-style maps, serif for narrative, sans for data. Maps are the primary canvas; photos carry emotion; never show raw data when a visual form works.

## Tech Stack

Expo (dev builds via EAS), Expo Router, `@maplibre/maplibre-react-native` (MapLibre, no account/key), Reanimated + Skia, Victory Native, `expo-image`, `expo-sqlite` + Drizzle, Zustand + TanStack Query, `expo-location` + `expo-task-manager`, `expo-media-library`, HealthKit / Health Connect, `expo-calendar`, `expo-audio`, `expo-notifications`, `expo-print`, RevenueCat. See `docs/04 - Build Plan.md` for rationale and pending decisions.

**Expo Go will not work.** MapLibre, HealthKit, Health Connect, and background location need a development build. After adding or configuring a native package, rebuild with `npm run ios` / `npm run android`.

SDK 57 replaced the `expo-media-library` and `expo-calendar` APIs: use `Query` / `Asset` and `getCalendars` / `listEvents`. The old `*Async` functions are exported for warnings only and throw at runtime.

### Expo has changed — do not trust training data

Expo ships breaking changes every SDK release (this project is on **SDK 57**). Before writing code that touches an Expo, EAS, or React Native API, read the versioned docs at `https://docs.expo.dev/versions/v57.0.0/`, or start from `https://docs.expo.dev/llms.txt`.

- Always add packages with `npx expo install <package>` (resolves SDK-compatible versions), never plain `npm install`.
- `ios/` and `android/` are generated (Continuous Native Generation) and git-ignored. Never edit them by hand; configure native behavior in `app.json` and config plugins.
- npm 11 blocks dependency install scripts by default. If a new package needs one, approve it with `npm install-scripts approve <pkg>` (recorded under `allowScripts` in `package.json`).

## Project Structure

```
src/
  app/               Expo Router routes (screens only, thin). Every file is a route; _layout.tsx defines navigators
    trip/[tripId]/   Trip Cover (index), chronicle, map, day/[date], story
  components/        Reusable UI, one component per file (AppText, ErrorState, AppErrorBoundary, ...)
  features/          Feature modules: trips (validation, query hooks), import (runTripImport, hooks), dev (harness only)
  db/                Drizzle schema, client, DatabaseGate, repositories (trip, timeline), mappers, migrations/
  services/          Platform integrations: photos, calendar, health/ (HealthKit + Health Connect), import/
                     (shared import types, burst de-dup), permissions, errors (ServiceError), logger, queryClient
  utils/             Small pure helpers (local-day date math)
  theme/             tokens.ts mirrored from Paper, fonts, typography variants, getDayColor
  hooks/             Shared hooks (useLayout for phone/tablet)
  types/             Shared domain types (Trip, TimelineEntry, Place, Person, DailyActivity)
assets/
  images/sample-trip/  Optimized Patagonia sample-trip photos used in the Paper designs
design/
  imagery/           Full-resolution Higgsfield source PNGs (not for the app bundle)
docs/                Product docs (Obsidian vault)
site/
  public/            Coming soon site (getrovela.com). Cloudflare Pages deploys this directory only.
```

## Coding Rules

- **No timers or delays to fix issues.** No `setTimeout` / sleep workarounds for race conditions or layout. Find the real cause (effects, lifecycle, layout events, promises).
- **One component per file.** Keep views and components discrete.
- **Do not modify existing components** unless required for the task or explicitly asked.
- **Keep files under 500 lines.** Split by responsibility.
- **Reuse.** Use existing types and interfaces (`src/types`) and shared utilities before creating new ones.
- **Exception handling.** Every service call to a platform API, the database, or the network handles errors explicitly with typed, user-safe messages. Permission denial is an expected state, not a crash.
- **Comment complex logic** (trip detection, mode classification, photo scoring, map clustering) in plain language.
- **Stubs get `TODO: `.** Any stubbed function or placeholder must be marked with a `TODO: ` comment.
- **No fallback or calculated data** unless a spec calls for it. If data is missing, show an empty or error state — never fabricate values.
- **Never commit** unless the user asks.
- TypeScript strict mode. No `any` without a comment explaining why.

## Phone + Tablet

- Every screen supports phone and tablet. Use `useLayout()` from `src/hooks/useLayout.ts` (window-size based, tablet = shorter side ≥ 600 pt); do not branch on device model.
- Tablet uses split views (persistent map beside content) where the design calls for it.
- Support portrait and landscape on tablet.
- Touch targets at least 44 × 44 pt.

## Privacy + Security

- All trip data stays on-device by default. Sync is opt-in.
- **No API keys in the app bundle.** Claude API and other paid services go through a backend proxy.
- Request permissions in context with a clear reason (onboarding designs define the copy). Degrade gracefully when denied.
- Follow Apple / Google policies for background location and health data.

## Marketing site

`site/public` is the static site at getrovela.com. `.github/workflows/deploy.yml` publishes that directory to Cloudflare Pages on pushes that touch `site/**` or the workflow file. Keep app source, docs, and secrets out of `site/public`. Colors and type follow `src/theme/tokens.ts`.

The link preview image `site/public/og-image.jpg` (1200 × 630) is rendered from `site/og/card.html`, which is not deployed. To regenerate it, serve `site/`, then run headless Chrome with `--window-size=1200,630 --screenshot` against `/og/card.html`. `apple-touch-icon.png` and `icon-192.png` / `icon-512.png` are resized from `assets/images/icon.png`; regenerate them when the app icon changes.

## Commands

```bash
npm install                  # install dependencies
npm run build:dev:ios        # EAS development build for iPhone/iPad (build:dev:android for Android)
npm run ios                  # or build + run a dev build locally (needs Xcode); `npm run android` for Android
npm start                    # start Metro for an installed dev build
npm run typecheck            # tsc --noEmit
npm run lint                 # expo lint (ESLint + Prettier)
npm test                     # Jest (jest-expo)
npm run format               # Prettier
npm run db:generate          # after editing src/db/schema.ts, generate a Drizzle migration
npm run doctor               # expo-doctor dependency/config checks
```

Run typecheck, lint, and tests before declaring any task done.

### Verifying on device

The app runs locally as a dev build (`npm run ios` / `npm run android`). Verify UI changes on the simulator with the `agent-device` CLI (read `agent-device help react-native` and `agent-device help manual-qa` first). Check both a phone (e.g. iPhone 17) and a tablet (e.g. iPad Air 11-inch) simulator. After JS-only changes use `agent-device metro reload`; a bare screenshot is not verification — confirm expected text or elements.
