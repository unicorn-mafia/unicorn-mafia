import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

// Hardcoded because the Vercel project's env vars are out of reach. The relay
// (relay/) holds the real destination, so this URL is safe to be public.
// CONTACT_RELAY_URL overrides it once someone can set env vars again.
const CONTACT_RELAY_URL = "https://um-contact-relay.REPLACE_ME.workers.dev";

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

  const relay = process.env.CONTACT_RELAY_URL ?? CONTACT_RELAY_URL;
  const relayRes = await fetch(relay, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, company, email, whatsapp, message }),
  }).catch((err) => {
    console.error("Contact relay unreachable:", err);
    return null;
  });

  if (!relayRes?.ok) {
    console.error("Contact relay failed:", await relayRes?.text());
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }

  // --- PostHog server-side tracking ---
  const posthog = getPostHogClient();
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

  return NextResponse.json({ success: true });
}
