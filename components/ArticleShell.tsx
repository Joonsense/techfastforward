"use client";

import ReadingProgress from "@/components/ReadingProgress";

interface ArticleShellProps {
  children: React.ReactNode;
}

export default function ArticleShell({ children }: ArticleShellProps) {
  return (
    <>
      <ReadingProgress enabled />
      {children}
    </>
  );
}
