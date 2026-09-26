# Travel Story App — Capture & Entry

> An adventure-first travel companion that stitches together everything that happened on a trip — automatically and manually — then turns it into something beautiful.

---

## Core Idea

The phone already knows most of what happens on a trip. The app's job is to become the connective tissue: pull in signals from every source, let the user fill in the human stuff, and hold it all in a structured timeline. Everything is anchored to a **Trip**, which has a start and end, and everything captured during that window belongs to it.

---

## What a Trip Is

A trip is a bounded period of time and distance. The app should be able to:

- **Auto-detect** a trip start when the user leaves their home area (geofence departure), boards a flight, or shows unusual movement patterns
- **Auto-close** a trip when they return to home base or after a period of inactivity back at home
- **Manual override** — user can start/stop a trip explicitly, name it, set a cover image, and add context

A trip has:
- Name (auto-suggested from destination, user can edit)
- Date range
- Primary location(s) / destination(s)
- Cover image (auto-selected from best photo, or user-picked)
- Tags (adventure, work, family, solo, etc.)

---

## Automatic Capture

These data sources should be captured passively with permission, no user action required.

### Location & Movement
- **GPS track** — continuous or sampled background location, stored as a polyline per day
- **Significant location changes** — iOS significant-change API / Android fused location; battery-friendly
- **Place visits** — CoreLocation visit monitoring (iOS) / geofence dwell detection; fires when user arrives and leaves a named place
- **Route segments** — classify movement by mode: walking, running, cycling, driving, transit, flight (using motion activity + speed + altitude change)

### Photos & Video
- **Camera roll scan** on trip open — pull all media taken during the trip's date range from the photo library
- **Live ingestion** — new photos taken while a trip is active are auto-added to the timeline
- **Metadata extraction** — GPS coords, timestamp, device, exposure/conditions
- **Smart selection** — de-duplicate bursts, score images by sharpness + composition heuristics to surface highlights

### Fitness & Activity
- **Workouts** — pull from HealthKit (iOS) / Health Connect (Android): type, distance, duration, route, heart rate, elevation
- **Steps and active minutes** — daily totals from HealthKit/Health Connect
- **Sleep** — if user tracks sleep, pull it in (useful for multi-day trips)
- **Elevation profile** — for hikes, pull GPS elevation data from workout or location track

### Travel (Structured)
- **Flight detection** — scan calendar for flight events, or use email parsing (boarding passes, confirmations); flight mode + GPS velocity is a secondary signal
- **Train / transit segments** — calendar + email parsing; motion classification as fallback
- **Hotel / accommodation** — calendar events, email confirmations (hotel bookings, Airbnb, etc.)
- **Car trips** — driving segments from motion classification; can be enriched with route from Maps

### Calendar & Events
- **Calendar events** — pull events that fall within the trip window; user controls which calendars to include
- **Tickets / reservations** — concerts, hikes, tours, restaurants; parsed from email or added manually

### Ambient / Contextual
- **Weather** — fetch historical weather for each day/location from a weather API; temperature, conditions, sunrise/sunset
- **Timezone crossings** — log when the user moves into a new timezone
- **Notable dates** — flag if the trip includes a holiday, birthday, or anniversary (from calendar)

---

## Manual Entry

Everything automatic needs a human layer on top. Manual entry should be fast and feel natural — like a lightweight journal, not a form.

### Quick Capture (inline, any time)
- **Text note** — free-form thought, story fragment, quote from a local; timestamped and geotagged automatically
- **Voice memo** — record then transcribe; the transcript is searchable and becomes a memory
- **Photo annotation** — tap any auto-captured photo to add a caption, tag people, or mark it as a highlight
- **Rating / mood** — quick 1-5 or emoji mood stamp on a day or experience

### Structured Manual Entries
- **Conversation log** — structured entry: who was the conversation with, what was memorable about it; optionally voice-recorded
- **Place review** — visited a restaurant, trailhead, hostel, market; free-text note + star rating + photo
- **Expense** — cost in local currency, category (food, transport, activity, accommodation); lightweight spend tracker
- **People met** — name, context (where/how), optional photo; builds a cast of characters for the trip story

### Trip Events (Major Moments)
These are manually flagged milestones that anchor the story:
- Summit reached
- Flight boarded / landed
- Border crossed
- Wildlife spotted
- "Moment" — user-defined significant thing that happened

Each event gets a timestamp, optional note, optional photo, optional location pin.

---

## Entry UX Ideas

### Always-On Capture Bar
A persistent entry point (like a floating action button or bottom sheet) that lets the user:
- Tap mic → voice note → auto-transcribed
- Tap camera → capture with auto-tag to current trip
- Tap text → quick note with smart suggestions based on current location/time

### Day Recap Prompt
At the end of each travel day (configurable time, e.g., 8 PM), send a gentle notification:
> "Today: 12,400 steps · Parco Sempione · 47 photos · [Tap to add your notes]"
Opens a day recap editor where they can fill in the human story.

### Retroactive Import
For users who don't log during the trip, the app should be able to rebuild a trip entirely from existing phone data after the fact — camera roll + health data + calendar = skeleton timeline. User then annotates and enriches.

---

## Data Model Sketch

```
Trip
  ├── id, name, start_at, end_at, home_geofence
  ├── destinations[]
  ├── cover_image_ref
  └── tags[]

TimelineEntry
  ├── trip_id
  ├── timestamp, duration?
  ├── type: location | photo | video | workout | flight | transit |
  │         car_trip | note | voice_memo | conversation | place |
  │         event | milestone | weather | expense | person_met
  ├── source: automatic | manual
  ├── location: { lat, lng, altitude, accuracy }
  └── payload: <type-specific JSON>

Place
  ├── name, category (restaurant | trail | hotel | etc.)
  ├── location
  └── linked timeline_entries[]

Person
  ├── name, context, photo
  └── linked timeline_entries[]
```

---

## Permissions & Privacy

These permissions are required, and the onboarding flow needs to earn them:

| Permission | Why |
|---|---|
| Location (always-on) | GPS track, place visits, auto trip detection |
| Photo library | Camera roll scan and ingestion |
| Health / fitness | Workouts, steps, sleep |
| Calendar | Events, flights, reservations |
| Microphone | Voice memos |
| Notifications | Day recap prompts |
| Mail (or Share Extension) | Boarding pass / booking parsing |

**Privacy model:** All data lives on-device by default. Sync/backup is opt-in. No data sold. Story generation can happen on-device (local LLM) or via a user-controlled cloud key.

---

## Open Questions for Next Pass

- How does the app handle trips with multiple travelers? Shared trip / collaborative capture?
- Should workouts that are clearly not related to the trip (e.g., a gym session at home before departure) be excluded automatically?
- What's the right granularity for location track — every 30 seconds, significant changes only, or per route segment?
- Email parsing: native mail access (iOS MailKit extension) vs. asking user to forward confirmations to a trip email address vs. AI reading screenshots?
- Offline-first or cloud-backed? Adventure travel means unreliable connectivity.

---

*See [[02 - Storytelling and Presentation]] (next) for how to turn this data into a beautiful trip story.*
