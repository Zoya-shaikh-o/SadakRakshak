/**
 * SadakRakshak demo dataset.
 *
 * ALL DATA IN THIS FILE IS FICTIONAL PROTOTYPE DATA created for an academic
 * demonstration. Authority mappings are SIMULATED and are not connected to any
 * real municipal, state or national body. No real complaint is ever filed.
 */

export type Severity = "critical" | "high" | "medium" | "low";
export type Status = "unresolved" | "reported" | "under_action" | "resolved";
export type Verification = "confirmed" | "false_positive" | "requires_verification";

export interface Authority {
  id: string;
  name: string;
  shortName: string;
  type: "Municipal Corporation" | "PWD" | "National Highway" | "Cantonment Board";
  jurisdiction: string;
  contact: string;
  slaHours: number;
  officer: string;
}

export interface Bus {
  id: string;
  fleetNo: string;
  route: string;
  routeName: string;
  device: string;
  firmware: string;
  status: "online" | "offline" | "maintenance";
  sdUsedPct: number;
  gpsFix: "3D Fix" | "2D Fix" | "No Fix";
  lastSync: string;
  detections: number;
  uptimePct: number;
}

export interface Detection {
  id: string;
  potholeId: string;
  busId: string;
  timestamp: string;
  confidence: number;
  lat: number;
  lng: number;
  label: "Pothole" | "No Pothole";
  speedKmph: number;
  frame: string;
  note?: string | undefined;
}

export interface TimelineEvent {
  at: string;
  kind: "detected" | "grouped" | "verified" | "reported" | "assigned" | "reminder" | "action" | "resolved";
  title: string;
  detail: string;
}

export interface Pothole {
  id: string;
  code: string;
  road: string;
  area: string;
  ward: string;
  lat: number;
  lng: number;
  severity: Severity;
  status: Status;
  verification: Verification;
  falsePositiveHint?: string | undefined;
  authorityId: string;
  widthCm: number;
  depthCm: number;
  avgConfidence: number;
  firstDetected: string;
  lastDetected: string;
  repeatCount: number;
  buses: string[];
  reportId?: string | undefined;
  reportedOn?: string | undefined;
  resolvedOn?: string | undefined;
  dueOn?: string | undefined;
  remindersSent: number;
  image: string;
  timeline: TimelineEvent[];
}

export const DEMO_NOTICE =
  "Prototype demonstration — all detections, authority mappings and complaint records shown here are simulated demo data.";

export const authorities: Authority[] = [
  {
    id: "auth-pmc",
    name: "Pune Municipal Corporation (Roads Dept.)",
    shortName: "PMC Roads",
    type: "Municipal Corporation",
    jurisdiction: "City roads inside PMC limits — Shivajinagar, Kothrud, Deccan, Swargate",
    contact: "roads.demo@pmc.example",
    slaHours: 72,
    officer: "Jr. Engineer, Ward Works Cell (demo)",
  },
  {
    id: "auth-pwd",
    name: "State Public Works Department (Div. II)",
    shortName: "PWD Div. II",
    type: "PWD",
    jurisdiction: "State highways and connector corridors — Katraj bypass, Saswad Road",
    contact: "div2.demo@pwd.example",
    slaHours: 120,
    officer: "Sectional Engineer, Div. II (demo)",
  },
  {
    id: "auth-nh",
    name: "National Highway Maintenance Cell (NH-48 stretch)",
    shortName: "NH Cell",
    type: "National Highway",
    jurisdiction: "NH-48 service roads and main carriageway within metro limits",
    contact: "nh48.demo@highways.example",
    slaHours: 96,
    officer: "Site Maintenance Manager (demo)",
  },
  {
    id: "auth-pcb",
    name: "Cantonment Board Works Section",
    shortName: "Cantt. Works",
    type: "Cantonment Board",
    jurisdiction: "Cantonment area internal roads — Camp, Wanowrie approach",
    contact: "works.demo@cantt.example",
    slaHours: 96,
    officer: "Works Supervisor (demo)",
  },
];

export const buses: Bus[] = [
  {
    id: "bus-01",
    fleetNo: "MH-12-PT-1042",
    route: "R-14",
    routeName: "Swargate → Kothrud Depot",
    device: "ESP32-CAM #A1",
    firmware: "v2.3.1",
    status: "online",
    sdUsedPct: 62,
    gpsFix: "3D Fix",
    lastSync: "2026-08-23T09:41:00+05:30",
    detections: 41,
    uptimePct: 98.4,
  },
  {
    id: "bus-02",
    fleetNo: "MH-12-PT-2277",
    route: "R-14",
    routeName: "Swargate → Kothrud Depot",
    device: "ESP32-CAM #A2",
    firmware: "v2.3.1",
    status: "online",
    sdUsedPct: 48,
    gpsFix: "3D Fix",
    lastSync: "2026-08-23T09:38:00+05:30",
    detections: 33,
    uptimePct: 97.1,
  },
  {
    id: "bus-03",
    fleetNo: "MH-12-PT-3391",
    route: "R-22",
    routeName: "Shivajinagar → Hadapsar",
    device: "ESP32-CAM #B1",
    firmware: "v2.3.0",
    status: "online",
    sdUsedPct: 71,
    gpsFix: "3D Fix",
    lastSync: "2026-08-23T09:29:00+05:30",
    detections: 38,
    uptimePct: 95.8,
  },
  {
    id: "bus-04",
    fleetNo: "MH-12-PT-4118",
    route: "R-22",
    routeName: "Shivajinagar → Hadapsar",
    device: "ESP32-CAM #B2",
    firmware: "v2.2.8",
    status: "maintenance",
    sdUsedPct: 88,
    gpsFix: "2D Fix",
    lastSync: "2026-08-22T18:12:00+05:30",
    detections: 19,
    uptimePct: 81.2,
  },
  {
    id: "bus-05",
    fleetNo: "MH-12-PT-5563",
    route: "R-07",
    routeName: "Katraj → Deccan Corridor",
    device: "ESP32-CAM #C1",
    firmware: "v2.3.1",
    status: "online",
    sdUsedPct: 35,
    gpsFix: "3D Fix",
    lastSync: "2026-08-23T09:44:00+05:30",
    detections: 27,
    uptimePct: 96.6,
  },
  {
    id: "bus-06",
    fleetNo: "MH-12-PT-6820",
    route: "R-31",
    routeName: "Camp → Wanowrie Loop",
    device: "ESP32-CAM #D1",
    firmware: "v2.3.1",
    status: "offline",
    sdUsedPct: 54,
    gpsFix: "No Fix",
    lastSync: "2026-08-23T06:02:00+05:30",
    detections: 22,
    uptimePct: 88.9,
  },
];

import road1 from "@/assets/road-1.jpg";
import road2 from "@/assets/road-2.jpg";
import road3 from "@/assets/road-3.jpg";
import road4 from "@/assets/road-4.jpg";

const imgPool = [road1, road2, road3, road4, road1, road3];


interface Seed {
  code: string;
  road: string;
  area: string;
  ward: string;
  lat: number;
  lng: number;
  severity: Severity;
  status: Status;
  verification: Verification;
  fp?: string;
  auth: string;
  w: number;
  d: number;
  conf: number;
  first: string;
  last: string;
  repeats: number;
  buses: string[];
  reported?: string;
  resolved?: string;
  due?: string;
  reminders: number;
}

const seeds: Seed[] = [
  { code: "PH-1001", road: "Karve Road", area: "Kothrud", ward: "Ward 12", lat: 18.5057, lng: 73.8156, severity: "critical", status: "under_action", verification: "confirmed", auth: "auth-pmc", w: 92, d: 21, conf: 0.96, first: "2026-08-04T08:12:00+05:30", last: "2026-08-22T18:44:00+05:30", repeats: 14, buses: ["bus-01", "bus-02", "bus-05"], reported: "2026-08-05T10:00:00+05:30", due: "2026-08-08T10:00:00+05:30", reminders: 3 },
  { code: "PH-1002", road: "JM Road", area: "Shivajinagar", ward: "Ward 08", lat: 18.5246, lng: 73.8419, severity: "high", status: "reported", verification: "confirmed", auth: "auth-pmc", w: 71, d: 14, conf: 0.93, first: "2026-08-09T07:55:00+05:30", last: "2026-08-23T08:31:00+05:30", repeats: 9, buses: ["bus-03", "bus-05"], reported: "2026-08-10T09:30:00+05:30", due: "2026-08-13T09:30:00+05:30", reminders: 2 },
  { code: "PH-1003", road: "Satara Road", area: "Swargate", ward: "Ward 15", lat: 18.4938, lng: 73.8577, severity: "medium", status: "unresolved", verification: "requires_verification", fp: "Nearby drainage cover may share the frame", auth: "auth-pmc", w: 44, d: 8, conf: 0.71, first: "2026-08-18T17:22:00+05:30", last: "2026-08-22T17:09:00+05:30", repeats: 4, buses: ["bus-01"], reminders: 0 },
  { code: "PH-1004", road: "Katraj Bypass", area: "Katraj", ward: "SH Corridor", lat: 18.4482, lng: 73.8577, severity: "critical", status: "unresolved", verification: "confirmed", auth: "auth-pwd", w: 118, d: 26, conf: 0.97, first: "2026-08-12T06:41:00+05:30", last: "2026-08-23T06:58:00+05:30", repeats: 17, buses: ["bus-05", "bus-01"], due: "2026-08-17T06:41:00+05:30", reminders: 2 },
  { code: "PH-1005", road: "Solapur Road", area: "Hadapsar", ward: "Ward 21", lat: 18.5089, lng: 73.9259, severity: "high", status: "under_action", verification: "confirmed", auth: "auth-pmc", w: 66, d: 16, conf: 0.91, first: "2026-08-07T09:05:00+05:30", last: "2026-08-21T09:47:00+05:30", repeats: 11, buses: ["bus-03", "bus-04"], reported: "2026-08-08T11:15:00+05:30", due: "2026-08-11T11:15:00+05:30", reminders: 2 },
  { code: "PH-1006", road: "NH-48 Service Road", area: "Baner Junction", ward: "NH Stretch", lat: 18.5601, lng: 73.7789, severity: "high", status: "reported", verification: "confirmed", auth: "auth-nh", w: 78, d: 15, conf: 0.94, first: "2026-08-14T07:18:00+05:30", last: "2026-08-23T07:26:00+05:30", repeats: 8, buses: ["bus-05"], reported: "2026-08-15T10:05:00+05:30", due: "2026-08-19T10:05:00+05:30", reminders: 1 },
  { code: "PH-1007", road: "Sassoon Road", area: "Camp", ward: "Cantt. Sector 3", lat: 18.5289, lng: 73.8747, severity: "medium", status: "resolved", verification: "confirmed", auth: "auth-pcb", w: 39, d: 9, conf: 0.88, first: "2026-07-26T08:40:00+05:30", last: "2026-08-03T08:11:00+05:30", repeats: 6, buses: ["bus-06", "bus-03"], reported: "2026-07-27T09:00:00+05:30", resolved: "2026-08-06T15:20:00+05:30", due: "2026-07-31T09:00:00+05:30", reminders: 1 },
  { code: "PH-1008", road: "Wanowrie Main Road", area: "Wanowrie", ward: "Cantt. Sector 5", lat: 18.4859, lng: 73.8991, severity: "low", status: "unresolved", verification: "false_positive", fp: "Repeated signature matches a speed breaker profile", auth: "auth-pcb", w: 22, d: 3, conf: 0.58, first: "2026-08-19T16:33:00+05:30", last: "2026-08-22T16:41:00+05:30", repeats: 5, buses: ["bus-06"], reminders: 0 },
  { code: "PH-1009", road: "Paud Road", area: "Kothrud", ward: "Ward 12", lat: 18.5089, lng: 73.8004, severity: "high", status: "unresolved", verification: "confirmed", auth: "auth-pmc", w: 69, d: 17, conf: 0.92, first: "2026-08-11T18:02:00+05:30", last: "2026-08-23T07:52:00+05:30", repeats: 12, buses: ["bus-01", "bus-02"], due: "2026-08-16T18:02:00+05:30", reminders: 3 },
  { code: "PH-1010", road: "Fergusson College Road", area: "Deccan", ward: "Ward 08", lat: 18.5215, lng: 73.8391, severity: "medium", status: "under_action", verification: "confirmed", auth: "auth-pmc", w: 47, d: 11, conf: 0.86, first: "2026-08-13T10:20:00+05:30", last: "2026-08-21T10:04:00+05:30", repeats: 7, buses: ["bus-05", "bus-03"], reported: "2026-08-14T12:00:00+05:30", due: "2026-08-17T12:00:00+05:30", reminders: 1 },
  { code: "PH-1011", road: "Saswad Road", area: "Phursungi", ward: "SH Corridor", lat: 18.4691, lng: 73.9412, severity: "critical", status: "reported", verification: "confirmed", auth: "auth-pwd", w: 104, d: 24, conf: 0.95, first: "2026-08-10T06:12:00+05:30", last: "2026-08-23T06:20:00+05:30", repeats: 13, buses: ["bus-03", "bus-04"], reported: "2026-08-11T09:10:00+05:30", due: "2026-08-16T09:10:00+05:30", reminders: 3 },
  { code: "PH-1012", road: "Nagar Road", area: "Yerawada", ward: "Ward 18", lat: 18.5533, lng: 73.8891, severity: "medium", status: "resolved", verification: "confirmed", auth: "auth-pmc", w: 41, d: 10, conf: 0.89, first: "2026-07-29T07:30:00+05:30", last: "2026-08-05T07:44:00+05:30", repeats: 6, buses: ["bus-03"], reported: "2026-07-30T10:00:00+05:30", resolved: "2026-08-02T14:10:00+05:30", due: "2026-08-02T10:00:00+05:30", reminders: 0 },
  { code: "PH-1013", road: "Sinhagad Road", area: "Vadgaon", ward: "Ward 14", lat: 18.4671, lng: 73.8189, severity: "high", status: "unresolved", verification: "requires_verification", fp: "Shadow band from flyover pier reduces contrast", auth: "auth-pmc", w: 63, d: 13, conf: 0.74, first: "2026-08-16T17:48:00+05:30", last: "2026-08-23T08:02:00+05:30", repeats: 8, buses: ["bus-01", "bus-05"], due: "2026-08-21T17:48:00+05:30", reminders: 1 },
  { code: "PH-1014", road: "Airport Road", area: "Lohegaon", ward: "Ward 19", lat: 18.5793, lng: 73.9089, severity: "low", status: "resolved", verification: "confirmed", auth: "auth-pmc", w: 26, d: 5, conf: 0.83, first: "2026-07-31T09:12:00+05:30", last: "2026-08-04T09:20:00+05:30", repeats: 3, buses: ["bus-03"], reported: "2026-08-01T11:00:00+05:30", resolved: "2026-08-04T16:40:00+05:30", due: "2026-08-04T11:00:00+05:30", reminders: 0 },
  { code: "PH-1015", road: "Bund Garden Road", area: "Sangamvadi", ward: "Ward 17", lat: 18.5372, lng: 73.8781, severity: "medium", status: "reported", verification: "confirmed", auth: "auth-pmc", w: 52, d: 12, conf: 0.9, first: "2026-08-15T08:26:00+05:30", last: "2026-08-22T08:33:00+05:30", repeats: 7, buses: ["bus-06", "bus-03"], reported: "2026-08-16T09:45:00+05:30", due: "2026-08-19T09:45:00+05:30", reminders: 1 },
  { code: "PH-1016", road: "NH-48 Main Carriageway", area: "Wakad Approach", ward: "NH Stretch", lat: 18.5972, lng: 73.7628, severity: "critical", status: "under_action", verification: "confirmed", auth: "auth-nh", w: 126, d: 28, conf: 0.98, first: "2026-08-06T05:58:00+05:30", last: "2026-08-22T06:11:00+05:30", repeats: 16, buses: ["bus-05", "bus-02"], reported: "2026-08-07T08:20:00+05:30", due: "2026-08-11T08:20:00+05:30", reminders: 3 },
  { code: "PH-1017", road: "Law College Road", area: "Erandwane", ward: "Ward 11", lat: 18.5136, lng: 73.8302, severity: "low", status: "unresolved", verification: "false_positive", fp: "Fresh bitumen patch classified as depression", auth: "auth-pmc", w: 19, d: 2, conf: 0.55, first: "2026-08-20T15:14:00+05:30", last: "2026-08-22T15:22:00+05:30", repeats: 4, buses: ["bus-02"], reminders: 0 },
  { code: "PH-1018", road: "Hadapsar Bypass", area: "Magarpatta", ward: "Ward 21", lat: 18.5142, lng: 73.9366, severity: "high", status: "unresolved", verification: "confirmed", auth: "auth-pwd", w: 74, d: 18, conf: 0.93, first: "2026-08-08T18:36:00+05:30", last: "2026-08-23T07:14:00+05:30", repeats: 10, buses: ["bus-04", "bus-03"], due: "2026-08-13T18:36:00+05:30", reminders: 2 },
];

function jitter(base: number, i: number, scale = 0.00035) {
  return +(base + (((i * 37) % 11) - 5) * scale).toFixed(6);
}

function addMinutes(iso: string, mins: number) {
  return new Date(new Date(iso).getTime() + mins * 60000).toISOString();
}

function label(kind: Verification) {
  return kind === "confirmed"
    ? "Confirmed Pothole"
    : kind === "false_positive"
      ? "Potential False Positive"
      : "Requires Verification";
}

export const potholes: Pothole[] = seeds.map((s, idx) => {
  const timeline: TimelineEvent[] = [
    {
      at: s.first,
      kind: "detected",
      title: "First detection",
      detail: `Captured by ${s.buses[0]?.toUpperCase()} ESP32-CAM at ${s.lat.toFixed(4)}, ${s.lng.toFixed(4)} with ${(s.conf * 100).toFixed(0)}% confidence.`,
    },
    {
      at: addMinutes(s.first, 6),
      kind: "grouped",
      title: "Duplicate grouping applied",
      detail: `${s.repeats} raw detections from ${s.buses.length} bus(es) clustered within a 15 m proximity radius into ${s.code}.`,
    },
    {
      at: addMinutes(s.first, 25),
      kind: "verified",
      title: `AI verification — ${label(s.verification)}`,
      detail: s.fp ?? "Cross-frame consistency and depth estimate matched the pothole class.",
    },
  ];
  if (s.reported) {
    timeline.push({
      at: s.reported,
      kind: "reported",
      title: "Complaint report generated",
      detail: "Prototype report package compiled (image, GPS, severity, confidence, history). Demo only — not filed with any real authority.",
    });
    timeline.push({
      at: addMinutes(s.reported, 45),
      kind: "assigned",
      title: "Routed to responsible authority",
      detail: `Simulated jurisdiction match assigned this case to ${authorities.find((a) => a.id === s.auth)?.shortName}.`,
    });
  }
  for (let r = 0; r < s.reminders; r++) {
    timeline.push({
      at: addMinutes(s.reported ?? s.first, 1440 * (r + 2)),
      kind: "reminder",
      title: `Reminder level ${r + 1} issued`,
      detail: "Automated escalation notice raised because the case crossed its SLA window.",
    });
  }
  if (s.status === "under_action") {
    timeline.push({
      at: addMinutes(s.reported ?? s.first, 4320),
      kind: "action",
      title: "Repair work in progress",
      detail: "Authority marked the case as under action in the prototype authority dashboard.",
    });
  }
  if (s.resolved) {
    timeline.push({
      at: s.resolved,
      kind: "resolved",
      title: "Marked resolved",
      detail: "Re-survey pass by the fleet returned No Pothole for three consecutive runs.",
    });
  }
  timeline.sort((a, b) => +new Date(a.at) - +new Date(b.at));

  return {
    id: s.code.toLowerCase(),
    code: s.code,
    road: s.road,
    area: s.area,
    ward: s.ward,
    lat: s.lat,
    lng: s.lng,
    severity: s.severity,
    status: s.status,
    verification: s.verification,
    falsePositiveHint: s.fp,
    authorityId: s.auth,
    widthCm: s.w,
    depthCm: s.d,
    avgConfidence: s.conf,
    firstDetected: s.first,
    lastDetected: s.last,
    repeatCount: s.repeats,
    buses: s.buses,
    reportId: s.reported ? `RPT-${s.code.slice(3)}` : undefined,
    reportedOn: s.reported,
    resolvedOn: s.resolved,
    dueOn: s.due,
    remindersSent: s.reminders,
    image: imgPool[idx % imgPool.length]!,
    timeline,
  };
});

export const detections: Detection[] = potholes.flatMap((p, pi) => {
  const n = Math.min(p.repeatCount, 6);
  const span = +new Date(p.lastDetected) - +new Date(p.firstDetected);
  return Array.from({ length: n }, (_, i) => {
    const busId = p.buses[i % p.buses.length]!;
    const ts = new Date(+new Date(p.firstDetected) + (span / Math.max(n - 1, 1)) * i).toISOString();
    return {
      id: `${p.code}-D${String(i + 1).padStart(2, "0")}`,
      potholeId: p.id,
      busId,
      timestamp: ts,
      confidence: Math.min(0.99, Math.max(0.51, +(p.avgConfidence + ((i % 3) - 1) * 0.03).toFixed(2))),
      lat: jitter(p.lat, i + pi),
      lng: jitter(p.lng, i + pi + 3),
      label: "Pothole" as const,
      speedKmph: 22 + ((i * 7 + pi * 3) % 19),
      frame: p.image,
      note: i === 0 ? "First frame that opened this cluster" : undefined,
    };
  });
});

export const severityOrder: Severity[] = ["critical", "high", "medium", "low"];

export const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const statusLabel: Record<Status, string> = {
  unresolved: "Unresolved",
  reported: "Reported",
  under_action: "Under Action",
  resolved: "Resolved",
};

export const verificationLabel: Record<Verification, string> = {
  confirmed: "Confirmed Pothole",
  false_positive: "Potential False Positive",
  requires_verification: "Requires Verification",
};

export const falsePositiveCauses = [
  { name: "Speed breaker", note: "Periodic full-width shadow with symmetric rise", share: 34 },
  { name: "Rumble strip", note: "High-frequency repeating texture across the lane", share: 19 },
  { name: "Hard shadow", note: "Low-sun or pier shadow read as a depression", share: 17 },
  { name: "Road patch", note: "Fresh bitumen patch with dark albedo", share: 15 },
  { name: "Drainage cover", note: "Circular metal cover slightly below grade", share: 10 },
  { name: "Debris / wet spot", note: "Transient object, not present across runs", share: 5 },
];

export const authorityById = (id: string) => authorities.find((a) => a.id === id);
export const busById = (id: string) => buses.find((b) => b.id === id);
export const potholeById = (id: string) => potholes.find((p) => p.id === id.toLowerCase());
export const detectionsFor = (potholeId: string) => detections.filter((d) => d.potholeId === potholeId);

export const NOW = new Date("2026-08-23T10:04:00Z");

export function isOverdue(p: Pothole) {
  return !!p.dueOn && p.status !== "resolved" && +new Date(p.dueOn) < +NOW;
}

export function daysOverdue(p: Pothole) {
  if (!p.dueOn) return 0;
  return Math.max(0, Math.round((+NOW - +new Date(p.dueOn)) / 86400000));
}

export const stats = (() => {
  const total = potholes.length;
  const by = (s: Status) => potholes.filter((p) => p.status === s).length;
  const sev = (s: Severity) => potholes.filter((p) => p.severity === s).length;
  const resolved = by("resolved");
  const resolutionTimes = potholes
    .filter((p) => p.resolvedOn)
    .map((p) => (+new Date(p.resolvedOn!) - +new Date(p.firstDetected)) / 86400000);
  return {
    total,
    totalDetections: detections.length,
    rawDetections: potholes.reduce((a, p) => a + p.repeatCount, 0),
    unresolved: by("unresolved"),
    reported: by("reported"),
    underAction: by("under_action"),
    resolved,
    critical: sev("critical"),
    high: sev("high"),
    medium: sev("medium"),
    low: sev("low"),
    resolutionRate: Math.round((resolved / total) * 100),
    repeatRate: Math.round(
      (potholes.filter((p) => p.repeatCount > 1).length / total) * 100,
    ),
    avgConfidence: Math.round((potholes.reduce((a, p) => a + p.avgConfidence, 0) / total) * 100),
    avgResponseDays: +(
      resolutionTimes.reduce((a, b) => a + b, 0) / Math.max(resolutionTimes.length, 1)
    ).toFixed(1),
    overdue: potholes.filter(isOverdue).length,
    confirmed: potholes.filter((p) => p.verification === "confirmed").length,
    needsVerification: potholes.filter((p) => p.verification === "requires_verification").length,
    falsePositives: potholes.filter((p) => p.verification === "false_positive").length,
  };
})();

export const trendData = [
  { day: "Jul 26", detections: 6, resolved: 0 },
  { day: "Jul 30", detections: 9, resolved: 1 },
  { day: "Aug 03", detections: 12, resolved: 2 },
  { day: "Aug 07", detections: 18, resolved: 3 },
  { day: "Aug 11", detections: 24, resolved: 3 },
  { day: "Aug 15", detections: 31, resolved: 4 },
  { day: "Aug 19", detections: 37, resolved: 4 },
  { day: "Aug 23", detections: 44, resolved: 4 },
];

export const responseTimeData = authorities.map((a) => {
  const cases = potholes.filter((p) => p.authorityId === a.id);
  const done = cases.filter((c) => c.resolvedOn);
  const avg = done.length
    ? +(
        done.reduce((s, c) => s + (+new Date(c.resolvedOn!) - +new Date(c.firstDetected)) / 86400000, 0) /
        done.length
      ).toFixed(1)
    : +(a.slaHours / 24 + 2.4).toFixed(1);
  return { authority: a.shortName, avgDays: avg, cases: cases.length, sla: +(a.slaHours / 24).toFixed(1) };
});

export const areaStats = Object.values(
  potholes.reduce<Record<string, { area: string; count: number; critical: number; resolved: number }>>(
    (acc, p) => {
      acc[p.area] ??= { area: p.area, count: 0, critical: 0, resolved: 0 };
      acc[p.area]!.count++;
      if (p.severity === "critical") acc[p.area]!.critical++;
      if (p.status === "resolved") acc[p.area]!.resolved++;
      return acc;
    },
    {},
  ),
).sort((a, b) => b.count - a.count);

export interface Cluster {
  potholeId: string;
  code: string;
  road: string;
  radiusM: number;
  members: Detection[];
}

export const clusters: Cluster[] = potholes
  .filter((p) => p.buses.length > 1)
  .map((p) => ({
    potholeId: p.id,
    code: p.code,
    road: `${p.road}, ${p.area}`,
    radiusM: 15,
    members: detectionsFor(p.id),
  }));

export function fmtDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fmtDay(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
