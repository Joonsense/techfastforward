"use client";

import { useEffect, useState } from "react";

interface ReadingProgressProps {
  enabled: boolean;
}

export default function ReadingProgress({ enabled }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (docHeight <= 0) return;
      setProgress(Math.min(100, (scrollTop / docHeight) * 100));
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
      style={{ background: "var(--border)" }}
    >
      <div
        className="h-full transition-all duration-75 ease-out"
        style={{
          width: `${progress}%`,
          background: "var(--accent)",
        }}
      />
    </div>
  );
}
