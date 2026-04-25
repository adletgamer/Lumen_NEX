"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Cpu } from "lucide-react";
import { useState } from "react";
import { NexusCore } from "@/components/nexus-core";
import { AgenticFeed } from "@/components/agentic-feed";
import { cn } from "@/lib/utils";

export default function AgentPage() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent" }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage({ text });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 py-4 glass-bright flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <NexusCore size={40} state={isStreaming ? "processing" : "idle"} />
          <div>
            <h1 className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
              Lumen NEX Agent
            </h1>
            <p className="text-xs" style={{ color: isStreaming ? "#00d4aa" : "var(--color-muted)" }}>
              {isStreaming ? "Processing..." : "Ready"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: isStreaming ? "#6366f1" : "#00d4aa" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: isStreaming ? 0.6 : 2, repeat: Infinity }}
            />
            <span
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: isStreaming ? "#6366f1" : "#00d4aa" }}
            >
              {isStreaming ? "Thinking" : "Online"}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <NexusCore size={120} state="idle" />
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--color-foreground)" }}>
                  Ask Lumen NEX anything about your business
                </p>
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  Try: &quot;How are sales this month?&quot; or &quot;What tasks need attention?&quot;
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                {[
                  "How are sales this month?",
                  "What are my top market signals?",
                  "Show me active tasks",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); }}
                    className="text-xs px-3 py-1.5 rounded-full transition-colors"
                    style={{
                      background: "var(--color-surface-elevated)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-muted-foreground)",
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message) => {
              const isUser = message.role === "user";
              const textContent = message.parts
                ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text)
                .join("") ?? "";

              if (!textContent) return null;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className={cn("flex gap-3", isUser && "flex-row-reverse")}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: isUser ? "rgba(99,102,241,0.15)" : "rgba(0,212,170,0.15)",
                      border: `1px solid ${isUser ? "rgba(99,102,241,0.3)" : "rgba(0,212,170,0.3)"}`,
                    }}
                  >
                    {isUser ? (
                      <User className="w-4 h-4" style={{ color: "#6366f1" }} />
                    ) : (
                      <Bot className="w-4 h-4" style={{ color: "#00d4aa" }} />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      isUser ? "rounded-tr-sm" : "rounded-tl-sm"
                    )}
                    style={
                      isUser
                        ? {
                            background: "rgba(99,102,241,0.15)",
                            border: "1px solid rgba(99,102,241,0.2)",
                            color: "var(--color-foreground)",
                          }
                        : {
                            background: "var(--color-surface-elevated)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-foreground)",
                          }
                    }
                  >
                    {textContent}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(0,212,170,0.15)",
                  border: "1px solid rgba(0,212,170,0.3)",
                }}
              >
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#00d4aa" }} />
              </div>
              <div
                className="glass rounded-2xl rounded-tl-sm px-4 py-3"
                style={{ border: "1px solid var(--color-border)" }}
              >
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#00d4aa" }}
                      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div
          className="px-6 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <div
            className="flex items-end gap-3 glass-bright rounded-2xl px-4 py-3"
            style={{ border: "1px solid var(--color-border-bright)" }}
          >
            <Cpu className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: "var(--color-muted)" }} />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the agent..."
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed placeholder:text-[var(--color-muted)] min-h-[20px] max-h-32"
              style={{ color: "var(--color-foreground)" }}
              aria-label="Message input"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
              style={{
                background: input.trim() && !isStreaming ? "#00d4aa" : "var(--color-surface)",
                color: input.trim() && !isStreaming ? "#08090c" : "var(--color-muted)",
              }}
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-center text-[10px] mt-2" style={{ color: "var(--color-muted)" }}>
            Lumen NEX can make mistakes. Verify important decisions.
          </p>
        </div>
      </div>

      {/* Reasoning feed */}
      <aside
        className="hidden lg:flex flex-col w-80 flex-shrink-0 p-5 h-screen sticky top-0"
        style={{ borderLeft: "1px solid var(--color-border)" }}
      >
        <AgenticFeed />
      </aside>
    </div>
  );
}
