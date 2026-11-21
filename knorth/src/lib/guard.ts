// Small abuse guards shared by the API routes (contact form, chat). They keep one visitor, or one bot,
// from using up the free email and AI quotas.
// shortcut: the counters live in this server instance's memory, so a restart (or a second serverless
// instance) resets them. Move them to a shared store such as Upstash Redis or Vercel KV once traffic grows.

// The visitor's IP as the host reports it. x-real-ip is set by the host, so a visitor can't pick it.
export const clientIp = (req: Request) =>
  req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

// Only our own pages may call the API: browsers always send Origin on a cross-site or POST fetch, a bare
// script usually doesn't. This stops other sites and casual scripts, not a determined attacker.
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Reads a JSON body with a hard size cap, so a huge payload is refused instead of parsed.
export async function readJson(req: Request, maxChars: number): Promise<unknown> {
  const text = await req.text().catch(() => "");
  if (!text || text.length > maxChars) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Counts events per key inside a sliding window. hit() records one and says whether the key is over `max`.
export function limiter(windowMs: number, max: number) {
  const hits = new Map<string, number[]>();
  return (key: string): boolean => {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.delete(hits.keys().next().value as string); // keep memory bounded
    return recent.length > max;
  };
}

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
