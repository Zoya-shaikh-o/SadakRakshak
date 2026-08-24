import { useState } from "react";
import { MessageSquareText, X } from "lucide-react";
import { AssistantPanel } from "./AssistantPanel";

export function AssistantDock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(24rem,calc(100vw-2.5rem))] rise-in">
          <AssistantPanel compact className="h-[32rem] shadow-2xl" />
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open SadakRakshak AI Assistant"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full hazard-gradient px-4 py-3 text-sm font-semibold text-[var(--hazard-foreground)] shadow-xl transition-transform hover:scale-105"
      >
        {open ? <X className="size-5" /> : <MessageSquareText className="size-5" />}
        <span className="hidden sm:inline">{open ? "Close" : "AI Assistant"}</span>
      </button>
    </>
  );
}
