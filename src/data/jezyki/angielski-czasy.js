// Angielski — sekcja „Czasy”: arkusze z zajęć (I Present Perfect / Past Simple, II Past tenses,
// III Tense forms – revision, IV Mixed tenses). Zdania z arkuszy, rozwiązania i wyjaśnienia własne.
// Zapis zdania: (czasownik) {odpowiedź|inna dobra odpowiedź}. Jedna luka → „wpisz”, kilka luk → „luki”.
// Skróty (haven't = have not, 'll = will…) i pisownia brytyjska/amerykańska dochodzą same (warianty()).
import { W, P, KAT, LUKI } from './narzedzia.js';

// ─────────────────────────────── warianty odpowiedzi ───────────────────────────────
const SKROTY = [['have not', "haven't"], ['has not', "hasn't"], ['had not', "hadn't"], ['did not', "didn't"], ['do not', "don't"], ['does not', "doesn't"],
  ['will not', "won't"], ['was not', "wasn't"], ['were not', "weren't"], ['is not', "isn't"], ['are not', "aren't"]];
const NA_POCZATKU = [['am ', "'m "], ['are ', "'re "], ['is ', "'s "], ['will ', "'ll "], ['have ', "'ve "], ['has ', "'s "], ['had ', "'d "], ['would ', "'d "]];
const PISOWNIA = [['travelling', 'traveling'], ['realised', 'realized'], ['learnt', 'learned'], ['got off', 'gotten off']];
/** Wszystkie dopuszczalne zapisy: pierwsza odpowiedź zostaje pierwsza (pokazuje się jako „Poprawnie”). */
export function warianty(lista) {
  const out = new Set();
  for (const a of lista) {
    let w = [a];
    for (const [pelne, skrot] of [...SKROTY, ...PISOWNIA]) {
      w = w.flatMap((s) => {
        const r = [s];
        const i = s.indexOf(pelne);
        if (i >= 0) r.push(s.replace(pelne, skrot));
        // skróty szukamy małymi literami, więc „Aren't you…” (pytanie) zostaje skrótem: „Are not you…” to błąd
        const j = s.indexOf(skrot);
        if (j >= 0) r.push(s.replace(skrot, pelne));
        return r;
      });
    }
    w = w.flatMap((s) => {
      const r = [s];
      for (const [pelne, skrot] of NA_POCZATKU) if (s.startsWith(pelne)) r.push(skrot + s.slice(pelne.length));
      return r;
    });
    w.forEach((s) => out.add(s));
  }
  return [...out];
}

/** Zdanie z arkusza → ćwiczenie. Klamry {…|…} to luki z dopuszczalnymi odpowiedziami. */
function zd(tekst, x) {
  const luki = [...tekst.matchAll(/\{(.+?)\}/g)].map((m) => warianty(m[1].split('|')));
  if (luki.length === 1) return P(tekst.replace(/\{.+?\}/, '…'), luki[0], x, { pod: 'forma czasownika' });
  let i = 0;
  const t = tekst.replace(/\{.+?\}/g, () => `[[${luki[i++].join('|')}]]`);
  return LUKI('Wpisz czasowniki w odpowiedniej formie.', t, null, x);
}

// ─────────────────────────────── osie czasu do kart „Nowe” ───────────────────────────────
// Oś: przeszłość → teraz (x = 210) → przyszłość. Kropka = jednorazowe zdarzenie, fala = czynność w toku,
// pasek = okres. Kolory z palety kursu (fiolet, złoto, zieleń).
const OS_TERAZ = 210;
function os(elementy, podpis) {
  const ksztalty = elementy.map((e) => {
    if (e.t === 'kropka') return `<circle cx="${e.x}" cy="30" r="7" fill="#ffd84a"/>${e.l ? `<text x="${e.x}" y="56" text-anchor="middle" font-size="12" fill="#e2ccff">${e.l}</text>` : ''}`;
    if (e.t === 'pasek') return `<rect x="${e.od}" y="24" width="${e.do - e.od}" height="12" rx="6" fill="#bd8bff" opacity=".85"/>${e.l ? `<text x="${(e.od + e.do) / 2}" y="56" text-anchor="middle" font-size="12" fill="#e2ccff">${e.l}</text>` : ''}`;
    if (e.t === 'fala') {
      let d = `M${e.od} 30`;
      for (let x = e.od; x < e.do; x += 12) d += ` q3 -9 6 0 q3 9 6 0`;
      return `<path d="${d}" fill="none" stroke="#5ad1a0" stroke-width="3" stroke-linecap="round"/>${e.l ? `<text x="${(e.od + e.do) / 2}" y="56" text-anchor="middle" font-size="12" fill="#e2ccff">${e.l}</text>` : ''}`;
    }
    if (e.t === 'strzalka') return `<path d="M${e.od} 14 Q${(e.od + e.do) / 2} 0 ${e.do} 14" fill="none" stroke="#ffd84a" stroke-width="2" stroke-dasharray="4 3"/>`;
    return '';
  }).join('');
  return `<svg class="jz-os" viewBox="0 0 300 64" role="img" aria-label="${podpis}" style="width:100%;max-width:420px;display:block;margin:6px 0 10px">`
    + `<line x1="6" y1="30" x2="294" y2="30" stroke="rgba(189,139,255,.45)" stroke-width="2"/>`
    + `<line x1="${OS_TERAZ}" y1="16" x2="${OS_TERAZ}" y2="44" stroke="#22d3ee" stroke-width="2"/>`
    + `<text x="${OS_TERAZ}" y="12" text-anchor="middle" font-size="12" fill="#22d3ee">teraz</text>${ksztalty}</svg>`;
}
const karta = (h, osie, tekst) => ({ h, html: `${osie}${tekst}` });

// ─────────────────────────────── arkusz I: Present Perfect czy Past Simple ───────────────────────────────
const ARKUSZ1 = [
  zd('She (be) {has been} away on business since last week.', '<b>since last week</b> → Present Perfect. Wyjechała tydzień temu i nadal jej nie ma.'),
  zd('Peter (live) {lived} in London for three months before moving to Brighton.', 'Zamknięty okres w przeszłości: już tam nie mieszka → <b>Past Simple</b>.'),
  zd('He (pass) {has passed} three exams so far.', '<b>so far</b> = do tej pory → Present Perfect.'),
  zd('She (take) {took} a painkiller an hour ago.', '<b>ago</b> zawsze z Past Simple. take – took – taken.'),
  zd('Edison (invent) {invented} many useful devices.', 'Edison nie żyje, jego życie to zamknięty okres → <b>Past Simple</b>.'),
  zd('So much (happen) {has happened} since my wife (die) {died}.', 'Od tamtej chwili do dziś → <b>has happened</b>. Po <b>since</b> moment w przeszłości → <b>died</b>.'),
  zd('Kathy (catch) {caught} a bad cold a few days ago.', '<b>a few days ago</b> → Past Simple. catch – caught – caught.'),
  zd('Who (not see) {hasn\'t seen} the film “Titanic” yet?', '<b>yet</b> → Present Perfect. Who jest podmiotem, więc bez „does/did”.'),
  zd('I (have) {have had} this computer for three months.', '<b>for three months</b> i nadal go mam → Present Perfect. „Have” = mieć (posiadać) nie ma formy -ing.'),
  zd('He (already / drink) {has already drunk} the wine.', '<b>already</b> → Present Perfect. drink – drank – <b>drunk</b>.'),
  zd('I (not read) {haven\'t read} that article yet.', '<b>yet</b> w przeczeniu → Present Perfect.'),
  zd('They (be) {were} engaged for two years and then they (get) {got} married.', 'Zamknięta historia: byli zaręczeni, potem ślub → <b>Past Simple</b> w obu lukach.'),
  zd('I (talk) {talked} to her on Monday and she (promise) {promised} to take care of it.', '<b>on Monday</b> → Past Simple w obu lukach.'),
  zd('If you (not hear) {haven\'t heard} of this invention, it’s not your fault.', 'Doświadczenie do teraz (nigdy dotąd nie słyszałeś) → <b>Present Perfect</b>.'),
  zd('I (never / ride) {have never ridden} a horse.', '<b>never</b> = nigdy w życiu → Present Perfect. ride – rode – <b>ridden</b>.'),
  zd('I am afraid that I (leave) {have left} my briefcase in the office.', 'Skutek widać teraz (nie mam teczki) → <b>Present Perfect</b>. leave – left – left.'),
  zd('Since last May, Henry (share) {has shared|has been sharing} two rooms in Brighton with his wife.', '<b>Since last May</b> → Present Perfect: has shared (has been sharing też jest poprawne).'),
  zd('So far they (not break) {haven\'t broken} the news about their divorce.', '<b>So far</b> → Present Perfect. break – broke – <b>broken</b>. Break the news = przekazać (złą) wiadomość.'),
  zd('He (spend) {spent} five weeks in hospital but he is fine now.', 'Pobyt w szpitalu się skończył → <b>Past Simple</b>. spend – spent – spent.'),
];

// ─────────────────────────────── arkusz II: czasy przeszłe ───────────────────────────────
const ARKUSZ2 = [
  zd('The company (lose) {has lost} over a hundred customers this month.', '<b>this month</b> (miesiąc jeszcze trwa) → Present Perfect.'),
  zd('After the accident he (crawl) {crawled} out of the car.', 'Kolejne zdarzenie w historii → <b>Past Simple</b>. Crawl = czołgać się.'),
  zd('They (already / finish) {have already finished} developing a new medicine.', '<b>already</b> i brak innego momentu w przeszłości → Present Perfect.'),
  zd('The police officer (give) {gave} her a ticket because she (travel) {was travelling|had been travelling} at over 70 miles an hour.', 'Mandat → <b>Past Simple</b>. Jazda była w toku (tło) → <b>was travelling</b> (had been travelling też jest dobrze).'),
  zd('Although it (rain) {was raining} heavily, the crowd (gather) {gathered|had gathered} in the street to see the King.', 'Deszcz jako tło → <b>Past Continuous</b>. Tłum się zebrał → <b>Past Simple</b>.'),
  zd('Soon after his burial people (start) {started} wondering what (happen) {had happened} to the billions of dollars the dictator (plunder) {had plundered}.', 'Ludzie zaczęli się zastanawiać → Past Simple. Co się stało z pieniędzmi i ich grabież były <b>wcześniej</b> → Past Perfect (had happened, had plundered).'),
  zd('They (catch) {caught} the boy when he (shoplift) {was shoplifting}.', 'Złapali go → <b>Past Simple</b> w trakcie kradzieży → <b>Past Continuous</b>. Shoplift = kraść w sklepie.'),
  zd('They (barricade) {had barricaded} the door to the room before the police (arrive) {arrived}.', 'Zabarykadowali drzwi <b>przed</b> przyjazdem policji → Past Perfect + Past Simple.'),
  zd('After he (go out) {had been going out|had gone out} with Ann for two years, he (propose) {proposed} to her.', 'Dwa lata chodzenia <b>przed</b> oświadczynami → Past Perfect Continuous. Go out with = chodzić z kimś.'),
  zd('He (sign) {has signed} an important contract today.', '<b>today</b> (dzień trwa) → Present Perfect.'),
  zd('I (try) {have been trying} to get in touch with her for the last two hours.', '<b>for the last two hours</b> i nadal próbuję → Present Perfect Continuous.'),
  zd('I (live) {was living|had been living} in New York away from my family when I (meet) {met} Jackie.', 'Mieszkanie w NY to tło → <b>Past Continuous</b>. Poznałem Jackie → <b>Past Simple</b>.'),
  zd('She (run over) {ran over} her neighbour’s dog on Monday.', '<b>on Monday</b> → Past Simple. run – ran – run. Run over = przejechać (samochodem).'),
  zd('He (drive) {was driving} home when suddenly he (have) {had} a puncture.', 'Jechał (w toku) i nagle złapał gumę → Past Continuous + Past Simple. Have a puncture = złapać gumę.'),
  zd('He (study) {had studied|had been studying} for five years before he (take) {took} a degree in history.', 'Pięć lat nauki <b>przed</b> dyplomem → Past Perfect (Continuous). Take a degree = zdobyć dyplom.'),
];

// ─────────────────────────────── arkusz IV: czasy mieszane ───────────────────────────────
const ARKUSZ4 = [
  zd('He (paint) {has been painting} her portrait for five days and (not finish) {hasn\'t finished} yet.', '<b>for five days</b> i nadal maluje → Present Perfect Continuous. <b>yet</b> → Present Perfect.'),
  zd('She (jog) {was jogging} in Central Park when I (see) {saw} her yesterday.', 'Biegała (w toku), gdy ją zobaczyłem → Past Continuous + Past Simple.'),
  zd('I suppose he (not accept) {won\'t accept} your offer tomorrow.', 'Przewidywanie (I suppose) → <b>will</b>: won’t accept.'),
  zd('Listen, somebody (come) {is coming}. Can you hear the footsteps?', '<b>Listen</b> = dzieje się teraz → Present Continuous.'),
  zd('Tony (not be) {hasn\'t been} abroad since they (take) {took} his passport away from him two years ago.', '<b>since</b> → Present Perfect w zdaniu głównym. <b>two years ago</b> → Past Simple.'),
  zd('By the end of next year I (work) {will have been working|will have worked} as a civil servant for twenty-five years.', '<b>By the end of next year</b> + <b>for 25 years</b> → Future Perfect Continuous.'),
  zd('Tomorrow at 8 a.m. we (cross) {will be crossing|are crossing} the English Channel by ferry.', 'W toku o konkretnej godzinie w przyszłości → <b>Future Continuous</b>.'),
  zd('He (already / repair) {had already been repairing} the engine of his car for five hours when I (come) {came} to see him yesterday.', 'Pięć godzin naprawy do chwili mojego przyjścia → Past Perfect Continuous + Past Simple.'),
  zd('The seminar (already / begin) {had already begun|had already started} before we (get) {got} there yesterday.', 'Seminarium zaczęło się <b>przed</b> naszym przyjściem → Past Perfect. begin – began – <b>begun</b>.'),
  zd('Peter says that by next December he (make) {will have made} 125,000 dollars.', '<b>by next December</b> → Future Perfect: will have made.'),
  zd('Susan found my cuff-link after I (leave) {had left|left}.', 'Wyszedłem <b>wcześniej</b>, niż znalazła spinkę → Past Perfect (po <b>after</b> Past Simple też jest dobrze).'),
  zd('I think he (choose) {will choose} a sports career as soon as he (finish) {finishes|has finished} school.', 'I think → will. Po <b>as soon as</b> o przyszłości czas teraźniejszy: finishes.'),
  zd('My mother is a heavy smoker. She (smoke) {smokes} twenty cigarettes a day.', 'Nawyk (a day) → <b>Present Simple</b>.'),
  zd('By next Tuesday the spacecraft (fly) {will have been flying} through space for five months.', '<b>By next Tuesday</b> + <b>for five months</b> → Future Perfect Continuous.'),
  zd('The Browns (build) {will have built} their house by the end of next month.', '<b>by the end of next month</b> → Future Perfect.'),
  zd('When Joan (return) {returned} home yesterday, everybody (already / wait) {was already waiting|had already been waiting} for her.', 'Wróciła → Past Simple. Wszyscy już czekali (w toku) → Past Continuous.'),
  zd('This gentleman (sit) {has been sitting} in the lounge for an hour now but the manager (not come) {hasn\'t come} yet.', '<b>for an hour now</b> → Present Perfect Continuous. <b>yet</b> → Present Perfect.'),
  zd('Laura (stay) {is staying} with her fiancé at present.', '<b>at present</b> = teraz, tymczasowo → Present Continuous.'),
  zd('The fighter plane (no sooner / land) {had no sooner landed} than it (take off) {took off} again.', '<b>no sooner … than</b>: wcześniejsza czynność w Past Perfect (had no sooner landed), późniejsza w Past Simple.'),
  zd('He has classes and lectures every day but Saturday and Sunday, so he usually (spend) {spends} weekends at home.', '<b>usually</b> → Present Simple.'),
  zd('Yesterday at 8 we (still / sleep) {were still sleeping} soundly.', 'W toku o konkretnej godzinie w przeszłości → Past Continuous.'),
  zd('I (live) {have lived|have been living} here ever since I bought this house.', '<b>ever since</b> → Present Perfect (Continuous).'),
  zd('They (get) {got} married only three months ago and (already / decide) {have already decided} to divorce.', '<b>ago</b> → Past Simple. <b>already</b> + skutek teraz → Present Perfect.'),
  zd('I (finish) {will have finished} my postgraduate studies by the end of winter. Then I’ll go to work.', '<b>by the end of winter</b> → Future Perfect.'),
  zd('It (say) {says}: “No parking”. By the way, take chains in case it (snow) {snows}.', 'Napis mówi (stale) → Present Simple. Po <b>in case</b> o przyszłości czas teraźniejszy: snows.'),
  zd('They (sleep) {are sleeping} now and they (not apprehend) {don\'t apprehend} that there will be any trouble.', '<b>now</b> → Present Continuous. Apprehend = przeczuwać (czasownik stanu) → Present Simple.'),
  zd('While we (have) {were having} a party, somebody switched off the current.', '<b>While</b> + tło → Past Continuous.'),
  zd('I (sunbathe) {will be sunbathing} on the beach all day tomorrow.', '<b>all day tomorrow</b> → Future Continuous.'),
  zd('Look, this balloon (go) {is going to go|is going} down and there is nowhere to land!', 'Widać, co się zaraz stanie → <b>going to</b>.'),
  zd('I (lay) {laid} your car keys on the desk a few minutes ago.', '<b>ago</b> → Past Simple. lay – <b>laid</b> – laid (kłaść). Nie mylić z lie – lay – lain (leżeć).'),
  zd('By that time yesterday the divers (already / look for) {had already been looking for} the drowned man for four hours.', '<b>By that time yesterday</b> + <b>for four hours</b> → Past Perfect Continuous.'),
  zd('The lesson (hardly / begin) {had hardly begun} when the headmistress (rush in) {rushed in}.', '<b>hardly … when</b>: wcześniejsza czynność w Past Perfect, późniejsza w Past Simple.'),
  zd('I hope it (stop) {will have stopped|stops|has stopped} hailing by the time we set off.', '<b>by the time</b> → Future Perfect: will have stopped.'),
  zd('The plumbers (replace) {have been replacing} the plumbing since Monday and still (not finish) {haven\'t finished} it.', '<b>since Monday</b> → Present Perfect Continuous. <b>still … not</b> → Present Perfect.'),
  zd('We (not hear) {haven\'t heard} from our relatives for the last five years.', '<b>for the last five years</b> → Present Perfect.'),
  zd('The other day a bus (run over) {ran over} my next-door neighbour.', '<b>The other day</b> = kilka dni temu → Past Simple.'),
  zd('This time yesterday we (paint) {were painting} the exterior walls of our new house.', '<b>This time yesterday</b> → Past Continuous.'),
  zd('Who (take) {took} physics as an optional subject last year?', '<b>last year</b> → Past Simple. Who jest podmiotem: bez „did”.'),
  zd('(she / see) {Has she seen} the Statue of Liberty yet?', '<b>yet</b> w pytaniu → Present Perfect.'),
  zd('What (he / do) {was he doing|did he do} all day yesterday?', '<b>all day yesterday</b> → Past Continuous.'),
  zd('Where (you / settle down) {will you settle down} when you have no money problems?', 'Pytanie o przyszłość → will. Po <b>when</b> czas teraźniejszy (have).'),
  zd('When (you / last / hear) {did you last hear} from them?', '<b>When</b> pyta o moment → Past Simple.'),
  zd('(your mother / talk) {Is your mother talking} to the tutor now?', '<b>now</b> → Present Continuous.'),
  zd('What medical journals (you / read) {have you been reading|have you read} lately?', '<b>lately</b> → Present Perfect (Continuous).'),
  zd('Who (not understand) {didn\'t understand|doesn\'t understand} what I (try) {was trying|am trying} to explain?', 'Wyjaśnianie było w toku → <b>Past Continuous</b>; całość w przeszłości → didn’t understand.'),
  zd('Which TV programme (you / watch) {will you be watching} all day tomorrow?', '<b>all day tomorrow</b> → Future Continuous.'),
  zd('(it / snow) {Was it snowing} when you got off the plane yesterday?', 'Tło w chwili wyjścia z samolotu → Past Continuous.'),
  zd('Where and when (Elvis Presley / be) {was Elvis Presley} born?', '<b>be born</b> → was born (Past Simple).'),
  zd('How old (you / be) {will you be} next Monday?', '<b>next Monday</b> → will.'),
  zd('(you / not think) {Aren\'t you thinking|Don\'t you think} about your future now?', '<b>now</b> + think about (zastanawiać się) → Present Continuous: Aren’t you thinking.'),
  zd('Who (talk) {has been talking|has talked} to them lately?', '<b>lately</b> → Present Perfect (Continuous).'),
  zd('How long ago (she / be) {was she} at the hairdresser’s?', '<b>ago</b> → Past Simple.'),
  zd('What time (he / get) {did he get} to work yesterday morning?', '<b>yesterday morning</b> → Past Simple.'),
  zd('Where (you / fly) {will you be flying} this time tomorrow?', '<b>this time tomorrow</b> → Future Continuous.'),
  zd('(she / learn) {Has she learnt|Has she been learning} English up to now?', '<b>up to now</b> → Present Perfect (Continuous). learn – learnt/learned.'),
  zd('How much sulphur dioxide (get) {got} into the atmosphere last night?', '<b>last night</b> → Past Simple.'),
  zd('Which friend (she / like) {does she like} best now?', 'Like = czasownik stanu → Present Simple (nie „is she liking”).'),
  zd('Tom (go) {is going|is going to go} to Greece on a business trip tomorrow but he (not pack) {hasn\'t packed} his suitcase yet.', 'Ustalony plan na jutro → Present Continuous. <b>yet</b> → Present Perfect.'),
  zd('I hope there won’t be any delays. According to the timetable, the train (leave) {leaves} at 4:15.', 'Rozkład jazdy → <b>Present Simple</b>.'),
];

// ─────────────────────────────── arkusz III: teksty ───────────────────────────────
const tekst = (q, t, x) => {
  let i = 0;
  const luki = [...t.matchAll(/\{(.+?)\}/g)].map((m) => warianty(m[1].split('|')));
  return LUKI(q, t.replace(/\{.+?\}/g, () => `[[${luki[i++].join('|')}]]`), null, x);
};
const ARKUSZ3 = [
  tekst('Tekst 1 · Chińska restauracja', 'A: I {am thinking} (think) of going to that new Chinese restaurant in the city centre to celebrate my birthday. {Have you been} (you/be) there yet? B: No, I {haven\'t been|haven\'t} (not/be) but people {say} (say) that the food is fantastic. A: Would you like to go there next weekend? B: Yes, that’s a great idea. I {will write} (write) it in my diary now.',
    'think of = rozważać → <b>Present Continuous</b>. yet → <b>Present Perfect</b>. people say → Present Simple. Decyzja w chwili mówienia → <b>will</b>.'),
  tekst('Tekst 2 · John', 'John {left} (leave) the house in a rush this morning. As he {was driving} (drive) to work he suddenly {remembered} (remember) that he {had been asked} (be/asked) to speak at a conference. He {looked} (look) at his watch and {saw} (see) that it was nearly time for the conference to begin.',
    'this morning (minął) → Past Simple. As he was driving = tło → Past Continuous. Poproszono go <b>wcześniej</b> → had been asked (Past Perfect, strona bierna).'),
  tekst('Tekst 3 · Sam', 'Last March Sam {decided} (decide) that he {had had} (have) enough of working in a bank and that he {would ride|was going to ride} (ride) around the world on a bicycle. He {left} (leave) England two weeks later with his bike, a rucksack and a tent. He {has been} (be) away for six months now, and no one {knows} (know) whether he {will return|will come back|is going to return} (return) or not.',
    'Przyszłość widziana z przeszłości → <b>would</b> ride. for six months now → <b>Present Perfect</b>. know = stan → Present Simple.'),
  tekst('Tekst 4 · Joan i Paul', 'Joan and Paul {are arguing} (argue) in the next room at the moment. It {seems} (seem) that Paul {came} (come) in late last night after he {had promised} (promise) Joan that he {would be} (be) home in time for dinner. By the time he {got} (get) home, Joan {had given} (give) his dinner to the dog and {had been waiting} (wait) by the window for two hours!',
    'at the moment → Present Continuous. last night → Past Simple. after he had promised → Past Perfect. By the time he got home → had given, had been waiting (for two hours).'),
  tekst('Tekst 5 · Wakacje', 'A: {Are you going|Are you going to go|Will you go} (you/go) on holiday to Germany this year? B: No, we {go} (go) there every year, so we want a change this year. A: Where {are you planning|do you plan} (you/plan) to go instead? B: Well, we {have been told|were told} (be/told) that Greece is a beautiful country so we {have already booked} (already/book) a two-week holiday on Corfu.',
    'Plany → Present Continuous. every year → Present Simple. we have been told (strona bierna, skutek teraz). already → Present Perfect.'),
  tekst('Tekst 6a · Susan', 'Susan {has been studying} (study) interior design part time for three years and she {is getting|will get|gets|is going to get} (get) her diploma next month. Since she {has worked|has been working} (work) in the same company for over ten years she {feels} (feel) that she {needs} (need) a change, so she {is planning|plans} (plan) to open her own design business.',
    'for three years → Present Perfect Continuous. Since = ponieważ (tu nie „od”). feel, need = stany → Present Simple.'),
  tekst('Tekst 6b · Susan', 'She {is starting|will start|is going to start|starts} (start) looking for an office next week, and she {hopes} (hope) she {will find|will have found} (find) something in a good location and at a reasonable price by the end of the month. Her tutors {have told|told} (tell) her that she {is} (be) very talented and they {have assured|assured} (assure) her that she {will make} (make) a success of the business.',
    'Plan na przyszły tydzień → Present Continuous. hope + will find. Skutek teraz → have told, have assured.'),
  tekst('Tekst 7a · Jim', 'Jim {was walking} (walk) along the High Street when he {noticed} (notice) someone behind him. Actually, a strange man {had been following} (follow) him since he {had got off|got off} (get off) the bus. Jim {stopped} (stop) at a shop window. The man {came} (come) closer to him.',
    'Szedł (tło) → Past Continuous, zauważył → Past Simple. Śledził go <b>od</b> wyjścia z autobusu do tamtej chwili → Past Perfect Continuous.'),
  tekst('Tekst 7b · Jim', 'Jim {had} (have) the feeling he {had seen} (see) him before, so he {went} (go) up to him and {asked} (ask): “{Don\'t I know} (not/I/know) you? Why {are you following me} (you/follow/me)?” The man {smiled} (smile) and {said} (say): “Smile! You {are} (be) on Candid Camera!”',
    'Widział go wcześniej → Past Perfect. W cudzysłowie mowa na żywo: Don’t I know you? Why are you following me? You are on Candid Camera.'),
  tekst('Tekst 8 · Julie', 'Julie {has always wanted} (always/want) to be famous ever since she {was} (be) young. She {has been taking|has taken} (take) acting classes for years and last weekend someone {offered} (offer) her a part in an advertisement. They only {need|needed} (need) her voice, though, because it’s going to be on the radio. At least her career {has started} (start).',
    'ever since → Present Perfect. for years → Present Perfect Continuous. last weekend → Past Simple. Skutek teraz → has started.'),
  tekst('Tekst 9 · Tom', 'Tom {had been saving up|has been saving up} (save up) to go to France for months, and yesterday when he {counted} (count) his savings, he {realised} (realize) he had enough. Unfortunately, as he {was driving} (drive) to the travel agent’s he remembered that he {hadn\'t paid} (not/pay) his rent for two months so he {turned} (turn) round and {drove} (drive) back home again.',
    'Oszczędzał miesiącami do „wczoraj” → Past Perfect Continuous. As he was driving → tło. Nie zapłacił wcześniej → Past Perfect.'),
  tekst('Tekst 10 · Brazylia', 'Next month I {am visiting|am going to visit|will visit} (visit) my friend who {lives} (live) in Brazil. The flight from London {takes|will take} (take) about fifteen hours and I {have never been} (never/be) on a plane before. I {feel|am feeling} (feel) quite nervous about the journey but my friend {keeps} (keep) telling me that there {is} (be) nothing to worry about.',
    'Ustalony plan → Present Continuous. Rozkład / fakt → takes. never … before → Present Perfect. keep + -ing → keeps telling.'),
];

// ─────────────────────────────── rozpoznawanie (rozgrzewka przed wpisywaniem) ───────────────────────────────
const ROZ_PP_PS = [
  W('„I ___ my keys. I can’t open the door.”', ['have lost', 'lost', 'had lost', 'was losing'], 'Skutek widać teraz (nie mogę otworzyć) → <b>Present Perfect</b>.'),
  W('„I ___ my keys yesterday, but I found them.”', ['lost', 'have lost', 'had lost', 'have been losing'], '<b>yesterday</b> → Past Simple.'),
  W('„She ___ in Paris since 2019.”', ['has lived', 'lived', 'lives', 'is living'], '<b>since 2019</b> → Present Perfect. „Lives since” to typowy błąd z polskiego.'),
  W('„Shakespeare ___ 37 plays.”', ['wrote', 'has written', 'had written', 'has been writing'], 'Autor nie żyje → zamknięty okres → <b>Past Simple</b>.'),
  W('„___ you ever ___ sushi?”', ['Have … eaten', 'Did … eat', 'Had … eaten', 'Were … eating'], '<b>ever</b> = kiedykolwiek w życiu → Present Perfect.'),
  W('„When ___ you ___ your job?”', ['did … start', 'have … started', 'had … started', 'are … starting'], 'Pytanie <b>When…?</b> o moment w przeszłości → Past Simple.'),
  W('„We ___ three projects so far this year.”', ['have finished', 'finished', 'had finished', 'finish'], '<b>so far this year</b> → Present Perfect.'),
  W('„He ___ to London two years ago.”', ['moved', 'has moved', 'had moved', 'has been moving'], '<b>ago</b> → Past Simple.'),
  KAT('Które słowo-sygnał pasuje do którego czasu?', ['Present Perfect', 'Past Simple'], [['since', 0], ['so far', 0], ['yet', 0], ['already', 0], ['ever / never', 0], ['ago', 1], ['yesterday', 1], ['last week', 1], ['in 2010', 1], ['When…?', 1]], 'Present Perfect: do teraz, bez daty. Past Simple: konkretny moment w przeszłości.'),
];
const ROZ_PAST = [
  W('„While I ___ dinner, the phone rang.”', ['was cooking', 'cooked', 'had cooked', 'have cooked'], '<b>While</b> + tło przerwane czymś → Past Continuous.'),
  W('„When we arrived, the film ___.”', ['had already started', 'has already started', 'already starts', 'is already starting'], 'Film zaczął się <b>przed</b> naszym przyjściem → Past Perfect.'),
  W('„She was tired because she ___ all day.”', ['had been working', 'has been working', 'works', 'will work'], 'Pracowała cały dzień <b>do tamtej chwili</b> → Past Perfect Continuous.'),
  W('„I ___ him at the party last night.”', ['met', 'have met', 'had met', 'was meeting'], '<b>last night</b> → Past Simple.'),
  W('„They ___ for an hour when the bus finally came.”', ['had been waiting', 'have been waiting', 'are waiting', 'wait'], 'Godzina czekania do przyjazdu autobusu → Past Perfect Continuous.'),
  W('„At 8 p.m. yesterday we ___ TV.”', ['were watching', 'have watched', 'had been watched', 'watch'], 'W toku o konkretnej godzinie w przeszłości → Past Continuous.'),
  W('„After she ___ the report, she sent it to the boss.”', ['had written', 'has written', 'was writing', 'writes'], 'Najpierw napisała, potem wysłała → Past Perfect dla wcześniejszej czynności.'),
  KAT('Jaki to czas?', ['Past Simple', 'Past Continuous', 'Past Perfect', 'Past Perfect Cont.'], [['he crawled', 0], ['they caught', 0], ['she was jogging', 1], ['it was raining', 1], ['they had barricaded', 2], ['the dictator had plundered', 2], ['he had been going out', 3], ['she had been travelling', 3]], 'did → Past Simple; was/were + -ing → Past Continuous; had + III forma → Past Perfect; had been + -ing → Past Perfect Continuous.'),
];
const ROZ_MIX = [
  W('„This time tomorrow I ___ on the beach.”', ['will be lying', 'will lie', 'lie', 'have lain'], '<b>This time tomorrow</b> → Future Continuous.'),
  W('„By 2030 they ___ the bridge.”', ['will have built', 'will build', 'are building', 'build'], '<b>By 2030</b> → Future Perfect.'),
  W('„Look at those clouds! It ___ rain.”', ['is going to', 'will be', 'has', 'does'], 'Widać znaki → <b>going to</b>.'),
  W('„According to the timetable, the film ___ at 8 p.m.”', ['starts', 'has started', 'started', 'had started'], 'Rozkład, program → Present Simple.'),
  W('„I’ll call you as soon as I ___ home.”', ['get', 'will get', 'am getting', 'will have got'], 'Po <b>as soon as / when / in case / before</b> o przyszłości używamy czasu teraźniejszego.'),
  W('„By next month I ___ here for ten years.”', ['will have been working', 'will work', 'am working', 'have worked'], '<b>By next month</b> + <b>for ten years</b> → Future Perfect Continuous.'),
  W('„We ___ my grandparents next weekend — it’s all arranged.”', ['are visiting', 'visit', 'will have visited', 'visited'], 'Ustalony plan → Present Continuous.'),
  W('„My mother ___ twenty cigarettes a day.”', ['smokes', 'is smoking', 'has smoked', 'smoked'], 'Nawyk → Present Simple.'),
  W('„Which friend ___ best now?”', ['does she like', 'is she liking', 'has she liked', 'she likes'], 'Like = czasownik stanu → bez -ing. Pytanie: does she like.'),
  W('„Take an umbrella in case it ___.”', ['rains', 'will rain', 'is raining', 'rained'], 'Po <b>in case</b> czas teraźniejszy.'),
];

// numery zdań arkusza IV: zdanie 13 jest ucięte na zdjęciu
const NR4 = [...Array(12).keys()].map((i) => i + 1).concat([...Array(47).keys()].map((i) => i + 14));
if (NR4.length !== ARKUSZ4.length) throw new Error(`arkusz IV: ${ARKUSZ4.length} zdań, ${NR4.length} numerów`);
const kawalki = (lista, n) => { const out = []; for (let i = 0; i < lista.length; i += n) out.push(lista.slice(i, i + n)); return out; };

// ─────────────────────────────── karty „Nowe” ───────────────────────────────
const NOWE_PP_PS = [
  karta('Past Simple — zamknięta przeszłość', os([{ t: 'kropka', x: 90, l: 'yesterday' }], 'Past Simple: jedno zdarzenie w przeszłości'),
    'Zdarzenie w konkretnym, zakończonym czasie. Sygnały: <b>ago, yesterday, last…, in 2010, When…?</b>, osoba, która nie żyje.<br><i>She took a painkiller an hour ago.</i>'),
  karta('Present Perfect — przeszłość ważna teraz', os([{ t: 'pasek', od: 70, do: 210, l: 'since / for / so far' }], 'Present Perfect: od przeszłości do teraz'),
    'Bez daty, ze skutkiem teraz albo do teraz. have/has + III forma. Sygnały: <b>since, for (do teraz), so far, yet, already, ever, never, just, this month, today</b>.<br><i>She has been away since last week.</i>'),
  karta('Present Perfect Continuous — trwa i trwa', os([{ t: 'fala', od: 70, do: 210, l: 'for two hours (i nadal)' }], 'Present Perfect Continuous: czynność trwa do teraz'),
    'have/has been + -ing. Czynność zaczęła się w przeszłości i trwa; nacisk na czas trwania.<br><i>I have been trying to get in touch with her for the last two hours.</i>'),
];
const NOWE_PAST = [
  karta('Past Continuous — tło w toku', os([{ t: 'fala', od: 50, do: 150 }, { t: 'kropka', x: 110, l: 'nagle coś' }], 'Past Continuous: czynność w toku przerwana zdarzeniem'),
    'was/were + -ing. Coś trwało, gdy wydarzyło się coś innego. Sygnały: <b>while, when, at 8 yesterday, this time yesterday, all day yesterday</b>.<br><i>He was driving home when suddenly he had a puncture.</i>'),
  karta('Past Perfect — wcześniej niż inne zdarzenie', os([{ t: 'kropka', x: 60, l: 'had done' }, { t: 'kropka', x: 150, l: 'did' }, { t: 'strzalka', od: 60, do: 150 }], 'Past Perfect: zdarzenie wcześniejsze od innego w przeszłości'),
    'had + III forma. Sygnały: <b>before, after, by the time, already, no sooner … than, hardly … when</b>.<br><i>They had barricaded the door before the police arrived.</i>'),
  karta('Past Perfect Continuous — trwało do momentu', os([{ t: 'fala', od: 30, do: 150 }, { t: 'kropka', x: 150, l: 'moment w przeszłości' }], 'Past Perfect Continuous: czynność trwała do momentu w przeszłości'),
    'had been + -ing. Trwało przez jakiś czas aż do zdarzenia w przeszłości. Sygnał: <b>for … when / before</b>.<br><i>After he had been going out with Ann for two years, he proposed.</i>'),
];
const NOWE_MIX = [
  karta('Teraźniejszość', '',
    '<b>Present Simple</b>: nawyki, fakty, rozkłady, czasowniki stanu (like, know, need, seem).<br><i>She smokes twenty cigarettes a day. The train leaves at 4:15.</i><br><b>Present Continuous</b>: teraz, tymczasowo, ustalone plany.<br><i>Listen, somebody is coming. Laura is staying with her fiancé at present. Tom is going to Greece tomorrow.</i>'),
  karta('Przyszłość', os([{ t: 'fala', od: 235, do: 280, l: 'will be doing' }, { t: 'kropka', x: 255 }], 'Przyszłość: Future Continuous'),
    '<b>will</b>: przewidywanie, decyzja teraz (<i>I suppose he won’t accept</i>).<br><b>going to</b>: plan albo widać, co się stanie (<i>this balloon is going to go down</i>).<br><b>Future Continuous</b> will be + -ing: w toku w chwili w przyszłości (<i>this time tomorrow, all day tomorrow</i>).<br><b>Future Perfect</b> will have + III forma: gotowe przed chwilą w przyszłości (<i>by next December, by the end of…</i>).<br><b>Future Perfect Continuous</b> will have been + -ing: <i>by next Tuesday … for five months</i>.<br>Po <b>when, as soon as, before, by the time, in case</b> o przyszłości — czas teraźniejszy: <i>as soon as he finishes</i>.'),
];

// ─────────────────────────────── sekcja ───────────────────────────────
export const SEKCJA_CZASY = {
  id: 's2', nazwa: 'Czasy · arkusze z zajęć', pl: 'Present Perfect / Past Simple, czasy przeszłe, czasy mieszane i teksty do uzupełnienia — najpierw rozgrzewka, potem wpisywanie jak na kolokwium',
  jednostki: [
    {
      id: 't1', tytul: 'Present Perfect vs Past Simple', pl: 'arkusz I · 19 zdań', ikona: '⏱️', kolokwium: true, zrodlo: 'arkusz „Past tenses – exercises”, ćw. I',
      lekcje: [
        { id: 't1l1', tytul: 'Rozgrzewka: który czas?', ile: 9, nowe: NOWE_PP_PS, pula: ROZ_PP_PS },
        { id: 't1l2', tytul: 'Arkusz I · zdania 1–10', ile: 10, pula: ARKUSZ1.slice(0, 10) },
        { id: 't1l3', tytul: 'Arkusz I · zdania 11–19', ile: 9, pula: ARKUSZ1.slice(10) },
      ],
    },
    {
      id: 't2', tytul: 'Past tenses', pl: 'arkusz II · 15 zdań', ikona: '⏪', kolokwium: true, zrodlo: 'arkusz „Past tenses – exercises”, ćw. II',
      lekcje: [
        { id: 't2l1', tytul: 'Rozgrzewka: cztery czasy przeszłe', ile: 8, nowe: NOWE_PAST, pula: ROZ_PAST },
        { id: 't2l2', tytul: 'Arkusz II · zdania 1–8', ile: 8, pula: ARKUSZ2.slice(0, 8) },
        { id: 't2l3', tytul: 'Arkusz II · zdania 9–15', ile: 7, pula: ARKUSZ2.slice(8) },
      ],
    },
    {
      id: 't3', tytul: 'Mixed tenses', pl: 'arkusz IV · 59 zdań (bez 13: ucięte na zdjęciu)', ikona: '🔀', kolokwium: true, zrodlo: 'arkusz „IV Mixed tenses – exercises”',
      lekcje: [
        { id: 't3l1', tytul: 'Rozgrzewka: teraźniejszość i przyszłość', ile: 10, nowe: NOWE_MIX, pula: ROZ_MIX },
        ...kawalki(ARKUSZ4.map((c, i) => [NR4[i], c]), 10).map((k, i) => (
          { id: `t3l${i + 2}`, tytul: `Arkusz IV · zdania ${k[0][0]}–${k[k.length - 1][0]}`, ile: k.length, pula: k.map((x) => x[1]) })),
      ],
    },
    {
      id: 't4', tytul: 'Tense forms — revision', pl: 'arkusz III · 10 tekstów', ikona: '📄', kolokwium: true, zrodlo: 'arkusz „III Tense forms – revision”',
      lekcje: [
        { id: 't4l1', tytul: 'Teksty 1–3', ile: 3, pula: ARKUSZ3.slice(0, 3) },
        { id: 't4l2', tytul: 'Teksty 4–6', ile: 4, pula: ARKUSZ3.slice(3, 7) },
        { id: 't4l3', tytul: 'Teksty 7–8', ile: 3, pula: ARKUSZ3.slice(7, 10) },
        { id: 't4l4', tytul: 'Teksty 9–10', ile: 2, pula: ARKUSZ3.slice(10) },
      ],
    },
  ],
  powtorka: { id: 's2rep', tytul: 'Mieszanka czasów', ile: 15 },
};
