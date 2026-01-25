'use client';

import { useRef, useEffect, memo } from 'react';

interface GifFrame {
  imageData: ImageData;
  delay: number;
}

interface GallopingHorseBorderProps {
  direction: 'horizontal' | 'vertical';
  scrollProgress: number;
  frames: GifFrame[];
  frameWidth: number;
  frameHeight: number;
}

const GallopingHorseBorder = memo(function GallopingHorseBorder({
  direction,
  scrollProgress,
  frames,
  frameWidth,
  frameHeight,
}: GallopingHorseBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate number of horses needed
  const horseCount = direction === 'horizontal' ? 25 : 15;
  const horseSize = 80;

  // Calculate canvas dimensions
  const canvasWidth = direction === 'horizontal' ? horseCount * horseSize : horseSize;
  const canvasHeight = direction === 'vertical' ? horseCount * horseSize : horseSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length === 0) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Calculate which frame to show based on scroll progress
    // 12 cycles per full page scroll (matching original animation)
    const cycleProgress = (scrollProgress * 12) % 1;
    const frameIndex = Math.floor(cycleProgress * frames.length);
    const frame = frames[frameIndex];

    if (!frame) return;

    // Create offscreen canvas for the frame if needed
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
    const offscreen = offscreenCanvasRef.current;
    offscreen.width = frameWidth;
    offscreen.height = frameHeight;
    const offscreenCtx = offscreen.getContext('2d');
    if (!offscreenCtx) return;

    // Put the frame data on offscreen canvas
    offscreenCtx.putImageData(frame.imageData, 0, 0);

    // Clear the main canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Set opacity
    ctx.globalAlpha = 0.1;

    // Draw horses
    for (let i = 0; i < horseCount; i++) {
      const x = direction === 'horizontal' ? i * horseSize : 0;
      const y = direction === 'vertical' ? i * horseSize : 0;

      ctx.drawImage(
        offscreen,
        0, 0, frameWidth, frameHeight,
        x, y, horseSize, horseSize
      );
    }
  }, [scrollProgress, frames, frameWidth, frameHeight, direction, horseCount, canvasWidth, canvasHeight, horseSize]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{
        contain: 'layout style paint',
        flexShrink: 0,
      }}
    />
  );
});

export default GallopingHorseBorder;
