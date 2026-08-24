# Overall System Architecture of SadakRakshak — research-paper figure

Produce a standalone, IEEE-style architecture figure sized for an A4 portrait page, delivered as a downloadable file (not a change to the app).

## Output

- `architecture-sadakrakshak.svg` (vector, crisp at any zoom)
- `architecture-sadakrakshak.png` (300 DPI raster for Word/LaTeX)
- `architecture-sadakrakshak.pdf` (print-ready A4 portrait)

All three saved to your documents so you can download them directly.

## Figure content (top to bottom)

1. **Road Environment** — potholes, road surface, speed breakers, shadows, road patches.
2. **IoT Sensing Layer** — ESP32-CAM (image capture), GPS Module (location), SD Card (local storage).
3. **AI Detection Layer** — Image Preprocessing → ML Model → Pothole / No Pothole, with a side branch for false positives (speed breaker, road patch, shadow, rumble strip, drainage cover).
4. **Data Processing & Verification Layer** — Detection Record (image, classification, GPS, timestamp, metadata) → Verification → Duplicate Detection & Grouping (multi-bus detections merged into one pothole record, raw history preserved).
5. **Web Monitoring Layer** — central SadakRakshak Web Platform block with its functions listed in a compact grid: Dashboard, AI Detection, Interactive Map, Pothole Profile, Verification, Duplicate Grouping, Authority Mapping, Reports, Escalation, Analytics, IoT Status.
6. **Road Management Layer** — Authority/Jurisdiction Mapping → Prototype Report → Authority Monitoring → Status Tracking → Reminder & Escalation → Resolution.
7. **Public Safety & Interaction Layer** — two branches off the platform: Digital Billboard / Public Safety Warning (severity, distance alerts) and AI Assistant / Chatbot (records, statistics, authorities, unresolved cases, system info).
8. **Resolved Pothole → Continuous Monitoring / Re-detection**, with a labelled feedback arrow looping back into Duplicate Detection & Grouping.

Each layer sits in a labelled band with a subtle divider and a right-side layer caption, so the six layers read at a glance.

## Visual style

- Dark navy/slate canvas, rounded rectangular cards with thin borders.
- Amber/orange for hazard and detection paths, teal for verified/resolved, restrained blue/white for technical and data nodes.
- Thin connectors with small arrowheads; the feedback loop dashed and labelled.
- Single consistent sans typeface, clear size hierarchy, generous whitespace, no decorative illustration.
- Figure caption at the bottom: "Fig. 1 — Overall System Architecture of SadakRakshak".

## Technical notes

- Hand-authored SVG (exact control over spacing and alignment on a 2480x3508 px / A4 canvas), rasterized to PNG and PDF via a small script.
- Colors mirror the app's existing tokens (hazard amber, teal resolved, navy surfaces) so the paper matches the product.
- Every page of the output is rendered and visually inspected for clipping, overlap, or unreadable text before delivery.
- No changes to the SadakRakshak app itself.
