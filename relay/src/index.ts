interface Env {
  DESTINATION_WEBHOOK: string;
  LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

const FIELD_LIMITS = {
  name: 200,
  company: 200,
  email: 320,
  whatsapp: 40,
  message: 5000,
} as const;

type Field = keyof typeof FIELD_LIMITS;
type Submission = Partial<Record<Field, string>>;

function parse(body: unknown): Submission | null {
  if (!body || typeof body !== "object") return null;
  const out: Submission = {};
  for (const field of Object.keys(FIELD_LIMITS) as Field[]) {
    const value = (body as Record<string, unknown>)[field];
    if (value === undefined || value === "") continue;
    if (typeof value !== "string" || value.length > FIELD_LIMITS[field]) {
      return null;
    }
    out[field] = value.trim();
  }
  if (!out.name || !out.message || !out.email?.includes("@")) return null;
  return out;
}

// Slack and Google Chat incoming webhooks both accept { text }.
function format(s: Submission): string {
  return [
    "*New Contact Form Submission*",
    "",
    `*Name:* ${s.name}`,
    ...(s.company ? [`*Company:* ${s.company}`] : []),
    `*Email:* ${s.email}`,
    ...(s.whatsapp ? [`*WhatsApp:* ${s.whatsapp}`] : []),
    "",
    "*Message:*",
    s.message,
  ].join("\n");
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { success } = await env.LIMITER.limit({ key: "global" });
    if (!success) return new Response("Too many requests", { status: 429 });

    const submission = parse(await req.json().catch(() => null));
    if (!submission) return new Response("Invalid submission", { status: 400 });

    const res = await fetch(env.DESTINATION_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: format(submission) }),
    });
    if (!res.ok) {
      console.error("Destination webhook failed", res.status, await res.text());
      return new Response("Upstream failed", { status: 502 });
    }
    return new Response("ok");
  },
};
