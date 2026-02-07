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

        const rawWidth = decompressedFrames[0].dims?.width;
        const rawHeight = decompressedFrames[0].dims?.height;
        const width = Math.floor(Number(rawWidth) || 0);
        const height = Math.floor(Number(rawHeight) || 0);

        if (!width || !height || !Number.isFinite(width) || !Number.isFinite(height)) {
          throw new Error('Invalid GIF dimensions');
        }

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
          try {
            const frameWidth = Math.floor(Number(frame.dims?.width) || 0);
            const frameHeight = Math.floor(Number(frame.dims?.height) || 0);
            const frameLeft = Math.floor(Number(frame.dims?.left) || 0);
            const frameTop = Math.floor(Number(frame.dims?.top) || 0);

            // Skip invalid frames
            if (frameWidth <= 0 || frameHeight <= 0) continue;
            if (!Number.isFinite(frameWidth) || !Number.isFinite(frameHeight)) continue;
            if (!frame.patch || frame.patch.length !== frameWidth * frameHeight * 4) continue;

            // Create ImageData from the frame's patch
            const frameImageData = new ImageData(
              new Uint8ClampedArray(frame.patch),
              frameWidth,
              frameHeight
            );

            // Always clear canvas for each frame to ensure self-contained frames
            ctx.clearRect(0, 0, width, height);

            // Draw the frame patch at its position
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = frameWidth;
            tempCanvas.height = frameHeight;
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCtx.putImageData(frameImageData, 0, 0);

            ctx.drawImage(tempCanvas, frameLeft, frameTop);

            // Get the full frame as standalone image
            const fullFrameData = ctx.getImageData(0, 0, width, height);

            processedFrames.push({
              imageData: fullFrameData,
              delay: frame.delay,
            });
          } catch (frameErr) {
            // Skip frames that fail to process
            console.warn('Skipping frame due to error:', frameErr);
            continue;
          }
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
