import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  Bus,
  Camera,
  Cpu,
  Database,
  FileText,
  GitMerge,
  Globe,
  HardDrive,
  MonitorPlay,
  Satellite,
  SplitSquareHorizontal,
  TrafficCone,
  Wrench,
} from "lucide-react";
import { DemoNote, SectionHeading } from "@/components/sr/primitives";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "System Architecture — SadakRakshak" },
      {
        name: "description",
        content:
          "End-to-end SadakRakshak flow: road, bus, ESP32-CAM, capture, AI model, GPS, SD card, processing, platform, duplicate detection, authority mapping, reporting, reminders, billboard and resolution.",
      },
      { property: "og:title", content: "System Architecture — SadakRakshak" },
      { property: "og:description", content: "The complete detection-to-resolution pipeline in one diagram." },
    ],
  }),
  component: Architecture,
});

const stages = [
  { n: "01", icon: TrafficCone, t: "Road surface", d: "Damage forms on an active corridor.", layer: "Physical" },
  { n: "02", icon: Bus, t: "Public transport vehicle", d: "An instrumented bus passes on its normal route.", layer: "Physical" },
  { n: "03", icon: Camera, t: "ESP32-CAM", d: "Forward-facing camera watches the lane surface.", layer: "Edge" },
  { n: "04", icon: Camera, t: "Image capture", d: "Frames sampled at 2 fps while the vehicle moves.", layer: "Edge" },
  { n: "05", icon: Cpu, t: "AI model", d: "Quantised classifier trained on a custom dataset.", layer: "Edge" },
  { n: "06", icon: SplitSquareHorizontal, t: "Pothole / No Pothole", d: "Binary decision plus a confidence score.", layer: "Edge" },
  { n: "07", icon: Satellite, t: "GPS tagging", d: "Positive frames stamped with coordinates and speed.", layer: "Edge" },
  { n: "08", icon: HardDrive, t: "SD-card storage", d: "Frame and metadata buffered locally until sync.", layer: "Edge" },
  { n: "09", icon: Database, t: "Data processing", d: "Records ingested, normalised and severity-scored.", layer: "Platform" },
  { n: "10", icon: Globe, t: "SadakRakshak platform", d: "Dashboards, map and case records go live.", layer: "Platform" },
  { n: "11", icon: GitMerge, t: "Duplicate detection", d: "Proximity clustering merges repeated sightings.", layer: "Platform" },
  { n: "12", icon: Building2, t: "Authority mapping", d: "Jurisdiction match picks the road-owning department.", layer: "Action" },
  { n: "13", icon: FileText, t: "Report generation", d: "Evidence package compiled for the complaint.", layer: "Action" },
  { n: "14", icon: Bell, t: "Reminders & escalation", d: "SLA timers chase the case until it closes.", layer: "Action" },
  { n: "15", icon: MonitorPlay, t: "Public billboard", d: "Drivers warned about live hazards ahead.", layer: "Action" },
  { n: "16", icon: Wrench, t: "Resolution", d: "Repair verified by three clean re-survey passes.", layer: "Action" },
];

const layerTone: Record<string, string> = {
  Physical: "var(--info)",
  Edge: "var(--hazard)",
  Platform: "var(--chart-5)",
  Action: "var(--resolved)",
};

function Architecture() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="System design"
        title="SadakRakshak architecture"
        description="One continuous pipeline from a damaged road surface to a verified repair, spanning physical, edge, platform and action layers."
      />

      <div className="flex flex-wrap gap-3">
        {Object.entries(layerTone).map(([k, v]) => (
          <span key={k} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <span className="size-2 rounded-full" style={{ background: v }} /> {k} layer
          </span>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-[var(--surface)] p-5 sm:p-8">
        <div className="absolute inset-0 grid-surface opacity-40" />
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((s, i) => (
            <div key={s.n} className="relative">
              <div
                className="glass-card h-full rounded-xl p-4 transition-transform hover:-translate-y-1"
                style={{ borderColor: `color-mix(in oklab, ${layerTone[s.layer]} 32%, transparent)` }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="grid size-9 place-items-center rounded-lg"
                    style={{
                      background: `color-mix(in oklab, ${layerTone[s.layer]} 16%, transparent)`,
                      color: layerTone[s.layer],
                    }}
                  >
                    <s.icon className="size-4.5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                </div>
                <p className="mt-3 font-display text-sm font-semibold">{s.t}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
                <span className="mt-3 inline-block text-[10px] uppercase tracking-[0.18em]" style={{ color: layerTone[s.layer] }}>
                  {s.layer}
                </span>
              </div>
              {i < stages.length - 1 && (
                <svg className="pointer-events-none absolute -right-4 top-1/2 hidden h-4 w-8 -translate-y-1/2 lg:block" viewBox="0 0 32 8">
                  <line x1="0" y1="4" x2="32" y2="4" stroke="var(--hazard)" strokeWidth="1.5" className="flow-line" opacity="0.6" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass-card rounded-xl p-5">
          <h2 className="font-display text-lg font-semibold">Edge subsystem</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The ESP32-CAM samples the road, the classifier runs locally so no video ever leaves the vehicle, and only
            positive frames with GPS metadata are written to the SD card. This keeps bandwidth, cost and privacy exposure
            low enough to fit on an ordinary bus.
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <h2 className="font-display text-lg font-semibold">Platform subsystem</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingested records are severity-scored from estimated width and depth, clustered by geographic proximity, and
            reviewed for false positives before any complaint is drafted. Every raw frame stays attached to its case.
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <h2 className="font-display text-lg font-semibold">Action subsystem</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The case is routed to the simulated road-owning authority, packaged as a complaint, chased by SLA timers, and
            broadcast to drivers on the roadside display until a repair is verified by re-survey.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">The intelligent road-safety cycle</h2>
        <div className="flex flex-wrap gap-2">
          {["DETECT", "IDENTIFY", "LOCATE", "RECORD", "VERIFY", "GROUP", "REPORT", "ASSIGN", "REMIND", "INFORM", "RESOLVE"].map(
            (c, i) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-[var(--surface-2)] px-3.5 py-2 font-display text-xs font-semibold tracking-[0.18em]"
              >
                <span className="font-mono text-[10px] text-[var(--hazard)]">{String(i + 1).padStart(2, "0")}</span>
                {c}
              </span>
            ),
          )}
        </div>
      </div>

      <DemoNote />
    </div>
  );
}
