import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  Cpu,
  FileText,
  Gauge,
  GitMerge,
  LayoutDashboard,
  Layers,
  Map as MapIcon,
  Menu,
  MonitorPlay,
  ScanEye,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { stats } from "@/data/sadak";

const nav: { group: string; items: { to: string; label: string; icon: typeof Gauge }[] }[] = [
  {
    group: "Monitor",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/detection", label: "AI Detection", icon: ScanEye },
      { to: "/map", label: "Pothole Map", icon: MapIcon },
      { to: "/iot", label: "IoT Status", icon: Cpu },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { to: "/verification", label: "AI Verification", icon: ShieldCheck },
      { to: "/grouping", label: "Duplicate Grouping", icon: GitMerge },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    group: "Action",
    items: [
      { to: "/authorities", label: "Authorities", icon: Building2 },
      { to: "/reports", label: "Reports", icon: FileText },
      { to: "/authority", label: "Authority Desk", icon: Gauge },
      { to: "/escalation", label: "Escalation", icon: Bell },
    ],
  },
  {
    group: "Communicate",
    items: [
      { to: "/billboard", label: "Public Billboard", icon: MonitorPlay },
      { to: "/architecture", label: "Architecture", icon: Layers },
      { to: "/assistant", label: "AI Assistant", icon: Sparkles },
    ],
  },
];

export function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative grid size-9 place-items-center rounded-lg hazard-gradient text-[var(--hazard-foreground)]">
        <Activity className="size-5" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-base font-semibold tracking-tight">SadakRakshak</span>
          <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Detect · Locate · Report · Resolve
          </span>
        </span>
      )}
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-6">
      {nav.map((g) => (
        <div key={g.group}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {g.group}
          </p>
          <ul className="space-y-0.5">
            {g.items.map((it) => (
              <li key={it.to}>
                <Link
                  to={it.to as never}
                  onClick={onNavigate}
                  activeProps={{
                    className:
                      "bg-[color-mix(in_oklab,var(--hazard)_14%,transparent)] text-foreground border-[color-mix(in_oklab,var(--hazard)_40%,transparent)]",
                  }}
                  className="flex items-center gap-2.5 rounded-lg border border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-[var(--surface-2)] hover:text-foreground"
                >
                  <it.icon className="size-4 shrink-0" />
                  {it.label}
                  {it.to === "/escalation" && stats.overdue > 0 && (
                    <span className="ml-auto rounded-full bg-[color-mix(in_oklab,var(--critical)_22%,transparent)] px-1.5 text-[10px] font-semibold text-[var(--critical)]">
                      {stats.overdue}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-[var(--sidebar)] lg:flex">
        <div className="border-b border-border px-5 py-4">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <NavList />
        </div>
        <div className="border-t border-border px-5 py-3 text-[10px] leading-relaxed text-muted-foreground">
          Prototype build v1.0 · demo dataset
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-[color-mix(in_oklab,var(--background)_85%,transparent)] px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation" className="rounded-lg border border-border p-2">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>
      {open && (
        <div className="fixed inset-x-0 top-[57px] z-30 max-h-[70vh] overflow-y-auto border-b border-border bg-[var(--sidebar)] px-3 py-4 lg:hidden">
          <NavList onNavigate={() => setOpen(false)} />
        </div>
      )}

      <main className={cn("lg:pl-64")}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
