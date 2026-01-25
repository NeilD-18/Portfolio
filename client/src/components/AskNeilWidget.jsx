import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SUGGESTED_PROMPTS = [
  "Give me the 30-second overview",
  "What projects prove backend strength?",
  "What’s Neil’s basketball background?",
  "What should I ask Neil in an interview?",
];

function getMockAnswer(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("30-second") || p.includes("overview")) {
    return {
      title: "30-second overview",
      body:
        "I’m Neil — a CS & Math student-athlete who builds clean, modern web apps with a focus on real-world impact. I care about performance, polish, and building things that ship.",
      sources: ["Education", "Projects", "Experience"],
    };
  }
  if (p.includes("backend")) {
    return {
      title: "Backend strengths",
      body:
        "Look at projects where I designed APIs, worked with databases, and owned data models end-to-end. I like building reliable systems with clear interfaces and good error handling.",
      sources: ["Projects"],
    };
  }
  if (p.includes("basketball")) {
    return {
      title: "Basketball background",
      body:
        "Basketball taught me discipline and consistency — same mindset I bring to engineering: show up daily, iterate, and execute under pressure.",
      sources: ["Mood Board", "About"],
    };
  }
  if (p.includes("interview") || p.includes("ask")) {
    return {
      title: "Great interview questions",
      body:
        "Ask about a project I owned end-to-end, a tricky bug I debugged, and how being a student-athlete shaped my workflow. I love talking about tradeoffs and real decisions.",
      sources: ["Projects", "Experience"],
    };
  }
  return {
    title: "Mock answer",
    body:
      "This is a UI mock — next step is wiring it to your portal-backed content so it can answer from your real data with sources.",
    sources: ["Site Content"],
  };
}

const bubble = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function AskNeilWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: "intro",
      role: "assistant",
      content:
        "Ask me anything about Neil — projects, background, or what to talk about in an interview.",
      meta: null,
    },
  ]);

  const quickActions = useMemo(
    () => [
      { label: "View Resume", onClick: () => window.open("#", "_blank") },
      {
        label: "Jump to Contact",
        onClick: () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }),
      },
    ],
    []
  );

  const push = (msg) => setMessages((prev) => [...prev, msg]);

  const handlePrompt = (prompt) => {
    const answer = getMockAnswer(prompt);
    push({ id: `u-${Date.now()}`, role: "user", content: prompt, meta: null });
    push({
      id: `a-${Date.now() + 1}`,
      role: "assistant",
      content: answer.body,
      meta: { title: answer.title, sources: answer.sources },
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    handlePrompt(text);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      {/* Closed state pill */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="pill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(true)}
            className="group flex items-center gap-3 rounded-full border border-white/10 bg-primary/80 backdrop-blur-md px-4 py-3 shadow-lg hover:border-[#915EFF]/40 transition-colors"
            aria-label="Open Ask Neil"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#915EFF] to-[#00CEA8] text-white font-bold">
              N
            </span>
            <span className="text-white text-sm font-semibold">Ask Neil</span>
            <span className="text-secondary text-xs hidden sm:block">
              quick answers • no scrolling
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Open state */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-[340px] sm:w-[380px] rounded-3xl overflow-hidden border border-white/10 bg-primary/90 backdrop-blur-xl shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-[#915EFF] to-[#00CEA8] flex items-center justify-center text-white font-bold">
                  N
                </div>
                <div className="leading-tight">
                  <p className="text-white font-semibold">Ask Neil</p>
                  <p className="text-secondary text-xs">Mock UI (wired to real data next)</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                aria-label="Close Ask Neil"
              >
                ×
              </button>
            </div>

            {/* Suggested prompts */}
            <div className="px-5 pt-4">
              <p className="text-secondary text-[11px] uppercase tracking-[0.2em] font-semibold">
                Suggested
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePrompt(p)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 hover:border-[#915EFF]/40 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="px-5 py-4 max-h-[320px] overflow-auto space-y-3">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  variants={bubble}
                  initial="hidden"
                  animate="show"
                  className={`w-full flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                      m.role === "user"
                        ? "bg-white/10 border-white/10 text-white"
                        : "bg-black/30 border-white/10 text-white"
                    }`}
                  >
                    {m.meta?.title && (
                      <p className="text-[11px] uppercase tracking-[0.2em] text-secondary mb-1">
                        {m.meta.title}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed">{m.content}</p>
                    {m.meta?.sources?.length ? (
                      <p className="mt-2 text-[11px] text-secondary">
                        Sources: {m.meta.sources.join(" • ")}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5">
              <div className="flex gap-2 mb-3">
                {quickActions.map((a) => (
                  <button
                    key={a.label}
                    onClick={a.onClick}
                    className="flex-1 text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#915EFF]/40 transition-colors"
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask about projects, school, basketball…"
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-secondary focus:outline-none focus:border-[#915EFF]/50"
                />
                <button
                  type="submit"
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#915EFF] to-[#00CEA8] text-white font-semibold text-sm hover:brightness-110 transition"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

