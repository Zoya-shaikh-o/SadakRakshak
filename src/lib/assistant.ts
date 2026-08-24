import {
  authorities,
  authorityById,
  buses,
  detections,
  fmtDate,
  isOverdue,
  potholes,
  severityLabel,
  stats,
  statusLabel,
  verificationLabel,
} from "@/data/sadak";

export interface AssistantReply {
  text: string;
  link?: { to: string; label: string; params?: Record<string, string> | undefined } | undefined;
  chips?: string[] | undefined;
}

const DISCLAIMER =
  "Note: SadakRakshak is a prototype. Reports here are demo documents and are never actually filed with any real authority.";

function topUnresolved() {
  return potholes
    .filter((p) => p.status !== "resolved")
    .sort((a, b) => b.repeatCount - a.repeatCount)
    .slice(0, 5);
}

export function answer(rawInput: string): AssistantReply {
  const q = rawInput.toLowerCase().trim();

  const codeMatch = rawInput.match(/ph-?\s?(\d{4})/i);
  if (codeMatch) {
    const p = potholes.find((x) => x.code.endsWith(codeMatch[1]!));
    if (p) {
      const a = authorityById(p.authorityId);
      return {
        text: `${p.code} — ${p.road}, ${p.area} (${p.ward}).
Severity: ${severityLabel[p.severity]} · Status: ${statusLabel[p.status]} · Verification: ${verificationLabel[p.verification]}.
GPS ${p.lat.toFixed(5)}, ${p.lng.toFixed(5)} · size ~${p.widthCm}×${p.depthCm} cm · avg AI confidence ${(p.avgConfidence * 100).toFixed(0)}%.
Detected ${p.repeatCount} times by ${p.buses.length} bus(es) between ${fmtDate(p.firstDetected)} and ${fmtDate(p.lastDetected)}.
Simulated responsible authority: ${a?.name}.${isOverdue(p) ? "\nThis case is past its SLA window and has entered escalation." : ""}`,
        link: { to: "/pothole/$id", params: { id: p.id }, label: `Open ${p.code} profile` },
      };
    }
  }

  if (/(hello|hi\b|hey|namaste|help|what can you)/.test(q)) {
    return {
      text: `Hello! I'm the SadakRakshak AI Assistant. I can explain any detection record, summarise unresolved or overdue potholes, tell you which simulated authority owns a road, break down statistics, and walk you to any screen in the platform. ${DISCLAIMER}`,
      chips: ["Show unresolved potholes", "Which authority owns Karve Road?", "System statistics", "Explain PH-1004"],
    };
  }

  if (/(unresolved|pending|open case)/.test(q)) {
    const list = topUnresolved()
      .map((p) => `• ${p.code} — ${p.road}, ${p.area} · ${severityLabel[p.severity]} · ${p.repeatCount} detections`)
      .join("\n");
    return {
      text: `There are ${stats.unresolved} unresolved, ${stats.reported} reported and ${stats.underAction} under-action cases right now. Highest repeat-count open cases:\n${list}`,
      link: { to: "/dashboard", label: "Open monitoring dashboard" },
    };
  }

  if (/(overdue|escalat|reminder|late)/.test(q)) {
    const od = potholes.filter(isOverdue);
    return {
      text: `${od.length} cases have crossed their SLA window. Escalation ladder is active for: ${od
        .slice(0, 6)
        .map((p) => p.code)
        .join(", ")}. Reminders are auto-issued at 24h, 72h and 120h past due.`,
      link: { to: "/escalation", label: "Open escalation centre" },
    };
  }

  if (/(critical|severe|dangerous|worst)/.test(q)) {
    const c = potholes.filter((p) => p.severity === "critical");
    return {
      text: `${c.length} potholes are classified Critical:\n${c
        .map((p) => `• ${p.code} — ${p.road} (${p.depthCm} cm deep, ${statusLabel[p.status]})`)
        .join("\n")}`,
      link: { to: "/map", label: "See them on the map" },
    };
  }

  if (/(authority|authorities|pwd|municipal|who is responsible|department|nh)/.test(q)) {
    const named = authorities.find((a) => q.includes(a.shortName.toLowerCase().split(" ")[0]!));
    const road = potholes.find((p) => q.includes(p.road.toLowerCase().split(" ")[0]!));
    if (road) {
      const a = authorityById(road.authorityId)!;
      return {
        text: `${road.road} falls under ${a.name} in our simulated jurisdiction map (${a.jurisdiction}). Demo SLA: ${a.slaHours} hours. This mapping is prototype data, not an official assignment.`,
        link: { to: "/authorities", label: "Open authority mapping" },
      };
    }
    const a = named ?? authorities[0]!;
    const cases = potholes.filter((p) => p.authorityId === a.id);
    return {
      text: `${a.name} (simulated) currently holds ${cases.length} cases — ${cases.filter((c) => c.status === "resolved").length} resolved, ${cases.filter((c) => c.status !== "resolved").length} open. Jurisdiction: ${a.jurisdiction}.`,
      link: { to: "/authorities", label: "Open authority mapping" },
    };
  }

  if (/(duplicate|group|cluster|same pothole|repeat)/.test(q)) {
    return {
      text: `Duplicate detection groups raw frames from different buses into one pothole record using a 15 m geographic proximity radius plus road-segment matching. ${stats.rawDetections} raw detections collapse into ${stats.total} unique potholes, and every raw frame is preserved in the pothole's detection history — nothing is discarded. Repeated-detection rate is ${stats.repeatRate}%.`,
      link: { to: "/grouping", label: "See the grouping engine" },
    };
  }

  if (/(false positive|speed breaker|rumble|shadow|patch|drainage|verify|verification)/.test(q)) {
    return {
      text: `AI verification exists because speed breakers, rumble strips, hard shadows, fresh road patches and drainage covers can all look like potholes to a single frame. Every detection is labelled Confirmed Pothole, Potential False Positive or Requires Verification. Right now: ${stats.confirmed} confirmed, ${stats.needsVerification} awaiting verification, ${stats.falsePositives} flagged as likely false positives.`,
      link: { to: "/verification", label: "Open verification queue" },
    };
  }

  if (/(report|complaint|file|generate)/.test(q)) {
    return {
      text: `I can compile a prototype complaint package for any pothole: image, road and area, GPS coordinates, severity, AI confidence, full detection history and the simulated responsible authority. ${stats.reported + stats.underAction + stats.resolved} report packages exist in this demo. ${DISCLAIMER}`,
      link: { to: "/reports", label: "Open report generator" },
    };
  }

  if (/(stat|analytic|trend|how many|summary|overview|rate)/.test(q)) {
    return {
      text: `System snapshot — ${stats.total} unique potholes from ${stats.rawDetections} raw detections. Unresolved ${stats.unresolved}, reported ${stats.reported}, under action ${stats.underAction}, resolved ${stats.resolved}. Severity split: ${stats.critical} critical / ${stats.high} high / ${stats.medium} medium / ${stats.low} low. Resolution rate ${stats.resolutionRate}%, repeated-detection rate ${stats.repeatRate}%, average AI confidence ${stats.avgConfidence}%, average response ${stats.avgResponseDays} days.`,
      link: { to: "/analytics", label: "Open analytics" },
    };
  }

  if (/(bus|fleet|route|esp32|camera|gps|sd card|hardware|iot|device)/.test(q)) {
    const online = buses.filter((b) => b.status === "online").length;
    return {
      text: `The demo fleet has ${buses.length} public buses across 4 routes, ${online} devices online. Each carries an ESP32-CAM, a GPS module and an SD card holding raw frames; the on-board model classifies Pothole / No Pothole and the tagged records sync to this platform. ${detections.length} frame records are indexed here.`,
      link: { to: "/iot", label: "Open IoT status" },
    };
  }

  if (/(billboard|display|warning|sign|public)/.test(q)) {
    return {
      text: `The public-safety billboard renders live hazard warnings such as "POTHOLE AHEAD — HIGH SEVERITY — SLOW DOWN" for approaching drivers, cycling through the nearest critical and high-severity cases on the route.`,
      link: { to: "/billboard", label: "Open billboard display" },
    };
  }

  if (/(architecture|flow|how does|pipeline|work)/.test(q)) {
    return {
      text: `Flow: road → public transport vehicle → ESP32-CAM → image capture → AI model → Pothole / No Pothole → GPS tagging → SD-card storage → data processing → this platform → duplicate detection → authority mapping → report generation → reminders → billboard → resolution.`,
      link: { to: "/architecture", label: "Open system architecture" },
    };
  }

  if (/(map|where|location|near)/.test(q)) {
    return {
      text: `The map plots all ${stats.total} potholes with severity-coloured markers and filters for severity, status, authority and area. Click a marker to jump to its full profile.`,
      link: { to: "/map", label: "Open pothole map" },
    };
  }

  if (/(resolved|fixed|repair)/.test(q)) {
    const r = potholes.filter((p) => p.status === "resolved");
    return {
      text: `${r.length} cases are resolved (${stats.resolutionRate}% resolution rate), average turnaround ${stats.avgResponseDays} days: ${r.map((p) => p.code).join(", ")}. A case is only marked resolved after three consecutive No Pothole re-survey passes.`,
      link: { to: "/analytics", label: "See resolution analytics" },
    };
  }

  return {
    text: `I can help with detections, unresolved and overdue cases, simulated authority ownership, duplicate grouping, verification of false positives, report generation, analytics and IoT status. Try asking about a specific record like "PH-1004", or "which potholes are critical?". ${DISCLAIMER}`,
    chips: ["Show critical potholes", "Overdue cases", "How does duplicate grouping work?", "Explain PH-1016"],
  };
}
