// Contact form: emails the message to CONTACT_TO_EMAIL through Resend (https://resend.com).
// Needs RESEND_API_KEY and CONTACT_TO_EMAIL in .env.local. Plain-text mail only, so nothing is injected as HTML.
// shortcut: sends from Resend's shared onboarding@resend.dev (delivers only to the Resend account's own email);
// verify a domain in Resend and set CONTACT_FROM_EMAIL to send from it.
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 }; // per visitor IP
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.delete(hits.keys().next().value as string);
  return recent.length > RATE_LIMIT.max;
}

const json = (status: number, error?: string) =>
  new Response(JSON.stringify(error ? { error } : { ok: true }), { status, headers: { "content-type": "application/json" } });

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return json(429, "rate_limited");

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const name = str(body?.name, 100);
  const email = str(body?.email, 200);
  const message = str(body?.message, 3000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, "bad_request");

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return json(503, "not_configured");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio contact <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Message from ${name.replace(/[\r\n]+/g, " ")}`,
      text: `${message}\n\n${name} (${email})`,
    }),
  }).catch(() => null);
  if (!res?.ok) return json(502, "send_failed");
  return json(200);
}
