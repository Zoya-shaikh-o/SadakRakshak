import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Clock, MapPinned, Percent } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { DemoNote, SectionHeading, SeverityBadge, StatusBadge } from "@/components/sr/primitives";
import { authorities, potholes, responseTimeData } from "@/data/sadak";

export const Route = createFileRoute("/authorities")({
  head: () => ({
    meta: [
      { title: "Authority Mapping — SadakRakshak" },
      {
        name: "description",
        content:
          "Simulated road-owning authority mapping across Municipal Corporation, PWD, National Highway and Cantonment jurisdictions with case load and SLA statistics.",
      },
      { property: "og:title", content: "Authority Mapping — SadakRakshak" },
      { property: "og:description", content: "Which department owns which road, and how each is performing." },
    ],
  }),
  component: AuthoritiesPage,
});

function AuthoritiesPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Ownership"
        title="Responsible authority mapping"
        description="Each pothole is routed by matching its coordinates to a jurisdiction polygon. In this prototype the polygons and departments are fictional stand-ins."
      />

      <DemoNote text="All authority names, officers, contacts and jurisdictions on this page are simulated demo entities. Nothing here is connected to a real government body." />

      <div className="grid gap-5 lg:grid-cols-2">
        {authorities.map((a) => {
          const cases = potholes.filter((p) => p.authorityId === a.id);
          const open = cases.filter((c) => c.status !== "resolved").length;
          const done = cases.length - open;
          const pct = cases.length ? Math.round((done / cases.length) * 100) : 0;
          return (
            <div key={a.id} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
                    <Building2 className="size-3" /> {a.type}
                  </span>
                  <h2 className="mt-2 font-display text-lg font-semibold">{a.name}</h2>
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPinned className="mt-px size-3.5 shrink-0" /> {a.jurisdiction}
                  </p>
                </div>
                <span className="rounded-lg bg-[color-mix(in_oklab,var(--hazard)_12%,transparent)] px-2.5 py-1 font-display text-xl font-semibold text-[var(--hazard)]">
                  {cases.length}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { k: "Open", v: open },
                  { k: "Closed", v: done },
                  { k: "SLA", v: `${a.slaHours}h` },
                ].map((c) => (
                  <div key={c.k} className="rounded-lg border border-border bg-[var(--surface-2)] px-2 py-2.5">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.k}</p>
                    <p className="mt-0.5 font-display text-base font-semibold">{c.v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Percent className="size-3" /> Resolution rate</span>
                  <span className="font-mono">{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div className="h-full rounded-full hazard-gradient" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {cases.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    <Link
                      to="/pothole/$id"
                      params={{ id: c.id }}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2 text-sm transition-colors hover:border-[color-mix(in_oklab,var(--hazard)_40%,transparent)]"
                    >
                      <span className="min-w-0 truncate">
                        <span className="font-mono text-xs text-[var(--hazard)]">{c.code}</span> · {c.road}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <SeverityBadge severity={c.severity} />
                        <StatusBadge status={c.status} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Contact (demo): {a.contact} · {a.officer}
              </p>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold">
          <Clock className="size-4 text-[var(--hazard)]" /> Average response time vs. SLA (days)
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">Simulated turnaround from first detection to resolution.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responseTimeData} margin={{ left: -18, right: 8 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="authority" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <RTooltip
                cursor={{ fill: "color-mix(in oklab, var(--foreground) 6%, transparent)" }}
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }}
              />
              <Bar dataKey="avgDays" name="Avg response" fill="var(--hazard)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="sla" name="SLA target" fill="var(--info)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
