"use client";

import { useState, useRef } from "react";
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = inputRef.current?.value.trim() ?? "";
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage("You're in. We'll keep you in the loop.");
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Email input */}
        <div
          className="flex items-center gap-2 flex-1 px-3 rounded-lg"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            height: "36px",
          }}
        >
          <Mail size={13} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="email"
            placeholder="your@email.com"
            disabled={status === "loading" || status === "success"}
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ color: "var(--text)", caretColor: "var(--accent)" }}
            autoComplete="email"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="flex items-center gap-1.5 px-3.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-50 flex-shrink-0"
          style={{
            height: "36px",
            background: status === "success" ? "var(--bg-secondary)" : "var(--accent)",
            color: status === "success" ? "var(--text-muted)" : "#fff",
            border: "1px solid transparent",
          }}
        >
          {status === "loading" ? (
            <Loader size={12} className="animate-spin" />
          ) : status === "success" ? (
            <CheckCircle size={12} />
          ) : (
            <>Subscribe <ArrowRight size={12} /></>
          )}
        </button>
      </form>

      {/* Status message */}
      {message && (
        <div className="flex items-center gap-1.5 mt-2">
          {status === "success" ? (
            <CheckCircle size={11} style={{ color: "#22c55e" }} />
          ) : (
            <AlertCircle size={11} style={{ color: "#ef4444" }} />
          )}
          <p
            className="text-[11px]"
            style={{ color: status === "success" ? "#22c55e" : "#ef4444" }}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
