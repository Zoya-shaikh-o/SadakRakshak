import { createFileRoute, Link } from "@tanstack/react-router";
import heroFrame from "@/assets/road-1.jpg";
import {
  ArrowRight,
  Bell,
  Building2,
  Camera,
  Cpu,
  GitMerge,
  MapPin,
  MonitorPlay,
  Satellite,
  ScanEye,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Brand } from "@/components/layout/AppShell";
import { DemoNote } from "@/components/sr/primitives";
import { stats } from "@/data/sadak";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SadakRakshak — AI-Driven Pothole Detection & Road Monitoring" },
      {
        name: "description",
        content:
          "SadakRakshak turns public buses into road-condition sensors: ESP32-CAM capture, on-board AI classification, GPS tagging, duplicate grouping, authority reporting and public hazard alerts.",
      },
      { property: "og:title", content: "SadakRakshak — Detect. Locate. Report. Resolve." },
      {
        property: "og:description",
        content:
          "An AI-driven pothole detection and road condition monitoring framework built on ESP32-CAM equipped public transport.",
      },
    ],
  }),
  component: Landing,
});

const cycle = [
  "DETECT",
  "IDENTIFY",
  "LOCATE",
  "RECORD",
  "VERIFY",
  "GROUP",
  "REPORT",
  "ASSIGN",
  "REMIND",
  "INFORM",
  "RESOLVE",
];

const problems = [
  {
    icon: TriangleAlert,
    title: "Potholes are a road-safety emergency",
    body: "Thousands of crashes every year in India are attributed to poor road surface condition. Damage appears fast; discovery is slow.",
  },
  {
    icon: MapPin,
    title: "Manual inspection cannot scale",
    body: "Survey vans cover a fraction of the network. Citizen complaints are sporadic, unverified, and rarely carry precise coordinates.",
  },
  {
    icon: Building2,
    title: "Ownership is unclear",
    body: "A single corridor can be split between a municipal corporation, a PWD division and a highway cell. Complaints stall on routing.",
  },
];

const features = [
  { icon: ScanEye, title: "Edge AI detection", body: "ESP32-CAM frames classified as Pothole / No Pothole with a confidence score." },
  { icon: Satellite, title: "GPS-tagged records", body: "Every detection is stamped with coordinates, speed, bus and timestamp." },
  { icon: GitMerge, title: "Duplicate grouping", body: "Detections from multiple buses on the same route collapse into one case." },
  { icon: ShieldCheck, title: "False-positive guard", body: "Speed breakers, rumble strips, shadows and patches are flagged for verification." },
  { icon: Building2, title: "Authority mapping", body: "Simulated jurisdiction match routes each case to the road-owning department." },
  { icon: Bell, title: "Reminders & escalation", body: "Overdue cases climb an automated escalation ladder until they close." },
  { icon: MonitorPlay, title: "Public billboard", body: "Live hazard warnings for approaching drivers on high-severity stretches." },
  { icon: Sparkles, title: "AI assistant", body: "Ask about any record, statistic or authority and get taken to the right screen." },
];

const hardware = [
  { icon: Camera, label: "ESP32-CAM", detail: "Forward-facing road capture at 2 fps on public buses" },
  { icon: Satellite, label: "GPS module", detail: "NEO-6M class receiver providing 3D-fix coordinates" },
  { icon: Cpu, label: "AI model", detail: "Custom Pothole / No Pothole dataset, quantised for the edge" },
  { icon: MonitorPlay, label: "SD-card storage", detail: "Local buffer of frames and metadata until sync" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_oklab,var(--background)_82%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-10">
          <Brand />
          <div className="flex items-center gap-2">
            <Link
              to="/architecture"
              className="hidden rounded-lg border border-border px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Architecture
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg hazard-gradient px-3.5 py-2 text-sm font-semibold text-[var(--hazard-foreground)]"
            >
              Open platform <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-surface opacity-40" />
        <div className="absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-[color-mix(in_oklab,var(--hazard)_16%,transparent)] blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rise-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--hazard)_35%,transparent)] bg-[color-mix(in_oklab,var(--hazard)_10%,transparent)] px-3 py-1 text-xs font-medium text-[var(--hazard)]">
                <span className="size-1.5 rounded-full bg-[var(--hazard)] pulse-ring" />
                Smart-city road intelligence · research prototype
              </span>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">
                AI-Driven Pothole Detection and{" "}
                <span className="text-hazard-gradient">Road Condition Monitoring</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                SadakRakshak turns everyday public transport into a continuous road-health sensor network.
                <span className="font-display font-semibold text-foreground"> Detect. Locate. Report. Resolve.</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg hazard-gradient px-5 py-3 text-sm font-semibold text-[var(--hazard-foreground)] transition-transform hover:-translate-y-0.5"
                >
                  Live monitoring dashboard <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/detection"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-[var(--surface-2)]"
                >
                  <ScanEye className="size-4" /> See AI detection
                </Link>
              </div>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
                {[
                  { k: "Unique potholes", v: stats.total },
                  { k: "Raw detections", v: stats.rawDetections },
                  { k: "Avg AI confidence", v: `${stats.avgConfidence}%` },
                ].map((s) => (
                  <div key={s.k} className="glass-card rounded-xl px-4 py-3">
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{s.k}</dt>
                    <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative rise-in [animation-delay:150ms]">
              <div className="glass-card overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5 text-xs text-muted-foreground">
                  <span className="font-mono">ESP32-CAM #A1 · MH-12-PT-1042 · R-14</span>
                  <span className="inline-flex items-center gap-1.5 text-[var(--resolved)]">
                    <span className="size-1.5 rounded-full bg-current pulse-ring" /> LIVE
                  </span>
                </div>
                <div className="relative">
                  <img
                    src={heroFrame}
                    alt="Road surface frame captured by an on-bus ESP32-CAM showing a pothole"
                    className="h-64 w-full object-cover sm:h-72"
                    width={1024}
                    height={640}
                  />
                  <div className="absolute inset-0 scanlines opacity-30" />
                  <div className="absolute left-[24%] top-[40%] h-28 w-[46%] rounded-md border-2 border-[var(--hazard)] shadow-[0_0_24px_color-mix(in_oklab,var(--hazard)_45%,transparent)]">
                    <span className="absolute -top-6 left-0 rounded bg-[var(--hazard)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--hazard-foreground)]">
                      POTHOLE 96%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-border border-t border-border text-center">
                  {[
                    { k: "Class", v: "Pothole" },
                    { k: "GPS", v: "18.5057, 73.8156" },
                    { k: "Severity", v: "Critical" },
                  ].map((c) => (
                    <div key={c.k} className="px-2 py-3">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.k}</p>
                      <p className="mt-1 font-mono text-xs">{c.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cycle ribbon */}
      <section className="overflow-hidden border-b border-border bg-[var(--surface)] py-4">
        <div className="flex w-max marquee gap-3">
          {[...cycle, ...cycle].map((c, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap text-xs font-semibold tracking-[0.24em] text-muted-foreground">
              {c}
              <span className="size-1 rounded-full bg-[var(--hazard)]" />
            </span>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hazard)]">The problem</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          Road damage is found late, reported badly, and routed to the wrong desk.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {problems.map((p) => (
            <div key={p.title} className="glass-card rounded-xl p-6">
              <span className="grid size-10 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--critical)_14%,transparent)] text-[var(--critical)]">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution */}
      <section className="border-y border-border bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hazard)]">The solution</p>
              <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
                One closed loop from the road surface to the repair crew.
              </h2>
            </div>
            <Link to="/architecture" className="inline-flex items-center gap-1.5 text-sm text-[var(--hazard)]">
              View full architecture <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="group glass-card rounded-xl p-5 transition-transform hover:-translate-y-1">
                <f.icon className="size-5 text-[var(--hazard)]" />
                <h3 className="mt-3 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cycle grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hazard)]">The cycle</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Eleven steps, fully instrumented.</h2>
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cycle.map((step, i) => (
            <li
              key={step}
              className="glass-card flex items-center gap-3 rounded-xl px-4 py-3.5 transition-colors hover:border-[color-mix(in_oklab,var(--hazard)_40%,transparent)]"
            >
              <span className="font-mono text-xs text-[var(--hazard)]">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-sm font-semibold tracking-[0.12em]">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Hardware */}
      <section className="border-t border-border bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hazard)]">The prototype</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Low-cost hardware, mounted on buses already on the route.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hardware.map((h) => (
              <div key={h.label} className="glass-card rounded-xl p-5">
                <h.icon className="size-5 text-[var(--hazard)]" />
                <p className="mt-3 font-display text-base font-semibold">{h.label}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{h.detail}</p>
              </div>
            ))}
          </div>
          <DemoNote className="mt-8" />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:px-6 lg:px-10">
          <Brand />
          <p>SadakRakshak · academic research prototype · simulated authority data</p>
        </div>
      </footer>
    </div>
  );
}
