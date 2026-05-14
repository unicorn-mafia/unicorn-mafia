import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500 },
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

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json(
      {
        error:
          (err as { error?: { message?: string } })?.error?.message ??
          `Gemini error ${res.status}`,
      },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
