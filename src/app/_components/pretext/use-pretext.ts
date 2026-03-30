"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type {
  PreparedTextWithSegments,
  LayoutCursor,
  LayoutLine,
} from "@chenglou/pretext";

export interface TextLine {
  text: string;
  x: number;
  y: number;
  width: number;
}

interface Obstacle {
  x: number;
  y: number;
  size: number;
}

export function usePretext(text: string, fontSpec: string) {
  const preparedRef = useRef<PreparedTextWithSegments | null>(null);
  const layoutNextLineRef = useRef<
    | ((
        prepared: PreparedTextWithSegments,
        start: LayoutCursor,
        maxWidth: number,
      ) => LayoutLine | null)
    | null
  >(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Wait for fonts to load
      await document.fonts.ready;

      const pretext = await import("@chenglou/pretext");
      if (cancelled) return;

      layoutNextLineRef.current = pretext.layoutNextLine;
      preparedRef.current = pretext.prepareWithSegments(text, fontSpec);
      setReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [text, fontSpec]);

  const layoutLines = useCallback(
    (
      obstacle: Obstacle,
      containerWidth: number,
      lineHeight: number,
    ): TextLine[] => {
      const prepared = preparedRef.current;
      const layoutNextLine = layoutNextLineRef.current;
      if (!prepared || !layoutNextLine || containerWidth <= 0) return [];

      const lines: TextLine[] = [];
      let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
      let y = 0;

      const padding = 20;
      const radius = obstacle.size / 2 + padding;
      const obsCenterX = obstacle.x + obstacle.size / 2;
      const obsCenterY = obstacle.y + obstacle.size / 2;

      for (let i = 0; i < 2000; i++) {
        const lineCenterY = y + lineHeight / 2;
        const dy = Math.abs(lineCenterY - obsCenterY);

        let availableWidth = containerWidth;
        let xOffset = 0;

        if (dy < radius) {
          const chordHalf = Math.sqrt(radius * radius - dy * dy);
          const exLeft = obsCenterX - chordHalf;
          const exRight = obsCenterX + chordHalf;

          const leftSpace = Math.max(0, exLeft);
          const rightSpace = Math.max(0, containerWidth - exRight);

          if (leftSpace >= rightSpace) {
            // Text goes on the left
            availableWidth = Math.max(40, exLeft);
            xOffset = 0;
          } else {
            // Text goes on the right
            availableWidth = Math.max(40, rightSpace);
            xOffset = exRight;
          }
        }

        const line = layoutNextLine(prepared, cursor, availableWidth);
        if (!line) break;

        lines.push({ text: line.text, x: xOffset, y, width: line.width });
        cursor = line.end;
        y += lineHeight;
      }

      return lines;
    },
    [],
  );

  return { ready, layoutLines };
}
