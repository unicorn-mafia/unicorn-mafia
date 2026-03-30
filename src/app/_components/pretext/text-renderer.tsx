"use client";

import type { TextLine } from "./use-pretext";

interface TextRendererProps {
  lines: TextLine[];
  lineHeight: number;
}

export function TextRenderer({ lines, lineHeight }: TextRendererProps) {
  return (
    <>
      {lines.map((line, i) => (
        <span
          key={i}
          className="absolute whitespace-nowrap font-body text-neutral-900 select-none pointer-events-none"
          style={{
            left: `${line.x}px`,
            top: `${line.y}px`,
            fontSize: "16px",
            lineHeight: `${lineHeight}px`,
            letterSpacing: "0.01em",
          }}
        >
          {line.text}
        </span>
      ))}
    </>
  );
}
