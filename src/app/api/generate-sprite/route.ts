import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import sharp from "sharp";

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB hard cap
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

// ── Rate limiter ─────────────────────────────────────────────────────────────
// Simple in-memory token bucket: 5 requests per IP per 60 s.
// Works well for a single Vercel instance; swap for Upstash Ratelimit if you
// need cross-instance enforcement at scale.

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

interface Bucket {
  count: number;
  windowStart: number;
}
const buckets = new Map<string, Bucket>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { count: 0, windowStart: now };

  if (now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    bucket.count = 0;
    bucket.windowStart = now;
  }

  bucket.count += 1;
  buckets.set(ip, bucket);

  // Prune old entries to avoid memory growth on long-running instances
  if (buckets.size > 5_000) {
    for (const [key, val] of buckets) {
      if (now - val.windowStart > RATE_LIMIT_WINDOW_MS) buckets.delete(key);
    }
  }

  return bucket.count > RATE_LIMIT_MAX;
}

// ── Gemini ───────────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const POSES = [
  "a devastating uppercut — dominant fist driving upward with full body extension, chin raised, weight on back foot",
  "a flying side kick — one leg fully extended outward, other leg tucked, body airborne and horizontal",
  "a spinning roundhouse kick — kicking leg sweeping wide at head height, body rotating mid-air",
  "a lunging straight punch — lead fist fully extended forward, body low and committed to the strike",
  "a leaping double-fist slam — both fists thrust downward together, body dropping with full force",
  "a rising dragon punch — leaping upward with fist driving skyward, fully airborne and twisting",
];

const OUTFITS = [
  "neon-trimmed black leather jacket, ripped techwear cargo pants, chunky platform boots with neon piping, fingerless gloves — purple and cyan neon accents",
  "sleeveless armoured vest with glowing circuit lines, high-waist tactical trousers, knee-high boots, arm wraps with neon strips — red and gold neon accents",
  "hooded longcoat with neon trim, slim combat trousers, ankle boots, visor goggles pushed up on forehead — green and white neon accents",
  "cropped tech jacket, techwear shorts over leggings, heavy boots, exposed glowing cybernetic arm detail — blue and magenta neon accents",
  "trench coat with neon-lit panels, tactical belt, wide-leg combat trousers, steel-toe boots — orange and purple neon accents",
];

function buildSpritePrompt(): string {
  const poseDesc = POSES[Math.floor(Math.random() * POSES.length)];
  const outfitDesc = OUTFITS[Math.floor(Math.random() * OUTFITS.length)];

  return `Using the person in this photo as the character reference, create a 2D pixel art cyberpunk fighting game sprite in the style of Street Fighter II. Pure black backdrop.

Outfit: ${outfitDesc}. Cyberpunk street fighter aesthetic — NOT a karate gi or martial arts uniform.

Pose: Mid-attack — ${poseDesc}. Full body visible from head to toe, attacking limb fully extended. Exaggerated fighting game proportions, motion energy on the attacking limb.

Bold black outlines, vibrant neon pixel art, clean retro Street Fighter sprite style.`;
}

// ── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not set" },
      { status: 500 },
    );
  }

  // 1. Rate limit — checked before touching the body
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a minute and try again." },
      { status: 429 },
    );
  }

  // 2. Content-Length guard — reject oversized payloads before buffering
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BYTES) {
    return NextResponse.json(
      {
        error: `File too large. Maximum upload size is ${MAX_BYTES / 1024 / 1024} MB.`,
      },
      { status: 413 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const SPRITE_PROMPT = buildSpritePrompt();

    if (!file) {
      return NextResponse.json(
        { error: "No image uploaded." },
        { status: 400 },
      );
    }

    // 3. MIME type allowlist
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PNG, JPEG, or WEBP." },
        { status: 400 },
      );
    }

    // 4. Actual byte cap — guards against Content-Length spoofing
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error: `File too large. Maximum upload size is ${MAX_BYTES / 1024 / 1024} MB.`,
        },
        { status: 413 },
      );
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    // 5. Resize + normalise to JPEG before sending to Gemini
    const processedBuffer = await sharp(inputBuffer)
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    const base64Image = processedBuffer.toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] } as any,
    });

    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
      SPRITE_PROMPT,
    ]);

    const parts = result.response?.candidates?.[0]?.content?.parts ?? [];
    const imgPart =
      parts.find((p: { inlineData?: unknown }) => p.inlineData) ?? null;

    if (!imgPart) {
      const reason =
        result.response?.candidates?.[0]?.finishReason ?? "unknown";
      return NextResponse.json(
        {
          error: `Gemini returned no image (reason: ${reason}). Try a different photo.`,
        },
        { status: 500 },
      );
    }

    const rawBuffer = Buffer.from(
      (imgPart as { inlineData: { data: string; mimeType: string } }).inlineData
        .data,
      "base64",
    );

    // 6. Resize sprite and center on black canvas
    const CANVAS = 1024;
    const spriteHeight = Math.round(CANVAS * 0.58); // bigger fighter
    const resized = await sharp(rawBuffer)
      .resize({ height: spriteHeight, withoutEnlargement: false })
      .toBuffer();

    const meta = await sharp(resized).metadata();
    const left = Math.round((CANVAS - (meta.width ?? 0)) / 2);
    const top = Math.round((CANVAS - (meta.height ?? 0)) / 2);

    const finalBuffer = await sharp({
      create: {
        width: CANVAS,
        height: CANVAS,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .composite([{ input: resized, left, top }])
      .png()
      .toBuffer();

    // 7. Stream the PNG directly — no filesystem writes needed (Vercel is read-only)
    return new NextResponse(new Uint8Array(finalBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(finalBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
