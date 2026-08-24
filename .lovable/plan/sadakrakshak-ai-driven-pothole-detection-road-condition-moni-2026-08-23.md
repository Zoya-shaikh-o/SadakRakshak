# SadakRakshak — AI-Driven Pothole Detection & Road Condition Monitoring

A premium, research-grade smart-city web platform built as a fully functional prototype on demo data. Tagline: "Detect. Locate. Report. Resolve."

## Visual identity

- Dark "control room" base with deep slate/navy surfaces, an amber-to-signal-orange hazard accent and a teal "resolved" accent — road-infrastructure coded, not generic purple-on-white.
- Typography: Space Grotesk for headings/numerals, DM Sans for body — technical but warm.
- Glass-edge cards, subtle grid/scanline textures, gradient severity badges, soft glow on critical states, restrained entrance and hover motion.
- All colors as semantic tokens in `src/styles.css`; light mode supported.

## Pages

1. **Landing (`/`)** — hero with tagline, the problem (road fatalities, manual inspection gaps), how it works, the DETECT → … → RESOLVE cycle as an animated ribbon, prototype hardware section, CTA into the dashboard.
2. **Dashboard (`/dashboard`)** — KPI cards (total detected, unresolved, reported, under action, resolved), severity split, recent detections feed, overdue alerts, mini map.
3. **AI Detection (`/detection`)** — live-feel ESP32-CAM panel: captured road frame, Pothole/No Pothole classification, confidence meter, GPS readout, bus/route, and a scrolling detection history.
4. **Map (`/map`)** — interactive map of Indian road coordinates with severity-colored markers, filters (severity, status, authority, ward), click-through to profiles.
5. **Pothole profile (`/pothole/$id`)** — image, coordinates, first/last detection, repeat count, severity, status, responsible authority, verification state, grouped source detections, and a full first-detection-to-resolution timeline.
6. **Verification (`/verification`)** — queue to mark detections Confirmed Pothole / Potential False Positive / Requires Verification, with false-positive causes (speed breaker, rumble strip, shadow, patch, drainage cover) surfaced as AI hints.
7. **Duplicate grouping (`/grouping`)** — shows how detections from multiple buses within a proximity radius collapse into one pothole cluster while every raw detection is preserved.
8. **Authorities (`/authorities`)** — Municipal Corporation / PWD / NHAI-style owners with jurisdiction mapping, load, SLA and resolution stats; every mapping labelled as simulated.
9. **Reports (`/reports`)** — auto-generated complaint documents (image, location, GPS, severity, AI confidence, detection history, authority), preview + print/export, explicitly marked as a prototype draft, never "submitted to government".
10. **Authority dashboard (`/authority`)** — assigned complaints, pending, critical, resolution stats, status-update actions.
11. **Escalation (`/escalation`)** — overdue and unresolved cases with reminder levels and escalation ladder.
12. **Billboard (`/billboard`)** — full-screen public-safety display: "POTHOLE AHEAD — HIGH SEVERITY — SLOW DOWN", distance, cycling hazards, big-type LED aesthetic.
13. **Analytics (`/analytics`)** — detection trends, severity distribution, repeated-detection rate, resolution rate, response time, area-wise breakdown (Recharts).
14. **IoT status (`/iot`)** — ESP32-CAM, GPS module, SD-card storage, AI model health, uptime and per-bus device list.
15. **Architecture (`/architecture`)** — visually rich end-to-end flow diagram: road → bus → ESP32-CAM → capture → AI model → Pothole/No Pothole → GPS → SD card → processing → website → duplicate detection → authority mapping → reporting → reminders → billboard → resolution.
16. **AI Assistant (`/assistant`)** + floating button on every page — answers about potholes, unresolved cases, authorities, repeat detections, statistics and how the system works; can navigate the user to pages and explain a specific record; refuses to claim a real complaint was filed.

## Demo data

A single typed dataset module: 18 potholes across Pune/Mumbai-style wards, 6 buses on 4 routes, ~45 raw detections with repeats and timestamps, 4 authorities, all severities and statuses, verification states, reports and escalation timers. Internally consistent so every page derives numbers from the same source. Demo banners where authority mapping is simulated.

## Technical notes

- TanStack Start file routes, one route file per page, each with its own `head()` metadata.
- Map: `react-leaflet` with OpenStreetMap tiles, loaded client-only to avoid SSR issues.
- Charts: Recharts. Icons: lucide-react. Motion: subtle CSS/Tailwind transitions.
- Assistant is a rule/intent-based responder over the demo dataset (deterministic, no backend needed). If you want it to answer free-form questions with an LLM later, that needs Lovable Cloud — say the word and I'll add it.
- No backend, no auth: everything runs on the local demo dataset.
