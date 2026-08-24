import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertOctagon, CheckCircle2, ClipboardList, Hammer } from "lucide-react";
import { DemoNote, SectionHeading, SeverityBadge, StatCard, StatusBadge } from "@/components/sr/primitives";
import { authorities, daysOverdue, fmtDay, isOverdue, potholes, statusLabel } from "@/data/sadak";
import type { Status } from "@/data/sadak";

export const Route = createFileRoute("/authority")({
  head: () => ({
    meta: [
      { title: "Authority Desk — SadakRakshak" },
      {
        name: "description",
        content:
          "Authority-side dashboard of assigned complaints, pending cases, critical potholes and resolution statistics in the SadakRakshak prototype.",
      },
      { property: "og:title", content: "Authority Desk — SadakRakshak" },
      { property: "og:description", content: "The department-side view of assigned road defect complaints." },
    ],
  }),
  component: AuthorityDesk,
});

function AuthorityDesk() {
  const [authId, setAuthId] = useState(authorities[0]!.id);
  const [overrides, setOverrides] = useState<Record<string, Status>>({});
  const auth = authorities.find((a) => a.id === authId)!;

  const cases = useMemo(() => potholes.filter((p) => p.authorityId === authId), [authId]);
  const statusOf = (id: string, fallback: Status) => overrides[id] ?? fallback;

  const assigned = cases.length;
  const pending = cases.filter((c) => statusOf(c.id, c.status) !== "resolved").length;
  const critical = cases.filter((c) => c.severity === "critical").length;
  const resolved = cases.filter((c) => statusOf(c.id, c.status) === "resolved").length;

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Department view"
        title="Authority complaint desk"
        description="Simulated login for a road-owning department. Cases arrive pre-verified with evidence, coordinates and detection history attached."
        right={
          <select
            value={authId}
            onChange={(e) => setAuthId(e.target.value)}
            className="rounded-lg border border-input bg-[var(--surface-2)] px-3 py-2.5 text-sm"
          >
            {authorities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.shortName}
              </option>
            ))}
          </select>
        }
      />

      <div className="glass-card rounded-xl p-5">
        <p className="font-display text-lg font-semibold">{auth.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{auth.jurisdiction}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Signed in as {auth.officer} · SLA {auth.slaHours} hours · {auth.contact}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assigned complaints" value={assigned} icon={<ClipboardList className="size-5" />} tone="info" />
        <StatCard label="Pending" value={pending} sub={`${cases.filter(isOverdue).length} past SLA`} icon={<Hammer className="size-5" />} tone="hazard" />
        <StatCard label="Critical potholes" value={critical} icon={<AlertOctagon className="size-5" />} tone="critical" />
        <StatCard
          label="Resolution rate"
          value={`${assigned ? Math.round((resolved / assigned) * 100) : 0}%`}
          sub={`${resolved} of ${assigned} closed`}
          icon={<CheckCircle2 className="size-5" />}
          tone="resolved"
        />
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">Assigned case queue</h2>
        <div className="space-y-3">
          {cases.map((c) => {
            const st = statusOf(c.id, c.status);
            return (
              <div key={c.id} className="rounded-lg border border-border bg-[var(--surface-2)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to="/pothole/$id" params={{ id: c.id }} className="font-mono text-xs text-[var(--hazard)]">
                        {c.code}
                      </Link>
                      <SeverityBadge severity={c.severity} />
                      <StatusBadge status={st} />
                      {isOverdue(c) && st !== "resolved" && (
                        <span className="rounded-full border border-[color-mix(in_oklab,var(--critical)_40%,transparent)] px-2.5 py-0.5 text-[11px] text-[var(--critical)]">
                          {daysOverdue(c)}d overdue
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 font-medium">{c.road}, {c.area}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.repeatCount} detections · report {c.reportId ?? "draft"} · due {fmtDay(c.dueOn)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["reported", "under_action", "resolved"] as Status[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setOverrides((o) => ({ ...o, [c.id]: s }))}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          st === s
                            ? "border-[color-mix(in_oklab,var(--hazard)_50%,transparent)] bg-[color-mix(in_oklab,var(--hazard)_14%,transparent)]"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Mark {statusLabel[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DemoNote text="Status changes are local to this prototype session and are not sent to any real department." />
    </div>
  );
}
