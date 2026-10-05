/* =====================================================================
   Unicorner — backend  ·  Cloudflare Worker  ·  wersja 3 (konta)
   ---------------------------------------------------------------------
   Endpointy:
     POST /generate          → generator (wymaga zalogowania; tekst LUB zdjęcia notatek)
     POST /                  → to samo (kompatybilność)
     GET  /health            → test po wdrożeniu: {ok, db, kv, ai_key}
     POST /auth/google       → {credential} z „Zaloguj przez Google” → {token, user, usage}
     POST /auth/logout       → kończy sesję
     GET  /me                → {user, usage}
     DELETE /me              → usuwa konto i wszystkie talie (RODO)
     GET  /decks             → lista talii użytkownika
     GET  /decks/:id         → jedna talia (fiszki + quiz)
     PATCH /decks/:id        → {title} zmiana nazwy
     DELETE /decks/:id       → usunięcie talii
     GET  /reviews           → zatwierdzone opinie (czyta strona główna)
     POST /reviews           → nowa opinia (trafia do moderacji)
     GET  /admin/list?code=… → opinie oczekujące (moderacja.html)
     POST /admin/decide      → {code, id, action:"approve"|"reject"}

   Sesja: po zalogowaniu strona dostaje losowy token i wysyła go w nagłówku
   „Authorization: Bearer …”. W bazie trzymamy tylko jego skrót (SHA-256).

   Sekrety / zmienne (panel Cloudflare → Worker → Settings → Variables):
     ANTHROPIC_API_KEY — klucz do AI
     ADMIN_CODE        — kod do moderacji opinii
     ALLOWED_ORIGIN    — np. "https://unicorner.pl" (można kilka po przecinku)
     ADMIN_EMAILS      — opcjonalnie: Twoje maile (po przecinku) bez limitu generowań
     FREE_MONTHLY_GENS — opcjonalnie: darmowy limit na miesiąc (domyślnie 10)
     ACCESS_CODE       — STARY wspólny kod; nadal działa (bez zapisu talii), można usunąć

   Bindingi (panel → Worker → Settings → Bindings):
     UC_KV — namespace KV (opinie, limity na IP)
     DB    — baza D1 „unicorner-db” (konta, sesje, talie, zużycie). Tabele
             tworzą się same przy pierwszym uruchomieniu.
   ===================================================================== */

const MODEL = "claude-haiku-4-5-20251001";
const GOOGLE_CLIENT_ID = "243769752280-r6h2cj3pn9n47p020seuk58n9ijj9si7.apps.googleusercontent.com"; // publiczny identyfikator z Google Cloud
const SESSION_DAYS = 60;                 // ile dni trwa zalogowanie
const FREE_MONTHLY_GENS_DEFAULT = 10;    // darmowe generowania na konto na miesiąc (beta)
const MAX_DECKS_PER_USER = 300;
const MAX_DECK_JSON = 120_000;           // maks. rozmiar zapisanej talii (znaki JSON)
const MAX_INPUT_CHARS = 14000;
const MAX_TOKENS = 3000;
const MAX_INSTRUCTION_CHARS = 300;     // „na czym się skupić” z generatora
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

      if (path === "/health" && request.method === "GET")
        return await handleHealth(env, cors);

      if (path === "/auth/google" && request.method === "POST")
        return await handleAuthGoogle(request, env, cors);
      if (path === "/auth/logout" && request.method === "POST")
        return await handleLogout(request, env, cors);
      if (path === "/me" && request.method === "GET")
        return await handleMe(request, env, cors);
      if (path === "/me" && request.method === "DELETE")
        return await handleDeleteMe(request, env, cors);
      if (path === "/decks" && request.method === "GET")
        return await handleDecksList(request, env, cors);
      const dm = path.match(/^\/decks\/([A-Za-z0-9-]{8,64})$/);
      if (dm && request.method === "GET")    return await handleDeckGet(request, env, cors, dm[1]);
      if (dm && request.method === "PATCH")  return await handleDeckRename(request, env, cors, dm[1]);
      if (dm && request.method === "DELETE") return await handleDeckDelete(request, env, cors, dm[1]);

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

  const { text, code, images, instruction, source } = body || {};

  // kto generuje: zalogowany użytkownik albo (przejściowo) stary wspólny kod
  const user = env.DB ? await authUser(request, env) : null;
  const legacy = !user && env.ACCESS_CODE && code === env.ACCESS_CODE;
  if (!user && !legacy)
    return json({ error: "Zaloguj się, żeby generować.", need_login: true }, 401, cors);

  // rate limit: N generowań / IP / h (ochrona przed skryptami)
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

  // miesięczny limit konta — rezerwujemy 1 generowanie atomowo (zwracamy, jeśli AI zawiedzie)
  let reserved = false;
  if (user) {
    const r = await reserveGeneration(env, user);
    if (!r.ok) return json({ error: `Wykorzystałeś darmowy limit (${r.limit}) w tym miesiącu. Odnowi się 1. dnia miesiąca.`, limit_reached: true, usage: r.usage }, 429, cors);
    reserved = r.counted;
  }

  // opcjonalna wskazówka użytkownika („na czym się skupić”) — krótka, bez znaków sterujących
  const instr = typeof instruction === "string"
    ? instruction.replace(/[\u0000-\u001f"]+/g, " ").trim().slice(0, MAX_INSTRUCTION_CHARS) : "";
  const instrBlock = instr
    ? `\n\nWSKAZÓWKA UŻYTKOWNIKA (uwzględnij ją, ale nadal bazuj WYŁĄCZNIE na materiale i zwróć ten sam format JSON): "${instr}"`
    : "";

  const system =
    "Jesteś asystentem do nauki. Na podstawie WYŁĄCZNIE dostarczonego materiału " +
    "tworzysz fiszki i quiz po polsku. Bazuj tylko na treści materiału — nie dodawaj " +
    "wiedzy spoza niego. Odpowiadasz CZYSTYM JSON-em, bez markdownu, bez komentarzy.";

  const rules =
`ZWRÓĆ DOKŁADNIE taki JSON (bez nic poza nim):
{
  "title": "krótki tytuł materiału, max 60 znaków, np. Inflacja i jej rodzaje",
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

${rules}${instrBlock}` + (material ? `\n\nDODATKOWY MATERIAŁ TEKSTOWY:\n"""\n${material}\n"""` : "");
    userContent = [...imageBlocks, { type: "text", text: imgInstr }];
  } else {
    userContent = `Z poniższego materiału zrób fiszki i quiz.\n\n${rules}${instrBlock}\n\nMATERIAŁ:\n"""\n${material}\n"""`;
  }

  let aiRes;
  try {
    aiRes = await fetch(env.AI_URL || "https://api.anthropic.com/v1/messages", {
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
    if (reserved) await releaseGeneration(env, user);
    return json({ error: "Nie udało się połączyć z AI" }, 502, cors);
  }

  if (!aiRes.ok) {
    if (reserved) await releaseGeneration(env, user);
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
  if (!parsed || (!parsed.flashcards && !parsed.quiz)) {
    if (reserved) await releaseGeneration(env, user);
    return json({ error: "AI zwróciło nieprawidłowy format" }, 502, cors);
  }

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

  const title = cleanTitle(parsed.title) || defaultTitle(source);
  const out = { title, flashcards: parsed.flashcards || [], quiz: parsed.quiz || [] };

  // zapis talii na koncie
  if (user) {
    try {
      out.deck = await saveDeck(env, user, {
        title, source: ["pdf", "img", "txt"].includes(source) ? source : (hasImages ? "img" : "txt"),
        instruction: typeof instruction === "string" ? instruction.slice(0, MAX_INSTRUCTION_CHARS) : "",
        flashcards: out.flashcards, quiz: out.quiz,
      });
    } catch (e) { out.save_error = "Nie udało się zapisać talii na koncie"; }
    out.usage = await getUsage(env, user);
  }
  return json(out, 200, cors);
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

/* ===================== BAZA (D1) ===================== */

let schemaReady = false;
async function ensureSchema(env) {
  if (schemaReady) return;
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, google_sub TEXT UNIQUE NOT NULL, email TEXT, name TEXT, picture TEXT,
      created_at INTEGER NOT NULL, last_login INTEGER)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, source TEXT, instruction TEXT,
      data TEXT NOT NULL, fc_count INTEGER NOT NULL DEFAULT 0, qz_count INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS decks_user ON decks(user_id, created_at DESC)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS usage (
      user_id TEXT NOT NULL, period TEXT NOT NULL, gens INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (user_id, period))`),
  ]);
  schemaReady = true;
}

/* szybki test po wdrożeniu: otwórz /health w przeglądarce */
async function handleHealth(env, cors) {
  const out = { ok: true, version: 3, ai_key: !!env.ANTHROPIC_API_KEY, kv: !!env.UC_KV, db: false };
  if (env.DB) {
    try { await ensureSchema(env); await env.DB.prepare("SELECT COUNT(*) AS n FROM users").first(); out.db = true; }
    catch (e) { out.db_error = String(e.message || e).slice(0, 120); }
  }
  out.ok = out.ai_key && out.kv && out.db;
  return json(out, 200, cors);
}

/* ===================== LOGOWANIE (Google) ===================== */

async function handleAuthGoogle(request, env, cors) {
  if (!env.DB) return json({ error: "Logowanie jeszcze nie jest skonfigurowane (brak bazy DB)." }, 503, cors);
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "Bad JSON" }, 400, cors); }

  const rl = await rateLimit(env, "a:" + clientIp(request), 30, 3600);
  if (!rl.ok) return json({ error: "Za dużo prób logowania — spróbuj za chwilę." }, 429, cors);

  let claims;
  try { claims = await verifyGoogleIdToken(String((body && body.credential) || ""), env); }
  catch (e) { return json({ error: "Logowanie nieudane", detail: String(e.message || e).slice(0, 120) }, 401, cors); }

  await ensureSchema(env);
  const now = Date.now();
  const name = String(claims.name || claims.given_name || "").slice(0, 80);
  const picture = /^https:\/\//.test(claims.picture || "") ? String(claims.picture).slice(0, 400) : "";
  const email = String(claims.email || "").slice(0, 200);

  let row = await env.DB.prepare("SELECT id FROM users WHERE google_sub = ?").bind(claims.sub).first();
  let userId;
  if (row) {
    userId = row.id;
    await env.DB.prepare("UPDATE users SET email = ?, name = ?, picture = ?, last_login = ? WHERE id = ?")
      .bind(email, name, picture, now, userId).run();
  } else {
    userId = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users (id, google_sub, email, name, picture, created_at, last_login) VALUES (?,?,?,?,?,?,?)")
      .bind(userId, claims.sub, email, name, picture, now, now).run();
  }

  const token = randomToken();
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?,?,?,?)")
    .bind(await sha256hex(token), userId, now, now + SESSION_DAYS * 86400e3).run();
  // sprzątanie wygasłych sesji tego użytkownika
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ? AND expires_at < ?").bind(userId, now).run();

  const user = { id: userId, email, name, picture };
  return json({ token, user: publicUser(user, env), usage: await getUsage(env, user) }, 200, cors);
}

async function handleLogout(request, env, cors) {
  const t = bearer(request);
  if (t && env.DB) { await ensureSchema(env); await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256hex(t)).run(); }
  return json({ ok: true }, 200, cors);
}

async function handleMe(request, env, cors) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  return json({ user: publicUser(user, env), usage: await getUsage(env, user) }, 200, cors);
}

async function handleDeleteMe(request, env, cors) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM decks WHERE user_id = ?").bind(user.id),
    env.DB.prepare("DELETE FROM usage WHERE user_id = ?").bind(user.id),
    env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id),
    env.DB.prepare("DELETE FROM users WHERE id = ?").bind(user.id),
  ]);
  return json({ ok: true }, 200, cors);
}

/* zwraca użytkownika z tokenu w nagłówku Authorization albo null */
async function authUser(request, env) {
  const t = bearer(request);
  if (!t) return null;
  await ensureSchema(env);
  return await env.DB.prepare(
    "SELECT u.id, u.email, u.name, u.picture FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?"
  ).bind(await sha256hex(t), Date.now()).first();
}

function bearer(request) {
  const h = request.headers.get("Authorization") || "";
  const m = h.match(/^Bearer\s+([A-Za-z0-9_-]{20,200})$/);
  return m ? m[1] : null;
}

function isAdmin(user, env) {
  const list = String(env.ADMIN_EMAILS || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  return !!(user && user.email && list.includes(String(user.email).toLowerCase()));
}

function publicUser(u, env) {
  return { name: u.name || "", email: u.email || "", picture: u.picture || "", admin: isAdmin(u, env) };
}

/* weryfikacja tokenu „Zaloguj przez Google” (JWT podpisany kluczem Google, RS256) */
let jwksCache = null;
async function googleKeys(env, force) {
  if (env.GOOGLE_JWKS_JSON) return JSON.parse(env.GOOGLE_JWKS_JSON).keys; // tylko testy lokalne
  if (!force && jwksCache && jwksCache.exp > Date.now()) return jwksCache.keys;
  const r = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  if (!r.ok) throw new Error("certs " + r.status);
  const j = await r.json();
  const ma = /max-age=(\d+)/.exec(r.headers.get("cache-control") || "");
  jwksCache = { keys: j.keys, exp: Date.now() + (ma ? +ma[1] * 1000 : 3600e3) };
  return j.keys;
}

async function verifyGoogleIdToken(token, env) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("zły format tokenu");
  const header = JSON.parse(b64urlToString(parts[0]));
  const claims = JSON.parse(b64urlToString(parts[1]));
  if (header.alg !== "RS256") throw new Error("zły algorytm");

  let keys = await googleKeys(env, false);
  let jwk = keys.find(k => k.kid === header.kid);
  if (!jwk) { keys = await googleKeys(env, true); jwk = keys.find(k => k.kid === header.kid); }
  if (!jwk) throw new Error("nieznany klucz");

  const key = await crypto.subtle.importKey("jwk", { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlToBytes(parts[2]),
    new TextEncoder().encode(parts[0] + "." + parts[1]));
  if (!ok) throw new Error("zły podpis");

  const clientId = env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID;
  const now = Math.floor(Date.now() / 1000);
  if (!["accounts.google.com", "https://accounts.google.com"].includes(claims.iss)) throw new Error("zły wystawca");
  if (claims.aud !== clientId) throw new Error("zły odbiorca");
  if (!(claims.exp > now - 60)) throw new Error("token wygasł");
  if (!claims.sub) throw new Error("brak sub");
  if (claims.email && claims.email_verified === false) throw new Error("niezweryfikowany e-mail");
  return claims;
}

/* ===================== LIMIT GENEROWAŃ ===================== */

function period() { return new Date().toISOString().slice(0, 7); } // "2026-10" (UTC)
function monthlyLimit(env) { const n = parseInt(env.FREE_MONTHLY_GENS, 10); return n > 0 ? n : FREE_MONTHLY_GENS_DEFAULT; }

async function getUsage(env, user) {
  const row = await env.DB.prepare("SELECT gens FROM usage WHERE user_id = ? AND period = ?").bind(user.id, period()).first();
  const unlimited = isAdmin(user, env);
  return { used: row ? row.gens : 0, limit: unlimited ? null : monthlyLimit(env), period: period() };
}

/* atomowo: +1, ale tylko jeśli poniżej limitu (chroni przed wieloma równoległymi żądaniami) */
async function reserveGeneration(env, user) {
  const p = period();
  if (isAdmin(user, env)) {
    await env.DB.prepare("INSERT INTO usage (user_id, period, gens) VALUES (?, ?, 1) ON CONFLICT(user_id, period) DO UPDATE SET gens = gens + 1")
      .bind(user.id, p).run();
    return { ok: true, counted: true };
  }
  const limit = monthlyLimit(env);
  const row = await env.DB.prepare(
    "INSERT INTO usage (user_id, period, gens) VALUES (?, ?, 1) ON CONFLICT(user_id, period) DO UPDATE SET gens = gens + 1 WHERE gens < ? RETURNING gens"
  ).bind(user.id, p, limit).first();
  if (!row) return { ok: false, limit, usage: { used: limit, limit, period: p } };
  return { ok: true, counted: true };
}

async function releaseGeneration(env, user) {
  try {
    await env.DB.prepare("UPDATE usage SET gens = MAX(gens - 1, 0) WHERE user_id = ? AND period = ?").bind(user.id, period()).run();
  } catch { /* trudno — najwyżej zostanie policzone */ }
}

/* ===================== TALIE ===================== */

function cleanTitle(t) { return String(t || "").replace(/[\u0000-\u001f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80); }
function defaultTitle(source) {
  const d = new Date().toLocaleDateString("pl-PL", { day: "numeric", month: "long" });
  return (source === "img" ? "Notatki ze zdjęć" : source === "pdf" ? "Materiał z PDF" : "Materiał") + " · " + d;
}

async function saveDeck(env, user, d) {
  const cnt = await env.DB.prepare("SELECT COUNT(*) AS n FROM decks WHERE user_id = ?").bind(user.id).first();
  if (cnt && cnt.n >= MAX_DECKS_PER_USER) throw new Error("limit talii");
  const data = JSON.stringify({ flashcards: d.flashcards, quiz: d.quiz });
  if (data.length > MAX_DECK_JSON) throw new Error("talia za duża");
  const id = crypto.randomUUID(), now = Date.now();
  await env.DB.prepare(
    "INSERT INTO decks (id, user_id, title, source, instruction, data, fc_count, qz_count, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
  ).bind(id, user.id, d.title, d.source, d.instruction, data, d.flashcards.length, d.quiz.length, now, now).run();
  return { id, title: d.title, source: d.source, created_at: now, fc: d.flashcards.length, qz: d.quiz.length };
}

async function handleDecksList(request, env, cors) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  const { results } = await env.DB.prepare(
    "SELECT id, title, source, fc_count AS fc, qz_count AS qz, created_at FROM decks WHERE user_id = ? ORDER BY created_at DESC LIMIT 200"
  ).bind(user.id).all();
  return json({ decks: results || [] }, 200, cors);
}

async function handleDeckGet(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  const row = await env.DB.prepare("SELECT id, title, source, instruction, data, created_at FROM decks WHERE id = ? AND user_id = ?")
    .bind(id, user.id).first();
  if (!row) return json({ error: "Nie ma takiej talii" }, 404, cors);
  const data = safeParse(row.data) || {};
  return json({ id: row.id, title: row.title, source: row.source, instruction: row.instruction, created_at: row.created_at,
    flashcards: data.flashcards || [], quiz: data.quiz || [] }, 200, cors);
}

async function handleDeckRename(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "Bad JSON" }, 400, cors); }
  const title = cleanTitle(body && body.title);
  if (!title) return json({ error: "Pusty tytuł" }, 400, cors);
  const r = await env.DB.prepare("UPDATE decks SET title = ?, updated_at = ? WHERE id = ? AND user_id = ?")
    .bind(title, Date.now(), id, user.id).run();
  if (!r.meta || !r.meta.changes) return json({ error: "Nie ma takiej talii" }, 404, cors);
  return json({ ok: true, title }, 200, cors);
}

async function handleDeckDelete(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  await env.DB.prepare("DELETE FROM decks WHERE id = ? AND user_id = ?").bind(id, user.id).run();
  return json({ ok: true }, 200, cors);
}

/* ===================== KRYPTO / BASE64 ===================== */

function randomToken() {
  const b = new Uint8Array(32); crypto.getRandomValues(b);
  return bytesToB64url(b);
}
async function sha256hex(s) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(h)].map(x => x.toString(16).padStart(2, "0")).join("");
}
function b64urlToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
  const bin = atob(s); const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64urlToString(s) { return new TextDecoder().decode(b64urlToBytes(s)); }
function bytesToB64url(b) {
  let bin = ""; for (const x of b) bin += String.fromCharCode(x);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
