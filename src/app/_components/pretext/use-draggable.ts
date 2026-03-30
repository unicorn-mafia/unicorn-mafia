"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  initialPosition?: Position;
  size: number;
}

export function useDraggable({
  containerRef,
  initialPosition,
  size,
}: UseDraggableOptions) {
  const [position, setPosition] = useState<Position>(
    initialPosition ?? { x: 200, y: 200 },
  );
  const [isDragging, setIsDragging] = useState(false);
  const [lastDirection, setLastDirection] = useState<"left" | "right">("right");
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const lastX = useRef(0);
  const elementRef = useRef<HTMLImageElement>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      lastX.current = e.clientX;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      dragOffset.current = {
        x: e.clientX - rect.left - position.x,
        y: e.clientY - rect.top - position.y,
      };
    },
    [containerRef, position],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Track direction
      if (Math.abs(e.clientX - lastX.current) > 2) {
        setLastDirection(e.clientX > lastX.current ? "right" : "left");
        lastX.current = e.clientX;
      }

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const newX = Math.max(
          0,
          Math.min(
            rect.width - size,
            e.clientX - rect.left - dragOffset.current.x,
          ),
        );
        const newY = Math.max(
          0,
          Math.min(
            rect.height - size,
            e.clientY - rect.top - dragOffset.current.y,
          ),
        );
        setPosition({ x: newX, y: newY });
      });
    },
    [isDragging, containerRef, size],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return {
    position,
    isDragging,
    lastDirection,
    elementRef,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  };
}
