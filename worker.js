/* =====================================================================
   Unicorner — backend  ·  Cloudflare Worker  ·  wersja 2
   ---------------------------------------------------------------------
   Endpointy:
     POST /            → generator (kompatybilność ze starą stroną)
     POST /generate    → generator: tekst z PDF LUB zdjęcia notatek
     GET  /reviews     → zatwierdzone opinie (czyta strona główna)
     POST /reviews     → nowa opinia (trafia do moderacji, nie od razu na stronę)
     GET  /admin/list?code=…   → opinie oczekujące (dla moderacja.html)
     POST /admin/decide        → {code, id, action:"approve"|"reject"}

   Sekrety (panel Cloudflare → Worker → Settings → Variables):
     ANTHROPIC_API_KEY — jak dotychczas
     ACCESS_CODE       — kod dostępu do generatora, jak dotychczas
     ADMIN_CODE        — NOWY: kod do moderacji opinii (wymyśl długi)
     ALLOWED_ORIGIN    — np. "https://unicorner.pl" (można kilka po przecinku)

   Wymagany binding KV (panel → Worker → Settings → Bindings):
     nazwa zmiennej: UC_KV  →  wskazuje na utworzony namespace KV
   ===================================================================== */

const MODEL = "claude-haiku-4-5-20251001";
const MAX_INPUT_CHARS = 14000;
const MAX_TOKENS = 3000;
const MAX_IMAGES = 4;                    // maks. zdjęć notatek na jedno generowanie
const MAX_IMAGE_B64 = 400_000;           // ~300 KB pliku po kompresji na froncie
const GEN_LIMIT_PER_HOUR = 12;           // generowań na IP na godzinę
const REVIEWS_LIMIT_PER_DAY = 5;         // opinii na IP na dobę
const REVIEW_TEXT_MIN = 10;
const REVIEW_TEXT_MAX = 600;
const APPROVED_CAP = 60;                 // ile zatwierdzonych opinii trzymamy

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    try {
      if ((path === "/" || path === "/generate") && request.method === "POST")
        return await handleGenerate(request, env, cors);

      if (path === "/reviews" && request.method === "GET")
        return await handleReviewsGet(env, cors);

      if (path === "/reviews" && request.method === "POST")
        return await handleReviewsPost(request, env, cors);

      if (path === "/admin/list" && request.method === "GET")
        return await handleAdminList(url, env, cors);

      if (path === "/admin/decide" && request.method === "POST")
        return await handleAdminDecide(request, env, cors);

      return json({ error: "Not found" }, 404, cors);
    } catch (e) {
      return json({ error: "Błąd serwera", detail: String(e && e.message || e).slice(0, 160) }, 500, cors);
    }
  },
};

/* ===================== GENERATOR (tekst + zdjęcia) ===================== */

async function handleGenerate(request, env, cors) {
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "Bad JSON" }, 400, cors); }

  const { text, code, images } = body || {};

  if (!env.ACCESS_CODE || code !== env.ACCESS_CODE)
    return json({ error: "Zły kod dostępu" }, 401, cors);

  // rate limit: N generowań / IP / h (dopiero PO sprawdzeniu kodu)
  const rl = await rateLimit(env, "g:" + clientIp(request), GEN_LIMIT_PER_HOUR, 3600);
  if (!rl.ok) return json({ error: "Limit generowań na godzinę wykorzystany — spróbuj później." }, 429, cors);

  // --- walidacja wejścia: tekst LUB zdjęcia ---
  const imgs = Array.isArray(images) ? images : [];
  const hasImages = imgs.length > 0;
  const hasText = typeof text === "string" && text.trim().length >= 200;

  if (!hasImages && !hasText)
    return json({ error: "Za mało materiału do przetworzenia" }, 400, cors);

  if (imgs.length > MAX_IMAGES)
    return json({ error: `Maksymalnie ${MAX_IMAGES} zdjęcia naraz` }, 400, cors);

  const imageBlocks = [];
  for (const im of imgs) {
    if (!im || typeof im.data !== "string" || !im.data) return json({ error: "Uszkodzone zdjęcie" }, 400, cors);
    if (im.data.length > MAX_IMAGE_B64) return json({ error: "Zdjęcie za duże — odśwież stronę i spróbuj ponownie" }, 413, cors);
    const mt = ["image/jpeg", "image/png", "image/webp"].includes(im.media_type) ? im.media_type : "image/jpeg";
    imageBlocks.push({ type: "image", source: { type: "base64", media_type: mt, data: im.data } });
  }

  const material = hasText ? text.slice(0, MAX_INPUT_CHARS) : "";

  const system =
    "Jesteś asystentem do nauki. Na podstawie WYŁĄCZNIE dostarczonego materiału " +
    "tworzysz fiszki i quiz po polsku. Bazuj tylko na treści materiału — nie dodawaj " +
    "wiedzy spoza niego. Odpowiadasz CZYSTYM JSON-em, bez markdownu, bez komentarzy.";

  const rules =
`ZWRÓĆ DOKŁADNIE taki JSON (bez nic poza nim):
{
  "flashcards": [ { "term": "pojęcie/krótkie hasło", "def": "zwięzła definicja lub wyjaśnienie" } ],
  "quiz": [ { "q": "treść pytania", "options": ["A","B","C","D"], "correct": 0, "explain": "krótkie uzasadnienie poprawnej odpowiedzi" } ]
}

Zasady:
- 8–14 fiszek, 8–12 pytań (zależnie od ilości materiału).
- Każde pytanie ma DOKŁADNIE 4 opcje; "correct" to indeks 0–3 poprawnej.
- BARDZO WAŻNE — nie zdradzaj poprawnej odpowiedzi formą:
  * wszystkie 4 opcje mają mieć ZBLIŻONĄ długość (różnica kilku słów maks.),
  * poprawna NIE może być najdłuższa ani jedyna z nawiasem/przykładem,
  * mieszaj pozycję poprawnej (raz 0, raz 1, 2, 3 — nie zawsze ta sama).
- Dystraktory mają być prawdopodobne, nie absurdalne.
- Definicje fiszek krótkie (1–2 zdania).
- Jeśli materiału jest mało, zrób mniej pozycji, ale poprawnych.`;

  let userContent;
  if (imageBlocks.length) {
    const imgInstr =
`Materiał to zdjęcia notatek — najpewniej pismo odręczne, możliwe skróty, strzałki i schematy.
1. Najpierw uważnie odczytaj treść ze wszystkich zdjęć (to notatki studenckie po polsku).
2. Rozwiń oczywiste skróty z kontekstu; fragmenty NIECZYTELNE pomiń — nie zgaduj i nie dopisuj.
3. Ze schematów i strzałek odtwórz relacje (co z czego wynika, co na co wpływa).
4. Dopiero z tak odczytanej treści zrób fiszki i quiz.

${rules}` + (material ? `\n\nDODATKOWY MATERIAŁ TEKSTOWY:\n"""\n${material}\n"""` : "");
    userContent = [...imageBlocks, { type: "text", text: imgInstr }];
  } else {
    userContent = `Z poniższego materiału zrób fiszki i quiz.\n\n${rules}\n\nMATERIAŁ:\n"""\n${material}\n"""`;
  }

  let aiRes;
  try {
    aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system,
        messages: [{ role: "user", content: userContent }],
      }),
    });
  } catch {
    return json({ error: "Nie udało się połączyć z AI" }, 502, cors);
  }

  if (!aiRes.ok) {
    const detail = (await aiRes.text()).slice(0, 200);
    return json({ error: "AI error " + aiRes.status, detail }, 502, cors);
  }

  const data = await aiRes.json();
  let raw = (data.content && data.content[0] && data.content[0].text) || "";

  let parsed = safeParse(raw);
  if (!parsed) {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) parsed = safeParse(m[0]);
  }
  if (!parsed || (!parsed.flashcards && !parsed.quiz))
    return json({ error: "AI zwróciło nieprawidłowy format" }, 502, cors);

  if (Array.isArray(parsed.quiz)) {
    parsed.quiz = parsed.quiz
      .filter(q => q && Array.isArray(q.options) && q.options.length === 4)
      .map(q => ({
        q: String(q.q || q.question || ""),
        options: q.options.map(String),
        correct: clampIndex(q.correct),
        explain: String(q.explain || q.explanation || ""),
      }));
  }
  if (Array.isArray(parsed.flashcards)) {
    parsed.flashcards = parsed.flashcards
      .filter(c => c && (c.term || c.front))
      .map(c => ({ term: String(c.term || c.front || ""), def: String(c.def || c.definition || c.back || "") }));
  }

  return json(parsed, 200, cors);
}

/* ===================== OPINIE ===================== */

async function handleReviewsGet(env, cors) {
  const list = safeParse(await env.UC_KV.get("rev:approved")) || [];
  // publiczne pola only — bez timestampów itp.
  const pub = list.map(r => ({ stars: r.stars, text: r.text, name: r.name, subject: r.subject }));
  return json(pub, 200, { ...cors, "Cache-Control": "public, max-age=60" });
}

async function handleReviewsPost(request, env, cors) {
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "Bad JSON" }, 400, cors); }

  const { stars, text, name, subject, website, t } = body || {};

  // honeypot: ukryte pole, człowiek go nie wypełni
  if (website) return json({ ok: true }, 200, cors); // bot dostaje "sukces" i nic się nie dzieje
  // za szybkie wysłanie = bot
  if (typeof t === "number" && t < 2500) return json({ ok: true }, 200, cors);

  const rl = await rateLimit(env, "r:" + clientIp(request), REVIEWS_LIMIT_PER_DAY, 86400);
  if (!rl.ok) return json({ error: "Limit opinii na dziś wykorzystany." }, 429, cors);

  const s = parseInt(stars, 10);
  if (!(s >= 1 && s <= 5)) return json({ error: "Ocena musi być od 1 do 5" }, 400, cors);

  const txt = String(text || "").trim();
  if (txt.length < REVIEW_TEXT_MIN) return json({ error: `Opinia musi mieć min. ${REVIEW_TEXT_MIN} znaków` }, 400, cors);
  if (txt.length > REVIEW_TEXT_MAX) return json({ error: `Opinia może mieć maks. ${REVIEW_TEXT_MAX} znaków` }, 400, cors);

  const rev = {
    id: crypto.randomUUID(),
    stars: s,
    text: txt,
    name: String(name || "").trim().slice(0, 40),
    subject: String(subject || "").trim().slice(0, 60),
    ts: Date.now(),
  };

  await env.UC_KV.put("rev:p:" + rev.id, JSON.stringify(rev), { expirationTtl: 60 * 60 * 24 * 90 });
  return json({ ok: true }, 200, cors);
}

/* ===================== MODERACJA ===================== */

function adminOk(env, code) { return env.ADMIN_CODE && code === env.ADMIN_CODE; }

async function handleAdminList(url, env, cors) {
  if (!adminOk(env, url.searchParams.get("code"))) return json({ error: "Zły kod" }, 401, cors);
  const keys = (await env.UC_KV.list({ prefix: "rev:p:", limit: 100 })).keys;
  const out = [];
  for (const k of keys) {
    const v = safeParse(await env.UC_KV.get(k.name));
    if (v) out.push(v);
  }
  out.sort((a, b) => b.ts - a.ts);
  return json(out, 200, cors);
}

async function handleAdminDecide(request, env, cors) {
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "Bad JSON" }, 400, cors); }
  const { code, id, action } = body || {};
  if (!adminOk(env, code)) return json({ error: "Zły kod" }, 401, cors);
  if (!id || !["approve", "reject"].includes(action)) return json({ error: "Złe parametry" }, 400, cors);

  const key = "rev:p:" + String(id);
  const rev = safeParse(await env.UC_KV.get(key));
  if (!rev) return json({ error: "Opinia nie istnieje (już rozpatrzona?)" }, 404, cors);

  if (action === "approve") {
    const list = safeParse(await env.UC_KV.get("rev:approved")) || [];
    list.unshift(rev);
    await env.UC_KV.put("rev:approved", JSON.stringify(list.slice(0, APPROVED_CAP)));
  }
  await env.UC_KV.delete(key);
  return json({ ok: true }, 200, cors);
}

/* ===================== POMOCNICZE ===================== */

function corsHeaders(request, env) {
  const conf = (env.ALLOWED_ORIGIN || "*").split(",").map(s => s.trim()).filter(Boolean);
  const reqOrigin = request.headers.get("Origin") || "";
  let allow;
  if (conf.includes("*")) allow = "*";
  else allow = conf.includes(reqOrigin) ? reqOrigin : conf[0] || "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || "0.0.0.0";
}

/* prosty licznik w KV: zwiększa i sprawdza limit w oknie ttl sekund */
async function rateLimit(env, key, limit, ttl) {
  const bucket = Math.floor(Date.now() / (ttl * 1000));
  const k = "rl:" + key + ":" + bucket;
  const n = parseInt(await env.UC_KV.get(k), 10) || 0;
  if (n >= limit) return { ok: false };
  await env.UC_KV.put(k, String(n + 1), { expirationTtl: ttl + 60 });
  return { ok: true };
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}
function safeParse(s) { try { return JSON.parse(s); } catch { return null; } }
function clampIndex(n) { n = parseInt(n, 10); return (n >= 0 && n <= 3) ? n : 0; }
