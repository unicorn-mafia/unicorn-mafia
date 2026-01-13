'use client';

import { useRef, useEffect, useState } from 'react';
import { useGifFrames } from '@/app/_hooks/useGifFrames';
import { useScrollProgress } from '@/app/_hooks/useScrollProgress';

export default function GallopingHorseFrame() {
  const scrollProgress = useScrollProgress();
  const { frames, loading, width, height } = useGifFrames('/uniiii.gif');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  // Track window size
  useEffect(() => {
    const updateSize = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Draw wallpaper pattern
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length === 0 || dimensions.w === 0 || width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate frame index based on scroll (3 cycles per page - slower/less sensitive)
    const cycleProgress = (scrollProgress * 3) % 1;
    const frameIndex = Math.floor(cycleProgress * frames.length);
    const frame = frames[frameIndex];
    if (!frame) return;

    // Create a fresh canvas for this frame
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = width;
    frameCanvas.height = height;
    const frameCtx = frameCanvas.getContext('2d');
    if (!frameCtx) return;
    frameCtx.putImageData(frame.imageData, 0, 0);

    // Completely reset canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tile settings - preserve aspect ratio
    const scale = 0.12; // Scale factor for the horse size
    const tileWidth = width * scale;
    const tileHeight = height * scale;

    const spacingX = tileWidth * 1.3; // Tighter horizontal spacing
    const spacingY = tileHeight * 1.2; // Tighter vertical spacing
    const diagonalOffset = spacingX / 2; // Offset for diagonal pattern

    const cols = Math.ceil(dimensions.w / spacingX) + 2;
    const rows = Math.ceil(dimensions.h / spacingY) + 2;

    // Set opacity - higher = more visible/darker
    ctx.globalAlpha = 0.35;

    // Draw diagonal tiled pattern
    for (let row = 0; row < rows; row++) {
      const rowOffset = (row % 2) * diagonalOffset;

      for (let col = 0; col < cols; col++) {
        const x = col * spacingX + rowOffset - diagonalOffset;
        const y = row * spacingY;

        ctx.drawImage(
          frameCanvas,
          0, 0, width, height,
          x, y, tileWidth, tileHeight
        );
      }
    }

    ctx.restore();
  }, [scrollProgress, frames, width, height, dimensions]);

  if (loading || frames.length === 0) {
    return <div className="fixed inset-0 pointer-events-none z-0" />;
  }

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.w}
      height={dimensions.h}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
