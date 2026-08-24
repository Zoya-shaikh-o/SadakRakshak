import { createFileRoute } from "@tanstack/react-router";
import { Bot, Compass, FileText, Sparkles } from "lucide-react";
import { AssistantPanel } from "@/components/AssistantPanel";
import { DemoNote, SectionHeading } from "@/components/sr/primitives";
import { stats } from "@/data/sadak";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "SadakRakshak AI Assistant" },
      {
        name: "description",
        content:
          "Ask the SadakRakshak AI Assistant about detected potholes, unresolved cases, responsible authorities, repeated detections, statistics and how the system operates.",
      },
      { property: "og:title", content: "SadakRakshak AI Assistant" },
      { property: "og:description", content: "A conversational guide to the road-monitoring platform and its records." },
    ],
  }),
  component: AssistantPage,
});

const abilities = [
  { icon: Bot, t: "Explain any record", d: "Ask about PH-1004 or any case code for severity, GPS, history and owner." },
  { icon: Compass, t: "Navigate the platform", d: "Say what you need and the assistant links you straight to the screen." },
  { icon: FileText, t: "Help with reports", d: "Summarises what a complaint package will contain before you generate it." },
  { icon: Sparkles, t: "Answer statistics", d: "Resolution rate, repeat rate, response time, authority load and more." },
];

function AssistantPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Conversational layer"
        title="SadakRakshak AI Assistant"
        description="A grounded assistant that answers only from the platform's own detection records — and never claims a real complaint has been filed."
      />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <AssistantPanel className="h-[36rem]" />

        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5">
            <h2 className="font-display text-lg font-semibold">What it can do</h2>
            <ul className="mt-3 space-y-3">
              {abilities.map((a) => (
                <li key={a.t} className="flex gap-3 rounded-lg border border-border bg-[var(--surface-2)] p-3.5">
                  <a.icon className="mt-0.5 size-4 shrink-0 text-[var(--hazard)]" />
                  <div>
                    <p className="text-sm font-medium">{a.t}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h2 className="font-display text-lg font-semibold">Grounded in the live dataset</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              {[
                { k: "Potholes", v: stats.total },
                { k: "Raw detections", v: stats.rawDetections },
                { k: "Open cases", v: stats.unresolved + stats.reported + stats.underAction },
                { k: "Overdue", v: stats.overdue },
              ].map((s) => (
                <div key={s.k} className="rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5">
                  <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.k}</dt>
                  <dd className="mt-0.5 font-display text-xl font-semibold tabular-nums">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <DemoNote text="The assistant answers from prototype demo data only and will never state that a real government complaint has been submitted." />
        </div>
      </div>
    </div>
  );
}
