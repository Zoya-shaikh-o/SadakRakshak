import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  GitMerge,
  Hammer,
  MapPin,
  Radar,
  ScanEye,
  ShieldCheck,
} from "lucide-react";
import {
  ConfidenceBar,
  DemoNote,
  SeverityBadge,
  StatusBadge,
  VerificationBadge,
} from "@/components/sr/primitives";
import { PotholeMap } from "@/components/map/PotholeMap";
import {
  authorityById,
  busById,
  daysOverdue,
  detectionsFor,
  fmtDate,
  isOverdue,
  potholeById,
} from "@/data/sadak";
import type { TimelineEvent } from "@/data/sadak";

export const Route = createFileRoute("/pothole/$id")({
  loader: ({ params }) => {
    const p = potholeById(params.id);
    if (!p) throw notFound();
    return { pothole: p };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Case unavailable — SadakRakshak" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.pothole;
    const title = `${p.code} · ${p.road}, ${p.area} — SadakRakshak`;
    const description = `${p.severity} severity pothole on ${p.road}, ${p.area}. ${p.repeatCount} detections, GPS ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PotholeProfile,
});

const kindIcon: Record<TimelineEvent["kind"], typeof Clock> = {
  detected: ScanEye,
  grouped: GitMerge,
  verified: ShieldCheck,
  reported: FileText,
  assigned: Building2,
  reminder: Bell,
  action: Hammer,
  resolved: CheckCircle2,
};

function PotholeProfile() {
  const { pothole: p } = Route.useLoaderData();
  const auth = authorityById(p.authorityId)!;
  const dets = detectionsFor(p.id);

  return (
    <div className="space-y-6">
      <Link to="/map" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to map
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-[var(--hazard)]">{p.code}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">{p.road}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" /> {p.area} · {p.ward} · {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={p.severity} />
          <StatusBadge status={p.status} />
          <VerificationBadge verification={p.verification} />
        </div>
      </div>

      {isOverdue(p) && (
        <div className="glow-critical flex items-center gap-3 rounded-xl bg-[color-mix(in_oklab,var(--critical)_10%,transparent)] px-4 py-3 text-sm">
          <Bell className="size-4 text-[var(--critical)]" />
          <span>
            This case is <strong>{daysOverdue(p)} days</strong> past its {auth.slaHours}-hour SLA window.{" "}
            {p.remindersSent} reminder(s) issued.
          </span>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-card overflow-hidden rounded-xl">
          <div className="relative">
            <img src={p.image} alt={`Road surface at ${p.road}, ${p.area}`} className="h-72 w-full object-cover" />
            <div className="absolute inset-0 scanlines opacity-20" />
            <span className="absolute left-3 top-3 rounded bg-[color-mix(in_oklab,var(--background)_78%,transparent)] px-2 py-1 font-mono text-[11px] backdrop-blur">
              Latest capture · {fmtDate(p.lastDetected)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {[
              { k: "Width", v: `${p.widthCm} cm` },
              { k: "Depth", v: `${p.depthCm} cm` },
              { k: "Detections", v: p.repeatCount },
              { k: "Buses", v: p.buses.length },
            ].map((c) => (
              <div key={c.k} className="bg-[var(--surface)] px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.k}</p>
                <p className="mt-1 font-display text-lg font-semibold tabular-nums">{c.v}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="mb-1.5 text-xs uppercase tracking-widest text-muted-foreground">Average AI confidence</p>
              <ConfidenceBar value={p.avgConfidence} />
            </div>
            {p.falsePositiveHint && (
              <p className="rounded-lg border border-[color-mix(in_oklab,var(--medium)_35%,transparent)] bg-[color-mix(in_oklab,var(--medium)_10%,transparent)] px-3 py-2 text-xs text-[var(--medium)]">
                Verification note: {p.falsePositiveHint}
              </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">First detected</p>
                <p className="mt-1 text-sm">{fmtDate(p.firstDetected)}</p>
              </div>
              <div className="rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Last detected</p>
                <p className="mt-1 text-sm">{fmtDate(p.lastDetected)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card rounded-xl p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
              <Building2 className="size-4 text-[var(--hazard)]" /> Responsible authority
            </h2>
            <p className="font-medium">{auth.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{auth.jurisdiction}</p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd>{auth.type}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Demo SLA</dt><dd>{auth.slaHours} h</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Case owner</dt><dd>{auth.officer}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Report ID</dt><dd className="font-mono">{p.reportId ?? "not generated"}</dd></div>
            </dl>
            <DemoNote className="mt-4" text="Authority assignment is a simulated jurisdiction match for demonstration only." />
          </div>

          <div className="glass-card rounded-xl p-3">
            <PotholeMap items={[p]} height={230} center={[p.lat, p.lng]} zoom={16} />
          </div>

          <Link
            to="/reports"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg hazard-gradient px-4 py-3 text-sm font-semibold text-[var(--hazard-foreground)]"
          >
            <FileText className="size-4" /> Generate complaint report
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
            <Clock className="size-4 text-[var(--hazard)]" /> Lifecycle timeline
          </h2>
          <ol className="relative space-y-5 border-l border-border pl-6">
            {p.timeline.map((t, i) => {
              const Icon = kindIcon[t.kind];
              return (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] grid size-6 place-items-center rounded-full border border-border bg-[var(--surface-2)] text-[var(--hazard)]">
                    <Icon className="size-3" />
                  </span>
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{fmtDate(t.at)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.detail}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
            <Radar className="size-4 text-[var(--hazard)]" /> Grouped raw detections
          </h2>
          <p className="mb-3 text-xs text-muted-foreground">
            {p.repeatCount} raw frames were clustered into this record within a 15 m proximity radius. Every frame is
            retained.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[430px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Frame</th>
                  <th className="pb-2 pr-3 font-medium">Bus</th>
                  <th className="pb-2 pr-3 font-medium">Time</th>
                  <th className="pb-2 pr-3 font-medium">Conf.</th>
                  <th className="pb-2 font-medium">GPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dets.map((d) => (
                  <tr key={d.id}>
                    <td className="py-2 pr-3 font-mono text-xs text-[var(--hazard)]">{d.id}</td>
                    <td className="py-2 pr-3 text-xs">{busById(d.busId)?.fleetNo}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{fmtDate(d.timestamp)}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{(d.confidence * 100).toFixed(0)}%</td>
                    <td className="py-2 font-mono text-[11px] text-muted-foreground">
                      {d.lat.toFixed(4)}, {d.lng.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
