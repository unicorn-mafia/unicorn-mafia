"use client";

import { useRef, useMemo, useState } from "react";
import useMeasure from "react-use-measure";
import { usePretext } from "./use-pretext";
import { useDraggable } from "./use-draggable";
import { TextRenderer } from "./text-renderer";
import { MANIFESTO_TEXT } from "./manifesto-text";

const UNICORN_SIZE = 120;
const LINE_HEIGHT = 26;
const FONT_SPEC = '400 16px "PPNeueMontrealMono", monospace';

export default function PretextPlayground() {
  const [measureRef, bounds] = useMeasure();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { ready, layoutLines } = usePretext(MANIFESTO_TEXT, FONT_SPEC);

  const { position, isDragging, lastDirection, handlers } = useDraggable({
    containerRef,
    initialPosition: {
      x: bounds.width ? bounds.width / 2 - UNICORN_SIZE / 2 : 300,
      y: 200,
    },
    size: UNICORN_SIZE,
  });

  const lines = useMemo(() => {
    if (!ready || bounds.width <= 0) return [];
    return layoutLines(
      { x: position.x, y: position.y, size: UNICORN_SIZE },
      bounds.width,
      LINE_HEIGHT,
    );
  }, [ready, bounds.width, position.x, position.y, layoutLines]);

  const totalHeight = lines.length * LINE_HEIGHT + 100;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-6 px-6 md:px-12 lg:px-20 border-b border-neutral-300">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-medium font-body text-neutral-900 tracking-wide">
            PLAYGROUND
          </h1>
          <p className="text-xs font-body text-neutral-500 tracking-wide mt-1">
            DRAG THE UNICORN · POWERED BY{" "}
            <a
              href="https://github.com/chenglou/pretext"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-neutral-900 transition-colors"
            >
              PRETEXT
            </a>
          </p>
        </div>
      </section>

      {/* Text area */}
      <section className="px-6 md:px-12 lg:px-20 py-8">
        <div className="max-w-5xl mx-auto">
          <div
            ref={(node) => {
              measureRef(node);
              if (node) {
                (
                  containerRef as React.MutableRefObject<HTMLDivElement | null>
                ).current = node;
              }
            }}
            className="relative cursor-default"
            style={{ minHeight: `${totalHeight}px` }}
            onPointerMove={handlers.onPointerMove}
            onPointerUp={handlers.onPointerUp}
          >
            {/* Text lines */}
            {ready && <TextRenderer lines={lines} lineHeight={LINE_HEIGHT} />}

            {/* Loading state */}
            {!ready && (
              <p className="text-sm font-body text-neutral-400 tracking-wide animate-pulse">
                PREPARING TEXT...
              </p>
            )}

            {/* Draggable unicorn */}
            {ready && (
              <img
                src="/uniiii.gif"
                alt="Drag me"
                draggable={false}
                className="absolute z-10"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  width: `${UNICORN_SIZE}px`,
                  height: `${UNICORN_SIZE}px`,
                  cursor: isDragging ? "grabbing" : "grab",
                  touchAction: "none",
                  transform:
                    lastDirection === "left" ? "scaleX(-1)" : "scaleX(1)",
                  userSelect: "none",
                  opacity: 0.9,
                }}
                onPointerDown={(e) => {
                  if (!hasInteracted) setHasInteracted(true);
                  handlers.onPointerDown(e);
                }}
              />
            )}

            {/* Drag hint */}
            {ready && !hasInteracted && (
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `${position.x + UNICORN_SIZE / 2}px`,
                  top: `${position.y - 28}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <span className="text-[10px] font-body text-neutral-400 tracking-widest animate-pulse">
                  DRAG ME
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
