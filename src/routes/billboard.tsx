import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { potholes, severityLabel } from "@/data/sadak";

export const Route = createFileRoute("/billboard")({
  head: () => ({
    meta: [
      { title: "Public Safety Billboard — SadakRakshak" },
      {
        name: "description",
        content:
          "Digital roadside display broadcasting live hazard warnings such as POTHOLE AHEAD — HIGH SEVERITY — SLOW DOWN to approaching drivers.",
      },
      { property: "og:title", content: "Public Safety Billboard — SadakRakshak" },
      { property: "og:description", content: "Live roadside hazard warnings generated from verified detections." },
    ],
  }),
  component: Billboard,
});

const hazards = potholes
  .filter((p) => (p.severity === "critical" || p.severity === "high") && p.status !== "resolved")
  .slice(0, 6);

function Billboard() {
  const [i, setI] = useState(0);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const rotate = window.setInterval(() => setI((x) => (x + 1) % hazards.length), 4500);
    const tick = window.setInterval(
      () => setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })),
      1000,
    );
    return () => {
      window.clearInterval(rotate);
      window.clearInterval(tick);
    };
  }, []);

  const h = hazards[i]!;
  const distance = 180 + i * 140;

  return (
    <div className="min-h-screen bg-[oklch(0.12_0.02_258)] p-4 sm:p-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between pb-5 text-xs text-muted-foreground">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>
        <span className="font-mono">SadakRakshak public display · simulated roadside unit · {clock}</span>
      </div>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border-4 border-[oklch(0.28_0.02_258)] bg-black shadow-2xl">
        <div className="relative px-6 py-12 text-center sm:px-14 sm:py-20">
          <div className="absolute inset-0 scanlines opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,color-mix(in_oklab,var(--hazard)_18%,transparent),transparent_65%)]" />

          <div className="relative">
            <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-[var(--hazard)] px-5 py-2">
              <TriangleAlert className="size-6 text-[var(--hazard)]" />
              <span className="font-display text-sm font-bold tracking-[0.4em] text-[var(--hazard)]">CAUTION</span>
            </div>

            <h1 className="mt-8 font-display text-5xl font-bold leading-none tracking-tight text-[var(--hazard)] sm:text-8xl">
              POTHOLE AHEAD
            </h1>
            <p
              className="mt-6 font-display text-3xl font-bold tracking-[0.12em] sm:text-5xl"
              style={{ color: `var(--${h.severity})` }}
            >
              {severityLabel[h.severity].toUpperCase()} SEVERITY
            </p>
            <p className="mt-6 font-display text-4xl font-bold tracking-[0.3em] text-white sm:text-6xl">SLOW DOWN</p>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { k: "Distance", v: `${distance} m` },
                { k: "Location", v: h.road },
                { k: "Advised speed", v: "25 km/h" },
                { k: "Case", v: h.code },
              ].map((c) => (
                <div key={c.k} className="rounded-xl border border-[oklch(0.3_0.02_258)] bg-[oklch(0.17_0.02_258)] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.k}</p>
                  <p className="mt-1 truncate font-mono text-sm text-white">{c.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {hazards.map((_, n) => (
                <span
                  key={n}
                  className={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-[var(--hazard)]" : "w-3 bg-[oklch(0.35_0.02_258)]"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-t border-[oklch(0.28_0.02_258)] bg-[oklch(0.16_0.02_258)] py-3">
          <div className="flex w-max marquee gap-10 whitespace-nowrap font-mono text-sm text-[var(--hazard)]">
            {[...hazards, ...hazards].map((x, n) => (
              <span key={n}>
                ⚠ {x.code} · {x.road}, {x.area} · {severityLabel[x.severity].toUpperCase()} · {x.depthCm} cm deep · drive
                with caution
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-6xl text-center text-xs text-muted-foreground">
        Prototype public-safety display. Warnings are generated from simulated detection data for demonstration purposes.
      </p>
    </div>
  );
}
