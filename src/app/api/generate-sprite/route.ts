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

// Neon accent colour sets — one is picked randomly to give each sprite variety
const NEON_ACCENTS = [
  "purple and cyan neon accents",
  "red and gold neon accents",
  "green and white neon accents",
  "blue and magenta neon accents",
  "orange and purple neon accents",
];

// ── Evolution tiers — power level scales with hours into the hackathon ────────

interface PowerTier {
  label: string;
  powerDesc: string;
  styleExtra: string;
}

const POWER_TIERS: PowerTier[] = [
  {
    // 0–7 h — Stage 1: Street Fighter
    label: "Street Fighter",
    powerDesc:
      "sharp, confident, and fresh — a skilled street fighter at peak focus, clean and dangerous",
    styleExtra:
      "Bold black outlines, vibrant neon pixel art, clean retro Street Fighter II sprite style.",
  },
  {
    // 8–15 h — Stage 2: Power Surge
    label: "Power Surge",
    powerDesc:
      "mid-transformation — crackling electric energy bursting from their fists and eyes, glowing veins visible through skin, hair beginning to rise with static charge, power awakening inside them",
    styleExtra:
      "Bold black outlines, vibrant neon pixel art with electric sparks and glowing energy lines across the body. Street Fighter II sprite style.",
  },
  {
    // 16–22 h — Stage 3: Super Form
    label: "Super Form",
    powerDesc:
      "super-powered — a blazing aura of pure energy surrounds them, floating slightly off the ground, outfit partially disintegrating into streaks of neon light, eyes glowing solid white, overwhelming power barely contained",
    styleExtra:
      "Bold black outlines, vibrant neon pixel art. Large visible aura halo around the body, glowing energy trails. Exaggerated superhero proportions. Street Fighter II sprite style pushed to the limit.",
  },
  {
    // 23 h+ — Stage 4: God Mode
    label: "God Mode",
    powerDesc:
      "peak god-tier street fighter — still fully human in their cyberpunk outfit, but radiating an enormous blinding white and gold aura that dwarfs their body, hair wild and floating upward with raw energy, eyes glowing solid white, crackling electricity dancing across every surface of their clothing, one step beyond super form but still grounded as a street fighter",
    styleExtra:
      "Bold black outlines, vibrant neon pixel art. Same cyberpunk clothing as the other stages — intact, recognisable outfit. Massive bright aura surrounding the whole body. Electricity sparking off the clothes. Glowing white eyes. NO wings, NO body transformation, NO angelic forms. Pure Street Fighter II style at its absolute peak power.",
  },
];

function getPowerTier(hoursIn: number): PowerTier {
  if (hoursIn >= 23) return POWER_TIERS[3];
  if (hoursIn >= 16) return POWER_TIERS[2];
  if (hoursIn >= 8)  return POWER_TIERS[1];
  return POWER_TIERS[0];
}

function buildSpritePrompt(hoursIn: number, photoMode: "solo" | "team"): string {
  const poseDesc   = POSES[Math.floor(Math.random() * POSES.length)];
  const accentDesc = NEON_ACCENTS[Math.floor(Math.random() * NEON_ACCENTS.length)];
  const tier       = getPowerTier(hoursIn);

  if (photoMode === "team") {
    return `Using every person visible in this group photo as character references, create a 2D pixel art cyberpunk fighting game scene in the style of Street Fighter II. Pure black backdrop.

Render each person as their own distinct fighter standing side by side in a team battle formation — all facing the same direction, each in a dynamic fighting stance. Keep each fighter's facial likeness and hair faithful to the person in the photo.

Evolution stage: ${tier.label} (${hoursIn}h into a 26-hour hackathon). Each character is ${tier.powerDesc}.

Outfits: Preserve what each person is actually wearing in the photo, but reimagine it with cyberpunk street fighter flair — add ${accentDesc}, neon trim, tech panelling, armour plating, or glowing details while keeping the overall silhouette and style faithful to their real outfit. NOT karate gis or martial arts uniforms.

Full team visible from head to toe. Exaggerated fighting game proportions on every fighter.

${tier.styleExtra}`;
  }

  return `Using the person in this photo as the character reference, create a 2D pixel art cyberpunk fighting game sprite in the style of Street Fighter II. Pure black backdrop.

Evolution stage: ${tier.label} (${hoursIn}h into a 26-hour hackathon). The character is ${tier.powerDesc}.

Outfit: Preserve what the person is actually wearing in the photo, but reimagine it with cyberpunk street fighter flair — add ${accentDesc}, neon trim, tech panelling, armour plating, or glowing details while keeping the overall silhouette and style faithful to their real outfit. NOT a karate gi or martial arts uniform.

Pose: Mid-attack — ${poseDesc}. Full body visible from head to toe, attacking limb fully extended. Exaggerated fighting game proportions, motion energy on the attacking limb.

${tier.styleExtra}`;
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
    const hoursIn = Math.max(0, Number(formData.get("hoursIn") ?? 0));
    const photoMode = formData.get("photoMode") === "team" ? "team" : "solo";
    const SPRITE_PROMPT = buildSpritePrompt(hoursIn, photoMode);

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
    // Solo: fill ~58% of canvas height. Team: fit inside 95% of canvas so
    // all fighters are visible regardless of how wide the scene is.
    const resized = await sharp(rawBuffer)
      .resize(
        photoMode === "team"
          ? { width: Math.round(CANVAS * 0.95), height: Math.round(CANVAS * 0.75), fit: "inside", withoutEnlargement: false }
          : { height: Math.round(CANVAS * 0.58), withoutEnlargement: false },
      )
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
