import { createFileRoute, Link } from "@tanstack/react-router";
import { AlarmClock, Bell, BellRing, Siren } from "lucide-react";
import { DemoNote, SectionHeading, SeverityBadge, StatCard, StatusBadge } from "@/components/sr/primitives";
import { authorityById, daysOverdue, fmtDay, isOverdue, potholes, stats } from "@/data/sadak";

export const Route = createFileRoute("/escalation")({
  head: () => ({
    meta: [
      { title: "Reminder & Escalation Centre — SadakRakshak" },
      {
        name: "description",
        content:
          "Automated reminder ladder for unresolved and overdue potholes, with escalation levels based on severity and time past the SLA window.",
      },
      { property: "og:title", content: "Reminder & Escalation Centre — SadakRakshak" },
      { property: "og:description", content: "Unresolved cases are chased automatically until they close." },
    ],
  }),
  component: EscalationPage,
});

const ladder = [
  { level: "L1 · Reminder", when: "24 h past SLA", who: "Case officer", tone: "var(--medium)" },
  { level: "L2 · Follow-up", when: "72 h past SLA", who: "Ward engineer", tone: "var(--high)" },
  { level: "L3 · Escalation", when: "120 h past SLA", who: "Department head", tone: "var(--critical)" },
  { level: "L4 · Public notice", when: "Critical + 168 h", who: "Billboard + public log", tone: "var(--critical)" },
];

function escalationLevel(days: number, critical: boolean) {
  if (critical && days >= 7) return 4;
  if (days >= 5) return 3;
  if (days >= 3) return 2;
  if (days >= 1) return 1;
  return 0;
}

function EscalationPage() {
  const open = potholes.filter((p) => p.status !== "resolved");
  const overdue = open.filter(isOverdue).sort((a, b) => daysOverdue(b) - daysOverdue(a));
  const watch = open.filter((p) => !isOverdue(p));

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Follow-through"
        title="Reminder & escalation centre"
        description="A detection that is never chased is a detection wasted. Every open case runs a timer against its authority's SLA."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open cases" value={open.length} icon={<Bell className="size-5" />} tone="hazard" />
        <StatCard label="Past SLA" value={overdue.length} icon={<AlarmClock className="size-5" />} tone="critical" />
        <StatCard label="Reminders issued" value={potholes.reduce((a, p) => a + p.remindersSent, 0)} icon={<BellRing className="size-5" />} tone="info" />
        <StatCard label="Critical unresolved" value={open.filter((p) => p.severity === "critical").length} sub={`${stats.resolutionRate}% overall resolution rate`} icon={<Siren className="size-5" />} tone="critical" />
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">Escalation ladder</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {ladder.map((l) => (
            <div key={l.level} className="rounded-lg border border-border bg-[var(--surface-2)] p-4">
              <span className="inline-block size-2 rounded-full" style={{ background: l.tone }} />
              <p className="mt-2 font-display text-sm font-semibold">{l.level}</p>
              <p className="mt-1 text-xs text-muted-foreground">{l.when}</p>
              <p className="mt-2 text-xs">Notifies: {l.who}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Overdue cases</h2>
        {overdue.map((p) => {
          const d = daysOverdue(p);
          const lvl = escalationLevel(d, p.severity === "critical");
          return (
            <div
              key={p.id}
              className={`rounded-xl p-4 ${lvl >= 3 ? "glow-critical bg-[color-mix(in_oklab,var(--critical)_8%,transparent)]" : "glass-card"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to="/pothole/$id" params={{ id: p.id }} className="font-mono text-xs text-[var(--hazard)]">
                      {p.code}
                    </Link>
                    <SeverityBadge severity={p.severity} />
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-1.5 font-medium">{p.road}, {p.area}</p>
                  <p className="text-xs text-muted-foreground">
                    {authorityById(p.authorityId)?.shortName} · due {fmtDay(p.dueOn)} · {p.remindersSent} reminder(s) sent
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-semibold text-[var(--critical)]">{d}d</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">past SLA</p>
                  <span className="mt-1 inline-block rounded-full border border-[color-mix(in_oklab,var(--critical)_40%,transparent)] px-2.5 py-0.5 text-[11px] text-[var(--critical)]">
                    Escalation L{lvl}
                  </span>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                <div className="h-full hazard-gradient" style={{ width: `${Math.min(100, lvl * 25)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="mb-3 font-display text-lg font-semibold">Within SLA · watchlist</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {watch.map((p) => (
            <li key={p.id}>
              <Link
                to="/pothole/$id"
                params={{ id: p.id }}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5 text-sm transition-colors hover:border-[color-mix(in_oklab,var(--hazard)_35%,transparent)]"
              >
                <span className="truncate">
                  <span className="font-mono text-xs text-[var(--hazard)]">{p.code}</span> · {p.road}
                </span>
                <SeverityBadge severity={p.severity} />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <DemoNote text="Reminders in this prototype are simulated notifications; no messages are delivered to real officials." />
    </div>
  );
}
