# Rovela — Project Overview

**App name:** Rovela  
**Domain:** getrovela.com (registered, placeholder live)  
**Status:** Ideation / Pre-development  
**Type:** Mobile app (iOS + Android, React Native)

---

## The Idea

Rovela is an adventure-first travel companion that automatically stitches together everything from a trip — GPS tracks, photos, workouts, flights, places, weather, conversations — and turns it into a beautiful story. Targeted at adventure travel but designed to work for any trip.

Two modes:
- **Live companion** during the trip — passive capture + quick manual entry
- **Beautiful artifact** after — a rich, visual story of where you went and what happened

---

## Name

**Rovela** — from "rove" (to travel freely, wander with purpose). The -ela suffix gives it a warm, international feel while keeping the rugged core of the root word. Clean, memorable, no negative associations. Pronounces clearly as "roh-VEH-lah."

**Domain:** `getrovela.com` registered via Cloudflare Registrar at cost ($10.46/yr). Placeholder site live at getrovela.com.

---

## Core Concept

A trip is a bounded period of time and space. Rovela becomes the connective tissue:
- Pull in signals from every source automatically
- Let the user fill in the human parts through fast manual entry
- Hold everything in a structured timeline anchored to a **Trip**
- Then present it as something beautiful — maps, tracks, stories, photos

---

## What It Captures

### Automatic
- **GPS track** — continuous location, mode-classified (walk/run/cycle/drive/flight/transit)
- **Photos** — camera roll ingestion, burst de-duplication, AI highlight scoring
- **Workouts** — from HealthKit (iOS) / Health Connect (Android): type, distance, elevation, heart rate
- **Flights & transit** — detected from calendar, email parsing (boarding passes), motion + GPS
- **Place visits** — arrival/departure via CoreLocation / geofence dwell detection
- **Weather** — historical conditions fetched per day/location
- **Calendar events** — anything in the trip window

### Manual
- Voice memos (auto-transcribed)
- Text notes (quick capture, geotagged)
- People met — name, context, photo
- Conversations — structured note of memorable exchanges
- Place reviews — star + note
- Milestones — summit, border crossing, wildlife, etc.
- Expenses (lightweight)

### Trip Detection
- Auto-start: geofence departure from home area, or flight/unusual movement
- Auto-close: return to home base
- Manual override always available

---

## Presentation

### Five layers
1. **Trip Cover** — cinematic hero image, route trace animation on open
2. **The Map** — full-screen Mapbox canvas; day-coded color tracks; photo pins as thumbnail clusters; elevation-colored hiking trails; flight arcs; time scrubber
3. **The Chronicle** — scrollable day-by-day timeline; auto-curated photo clusters; workout cards with elevation sparklines; place cards; voice memo excerpts
4. **Day View** — single-day deep dive: map, weather ribbon (morning/afternoon/evening), full photo scroll, elevation profile, places, notes
5. **Story Mode** — AI-generated narrative structured as chapters (one per destination); full-bleed photos; pull quotes from voice memos; editable prose; exports as PDF journal

### Special elements
- **Elevation Portrait** — all hikes on one composite chart
- **Weather Tapestry** — each day as a color stripe showing the trip's weather arc
- **Trip in Numbers** — shareable Wrapped-style stats card
- **Route trace animation** — map drawing itself as a short video for social sharing

### Design direction
- Dark mode default
- Custom Mapbox style (earthy, muted, topo-flavored — not Google Maps)
- Rich typography: serif for narrative, sans for data
- React Native Reanimated 3 + Skia for animations
- Mapbox GL for maps
- OpenAI API for story generation

---

## Platform Notes

### iOS — Workout Detection
HealthKit background delivery (`enableBackgroundDelivery` + `HKObserverQuery`) fires when a workout sample is saved (e.g., Apple Watch saves on stop). Does not fire when device is locked. Library: `react-native-health`.

### Android — Workout Detection
Health Connect (`matinzd/react-native-health-connect`) is a data store, not an event bus — no push on workout start/stop, must poll. More limited than iOS.

---

## Tech Stack (Proposed)
- **Framework:** React Native (Expo)
- **Maps:** Mapbox GL (custom style, offline tiles)
- **Charts:** Victory Native (elevation profiles, weather)
- **Animations:** React Native Reanimated 3 + Skia
- **Health:** react-native-health (iOS), react-native-health-connect (Android)
- **Story generation:** Claude API (on-device for privacy mode, Haiku for cloud)
- **Storage:** On-device first, optional sync
- **PDF export:** react-native-html-to-pdf

---

## Vault Documents

- [[00 - Rovela Overview]] — this file
- [[01 - Capture and Entry]] — full data capture spec, data model, permissions
- [[02 - Storytelling and Presentation]] — full presentation spec, design system, sharing

---

## Open Questions
- Multi-traveler shared trips?
- Email parsing approach (MailKit / forward-to-email / screenshot AI)?
- Offline-first vs. cloud-backed? (Adventure = bad connectivity)
- Monetization model — subscription? one-time? freemium?
- Build strategy — solo, hire, or find a technical co-founder?
