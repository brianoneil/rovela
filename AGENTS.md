# AGENTS.md — Rovela

Rovela is an adventure-first travel companion app. It automatically captures a trip (GPS, photos, workouts, flights, places, weather) plus fast manual entries (notes, voice memos, milestones), then presents it as a beautiful story: cover, map, chronicle, day view, and AI-written Story Mode.

- **Platforms:** iPhone, iPad, Android phones, Android tablets (iOS ships first)
- **Framework:** React Native with Expo (TypeScript)
- **Current phase:** Phase 0 — design exploration in Paper. No app code yet.

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
- Paper tokens are the source of truth for colors, typography, spacing, and day colors. The app theme is generated from them. Do not hand-pick values in code.
- When translating Paper designs to code, read exact values with Paper's `get_jsx` / `get_computed_styles` / `get_tokens`. Never estimate sizes or colors from screenshots.
- Design direction: dark mode default, earthy/muted topo-style maps, serif for narrative, sans for data. Maps are the primary canvas; photos carry emotion; never show raw data when a visual form works.

## Tech Stack

Expo (dev builds via EAS), Expo Router, `@rnmapbox/maps`, Reanimated + Skia, Victory Native, `expo-image`, `expo-sqlite` + Drizzle, Zustand + TanStack Query, `expo-location` + `expo-task-manager`, `expo-media-library`, HealthKit / Health Connect, `expo-calendar`, `expo-audio`, `expo-notifications`, `expo-print`, RevenueCat. See `docs/04 - Build Plan.md` for rationale and pending decisions.

**Expo Go will not work.** Mapbox, HealthKit, and background location need a development build.

## Proposed Project Structure

Update this section once the app is scaffolded.

```
app/                 Expo Router routes (screens only, thin)
src/
  components/        Reusable UI, one component per file
  features/          Feature modules (trips, capture, chronicle, map, story, ...)
  db/                Drizzle schema, migrations, repositories
  services/          Platform integrations (location, photos, health, calendar, weather, ai)
  theme/             Tokens generated from Paper, typography, day colors
  hooks/             Shared hooks (e.g. useLayout for phone/tablet)
  types/             Shared domain types (Trip, TimelineEntry, Place, Person)
assets/
  images/sample-trip/  Optimized Patagonia sample-trip photos used in the Paper designs
design/
  imagery/           Full-resolution Higgsfield source PNGs (not for the app bundle)
docs/                Product docs (Obsidian vault)
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

- Every screen supports phone and tablet. Use the shared layout hook / breakpoints; do not branch on device model.
- Tablet uses split views (persistent map beside content) where the design calls for it.
- Support portrait and landscape on tablet.
- Touch targets at least 44 × 44 pt.

## Privacy + Security

- All trip data stays on-device by default. Sync is opt-in.
- **No API keys in the app bundle.** Claude API and other paid services go through a backend proxy.
- Request permissions in context with a clear reason (onboarding designs define the copy). Degrade gracefully when denied.
- Follow Apple / Google policies for background location and health data.

## Commands

TODO: Fill in once the Expo app is scaffolded (install, dev build, start, lint, typecheck, test).
