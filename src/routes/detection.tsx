import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, CircleCheck, Cpu, HardDrive, Radio, Satellite } from "lucide-react";
import { ConfidenceBar, DemoNote, SectionHeading, SeverityBadge, VerificationBadge } from "@/components/sr/primitives";
import { busById, detections, fmtDate, potholes } from "@/data/sadak";

export const Route = createFileRoute("/detection")({
  head: () => ({
    meta: [
      { title: "AI Detection Console — SadakRakshak" },
      {
        name: "description",
        content:
          "ESP32-CAM status, Pothole / No Pothole classification, confidence score, captured road frame, GPS readout and full detection history.",
      },
      { property: "og:title", content: "AI Detection Console — SadakRakshak" },
      { property: "og:description", content: "Edge AI road-frame classification with GPS-tagged detection history." },
    ],
  }),
  component: DetectionPage,
});

const feed = [...detections].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)).slice(0, 24);

function DetectionPage() {
  const [idx, setIdx] = useState(0);
  const [live, setLive] = useState(true);
  const active = feed[idx]!;
  const pothole = potholes.find((p) => p.id === active.potholeId)!;
  const bus = busById(active.busId)!;

  useEffect(() => {
    if (!live) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % Math.min(feed.length, 8)), 5000);
    return () => window.clearInterval(t);
  }, [live]);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Edge intelligence"
        title="AI detection console"
        description="Frame-level output of the on-board Pothole / No Pothole classifier running on the ESP32-CAM fleet."
        right={
          <button
            onClick={() => setLive((l) => !l)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium"
          >
            <span className={`size-2 rounded-full ${live ? "bg-[var(--resolved)] pulse-ring" : "bg-muted-foreground"}`} />
            {live ? "Live cycling" : "Paused"}
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="glass-card overflow-hidden rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5 text-xs">
            <span className="font-mono text-muted-foreground">
              {bus.device} · {bus.fleetNo} · Route {bus.route}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[var(--resolved)]">
              <Radio className="size-3.5" /> Streaming from SD buffer
            </span>
          </div>
          <div className="relative">
            <img src={active.frame} alt={`Captured road frame for ${pothole.code}`} className="h-[22rem] w-full object-cover" />
            <div className="absolute inset-0 scanlines opacity-25" />
            <div className="absolute left-[26%] top-[42%] h-24 w-40 rounded-md border-2 border-[var(--hazard)] shadow-[0_0_28px_color-mix(in_oklab,var(--hazard)_45%,transparent)]">
              <span className="absolute -top-6 left-0 rounded bg-[var(--hazard)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--hazard-foreground)]">
                {active.label.toUpperCase()} {(active.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="absolute bottom-3 left-3 rounded-md bg-[color-mix(in_oklab,var(--background)_75%,transparent)] px-2.5 py-1.5 font-mono text-[11px] backdrop-blur">
              {fmtDate(active.timestamp)} · {active.speedKmph} km/h
            </div>
          </div>
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg bg-[color-mix(in_oklab,var(--critical)_14%,transparent)] px-3 py-1.5 font-display text-sm font-semibold text-[var(--critical)]">
                <CircleCheck className="size-4" /> Classification: {active.label}
              </span>
              <SeverityBadge severity={pothole.severity} />
              <VerificationBadge verification={pothole.verification} />
            </div>
            <div>
              <p className="mb-1.5 text-xs uppercase tracking-widest text-muted-foreground">Model confidence</p>
              <ConfidenceBar value={active.confidence} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { k: "Latitude", v: active.lat.toFixed(5) },
                { k: "Longitude", v: active.lng.toFixed(5) },
                { k: "GPS fix", v: bus.gpsFix },
              ].map((c) => (
                <div key={c.k} className="rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.k}</p>
                  <p className="mt-1 font-mono text-sm">{c.v}</p>
                </div>
              ))}
            </div>
            <Link
              to="/pothole/$id"
              params={{ id: pothole.id }}
              className="inline-flex rounded-lg hazard-gradient px-4 py-2.5 text-sm font-semibold text-[var(--hazard-foreground)]"
            >
              Open {pothole.code} profile
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-xl p-5">
            <h2 className="mb-4 font-display text-lg font-semibold">Device status</h2>
            <ul className="space-y-3 text-sm">
              {[
                { icon: Camera, k: "ESP32-CAM", v: `${bus.device} · firmware ${bus.firmware}`, ok: bus.status === "online" },
                { icon: Satellite, k: "GPS module", v: bus.gpsFix, ok: bus.gpsFix === "3D Fix" },
                { icon: HardDrive, k: "SD-card storage", v: `${bus.sdUsedPct}% used`, ok: bus.sdUsedPct < 85 },
                { icon: Cpu, k: "AI model", v: "pothole-net v2 · 94.1% val. accuracy", ok: true },
              ].map((r) => (
                <li key={r.k} className="flex items-center gap-3 rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5">
                  <r.icon className="size-4 text-[var(--hazard)]" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{r.k}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.v}</p>
                  </div>
                  <span className={`size-2 rounded-full ${r.ok ? "bg-[var(--resolved)]" : "bg-[var(--critical)]"}`} />
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h2 className="mb-3 font-display text-lg font-semibold">Detection history</h2>
            <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {feed.map((d, i) => {
                const p = potholes.find((x) => x.id === d.potholeId)!;
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => {
                        setIdx(i);
                        setLive(false);
                      }}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                        i === idx
                          ? "border-[color-mix(in_oklab,var(--hazard)_45%,transparent)] bg-[color-mix(in_oklab,var(--hazard)_10%,transparent)]"
                          : "border-border bg-[var(--surface-2)] hover:border-[color-mix(in_oklab,var(--hazard)_30%,transparent)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-[var(--hazard)]">{d.id}</span>
                        <span className="font-mono text-xs">{(d.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <p className="mt-1 truncate text-sm">{p.road}, {p.area}</p>
                      <p className="text-[11px] text-muted-foreground">{fmtDate(d.timestamp)} · {busById(d.busId)?.fleetNo}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <DemoNote text="Frames shown are stock road imagery used to represent ESP32-CAM captures in this prototype." />
    </div>
  );
}
