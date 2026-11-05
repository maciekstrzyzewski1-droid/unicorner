// Tasowanie opcji – zwraca {opts, ans} z pomieszaną kolejnością
function shuffle(q){
  const idxs=[0,1,2,3];
  for(let i=idxs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[idxs[i],idxs[j]]=[idxs[j],idxs[i]];}
  const newOpts=idxs.map(i=>q.opts[i]);
  const newAns=idxs.indexOf(q.ans);
  return{opts:newOpts,ans:newAns};
}

let activeSet=null; // null = wybór zestawu
let questions=[];
let shuffled=[];
let current=0,score=0,answered=[];

function switchTab(id,btn){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  if(id==='quiz')renderSetPicker();
}

function startSet(si){
  const s=SETS[si];
  questions=RAW.slice(s.range[0],s.range[1]);
  shuffled=questions.map(q=>shuffle(q));
  current=0;score=0;answered=new Array(questions.length).fill(null);
  activeSet=si;
  renderQuiz();
}

function renderSetPicker(){
  activeSet=null;
  const c=document.getElementById('quiz-container');
  c.innerHTML=`<div class="card"><div class="card-label">Wybierz zestaw pytań</div><div class="card-title" style="font-size:1.1rem;margin-bottom:1rem">Z czego chcesz się teraz pouczyć?</div>`+
  SETS.map((s,i)=>`<button class="opt" style="margin-bottom:6px" onclick="startSet(${i})">${s.name}</button>`).join('')+`</div>`;
}

function renderQuiz(){
  const c=document.getElementById('quiz-container');
  if(current>=questions.length){
    const pct=Math.round(score/questions.length*100);
    c.innerHTML=`<div class="card" style="text-align:center;padding:2.5rem">
      <div class="card-label">${SETS[activeSet].name}</div>
      <div class="score-big">${score}/${questions.length}</div>
      <div class="card-body" style="margin-bottom:1.5rem">
        ${pct>=80?'✅ Solidna znajomość materiału.':pct>=60?'⚠️ Kilka rzeczy warto powtórzyć.':'❌ Wróć do notatek i spróbuj ponownie.'}
        <br><span style="color:var(--ink-light)">${pct}% poprawnych odpowiedzi</span>
      </div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <button class="nav-btn primary" onclick="startSet(${activeSet})">Powtórz zestaw</button>
        <button class="nav-btn" onclick="renderSetPicker()">← Zmień zestaw</button>
      </div>
    </div>`;
    return;
  }
  const q=questions[current];
  const sh=shuffled[current];
  const isAnswered=answered[current]!==null;
  const pct=Math.round((current/questions.length)*100);
  c.innerHTML=`
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <div style="margin-bottom:.5rem"><button class="nav-btn" style="font-size:11px;padding:4px 12px" onclick="renderSetPicker()">← Zestawy</button></div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1rem">
        <span class="card-label">${SETS[activeSet].name.split('–')[1]||SETS[activeSet].name} · pytanie ${current+1}/${questions.length}</span>
        <span class="card-label">Wynik: ${score} pkt</span>
      </div>
      <div class="quiz-q">${q.q}</div>
      <div class="quiz-opts">
        ${sh.opts.map((o,i)=>{
          let cls='opt';
          if(isAnswered){if(i===sh.ans)cls+=' correct';else if(i===answered[current]&&i!==sh.ans)cls+=' wrong';}
          const oc=isAnswered?'':` onclick="pickAnswer(${i})"`;
          return `<button class="${cls}"${oc}>${o}</button>`;
        }).join('')}
      </div>
      ${isAnswered?`<div class="quiz-feedback ${answered[current]===sh.ans?'ok':'fail'}">${answered[current]===sh.ans?'✅':'❌'} ${q.exp}</div>`:''}
      <div class="quiz-nav">
        <span class="quiz-counter">${current+1} / ${questions.length}</span>
        ${current>0?`<button class="nav-btn" onclick="prevQ()">← Wstecz</button>`:''}
        ${isAnswered&&current<questions.length-1?`<button class="nav-btn primary" onclick="nextQ()">Dalej →</button>`:''}
        ${isAnswered&&current===questions.length-1?`<button class="nav-btn primary" onclick="nextQ()">Pokaż wynik</button>`:''}
      </div>
    </div>`;
}

function pickAnswer(i){
  if(answered[current]!==null)return;
  answered[current]=i;
  if(i===shuffled[current].ans)score++;
  renderQuiz();
}
function nextQ(){current++;renderQuiz();}
function prevQ(){if(current>0){current--;renderQuiz();}}

// inicjalizacja
document.addEventListener('DOMContentLoaded',()=>{
  const quizTab=document.querySelector('.tab[onclick*="quiz"]');
  if(quizTab) quizTab.addEventListener('click',renderSetPicker);
});
