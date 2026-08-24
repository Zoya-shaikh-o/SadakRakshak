import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Bot, CornerDownLeft, Sparkles, User } from "lucide-react";
import { answer, type AssistantReply } from "@/lib/assistant";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "bot";
  text: string;
  link?: AssistantReply["link"] | undefined;
  chips?: string[] | undefined;
}

const INTRO: Msg = {
  role: "bot",
  text: "Namaste — I'm the SadakRakshak AI Assistant. Ask me about any detection, unresolved or overdue cases, responsible authorities, repeated detections, statistics, or how the system works. I can also take you to the right screen.",
  chips: ["Show unresolved potholes", "Explain PH-1004", "Which potholes are critical?", "How does duplicate grouping work?"],
};

export function AssistantPanel({ className, compact }: { className?: string; compact?: boolean }) {
  const [msgs, setMsgs] = useState<Msg[]>([INTRO]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing]);

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setMsgs((m) => [...m, { role: "user", text: value }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const reply = answer(value);
      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", text: reply.text, link: reply.link, chips: reply.chips }]);
    }, 420);
  }

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl glass-card", className)}>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="grid size-9 place-items-center rounded-lg hazard-gradient text-[var(--hazard-foreground)]">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold">SadakRakshak AI Assistant</p>
          <p className="truncate text-xs text-muted-foreground">Prototype assistant · answers from demo data only</p>
        </div>
      </div>

      <div className={cn("flex-1 space-y-4 overflow-y-auto p-4", compact ? "max-h-[52vh]" : "")}>
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
            <span
              className={cn(
                "mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-border",
                m.role === "bot" ? "bg-[var(--surface-2)] text-[var(--hazard)]" : "bg-[var(--surface-2)] text-muted-foreground",
              )}
            >
              {m.role === "bot" ? <Bot className="size-4" /> : <User className="size-4" />}
            </span>
            <div className={cn("max-w-[85%] space-y-2", m.role === "user" && "text-right")}>
              <div
                className={cn(
                  "whitespace-pre-line rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "bot"
                    ? "bg-[var(--surface-2)] text-foreground"
                    : "bg-[color-mix(in_oklab,var(--hazard)_18%,transparent)] text-foreground",
                )}
              >
                {m.text}
              </div>
              {m.link && (
                <button
                  onClick={() =>
                    navigate({
                      to: m.link!.to as never,
                      ...(m.link!.params ? { params: m.link!.params as never } : {}),
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-md border border-[color-mix(in_oklab,var(--hazard)_35%,transparent)] px-2.5 py-1.5 text-xs font-medium text-[var(--hazard)] transition-colors hover:bg-[color-mix(in_oklab,var(--hazard)_12%,transparent)]"
                >
                  {m.link.label} <ArrowRight className="size-3.5" />
                </button>
              )}
              {m.chips && (
                <div className="flex flex-wrap gap-2">
                  {m.chips.map((c) => (
                    <button
                      key={c}
                      onClick={() => send(c)}
                      className="rounded-full border border-border bg-[var(--surface-2)] px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-[color-mix(in_oklab,var(--hazard)_40%,transparent)] hover:text-foreground"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2 pl-10 text-xs text-muted-foreground">
            <span className="size-1.5 animate-bounce rounded-full bg-[var(--hazard)]" />
            <span className="size-1.5 animate-bounce rounded-full bg-[var(--hazard)] [animation-delay:120ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-[var(--hazard)] [animation-delay:240ms]" />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a pothole, authority or statistic…"
          className="min-w-0 flex-1 rounded-lg border border-input bg-[var(--surface)] px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-[color-mix(in_oklab,var(--hazard)_45%,transparent)]"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg hazard-gradient px-3 py-2 text-sm font-medium text-[var(--hazard-foreground)] transition-opacity hover:opacity-90"
        >
          Ask <CornerDownLeft className="size-3.5" />
        </button>
      </form>
    </div>
  );
}
