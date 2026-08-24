import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { DemoNote, SectionHeading, SeverityBadge, StatusBadge } from "@/components/sr/primitives";
import { PotholeMap } from "@/components/map/PotholeMap";
import { authorities, authorityById, potholes, severityLabel, statusLabel } from "@/data/sadak";
import type { Severity, Status } from "@/data/sadak";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Pothole Map — SadakRakshak" },
      {
        name: "description",
        content:
          "Interactive severity-coded pothole map with filters for severity, status, authority and area across the SadakRakshak demo network.",
      },
      { property: "og:title", content: "Pothole Map — SadakRakshak" },
      { property: "og:description", content: "Severity-based markers and filters over GPS-tagged road damage records." },
    ],
  }),
  component: MapPage,
});

const severities: Severity[] = ["critical", "high", "medium", "low"];
const statuses: Status[] = ["unresolved", "reported", "under_action", "resolved"];

function MapPage() {
  const [sev, setSev] = useState<Severity[]>([]);
  const [st, setSt] = useState<Status[]>([]);
  const [auth, setAuth] = useState("all");
  const [area, setArea] = useState("all");

  const areas = useMemo(() => Array.from(new Set(potholes.map((p) => p.area))).sort(), []);

  const items = potholes.filter(
    (p) =>
      (sev.length === 0 || sev.includes(p.severity)) &&
      (st.length === 0 || st.includes(p.status)) &&
      (auth === "all" || p.authorityId === auth) &&
      (area === "all" || p.area === area),
  );

  const toggle = <T,>(list: T[], set: (v: T[]) => void, v: T) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Geospatial view"
        title="Pothole map"
        description="Every grouped pothole plotted at its cluster centroid. Marker colour encodes severity, fill opacity encodes whether the case is still open."
      />

      <div className="glass-card rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Filter className="size-3.5" /> Filters · showing {items.length} of {potholes.length}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {severities.map((s) => (
            <button
              key={s}
              onClick={() => toggle(sev, setSev, s)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                sev.includes(s)
                  ? "border-[color-mix(in_oklab,var(--hazard)_50%,transparent)] bg-[color-mix(in_oklab,var(--hazard)_14%,transparent)] text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {severityLabel[s]}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-border" />
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => toggle(st, setSt, s)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                st.includes(s)
                  ? "border-[color-mix(in_oklab,var(--hazard)_50%,transparent)] bg-[color-mix(in_oklab,var(--hazard)_14%,transparent)] text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {statusLabel[s]}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-border" />
          <select
            value={auth}
            onChange={(e) => setAuth(e.target.value)}
            className="rounded-lg border border-input bg-[var(--surface-2)] px-2.5 py-1.5 text-xs"
          >
            <option value="all">All authorities</option>
            {authorities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.shortName}
              </option>
            ))}
          </select>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-lg border border-input bg-[var(--surface-2)] px-2.5 py-1.5 text-xs"
          >
            <option value="all">All areas</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="glass-card rounded-xl p-3">
          <PotholeMap items={items} height={560} />
          <div className="mt-3 flex flex-wrap gap-4 px-2 pb-1 text-xs text-muted-foreground">
            {severities.map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: `var(--${s})` }} /> {severityLabel[s]}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card max-h-[620px] overflow-y-auto rounded-xl p-4">
          <h2 className="mb-3 font-display text-lg font-semibold">Matching cases</h2>
          <ul className="space-y-2">
            {items.map((p) => (
              <li key={p.id}>
                <Link
                  to="/pothole/$id"
                  params={{ id: p.id }}
                  className="block rounded-lg border border-border bg-[var(--surface-2)] p-3 transition-colors hover:border-[color-mix(in_oklab,var(--hazard)_40%,transparent)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[var(--hazard)]">{p.code}</span>
                    <SeverityBadge severity={p.severity} />
                  </div>
                  <p className="mt-1.5 text-sm">{p.road}, {p.area}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <StatusBadge status={p.status} />
                    <span>{p.repeatCount} detections</span>
                    <span>· {authorityById(p.authorityId)?.shortName}</span>
                  </div>
                </Link>
              </li>
            ))}
            {items.length === 0 && <p className="text-sm text-muted-foreground">No cases match these filters.</p>}
          </ul>
        </div>
      </div>

      <DemoNote />
    </div>
  );
}
