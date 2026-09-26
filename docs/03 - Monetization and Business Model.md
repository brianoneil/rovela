# Rovela — Monetization & Business Model

---

## Model: Freemium Subscription

The right model for Rovela is **freemium with an annual subscription**. The free tier gets users hooked during a trip; the paywall hits when they want the best of what the app produces — stories, exports, unlimited history.

This is the proven model for premium consumer utility apps: Strava, Day One, AllTrails, Halide, Relive. All operate freemium with $35–80/year annual subscriptions.

---

## Pricing

| Plan | Price | Notes |
|---|---|---|
| **Free** | $0 | Generous enough to experience the core value |
| **Pro Monthly** | $7.99/month | For users who want to try before committing |
| **Pro Annual** | $59.99/year (~$5/mo) | Primary target — 37% discount vs monthly |
| **Lifetime** | $149.99 one-time | Early adopter offer only, limited window |

The annual plan should be the default shown. Monthly exists to reduce friction at the top of funnel; the goal is to migrate everyone to annual.

---

## Free vs. Pro

### Free tier (generous enough to love, limited enough to upgrade)

- Up to **3 trips** stored and active
- **Basic timeline** — GPS track, photos auto-ingested, place visits
- **Manual entry** — notes, voice memos, milestones
- **30-day history** — trips older than 30 days archived (viewable but not editable)
- Standard map view
- Photo highlights (up to 20/trip)

### Pro tier (where the magic lives)

- **Unlimited trips**, no expiry
- **Story Mode** — AI-generated narrative, editable, chapter structure
- **PDF Journal export** — print-ready travel book layout
- **Route trace video** — animated map export for social sharing
- **Trip in Numbers card** — shareable stats visual
- **Offline maps** — download tiles for areas with no connectivity
- **Full weather history** — detailed conditions per day/hour
- **Unlimited photo highlights** per trip
- **Elevation Portrait** and **Weather Tapestry** visuals
- **Multi-trip stats** — across all trips (total km, countries, elevation gained lifetime)
- **Priority background capture** — more frequent GPS sampling, faster processing
- **Early access** to new features

---

## Cost Structure

Understanding costs is critical for pricing sustainability.

| Cost | Estimate | Notes |
|---|---|---|
| **Mapbox GL** | ~$4 per 1K map loads | Primary infrastructure cost; heavy users could be expensive |
| **Claude API** (story gen) | ~$0.50–2.00 per story | Haiku model for cloud, on-device option for privacy |
| **Storage** | ~$0.023/GB/month (S3) | Photos + GPS tracks; a heavy user = ~2GB/year |
| **Push/background** | Minimal | Firebase or APNs |
| **App store cut** | 15–30% of revenue | Apple/Google take; drops to 15% after year 1 for small devs |

**Break-even estimate:** At $59.99/year and ~30% app store cut, net revenue per user = ~$42/year. With Mapbox + storage + AI costs averaging ~$8–12/year for an active user, contribution margin is ~$30/user/year. Need ~1,000 paying users to cover meaningful infrastructure + a part-time developer.

**Mapbox is the wildcard** — heavy users (multiple long trips/year) could cost $10–15/year in map loads alone. Options: negotiate volume pricing, implement tile caching aggressively, or use a self-hosted alternative (MapLibre + PMTiles) after reaching scale.

---

## Secondary Revenue Streams

### 1. Print partnerships
Integrate with a print-on-demand service (Artifact Uprising, Chatbooks, Blurb) to let users order a physical printed version of their Story Mode journal. Revenue share on each order — typically 15–25% affiliate margin. High emotional purchase, especially for milestone trips. No inventory risk.

### 2. One-shot exports (à la carte)
Users who don't want a subscription but have one great trip could pay $4.99 for a single Story Mode export or PDF journal. Creates a low-friction conversion path.

### 3. Gear affiliate
For upcoming trips, surface relevant gear recommendations (tent, pack, boots, camera gear) via affiliate links. REI, Backcountry, and Amazon all have affiliate programs. Natural fit — user is already planning an adventure. Keep it tasteful and sparse.

### 4. B2B / guided tours (future)
Guided expedition companies (Alpenglow, REI Adventures, National Geographic Expeditions) could white-label Rovela for their trips — participants get a shared Rovela trip as part of their experience. Higher ACV, longer sales cycle. A year-two or year-three play.

---

## Unit Economics Target

| Metric | Target (Year 1) | Target (Year 2) |
|---|---|---|
| Free users | 5,000 | 25,000 |
| Paid conversion rate | 8–12% | 10–15% |
| Paying users | 400–600 | 2,500–3,750 |
| ARPU (annual) | $52 net | $52 net |
| Annual revenue | ~$25K | ~$130–195K |
| Churn (annual) | <20% | <15% |

Year 1 is not about revenue — it's about finding the retention loop. Users who complete a Story Mode for a trip they care about have extremely high emotional attachment. That's the retention hook.

---

## Growth Model

### Organic / viral
Every Story Mode export and shareable card is a marketing asset. The route trace animation and Trip in Numbers card are designed to be posted on Instagram and Strava. Add a subtle "Made with Rovela" watermark on free exports, removable on Pro.

### Community channels
- Reddit: r/ultralight, r/solotravel, r/backpacking, r/hiking, r/CampingandHiking, r/overlanding
- Strava Clubs
- Trail running / mountaineering communities
- Adventure travel newsletters (The Expeditioner, Uncornered Market)

### Integrations as distribution
- **Strava** — pull in workouts, optionally push route summaries back to Strava
- **Garmin Connect** — import tracks from Garmin devices
- **Apple Health / Google Fit** — already integrated for data
- **iCloud Photos / Google Photos** — auto-import
Being in these ecosystems = discovery

### Platform partnerships
- Apple: pitch for App Store "Adventure" editorial feature; apps with beautiful map UX get featured regularly
- REI Co-op: partnership to bundle Rovela Pro with REI memberships or Adventures bookings

---

## Launch Strategy

### Phase 1 — Private beta (months 1–3)
- TestFlight (iOS) for 200–500 adventure travelers
- Recruit through r/ultralight, trail running clubs, mountaineering forums
- Goal: nail the core capture → story loop, find the "aha moment"
- No payment, just feedback

### Phase 2 — Early access (months 4–6)
- Open to waitlist, $49.99 lifetime offer (limited 500 spots)
- Creates urgency, funds early development, finds true believers
- Lifetime buyers become advocates

### Phase 3 — Public launch (month 6–9)
- App Store launch with full freemium model
- ProductHunt launch (coordinate for a Tuesday)
- Press outreach: Outdoor Retailer, Outside Magazine, adventure travel blogs
- iOS first, Android 3–6 months later

---

## Competitive Landscape

| App | Focus | Model | Gap Rovela fills |
|---|---|---|---|
| **Strava** | Fitness tracking | Freemium $10.99/mo | No trip narrative, no photos, no travel context |
| **Relive** | Route videos | Freemium | No story, no manual entry, no place/flight capture |
| **Polarsteps** | Trip tracking | Free (ad model) | No workouts, basic presentation, no story generation |
| **Day One** | Journaling | $34.99/yr | No automatic capture, no maps/tracks |
| **AllTrails** | Trail discovery | $35.99/yr | Single hikes only, no trip-level story |
| **Google Photos** | Photos + memories | Free | No spatial/temporal story, no workouts |

Rovela's moat: the only app that combines automatic multi-source capture (GPS + workouts + photos + flights + weather) with AI-powered storytelling into a premium narrative artifact. No one owns the full trip story.

---

## Risks

**Mapbox costs at scale** — mitigate with aggressive caching and consider MapLibre migration at 10K+ users.

**AI generation costs** — mitigate by offering on-device generation (private + free) as a differentiator; cloud generation as a Pro feature.

**Apple/Google platform risk** — HealthKit and background location are gated by Apple policy. Stay within guidelines; avoid anything that feels like tracking.

**Polarsteps is free** — users compare to free. Counter: Rovela's quality is clearly superior, and the $60/year cost is less than one night of a trip. Frame it that way.

**Retention after first trip** — if users only take 1–2 big trips/year, they churn. Counter with day-trip and weekend-trip use cases to increase frequency.

---

*See [[00 - Rovela Overview]] for project summary, [[01 - Capture and Entry]] for data layer, [[02 - Storytelling and Presentation]] for UX.*  
*Next: [[04 - Technical Architecture]] — data model, sync strategy, offline-first approach.*
