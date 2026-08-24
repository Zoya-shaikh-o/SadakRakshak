import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Download, FileText, MapPin, Printer, ScanEye } from "lucide-react";
import { DemoNote, SectionHeading, SeverityBadge, StatusBadge, VerificationBadge } from "@/components/sr/primitives";
import { authorityById, busById, detectionsFor, fmtDate, potholes } from "@/data/sadak";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Report Generation — SadakRakshak" },
      {
        name: "description",
        content:
          "Auto-generated prototype complaint packages containing the pothole image, location, GPS coordinates, severity, AI confidence, detection history and responsible authority.",
      },
      { property: "og:title", content: "Report Generation — SadakRakshak" },
      { property: "og:description", content: "One-click complaint packages assembled from verified detection records." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const [selected, setSelected] = useState(potholes[0]!.id);
  const p = potholes.find((x) => x.id === selected)!;
  const auth = authorityById(p.authorityId)!;
  const dets = detectionsFor(p.id);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Complaint workflow"
        title="Automated report generation"
        description="Every verified case can be compiled into a single evidence package ready for submission to the road-owning department."
      />

      <DemoNote text="This is a prototype document generator. No complaint is transmitted to, or registered with, any real authority." />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="glass-card max-h-[720px] overflow-y-auto rounded-xl p-4">
          <h2 className="mb-3 font-display text-base font-semibold">Cases</h2>
          <ul className="space-y-2">
            {potholes.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelected(c.id)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    c.id === selected
                      ? "border-[color-mix(in_oklab,var(--hazard)_50%,transparent)] bg-[color-mix(in_oklab,var(--hazard)_12%,transparent)]"
                      : "border-border bg-[var(--surface-2)] hover:border-[color-mix(in_oklab,var(--hazard)_30%,transparent)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[var(--hazard)]">{c.code}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{c.reportId ?? "—"}</span>
                  </div>
                  <p className="mt-1 truncate text-sm">{c.road}</p>
                  <p className="text-[11px] text-muted-foreground">{c.area}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg hazard-gradient px-4 py-2.5 text-sm font-semibold text-[var(--hazard-foreground)]"
            >
              <Printer className="size-4" /> Print / save as PDF
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground">
              <Download className="size-4" /> Export package (demo)
            </button>
          </div>

          <article className="glass-card overflow-hidden rounded-xl">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[var(--surface-2)] px-6 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--hazard)]">
                  SadakRakshak · Road defect complaint (prototype)
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold">
                  {p.reportId ?? `DRAFT-${p.code.slice(3)}`} · {p.code}
                </h2>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Generated {fmtDate(new Date().toISOString())}</p>
                <p>Status: {p.reportedOn ? `Issued ${fmtDate(p.reportedOn)}` : "Draft — not issued"}</p>
              </div>
            </header>

            <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_1fr]">
              <div>
                <img src={p.image} alt={`Evidence photograph of ${p.road}`} className="h-60 w-full rounded-lg object-cover" />
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Fig. 1 — ESP32-CAM capture, {fmtDate(p.lastDetected)}, bus {busById(p.buses[0]!)?.fleetNo}.
                </p>

                <h3 className="mt-5 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  <ScanEye className="size-4" /> AI assessment
                </h3>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <Row k="Classification" v="Pothole" />
                  <Row k="Average confidence" v={`${(p.avgConfidence * 100).toFixed(0)}%`} />
                  <Row k="Verification" v={<VerificationBadge verification={p.verification} />} />
                  <Row k="Estimated size" v={`${p.widthCm} cm wide × ${p.depthCm} cm deep`} />
                  <Row k="Severity" v={<SeverityBadge severity={p.severity} />} />
                </dl>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  <MapPin className="size-4" /> Location
                </h3>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <Row k="Road" v={p.road} />
                  <Row k="Area / ward" v={`${p.area} · ${p.ward}`} />
                  <Row k="Coordinates" v={`${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`} />
                  <Row k="Current status" v={<StatusBadge status={p.status} />} />
                </dl>

                <h3 className="mt-5 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  <Building2 className="size-4" /> Responsible authority (simulated)
                </h3>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <Row k="Department" v={auth.name} />
                  <Row k="Type" v={auth.type} />
                  <Row k="Jurisdiction" v={auth.jurisdiction} />
                  <Row k="Demo SLA" v={`${auth.slaHours} hours`} />
                  <Row k="Reminders issued" v={String(p.remindersSent)} />
                </dl>
              </div>
            </div>

            <div className="border-t border-border px-6 py-5">
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                <FileText className="size-4" /> Detection history
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                First detected {fmtDate(p.firstDetected)} · last detected {fmtDate(p.lastDetected)} · {p.repeatCount} total
                detections by {p.buses.length} vehicle(s).
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Frame</th>
                      <th className="pb-2 pr-3 font-medium">Vehicle</th>
                      <th className="pb-2 pr-3 font-medium">Timestamp</th>
                      <th className="pb-2 pr-3 font-medium">Confidence</th>
                      <th className="pb-2 font-medium">Coordinates</th>
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
                          {d.lat.toFixed(5)}, {d.lng.toFixed(5)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <footer className="border-t border-border bg-[var(--surface-2)] px-6 py-4 text-[11px] leading-relaxed text-muted-foreground">
              Prepared automatically by the SadakRakshak monitoring framework from GPS-tagged ESP32-CAM detections.
              This document is a research prototype artefact; the authority mapping is simulated and the complaint has not
              been filed with any real government body.
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-1.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
