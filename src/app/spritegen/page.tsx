"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";

const BRAND = {
  purple: "#B307EB",
  blue: "#3198F1",
  green: "#4EF9BD",
  red: "#EE1701",
  white: "#FFFFFF",
  darkBg: "#14120B",
};

const POST_TEXT = `I've got an early invite to the 'To The Americas' Hackathon by the Unicorn Mafia.
excited to team up with some of Europe's top builders.
lets get cooking!!

sponsors:
Pydantic - https://lnkd.in/eV58E4PH  Render - https://lnkd.in/eJBbc7sw
cognition.ai
mubit.ai The Residency
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
  drawBadge(ctx, canvas.width);
  drawHashtag(ctx, canvas.width);

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(URL.createObjectURL(blob!)), "image/png")
  );
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const gridSize = Math.round(W / 48);
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();
}

function drawBadge(ctx: CanvasRenderingContext2D, W: number) {
  const SCALE = 3;
  const bW = 100, bH = 28;
  const margin = Math.round(W * 0.03);

  const off = document.createElement("canvas");
  off.width = bW; off.height = bH;
  const oc = off.getContext("2d")!;
  oc.imageSmoothingEnabled = false;

  oc.fillStyle = BRAND.darkBg;
  oc.fillRect(0, 0, bW, bH);

  oc.strokeStyle = "rgba(255,255,255,0.07)";
  oc.lineWidth = 1;
  for (let x = 0; x <= bW; x += 4) { oc.beginPath(); oc.moveTo(x, 0); oc.lineTo(x, bH); oc.stroke(); }
  for (let y = 0; y <= bH; y += 4) { oc.beginPath(); oc.moveTo(0, y); oc.lineTo(bW, y); oc.stroke(); }

  oc.strokeStyle = BRAND.white;
  oc.lineWidth = 1;
  oc.strokeRect(0.5, 0.5, bW - 1, bH - 1);

  const colors = [BRAND.purple, BRAND.blue, BRAND.green, BRAND.red];
  const blockW = Math.floor(bW / 4);
  colors.forEach((c, i) => {
    oc.fillStyle = c;
    oc.fillRect(blockW * i, 0, i === 3 ? bW - blockW * 3 : blockW, 2);
  });

  oc.font = `6px "PP Neue Bit", monospace`;
  oc.fillStyle = BRAND.white;
  oc.textBaseline = "top";
  oc.fillText("UNICORN MAFIA", 4, 6);

  oc.font = `5px "PP Neue Bit", monospace`;
  oc.fillStyle = BRAND.green;
  oc.fillText("INVITED HACKER", 4, 17);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(off, margin, margin, bW * SCALE, bH * SCALE);
}

function drawHashtag(ctx: CanvasRenderingContext2D, W: number) {
  const SCALE = 3;
  const text = "#TotheAmericas";
  const margin = Math.round(W * 0.03);
  const fontSize = 7;
  const padX = 5, padY = 4;

  const tmp = document.createElement("canvas");
  tmp.width = 300; tmp.height = 20;
  const tc = tmp.getContext("2d")!;
  tc.font = `${fontSize}px "PP Neue Bit", monospace`;
  const textW = Math.ceil(tc.measureText(text).width);

  const bW = textW + padX * 2;
  const bH = fontSize + padY * 2;
  const off = document.createElement("canvas");
  off.width = bW; off.height = bH;
  const oc = off.getContext("2d")!;
  oc.imageSmoothingEnabled = false;
  oc.font = `${fontSize}px "PP Neue Bit", monospace`;
  oc.fillStyle = BRAND.white;
  oc.textBaseline = "top";
  oc.fillText(text, padX, padY);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(off, W - bW * SCALE - margin, margin, bW * SCALE, bH * SCALE);
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
    if (file && ["image/png", "image/jpeg", "image/webp"].includes(file.type)) handleFile(file);
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

      const res = await fetch("/api/generate-sprite", { method: "POST", body: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.error ?? "Generation failed");

      setStatus("Compositing…");
      const finalUrl = await compositeAsset(data.imageUrl);
      setResultUrl(finalUrl);
      setDownloadUrl(finalUrl);
      setStatus("");
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
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
    <div className="min-h-screen" style={{ backgroundColor: BRAND.darkBg }}>
      <div className="max-w-xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-title text-3xl md:text-4xl text-white tracking-tight mb-2">
            HACKER SPRITE<br />GENERATOR
          </h1>
          <p className="font-body text-sm" style={{ color: "#888880" }}>
            Generate your cyberpunk sprite in 3 quick steps.
          </p>
          {/* Horn bar */}
          <div className="mt-4 h-[3px] w-full flex">
            {[BRAND.purple, BRAND.blue, BRAND.green, BRAND.red].map((c) => (
              <div key={c} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        {/* Step 1 */}
        <div className="mb-4 border border-[#2a2820] p-5" style={{ borderLeft: `3px solid ${BRAND.purple}` }}>
          <p className="font-body text-xs mb-1" style={{ color: "#888880" }}>01</p>
          <h2 className="font-title text-sm text-white uppercase tracking-wider mb-4">Upload your photo</h2>

          {!previewSrc ? (
            <label
              className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#2a2820] p-8 cursor-pointer transition-colors hover:border-[#B307EB] text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <span className="text-2xl" style={{ color: BRAND.purple }}>⬆</span>
              <span className="font-body text-sm text-white">Click to choose a file</span>
              <span className="font-body text-xs" style={{ color: "#888880" }}>PNG, JPG, or WEBP</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </label>
          ) : (
            <div className="flex items-center gap-4">
              <Image src={previewSrc} alt="Preview" width={80} height={80} className="object-cover border border-[#2a2820]" style={{ imageRendering: "pixelated" }} />
              <button
                onClick={() => { setPreviewSrc(null); setUploadedFile(null); }}
                className="font-body text-xs border border-[#2a2820] px-3 py-1 transition-colors hover:border-[#EE1701]"
                style={{ color: "#888880" }}
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className="mb-4 border border-[#2a2820] p-5" style={{ borderLeft: `3px solid ${BRAND.blue}` }}>
          <p className="font-body text-xs mb-1" style={{ color: "#888880" }}>02</p>
          <h2 className="font-title text-sm text-white uppercase tracking-wider mb-4">Generate sprite</h2>

          <button
            onClick={handleGenerate}
            disabled={!uploadedFile || loading}
            className="font-title text-sm uppercase tracking-wider px-6 py-3 transition-colors disabled:opacity-30"
            style={{ background: BRAND.blue, color: "#000" }}
          >
            {loading ? "Generating…" : "Generate Asset"}
          </button>

          {status && (
            <p className="font-body text-xs mt-3" style={{ color: "#888880" }}>{status}</p>
          )}

          {resultUrl && (
            <div className="mt-4">
              <Image
                src={resultUrl}
                alt="Generated sprite"
                width={400}
                height={400}
                className="w-full max-w-sm border border-[#2a2820]"
                style={{ imageRendering: "pixelated" }}
                unoptimized
              />
              <a
                href={downloadUrl ?? ""}
                download="unicorn-mafia-sprite.png"
                className="inline-block mt-3 font-title text-sm uppercase tracking-wider px-5 py-2 border transition-colors"
                style={{ borderColor: BRAND.green, color: BRAND.green }}
              >
                ↓ Download sprite
              </a>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className="border border-[#2a2820] p-5" style={{ borderLeft: `3px solid ${BRAND.green}` }}>
          <p className="font-body text-xs mb-1" style={{ color: "#888880" }}>03</p>
          <h2 className="font-title text-sm text-white uppercase tracking-wider mb-4">Copy your post text</h2>

          <textarea
            readOnly
            rows={10}
            value={POST_TEXT}
            className="w-full font-body text-sm p-3 border border-[#2a2820] resize-none focus:outline-none focus:border-[#4EF9BD] mb-3"
            style={{ background: "#000", color: "#e0e0e0" }}
          />

          <button
            onClick={handleCopy}
            className="font-title text-sm uppercase tracking-wider px-5 py-2 border transition-colors"
            style={{ borderColor: BRAND.green, color: copied ? "#000" : BRAND.green, background: copied ? BRAND.green : "transparent" }}
          >
            {copied ? "Copied!" : "Copy text"}
          </button>
        </div>
      </div>
    </div>
  );
}
