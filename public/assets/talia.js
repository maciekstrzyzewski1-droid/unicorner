/* Unicorner — podgląd talii udostępnionej linkiem (talia.html?s=ID). Bez logowania, bez kredytów. */
(function(){
const API = window.UC_API || "https://red-queen-3002.unicorner.workers.dev";
const $ = id => document.getElementById(id);
const sid = new URLSearchParams(location.search).get("s") || "";
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
function plural(n,one,few,many){ if(n===1) return one; const d=n%10, h=n%100; return (d>=2&&d<=4&&(h<10||h>=20)) ? few : many; }
let deck = null, score = { ok:0, done:0, total:0 };

function fail(msg){ $("tLoading").hidden = true; $("tErr").hidden = false; if(msg) $("tErrMsg").textContent = msg; }

async function load(){
  if(!/^[A-Za-z0-9]{6,20}$/.test(sid)) return fail("W linku brakuje identyfikatora talii.");
  let r, data = {};
  try{ r = await fetch(API + "/s/" + sid); data = await r.json(); }
  catch{ return fail("Nie udało się połączyć z serwerem — spróbuj za chwilę."); }
  if(!r.ok) return fail(data.error);
  deck = data;
  document.title = (deck.title || "Talia") + " · Unicorner";
  $("tTitle").textContent = deck.title || "Talia";
  const fc = deck.flashcards.length, qz = deck.quiz.length;
  $("tMeta").textContent = fc + " " + plural(fc,"fiszka","fiszki","fiszek") + " · " + qz + " " + plural(qz,"pytanie","pytania","pytań");
  $("tSave").href = "/generator.html?zapisz=" + encodeURIComponent(sid);
  renderCards(); renderQuiz();
  $("tLoading").hidden = true; $("tDeck").hidden = false;
}

function renderCards(){
  const grid = $("fcGrid"); grid.innerHTML = "";
  deck.flashcards.forEach(c => {
    const el = document.createElement("div"); el.className = "g-fc"; el.tabIndex = 0; el.setAttribute("role","button");
    el.innerHTML = `<div class="g-fc-in"><div class="g-face g-front">${esc(c.term)}</div><div class="g-face g-back"><span>${esc(c.def)}</span></div></div>`;
    el.addEventListener("click", () => el.classList.toggle("flip"));
    el.addEventListener("keydown", e => { if(e.key==="Enter"||e.key===" "){ e.preventDefault(); el.classList.toggle("flip"); } });
    grid.appendChild(el);
  });
  $("fcCount").textContent = deck.flashcards.length;
}

function updScore(){
  $("scoreVal").textContent = score.ok + " / " + score.total;
  $("scoreBar").style.width = (score.total ? score.ok/score.total*100 : 0) + "%";
}

function renderQuiz(){
  const list = $("qzList"); list.innerHTML = "";
  score = { ok:0, done:0, total:deck.quiz.length }; updScore();
  deck.quiz.forEach((q, i) => {
    const order = q.options.map((_, k) => k).sort(() => Math.random() - 0.5);
    const card = document.createElement("div"); card.className = "g-q";
    const more = q.more ? `<div class="g-more" hidden>${String(q.more).split(/\n+/).map(p=>"<p>"+esc(p)+"</p>").join("")}</div><div class="g-qacts" hidden><button class="g-mini" type="button">Pokaż wyjaśnienie</button></div>` : "";
    card.innerHTML = `<div class="g-qno">Pytanie ${i+1} / ${deck.quiz.length}</div><div class="g-qt">${esc(q.q)}</div><div class="opts"></div><div class="g-exp">${esc(q.explain)}</div>${more}`;
    const box = card.querySelector(".opts"), exp = card.querySelector(".g-exp");
    order.forEach(k => {
      const b = document.createElement("button"); b.className = "g-opt"; b.type = "button"; b.textContent = q.options[k];
      b.addEventListener("click", () => {
        box.querySelectorAll(".g-opt").forEach(x => x.disabled = true);
        if(k === q.correct){ b.classList.add("correct"); score.ok++; }
        else { b.classList.add("wrong"); box.children[order.indexOf(q.correct)].classList.add("correct"); }
        score.done++; updScore();
        if(exp.textContent.trim()) exp.classList.add("show");
        const acts = card.querySelector(".g-qacts");
        if(acts){ acts.hidden = false; acts.firstChild.onclick = () => { const m = card.querySelector(".g-more"); m.hidden = !m.hidden; }; }
      });
      box.appendChild(b);
    });
    list.appendChild(card);
  });
  $("qzCount").textContent = deck.quiz.length;
}

function showPane(p){
  document.querySelectorAll(".g-tab").forEach(x => x.classList.toggle("on", x.dataset.pane === p));
  document.querySelectorAll(".g-pane").forEach(x => x.classList.toggle("on", x.id === "pane-" + p));
  $("score").style.visibility = p === "qz" ? "visible" : "hidden";
}
document.querySelectorAll(".g-tab").forEach(t => t.addEventListener("click", () => showPane(t.dataset.pane)));
$("quizAgain").addEventListener("click", () => { if(deck) renderQuiz(); });
showPane("fc");
load();
})();
