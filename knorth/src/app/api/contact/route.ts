// Contact form: emails the message to CONTACT_TO_EMAIL through Resend (https://resend.com).
// Needs RESEND_API_KEY and CONTACT_TO_EMAIL in .env.local. Plain-text mail only, so nothing is injected as HTML.
// shortcut: sends from Resend's shared onboarding@resend.dev (delivers only to the Resend account's own email);
// verify a domain in Resend and set CONTACT_FROM_EMAIL to send from it.
import { DAY, HOUR, MINUTE, clientIp, limiter, readJson, sameOrigin } from "@/lib/guard";

// Resend's free plan allows about 100 emails a day, so these caps stop one sender from using it up.
const burst = limiter(10 * MINUTE, 5); // per IP, every request (also junk)
const ipHour = limiter(HOUR, 3); // per IP, real sends
const ipDay = limiter(DAY, 5);
const emailDay = limiter(DAY, 2); // per sender address, so one person can't rotate names on one email
const everyone = limiter(DAY, 30); // whole site: leaves room under the 100 a day
const sent = new Set<string>(); // messages already delivered today, to ignore copy-paste spam
setInterval(() => sent.clear(), DAY).unref?.();

// Gmail ignores dots and +tags, so a.b+1@gmail.com and ab+2@gmail.com are the same inbox
function canonical(email: string) {
  const [local, domain] = email.toLowerCase().split("@");
  if (domain === "gmail.com" || domain === "googlemail.com") return `${local.split("+")[0].replace(/\./g, "")}@gmail.com`;
  return `${local}@${domain}`;
}

const json = (status: number, error?: string) =>
  new Response(JSON.stringify(error ? { error } : { ok: true }), { status, headers: { "content-type": "application/json" } });

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json(403, "forbidden");
  const ip = clientIp(req);
  if (burst(ip)) return json(429, "rate_limited");

  const body = (await readJson(req, 10_000)) as Record<string, unknown> | null;
  // Bots fill the hidden "website" field or post within a second of the page loading: pretend it worked
  const elapsed = typeof body?.elapsed === "number" ? body.elapsed : 0;
  if (str(body?.website, 10) || elapsed < 2500) return json(200);
  const name = str(body?.name, 100);
  const email = str(body?.email, 200);
  const message = str(body?.message, 3000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, "bad_request");

  if ((message.match(/https?:\/\//gi) ?? []).length > 2) return json(400, "bad_request"); // link spam

  // Limits apply only to messages that would really be sent
  const fingerprint = `${canonical(email)}|${message.toLowerCase().replace(/\s+/g, " ")}`;
  if (sent.has(fingerprint)) return json(200); // same message again: ignore quietly
  if (ipHour(ip) || ipDay(ip) || emailDay(canonical(email))) return json(429, "rate_limited");
  if (everyone("all")) return json(503, "busy");

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
  sent.add(fingerprint);
  return json(200);
}
