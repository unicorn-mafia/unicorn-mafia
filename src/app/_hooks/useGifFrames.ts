'use client';

import { useState, useEffect, useRef } from 'react';
import { parseGIF, decompressFrames } from 'gifuct-js';

interface GifFrame {
  imageData: ImageData;
  delay: number;
}

interface UseGifFramesResult {
  frames: GifFrame[];
  loading: boolean;
  error: Error | null;
  width: number;
  height: number;
}

// Cache for decoded GIF frames (shared across components)
// Clear on module reload during development
const frameCache = new Map<string, { frames: GifFrame[]; width: number; height: number }>();
frameCache.clear();

export function useGifFrames(gifUrl: string): UseGifFramesResult {
  const [frames, setFrames] = useState<GifFrame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check cache first
    const cached = frameCache.get(gifUrl);
    if (cached) {
      setFrames(cached.frames);
      setDimensions({ width: cached.width, height: cached.height });
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadGif() {
      try {
        setLoading(true);
        setError(null);

        // Fetch the GIF file
        const response = await fetch(gifUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch GIF: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        // Parse and decompress the GIF
        const gif = parseGIF(arrayBuffer);
        const decompressedFrames = decompressFrames(gif, true);

        if (cancelled) return;

        if (decompressedFrames.length === 0) {
          throw new Error('No frames found in GIF');
        }

        const width = decompressedFrames[0].dims.width;
        const height = decompressedFrames[0].dims.height;

        // Create a canvas for compositing frames
        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas');
        }
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        // Convert each frame to ImageData
        const processedFrames: GifFrame[] = [];

        for (const frame of decompressedFrames) {
          // Create ImageData from the frame's patch
          const frameImageData = new ImageData(
            new Uint8ClampedArray(frame.patch),
            frame.dims.width,
            frame.dims.height
          );

          // Always clear canvas for each frame to ensure self-contained frames
          // This is important for scroll-based animation where we jump between frames
          ctx.clearRect(0, 0, width, height);

          // Draw the frame patch at its position
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = frame.dims.width;
          tempCanvas.height = frame.dims.height;
          const tempCtx = tempCanvas.getContext('2d')!;
          tempCtx.putImageData(frameImageData, 0, 0);

          ctx.drawImage(tempCanvas, frame.dims.left, frame.dims.top);

          // Get the full frame as standalone image
          const fullFrameData = ctx.getImageData(0, 0, width, height);

          processedFrames.push({
            imageData: fullFrameData,
            delay: frame.delay,
          });
        }

        if (cancelled) return;

        // Cache the result
        frameCache.set(gifUrl, { frames: processedFrames, width, height });

        setFrames(processedFrames);
        setDimensions({ width, height });
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    }

    loadGif();

    return () => {
      cancelled = true;
    };
  }, [gifUrl]);

  return {
    frames,
    loading,
    error,
    width: dimensions.width,
    height: dimensions.height,
  };
}
