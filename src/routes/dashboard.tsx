import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertOctagon,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Hammer,
  Layers3,
  TriangleAlert,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DemoNote, SectionHeading, SeverityBadge, StatCard, StatusBadge } from "@/components/sr/primitives";
import { PotholeMap } from "@/components/map/PotholeMap";
import {
  authorityById,
  detections,
  fmtDate,
  isOverdue,
  daysOverdue,
  potholes,
  stats,
  trendData,
  busById,
} from "@/data/sadak";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Monitoring Dashboard — SadakRakshak" },
      {
        name: "description",
        content:
          "Live SadakRakshak dashboard: total detected potholes, unresolved, reported, under-action and resolved cases with severity split and overdue alerts.",
      },
      { property: "og:title", content: "Monitoring Dashboard — SadakRakshak" },
      { property: "og:description", content: "Road-condition command centre for the SadakRakshak prototype network." },
    ],
  }),
  component: Dashboard,
});

const sevData = [
  { name: "Critical", value: stats.critical, color: "var(--critical)" },
  { name: "High", value: stats.high, color: "var(--high)" },
  { name: "Medium", value: stats.medium, color: "var(--medium)" },
  { name: "Low", value: stats.low, color: "var(--low)" },
];

function Dashboard() {
  const recent = [...detections].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)).slice(0, 7);
  const overdue = potholes.filter(isOverdue).sort((a, b) => daysOverdue(b) - daysOverdue(a));

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Command centre"
        title="Road condition monitoring dashboard"
        description="Aggregated state of the SadakRakshak network across 6 instrumented buses and 4 routes."
        right={
          <Link
            to="/reports"
            className="inline-flex items-center gap-1.5 rounded-lg hazard-gradient px-4 py-2.5 text-sm font-semibold text-[var(--hazard-foreground)]"
          >
            Generate reports <ArrowUpRight className="size-4" />
          </Link>
        }
      />

      <DemoNote />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total detected" value={stats.total} sub={`${stats.rawDetections} raw detections grouped`} icon={<Layers3 className="size-5" />} tone="hazard" />
        <StatCard label="Unresolved" value={stats.unresolved} sub={`${stats.overdue} past SLA window`} icon={<TriangleAlert className="size-5" />} tone="critical" />
        <StatCard label="Reported" value={stats.reported} sub="Complaint package generated" icon={<ClipboardList className="size-5" />} tone="info" />
        <StatCard label="Under action" value={stats.underAction} sub="Repair acknowledged" icon={<Hammer className="size-5" />} tone="hazard" />
        <StatCard label="Resolved" value={stats.resolved} sub={`${stats.resolutionRate}% resolution rate`} icon={<CheckCircle2 className="size-5" />} tone="resolved" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Cumulative detections vs. resolutions</h2>
            <span className="text-xs text-muted-foreground">Last 4 weeks</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gDet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--hazard)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--hazard)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--resolved)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--resolved)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <RTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "var(--foreground)",
                  }}
                />
                <Area type="monotone" dataKey="detections" stroke="var(--hazard)" strokeWidth={2} fill="url(#gDet)" />
                <Area type="monotone" dataKey="resolved" stroke="var(--resolved)" strokeWidth={2} fill="url(#gRes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-2 font-display text-lg font-semibold">Severity distribution</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sevData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3} stroke="none">
                  {sevData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {sevData.map((d) => (
              <li key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: d.color }} /> {d.name}
                </span>
                <span className="font-mono tabular-nums">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Network map</h2>
            <Link to="/map" className="text-xs text-[var(--hazard)]">
              Open full map →
            </Link>
          </div>
          <PotholeMap items={potholes} height={360} />
        </div>

        <div className="glass-card flex flex-col rounded-xl p-5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
            <Activity className="size-4 text-[var(--hazard)]" /> Live detection feed
          </h2>
          <ul className="space-y-3">
            {recent.map((d) => {
              const p = potholes.find((x) => x.id === d.potholeId)!;
              return (
                <li key={d.id} className="rounded-lg border border-border bg-[var(--surface-2)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Link to="/pothole/$id" params={{ id: p.id }} className="font-mono text-xs text-[var(--hazard)]">
                      {p.code}
                    </Link>
                    <SeverityBadge severity={p.severity} />
                  </div>
                  <p className="mt-1.5 text-sm">{p.road}, {p.area}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {busById(d.busId)?.fleetNo} · {fmtDate(d.timestamp)} · {(d.confidence * 100).toFixed(0)}% conf.
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <AlertOctagon className="size-4 text-[var(--critical)]" /> Overdue and unresolved cases
          </h2>
          <Link to="/escalation" className="text-xs text-[var(--hazard)]">
            Escalation centre →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Case</th>
                <th className="pb-2 pr-3 font-medium">Location</th>
                <th className="pb-2 pr-3 font-medium">Severity</th>
                <th className="pb-2 pr-3 font-medium">Status</th>
                <th className="pb-2 pr-3 font-medium">Authority (simulated)</th>
                <th className="pb-2 pr-3 font-medium">Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {overdue.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-[var(--surface-2)]">
                  <td className="py-2.5 pr-3">
                    <Link to="/pothole/$id" params={{ id: p.id }} className="font-mono text-xs text-[var(--hazard)]">
                      {p.code}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-3">{p.road}, {p.area}</td>
                  <td className="py-2.5 pr-3"><SeverityBadge severity={p.severity} /></td>
                  <td className="py-2.5 pr-3"><StatusBadge status={p.status} /></td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{authorityById(p.authorityId)?.shortName}</td>
                  <td className="py-2.5 pr-3 font-mono text-[var(--critical)]">{daysOverdue(p)}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
