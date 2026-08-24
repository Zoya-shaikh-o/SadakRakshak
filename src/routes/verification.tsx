import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CircleHelp, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { ConfidenceBar, DemoNote, SectionHeading, SeverityBadge, StatCard, VerificationBadge } from "@/components/sr/primitives";
import { falsePositiveCauses, potholes, stats, verificationLabel } from "@/data/sadak";
import type { Verification } from "@/data/sadak";

export const Route = createFileRoute("/verification")({
  head: () => ({
    meta: [
      { title: "AI Verification Queue — SadakRakshak" },
      {
        name: "description",
        content:
          "Mark detections as Confirmed Pothole, Potential False Positive or Requires Verification. Speed breakers, rumble strips, shadows and patches are common false-positive sources.",
      },
      { property: "og:title", content: "AI Verification Queue — SadakRakshak" },
      { property: "og:description", content: "Human-in-the-loop verification of edge AI pothole detections." },
    ],
  }),
  component: VerificationPage,
});

const options: { key: Verification; icon: typeof ShieldCheck }[] = [
  { key: "confirmed", icon: ShieldCheck },
  { key: "requires_verification", icon: CircleHelp },
  { key: "false_positive", icon: ShieldX },
];

function VerificationPage() {
  const [state, setState] = useState<Record<string, Verification>>(
    Object.fromEntries(potholes.map((p) => [p.id, p.verification])),
  );

  const queue = [...potholes].sort((a, b) => a.avgConfidence - b.avgConfidence);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Human in the loop"
        title="AI verification queue"
        description="A single frame cannot distinguish every road irregularity. Each grouped detection is reviewed and labelled before it is allowed to become a complaint."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Confirmed" value={Object.values(state).filter((v) => v === "confirmed").length} icon={<ShieldCheck className="size-5" />} tone="resolved" />
        <StatCard label="Requires verification" value={Object.values(state).filter((v) => v === "requires_verification").length} icon={<CircleHelp className="size-5" />} tone="hazard" />
        <StatCard label="Potential false positives" value={Object.values(state).filter((v) => v === "false_positive").length} icon={<ShieldX className="size-5" />} tone="critical" />
        <StatCard label="Average confidence" value={`${stats.avgConfidence}%`} sub="Across all grouped cases" icon={<ShieldAlert className="size-5" />} />
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="font-display text-lg font-semibold">Known false-positive sources</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Distribution of rejected detections in the prototype validation set.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {falsePositiveCauses.map((c) => (
            <div key={c.name} className="rounded-lg border border-border bg-[var(--surface-2)] p-3.5">
              <div className="flex items-center justify-between">
                <p className="font-medium">{c.name}</p>
                <span className="font-mono text-xs text-[var(--hazard)]">{c.share}%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
                <div className="h-full hazard-gradient" style={{ width: `${c.share * 2.6}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {queue.map((p) => (
          <div key={p.id} className="glass-card grid gap-4 rounded-xl p-4 md:grid-cols-[200px_1fr_auto]">
            <img src={p.image} alt={`Frame for ${p.code}`} className="h-32 w-full rounded-lg object-cover md:h-full" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link to="/pothole/$id" params={{ id: p.id }} className="font-mono text-xs text-[var(--hazard)]">
                  {p.code}
                </Link>
                <SeverityBadge severity={p.severity} />
                <VerificationBadge verification={state[p.id]!} />
              </div>
              <p className="mt-2 font-medium">{p.road}, {p.area}</p>
              <p className="text-xs text-muted-foreground">
                {p.repeatCount} detections · {p.buses.length} bus(es) · {p.widthCm}×{p.depthCm} cm
              </p>
              <div className="mt-3 max-w-md">
                <ConfidenceBar value={p.avgConfidence} />
              </div>
              {p.falsePositiveHint && (
                <p className="mt-2 text-xs text-[var(--medium)]">AI hint: {p.falsePositiveHint}</p>
              )}
            </div>
            <div className="flex flex-row gap-2 md:flex-col">
              {options.map((o) => (
                <button
                  key={o.key}
                  onClick={() => setState((s) => ({ ...s, [p.id]: o.key }))}
                  className={`inline-flex flex-1 items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    state[p.id] === o.key
                      ? "border-[color-mix(in_oklab,var(--hazard)_50%,transparent)] bg-[color-mix(in_oklab,var(--hazard)_14%,transparent)]"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <o.icon className="size-3.5" /> {verificationLabel[o.key]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <DemoNote text="Verification decisions are stored in this browser session only — this is a prototype review interface." />
    </div>
  );
}
