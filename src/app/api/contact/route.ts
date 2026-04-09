import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, company, email, whatsapp, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // --- Google Chat ---
  const lines = [
    "*New Contact Form Submission*",
    "",
    `*Name:* ${name}`,
    ...(company ? [`*Company:* ${company}`] : []),
    `*Email:* ${email}`,
    ...(whatsapp ? [`*WhatsApp:* ${whatsapp}`] : []),
    "",
    "*Message:*",
    message,
  ];

  const webhook = process.env.GOOGLE_CHAT_WEBHOOK;
  if (!webhook) {
    console.error("GOOGLE_CHAT_WEBHOOK env var is not set");
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }

  const chatRes = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: lines.join("\n") }),
  });

  if (!chatRes.ok) {
    console.error("Google Chat webhook failed:", await chatRes.text());
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }

  // --- PostHog server-side tracking ---
  const posthog = getPostHogClient();
  if (posthog) {
    posthog.capture({
      distinctId: email,
      event: "contact_form_submission_received",
      properties: {
        name,
        email,
        has_company: !!company,
        has_whatsapp: !!whatsapp,
      },
    });
    await posthog.shutdown();
  }

  return NextResponse.json({ success: true });
}
