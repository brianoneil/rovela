# Rovela — Build Plan

> How we go from ideation docs to a shipped React Native (Expo) app for iPhone, iPad, Android phones, and Android tablets.

**Status:** Phase 0 — Design exploration in Paper (nothing built in the app yet)

---

## Guiding Decisions

- **Design first.** Every screen is prototyped in Paper (phone + tablet) before it is built. Paper tokens are the source of truth for color, type, and spacing in code.
- **Phone and tablet are both first-class.** Tablet is not a stretched phone. Tablet layouts use the extra space for a persistent map beside content (split view).
- **iOS first, Android close behind.** Launch on iOS (per business plan), but write cross-platform code from day one and keep Android building in CI.
- **On-device first.** All trip data lives locally (SQLite). Sync is opt-in and comes later.
- **Real data only.** Presentation screens are built against real device data (retroactive import), not mocked or calculated data.
- **Capture → Story loop is the MVP.** Beta goal is proving a user can end a trip and get a story they love.

---

## Tech Stack (Recommended)

Updates to the proposed stack in [[00 - Rovela Overview]] are flagged with ⚠️.

| Concern | Choice | Notes |
|---|---|---|
| Framework | Expo (latest stable SDK), TypeScript strict | **Development builds required** — Mapbox and HealthKit do not run in Expo Go |
| Build / release | EAS Build, EAS Submit, EAS Update | TestFlight for beta |
| Navigation | Expo Router | File-based routes; split layouts on tablet |
| Maps | `@rnmapbox/maps` | Custom earthy style in Mapbox Studio. MapLibre is the scale-up fallback |
| Animation / drawing | Reanimated + `@shopify/react-native-skia` | Route trace, weather tapestry, elevation draw-in |
| Charts | Victory Native (XL, Skia-based) | Elevation sparklines, profiles, weather |
| Images | `expo-image` + blurhash | |
| Local database | `expo-sqlite` + Drizzle ORM | Typed schema + migrations for the Trip / TimelineEntry model |
| State | Zustand (UI state) + TanStack Query (async/derived data) | |
| Location | `expo-location` + `expo-task-manager` | Background location + geofencing |
| Photos | `expo-media-library` | Date-range scans, EXIF location |
| Health (iOS) | ⚠️ `@kingstinct/react-native-healthkit` | Better maintained than `react-native-health`, has Expo config plugin |
| Health (Android) | `react-native-health-connect` | Polling only |
| Calendar | `expo-calendar` | |
| Voice memos | `expo-audio` + on-device speech recognition | Transcription library TBD |
| Notifications | `expo-notifications` | Day recap prompt |
| PDF export | ⚠️ `expo-print` | Replaces `react-native-html-to-pdf` (HTML → PDF, Expo-native) |
| Story generation | Claude API **via a backend proxy** | API key must never ship in the app |
| Subscriptions | RevenueCat (`react-native-purchases`) | Handles App Store + Play billing |

---

## Phase 0 — Design Exploration in Paper (current)

Goal: settle the visual language and the key layouts on phone **and** tablet before writing app code.

**Artboard sizes**
- Phone: 390 × 844 (iPhone base)
- Tablet portrait: 834 × 1194 (iPad 11")
- Tablet landscape: 1194 × 834

**Step 1 — Design brief + tokens**
- Palette: dark-mode default, earthy/muted map-friendly neutrals, one accent, and a **day color sequence** (day 1 amber, day 2 teal, …) that reads well on a dark topo map
- Type pairing: serif for narrative, sans for data, small-caps style for data callouts
- Spacing scale, radius scale, elevation/shadow
- Save as Paper tokens so they can be exported directly into the app theme

**Step 2 — Screens to test (in priority order)**

| # | Screen | Key design questions |
|---|---|---|
| 1 | Trip Cover | Hero photo + serif title legibility; how the map peek + route trace sits under the photo |
| 2 | Chronicle | Sticky day headers; staggered magazine photo clusters; workout / place / quote card family |
| 3 | Map + time scrubber | Day-colored tracks on the custom style; photo collage clusters; scrubber placement |
| 4 | Day View | Weather ribbon as a "painting"; section rhythm; elevation profile |
| 5 | Capture bar + quick entry | Floating bar vs bottom sheet; voice / camera / text entry flows |
| 6 | Story Mode | Long-form reading layout; pull quotes; inline map moment; edit affordances |
| 7 | Home / Moments feed | Active trip vs no trip states; "On this day" cards |
| 8 | Onboarding + permissions | Earning "Always" location, photos, health, calendar trust |
| 9 | Paywall | Annual-default pricing presentation |
| 10 | Share cards | Trip in Numbers (9:16 + square), Elevation Portrait, Weather Tapestry |

**Tablet layout questions to answer**
- Split view: persistent map on one side, Chronicle / Day View on the other?
- Does the split change between portrait and landscape?
- Story Mode on tablet: centered reading column with photos breaking out full-width?

**Exit criteria:** tokens defined, screens 1–5 approved on phone + tablet, component inventory listed (cards, chips, headers, sheets). Screens 6–10 can finish in parallel with Phase 1.

---

## Phase 1 — Foundation

- Scaffold Expo app (TypeScript strict, Expo Router, ESLint + Prettier)
- Configure EAS dev builds for iOS and Android; confirm install on a real iPhone, iPad, and Android device
- Theme module generated from Paper tokens (colors, type, spacing, day colors)
- Responsive layout system: breakpoints (phone / tablet), `useLayout()` hook, split-view shell for tablet
- Base component library from the Phase 0 inventory (each component in its own file)
- SQLite + Drizzle schema for `Trip`, `TimelineEntry`, `Place`, `Person` (from [[01 - Capture and Entry]]) with migrations
- Error handling + logging baseline (error boundaries, typed service errors)
- Unit test setup (Jest + React Native Testing Library)

## Phase 2 — Trips + Retroactive Import

Builds real trips from existing phone data, which gives Phases 3+ real content to render.

- Create / edit / delete a trip manually (name, dates, tags, cover)
- Import for a date range: photos (with EXIF location), HealthKit workouts + steps, calendar events
- Normalize everything into `TimelineEntry` records
- Photo de-duplication of bursts
- Permission prompts built from the Phase 0 onboarding designs

## Phase 3 — Presentation Core

- Trip Cover with route trace animation
- Chronicle (day-by-day timeline, sticky headers, card family)
- Map layer: custom Mapbox style, day-colored tracks, photo clusters, place markers
- Day View
- Tablet split view: map + Chronicle side by side
- Historical weather per day (provider TBD) — weather chips + ribbon

## Phase 4 — Live Capture

- Background GPS track with mode classification (walk / run / cycle / drive / flight)
- Place visit detection
- Live photo ingestion during an active trip
- Capture bar: text note, voice memo + transcription, camera
- Structured entries: milestones, people met, place reviews, conversations, expenses
- Day recap notification + recap editor
- Auto trip start / close (home geofence) with manual override

## Phase 5 — Story Mode

- Backend proxy for Claude API (auth, rate limiting, no client-side keys)
- Story generation: prologue, chapters per destination, epilogue
- Editable paragraphs, reorder chapters, add / remove photos
- **This completes the MVP loop → private TestFlight beta**

## Phase 6 — Sharing + Export

- Share any card / map / stat as an image
- Trip in Numbers, Elevation Portrait, Weather Tapestry
- PDF journal (`expo-print`), GPX export
- Route trace video export
- Offline map tile downloads

## Phase 7 — Monetization + Launch

- RevenueCat, free vs Pro gating per [[03 - Monetization and Business Model]]
- Paywall, lifetime early-access offer
- "Made with Rovela" watermark on free exports
- Android parity pass (Health Connect polling, large-screen layouts)
- App Store / Play Store assets, public launch

---

## Open Decisions

These need an answer before the phase that depends on them.

| Decision | Needed by | Options |
|---|---|---|
| Serif / sans font pairing | Phase 0 | Pick in Paper |
| Health library (iOS) | Phase 2 | `@kingstinct/react-native-healthkit` (recommended) vs `react-native-health` |
| Weather provider | Phase 3 | Open-Meteo (free historical) vs The Weather Company vs other |
| Mapbox vs MapLibre at launch | Phase 3 | Mapbox (docs default) vs MapLibre + PMTiles (lower long-term cost) |
| Voice transcription | Phase 4 | On-device speech recognition vs Whisper API |
| GPS sampling granularity | Phase 4 | Fixed interval vs significant changes vs adaptive |
| Backend platform for the AI proxy + future sync | Phase 5 | TBD (e.g. Supabase, Cloudflare Workers, Dokku) |
| Email / booking parsing | Post-MVP | MailKit vs forward-to-address vs screenshot AI |
| Multi-traveler shared trips | Post-MVP | |

---

*See [[00 - Rovela Overview]], [[01 - Capture and Entry]], [[02 - Storytelling and Presentation]], [[03 - Monetization and Business Model]].*
