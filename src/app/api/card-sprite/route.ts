import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, GEMINI_IMAGE_MODEL } from "@/lib/gemini";
import { isRateLimited, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit before touching the body
  if (isRateLimited(getIp(req))) {
    return NextResponse.json(
      { error: "Too many requests — please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: { parts?: unknown[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { parts } = body;
  if (!parts || !Array.isArray(parts) || parts.length === 0) {
    return NextResponse.json({ error: "Missing parts array" }, { status: 400 });
  }

  try {
    const ai = getGeminiClient();
    const model = ai.getGenerativeModel({
      model: GEMINI_IMAGE_MODEL,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] } as any,
    });

    const result = await model.generateContent(parts as never[]);
    const candidates = result.response?.candidates ?? [];
    const imgPart = candidates[0]?.content?.parts?.find(
      (p: { inlineData?: unknown }) => p.inlineData,
    );

    if (!imgPart) {
      const reason = candidates[0]?.finishReason ?? "unknown";
      return NextResponse.json(
        {
          error: `No image returned (reason: ${reason}). Try a different photo.`,
        },
        { status: 500 },
      );
    }

    // Mirror the Gemini response shape the client already expects
    return NextResponse.json(result.response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
