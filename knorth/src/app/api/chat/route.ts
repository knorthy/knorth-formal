// Kniah chat: streams short answers about Tiffany from Google Gemini, grounded in the site's own data.
// Needs GEMINI_API_KEY in .env.local (free from https://aistudio.google.com/apikey).
// Optional GEMINI_MODEL picks the first model to try; otherwise fast free-tier models are tried in order.
import { ApiError, GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { buildConversationNotes, buildSystemPrompt } from "@/lib/chat-knowledge";
import { DAY, MINUTE, clientIp, limiter, readJson, sameOrigin } from "@/lib/guard";

// Google retires and throttles models often, so a busy or retired model falls through to the next one.
// Lite models answer portfolio questions well and start replying in about 2 seconds.
const MODELS = [
  ...(process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []),
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
];
const RETRYABLE = new Set([404, 429, 500, 503]);
const FIRST_CHUNK_MS = 10_000; // how long one model may stay silent before the next is tried
const MAX_TURNS = 12; // conversation history sent per request
const MAX_CHARS = 600; // per visitor message
const burst = limiter(10 * MINUTE, 20); // per visitor IP
const perDay = limiter(DAY, 100); // per visitor IP
const everyone = limiter(DAY, 600); // whole site, to stay inside the free Gemini quota

const SYSTEM = buildSystemPrompt();

// The visitor picks how Kniah sounds. Only these keys are accepted, so no visitor text reaches the prompt.
const TONES: Record<string, string> = {
  casual: "",
  formal: "\n\nTone for this chat: formal and professional, like a note to a hiring manager. No cat noises, slang or emojis.",
  funny: "\n\nTone for this chat: playful and funny, with light cat puns and the odd joke. Stay accurate and never invent facts to be funny.",
};

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_TURNS);
  const messages: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (text) messages.push({ role, content: text });
  }
  // The API needs the history to start with a user turn and end on the visitor's new message
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

const json = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { "content-type": "application/json" } });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json(403, "forbidden");
  if (burst(clientIp(req)) || perDay(clientIp(req))) return json(429, "rate_limited");
  if (everyone("all")) return json(503, "busy");

  const payload = await readJson(req, 20_000);
  const messages = parseMessages(payload);
  if (!messages) return json(400, "bad_request");
  const { tone: toneKey, notes: rawNotes } = (payload ?? {}) as { tone?: string; notes?: unknown };
  const tone = TONES[toneKey ?? ""] ?? "";
  // What the visitor said earlier (e.g. the role they're hiring for), kept by the page past the trimmed history
  const visitorNotes = (Array.isArray(rawNotes) ? rawNotes : [])
    .filter((n): n is string => typeof n === "string")
    .slice(0, 3)
    .map((n) => n.trim().slice(0, 200))
    .filter(Boolean);
  const notes = buildConversationNotes(messages, visitorNotes);

  // No key on the server: say so plainly instead of failing mid-stream
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json(503, "not_configured");
  const ai = new GoogleGenAI({ apiKey });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Gemini calls the assistant side "model"
        const contents = messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
        // A model that is throttled can sit silent for a minute, so give each one 10s to start
        // answering, then fall through to the next.
        let chunks: AsyncIterator<GenerateContentResponse> | null = null;
        let first: IteratorResult<GenerateContentResponse> | null = null;
        for (const [i, model] of MODELS.entries()) {
          const ctl = new AbortController();
          const timer = setTimeout(() => ctl.abort(), FIRST_CHUNK_MS);
          try {
            const stream = await ai.models.generateContentStream({
              model,
              contents,
              config: {
                systemInstruction: SYSTEM + tone + notes,
                maxOutputTokens: 2048, // the prompt asks for short answers; this is only a ceiling
                temperature: 0.9, // a little higher so repeated topics are not worded the same way
                abortSignal: ctl.signal,
              },
            });
            chunks = stream[Symbol.asyncIterator]();
            first = await chunks.next();
            clearTimeout(timer);
            break;
          } catch (error) {
            clearTimeout(timer);
            const last = i === MODELS.length - 1;
            const retry = ctl.signal.aborted || (error instanceof ApiError && RETRYABLE.has(error.status));
            if (last || !retry) throw ctl.signal.aborted ? new ApiError({ message: "model timed out", status: 503 }) : error;
          }
        }
        if (!chunks || !first) throw new Error("no model available");

        let sent = false;
        let blocked = false;
        for (let step = first; !step.done; step = await chunks.next()) {
          const chunk = step.value;
          const text = chunk.text;
          if (text) {
            controller.enqueue(encoder.encode(text));
            sent = true;
          }
          const reason = chunk.candidates?.[0]?.finishReason;
          if (chunk.promptFeedback?.blockReason || reason === "SAFETY" || reason === "PROHIBITED_CONTENT") blocked = true;
        }
        if (blocked || !sent) {
          controller.enqueue(
            encoder.encode(`${sent ? "\n\n" : ""}That one's outside what I can answer. Ask Tiffany directly through the Contact section below!`),
          );
        }
      } catch (error) {
        // Mid-stream failure: tell the client with a marker it knows how to render
        const status = error instanceof ApiError ? error.status : 0;
        const code = status === 401 || status === 403 ? "not_configured" : status === 429 || status === 503 ? "busy" : "error";
        console.error("Kniah chat failed:", status, (error as Error).message);
        controller.enqueue(encoder.encode(`\u0000${code}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}
