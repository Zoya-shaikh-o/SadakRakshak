import { createFileRoute } from "@tanstack/react-router";
import { Camera, Cpu, HardDrive, Satellite, SignalHigh } from "lucide-react";
import { DemoNote, SectionHeading, StatCard } from "@/components/sr/primitives";
import { buses, detections, fmtDate } from "@/data/sadak";

export const Route = createFileRoute("/iot")({
  head: () => ({
    meta: [
      { title: "IoT Fleet Status — SadakRakshak" },
      {
        name: "description",
        content:
          "ESP32-CAM, GPS module, SD-card storage and AI model health across the SadakRakshak instrumented bus fleet.",
      },
      { property: "og:title", content: "IoT Fleet Status — SadakRakshak" },
      { property: "og:description", content: "Edge device health for the road-monitoring sensor fleet." },
    ],
  }),
  component: IotPage,
});

const subsystems = [
  { icon: Camera, name: "ESP32-CAM", spec: "OV2640 · 1600×1200 · 2 fps capture", health: "Nominal", detail: "5 of 6 units reporting frames in the last hour." },
  { icon: Satellite, name: "GPS module", spec: "NEO-6M · 1 Hz · ±2.5 m CEP", health: "Nominal", detail: "4 units on 3D fix, 1 on 2D fix, 1 without fix." },
  { icon: HardDrive, name: "SD-card storage", spec: "32 GB class-10 · circular buffer", health: "Attention", detail: "One unit above the 85% rotation threshold." },
  { icon: Cpu, name: "AI model", spec: "pothole-net v2 · quantised INT8 · 1.9 MB", health: "Nominal", detail: "94.1% validation accuracy on the custom Pothole/No Pothole dataset." },
];

function IotPage() {
  const online = buses.filter((b) => b.status === "online").length;
  const avgUptime = (buses.reduce((a, b) => a + b.uptimePct, 0) / buses.length).toFixed(1);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Edge fleet"
        title="IoT & hardware status"
        description="Each instrumented bus carries an ESP32-CAM, a GPS receiver, SD-card storage and the on-board classifier."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Devices online" value={`${online}/${buses.length}`} icon={<SignalHigh className="size-5" />} tone="resolved" />
        <StatCard label="Average uptime" value={`${avgUptime}%`} sub="Rolling 30 days" icon={<Cpu className="size-5" />} tone="hazard" />
        <StatCard label="Frames indexed" value={detections.length} sub="Synced from SD buffers" icon={<HardDrive className="size-5" />} tone="info" />
        <StatCard label="Routes covered" value={new Set(buses.map((b) => b.route)).size} sub="Across the demo network" icon={<Satellite className="size-5" />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {subsystems.map((s) => (
          <div key={s.name} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <s.icon className="size-5 text-[var(--hazard)]" />
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] ${
                  s.health === "Nominal"
                    ? "border-[color-mix(in_oklab,var(--resolved)_40%,transparent)] text-[var(--resolved)]"
                    : "border-[color-mix(in_oklab,var(--medium)_45%,transparent)] text-[var(--medium)]"
                }`}
              >
                {s.health}
              </span>
            </div>
            <p className="mt-3 font-display text-base font-semibold">{s.name}</p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{s.spec}</p>
            <p className="mt-2 text-xs text-muted-foreground">{s.detail}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">Instrumented fleet</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {buses.map((b) => (
            <div key={b.id} className="rounded-lg border border-border bg-[var(--surface-2)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold">{b.fleetNo}</p>
                  <p className="text-xs text-muted-foreground">
                    Route {b.route} · {b.routeName}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] capitalize ${
                    b.status === "online"
                      ? "border-[color-mix(in_oklab,var(--resolved)_40%,transparent)] text-[var(--resolved)]"
                      : b.status === "maintenance"
                        ? "border-[color-mix(in_oklab,var(--medium)_45%,transparent)] text-[var(--medium)]"
                        : "border-[color-mix(in_oklab,var(--critical)_45%,transparent)] text-[var(--critical)]"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current" /> {b.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                {[
                  { k: "Device", v: b.device.replace("ESP32-CAM ", "") },
                  { k: "GPS", v: b.gpsFix },
                  { k: "Detections", v: b.detections },
                  { k: "Uptime", v: `${b.uptimePct}%` },
                ].map((c) => (
                  <div key={c.k}>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.k}</p>
                    <p className="mt-0.5 font-mono text-xs">{c.v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>SD-card usage</span>
                  <span className="font-mono">{b.sdUsedPct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${b.sdUsedPct}%`,
                      background: b.sdUsedPct > 85 ? "var(--critical)" : "linear-gradient(90deg, var(--hazard), var(--signal))",
                    }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Firmware {b.firmware} · last sync {fmtDate(b.lastSync)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DemoNote text="Device telemetry shown here is simulated for the prototype demonstration." />
    </div>
  );
}
