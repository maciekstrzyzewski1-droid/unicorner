/* =====================================================================
   Unicorner — backend  ·  Cloudflare Worker  ·  wersja 9 (konta, kredyty, udostępnianie, błędy, powtórki)
   ---------------------------------------------------------------------
   Endpointy:
     POST /generate          → generator (wymaga zalogowania; tekst LUB zdjęcia notatek) (3 kredyty)
     POST /                  → to samo (kompatybilność)
     GET  /health            → test po wdrożeniu: {ok, db, kv, ai_key}
     POST /auth/google       → {credential} z „Zaloguj przez Google” → {token, user, usage}
     POST /auth/logout       → kończy sesję
     GET  /me                → {user, usage}
     DELETE /me              → usuwa konto i wszystkie talie (RODO)
     GET  /decks             → lista talii użytkownika
     GET  /decks/:id         → jedna talia (fiszki + quiz)
     PATCH /decks/:id        → {title} zmiana nazwy
     PUT  /decks/:id         → {flashcards, quiz} zapis talii bez AI (np. „Cofnij zmianę”)
     POST /decks/:id/edit    → {instruction, material?, weak?} AI poprawia całą talię (2 kredyty);
                               weak: true = dorób pytania z tematów, w których się mylisz
     POST /decks/:id/item    → {kind, index, action} wyjaśnij / podmień jeden element (1 kredyt)
     DELETE /decks/:id       → usunięcie talii
     POST /decks/:id/answer  → {qkey, ok} zapis odpowiedzi w quizie (do „Moje błędy”)
     POST /decks/:id/review  → {ckey, ok} powtórka fiszki („Umiem” / „Jeszcze nie”) → {box, due}
     POST /decks/:id/share   → włącza udostępnianie linkiem → {share_id}
     DELETE /decks/:id/share → wyłącza udostępnianie
     GET  /s/:share_id       → publiczny podgląd udostępnionej talii (bez logowania)
     POST /s/:share_id/copy  → zapisuje kopię udostępnionej talii na swoim koncie
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
     FREE_MONTHLY_CREDITS — opcjonalnie: darmowe kredyty na miesiąc (domyślnie 30)
     (ACCESS_CODE — stary wspólny kod; od wersji 9 nieużywany, można usunąć ze zmiennych)

   Bindingi (panel → Worker → Settings → Bindings):
     UC_KV — namespace KV (opinie; limity na IP tylko awaryjnie, gdy brak bazy DB)
     DB    — baza D1 „unicorner-db” (konta, sesje, talie, kredyty). Tabele
             tworzą się same przy pierwszym uruchomieniu.
   ===================================================================== */

const MODEL = "claude-haiku-4-5-20251001";
const GOOGLE_CLIENT_ID = "243769752280-r6h2cj3pn9n47p020seuk58n9ijj9si7.apps.googleusercontent.com"; // publiczny identyfikator z Google Cloud
const SESSION_DAYS = 60;                 // ile dni trwa zalogowanie
const FREE_MONTHLY_CREDITS_DEFAULT = 30; // darmowe kredyty na konto na miesiąc (beta)
const COST = { generate: 3, deckEdit: 2, item: 1 }; // ile kredytów kosztuje akcja
const MAX_ITEMS = 20;                    // maks. fiszek i pytań w talii
const EDIT_MAX_TOKENS = 8000;            // odpowiedź przy przerabianiu całej talii (duża talia ≈ 5–6 tys. tokenów)
const EDIT_LIMIT_PER_HOUR = 60;          // akcji edycji na użytkownika na godzinę
const IP_LIMIT_FACTOR = 4;               // limit na IP = 4× limit na użytkownika (akademik / sieć komórkowa = wspólne IP)
const WRITE_LIMIT_PER_HOUR = 1500;       // zapisów odpowiedzi/powtórek/zmian na użytkownika na godzinę
const MAX_DECKS_PER_USER = 300;
const MAX_DECK_JSON = 120_000;           // maks. rozmiar zapisanej talii (znaki JSON)
const MAX_INPUT_CHARS = 14000;
const MAX_TOKENS = 3000;
const MAX_INSTRUCTION_CHARS = 300;     // „na czym się skupić” z generatora
const MAX_IMAGES = 4;                    // maks. zdjęć notatek na jedno generowanie
const MAX_IMAGE_B64 = 400_000;           // ~300 KB pliku po kompresji na froncie
const GEN_LIMIT_PER_HOUR = 12;           // generowań na użytkownika na godzinę
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
      if (dm && request.method === "PUT")    return await handleDeckPut(request, env, cors, dm[1]);
      if (dm && request.method === "DELETE") return await handleDeckDelete(request, env, cors, dm[1]);
      const da = path.match(/^\/decks\/([A-Za-z0-9-]{8,64})\/(edit|item|share|answer|review)$/);
      if (da && da[2] === "review" && request.method === "POST") return await handleReview(request, env, cors, da[1]);
      if (da && da[2] === "answer" && request.method === "POST") return await handleAnswer(request, env, cors, da[1]);
      if (da && da[2] === "share" && request.method === "POST")   return await handleShareCreate(request, env, cors, da[1]);
      if (da && da[2] === "share" && request.method === "DELETE") return await handleShareDelete(request, env, cors, da[1]);
      if (da && (da[2] === "edit" || da[2] === "item") && request.method === "POST")
        return da[2] === "edit" ? await handleDeckEdit(request, env, cors, da[1]) : await handleDeckItem(request, env, cors, da[1]);
      const sm = path.match(/^\/s\/([A-Za-z0-9]{6,20})(\/copy)?$/);
      if (sm && !sm[2] && request.method === "GET")  return await handleSharedGet(env, cors, sm[1]);
      if (sm && sm[2] && request.method === "POST")  return await handleSharedCopy(request, env, cors, sm[1]);

      if (path === "/reviews" && request.method === "GET")
        return await handleReviewsGet(env, cors);

      if (path === "/reviews" && request.method === "POST")
        return await handleReviewsPost(request, env, cors);

      if (path === "/admin/list" && request.method === "GET")
        return await handleAdminList(url, env, cors, request);

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

  const { text, images, instruction, source } = body || {};

  // generować może tylko zalogowany użytkownik (kredyty)
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Zaloguj się, żeby generować.", need_login: true }, 401, cors);

  // ochrona przed skryptami: limit na konto + luźniejszy na IP
  if (!(await limitUserAndIp(env, request, user, "g", GEN_LIMIT_PER_HOUR)))
    return json({ error: "Limit generowań na godzinę wykorzystany — spróbuj później." }, 429, cors);

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

  // miesięczny limit konta — rezerwujemy kredyty atomowo (zwracamy, jeśli AI zawiedzie)
  const r0 = await reserveCredits(env, user, COST.generate);
  if (!r0.ok) return await noCredits(env, user, COST.generate, cors);
  const reserved = true;

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

  let parsed;
  try {
    parsed = parseJsonLoose(await callAI(env, { system, content: userContent, maxTokens: MAX_TOKENS }));
  } catch (e) {
    if (reserved) await releaseCredits(env, user, COST.generate);
    return json({ error: e.message, detail: e.detail }, e.status || 502, cors);
  }
  const deck = normalizeDeck(parsed || {});
  if (!deck.flashcards.length && !deck.quiz.length) {
    if (reserved) await releaseCredits(env, user, COST.generate);
    return json({ error: "AI zwróciło nieprawidłowy format" }, 502, cors);
  }

  const title = deck.title || defaultTitle(source);
  const out = { title, flashcards: deck.flashcards, quiz: deck.quiz };

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

async function handleAdminList(url, env, cors, request) {
  if (!(await rateLimit(env, "adm:" + clientIp(request), 60, 3600)).ok) return json({ error: "Za dużo prób" }, 429, cors);
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
  if (!(await rateLimit(env, "adm:" + clientIp(request), 60, 3600)).ok) return json({ error: "Za dużo prób" }, 429, cors);
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
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS shares (
      share_id TEXT PRIMARY KEY, deck_id TEXT UNIQUE NOT NULL, user_id TEXT NOT NULL,
      created_at INTEGER NOT NULL, views INTEGER NOT NULL DEFAULT 0)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS shares_user ON shares(user_id)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS rate (k TEXT PRIMARY KEY, n INTEGER NOT NULL, exp INTEGER NOT NULL)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS reviews (
      user_id TEXT NOT NULL, deck_id TEXT NOT NULL, ckey TEXT NOT NULL,
      box INTEGER NOT NULL DEFAULT 0, due INTEGER NOT NULL, updated_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, deck_id, ckey))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS answers (
      user_id TEXT NOT NULL, deck_id TEXT NOT NULL, qkey TEXT NOT NULL,
      right_n INTEGER NOT NULL DEFAULT 0, wrong_n INTEGER NOT NULL DEFAULT 0, last_ok INTEGER NOT NULL DEFAULT 1,
      updated_at INTEGER NOT NULL, PRIMARY KEY (user_id, deck_id, qkey))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS usage (
      user_id TEXT NOT NULL, period TEXT NOT NULL, gens INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (user_id, period))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS credits (
      user_id TEXT NOT NULL, period TEXT NOT NULL, used INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (user_id, period))`),
  ]);
  schemaReady = true;
}

/* szybki test po wdrożeniu: otwórz /health w przeglądarce */
async function handleHealth(env, cors) {
  const out = { ok: true, version: 9, ai_key: !!env.ANTHROPIC_API_KEY, kv: !!env.UC_KV, db: false };
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

  const rl = await rateLimit(env, "a:" + clientIp(request), 60, 3600);
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
    env.DB.prepare("DELETE FROM shares WHERE user_id = ?").bind(user.id),
    env.DB.prepare("DELETE FROM answers WHERE user_id = ?").bind(user.id),
    env.DB.prepare("DELETE FROM reviews WHERE user_id = ?").bind(user.id),
    env.DB.prepare("DELETE FROM decks WHERE user_id = ?").bind(user.id),
    env.DB.prepare("DELETE FROM usage WHERE user_id = ?").bind(user.id),
    env.DB.prepare("DELETE FROM credits WHERE user_id = ?").bind(user.id),
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

/* ===================== AI — wspólne ===================== */

/* jedno wywołanie modelu; zwraca tekst odpowiedzi albo rzuca błąd z kodem HTTP do pokazania */
async function callAI(env, { system, content, maxTokens }) {
  let res;
  try {
    res = await fetch(env.AI_URL || "https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens || MAX_TOKENS, system, messages: [{ role: "user", content }] }),
    });
  } catch { throw httpErr(502, "Nie udało się połączyć z AI"); }
  if (!res.ok) throw httpErr(502, "AI error " + res.status, (await res.text()).slice(0, 200));
  const data = await res.json();
  if (data.stop_reason === "max_tokens")
    throw httpErr(502, "Odpowiedź AI była za długa i została ucięta — spróbuj z mniejszą talią albo krótszym materiałem. Kredyty wróciły na konto.");
  return (data.content && data.content[0] && data.content[0].text) || "";
}
function httpErr(status, error, detail) { const e = new Error(error); e.status = status; e.detail = detail; return e; }

function parseJsonLoose(raw) {
  let p = safeParse(raw);
  if (!p) { const m = String(raw).match(/\{[\s\S]*\}/); if (m) p = safeParse(m[0]); }
  return p;
}

const clip = (s, n) => String(s == null ? "" : s).slice(0, n);
function normQuestion(q) {
  if (!q || !Array.isArray(q.options) || q.options.length !== 4) return null;
  const out = { q: clip(q.q || q.question, 600), options: q.options.map(o => clip(o, 300)), correct: clampIndex(q.correct), explain: clip(q.explain || q.explanation, 1200) };
  if (q.more) out.more = clip(q.more, 3000);
  return out.q ? out : null;
}
function normCard(c) {
  if (!c || !(c.term || c.front)) return null;
  const out = { term: clip(c.term || c.front, 200), def: clip(c.def || c.definition || c.back, 1200) };
  if (c.more) out.more = clip(c.more, 3000);
  return out;
}
/* wspólna normalizacja talii (z AI albo od przeglądarki) */
function normalizeDeck(p) {
  return {
    title: cleanTitle(p && p.title),
    flashcards: (Array.isArray(p && p.flashcards) ? p.flashcards : []).map(normCard).filter(Boolean).slice(0, MAX_ITEMS),
    quiz: (Array.isArray(p && p.quiz) ? p.quiz : []).map(normQuestion).filter(Boolean).slice(0, MAX_ITEMS),
  };
}

const OPTION_RULES =
`- Każde pytanie ma DOKŁADNIE 4 opcje; "correct" to indeks 0–3 poprawnej.
- Nie zdradzaj poprawnej odpowiedzi formą: opcje o ZBLIŻONEJ długości, poprawna nie jest najdłuższa ani jedyna z nawiasem/przykładem, pozycję poprawnej mieszaj.
- Dystraktory prawdopodobne, nie absurdalne.`;

/* ===================== KREDYTY ===================== */

function period() { return new Date().toISOString().slice(0, 7); } // "2026-10" (UTC)
function monthlyLimit(env) { const n = parseInt(env.FREE_MONTHLY_CREDITS, 10); return n > 0 ? n : FREE_MONTHLY_CREDITS_DEFAULT; }

async function getUsage(env, user) {
  const row = await env.DB.prepare("SELECT used FROM credits WHERE user_id = ? AND period = ?").bind(user.id, period()).first();
  return { used: row ? row.used : 0, limit: isAdmin(user, env) ? null : monthlyLimit(env), period: period(), costs: COST };
}

/* atomowo: +koszt, ale tylko jeśli zmieści się w limicie (chroni przed wieloma równoległymi żądaniami) */
async function reserveCredits(env, user, cost) {
  const p = period();
  if (isAdmin(user, env)) {
    await env.DB.prepare("INSERT INTO credits (user_id, period, used) VALUES (?, ?, ?) ON CONFLICT(user_id, period) DO UPDATE SET used = used + ?")
      .bind(user.id, p, cost, cost).run();
    return { ok: true };
  }
  const limit = monthlyLimit(env);
  if (cost > limit) return { ok: false, limit };
  const row = await env.DB.prepare(
    "INSERT INTO credits (user_id, period, used) VALUES (?, ?, ?) ON CONFLICT(user_id, period) DO UPDATE SET used = used + ? WHERE used + ? <= ? RETURNING used"
  ).bind(user.id, p, cost, cost, cost, limit).first();
  return row ? { ok: true } : { ok: false, limit };
}

async function releaseCredits(env, user, cost) {
  try {
    await env.DB.prepare("UPDATE credits SET used = MAX(used - ?, 0) WHERE user_id = ? AND period = ?").bind(cost, user.id, period()).run();
  } catch { /* trudno — najwyżej zostanie policzone */ }
}

async function noCredits(env, user, cost, cors) {
  const usage = await getUsage(env, user);
  const left = Math.max(0, (usage.limit || 0) - usage.used);
  return json({ error: `Brakuje kredytów: ta akcja kosztuje ${cost}, a zostało Ci ${left} w tym miesiącu. Limit odnawia się 1. dnia miesiąca.`, limit_reached: true, usage }, 429, cors);
}

/* wykonuje fn() z zarezerwowanymi kredytami; przy błędzie oddaje je */
async function withCredits(env, user, cost, cors, fn) {
  const r = await reserveCredits(env, user, cost);
  if (!r.ok) return await noCredits(env, user, cost, cors);
  try {
    const out = await fn();
    out.usage = await getUsage(env, user);
    return json(out, 200, cors);
  } catch (e) {
    await releaseCredits(env, user, cost);
    return json({ error: e.message || "Błąd", detail: e.detail }, e.status || 500, cors);
  }
}

/* ===================== EDYCJA TALII ===================== */

async function loadOwnDeck(env, user, id) {
  const row = await env.DB.prepare("SELECT id, title, source, data FROM decks WHERE id = ? AND user_id = ?").bind(id, user.id).first();
  if (!row) return null;
  const d = safeParse(row.data) || {};
  return { id: row.id, title: row.title, source: row.source, flashcards: d.flashcards || [], quiz: d.quiz || [] };
}

async function storeDeck(env, user, id, deck) {
  const data = JSON.stringify({ flashcards: deck.flashcards, quiz: deck.quiz });
  if (data.length > MAX_DECK_JSON) throw httpErr(413, "Talia za duża — usuń część fiszek lub pytań");
  await env.DB.batch([
    env.DB.prepare("UPDATE decks SET title = ?, data = ?, fc_count = ?, qz_count = ?, updated_at = ? WHERE id = ? AND user_id = ?")
      .bind(deck.title, data, deck.flashcards.length, deck.quiz.length, Date.now(), id, user.id),
    // odpowiedzi do pytań, których po zmianie już nie ma, przestają się liczyć jako błędy
    env.DB.prepare("DELETE FROM answers WHERE user_id = ? AND deck_id = ? AND qkey NOT IN (SELECT value FROM json_each(?))")
      .bind(user.id, id, JSON.stringify(deck.quiz.map(q => qkey(q.q)))),
    env.DB.prepare("DELETE FROM reviews WHERE user_id = ? AND deck_id = ? AND ckey NOT IN (SELECT value FROM json_each(?))")
      .bind(user.id, id, JSON.stringify(deck.flashcards.map(c => qkey(c.term)))),
  ]);
}

/* klucz pytania = skrót jego treści (ten sam algorytm co w generator.js) — przetrwa przestawienie kolejności pytań */
function qkey(text) {
  let h = 0x811c9dc5;
  const s = String(text || "").trim().toLowerCase();
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}

async function deckAnswers(env, user, id) {
  const { results } = await env.DB.prepare("SELECT qkey, right_n, wrong_n, last_ok FROM answers WHERE user_id = ? AND deck_id = ?").bind(user.id, id).all();
  const out = {};
  for (const r of results || []) out[r.qkey] = { r: r.right_n, w: r.wrong_n, ok: !!r.last_ok };
  return out;
}

/* ===== powtórki fiszek (system pudełek Leitnera) =====
   „Umiem” przesuwa fiszkę do kolejnego pudełka i odsuwa powtórkę: 1 → 3 → 7 → 14 → 30 → 60 dni.
   „Jeszcze nie” cofa ją do pudełka 0 — wraca jeszcze dziś. */
const REVIEW_DAYS = [0, 1, 3, 7, 14, 30, 60];

async function deckReviews(env, user, id) {
  const { results } = await env.DB.prepare("SELECT ckey, box, due FROM reviews WHERE user_id = ? AND deck_id = ?").bind(user.id, id).all();
  const out = {};
  for (const r of results || []) out[r.ckey] = { box: r.box, due: r.due };
  return out;
}

async function handleReview(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  if (!(await rateLimit(env, "w:" + user.id, WRITE_LIMIT_PER_HOUR, 3600)).ok) return json({ error: "Za dużo zapisów — zwolnij na chwilę." }, 429, cors);
  let body; try { body = await request.json(); } catch { return json({ error: "Bad JSON" }, 400, cors); }
  const key = String((body && body.ckey) || "");
  if (!/^[0-9a-f]{8}$/.test(key)) return json({ error: "Zły klucz fiszki" }, 400, cors);
  const own = await env.DB.prepare("SELECT 1 AS x FROM decks WHERE id = ? AND user_id = ?").bind(id, user.id).first();
  if (!own) return json({ error: "Nie ma takiej talii" }, 404, cors);
  const prev = await env.DB.prepare("SELECT box FROM reviews WHERE user_id = ? AND deck_id = ? AND ckey = ?").bind(user.id, id, key).first();
  const now = Date.now();
  const box = body.ok ? Math.min((prev ? prev.box : 0) + 1, REVIEW_DAYS.length - 1) : 0;
  // powtórka w dniu docelowym od rana (−6 h zapasu), a „jeszcze nie” = od razu
  const due = box === 0 ? now : now + REVIEW_DAYS[box] * 86400e3 - 6 * 3600e3;
  await env.DB.prepare(
    "INSERT INTO reviews (user_id, deck_id, ckey, box, due, updated_at) VALUES (?,?,?,?,?,?) " +
    "ON CONFLICT(user_id, deck_id, ckey) DO UPDATE SET box = excluded.box, due = excluded.due, updated_at = excluded.updated_at"
  ).bind(user.id, id, key, box, due, now).run();
  return json({ box, due }, 200, cors);
}

/* POST /decks/:id/answer {qkey, ok} — bez kredytów */
async function handleAnswer(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  if (!(await rateLimit(env, "w:" + user.id, WRITE_LIMIT_PER_HOUR, 3600)).ok) return json({ error: "Za dużo zapisów — zwolnij na chwilę." }, 429, cors);
  let body; try { body = await request.json(); } catch { return json({ error: "Bad JSON" }, 400, cors); }
  const key = String((body && body.qkey) || "");
  if (!/^[0-9a-f]{8}$/.test(key)) return json({ error: "Zły klucz pytania" }, 400, cors);
  const ok = body.ok ? 1 : 0;
  const own = await env.DB.prepare("SELECT 1 AS x FROM decks WHERE id = ? AND user_id = ?").bind(id, user.id).first();
  if (!own) return json({ error: "Nie ma takiej talii" }, 404, cors);
  await env.DB.prepare(
    "INSERT INTO answers (user_id, deck_id, qkey, right_n, wrong_n, last_ok, updated_at) VALUES (?,?,?,?,?,?,?) " +
    "ON CONFLICT(user_id, deck_id, qkey) DO UPDATE SET right_n = right_n + excluded.right_n, wrong_n = wrong_n + excluded.wrong_n, last_ok = excluded.last_ok, updated_at = excluded.updated_at"
  ).bind(user.id, id, key, ok, 1 - ok, ok, Date.now()).run();
  return json({ ok: true }, 200, cors);
}

const deckSummary = (d) => ({ flashcards: d.flashcards.map(({ term, def }) => ({ term, def })),
  quiz: d.quiz.map(({ q, options, correct, explain }) => ({ q, options, correct, explain })) });

/* PUT /decks/:id — zapis talii przysłanej przez przeglądarkę (np. „Cofnij zmianę”), bez AI */
async function handleDeckPut(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  if (!(await rateLimit(env, "w:" + user.id, WRITE_LIMIT_PER_HOUR, 3600)).ok) return json({ error: "Za dużo zapisów — zwolnij na chwilę." }, 429, cors);
  let body; try { body = await request.json(); } catch { return json({ error: "Bad JSON" }, 400, cors); }
  const old = await loadOwnDeck(env, user, id);
  if (!old) return json({ error: "Nie ma takiej talii" }, 404, cors);
  const d = normalizeDeck(body);
  if (!d.flashcards.length && !d.quiz.length) return json({ error: "Pusta talia" }, 400, cors);
  d.title = d.title || old.title;
  try { await storeDeck(env, user, id, d); } catch (e) { return json({ error: e.message }, e.status || 500, cors); }
  return json({ ok: true, deck: { id, ...d } }, 200, cors);
}

/* POST /decks/:id/edit {instruction, material?} — AI przerabia całą talię według polecenia */
async function handleDeckEdit(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Zaloguj się" }, 401, cors);
  let body; try { body = await request.json(); } catch { return json({ error: "Bad JSON" }, 400, cors); }
  const weak = !!(body && body.weak);
  let instr = String((body && body.instruction) || "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, MAX_INSTRUCTION_CHARS);
  if (weak && instr.length < 3) instr = "Dodaj 5 nowych pytań (i 1–3 fiszki, jeśli brakuje pojęć) ćwiczących zagadnienia, w których się mylę.";
  if (instr.length < 3) return json({ error: "Napisz, co zmienić w talii." }, 400, cors);
  const material = typeof body.material === "string" ? body.material.slice(0, MAX_INPUT_CHARS) : "";
  if (!(await limitUserAndIp(env, request, user, "e", EDIT_LIMIT_PER_HOUR)))
    return json({ error: "Za dużo zmian na godzinę — spróbuj za chwilę." }, 429, cors);
  const deck = await loadOwnDeck(env, user, id);
  if (!deck) return json({ error: "Nie ma takiej talii" }, 404, cors);
  if (weak && deck.quiz.length >= MAX_ITEMS)
    return json({ error: `Ta talia ma już ${MAX_ITEMS} pytań (maksimum). Podmień pojedyncze pomylone pytania przyciskiem „Podmień pytanie” albo zrób nową talię.` }, 400, cors);
  let weakBlock = "";
  if (weak) {
    const ans = await deckAnswers(env, user, id);
    const wrongQs = deck.quiz.filter(q => ans[qkey(q.q)] && !ans[qkey(q.q)].ok).slice(0, 10);
    if (!wrongQs.length) return json({ error: "Nie masz teraz żadnych błędów w tej talii — najpierw rozwiąż quiz." }, 400, cors);
    weakBlock = "\nPYTANIA, W KTÓRYCH UŻYTKOWNIK SIĘ POMYLIŁ (ćwicz właśnie te zagadnienia, innymi słowami i z innej strony; nie kopiuj tych pytań):\n" +
      wrongQs.map((q, i) => `${i + 1}. ${q.q} (poprawna: ${q.options[q.correct]})`).join("\n") + "\n";
  }

  return withCredits(env, user, COST.deckEdit, cors, async () => {
    const system = "Jesteś asystentem do nauki. Poprawiasz istniejącą talię fiszek i quizu po polsku według polecenia użytkownika. Odpowiadasz CZYSTYM JSON-em, bez markdownu, bez komentarzy.";
    const content =
`POLECENIE UŻYTKOWNIKA: "${instr.replace(/"/g, "'")}"

AKTUALNA TALIA (tytuł: ${deck.title}):
${JSON.stringify(deckSummary(deck))}
${weakBlock}
${material ? `\nMATERIAŁ ŹRÓDŁOWY (bazuj przede wszystkim na nim):\n"""\n${material}\n"""\n` : ""}
ZASADY:
- Zwróć CAŁĄ talię po zmianach w formacie {"title": "...", "flashcards": [{"term","def"}], "quiz": [{"q","options","correct","explain"}]}.
- Zmieniaj tylko to, czego dotyczy polecenie; resztę zostaw bez zmian.
- Trzymaj się tematów z talii${material ? " i materiału źródłowego" : ""}. Jeśli dodajesz nowe treści, opieraj się na powszechnie przyjętej wiedzy akademickiej — nie wymyślaj konkretnych liczb, dat, nazwisk ani definicji „z wykładu”, których tu nie ma.
- Maksymalnie ${MAX_ITEMS} fiszek i ${MAX_ITEMS} pytań.
- Jeśli polecenie nie dotyczy nauki z tej talii, zwróć talię bez zmian.
${OPTION_RULES}`;
    const raw = await callAI(env, { system, content, maxTokens: EDIT_MAX_TOKENS });
    const parsed = parseJsonLoose(raw);
    const d = normalizeDeck(parsed || {});
    if (!d.flashcards.length && !d.quiz.length) throw httpErr(502, "AI zwróciło nieprawidłowy format — spróbuj inaczej sformułować polecenie");
    d.title = d.title || deck.title;
    // wyjaśnienia kupione wcześniej (1 kr. każde) przenosimy na niezmienione fiszki/pytania;
    // bierzemy świeży stan z bazy, żeby nie zgubić wyjaśnienia dokupionego w trakcie edycji
    const fresh = (await loadOwnDeck(env, user, id)) || deck;
    const fcMore = {}, qzMore = {};
    fresh.flashcards.forEach(c => { if (c.more) fcMore[qkey(c.term)] = c.more; });
    fresh.quiz.forEach(q => { if (q.more) qzMore[qkey(q.q)] = q.more; });
    d.flashcards.forEach(c => { const m = fcMore[qkey(c.term)]; if (m && !c.more) c.more = m; });
    d.quiz.forEach(q => { const m = qzMore[qkey(q.q)]; if (m && !q.more) q.more = m; });
    await storeDeck(env, user, id, d);
    return { deck: { id, ...d } };
  });
}

/* POST /decks/:id/item {kind:"fc"|"qz", index, action:"explain"|"replace"} — akcja na jednej fiszce/pytaniu */
async function handleDeckItem(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Zaloguj się" }, 401, cors);
  let body; try { body = await request.json(); } catch { return json({ error: "Bad JSON" }, 400, cors); }
  const { kind, action } = body || {};
  const index = parseInt(body && body.index, 10);
  if (!["fc", "qz"].includes(kind) || !["explain", "replace"].includes(action) || !(index >= 0)) return json({ error: "Złe parametry" }, 400, cors);
  if (kind === "fc" && action === "replace") return json({ error: "Złe parametry" }, 400, cors);
  if (!(await limitUserAndIp(env, request, user, "e", EDIT_LIMIT_PER_HOUR)))
    return json({ error: "Za dużo akcji na godzinę — spróbuj za chwilę." }, 429, cors);
  const deck = await loadOwnDeck(env, user, id);
  if (!deck) return json({ error: "Nie ma takiej talii" }, 404, cors);
  const list = kind === "fc" ? deck.flashcards : deck.quiz;
  const item = list[index];
  if (!item) return json({ error: "Nie ma takiego elementu — odśwież talię" }, 404, cors);

  // wyjaśnienie już jest zapisane — oddajemy za darmo
  if (action === "explain" && item.more) return json({ item, index, kind, cached: true, usage: await getUsage(env, user) }, 200, cors);

  return withCredits(env, user, COST.item, cors, async () => {
    const ctx = `Talia: ${deck.title}. Pojęcia w talii: ${deck.flashcards.map(c => c.term).slice(0, 30).join(", ")}.`;
    if (action === "explain") {
      const system = "Jesteś cierpliwym korepetytorem. Tłumaczysz po polsku, prostym językiem, bez markdownu (bez gwiazdek, nagłówków i list z myślnikami). Piszesz 4–7 zdań, z jednym konkretnym przykładem.";
      const content = kind === "fc"
        ? `${ctx}\nWyjaśnij szerzej pojęcie „${item.term}”. Definicja z talii: „${item.def}”. Pokaż, o co w nim chodzi i jak je zapamiętać.`
        : `${ctx}\nPytanie: „${item.q}”\nOpcje: ${item.options.map((o, i) => `${"ABCD"[i]}) ${o}`).join("; ")}\nPoprawna: ${"ABCD"[item.correct]}.\nWyjaśnij, dlaczego poprawna odpowiedź jest dobra i krótko, dlaczego każda z pozostałych jest błędna.`;
      const text = (await callAI(env, { system, content, maxTokens: 700 })).replace(/[*#`]+/g, "").trim();
      if (!text) throw httpErr(502, "AI nie zwróciło wyjaśnienia");
      item.more = clip(text, 3000);
    } else {
      const system = "Jesteś asystentem do nauki. Układasz pytania testowe po polsku. Odpowiadasz CZYSTYM JSON-em, bez markdownu.";
      const content =
`${ctx}
Zastąp to pytanie NOWYM, sprawdzającym to samo zagadnienie w inny sposób (inne sformułowanie, inne dystraktory):
${JSON.stringify({ q: item.q, options: item.options, correct: item.correct })}
Zwróć {"q": "...", "options": ["A","B","C","D"], "correct": 0, "explain": "krótkie uzasadnienie"}.
${OPTION_RULES}
- Nie wymyślaj konkretnych liczb, dat ani nazwisk, których nie ma w pytaniu lub talii.`;
      const q = normQuestion(parseJsonLoose(await callAI(env, { system, content, maxTokens: 700 })));
      if (!q) throw httpErr(502, "AI zwróciło nieprawidłowe pytanie — spróbuj jeszcze raz");
      list[index] = q;
    }
    await storeDeck(env, user, id, deck);
    return { item: list[index], index, kind };
  });
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
    "SELECT d.id, d.title, d.source, d.fc_count AS fc, d.qz_count AS qz, d.created_at, s.share_id, s.views, " +
    "(SELECT COUNT(*) FROM answers a WHERE a.user_id = d.user_id AND a.deck_id = d.id AND a.last_ok = 0) AS mistakes, " +
    "(SELECT COUNT(*) FROM reviews r WHERE r.user_id = d.user_id AND r.deck_id = d.id AND r.due <= ?) AS due, " +
    "(SELECT COUNT(*) FROM reviews r WHERE r.user_id = d.user_id AND r.deck_id = d.id) AS seen " +
    "FROM decks d LEFT JOIN shares s ON s.deck_id = d.id WHERE d.user_id = ? ORDER BY d.created_at DESC LIMIT 300"
  ).bind(Date.now(), user.id).all();
  return json({ decks: results || [] }, 200, cors);
}

async function handleDeckGet(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  const row = await env.DB.prepare(
    "SELECT d.id, d.title, d.source, d.instruction, d.data, d.created_at, s.share_id, s.views FROM decks d LEFT JOIN shares s ON s.deck_id = d.id WHERE d.id = ? AND d.user_id = ?"
  ).bind(id, user.id).first();
  if (!row) return json({ error: "Nie ma takiej talii" }, 404, cors);
  const data = safeParse(row.data) || {};
  return json({ id: row.id, title: row.title, source: row.source, instruction: row.instruction, created_at: row.created_at,
    share_id: row.share_id || null, views: row.views || 0, flashcards: data.flashcards || [], quiz: data.quiz || [],
    answers: await deckAnswers(env, user, id), reviews: await deckReviews(env, user, id), now: Date.now() }, 200, cors);
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
  await env.DB.batch([
    env.DB.prepare("DELETE FROM shares WHERE deck_id = ? AND user_id = ?").bind(id, user.id),
    env.DB.prepare("DELETE FROM answers WHERE deck_id = ? AND user_id = ?").bind(id, user.id),
    env.DB.prepare("DELETE FROM reviews WHERE deck_id = ? AND user_id = ?").bind(id, user.id),
    env.DB.prepare("DELETE FROM decks WHERE id = ? AND user_id = ?").bind(id, user.id),
  ]);
  return json({ ok: true }, 200, cors);
}

/* ===================== UDOSTĘPNIANIE ===================== */

function newShareId() {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"; // bez 0/O/1/l/I
  const b = new Uint8Array(10); crypto.getRandomValues(b);
  return [...b].map(x => abc[x % abc.length]).join("");
}

async function handleShareCreate(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  const deck = await env.DB.prepare("SELECT id FROM decks WHERE id = ? AND user_id = ?").bind(id, user.id).first();
  if (!deck) return json({ error: "Nie ma takiej talii" }, 404, cors);
  const ex = await env.DB.prepare("SELECT share_id, views FROM shares WHERE deck_id = ?").bind(id).first();
  if (ex) return json({ share_id: ex.share_id, views: ex.views }, 200, cors);
  await env.DB.prepare("INSERT INTO shares (share_id, deck_id, user_id, created_at) VALUES (?,?,?,?) ON CONFLICT(deck_id) DO NOTHING")
    .bind(newShareId(), id, user.id, Date.now()).run();
  const sh = await env.DB.prepare("SELECT share_id, views FROM shares WHERE deck_id = ?").bind(id).first();
  return json({ share_id: sh.share_id, views: sh.views }, 200, cors);
}

async function handleShareDelete(request, env, cors, id) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Niezalogowany" }, 401, cors);
  await env.DB.prepare("DELETE FROM shares WHERE deck_id = ? AND user_id = ?").bind(id, user.id).run();
  return json({ ok: true }, 200, cors);
}

async function sharedDeck(env, sid) {
  await ensureSchema(env);
  return await env.DB.prepare(
    "SELECT s.share_id, s.user_id, d.id AS deck_id, d.title, d.data, d.updated_at FROM shares s JOIN decks d ON d.id = s.deck_id WHERE s.share_id = ?"
  ).bind(sid).first();
}

/* publiczny podgląd — bez logowania; nie zdradza autora ani jego maila */
async function handleSharedGet(env, cors, sid) {
  if (!env.DB) return json({ error: "Niedostępne" }, 503, cors);
  const row = await sharedDeck(env, sid);
  if (!row) return json({ error: "Ten link wygasł albo autor wyłączył udostępnianie." }, 404, cors);
  try { await env.DB.prepare("UPDATE shares SET views = views + 1 WHERE share_id = ?").bind(sid).run(); } catch {}
  const d = safeParse(row.data) || {};
  return json({ title: row.title, updated_at: row.updated_at, flashcards: d.flashcards || [], quiz: d.quiz || [] },
    200, { ...cors, "Cache-Control": "public, max-age=30" });
}

/* „Zapisz u siebie” — kopia udostępnionej talii na koncie zalogowanego (bez kredytów) */
async function handleSharedCopy(request, env, cors, sid) {
  const user = env.DB ? await authUser(request, env) : null;
  if (!user) return json({ error: "Zaloguj się, żeby zapisać talię u siebie.", need_login: true }, 401, cors);
  const row = await sharedDeck(env, sid);
  if (!row) return json({ error: "Ten link wygasł albo autor wyłączył udostępnianie." }, 404, cors);
  if (row.user_id === user.id) return json({ deck: { id: row.deck_id, title: row.title }, own: true }, 200, cors);
  const d = normalizeDeck({ ...(safeParse(row.data) || {}), title: row.title });
  try {
    const deck = await saveDeck(env, user, { title: d.title || "Talia od znajomego", source: "share", instruction: "", flashcards: d.flashcards, quiz: d.quiz });
    return json({ deck }, 200, cors);
  } catch (e) { return json({ error: "Nie udało się zapisać talii (" + (e.message || "błąd") + ")" }, 400, cors); }
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
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function clientIp(request) {
  const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
  // IPv6: jedno urządzenie łatwo zmienia końcówkę adresu — liczymy całą sieć /64
  return ip.includes(":") ? ip.split(":").slice(0, 4).join(":") + "::/64" : ip;
}

/* limit na konto (dokładny) + na IP (luźniejszy, bo wiele osób może mieć to samo IP) */
async function limitUserAndIp(env, request, user, kind, perUser) {
  const u = await rateLimit(env, kind + "u:" + user.id, perUser, 3600);
  if (!u.ok) return false;
  const i = await rateLimit(env, kind + "i:" + clientIp(request), perUser * IP_LIMIT_FACTOR, 3600);
  return i.ok;
}

/* licznik limitu w oknie ttl sekund.
   W bazie D1 (ok. 100 tys. zapisów/dzień za darmo, atomowo); KV tylko awaryjnie, bo darmowe KV ma ok. 1000 zapisów/dzień. */
async function rateLimit(env, key, limit, ttl) {
  const bucket = Math.floor(Date.now() / (ttl * 1000));
  const k = key + ":" + bucket;
  if (env.DB) {
    try {
      await ensureSchema(env);
      const row = await env.DB.prepare(
        "INSERT INTO rate (k, n, exp) VALUES (?, 1, ?) ON CONFLICT(k) DO UPDATE SET n = n + 1 WHERE n < ? RETURNING n"
      ).bind(k, (bucket + 1) * ttl * 1000, limit).first();
      if (Math.random() < 0.02) await env.DB.prepare("DELETE FROM rate WHERE exp < ?").bind(Date.now()).run(); // sprzątanie
      return { ok: !!row };
    } catch { return { ok: true }; } // awaria licznika nie może blokować użytkowników
  }
  const kk = "rl:" + k;
  const n = parseInt(await env.UC_KV.get(kk), 10) || 0;
  if (n >= limit) return { ok: false };
  await env.UC_KV.put(kk, String(n + 1), { expirationTtl: ttl + 60 });
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
