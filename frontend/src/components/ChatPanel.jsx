import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizontal, Sparkles } from "lucide-react";
import { defaultPromptChips } from "../data/trending";

export function ChatPanel({ messages, onSend, loading }) {
  const [input, setInput] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages, loading]);

  const submit = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <aside className="glass soft-panel grain flex h-[720px] flex-col rounded-[30px] p-4 lg:sticky lg:top-6">
      <div className="mb-4 flex items-center justify-between border-b border-white/8 px-2 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Copilot</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Modify your itinerary live</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/6 p-2">
          <Sparkles className="h-4 w-4 text-sky-200" />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {defaultPromptChips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onSend(chip)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10"
          >
            {chip}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="scrollbar-hidden flex-1 space-y-3 overflow-y-auto px-1">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={`${message.role}-${index}-${message.content.slice(0, 18)}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                message.role === "user"
                  ? "ml-auto bg-gradient-to-r from-sky-400/25 to-indigo-400/20 text-white"
                  : "bg-white/6 text-white/78"
              }`}
            >
              {message.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex rounded-full bg-white/6 px-4 py-3">
            <div className="flex gap-2">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-2 w-2 rounded-full bg-white/60"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: dot * 0.18 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-4 rounded-[28px] border border-white/10 bg-white/6 p-3">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows="4"
          placeholder="Ask the AI to refine specific days, mood, budget, weather, pace..."
          className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-white/35">Context-aware edits. No full reset unless you ask.</p>
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400 p-3 text-slate-950 transition hover:scale-105 disabled:opacity-50"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
