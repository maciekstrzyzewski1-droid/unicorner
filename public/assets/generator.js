/* Unicorner — Generator AI (logika strony generator.html)
   Materiał: PDF (tekst wyciągany w przeglądarce), zdjęcia notatek (kompresja w przeglądarce) albo wklejony tekst.
   Wysyłka do Cloudflare Workera, który woła model AI i zwraca {flashcards, quiz}. */
(function(){
const API = window.UC_API || "https://red-queen-3002.unicorner.workers.dev";
const GOOGLE_CLIENT_ID = window.UC_GCID || "243769752280-r6h2cj3pn9n47p020seuk58n9ijj9si7.apps.googleusercontent.com";
const MAX_CHARS = 14000;   // limit długości tekstu wysyłanego do AI (kontrola kosztu)
const MIN_CHARS = 300;
const MAX_PHOTOS = 4;
const MAX_INSTR = 300;
const STORE_KEY = "uc_gen_last";

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

const $ = id => document.getElementById(id);
const drop=$("drop"), fileInput=$("file"), pasted=$("pasted"), instr=$("instr");
const genBtn=$("gen"), resetBtn=$("reset"), statusEl=$("status");
let mode="pdf", pickedPdf=null, pickedImages=[], lastResult=null;

const ls = {
  get(k){ try{ return localStorage.getItem(k); }catch{ return null; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch{} },
  del(k){ try{ localStorage.removeItem(k); }catch{} },
};

/* ---------- konto ---------- */
let token = ls.get("uc_token"), me = null, usage = null, decks = [], currentDeckId = null, currentShareId = null;
const pendingImport = new URLSearchParams(location.search).get("zapisz");

async function api(path, opts={}){
  const headers = {};
  if(opts.body) headers["Content-Type"]="application/json";
  if(token) headers["Authorization"]="Bearer "+token;
  let r;
  try{ r = await fetch(API+path, { method: opts.method||"GET", headers, body: opts.body ? JSON.stringify(opts.body) : undefined }); }
  catch(e){ return { ok:false, status:0, data:{ error:"Brak połączenia z serwerem." } }; }
  let data=null; try{ data=await r.json(); }catch{}
  if(r.status===401 && token && path!=="/auth/google"){ setSession(null); }
  return { ok:r.ok, status:r.status, data:data||{} };
}

function setSession(t, user, u){
  token = t || null; me = t ? user : null; usage = t ? u : null;
  if(t) ls.set("uc_token", t); else { ls.del("uc_token"); decks=[]; currentDeckId=null; currentShareId=null; prevDeck=null; $("editPanel").hidden=true; if($("shareBtn")){ $("shareBtn").hidden=true; $("shareBox").hidden=true; } if($("qMode")) $("qMode").hidden=true; answers={}; quizMode="all"; reviews={}; if($("studyBar")) $("studyBar").hidden=true; }
  renderAccount(); refreshBtn();
}

function renderAccount(){
  $("acctOut").hidden = !!me;
  $("acctIn").hidden = !me;
  $("decksSec").hidden = !me;
  if(!me) return;
  $("meName").textContent = me.name || me.email || "Twoje konto";
  const av=$("meAvatar"); if(me.picture){ av.src=me.picture; av.hidden=false; } else av.hidden=true;
  renderUsage();
}
const COSTS = { generate:3, deckEdit:2, item:1 };
let answers = {}, quizMode = "all";
/* klucz pytania = skrót treści (ten sam algorytm co w workerze) */
function qkey(text){ let h=0x811c9dc5; const s=String(text||"").trim().toLowerCase(); for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0; } return h.toString(16).padStart(8,"0"); }
function isBad(q){ const a=answers[qkey(q.q)]; return !!(a && !a.ok); }
function badCount(){ return lastResult && Array.isArray(lastResult.quiz) ? lastResult.quiz.filter(isBad).length : 0; }
let lastSourceText = "", prevDeck = null;
function costs(){ return (usage && usage.costs) || COSTS; }
function creditsLeft(){ if(!usage) return 0; if(usage.limit==null) return Infinity; return Math.max(0, usage.limit-usage.used); }
function canEdit(){ return !!(me && currentDeckId); }
function setUsage(u){ if(u){ usage=u; renderUsage(); refreshBtn(); } }

function renderUsage(){
  if(!usage) return;
  const bar=$("meBar");
  if(usage.limit==null){ $("meUsage").textContent = "Bez limitu · zużyte w tym miesiącu: "+usage.used+" kr."; bar.style.width="0"; return; }
  const left=Math.max(0, usage.limit-usage.used);
  $("meUsage").textContent = "Zostało "+left+" z "+usage.limit+" kredytów w tym miesiącu";
  bar.style.width = Math.min(100, usage.used/usage.limit*100)+"%";
  bar.classList.toggle("full", left===0);
}

async function onGoogleCredential(resp){
  setStatus("Loguję…","info");
  const r = await api("/auth/google", { method:"POST", body:{ credential: resp.credential } });
  if(!r.ok){ setStatus(r.data.error ? r.data.error+(r.data.detail?" ("+r.data.detail+")":"") : "Logowanie nieudane.","err"); return; }
  setSession(r.data.token, r.data.user, r.data.usage);
  clearStatus();
  await loadDecks();
  runImport();
}

function initGoogle(tries){
  const box=$("gsiBtn");
  if(GOOGLE_CLIENT_ID.startsWith("WSTAW")){ box.innerHTML='<span class="soon">Logowanie uruchamiamy lada dzień.</span>'; return; }
  if(!(window.google && google.accounts && google.accounts.id)){
    if((tries||0) < 50) return setTimeout(()=>initGoogle((tries||0)+1), 200);
    box.innerHTML='<span class="soon">Nie udało się wczytać logowania Google — wyłącz blokowanie skryptów albo odśwież stronę.</span>'; return;
  }
  google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onGoogleCredential, auto_select:false, cancel_on_tap_outside:true, use_fedcm_for_button:true });
  google.accounts.id.renderButton(box, { theme:"filled_black", size:"large", shape:"pill", text:"signin_with", locale:"pl", width: Math.min(300, box.clientWidth||300) });
}

$("logout").addEventListener("click", async ()=>{
  await api("/auth/logout", { method:"POST" });
  setSession(null);
  if(window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect();
});

/* ---------- moje talie ---------- */
function plural(n,one,few,many){ if(n===1) return one; const d=n%10, h=n%100; return (d>=2&&d<=4&&(h<10||h>=20)) ? few : many; }
const SRC_LABEL = { pdf:"PDF", img:"Zdjęcia", txt:"Tekst", share:"Od znajomego" };
function fmtDate(ts){ const d=new Date(ts); return d.toLocaleDateString("pl-PL",{day:"numeric",month:"short"})+", "+d.toLocaleTimeString("pl-PL",{hour:"2-digit",minute:"2-digit"}); }

async function loadDecks(){
  if(!me) return;
  const r = await api("/decks");
  if(r.ok){ decks = r.data.decks || []; renderDecks(); }
}
function renderDecks(){
  const grid=$("deckGrid"); grid.innerHTML="";
  const dueAll = decks.reduce((a,d)=>a+(d.due||0),0);
  $("decksCount").textContent = decks.length ? decks.length+" "+plural(decks.length,"talia","talie","talii") + (dueAll ? " · dziś do powtórki: "+dueAll+" "+plural(dueAll,"fiszka","fiszki","fiszek") : "") : "";
  $("decksEmpty").hidden = decks.length>0;
  decks.forEach(d=>{
    const el=document.createElement("div"); el.className="g-deck"+(d.id===currentDeckId?" cur":""); el.tabIndex=0; el.setAttribute("role","button");
    el.innerHTML=`<div class="t">${esc(d.title)}</div><div class="m"><span class="src">${SRC_LABEL[d.source]||"Materiał"}</span><span>${d.fc} ${plural(d.fc,"fiszka","fiszki","fiszek")} · ${d.qz} ${plural(d.qz,"pytanie","pytania","pytań")}</span><span>${fmtDate(d.created_at)}</span>${d.due ? `<span class="due">${d.due} ${plural(d.due,"fiszka","fiszki","fiszek")} do powtórki</span>` : ""}${d.mistakes ? `<span class="bad">${d.mistakes} ${plural(d.mistakes,"błąd","błędy","błędów")} do powtórki</span>` : ""}${d.share_id ? `<span class="shr">udostępniona · ${d.views||0} ${plural(d.views||0,"wyświetlenie","wyświetlenia","wyświetleń")}</span>` : ""}</div><div class="acts"><button type="button" data-a="ren">Zmień nazwę</button><button type="button" data-a="del">Usuń</button></div>`;
    el.addEventListener("click", e=>{ if(e.target.closest(".acts")||e.target.tagName==="INPUT") return; openDeck(d.id); });
    el.addEventListener("keydown", e=>{ if(e.key==="Enter" && e.target===el) openDeck(d.id); });
    el.querySelector('[data-a="ren"]').addEventListener("click", ()=>startRename(el, d));
    const del=el.querySelector('[data-a="del"]');
    del.addEventListener("click", async ()=>{
      if(!del.classList.contains("sure")){ del.classList.add("sure"); del.textContent="Na pewno?"; setTimeout(()=>{ del.classList.remove("sure"); del.textContent="Usuń"; },3000); return; }
      const r=await api("/decks/"+d.id,{method:"DELETE"});
      if(r.ok){ decks=decks.filter(x=>x.id!==d.id); if(currentDeckId===d.id){ currentDeckId=null; $("deckMeta").textContent=""; } renderDecks(); }
    });
    grid.appendChild(el);
  });
}
function startRename(el, d){
  const t=el.querySelector(".t"); const inp=document.createElement("input"); inp.value=d.title; inp.maxLength=80;
  t.replaceWith(inp); inp.focus(); inp.select();
  let done=false;
  const finish=async(save)=>{
    if(done) return; done=true;
    const v=inp.value.trim();
    if(save && v && v!==d.title){
      const r=await api("/decks/"+d.id,{method:"PATCH",body:{title:v}});
      if(r.ok){ d.title=r.data.title; if(currentDeckId===d.id) $("deckTitle").textContent=d.title; }
    }
    renderDecks();
  };
  inp.addEventListener("keydown", e=>{ if(e.key==="Enter") finish(true); if(e.key==="Escape") finish(false); });
  inp.addEventListener("blur", ()=>finish(true));
}
async function openDeck(id, quiet){
  setStatus("Wczytuję talię…","info");
  const r=await api("/decks/"+id);
  if(!r.ok){ setStatus(r.data.error||"Nie udało się wczytać talii.","err"); return; }
  clearStatus(); currentDeckId=id; currentShareId=r.data.share_id||null; prevDeck=null; lastSourceText="";
  lastResult={ title:r.data.title, flashcards:r.data.flashcards, quiz:r.data.quiz };
  answers = r.data.answers || {}; quizMode = "all";
  reviews = r.data.reviews || {}; clockSkew = (r.data.now || Date.now()) - Date.now();
  render(lastResult, !quiet, true); renderDecks();
}

const delAcc=$("delAccount");
delAcc.addEventListener("click", async ()=>{
  if(!delAcc.classList.contains("sure")){ delAcc.classList.add("sure"); delAcc.textContent="Kliknij jeszcze raz — usuniemy konto i wszystkie talie na zawsze"; setTimeout(()=>{ delAcc.classList.remove("sure"); delAcc.textContent="Usuń konto i wszystkie talie"; },5000); return; }
  const r=await api("/me",{method:"DELETE"});
  if(r.ok){ setSession(null); setStatus("Konto i wszystkie talie zostały usunięte.","info"); }
  else setStatus(r.data.error||"Nie udało się usunąć konta.","err");
});

/* ---------- status i postęp ---------- */
function setStatus(msg, kind){ statusEl.className="g-status "+(kind||""); statusEl.textContent=msg; }
function clearStatus(){ statusEl.className="g-status"; statusEl.textContent=""; }
function progress(step){ // step: -1 = ukryj, 0..2 = etap
  const box=$("progress");
  if(step<0){ box.hidden=true; return; }
  box.hidden=false;
  box.querySelectorAll("li").forEach(li=>{ const s=+li.dataset.s; li.className = s<step ? "done" : s===step ? "on" : ""; });
}
let stepTimer=null;

/* ---------- wybór źródła ---------- */
const DROP_TXT = {
  pdf: ["Przeciągnij PDF tutaj","albo kliknij, żeby wybrać · jeden plik, mniej więcej jeden wykład","application/pdf,.pdf",false],
  img: ["Przeciągnij zdjęcia notatek tutaj","albo kliknij · do 4 zdjęć naraz, także pismo odręczne","image/*",true],
};
function setMode(m){
  mode=m;
  document.querySelectorAll(".g-seg button").forEach(b=>{ const on=b.dataset.src===m; b.classList.toggle("on",on); b.setAttribute("aria-selected",on); });
  $("srcFile").hidden = m==="txt";
  $("srcText").hidden = m!=="txt";
  if(m!=="txt"){
    const [big,small,accept,multi]=DROP_TXT[m];
    fileInput.accept=accept; fileInput.multiple=multi;
    if(!(m==="pdf"?pickedPdf:pickedImages.length)){ $("dropBig").textContent=big; drop.classList.remove("has"); }
    $("dropSmall").textContent=small;
    $("filechip").style.display = (m==="pdf" && pickedPdf) ? "flex" : "none";
    $("thumbs").style.display = m==="img" ? "flex" : "none";
    if(m==="pdf" && pickedPdf){ $("dropBig").textContent="Plik gotowy"; drop.classList.add("has"); }
    if(m==="img" && pickedImages.length){ $("dropBig").textContent=pickedImages.length+" zdj. gotowe — możesz dorzucić kolejne"; drop.classList.add("has"); }
  }
  clearStatus(); refreshBtn();
}
document.querySelectorAll(".g-seg button").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.src)));

function hasMaterial(){
  if(mode==="pdf") return !!pickedPdf;
  if(mode==="img") return pickedImages.length>0;
  return pasted.value.trim().length>=MIN_CHARS;
}
function refreshBtn(){
  const noLeft = usage && creditsLeft() < costs().generate;
  $("genLabel").textContent = !me ? "Najpierw się zaloguj" : noLeft ? "Za mało kredytów" : "Generuj fiszki i quiz";
  $("genCost").textContent = costs().generate+" kr.";
  $("genCost").hidden = !me || noLeft;
  genBtn.disabled = !(me && !noLeft && hasMaterial());
  resetBtn.hidden = !(pickedPdf || pickedImages.length || pasted.value.trim() || lastResult);
}
pasted.addEventListener("input", ()=>{ $("pastedCount").textContent=pasted.value.length.toLocaleString("pl-PL"); refreshBtn(); });

/* ---------- instrukcja + szybkie podpowiedzi ---------- */
function bindChips(boxSel, field){
  const btns=document.querySelectorAll(boxSel+" button");
  btns.forEach(b=>{
    b.addEventListener("click",()=>{
      const t=b.dataset.t; let v=field.value.trim();
      if(v.includes(t)){ v=v.replace(t,"").replace(/\s{2,}/g," ").trim(); b.classList.remove("on"); }
      else { v=(v?v+" ":"")+t; b.classList.add("on"); }
      field.value=v.slice(0,MAX_INSTR);
    });
  });
  field.addEventListener("input",()=>{ btns.forEach(b=>b.classList.toggle("on", field.value.includes(b.dataset.t))); });
}
bindChips("#chips", instr);

/* ---------- pliki ---------- */
drop.addEventListener("click", ()=>fileInput.click());
drop.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); fileInput.click(); } });
drop.addEventListener("dragover", e=>{e.preventDefault();drop.classList.add("over");});
drop.addEventListener("dragleave", ()=>drop.classList.remove("over"));
drop.addEventListener("drop", e=>{ e.preventDefault(); drop.classList.remove("over"); if(e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); });
fileInput.addEventListener("change", e=>{ if(e.target.files.length) handleFiles(e.target.files); fileInput.value=""; });

function handleFiles(list){
  const files=[...list];
  const pdf = files.find(f=>f.type==="application/pdf"||f.name.toLowerCase().endsWith(".pdf"));
  const imgs = files.filter(f=>f.type.startsWith("image/"));
  if(pdf){
    pickedPdf=pdf; $("filename").textContent=pdf.name;
    if(mode!=="pdf") setMode("pdf"); else setMode("pdf");
  } else if(imgs.length){
    const before=pickedImages.length;
    pickedImages=pickedImages.concat(imgs).slice(0,MAX_PHOTOS);
    renderThumbs(); setMode("img");
    if(before+imgs.length>MAX_PHOTOS) setStatus("Maksymalnie "+MAX_PHOTOS+" zdjęcia naraz — nadmiar pominięty.","err");
  } else {
    setStatus("Obsługujemy PDF-y i zdjęcia (JPG/PNG).","err"); return;
  }
  refreshBtn();
}

function renderThumbs(){
  const box=$("thumbs"); box.innerHTML="";
  pickedImages.forEach((f,i)=>{
    const t=document.createElement("div"); t.className="g-thumb";
    const img=document.createElement("img"); img.alt="zdjęcie notatki "+(i+1);
    img.src=URL.createObjectURL(f); img.onload=()=>URL.revokeObjectURL(img.src);
    const rm=document.createElement("button"); rm.type="button"; rm.textContent="✕"; rm.setAttribute("aria-label","Usuń zdjęcie "+(i+1));
    rm.addEventListener("click",()=>{ pickedImages.splice(i,1); renderThumbs(); setMode("img"); });
    t.appendChild(img); t.appendChild(rm); box.appendChild(t);
  });
}

/* zmniejszenie zdjęcia po stronie przeglądarki — mniejsze koszty i szybsza wysyłka */
async function compressImage(file){
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1400/Math.max(bmp.width,bmp.height));
  const c = document.createElement("canvas");
  c.width=Math.max(1,Math.round(bmp.width*scale)); c.height=Math.max(1,Math.round(bmp.height*scale));
  c.getContext("2d").drawImage(bmp,0,0,c.width,c.height);
  let q=0.82, blob;
  do{ blob = await new Promise(res=>c.toBlob(res,"image/jpeg",q)); q-=0.12; }
  while(blob && blob.size>290000 && q>0.4);
  if(!blob) throw new Error("Nie udało się przetworzyć zdjęcia");
  const b64 = await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=()=>rej(new Error("Błąd odczytu")); r.readAsDataURL(blob); });
  return { media_type:"image/jpeg", data:b64 };
}

async function extractText(file){
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({data:buf}).promise;
  let text="";
  for(let p=1;p<=pdf.numPages;p++){
    const page=await pdf.getPage(p);
    const content=await page.getTextContent();
    text += content.items.map(i=>i.str).join(" ")+"\n";
    if(text.length>MAX_CHARS+2000) break;
  }
  return text.replace(/\s+\n/g,"\n").trim();
}

resetBtn.addEventListener("click", ()=>{
  pickedPdf=null; pickedImages=[]; renderThumbs(); pasted.value=""; $("pastedCount").textContent="0";
  $("result").hidden=true; $("fcGrid").innerHTML=""; $("qzList").innerHTML=""; lastResult=null;
  setMode(mode); clearStatus();
});

/* ---------- generowanie ---------- */
function fail(msg){ clearInterval(stepTimer); progress(-1); setStatus(msg,"err"); genBtn.disabled=false; }

genBtn.addEventListener("click", async ()=>{
  if(!me) return;
  genBtn.disabled=true; clearStatus(); progress(0);
  try{
    const instruction = instr.value.trim().slice(0,MAX_INSTR);
    let payload;
    if(mode==="img"){
      const images=[];
      for(const f of pickedImages){
        try{ images.push(await compressImage(f)); }
        catch(e){ return fail("Nie udało się odczytać jednego ze zdjęć — spróbuj JPG/PNG."); }
      }
      payload={ images, instruction, source:"img", mode:"both" };
      lastSourceText = "";
    } else {
      let text = mode==="pdf" ? await extractText(pickedPdf) : pasted.value.trim();
      if(text.length<MIN_CHARS) return fail(mode==="pdf"
        ? "Za mało tekstu w pliku — to pewnie skan. Zrób zdjęcia stron i wybierz „Zdjęcia notatek”, generator je odczyta."
        : "Za mało tekstu — wklej co najmniej ok. 300 znaków.");
      payload={ text:text.slice(0,MAX_CHARS), instruction, source:mode, mode:"both" };
      lastSourceText = payload.text;
    }
    progress(1);
    stepTimer=setTimeout(()=>progress(2), 6000);
    const r=await api("/generate", { method:"POST", body:payload });
    clearTimeout(stepTimer);
    const data=r.data;
    if(r.status===401) return fail("Sesja wygasła — zaloguj się ponownie.");
    if(r.status===413) return fail("Zdjęcia za duże — usuń któreś albo zrób mniej stron naraz.");
    if(r.status===429){ setUsage(data.usage); return fail(data.error || "Limit wykorzystany — spróbuj później."); }
    if(!r.ok) return fail((data.error || "Coś poszło nie tak") + " ("+r.status+")");
    if(!data.flashcards && !data.quiz) return fail("AI nie zwróciło poprawnych danych. Spróbuj z innym albo krótszym fragmentem.");
    progress(-1);
    setUsage(data.usage);
    currentDeckId = data.deck ? data.deck.id : null; currentShareId=null; prevDeck=null;
    if(data.deck){ decks.unshift(data.deck); renderDecks(); }
    lastResult={ title:data.title, flashcards:data.flashcards, quiz:data.quiz };
    answers = {}; quizMode = "all"; reviews = {};
    render(lastResult, true, !!data.deck);
    if(data.save_error) setStatus(data.save_error+" — pobierz plik, żeby go nie stracić.","err");
  }catch(err){
    fail("Błąd: "+(err.message||err));
    return;
  }
  genBtn.disabled=false; refreshBtn();
});

/* ---------- wynik ---------- */
let score={ok:0,done:0,total:0};
function updScore(){
  $("score").hidden = score.total===0;
  $("scoreVal").textContent = score.ok+" / "+score.total;
  $("scoreBar").style.width = (score.total? (score.ok/score.total*100):0)+"%";
}

function paras(t){ return String(t||"").split(/\n+/).filter(Boolean).map(x=>"<p>"+esc(x)+"</p>").join(""); }

function buildQuestion(q, i, total, n){
  n = n || i+1;
  const opts=Array.isArray(q.options)?q.options:[];
  const correct=Number.isInteger(q.correct)?q.correct:0;
  const order=opts.map((_,k)=>k).sort(()=>Math.random()-0.5);
  const card=document.createElement("div"); card.className="g-q";
  card.innerHTML=`<div class="g-qno">Pytanie ${n} / ${total}${isBad(q) ? ' <span class="g-wasbad">· ostatnio źle</span>' : ""}</div><div class="g-qt">${esc(q.q||q.question||"")}</div><div class="opts"></div><div class="g-exp">${esc(q.explain||q.explanation||"")}</div><div class="g-more" hidden></div><div class="g-qacts" hidden></div>`;
  const box=card.querySelector(".opts"), exp=card.querySelector(".g-exp"), more=card.querySelector(".g-more"), acts=card.querySelector(".g-qacts");
  let st=null;
  order.forEach(k=>{
    const b=document.createElement("button"); b.className="g-opt"; b.type="button"; b.textContent=opts[k]; b.dataset.k=k;
    b.addEventListener("click", ()=>{
      box.querySelectorAll(".g-opt").forEach(x=>x.disabled=true);
      if(k===correct){ b.classList.add("correct"); score.ok++; st="ok"; }
      else{ b.classList.add("wrong"); st="bad"; box.querySelectorAll(".g-opt").forEach(x=>{ if(+x.dataset.k===correct) x.classList.add("correct"); }); }
      score.done++; updScore();
      recordAnswer(q, k===correct);
      if(exp.textContent.trim()) exp.classList.add("show");
      showActs();
    });
    box.appendChild(b);
  });
  function showActs(){
    if(!canEdit()) return;
    acts.hidden=false; acts.innerHTML="";
    const cur=lastResult.quiz[i];
    const ex=document.createElement("button"); ex.type="button"; ex.className="g-mini";
    ex.innerHTML = cur.more ? "Pokaż wyjaśnienie" : 'Wytłumacz szerzej <span class="g-cost">'+costs().item+' kr.</span>';
    ex.addEventListener("click", async ()=>{
      if(lastResult.quiz[i].more){ more.hidden=!more.hidden; more.innerHTML=paras(lastResult.quiz[i].more); return; }
      const it=await itemAction("qz", i, "explain", ex);
      if(it){ more.innerHTML=paras(it.more); more.hidden=false; ex.textContent="Ukryj wyjaśnienie"; }
    });
    const rp=document.createElement("button"); rp.type="button"; rp.className="g-mini";
    rp.innerHTML='Podmień pytanie <span class="g-cost">'+costs().item+' kr.</span>';
    rp.addEventListener("click", async ()=>{
      const it=await itemAction("qz", i, "replace", rp);
      if(!it) return;
      if(st==="ok") score.ok--; if(st) score.done--; updScore();
      delete answers[qkey(q.q)]; updateQuizMode();
      card.replaceWith(buildQuestion(it, i, total, n));
    });
    acts.appendChild(ex); acts.appendChild(rp);
  }
  return card;
}

function renderQuiz(qz){
  const list=$("qzList"); list.innerHTML="";
  const pick = qz.map((q,i)=>[q,i]).filter(([q])=> quizMode!=="bad" || isBad(q));
  score={ok:0,done:0,total:pick.length}; updScore();
  pick.forEach(([q,i],n)=>list.appendChild(buildQuestion(q, i, pick.length, n+1)));
  $("qmEmpty").hidden = !(quizMode==="bad" && pick.length===0);
  updateQuizMode();
}

/* tryb „Moje błędy” */
function updateQuizMode(){
  const show = canEdit();
  $("qMode").hidden = !show;
  if(!show) return;
  const bad = badCount();
  $("qmAll").textContent = (lastResult.quiz||[]).length;
  $("qmBad").textContent = bad;
  document.querySelectorAll("#qMode [data-m]").forEach(b=>b.classList.toggle("on", b.dataset.m===quizMode));
  $("weakGo").hidden = bad===0;
  const d=decks.find(z=>z.id===currentDeckId);
  if(d && d.mistakes!==bad){ d.mistakes=bad; renderDecks(); }
}
document.querySelectorAll("#qMode [data-m]").forEach(b=>b.addEventListener("click", ()=>{
  quizMode=b.dataset.m; renderQuiz(lastResult.quiz||[]);
}));

function recordAnswer(q, ok){
  if(!canEdit()) return;
  const key=qkey(q.q), a=answers[key] || { r:0, w:0, ok:true };
  if(ok) a.r++; else a.w++;
  a.ok=ok; answers[key]=a;
  api("/decks/"+currentDeckId+"/answer", { method:"POST", body:{ qkey:key, ok } });
  updateQuizMode();
}

function render(data, scroll, saved){
  $("deckTitle").textContent = data.title || "Twój materiał";
  $("deckMeta").textContent = saved ? "✓ zapisano na koncie" : "";
  const fcs=Array.isArray(data.flashcards)?data.flashcards:[];
  const qz=Array.isArray(data.quiz)?data.quiz:[];
  const grid=$("fcGrid"); grid.innerHTML="";
  fcs.forEach((c,i)=>{
    const el=document.createElement("div"); el.className="g-fc"; el.tabIndex=0; el.setAttribute("role","button");
    const btn = canEdit() ? `<button class="g-fcbtn" type="button">${c.more ? "Pokaż wyjaśnienie" : "Wytłumacz · "+costs().item+" kr."}</button>` : "";
    el.innerHTML=`<div class="g-fc-in"><div class="g-face g-front">${esc(c.term||"")}</div><div class="g-face g-back"><span>${esc(c.def||c.definition||"")}</span>${btn}</div></div>`;
    const fb=el.querySelector(".g-fcbtn");
    if(fb) fb.addEventListener("click", async e=>{
      e.stopPropagation();
      const cur=lastResult.flashcards[i];
      if(cur.more) return openModal(cur.term, cur.more);
      const it=await itemAction("fc", i, "explain", fb);
      if(it){ fb.textContent="Pokaż wyjaśnienie"; openModal(it.term, it.more); }
    });
    el.addEventListener("click", ()=>el.classList.toggle("flip"));
    el.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); el.classList.toggle("flip"); } });
    grid.appendChild(el);
  });
  $("fcCount").textContent=fcs.length;
  $("qzCount").textContent=qz.length;
  renderQuiz(qz);
  showPane(document.querySelector(".g-tab.on").dataset.pane);
  $("result").hidden=false; refreshBtn();
  $("editPanel").hidden = !canEdit();
  renderShare(false);
  if(study){ study=null; $("study").hidden=true; $("fcGrid").hidden=false; $("fcHint").hidden=false; }
  renderStudyBar();
  $("editUndo").hidden = !prevDeck;
  $("editNote").textContent = lastSourceText ? "AI widzi też Twój materiał źródłowy z tego generowania." : "AI pracuje na treści talii (plików źródłowych nie przechowujemy).";
  if(scroll) $("result").scrollIntoView({behavior:"smooth",block:"start"});
  saveLocal();
}

function saveLocal(){ if(lastResult) ls.set(STORE_KEY, JSON.stringify({ ...lastResult, deckId: currentDeckId || null })); }

let toastT=null;
function toast(msg, err){ const t=$("toast"); t.textContent=msg; t.className="g-toast show"+(err?" err":""); clearTimeout(toastT); toastT=setTimeout(()=>{ t.className="g-toast"+(err?" err":""); }, err?6000:3000); }

function openModal(title, text){ $("modalTitle").textContent=title||""; $("modalBody").innerHTML=paras(text); $("modal").hidden=false; $("modalX").focus(); }
function closeModal(){ $("modal").hidden=true; }
$("modalX").addEventListener("click", closeModal);
$("modal").addEventListener("click", e=>{ if(e.target.id==="modal") closeModal(); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape" && !$("modal").hidden) closeModal(); });

async function itemAction(kind, index, action, btn){
  if(!canEdit()) return null;
  const orig=btn.innerHTML; btn.disabled=true;
  btn.innerHTML='<span class="g-spin"></span> '+(action==="explain" ? "Tłumaczę…" : "Układam nowe…");
  const r=await api("/decks/"+currentDeckId+"/item", { method:"POST", body:{ kind, index, action } });
  btn.disabled=false; btn.innerHTML=orig;
  setUsage(r.data.usage);
  if(!r.ok){ toast(r.data.error || "Nie udało się — spróbuj jeszcze raz.", true); return null; }
  (kind==="fc" ? lastResult.flashcards : lastResult.quiz)[index] = r.data.item;
  saveLocal();
  return r.data.item;
}

/* ---------- udostępnianie linkiem ---------- */
function shareUrl(){ return location.origin + "/talia.html?s=" + currentShareId; }
function renderShare(open){
  const btn=$("shareBtn"), box=$("shareBox");
  if(!btn || !box) return; // stara wersja strony z pamięci przeglądarki
  btn.hidden = !canEdit();
  btn.classList.toggle("on", !!currentShareId);
  $("shareBtnTx").textContent = currentShareId ? "Udostępniona" : "Udostępnij";
  if(!canEdit() || !currentShareId){ box.hidden=true; return; }
  if(open) box.hidden=false;
  $("shareUrl").value = shareUrl();
  const d=decks.find(z=>z.id===currentDeckId); const v=(d && d.views) || 0;
  $("shareViews").textContent = v ? v+" "+plural(v,"wyświetlenie","wyświetlenia","wyświetleń") : "Nikt jeszcze nie otworzył linku";
  $("shareNative").hidden = !navigator.share;
}
$("shareBtn") && $("shareBtn").addEventListener("click", async ()=>{
  if(!canEdit()) return;
  if(currentShareId){ $("shareBox").hidden = !$("shareBox").hidden; if(!$("shareBox").hidden) renderShare(true); return; }
  const btn=$("shareBtn"); btn.disabled=true;
  const r=await api("/decks/"+currentDeckId+"/share", { method:"POST" });
  btn.disabled=false;
  if(!r.ok){ toast(r.data.error || "Nie udało się utworzyć linku.", true); return; }
  currentShareId=r.data.share_id;
  const d=decks.find(z=>z.id===currentDeckId); if(d){ d.share_id=currentShareId; d.views=r.data.views||0; renderDecks(); }
  renderShare(true);
  $("shareUrl").select();
});
$("shareCopy") && $("shareCopy").addEventListener("click", async ()=>{
  const u=$("shareUrl");
  try{ await navigator.clipboard.writeText(u.value); }
  catch{ u.select(); try{ document.execCommand("copy"); }catch{} }
  toast("Link skopiowany — wyślij go znajomym ✓");
});
$("shareNative") && $("shareNative").addEventListener("click", async ()=>{
  try{ await navigator.share({ title: lastResult && lastResult.title || "Talia z Unicorner", text: "Fiszki i quiz na Unicorner", url: shareUrl() }); }catch{}
});
const shareOff=$("shareOff");
shareOff && shareOff.addEventListener("click", async ()=>{
  if(!shareOff.classList.contains("sure")){ shareOff.classList.add("sure"); shareOff.textContent="Na pewno? Obecny link przestanie działać"; setTimeout(()=>{ shareOff.classList.remove("sure"); shareOff.textContent="Wyłącz udostępnianie"; },4000); return; }
  const r=await api("/decks/"+currentDeckId+"/share", { method:"DELETE" });
  if(!r.ok){ toast(r.data.error || "Nie udało się wyłączyć.", true); return; }
  currentShareId=null; shareOff.classList.remove("sure"); shareOff.textContent="Wyłącz udostępnianie";
  const d=decks.find(z=>z.id===currentDeckId); if(d){ d.share_id=null; renderDecks(); }
  renderShare(false); toast("Udostępnianie wyłączone — stary link już nie działa.");
});

/* po odświeżeniu: jeśli ostatni wynik był talią z konta, otwórz ją znowu (działają wtedy Udostępnij i Popraw) */
let savedDeckId = null;
function reopenSaved(){
  if(savedDeckId && !currentDeckId && decks.some(d=>d.id===savedDeckId)) openDeck(savedDeckId, true);
}

/* ---------- „Zapisz u siebie” z linku znajomego (generator.html?zapisz=ID) ---------- */
let importDone=false;
async function runImport(){
  if(!pendingImport || importDone || !me) return;
  importDone=true;
  history.replaceState(null, "", location.pathname);
  const r=await api("/s/"+encodeURIComponent(pendingImport)+"/copy", { method:"POST" });
  if(!r.ok){ toast(r.data.error || "Nie udało się zapisać talii.", true); return; }
  if(!r.data.own){ await loadDecks(); }
  await openDeck(r.data.deck.id);
  toast(r.data.own ? "To Twoja własna talia — otwieram ją." : "Zapisano talię na Twoim koncie ✓");
}

function syncDeckInList(d){
  const x=decks.find(z=>z.id===currentDeckId);
  if(x){ x.title=d.title; x.fc=d.flashcards.length; x.qz=d.quiz.length; renderDecks(); }
}

const editInstr=$("editInstr");
bindChips("#editChips", editInstr);
async function runEdit(body, btn, busy){
  const orig=btn.innerHTML; btn.disabled=true;
  btn.innerHTML='<span class="g-spin"></span><span>'+busy+'</span>';
  const before=JSON.parse(JSON.stringify(lastResult));
  if(lastSourceText) body.material=lastSourceText;
  const r=await api("/decks/"+currentDeckId+"/edit", { method:"POST", body });
  btn.disabled=false; btn.innerHTML=orig;
  setUsage(r.data.usage);
  if(!r.ok){ toast(r.data.error || "Nie udało się poprawić talii.", true); return false; }
  prevDeck=before;
  const d=r.data.deck;
  lastResult={ title:d.title, flashcards:d.flashcards, quiz:d.quiz };
  render(lastResult, false, true); syncDeckInList(d);
  return true;
}
$("editGo").addEventListener("click", async ()=>{
  const ins=editInstr.value.trim();
  if(ins.length<3){ toast("Napisz, co zmienić w talii, albo kliknij jedną z podpowiedzi.", true); editInstr.focus(); return; }
  if(await runEdit({ instruction: ins }, $("editGo"), "AI poprawia talię… to potrwa kilkanaście sekund")){
    editInstr.value=""; document.querySelectorAll("#editChips button").forEach(b=>b.classList.remove("on"));
    toast("Talia poprawiona ✓ — jeśli coś nie pasuje, kliknij „Cofnij zmianę”.");
  }
});
$("weakGo").addEventListener("click", async ()=>{
  const before=(lastResult.quiz||[]).length;
  if(await runEdit({ weak: true }, $("weakGo"), "AI układa pytania z Twoich słabych tematów…")){
    const added=(lastResult.quiz||[]).length-before;
    quizMode="all"; renderQuiz(lastResult.quiz||[]); showPane("qz");
    toast(added>0 ? "Dodano "+added+" "+plural(added,"pytanie","pytania","pytań")+" z Twoich słabych tematów ✓ — są na końcu quizu." : "Talia zaktualizowana ✓");
  }
});
$("editUndo").addEventListener("click", async ()=>{
  if(!prevDeck) return;
  const r=await api("/decks/"+currentDeckId, { method:"PUT", body:prevDeck });
  if(!r.ok){ toast(r.data.error || "Nie udało się cofnąć.", true); return; }
  lastResult=prevDeck; prevDeck=null;
  render(lastResult, false, true); syncDeckInList(lastResult);
  toast("Przywrócono poprzednią wersję talii.");
});

/* ---------- powtórki fiszek (pudełka Leitnera; ten sam rytm co w workerze) ---------- */
const REVIEW_DAYS = [0, 1, 3, 7, 14, 30, 60];
const NEW_PER_SESSION = 20;
let reviews = {}, clockSkew = 0, study = null;
const nowSrv = () => Date.now() + clockSkew;

function studyQueue(){
  const cards = (lastResult && lastResult.flashcards) || [];
  const due = [], fresh = [];
  cards.forEach((c,i)=>{ const r=reviews[qkey(c.term)]; if(!r) fresh.push(i); else if(r.due<=nowSrv()) due.push([r.due,i]); });
  due.sort((a,b)=>a[0]-b[0]);
  return { due: due.map(x=>x[1]), fresh, queue: due.map(x=>x[1]).concat(fresh.slice(0, NEW_PER_SESSION)) };
}
function nextDueText(){
  const ds=Object.values(reviews).map(r=>r.due).filter(d=>d>nowSrv());
  if(!ds.length) return "";
  const days=Math.round((Math.min(...ds)-nowSrv())/86400e3);
  return days<=0 ? "jeszcze dziś" : days===1 ? "jutro" : "za "+days+" "+plural(days,"dzień","dni","dni");
}
function renderStudyBar(){
  const bar=$("studyBar"); if(!bar) return;
  const show = canEdit() && ((lastResult && lastResult.flashcards) || []).length>0 && $("study").hidden;
  bar.hidden = !show; if(!show) return;
  const q=studyQueue(), n=q.queue.length;
  const parts=[];
  if(q.due.length) parts.push(q.due.length+" do powtórki");
  if(q.fresh.length) parts.push(q.fresh.length+" "+plural(q.fresh.length,"nowa","nowe","nowych"));
  $("sbInfo").textContent = n ? parts.join(" · ") : "Na dziś wszystko powtórzone" + (nextDueText() ? " — następna powtórka "+nextDueText() : "");
  $("studyGo").disabled = !n;
  $("studyGo").textContent = n ? "Ucz się ("+n+")" : "Gotowe ✓";
}
function syncDueInList(){
  const d=decks.find(z=>z.id===currentDeckId); if(!d) return;
  const vals=Object.values(reviews);
  d.due=vals.filter(r=>r.due<=nowSrv()).length; d.seen=vals.length; renderDecks();
}
function startStudy(){
  const q=studyQueue(); if(!q.queue.length) return;
  study={ queue:q.queue.slice(), pos:0, total:q.queue.length, yes:0, no:0, again:{} };
  $("studyBar").hidden=true; $("fcGrid").hidden=true; $("fcHint").hidden=true;
  $("study").hidden=false; $("stDone").hidden=true; $("stCard").hidden=false; $("stActs").hidden=false;
  showStudyCard();
  $("study").scrollIntoView({behavior:"smooth",block:"center"});
}
function showStudyCard(){
  if(study.pos>=study.queue.length) return finishStudy();
  const i=study.queue[study.pos], c=lastResult.flashcards[i], r=reviews[qkey(c.term)];
  $("stKind").textContent = !r ? "nowa fiszka" : (study.again[i] ? "jeszcze raz" : "powtórka");
  $("stKind").className = "g-study-k " + (!r ? "new" : "due");
  $("stTerm").textContent=c.term; $("stDef").textContent=c.def; $("stDef").hidden=true;
  $("stShow").hidden=false; $("stNo").hidden=true; $("stYes").hidden=true;
  $("stProg").textContent=(study.pos+1)+" / "+study.queue.length;
  $("stBar").style.width=(study.pos/study.queue.length*100)+"%";
  $("stShow").focus({preventScroll:true});
}
function revealStudy(){ $("stDef").hidden=false; $("stShow").hidden=true; $("stNo").hidden=false; $("stYes").hidden=false; $("stYes").focus({preventScroll:true}); }
function gradeStudy(ok){
  const i=study.queue[study.pos], c=lastResult.flashcards[i], key=qkey(c.term);
  const prev=reviews[key]; const box= ok ? Math.min((prev?prev.box:0)+1, REVIEW_DAYS.length-1) : 0;
  reviews[key]={ box, due: box===0 ? nowSrv() : nowSrv()+REVIEW_DAYS[box]*86400e3-6*3600e3 };  // od razu; serwer i tak potwierdzi
  api("/decks/"+currentDeckId+"/review", { method:"POST", body:{ ckey:key, ok } }).then(r=>{ if(r.ok) reviews[key]={ box:r.data.box, due:r.data.due }; });
  if(ok) study.yes++; else { study.no++; if((study.again[i]||0)<2){ study.again[i]=(study.again[i]||0)+1; study.queue.push(i); } }
  study.pos++; showStudyCard();
}
function finishStudy(){
  $("stBar").style.width="100%"; $("stCard").hidden=true; $("stActs").hidden=true; $("stDone").hidden=false;
  $("stProg").textContent=study.queue.length+" / "+study.queue.length;
  const nd=nextDueText();
  $("stSum").textContent = "Umiesz: "+study.yes+" · do poprawki: "+study.no+". " + (nd ? "Kolejna powtórka "+nd+" — licznik przy talii przypomni." : "");
  syncDueInList();
}
function exitStudy(){
  study=null; $("study").hidden=true; $("fcGrid").hidden=false; $("fcHint").hidden=false;
  renderStudyBar(); syncDueInList();
}
if($("studyGo")){
  $("studyGo").addEventListener("click", startStudy);
  $("stShow").addEventListener("click", revealStudy);
  $("stNo").addEventListener("click", ()=>gradeStudy(false));
  $("stYes").addEventListener("click", ()=>gradeStudy(true));
  $("stExit").addEventListener("click", exitStudy);
  $("stBack").addEventListener("click", exitStudy);
  $("stQuiz").addEventListener("click", ()=>{ exitStudy(); showPane("qz"); $("result").scrollIntoView({behavior:"smooth",block:"start"}); });
  document.addEventListener("keydown", e=>{
    if(!study || $("study").hidden || !$("stDone").hidden || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if(!$("stShow").hidden && (e.key===" "||e.key==="Enter")){ e.preventDefault(); revealStudy(); }
    else if($("stShow").hidden && (e.key==="1"||e.key==="ArrowLeft")){ e.preventDefault(); gradeStudy(false); }
    else if($("stShow").hidden && (e.key==="2"||e.key==="ArrowRight")){ e.preventDefault(); gradeStudy(true); }
  });
}

function showPane(p){
  document.querySelectorAll(".g-tab").forEach(x=>x.classList.toggle("on", x.dataset.pane===p));
  document.querySelectorAll(".g-pane").forEach(x=>x.classList.toggle("on", x.id==="pane-"+p));
  $("score").style.visibility = p==="qz" ? "visible" : "hidden";
}
document.querySelectorAll(".g-tab").forEach(t=>t.addEventListener("click", ()=>showPane(t.dataset.pane)));
$("quizAgain").addEventListener("click", ()=>{ if(lastResult) renderQuiz(Array.isArray(lastResult.quiz)?lastResult.quiz:[]); });

function esc(s){ return String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }

/* ---------- pobieranie ---------- */
function download(blob, name){ const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),2000); }
$("dlJson").addEventListener("click", ()=>{ if(lastResult) download(new Blob([JSON.stringify(lastResult,null,2)],{type:"application/json"}),"unicorner_material.json"); });
$("dlHtml").addEventListener("click", ()=>{ if(lastResult) download(new Blob([buildStandaloneHtml(lastResult)],{type:"text/html;charset=utf-8"}),"unicorner_fiszki_quiz.html"); });
$("forget").addEventListener("click", ()=>{ ls.del(STORE_KEY); setStatus("Usunięto zapamiętany materiał z tej przeglądarki. Pobrane pliki zostają u Ciebie.","info"); });

/* ---------- start ---------- */
setMode("pdf");
renderAccount();
initGoogle(0);
if(token){
  api("/me").then(async r=>{ if(r.ok){ setSession(token, r.data.user, r.data.usage); await loadDecks(); if(pendingImport) runImport(); else reopenSaved(); } else if(pendingImport) importHint(); });
} else if(pendingImport) importHint();
function importHint(){ setStatus("Zaloguj się w sekcji 03 Konto, a udostępniona talia od razu zapisze się na Twoim koncie.","info"); $("acctOut").scrollIntoView({behavior:"smooth",block:"center"}); }
try{
  const saved = JSON.parse(ls.get(STORE_KEY) || "null");
  if(saved && (saved.flashcards || saved.quiz)){
    lastResult = { title:saved.title, flashcards:saved.flashcards, quiz:saved.quiz }; savedDeckId = saved.deckId || null; render(lastResult, false);
    setStatus("Poniżej Twój ostatni materiał z tej przeglądarki. Nowe generowanie go nadpisze.","info");
  }
}catch{ /* uszkodzony zapis — ignorujemy */ }


function buildStandaloneHtml(data){
  const fcs=Array.isArray(data.flashcards)?data.flashcards:[];
  const qz=Array.isArray(data.quiz)?data.quiz:[];
  // dane wstrzykiwane jako JSON — zero zależności, działa offline
  // escape "<" chroni przed przedwczesnym zamknięciem bloku skryptu w pobranym pliku
  const payload = JSON.stringify({flashcards:fcs, quiz:qz}).replace(/</g,"\\u003c");
  return `<!DOCTYPE html>
<html lang="pl"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fiszki i quiz · Unicorner</title>
<style>
:root{--ink:#0c0a18;--surface:#161230;--surface2:#1c1740;--line:#272050;--text:#ece9f7;--muted:#9b93c4;--accent:#a78bfa;--ok:#5ad1a0;--ok-bg:#10241d;--ok-line:#1d4a3a;--bad:#f87a8e;--bad-bg:#2a0f17;--bad-line:#5a2230;--iris:linear-gradient(115deg,#5ad1ff,#a78bfa 34%,#f472b6 66%,#fcd34d);--mono:'Space Grotesk',ui-monospace,monospace;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:radial-gradient(900px 500px at 85% -8%,#1e1646,transparent 58%),var(--ink);color:var(--text);line-height:1.55;padding:24px 16px;min-height:100vh;}
.wrap{max-width:860px;margin:0 auto;}
.head{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.head .dot{width:14px;height:22px;background:var(--iris);clip-path:polygon(50% 0,75% 100%,25% 100%);}
h1{font-family:var(--mono);font-size:1.5rem;letter-spacing:.5px;}
.h1 .g{background:var(--iris);-webkit-background-clip:text;background-clip:text;color:transparent;}
.sub{color:var(--muted);font-size:.86rem;margin-bottom:22px;}
.tabs{display:flex;gap:8px;margin:18px 0 16px;}
.tab{font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--muted);background:var(--surface);border:1px solid var(--line);border-radius:4px;padding:9px 18px;cursor:pointer;}
.tab.active{color:#160d2b;background:var(--accent);border-color:var(--accent);}
.pane{display:none;}.pane.active{display:block;}
.fc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;}
.fc{perspective:1000px;height:160px;cursor:pointer;}
.fc-in{position:relative;width:100%;height:100%;transition:transform .5s;transform-style:preserve-3d;}
.fc.flip .fc-in{transform:rotateY(180deg);}
.face{position:absolute;inset:0;backface-visibility:hidden;border:1px solid var(--line);border-radius:4px;padding:16px;display:flex;align-items:center;justify-content:center;text-align:center;overflow:auto;}
.front{background:var(--surface);font-family:var(--mono);font-weight:600;font-size:1.02rem;}
.front::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:var(--iris);}
.back{background:var(--surface2);transform:rotateY(180deg);font-size:.9rem;color:var(--muted);}
.qc{background:var(--surface);border:1px solid var(--line);border-radius:4px;padding:18px;margin-bottom:12px;}
.qno{font-family:var(--mono);font-size:.72rem;color:var(--accent);font-weight:600;text-transform:uppercase;letter-spacing:.5px;}
.qt{font-size:1rem;margin:8px 0 14px;font-weight:500;}
.opt{display:block;width:100%;text-align:left;background:var(--ink);border:1px solid var(--line);border-radius:4px;padding:11px 14px;margin-bottom:8px;cursor:pointer;color:var(--text);font:inherit;font-size:.93rem;}
.opt:hover:not(:disabled){border-color:var(--accent);}
.opt.correct{border-color:var(--ok-line);background:var(--ok-bg);color:#cdeede;}
.opt.wrong{border-color:var(--bad-line);background:var(--bad-bg);color:#f7c9d1;}
.exp{display:none;font-size:.88rem;color:var(--muted);margin-top:6px;border-left:3px solid var(--accent);background:var(--ink);border-radius:4px;padding:10px 12px;}
.exp.show{display:block;}
.foot{margin-top:26px;font-size:.76rem;color:var(--muted);border-top:1px solid var(--line);padding-top:16px;}
</style></head>
<body><div class="wrap">
<div class="head"><span class="dot"></span><h1 class="h1">Uni<span class="g">corner</span> — Twój materiał</h1></div>
<div class="sub">Wygenerowane fiszki i quiz. Ten plik działa offline — zapisz go u siebie.</div>
<div class="tabs"><button class="tab active" data-p="fc">Fiszki</button><button class="tab" data-p="qz">Quiz</button></div>
<div class="pane active" id="fc"><div class="fc-grid" id="fcg"></div></div>
<div class="pane" id="qz"><div id="qzl"></div></div>
<div class="foot">Unicorner · materiał wygenerowany przez AI, może zawierać błędy — sprawdzaj z oryginałem.</div>
</div>
<script>
const D=${payload};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fcg=document.getElementById("fcg");
(D.flashcards||[]).forEach(c=>{const e=document.createElement("div");e.className="fc";e.innerHTML='<div class="fc-in"><div class="face front">'+esc(c.term||"")+'</div><div class="face back">'+esc(c.def||"")+'</div></div>';e.onclick=()=>e.classList.toggle("flip");fcg.appendChild(e);});
const qzl=document.getElementById("qzl");
(D.quiz||[]).forEach((q,i)=>{const opts=q.options||[];const correct=Number.isInteger(q.correct)?q.correct:0;const order=opts.map((_,k)=>k).sort(()=>Math.random()-0.5);const card=document.createElement("div");card.className="qc";card.innerHTML='<div class="qno">Pytanie '+(i+1)+' / '+D.quiz.length+'</div><div class="qt">'+esc(q.q||"")+'</div><div class="opts"></div><div class="exp">'+esc(q.explain||"")+'</div>';const box=card.querySelector(".opts"),exp=card.querySelector(".exp");order.forEach(k=>{const b=document.createElement("button");b.className="opt";b.textContent=opts[k];b.onclick=()=>{box.querySelectorAll(".opt").forEach(x=>x.disabled=true);if(k===correct)b.classList.add("correct");else{b.classList.add("wrong");box.querySelectorAll(".opt").forEach(x=>{if(x.textContent===opts[correct])x.classList.add("correct");});}if(exp.textContent.trim())exp.classList.add("show");};box.appendChild(b);});qzl.appendChild(card);});
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".pane").forEach(x=>x.classList.remove("active"));t.classList.add("active");document.getElementById(t.dataset.p).classList.add("active");});
<\/script></body></html>`;
}
})();
