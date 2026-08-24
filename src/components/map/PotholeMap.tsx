import { Suspense, lazy, useEffect, useState } from "react";
import type { Pothole } from "@/data/sadak";

const Impl = lazy(() => import("./PotholeMapImpl"));

interface Props {
  items: Pothole[];
  height?: number;
  center?: [number, number];
  zoom?: number;
}

export function PotholeMap(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const skeleton = (
    <div
      className="grid w-full place-items-center rounded-xl border border-border bg-[var(--surface-2)] text-xs text-muted-foreground grid-surface"
      style={{ height: props.height ?? 520 }}
    >
      Loading road network…
    </div>
  );

  if (!mounted) return skeleton;
  return (
    <Suspense fallback={skeleton}>
      <Impl {...props} />
    </Suspense>
  );
}
