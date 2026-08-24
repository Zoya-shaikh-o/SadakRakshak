import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Gauge, Repeat2, Timer, TrendingUp } from "lucide-react";
import { DemoNote, SectionHeading, StatCard } from "@/components/sr/primitives";
import { areaStats, potholes, responseTimeData, stats, trendData } from "@/data/sadak";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — SadakRakshak" },
      {
        name: "description",
        content:
          "Detection trends, severity distribution, repeated-detection rate, resolution rate, response time and area-wise road damage statistics.",
      },
      { property: "og:title", content: "Analytics — SadakRakshak" },
      { property: "og:description", content: "Quantitative view of road-defect detection and resolution performance." },
    ],
  }),
  component: Analytics,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
  color: "var(--foreground)",
};

const sevBars = [
  { name: "Critical", value: stats.critical, color: "var(--critical)" },
  { name: "High", value: stats.high, color: "var(--high)" },
  { name: "Medium", value: stats.medium, color: "var(--medium)" },
  { name: "Low", value: stats.low, color: "var(--low)" },
];

const repeatBuckets = [
  { bucket: "1–4", count: potholes.filter((p) => p.repeatCount <= 4).length },
  { bucket: "5–8", count: potholes.filter((p) => p.repeatCount > 4 && p.repeatCount <= 8).length },
  { bucket: "9–12", count: potholes.filter((p) => p.repeatCount > 8 && p.repeatCount <= 12).length },
  { bucket: "13+", count: potholes.filter((p) => p.repeatCount > 12).length },
];

const lifecycle = [
  { stage: "Detected", value: stats.total },
  { stage: "Verified", value: stats.confirmed },
  { stage: "Reported", value: stats.reported + stats.underAction + stats.resolved },
  { stage: "Under action", value: stats.underAction + stats.resolved },
  { stage: "Resolved", value: stats.resolved },
];

function Analytics() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Insight"
        title="Road condition analytics"
        description="Aggregate performance of the detection network and the repair pipeline it feeds."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Resolution rate" value={`${stats.resolutionRate}%`} sub={`${stats.resolved} of ${stats.total} cases closed`} icon={<Gauge className="size-5" />} tone="resolved" />
        <StatCard label="Repeated-detection rate" value={`${stats.repeatRate}%`} sub="Cases seen on more than one pass" icon={<Repeat2 className="size-5" />} tone="hazard" />
        <StatCard label="Avg response" value={`${stats.avgResponseDays} d`} sub="First detection to resolution" icon={<Timer className="size-5" />} tone="info" />
        <StatCard label="Detection growth" value="+44" sub="Cumulative detections in 4 weeks" icon={<TrendingUp className="size-5" />} tone="hazard" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Detection trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="aTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--hazard)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--hazard)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <RTooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="detections" stroke="var(--hazard)" strokeWidth={2} fill="url(#aTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Severity distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sevBars} margin={{ left: -20 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <RTooltip cursor={{ fill: "color-mix(in oklab, var(--foreground) 6%, transparent)" }} contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {sevBars.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Repeated detections per pothole</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repeatBuckets} margin={{ left: -20 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="bucket" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <RTooltip cursor={{ fill: "color-mix(in oklab, var(--foreground) 6%, transparent)" }} contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="var(--info)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Response time by authority (days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData} margin={{ left: -20 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="authority" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <RTooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="avgDays" name="Actual" stroke="var(--hazard)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="sla" name="SLA" stroke="var(--resolved)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Lifecycle funnel</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={lifecycle} outerRadius="72%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="stage" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Radar dataKey="value" stroke="var(--hazard)" fill="var(--hazard)" fillOpacity={0.35} />
                <RTooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Area-wise statistics</h2>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[var(--surface)]">
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Area</th>
                  <th className="pb-2 pr-3 font-medium">Cases</th>
                  <th className="pb-2 pr-3 font-medium">Critical</th>
                  <th className="pb-2 font-medium">Resolved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {areaStats.map((a) => (
                  <tr key={a.area}>
                    <td className="py-2 pr-3">{a.area}</td>
                    <td className="py-2 pr-3 font-mono">{a.count}</td>
                    <td className="py-2 pr-3 font-mono text-[var(--critical)]">{a.critical}</td>
                    <td className="py-2 font-mono text-[var(--resolved)]">{a.resolved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DemoNote />
    </div>
  );
}
