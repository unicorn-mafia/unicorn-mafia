import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import sharp from "sharp";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const SPRITE_PROMPT = `Convert this reference image into a 2D pixel art cyberpunk fighting game character sprite. Make them a little tiny playable fighter character — bold outlines, vibrant limited color palette, and sharp pixel details. Keep the backdrop black.
Pose: Keep the same ready fighting stance with fists up. Add subtle cyberpunk fighting game flair: faint neon glow on the red visor, very light electric sparks or holographic glitch effects around the fists and coat edges, and a dark cyberpunk atmosphere.
Maintain the outfit from the reference, and stylize it as a high-quality pixel art fighting game idle sprite. Clean lines, retro video game feel, ready for a cyberpunk fighting game roster.`;

const POST_TEXT = `I've got an early invite to the 'To The Americas' Hackathon by the Unicorn Mafia.
excited to team up with some of Europe's top builders.
lets get cooking!!

sponsors:
Pydantic - https://lnkd.in/eV58E4PH  Render - https://lnkd.in/eJBbc7sw
cognition.ai
mubit.ai The Residency
Expedite`;

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Resize + normalise to JPEG before sending
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
    const imgPart = parts.find((p: { inlineData?: unknown }) => p.inlineData) ?? null;

    if (!imgPart) {
      const reason = result.response?.candidates?.[0]?.finishReason ?? "unknown";
      return NextResponse.json(
        { error: `Gemini returned no image (reason: ${reason})` },
        { status: 500 }
      );
    }

    const rawBuffer = Buffer.from((imgPart as { inlineData: { data: string; mimeType: string } }).inlineData.data, "base64");

    // Shrink sprite and center on black canvas
    const CANVAS = 1024;
    const spriteHeight = Math.round(CANVAS * 0.38);
    const resized = await sharp(rawBuffer)
      .resize({ height: spriteHeight, withoutEnlargement: false })
      .toBuffer();

    const meta = await sharp(resized).metadata();
    const left = Math.round((CANVAS - (meta.width ?? 0)) / 2);
    const top = Math.round((CANVAS - (meta.height ?? 0)) / 2);

    const finalBuffer = await sharp({
      create: { width: CANVAS, height: CANVAS, channels: 3, background: { r: 0, g: 0, b: 0 } },
    })
      .composite([{ input: resized, left, top }])
      .png()
      .toBuffer();

    // Save to public/sprites/
    const spritesDir = path.join(process.cwd(), "public", "sprites");
    if (!fs.existsSync(spritesDir)) fs.mkdirSync(spritesDir, { recursive: true });

    const filename = `sprite-${crypto.randomBytes(8).toString("hex")}.png`;
    fs.writeFileSync(path.join(spritesDir, filename), finalBuffer);

    return NextResponse.json({
      success: true,
      imageUrl: `/sprites/${filename}`,
      postText: POST_TEXT,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
