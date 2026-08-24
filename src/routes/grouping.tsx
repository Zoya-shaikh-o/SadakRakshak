import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, GitMerge, Layers3, Radar } from "lucide-react";
import { DemoNote, SectionHeading, StatCard } from "@/components/sr/primitives";
import { busById, clusters, fmtDate, potholeById, stats } from "@/data/sadak";

export const Route = createFileRoute("/grouping")({
  head: () => ({
    meta: [
      { title: "Duplicate Detection Engine — SadakRakshak" },
      {
        name: "description",
        content:
          "How SadakRakshak groups detections from multiple buses on the same route into one pothole record using geographic proximity, while preserving every raw detection.",
      },
      { property: "og:title", content: "Duplicate Detection Engine — SadakRakshak" },
      { property: "og:description", content: "Proximity-based clustering that keeps full detection history intact." },
    ],
  }),
  component: GroupingPage,
});

const steps = [
  { t: "Incoming frame", d: "A bus uploads a Pothole classification with GPS, timestamp, speed and confidence." },
  { t: "Proximity search", d: "Existing clusters within a 15 m haversine radius on the same road segment are retrieved." },
  { t: "Segment match", d: "Bearing and road name are compared so opposite carriageways stay separate records." },
  { t: "Merge or create", d: "A match appends to the cluster and updates last-seen; otherwise a new pothole record is opened." },
  { t: "History preserved", d: "Raw frames are never deleted — the cluster keeps the full per-bus detection trail." },
];

function GroupingPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="De-duplication"
        title="Duplicate detection engine"
        description="Several buses travel the same corridor every hour, so the same pothole is photographed repeatedly. Grouping turns that noise into evidence of persistence."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Raw detections" value={stats.rawDetections} icon={<Radar className="size-5" />} tone="info" />
        <StatCard label="Unique potholes" value={stats.total} sub="After proximity clustering" icon={<Layers3 className="size-5" />} tone="hazard" />
        <StatCard label="Repeated-detection rate" value={`${stats.repeatRate}%`} sub="Cases seen more than once" icon={<GitMerge className="size-5" />} tone="hazard" />
        <StatCard label="Multi-bus clusters" value={clusters.length} sub="Confirmed by 2+ vehicles" icon={<Bus className="size-5" />} tone="resolved" />
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="font-display text-lg font-semibold">Grouping pipeline</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-lg border border-border bg-[var(--surface-2)] p-4">
              <span className="font-mono text-xs text-[var(--hazard)]">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-1.5 font-display text-sm font-semibold">{s.t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-4">
        {clusters.map((c) => {
          const p = potholeById(c.potholeId)!;
          return (
            <div key={c.potholeId} className="glass-card rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link to="/pothole/$id" params={{ id: p.id }} className="font-mono text-xs text-[var(--hazard)]">
                    {c.code}
                  </Link>
                  <p className="mt-0.5 font-display text-base font-semibold">{c.road}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-border px-2.5 py-1">radius {c.radiusM} m</span>
                  <span className="rounded-full border border-border px-2.5 py-1">{p.repeatCount} raw detections</span>
                  <span className="rounded-full border border-border px-2.5 py-1">{p.buses.length} buses</span>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {c.members.map((m) => (
                  <div key={m.id} className="rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[var(--hazard)]">{m.id}</span>
                      <span className="font-mono text-[11px]">{(m.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <p className="mt-1 text-xs">{busById(m.busId)?.fleetNo} · {busById(m.busId)?.route}</p>
                    <p className="text-[11px] text-muted-foreground">{fmtDate(m.timestamp)}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Δ {(Math.abs(m.lat - p.lat) * 111000).toFixed(1)} m N/S · {(Math.abs(m.lng - p.lng) * 105000).toFixed(1)} m E/W
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <DemoNote />
    </div>
  );
}
