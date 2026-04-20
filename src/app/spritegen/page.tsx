"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";

const POST_TEXT = `I've been invited to the "To The Americas" Hackathon by the Unicorn Mafia!

120 of Europe's best builders.
$50k+ in prizes.
1 winning team to SF.

Time to cook. 🚀

sponsors:
Pydantic - https://lnkd.in/eV58E4PH
Render - https://lnkd.in/eJBbc7sw
Cognition.ai
Mubit.ai
The Residency
Expedite`;

// ── Canvas compositing ──────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

async function compositeAsset(imageUrl: string): Promise<string> {
  const sprite = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = sprite.naturalWidth;
  canvas.height = sprite.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(sprite, 0, 0);
  drawGrid(ctx, canvas.width, canvas.height);
  drawTitle(ctx, canvas.width);
  await drawSponsors(ctx, canvas.width, canvas.height);
  await drawLogo(ctx, canvas.width, canvas.height);

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(URL.createObjectURL(blob!)), "image/png"),
  );
}

// Removes background pixels: dark=true strips black bg, dark=false strips white bg
function removeBackground(
  offCtx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dark = true,
) {
  const imageData = offCtx.getImageData(0, 0, w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
    if (dark ? lum < 40 : lum > 215) d[i + 3] = 0;
  }
  offCtx.putImageData(imageData, 0, 0);
}

// Draws "TO THE AMERICAS HACKATHON" at top-right with a dark backing
function drawTitle(ctx: CanvasRenderingContext2D, W: number) {
  const margin = Math.round(W * 0.03);
  const fontSize = Math.round(W * 0.022);
  const lineHeight = Math.round(fontSize * 1.5);
  const padX = Math.round(fontSize * 0.6);
  const padY = Math.round(fontSize * 0.5);

  ctx.save();
  ctx.font = `${fontSize}px "PP Neue Bit", monospace`;

  const lines = ["TO THE AMERICAS", "HACKATHON"];
  const textW = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const bgW = Math.round(textW + padX * 2);
  const bgH = Math.round(lineHeight * lines.length + padY * 2);
  const x = W - bgW - margin;
  const y = margin;

  // Dark panel
  ctx.fillStyle = "rgba(14, 12, 8, 0.88)";
  ctx.fillRect(x, y, bgW, bgH);

  // White text
  ctx.fillStyle = "#FFFFFF";
  ctx.textBaseline = "top";
  lines.forEach((line, i) => {
    ctx.fillText(line, x + padX, y + padY + i * lineHeight);
  });

  ctx.restore();
}

// Sponsor configs: filename in /public/sponsors/, dark=true means black bg
const SPONSORS = [
  { file: "pydantic.png", dark: false }, // light/white bg → strip white
  { file: "render.png", dark: true }, // black bg → strip black
  { file: "mubit.png", dark: true }, // black bg → strip black
  { file: "cognition.png", dark: true }, // black bg → strip black
];

async function drawSponsors(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
): Promise<void> {
  const margin = Math.round(W * 0.03);
  const iconSize = Math.round(W * 0.07); // each icon: 7% of canvas
  const gap = Math.round(W * 0.015);

  const loaded: { img: HTMLImageElement; dark: boolean }[] = [];

  await Promise.allSettled(
    SPONSORS.map(async ({ file, dark }) => {
      try {
        const img = await loadImage(`/sponsors/${file}`);
        loaded.push({ img, dark });
      } catch {
        // skip missing logos silently
      }
    }),
  );

  if (loaded.length === 0) return;

  const totalW = loaded.length * iconSize + (loaded.length - 1) * gap;
  let x = W - margin - totalW;
  const y = H - margin - iconSize;

  for (const { img, dark } of loaded) {
    // Draw onto offscreen canvas so we can manipulate pixels
    const off = document.createElement("canvas");
    off.width = iconSize;
    off.height = iconSize;
    const oc = off.getContext("2d")!;
    oc.imageSmoothingEnabled = true;
    oc.drawImage(img, 0, 0, iconSize, iconSize);
    removeBackground(oc, iconSize, iconSize, dark);

    ctx.drawImage(off, x, y);
    x += iconSize + gap;
  }
}

async function drawLogo(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
): Promise<void> {
  // Fetch SVG, swap black fills → white so logo is visible on dark canvas
  const svgText = await fetch("/um-logo.svg")
    .then((r) => r.text())
    .then((t) => t.replace(/fill="black"/g, 'fill="white"'));

  const blob = new Blob([svgText], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);
    const size = Math.round(W * 0.1); // 10% of canvas width
    const margin = Math.round(W * 0.03);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, margin, H - size - margin, size, size);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const gridSize = Math.round(W / 48);
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();
}

// ── Component ───────────────────────────────────────────────────────────────

export default function SpriteGenPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback((file: File) => {
    setUploadedFile(file);
    setResultUrl(null);
    setDownloadUrl(null);
    setStatus("");
    const reader = new FileReader();
    reader.onload = (e) => setPreviewSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && ["image/png", "image/jpeg", "image/webp"].includes(file.type))
      handleFile(file);
  };

  const handleGenerate = async () => {
    if (!uploadedFile) return;
    setLoading(true);
    setResultUrl(null);
    setDownloadUrl(null);
    setStatus("Generating your sprite… (~30s)");

    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);

      const res = await fetch("/api/generate-sprite", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res
          .json()
          .catch(() => ({ error: res.statusText }));
        throw new Error(error ?? "Generation failed");
      }

      setStatus("Compositing…");
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      const finalUrl = await compositeAsset(imageUrl);
      URL.revokeObjectURL(imageUrl); // free the intermediate blob
      setResultUrl(finalUrl);
      setDownloadUrl(finalUrl);
      setStatus("");
    } catch (err) {
      setStatus(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(POST_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#14120B]">
      <div className="max-w-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-title text-3xl md:text-4xl text-white tracking-tight mb-2">
            HACKER SPRITE
            <br />
            GENERATOR
          </h1>
          <p className="font-body text-sm text-[#888880]">
            Generate your cyberpunk sprite in 3 quick steps.
          </p>
          {/* Horn bar */}
          <div className="mt-4 h-[3px] w-full flex">
            <div className="flex-1 bg-[#B307EB]" />
            <div className="flex-1 bg-[#3198F1]" />
            <div className="flex-1 bg-[#4EF9BD]" />
            <div className="flex-1 bg-[#EE1701]" />
          </div>
        </div>

        {/* Step 1 */}
        <div className="mb-4 border border-[#2a2820] border-l-[3px] border-l-[#B307EB] p-5">
          <p className="font-body text-xs text-[#888880] mb-1">01</p>
          <h2 className="font-title text-sm text-white uppercase tracking-wider mb-4">
            Upload your photo
          </h2>

          {!previewSrc ? (
            <label
              className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#2a2820] p-8 cursor-pointer transition-colors hover:border-[#B307EB] text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <span className="text-2xl text-[#B307EB]">⬆</span>
              <span className="font-body text-sm text-white">
                Click to choose a file
              </span>
              <span className="font-body text-xs text-[#888880]">
                PNG, JPG, or WEBP
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </label>
          ) : (
            <div className="flex items-center gap-4">
              <Image
                src={previewSrc}
                alt="Preview"
                width={80}
                height={80}
                className="object-cover border border-[#2a2820] [image-rendering:pixelated]"
              />
              <button
                onClick={() => {
                  setPreviewSrc(null);
                  setUploadedFile(null);
                }}
                className="font-body text-xs text-[#888880] border border-[#2a2820] px-3 py-1 transition-colors hover:border-[#EE1701]"
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className="mb-4 border border-[#2a2820] border-l-[3px] border-l-[#3198F1] p-5">
          <p className="font-body text-xs text-[#888880] mb-1">02</p>
          <h2 className="font-title text-sm text-white uppercase tracking-wider mb-4">
            Generate sprite
          </h2>

          <button
            onClick={handleGenerate}
            disabled={!uploadedFile || loading}
            className="font-title text-sm uppercase tracking-wider px-6 py-3 bg-[#3198F1] text-black transition-colors disabled:opacity-30"
          >
            {loading ? "Generating…" : "Generate Asset"}
          </button>

          {status && (
            <p className="font-body text-xs text-[#888880] mt-3">{status}</p>
          )}

          {resultUrl && (
            <div className="mt-4">
              <Image
                src={resultUrl}
                alt="Generated sprite"
                width={400}
                height={400}
                className="w-full max-w-sm border border-[#2a2820] [image-rendering:pixelated]"
                unoptimized
              />
              <a
                href={downloadUrl ?? ""}
                download="unicorn-mafia-sprite.png"
                className="inline-block mt-3 font-title text-sm uppercase tracking-wider px-5 py-2 border border-[#4EF9BD] text-[#4EF9BD] transition-colors"
              >
                ↓ Download sprite
              </a>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className="border border-[#2a2820] border-l-[3px] border-l-[#4EF9BD] p-5">
          <p className="font-body text-xs text-[#888880] mb-1">03</p>
          <h2 className="font-title text-sm text-white uppercase tracking-wider mb-4">
            Copy your post text
          </h2>

          <textarea
            readOnly
            rows={10}
            value={POST_TEXT}
            className="w-full font-body text-sm text-[#e0e0e0] bg-black p-3 border border-[#2a2820] resize-none focus:outline-none focus:border-[#4EF9BD] mb-3"
          />

          <button
            onClick={handleCopy}
            className={`font-title text-sm uppercase tracking-wider px-5 py-2 border border-[#4EF9BD] transition-colors ${
              copied
                ? "bg-[#4EF9BD] text-black"
                : "bg-transparent text-[#4EF9BD]"
            }`}
          >
            {copied ? "Copied!" : "Copy text"}
          </button>
        </div>
      </div>
    </div>
  );
}
