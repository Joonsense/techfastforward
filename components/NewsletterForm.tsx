"use client";

import { useState, useRef } from "react";
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterFormProps {
  compact?: boolean;
  locale?: "en" | "ko";
}

const MESSAGES = {
  en: {
    placeholder: "your@email.com",
    button: "Subscribe",
    success: "You're in. We'll keep you in the loop.",
    error: "Something went wrong. Please try again.",
    networkError: "Network error. Please try again.",
    duplicateError: "Already subscribed.",
  },
  ko: {
    placeholder: "이메일 주소",
    button: "구독하기",
    success: "구독 완료. 매일 AI 신호를 받아보세요.",
    error: "오류가 발생했습니다. 다시 시도해주세요.",
    networkError: "네트워크 오류. 다시 시도해주세요.",
    duplicateError: "이미 구독 중입니다.",
  },
};

export default function NewsletterForm({ compact = false, locale = "en" }: NewsletterFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const msgs = locale === "ko" ? MESSAGES.ko : MESSAGES.en;

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
        setMessage(msgs.success);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setStatus("error");
        if (res.status === 409) {
          setMessage(msgs.duplicateError);
        } else {
          setMessage(data.error ?? msgs.error);
        }
      }
    } catch {
      setStatus("error");
      setMessage(msgs.networkError);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={`flex ${compact ? "flex-col" : "items-center"} gap-2`}>
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
            placeholder={msgs.placeholder}
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
            <>{msgs.button} <ArrowRight size={12} /></>
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
