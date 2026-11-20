import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

// Hardcoded because the Vercel project's env vars are out of reach. The relay
// (relay/) holds the real destination, so this URL is safe to be public.
// CONTACT_RELAY_URL overrides it once someone can set env vars again.
const CONTACT_RELAY_URL = "https://um-contact-relay.cheddarjobs.workers.dev";

const FIELD_LIMITS = {
  name: { label: "Name", max: 200 },
  company: { label: "Company", max: 200 },
  email: { label: "Email", max: 320 },
  whatsapp: { label: "WhatsApp", max: 40 },
  message: { label: "Message", max: 5000 },
} as const;

function validateFields(
  fields: Record<keyof typeof FIELD_LIMITS, unknown>,
): string | null {
  for (const [key, { label, max }] of Object.entries(FIELD_LIMITS)) {
    const value = fields[key as keyof typeof FIELD_LIMITS];
    if (value === undefined || value === "") continue;
    if (typeof value !== "string") return `${label} must be text`;
    if (value.length > max) {
      return `${label} must be ${max} characters or fewer`;
    }
  }
  if (typeof fields.email !== "string" || !fields.email.includes("@")) {
    return "Please enter a valid email address";
  }
  return null;
}

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

  // Mirrors the relay's checks so the user learns which field to fix.
  const fieldError = validateFields({
    name,
    company,
    email,
    whatsapp,
    message,
  });
  if (fieldError) {
    return NextResponse.json({ error: fieldError }, { status: 400 });
  }

  const relay = process.env.CONTACT_RELAY_URL?.trim() || CONTACT_RELAY_URL;
  const relayRes = await fetch(relay, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, company, email, whatsapp, message }),
  }).catch((err) => {
    console.error("Contact relay unreachable:", err);
    return null;
  });

  if (relayRes?.status === 400) {
    return NextResponse.json(
      { error: "Please check your details and try again" },
      { status: 400 },
    );
  }
  if (relayRes?.status === 429) {
    return NextResponse.json(
      { error: "Too many messages right now. Please try again in a minute" },
      { status: 429 },
    );
  }

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
