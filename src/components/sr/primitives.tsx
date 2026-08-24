import { cn } from "@/lib/utils";
import { DEMO_NOTICE, severityLabel, statusLabel, verificationLabel } from "@/data/sadak";
import type { Severity, Status, Verification } from "@/data/sadak";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

const sevClass: Record<Severity, string> = {
  critical: "bg-[color-mix(in_oklab,var(--critical)_18%,transparent)] text-[var(--critical)] border-[color-mix(in_oklab,var(--critical)_40%,transparent)]",
  high: "bg-[color-mix(in_oklab,var(--high)_18%,transparent)] text-[var(--high)] border-[color-mix(in_oklab,var(--high)_40%,transparent)]",
  medium: "bg-[color-mix(in_oklab,var(--medium)_16%,transparent)] text-[var(--medium)] border-[color-mix(in_oklab,var(--medium)_40%,transparent)]",
  low: "bg-[color-mix(in_oklab,var(--low)_16%,transparent)] text-[var(--low)] border-[color-mix(in_oklab,var(--low)_40%,transparent)]",
};

const statusClass: Record<Status, string> = {
  unresolved: "bg-[color-mix(in_oklab,var(--critical)_14%,transparent)] text-[var(--critical)] border-[color-mix(in_oklab,var(--critical)_35%,transparent)]",
  reported: "bg-[color-mix(in_oklab,var(--info)_14%,transparent)] text-[var(--info)] border-[color-mix(in_oklab,var(--info)_35%,transparent)]",
  under_action: "bg-[color-mix(in_oklab,var(--hazard)_16%,transparent)] text-[var(--hazard)] border-[color-mix(in_oklab,var(--hazard)_38%,transparent)]",
  resolved: "bg-[color-mix(in_oklab,var(--resolved)_15%,transparent)] text-[var(--resolved)] border-[color-mix(in_oklab,var(--resolved)_38%,transparent)]",
};

const verClass: Record<Verification, string> = {
  confirmed: "bg-[color-mix(in_oklab,var(--resolved)_14%,transparent)] text-[var(--resolved)] border-[color-mix(in_oklab,var(--resolved)_35%,transparent)]",
  false_positive: "bg-[color-mix(in_oklab,var(--critical)_12%,transparent)] text-[var(--critical)] border-[color-mix(in_oklab,var(--critical)_32%,transparent)]",
  requires_verification: "bg-[color-mix(in_oklab,var(--medium)_14%,transparent)] text-[var(--medium)] border-[color-mix(in_oklab,var(--medium)_35%,transparent)]",
};

const chip = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide";

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span className={cn(chip, sevClass[severity], className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {severityLabel[severity]}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return <span className={cn(chip, statusClass[status], className)}>{statusLabel[status]}</span>;
}

export function VerificationBadge({ verification, className }: { verification: Verification; className?: string }) {
  return <span className={cn(chip, verClass[verification], className)}>{verificationLabel[verification]}</span>;
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "default",
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  tone?: "default" | "hazard" | "critical" | "resolved" | "info";
  className?: string;
}) {
  const toneRing: Record<string, string> = {
    default: "text-muted-foreground",
    hazard: "text-[var(--hazard)]",
    critical: "text-[var(--critical)]",
    resolved: "text-[var(--resolved)]",
    info: "text-[var(--info)]",
  };
  return (
    <div
      className={cn(
        "glass-card group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--hazard)_35%,transparent)]",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px hazard-gradient opacity-0 transition-opacity group-hover:opacity-80" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <span className={cn("shrink-0", toneRing[tone])}>{icon}</span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hazard)]">{eyebrow}</p>
        )}
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {right}
    </div>
  );
}

export function DemoNote({ text = DEMO_NOTICE, className }: { text?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-[color-mix(in_oklab,var(--hazard)_28%,transparent)] bg-[color-mix(in_oklab,var(--hazard)_9%,transparent)] px-3.5 py-2.5 text-xs text-[color-mix(in_oklab,var(--hazard)_75%,var(--foreground))]",
        className,
      )}
    >
      <Info className="mt-px size-4 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass-card rounded-xl p-5", className)}>{children}</div>;
}

export function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div className="h-full rounded-full hazard-gradient transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-12 text-right font-mono text-sm tabular-nums">{pct}%</span>
    </div>
  );
}
