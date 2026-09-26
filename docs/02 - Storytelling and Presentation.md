# Travel Story App — Storytelling & Presentation

> The data is the raw material. The story is what the app actually delivers.

---

## Design Philosophy

The app has two modes of being: **live companion** during the trip, and **beautiful artifact** after it. Most travel apps serve one or the other. This one should nail both.

The visual language should feel like a high-end magazine crossed with a live map — editorial, spatial, and emotional. Data fades into the background. Feeling comes forward. When you open a finished trip, it should give you that same pang of "I was there" that flipping through old photos does, but richer, with context and texture the photos alone can't carry.

**Design principles:**
- Maps are the primary canvas, not a supplementary view
- Every piece of data has a visual form — nothing is just a list
- Typography carries the story; maps carry the space; photos carry the emotion
- Dark mode default — maps and memory both look better at night
- Never show raw data when you can show a feeling

---

## The Five Layers of Presentation

### 1. The Trip Cover — Cinematic Entry Point

The first thing you see when you open a completed trip. Full-screen, immersive.

**What's here:**
- Hero image — AI-selected best photo from the trip (or user-picked); full-bleed, edge-to-edge
- Trip name in large serif type over the image, with a subtle dark gradient
- Destination tagline (auto-generated: "8 days · Patagonia · 3 countries")
- Key stats in a minimal bottom bar: days, km traveled, elevation gained, photos taken
- Tap anywhere to enter the trip

**Animation:** When you open a trip, the route traces itself across the map underneath the photo — visible through a subtle map peek at the bottom. The trace finishes, then the photo fades in. Takes about 2 seconds. Sets the mood.

---

### 2. The Map — Central Visual Anchor

The map is not a screen you navigate to. It's the foundation the whole app lives on. Available as a persistent layer behind almost every view.

**Track rendering:**
- GPS polyline rendered per day with a distinct color per day (day 1 = warm amber, day 2 = teal, etc.) — so the map tells you how you moved through time
- Line weight scales with zoom level
- Walking tracks: solid line. Running: slightly thicker with pace-shading. Driving: thinner, dashed. Cycling: medium. Flight arcs: curved great-circle lines at high altitude with a plane icon
- Elevation-colored trails for hikes: green (flat) → yellow → orange → red (steep) — like a real topo map

**Markers:**
- Photos: small circular thumbnails pinned to where they were taken; tap to open. Clusters merge intelligently at lower zoom (not a number badge — a collage of 3–4 thumbnails)
- Places: custom icons by category (fork/knife for food, tent for camping, mountain for peaks, bed for accommodation)
- Milestones: star markers for user-flagged moments
- Weather: subtle condition icons at the day's starting point (sun, cloud, rain, snow)

**Map style:**
- Custom Mapbox style — not the default Google Maps look. Something muted and earthy for outdoors: think warm grays, desaturated terrain, topo contours visible at mid-zoom. Not a road atlas, more like a field map
- Satellite/terrain toggle for hiking areas
- Night mode that desaturates further and increases contrast on the track

**Time scrubber:**
- A horizontal scrubber at the bottom of the map view
- Drag it and a dot moves along your route showing where you were at that moment
- Nearby photos surface as you scrub past them
- Weather and time of day update subtly (sky color behind the map shifts)

---

### 3. The Chronicle — Scrollable Trip Timeline

The primary content view. A beautiful vertical timeline of everything that happened, day by day.

**Structure:**
```
[ Day 1 Header — sticky ]
  [ Morning weather chip ]
  [ Photo cluster — 3 highlights from the morning ]
  [ Workout card — 14km hike · 1,200m elevation · 4h32m ]
  [ Place card — Refugio Frey ★ visited 2:14 PM ]
  [ Note — voice memo transcript excerpt ]
  [ Milestone — "Summit reached · Cerro Catedral" ]
[ Day 2 Header — sticky ]
  ...
```

**Day headers:**
- Date + day name in bold
- One-line weather summary: "Sunny, 18°C · High winds in the afternoon"
- Step count and active minutes as small chips
- Tap to collapse/expand the day

**Photo clusters:**
- Don't show every photo — auto-curate 3–5 highlights per day (sharpness + composition scoring + diversity of subject)
- Displayed as a staggered grid — not a uniform grid; some photos larger, some smaller, like a magazine layout
- Tap a cluster to open the full day gallery in a lightbox

**Workout cards:**
- Activity type icon + name
- Key stats: distance, duration, elevation gain, avg heart rate
- Mini elevation profile chart (a small sparkline) inline
- Tap to expand: full map of the route, full stats, heart rate graph

**Place cards:**
- Place name + category icon
- User's note or review (if added)
- Arrival and departure times
- Tap to see on map

**Conversation / People cards:**
- Subtle quote card format — italic text excerpt, person's name
- Soft background color to distinguish from factual entries

---

### 4. Day View — Deep Dive on a Single Day

Tap a day header in the Chronicle to enter the Day View. This is the richest single view.

**Layout (scroll vertically):**

1. **Day map** — full-width, shows just that day's track, photos, and places. Interactive.
2. **Weather ribbon** — morning / afternoon / evening conditions shown as a horizontal strip with icons, temperature, and wind. Not a table — more like a weather painting (clear morning sky colors, afternoon cloud colors, etc.)
3. **Photo gallery** — full-width horizontal scroll of all that day's photos, full-bleed. Tap to open.
4. **Activity section** — workout(s) for the day with the full elevation profile chart
5. **Places section** — a horizontal card scroll of every place visited, with arrival/departure times
6. **Your notes** — voice memo transcripts and text notes in a clean reading format
7. **People met** — cast of characters cards for anyone added that day
8. **Day in numbers** — small infographic: steps, km, photos, elevation, time outdoors

---

### 5. Story Mode — The Narrative Layer

This is the "sit down with a coffee and relive it" view. Available after the trip ends.

**What it is:**
An auto-generated narrative trip story, structured like chapters, presented like a long-form magazine piece. The AI weaves together the data, the photos, the notes, and the voice memos into prose — not robotic data narration, but a genuine story draft that the user can edit.

**Structure:**
- **Prologue** — where you were coming from, what the trip was
- **Chapters** — one per destination or major leg of the trip
  - Opening photo: full-bleed hero for that chapter
  - 2–3 paragraphs of narrative (AI-generated, user-editable)
  - Inline photos with captions
  - Pull quotes from notes/voice memos
  - Map moment: a small inline map showing where this chapter took place
  - Workout highlight if there was one (with mini elevation chart)
- **Epilogue** — final reflections, trip stats card

**Editing:**
- Tap any paragraph to edit it
- AI suggestions in the margin: "You mentioned the storm in a voice note — want to add that here?"
- Add or remove photos from each chapter
- Reorder chapters

**Typography:**
- Chapter titles: large, bold serif
- Body narrative: comfortable reading serif, ~18px, generous line height
- Data callouts: small caps sans-serif
- Pull quotes: large, italic, colored accent

---

## Special Presentation Elements

### Elevation Portrait
For hiking-heavy trips, generate a composite elevation profile of the whole trip — all hiking days stacked or arranged on a single chart. Beautiful as a standalone visual, shareable as a "what I climbed" card.

### Route Map Print
A clean, minimal map poster of the full trip route — styled like a running poster but for the whole journey. Export as high-res PNG or PDF. Looks good framed.

### Weather Tapestry
A visual representation of the trip's weather: each day is a vertical stripe, colored by condition and temperature (blue = cold/rain, orange/yellow = warm/sunny, gray = overcast). Shows the whole trip at a glance as an abstract color bar. Gives you the feeling of the trip's weather arc.

### Trip in Numbers Card
A shareable card (Spotify Wrapped style) with the trip's headline stats:
- X days · X countries · X cities
- X km traveled (broken down by mode)
- X m of elevation gained
- X photos taken · X videos
- X workouts
- Biggest day (steps/distance)
- Best photo (AI-selected)

### The Cast
A page showing everyone met on the trip — photos, names, where/when encountered. A crew page for the adventure.

---

## Sharing & Export

### In-app sharing
- Any card, photo, map view, or stat can be shared as an image — long-press → Share
- Share a day or the whole trip as a link to a web view (responsive, beautiful, like a mini travel site)

### Export formats
- **PDF Journal** — the full Story Mode narrative as a formatted PDF, print-ready. Looks like a real travel book.
- **GPX Export** — the full GPS track, compatible with Strava, Garmin, Komoot
- **Photo Album** — export the curated highlights as a shared album

### Social cards
- Pre-formatted for Instagram Stories (9:16) and square posts
- Route trace animation export — the map route drawing itself as a short video (like Strava's flyby but for the whole trip)
- Elevation profile as a shareable image

---

## Moments Feed (Home Screen)

When the user isn't in an active trip, the home screen surfaces **Memories** — past trip moments surfaced on their anniversary, or "On this day" style prompts.

"Two years ago today, you were in Patagonia" → tap to open that day in the Chronicle.

Also shows: upcoming trip (if one is set), recent photos from trips, and a "Start a new trip" prompt.

---

## Animation & Motion Principles

- Route traces should animate at 60fps — smooth, satisfying
- Photo transitions: crossfade with a subtle parallax, not a jarring cut
- Day transitions in the Chronicle: smooth scroll with sticky header momentum
- Map zooms: ease-in-out, never jarring
- Loading states: skeleton screens that look like the content shape, not spinners
- Elevation charts: draw in on first view (left to right, 800ms ease)

---

## Tech Notes for Presentation Layer

- **Maps:** Mapbox GL (React Native compatible, custom styles, offline tiles for adventure use)
- **Charts:** Victory Native or Recharts for elevation profiles and weather charts
- **Photos:** Expo Image or fast-image with blurhash placeholders
- **Animations:** React Native Reanimated 3 + Skia for map overlays and custom drawing
- **Story generation:** Claude API (on-device model for privacy mode, or Haiku for cloud)
- **PDF export:** react-native-html-to-pdf or a server-side render of the web story view
- **Offline:** All map tiles and data cached locally; storytelling works fully offline

---

*See [[01 - Capture and Entry]] for the data layer that feeds this presentation.*
*Next: [[03 - Technical Architecture]] — data model, sync, offline strategy, and platform decisions.*
