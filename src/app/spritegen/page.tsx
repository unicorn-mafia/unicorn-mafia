"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

// ── Tool / sponsor types (defined early so helpers can reference them) ──────

interface ToolOption {
  id: string;
  label: string;
  iconFile: string;
  canvasFile: string;
  mode: "dark" | "light" | "none";
  invert?: boolean;
  uiInvert?: boolean;
}

// ── Post text variants (dynamic, based on selected tools) ──────────────────

function getPostVariants(
  toolIds: string[],
  toolOptions: ToolOption[],
): string[] {
  const names = toolIds
    .map((id) => toolOptions.find((t) => t.id === id)?.label ?? id)
    .join(", ");
  return [
    `We're cooking. 🔥

@UnicornMafia — To The Americas Hackathon
120 builders. £50k+ prizes. London → SF.

Stack: ${names}`,

    `120 of Europe's best builders. One winner flies to SF. 🏆

I'm coming for it.

@UnicornMafia — To The Americas | £50k+

Stack: ${names}`,

    `The build has started. ⚔️

@UnicornMafia | To The Americas
London. $50k. SF finale.

Running on: ${names}`,
  ];
}

// ── Background palette config ───────────────────────────────────────────────

interface BgPalette {
  dark: string;
  light: string;
  accent: string;
  burstInner: string; // centre of star gradient
  burstMid: string; // mid star gradient
  burstOuter: string; // outer star gradient
  burstGlow: string; // shadow glow on star
}

const BG_PALETTES: BgPalette[] = [
  {
    dark: "#060e24",
    light: "#0d2a5a",
    accent: "#3198F1",
    burstInner: "#ffffff",
    burstMid: "#44ddff",
    burstOuter: "#0055cc",
    burstGlow: "#00aaff",
  }, // UM blue
  {
    dark: "#1a0035",
    light: "#360068",
    accent: "#B307EB",
    burstInner: "#ffffff",
    burstMid: "#ff66ff",
    burstOuter: "#8800bb",
    burstGlow: "#cc00ff",
  }, // UM purple
  {
    dark: "#001a0d",
    light: "#003828",
    accent: "#4EF9BD",
    burstInner: "#ffffff",
    burstMid: "#ccff44",
    burstOuter: "#00aa55",
    burstGlow: "#00ffaa",
  }, // UM green
  {
    dark: "#200008",
    light: "#480015",
    accent: "#EE1701",
    burstInner: "#ffee22",
    burstMid: "#ff8800",
    burstOuter: "#bb1100",
    burstGlow: "#ff5500",
  }, // UM red
];

// ── Hackathon stats types ───────────────────────────────────────────────────

type Stage = "Ideating" | "Building" | "Shipping" | "Shipped";
type Sleep = "Full" | "Low" | "Fumes";

const STAGE_PROGRESS: Record<Stage, number> = {
  Ideating: 0.2,
  Building: 0.55,
  Shipping: 0.8,
  Shipped: 1.0,
};

const SLEEP_FILL: Record<Sleep, number> = {
  Full: 1.0,
  Low: 0.45,
  Fumes: 0.12,
};

// Hackathon kicked off at 11:00 AM on April 25 2026
const HACKATHON_START = new Date(2026, 3, 25, 11, 0, 0, 0); // month is 0-indexed

function getElapsed(): { h: number; m: number } {
  const ms = Date.now() - HACKATHON_START.getTime();
  const totalMins = Math.max(0, Math.floor(ms / 60_000));
  return { h: Math.floor(totalMins / 60), m: totalMins % 60 };
}

// ── Tool / sponsor config ───────────────────────────────────────────────────

const TOOL_OPTIONS: ToolOption[] = [
  {
    id: "pydantic",
    label: "Pydantic",
    iconFile: "pydantic.png",
    canvasFile: "pydantic.png",
    mode: "none",
  },
  {
    id: "render",
    label: "Render",
    iconFile: "render.png",
    canvasFile: "render_icon.png",
    mode: "dark",
  },
  {
    id: "mubit",
    label: "Mubit",
    iconFile: "mubit.png",
    canvasFile: "mubit_icon.png",
    mode: "dark",
  },
  {
    id: "cognition",
    label: "Cognition",
    iconFile: "cognition.png",
    canvasFile: "cognition.png",
    mode: "dark",
  },
];

// ── Canvas compositing ──────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

async function compositeAsset(
  imageUrl: string,
  toolIds: string[],
  palette: BgPalette,
  stats: {
    sector: string;
    teamSize: number;
    stage: Stage;
    sleep: Sleep;
    hoursIn: number;
    minsIn: number;
  },
): Promise<string> {
  const sprite = await loadImage(imageUrl);
  const W = sprite.naturalWidth;
  const H = sprite.naturalHeight;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  // 1. Pure black base
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);

  // 2. Radial speed lines — brand colour palette
  drawRadialLines(ctx, W, H, palette);

  // 3. Sprite — strip black bg so lines show through behind the character
  const spriteOff = document.createElement("canvas");
  spriteOff.width = W;
  spriteOff.height = H;
  const spriteCtx = spriteOff.getContext("2d")!;
  spriteCtx.imageSmoothingEnabled = false;
  spriteCtx.drawImage(sprite, 0, 0);
  removeSpriteBackground(spriteCtx, W, H);
  ctx.drawImage(spriteOff, 0, 0);

  // 4. Sponsor tool icons — game HUD panel in bottom-right
  await drawToolsPanel(ctx, W, H, toolIds, palette);

  // 5. Stats panel — game HUD top-left
  drawStatsPanel(ctx, W, H, palette, stats);

  // 6. Title label + UM watermark
  drawTitle(ctx, W);
  await drawLogo(ctx, W, H);

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(URL.createObjectURL(blob!)), "image/png"),
  );
}

// Removes background pixels and optionally inverts dark icons to white
// mode: "dark" strips near-black bg, "light" strips near-white bg, "none" = already transparent
// invert: flips pixel colours (for black icons on transparent bg that need to show on dark canvas)
function removeBackground(
  offCtx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mode: "dark" | "light" | "none" = "dark",
  invert = false,
) {
  const imageData = offCtx.getImageData(0, 0, w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
    if (mode === "dark" && lum < 60) d[i + 3] = 0;
    else if (mode === "light" && lum > 215) d[i + 3] = 0;
    else if (invert) {
      d[i] = 255 - d[i];
      d[i + 1] = 255 - d[i + 1];
      d[i + 2] = 255 - d[i + 2];
    }
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

// Crisp alternating radial speed lines — drawn on black bg before the sprite
// Radial speed-line background — brand palette wedges radiating from centre
function drawRadialLines(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  palette: BgPalette,
) {
  const cx = W * 0.44;
  const cy = H * 0.46;
  const numRays = 20;
  const maxR = Math.hypot(W, H);

  ctx.save();
  for (let i = 0; i < numRays; i++) {
    const startAngle = (i / numRays) * Math.PI * 2;
    const endAngle = ((i + 0.5) / numRays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, maxR, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? palette.light : palette.dark;
    ctx.fill();
  }
  ctx.restore();
}

// Remove the sprite background regardless of what colour Gemini chose.
// Samples the four corners to detect the actual bg colour, then removes
// any pixel within `THRESHOLD` colour-distance of that sampled colour.
function removeSpriteBackground(
  offCtx: CanvasRenderingContext2D,
  w: number,
  h: number,
) {
  const imageData = offCtx.getImageData(0, 0, w, h);
  const d = imageData.data;

  // Average the four corner pixels to get the background colour
  const corners = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
  ];
  let bgR = 0,
    bgG = 0,
    bgB = 0;
  for (const [cx, cy] of corners) {
    const idx = (cy * w + cx) * 4;
    bgR += d[idx] / 4;
    bgG += d[idx + 1] / 4;
    bgB += d[idx + 2] / 4;
  }

  // Remove pixels whose colour is close to the sampled background
  const THRESHOLD = 72; // colour-distance tolerance (0–441)
  for (let i = 0; i < d.length; i += 4) {
    const dr = d[i] - bgR;
    const dg = d[i + 1] - bgG;
    const db = d[i + 2] - bgB;
    if (Math.sqrt(dr * dr + dg * dg + db * db) < THRESHOLD) {
      d[i + 3] = 0;
    }
  }

  offCtx.putImageData(imageData, 0, 0);
}

// ── Stats panel — top-left game HUD ────────────────────────────────────────
function drawStatsPanel(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  palette: BgPalette,
  stats: {
    sector: string;
    teamSize: number;
    stage: Stage;
    sleep: Sleep;
    hoursIn: number;
    minsIn: number;
  },
) {
  const MARGIN = Math.round(W * 0.03);
  const FONT_SM = Math.round(W * 0.022);
  const FONT_XS = Math.round(W * 0.018);
  const LINE = Math.round(FONT_SM * 1.75);
  const PAD = Math.round(W * 0.025);
  const BAR_H = Math.round(W * 0.022);
  const BAR_W = Math.round(W * 0.22);

  // Number of rows: timer + sector + team + stage bar + sleep bar
  const ROWS = 5;
  const panelH = PAD * 2 + ROWS * LINE;
  const panelW = BAR_W + PAD * 2 + Math.round(W * 0.06); // label + bar

  ctx.save();

  // ── Dark backing panel ──────────────────────────────────────────────────
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(MARGIN, MARGIN, panelW, panelH);
  ctx.strokeStyle = palette.accent + "cc";
  ctx.lineWidth = Math.max(2, Math.round(W * 0.003));
  ctx.strokeRect(MARGIN, MARGIN, panelW, panelH);

  // ── Helper: label + value on one row ───────────────────────────────────
  const labelX = MARGIN + PAD;
  let rowY = MARGIN + PAD + FONT_SM;

  function drawLabel(label: string, value: string, color = "#ffffff") {
    ctx.font = `${FONT_XS}px "PP Neue Bit", monospace`;
    ctx.fillStyle = palette.accent;
    ctx.textBaseline = "alphabetic";
    ctx.fillText(label, labelX, rowY);
    ctx.font = `${FONT_SM}px "PP Neue Bit", monospace`;
    ctx.fillStyle = color;
    const lw = ctx.measureText(label).width + Math.round(W * 0.01);
    ctx.fillText(value, labelX + lw, rowY);
    rowY += LINE;
  }

  // ── Helper: pixel-art bar ───────────────────────────────────────────────
  function drawBar(
    label: string,
    fill: number,
    fillColor: string,
    emptyColor = "#333",
  ) {
    const LABEL_W = Math.round(W * 0.075);
    const bx = labelX + LABEL_W;
    const by = rowY - FONT_SM + Math.round((FONT_SM - BAR_H) / 2) + 2;

    // Label
    ctx.font = `${FONT_XS}px "PP Neue Bit", monospace`;
    ctx.fillStyle = palette.accent;
    ctx.textBaseline = "alphabetic";
    ctx.fillText(label, labelX, rowY);

    // Empty track
    ctx.fillStyle = emptyColor;
    ctx.fillRect(bx, by, BAR_W, BAR_H);

    // Filled portion — pixel art segments (8 blocks)
    const SEGS = 8;
    const SEG_W = Math.floor((BAR_W - SEGS + 1) / SEGS);
    const filled = Math.round(fill * SEGS);
    for (let s = 0; s < SEGS; s++) {
      const sx = bx + s * (SEG_W + 1);
      ctx.fillStyle = s < filled ? fillColor : emptyColor;
      ctx.fillRect(sx, by, SEG_W, BAR_H);
    }

    // Thin border
    ctx.strokeStyle = palette.accent + "66";
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, BAR_W, BAR_H);

    rowY += LINE;
  }

  // (team row uses plain text — no silhouettes)

  // ── Row 1: Timer ───────────────────────────────────────────────────────
  const hStr = String(stats.hoursIn).padStart(2, "0");
  const mStr = String(stats.minsIn).padStart(2, "0");
  drawLabel("TIME", `${hStr}:${mStr}  IN`, palette.burstMid);

  // ── Row 2: Sector ──────────────────────────────────────────────────────
  const sectorDisplay = (stats.sector || "—").toUpperCase().slice(0, 16);
  drawLabel("SECTOR", sectorDisplay);

  // ── Row 3: Team size ───────────────────────────────────────────────────
  const teamLabel = ["SOLO", "DUO", "TRIO"][Math.min(stats.teamSize - 1, 2)];
  drawLabel("TEAM", teamLabel);

  // ── Row 4: Stage progress bar ──────────────────────────────────────────
  drawBar("STAGE", STAGE_PROGRESS[stats.stage], palette.accent, "#1a1a1a");

  // ── Row 5: Sleep bar (health-style — red when low) ─────────────────────
  const fill = SLEEP_FILL[stats.sleep];
  const sleepColor =
    fill > 0.6 ? "#4EF9BD" : fill > 0.3 ? "#ffcc00" : "#EE1701";
  drawBar("SLEEP", fill, sleepColor, "#1a1a1a");

  ctx.restore();
}

// Draws sponsor tool icons as a game HUD row in the bottom-right corner.
// Each icon sits in a pixel-art style slot with a dark panel backing.
async function drawToolsPanel(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  toolIds: string[],
  palette: BgPalette,
): Promise<void> {
  if (toolIds.length === 0) return;
  const options = TOOL_OPTIONS.filter((t) => toolIds.includes(t.id));
  if (options.length === 0) return;

  const SLOT = Math.round(W * 0.1); // icon slot size (square)
  const GAP = Math.round(W * 0.015); // gap between slots
  const PAD = Math.round(W * 0.018); // inner padding inside each slot
  const MARGIN = Math.round(W * 0.03); // edge margin

  const n = options.length;
  const rowW = n * SLOT + (n - 1) * GAP;
  const startX = W - MARGIN - rowW;
  const startY = H - MARGIN - SLOT;

  // Load all logos first
  const logos = await Promise.all(
    options.map(async (opt) => {
      try {
        return await loadImage(`/sponsors/${opt.canvasFile}`);
      } catch {
        return null;
      }
    }),
  );

  // ── Dark backing panel behind all slots ─────────────────────────────────
  const panelPad = Math.round(GAP * 0.8);
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  // Pixel-art sharp corners — no border radius
  ctx.fillRect(
    startX - panelPad,
    startY - panelPad,
    rowW + panelPad * 2,
    SLOT + panelPad * 2,
  );

  // Thin accent border around the panel
  ctx.strokeStyle = palette.accent + "cc";
  ctx.lineWidth = Math.max(2, Math.round(W * 0.003));
  ctx.strokeRect(
    startX - panelPad,
    startY - panelPad,
    rowW + panelPad * 2,
    SLOT + panelPad * 2,
  );
  ctx.restore();

  // ── Each slot ────────────────────────────────────────────────────────────
  for (let i = 0; i < n; i++) {
    const slotX = startX + i * (SLOT + GAP);
    const slotY = startY;
    const img = logos[i];
    const opt = options[i];

    // Slot inner fill (very subtle tint so individual icons are separated)
    ctx.save();
    ctx.fillStyle = palette.dark + "99";
    ctx.fillRect(slotX, slotY, SLOT, SLOT);

    // Slot inner border
    ctx.strokeStyle = palette.accent + "55";
    ctx.lineWidth = Math.max(1, Math.round(W * 0.002));
    ctx.strokeRect(slotX, slotY, SLOT, SLOT);
    ctx.restore();

    if (!img) continue;

    // Draw logo centred + fitted inside slot with padding
    const maxW = SLOT - PAD * 2;
    const maxH = SLOT - PAD * 2;
    const aspect = img.naturalWidth / img.naturalHeight;
    let drawW = maxW;
    let drawH = Math.round(drawW / aspect);
    if (drawH > maxH) {
      drawH = maxH;
      drawW = Math.round(drawH * aspect);
    }
    const drawX = slotX + Math.round((SLOT - drawW) / 2);
    const drawY = slotY + Math.round((SLOT - drawH) / 2);

    // Process logo: strip bg, make visible on dark bg
    const off = document.createElement("canvas");
    off.width = img.naturalWidth;
    off.height = img.naturalHeight;
    const oc = off.getContext("2d")!;
    oc.drawImage(img, 0, 0);
    removeBackground(
      oc,
      img.naturalWidth,
      img.naturalHeight,
      opt.mode,
      opt.invert ?? false,
    );

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.shadowColor = palette.burstGlow;
    ctx.shadowBlur = Math.round(SLOT * 0.25);
    ctx.drawImage(off, drawX, drawY, drawW, drawH);
    ctx.restore();
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

// ── Component ───────────────────────────────────────────────────────────────

export default function SpriteGenPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);

  // ── Hackathon stats ──────────────────────────────────────────────────────
  const [sector, setSector] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [stage, setStage] = useState<Stage>("Building");
  const [sleep, setSleep] = useState<Sleep>("Low");
  const [elapsed, setElapsed] = useState(getElapsed);

  // Live-update the timer every minute
  useEffect(() => {
    const id = setInterval(() => setElapsed(getElapsed()), 60_000);
    return () => clearInterval(id);
  }, []);

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

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : prev.length >= 3
          ? prev // already at max — ignore
          : [...prev, id],
    );
  };

  const handleGenerate = async () => {
    if (!uploadedFile || selectedTools.length === 0) return;
    setLoading(true);
    setResultUrl(null);
    setDownloadUrl(null);
    setStatus("Generating your sprite… (~30s)");

    try {
      const snap = getElapsed(); // snapshot at generation time
      const formData = new FormData();
      formData.append("image", uploadedFile);
      formData.append("tools", JSON.stringify(selectedTools));
      formData.append("hoursIn", String(snap.h));
      formData.append("photoMode", "solo");

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
      // Pick a random brand palette each generation
      const palette =
        BG_PALETTES[Math.floor(Math.random() * BG_PALETTES.length)];
      const finalUrl = await compositeAsset(imageUrl, selectedTools, palette, {
        sector,
        teamSize,
        stage,
        sleep,
        hoursIn: snap.h,
        minsIn: snap.m,
      });
      URL.revokeObjectURL(imageUrl);
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

  const postVariants = getPostVariants(selectedTools, TOOL_OPTIONS);
  const activePost = postVariants[selectedVariant] ?? postVariants[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activePost);
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
            Generate your cyberpunk sprite in 4 quick steps.
          </p>
          {/* Horn bar */}
          <div className="mt-4 h-[3px] w-full flex">
            <div className="flex-1 bg-[#B307EB]" />
            <div className="flex-1 bg-[#3198F1]" />
            <div className="flex-1 bg-[#4EF9BD]" />
            <div className="flex-1 bg-[#EE1701]" />
          </div>
        </div>

        {/* Step 1 — Upload */}
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

        {/* Step 2 — Tool selection */}
        <div className="mb-4 border border-[#2a2820] border-l-[3px] border-l-[#EE1701] p-5">
          <p className="font-body text-xs text-[#888880] mb-1">02</p>
          <h2 className="font-title text-sm text-white uppercase tracking-wider mb-1">
            Choose your tools
          </h2>
          <p className="font-body text-xs text-[#888880] mb-4">
            What are you building with? Select 1–3 sponsors.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {TOOL_OPTIONS.map(({ id, label, iconFile, uiInvert }) => {
              const isSelected = selectedTools.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleTool(id)}
                  className={`flex flex-col items-center gap-2 p-3 border transition-all ${
                    isSelected
                      ? "border-[#B307EB] bg-[#B307EB]/10"
                      : "border-[#2a2820] hover:border-[#B307EB]/50"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/sponsors/${iconFile}`}
                    alt={label}
                    className="h-8 w-auto object-contain"
                    style={uiInvert ? { filter: "invert(1)" } : undefined}
                  />
                  <span className="font-body text-xs text-[#888880] text-center leading-tight">
                    {label}
                  </span>
                  {isSelected && (
                    <span className="font-body text-[10px] text-[#B307EB] uppercase tracking-wider">
                      ✓ selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedTools.length > 0 && (
            <p className="font-body text-xs text-[#B307EB] mt-3">
              {selectedTools.length} tool{selectedTools.length > 1 ? "s" : ""}{" "}
              selected →{" "}
              {selectedTools.length >= 3
                ? "spinning roundhouse kick"
                : selectedTools.length === 2
                  ? "double-fist slam"
                  : "devastating uppercut"}
            </p>
          )}
        </div>

        {/* Step 3 — Hackathon stats */}
        <div className="mb-4 border border-[#2a2820] border-l-[3px] border-l-[#4EF9BD] p-5">
          <p className="font-body text-xs text-[#888880] mb-1">03</p>
          <h2 className="font-title text-sm text-white uppercase tracking-wider mb-1">
            Your stats
          </h2>
          <p className="font-body text-xs text-[#888880] mb-5">
            Shows on your sprite as a game HUD.
          </p>

          {/* Live timer */}
          <div className="mb-5">
            <p className="font-body text-xs text-[#888880] mb-1 uppercase tracking-wider">
              Time in
            </p>
            <p className="font-title text-2xl text-[#4EF9BD]">
              {String(elapsed.h).padStart(2, "0")}:
              {String(elapsed.m).padStart(2, "0")}
            </p>
            <p className="font-body text-[10px] text-[#555550]">
              Since 11:00 AM · updates live
            </p>
          </div>

          {/* Sector */}
          <div className="mb-5">
            <label className="font-body text-xs text-[#888880] uppercase tracking-wider block mb-2">
              Sector
            </label>
            <input
              type="text"
              placeholder="e.g. AI, Fintech, HealthTech…"
              maxLength={20}
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full font-body text-sm text-white bg-black border border-[#2a2820] px-3 py-2 focus:outline-none focus:border-[#4EF9BD] placeholder-[#444440]"
            />
          </div>

          {/* Team size */}
          <div className="mb-5">
            <label className="font-body text-xs text-[#888880] uppercase tracking-wider block mb-2">
              Team size
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setTeamSize(n)}
                  className={`font-title text-xs uppercase tracking-wider px-4 py-2 border transition-all ${
                    teamSize === n
                      ? "border-[#4EF9BD] bg-[#4EF9BD]/10 text-[#4EF9BD]"
                      : "border-[#2a2820] text-[#888880] hover:border-[#4EF9BD]/50"
                  }`}
                >
                  {n === 1 ? "Solo" : n === 2 ? "Duo" : "Trio"}
                </button>
              ))}
            </div>
          </div>

          {/* Stage */}
          <div className="mb-5">
            <label className="font-body text-xs text-[#888880] uppercase tracking-wider block mb-2">
              Stage
            </label>
            <div className="flex gap-2 flex-wrap">
              {(["Ideating", "Building", "Shipping", "Shipped"] as Stage[]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setStage(s)}
                    className={`font-title text-xs uppercase tracking-wider px-3 py-2 border transition-all ${
                      stage === s
                        ? "border-[#4EF9BD] bg-[#4EF9BD]/10 text-[#4EF9BD]"
                        : "border-[#2a2820] text-[#888880] hover:border-[#4EF9BD]/50"
                    }`}
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
            {/* Mini progress preview */}
            <div className="mt-2 h-1.5 w-full bg-[#1a1a18] flex">
              <div
                className="bg-[#4EF9BD] transition-all duration-300"
                style={{ width: `${STAGE_PROGRESS[stage] * 100}%` }}
              />
            </div>
          </div>

          {/* Sleep */}
          <div className="mb-1">
            <label className="font-body text-xs text-[#888880] uppercase tracking-wider block mb-2">
              Sleep level
            </label>
            <div className="flex gap-2">
              {(["Full", "Low", "Fumes"] as Sleep[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSleep(s)}
                  className={`font-title text-xs uppercase tracking-wider px-3 py-2 border transition-all ${
                    sleep === s
                      ? s === "Fumes"
                        ? "border-[#EE1701] bg-[#EE1701]/10 text-[#EE1701]"
                        : s === "Low"
                          ? "border-[#ffcc00] bg-[#ffcc00]/10 text-[#ffcc00]"
                          : "border-[#4EF9BD] bg-[#4EF9BD]/10 text-[#4EF9BD]"
                      : "border-[#2a2820] text-[#888880] hover:border-[#4EF9BD]/50"
                  }`}
                >
                  {s === "Fumes" ? "Running on fumes" : s}
                </button>
              ))}
            </div>
            {/* Mini health bar preview */}
            <div className="mt-2 h-1.5 w-full bg-[#1a1a18] flex">
              <div
                className="transition-all duration-300"
                style={{
                  width: `${SLEEP_FILL[sleep] * 100}%`,
                  backgroundColor:
                    SLEEP_FILL[sleep] > 0.6
                      ? "#4EF9BD"
                      : SLEEP_FILL[sleep] > 0.3
                        ? "#ffcc00"
                        : "#EE1701",
                }}
              />
            </div>
          </div>
        </div>

        {/* Step 4 — Generate */}
        <div className="mb-4 border border-[#2a2820] border-l-[3px] border-l-[#3198F1] p-5">
          <p className="font-body text-xs text-[#888880] mb-1">04</p>
          <h2 className="font-title text-sm text-white uppercase tracking-wider mb-4">
            Generate sprite
          </h2>

          <button
            onClick={handleGenerate}
            disabled={!uploadedFile || selectedTools.length === 0 || loading}
            className="font-title text-sm uppercase tracking-wider px-6 py-3 bg-[#3198F1] text-black transition-colors disabled:opacity-30"
          >
            {loading ? "Generating…" : "Generate Asset"}
          </button>

          {!uploadedFile && (
            <p className="font-body text-xs text-[#888880] mt-2">
              Upload a photo first.
            </p>
          )}
          {uploadedFile && selectedTools.length === 0 && (
            <p className="font-body text-xs text-[#888880] mt-2">
              Select at least one tool above.
            </p>
          )}

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

        {/* Step 5 — Copy post */}
        <div className="border border-[#2a2820] border-l-[3px] border-l-[#B307EB] p-5">
          <p className="font-body text-xs text-[#888880] mb-1">05</p>
          <h2 className="font-title text-sm text-white uppercase tracking-wider mb-2">
            Copy your post text
          </h2>
          <p className="font-body text-xs text-[#888880] mb-4">
            Pick a vibe, then copy.
          </p>

          {/* Variant selector */}
          <div className="flex gap-2 mb-4">
            {["Hype", "Punchy", "Minimal"].map((label, i) => (
              <button
                key={i}
                onClick={() => setSelectedVariant(i)}
                className={`font-title text-xs uppercase tracking-wider px-3 py-1 border transition-all ${
                  selectedVariant === i
                    ? "border-[#4EF9BD] bg-[#4EF9BD]/10 text-[#4EF9BD]"
                    : "border-[#2a2820] text-[#888880] hover:border-[#4EF9BD]/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <textarea
            readOnly
            rows={10}
            value={activePost}
            className="w-full font-body text-sm text-[#e0e0e0] bg-black p-3 border border-[#2a2820] resize-none focus:outline-none focus:border-[#4EF9BD] mb-3"
          />

          <div className="flex flex-wrap gap-2">
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

            {/* Share to X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(activePost)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-title text-sm uppercase tracking-wider px-5 py-2 border border-[#888880] text-[#888880] hover:border-white hover:text-white transition-colors flex items-center gap-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>

            {/* Share to LinkedIn */}
            <a
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => navigator.clipboard.writeText(activePost)}
              className="font-title text-sm uppercase tracking-wider px-5 py-2 border border-[#888880] text-[#888880] hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors flex items-center gap-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Share on LinkedIn
            </a>
          </div>
          <p className="font-body text-[10px] text-[#444440] mt-2">
            LinkedIn: text copied to clipboard — paste it into your post.
            Download your sprite to attach it.
          </p>
        </div>
      </div>
    </div>
  );
}
