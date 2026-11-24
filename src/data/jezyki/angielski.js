// Kurs „Angielski” — Unit 6 „The business of tourism” (business English), ścieżka pod kolokwium z działu 6.
// Źródło: zdjęcia stron podręcznika: przegląd działu (s. 57), 6.1 ćw. 6–9 (s. 59), 6.2 (s. 60–61),
// 6.3 (s. 62–63), 6.4 (ćw. 1–6), 6.5 (ćw. 1–4). Brak stron: 6.1 ćw. 1–5, s. 120–121 (gramatyka),
// s. 141–142 (maile Yongli/James i notatki Greenleaves), s. 154 (transkrypt Ángela), transkrypty wideo.
// Lekcja „If and alternatives” i zwroty do networkingu i debaty to ogólny materiał do tych tematów (nie z podręcznika).
// Ćwiczenia to własne opracowanie; krótkie fragmenty artykułu i prezentacji służą tylko do ćwiczeń z dopasowaniem.
import { W, WIELE, P, U, PARY, KAT, LUKI, PISZ, F, en, tab, paryZ } from './narzedzia.js';
import { SEKCJA_CZASY } from './angielski-czasy.js';
import { SEKCJA_SLOWKA } from './angielski-slowka.js';

// ─────────────────────────────── 6.1 słownictwo ───────────────────────────────
// ćw. 6: lewe pudełko + prawe pudełko (rozwiązanie jednoznaczne: „tourism” jest w prawym pudełku raz,
// a „trap” pasuje tylko do „tourist”, więc eco- dostaje „resort”, a mass — „tourism”)
const KOLOKACJE = [
  ['bed and breakfast', 'pensjonat: pokój ze śniadaniem (B&B)'],
  ['eco-resort', 'ekologiczny ośrodek wypoczynkowy'],
  ['hotel chain', 'sieć hoteli'],
  ['mainland', 'ląd stały (w odróżnieniu od wysp)'],
  ['marine life', 'życie morskie: ryby, rafy, delfiny'],
  ['mass tourism', 'turystyka masowa'],
  ['national park', 'park narodowy'],
  ['overdevelop', 'nadmiernie zabudować'],
  ['package tour', 'wycieczka zorganizowana (lot + hotel w pakiecie)'],
  ['tour guide', 'przewodnik (osoba)'],
  ['tourist trap', 'pułapka na turystów: drogo i tandetnie'],
  ['whale-watching', 'obserwowanie wielorybów'],
  ['white-sand beach', 'plaża z białym piaskiem'],
];
const WYSPA = [
  ['lush valleys', 'bujne, zielone doliny'],
  ['crystal-clear waters', 'krystalicznie czysta woda'],
  ['remote', 'odległy, na uboczu'],
  ['underdeveloped', 'słabo rozwinięty'],
  ['wages', 'płace, wynagrodzenie'],
  ['to tip', 'dać napiwek'],
  ['housekeeper', 'pokojówka (sprząta pokoje w hotelu)'],
  ['sustainable', 'zrównoważony: nie niszczy środowiska'],
  ['unspoilt', 'nietknięty, niezniszczony (przez turystykę)'],
  ['accommodation', 'zakwaterowanie, noclegi'],
];
const DEBATA = [
  ["I'm in favour of…", 'jestem za…'],
  ["I'm against… / I'm opposed to…", 'jestem przeciw…'],
  ["That's a fair point, but…", 'słuszna uwaga, ale…'],
  ['On the other hand,…', 'z drugiej strony…'],
  ['I see what you mean. However,…', 'rozumiem, co masz na myśli. Jednak…'],
  ['What about…?', 'a co z…?'],
];

// ─────────────────────────────── 6.2 artykuł i gramatyka ───────────────────────────────
const ARTYKUL = [
  ['upmarket', 'ekskluzywny, z wyższej półki'],
  ['high-end', 'luksusowy, najwyższej klasy'],
  ['wealthy', 'zamożny'],
  ['homage', 'hołd'],
  ['cachet', 'prestiż'],
  ['hotspot', 'modne, oblegane miejsce'],
  ['to catch up with', 'dogonić'],
  ['GDP', 'PKB'],
  ['rowdy', 'hałaśliwy, awanturujący się'],
  ['short-term rentals', 'najem krótkoterminowy (np. przez aplikację)'],
  ['sustainability', 'zrównoważony rozwój'],
  ['booming', 'przeżywający boom, kwitnący'],
  ['revenue', 'przychód'],
  ['a shift toward', 'przesunięcie w stronę'],
  ['to be in its infancy', 'raczkować, być na samym początku'],
];
const CZASY = [
  ['Past Simple', 'did / was', 'zakończona czynność w przeszłości, zwykle z konkretnym czasem', 'In the 1960s, we <b>had</b> an authoritarian regime.'],
  ['Past Continuous', 'was / were doing', 'sytuacja w toku w danym momencie lub okresie w przeszłości (tło dla innej czynności)', '…when Spain <b>was booming</b> as a destination.'],
  ['Past Perfect Simple', 'had done', 'czynność zakończona przed inną czynnością albo przed momentem w przeszłości', 'In 2010, 52.7 m foreign tourists <b>had visited</b> Spain.'],
  ['Past Perfect Continuous', 'had been doing', 'sytuacja, która trwała (albo nie trwała) do jakiegoś momentu w przeszłości', '…a sector that always existed but <b>hadn’t been growing</b>.'],
  ['Present Perfect Simple', 'have / has done', 'przeszłość bez konkretnego czasu, ważna teraz; stan, który trwa do dziś', 'Spain <b>has</b> long <b>been</b> a low-cost destination.'],
  ['Present Perfect Continuous', 'have / has been doing', 'czynność zaczęta w przeszłości, która trwa nadal; podkreśla czas trwania', 'Tourist numbers <b>have been falling</b>.'],
];
const K_CZASY = CZASY.map((c) => c[0]);

// ─────────────────────────────── 6.3 networking ───────────────────────────────
const WIDEO = [
  ['off the beaten track', '(a place that is) not well-known and far away from places that people usually visit'],
  ['well-kept secret', 'something or somewhere known only to a few people'],
  ['interface', 'the way in which you see the information from a computer program on the screen'],
  ["pique someone's interest", 'make someone feel interested in something or someone'],
  ['novice', 'someone who has just begun learning a skill or activity'],
  ['get the hang of something', 'learn how to do something or use something'],
  ['homesick', 'sad, because you are away from home'],
  ['picturesque', '(a place that is) pretty in an old-fashioned way'],
  ['laid-back', 'relaxed and not seeming to worry about anything'],
  ["That's neat!", 'an expression used to say something is simple and effective'],
];
const WIDEO_PL = [
  ['off the beaten track', 'na uboczu, z dala od utartych szlaków'],
  ['well-kept secret', 'dobrze strzeżony sekret'],
  ['interface', 'interfejs (to, co widać na ekranie programu)'],
  ["pique someone's interest", 'wzbudzić czyjeś zainteresowanie'],
  ['novice', 'nowicjusz, początkujący'],
  ['get the hang of something', 'załapać, nabrać wprawy'],
  ['homesick', 'tęskniący za domem'],
  ['picturesque', 'malowniczy (ładny w starym stylu)'],
  ['laid-back', 'wyluzowany, spokojny'],
  ["That's neat!", 'sprytne! / fajnie to działa!'],
];
const MAIL_DONNY = [
  ['to attend', 'wziąć udział, przyjść na (wydarzenie)'],
  ['a trade fair', 'targi branżowe'],
  ['an exhibitor', 'wystawca (firma ze stoiskiem)'],
  ['to spread the word about', 'rozpowszechniać informacje o'],
  ['to drum up advertising', 'napędzić, pozyskać reklamy (reklamodawców)'],
  ['to pick up your media badge', 'odebrać identyfikator prasowy'],
  ['to cover an event', 'relacjonować wydarzenie (jako dziennikarz)'],
  ['industry insight', 'wiedza o branży, spojrzenie od środka'],
];

// ─────────────────────────────── 6.4 storytelling ───────────────────────────────
// ćw. 5A: etap struktury (1–10) → fragment prezentacji (a–j)
const ETAPY = [
  ['Make clear your intention to tell a story', 'b', 'To begin, however, I’d like to tell you about something that happened to me.'],
  ['Begin the story by introducing key people', 'i', 'So, the story starts with Tom.'],
  ['Give detail about what happened, explaining why events happened as they did', 'a', 'In the end, after a lot of thinking, we decided to go to a little Italian restaurant nearby.'],
  ['Introduce a powerful ‘turning point’', 'e', 'And then all of a sudden, Tom stops eating and looks at me, and says, ‘Ángel, I’ve made a decision. I’m leaving the company.’'],
  ['Focus on your emotions during the challenging times', 'c', 'I have to tell you, I was really shocked and disappointed.'],
  ['Describe how / why the ‘failure’ happened', 'f', 'The problem with all of this, Tom told me during dinner, was that I was never around. At the end of the day, for him, I didn’t care.'],
  ['Use irony when reflecting on what happened', 'h', 'And you know what the funny thing is, I realised my mistake only when he resigned …'],
  ['Highlight the moral of the story', 'j', 'So, … this has taught me an important lesson about leading people and about life – the need for us to care more about important relationships.'],
  ['Link from the story to the current context of your audience', 'g', 'And I think we can all learn from this because we all forget from time to time what is really important in life.'],
  ['Introduce the main subject of your presentation at the end of the story', 'd', 'So that’s what I want to talk about today: how, as an industry, you can show more care for our environment.'],
];
const ETAP_PL = ['zapowiedź historii', 'kluczowe osoby', 'szczegóły i przyczyny', 'punkt zwrotny', 'emocje', 'dlaczego się nie udało', 'ironia', 'morał', 'połączenie z publicznością', 'główny temat prezentacji'];
/** „Który to etap?” — fragment → numer i nazwa etapu; złe odpowiedzi to sąsiednie etapy. */
function ktoryEtap(i) {
  const [, , cytat] = ETAPY[i];
  const nazwa = (k) => `${k + 1}. ${ETAP_PL[k]}`;
  const zle = [i + 1, i - 1, i + 3].map((k) => (k + 10) % 10).filter((k) => k !== i);
  return W(`Który to etap historii?<br><i>${cytat}</i>`, [nazwa(i), ...zle.map(nazwa)],
    `To etap <b>${nazwa(i)}</b> (${ETAPY[i][0].toLowerCase()}). W podręczniku: fragment ${ETAPY[i][1]}.`);
}

// ─────────────────────────────── 6.5 e-mail ───────────────────────────────
const MAIL_KLIENT = [
  ['Positive opening', 'I would like to thank you for …'],
  ['Reason for writing', 'We have opened bookings for another group to visit Edinburgh. I have a few questions.'],
  ['Requirements', 'We would like you to organise everything else, including …'],
  ['Questions', 'Can you confirm your prices will remain the same?'],
  ['Negative points', 'Apparently there was some confusion over …'],
  ['Next steps', 'I would appreciate an early reply. Please (feel free to) email or call me directly if you have any questions.'],
  ['Positive ending', 'I look forward to working with you again. I hope that we will have a successful, long-term business relationship.'],
];
const MAIL_DOSTAWCA = [
  ['Friendly opening', 'Great to hear from you again.'],
  ['Positive start', 'The dates of your next trip, Feb 4–10, work well for us.'],
  ['Help and alternatives', 'Let me know if there is anything I can do this end re … / If you wish, we could …'],
  ['Answer questions', 'Yes, our prices will remain the same for your next visit.'],
  ['Dealing with negative points', 'Thank you for the feedback on the … Unfortunately, … There was a (double-booking) … they assured me it will not happen again.'],
  ['Friendly closing', 'We look forward to welcoming you here in Edinburgh.'],
];
const K_KLIENT = MAIL_KLIENT.map((m) => m[0]);


// ─────────────────────────────── fiszki: przykłady zdań ───────────────────────────────
const PRZYKLAD = {
  'bed and breakfast': 'We stayed at a cosy bed and breakfast in the hills.',
  'eco-resort': 'The eco-resort uses solar power and recycles its water.',
  'hotel chain': 'Big hotel chains are opening resorts on the coast.',
  'mainland': 'The ferry to the mainland takes an hour.',
  'marine life': 'Divers come here to see the marine life.',
  'mass tourism': 'Mass tourism has changed many Spanish beaches.',
  'national park': 'The national park protects rare animals.',
  'overdevelop': 'Some coastal towns have been overdeveloped.',
  'package tour': 'A package tour includes the flight and the hotel.',
  'tour guide': 'Our tour guide showed us the old town.',
  'tourist trap': 'That restaurant is a tourist trap. Avoid it!',
  'whale-watching': 'We went whale-watching in Iceland.',
  'white-sand beach': 'The island is famous for its white-sand beaches.',
  'lush valleys': 'The island has mountains and lush valleys.',
  'crystal-clear waters': 'Swim in the crystal-clear waters of the bay.',
  'remote': 'New roads connect remote villages.',
  'underdeveloped': 'The region is still underdeveloped.',
  'wages': 'Hotel staff are paid low wages.',
  'to tip': 'It’s a good idea to tip the waiters.',
  'housekeeper': 'The housekeeper cleans the rooms every morning.',
  'sustainable': 'We need more sustainable tourism.',
  'unspoilt': 'It’s one of the last unspoilt beaches in Europe.',
  'accommodation': 'Accommodation is expensive in August.',
  'upmarket': 'The hotel is in an upmarket neighbourhood.',
  'high-end': 'High-end travellers want authentic experiences.',
  'wealthy': 'Wealthy Europeans stay at the hotel.',
  'homage': 'The hotel is a homage to the Madrid of art and culture.',
  'cachet': 'Top restaurants add to Spain’s cachet as a luxury destination.',
  'hotspot': 'France and Italy are luxury hotspots.',
  'to catch up with': 'Spain is still far from catching up with France.',
  'GDP': 'Tourism accounts for almost 15 percent of Spain’s GDP.',
  'rowdy': 'Rowdy tourists annoy local residents.',
  'short-term rentals': 'The city wants limits on short-term rentals.',
  'sustainability': 'Spaniards are concerned about the sustainability of tourism.',
  'booming': 'In the 1960s, Spain was booming as a destination.',
  'revenue': 'Revenue per room fell by 11.3 percent.',
  'a shift toward': 'There is a shift toward luxury tourism.',
  'to be in its infancy': 'Luxury tourism in Madrid is still in its infancy.',
  'off the beaten track': 'We found a little village off the beaten track.',
  'well-kept secret': 'This beach is a well-kept secret.',
  'interface': 'The app has a simple interface.',
  "pique someone's interest": 'The headline piqued my interest.',
  'novice': 'I’m a complete novice at networking.',
  'get the hang of something': 'Don’t worry, you’ll soon get the hang of it.',
  'homesick': 'She felt homesick in her first month abroad.',
  'picturesque': 'It’s a picturesque fishing village.',
  'laid-back': 'The staff are very laid-back.',
  "That's neat!": 'You can book in one click? That’s neat!',
  'to attend': 'Can you attend the fair next Thursday?',
  'a trade fair': 'The trade fair has 5,000 exhibitors.',
  'an exhibitor': 'Talk to the exhibitors about advertising.',
  'to spread the word about': 'Spread the word about our magazine.',
  'to drum up advertising': 'See if you can drum up some advertising.',
  'to pick up your media badge': 'You can pick up your media badge at the entrance.',
  'to cover an event': 'Susan has been assigned to cover the fair.',
  'industry insight': 'Experts share their industry insight.',
};
const fiszki = (lista) => lista.map(([a, b]) => F(a, b, PRZYKLAD[a]));
const FISZKI_NETWORKING = [
  F('networking', 'nawiązywanie kontaktów zawodowych', 'Networking is more about farming than hunting.'),
  F('small talk', 'rozmowa o niczym ważnym', 'We made small talk about the weather.'),
  F('to come across as', 'sprawiać wrażenie', 'You don’t want to come across as lacking in confidence.'),
  F('imposition', 'narzucanie się, kłopot dla kogoś', 'Don’t say sorry for the imposition.'),
  F('fake it till you make it', 'udawaj pewność, aż ją zdobędziesz', 'Stay cool and fake it till you make it.'),
  F('to find common ground', 'znaleźć wspólny temat', 'Try to find common ground with the other person.'),
  F('to steer the conversation', 'kierować rozmową', 'She steered the conversation towards advertising.'),
];
const FISZKI_STORY = [
  F('all of a sudden', 'nagle', 'All of a sudden, Tom stops eating.'),
  F('a turning point', 'punkt zwrotny', 'That dinner was the turning point of the story.'),
  F('the moral of the story', 'morał historii', 'The moral of the story is: care about people.'),
  F('a rhetorical question', 'pytanie retoryczne', 'He ended with a rhetorical question.'),
  F('to resign', 'złożyć wypowiedzenie, zrezygnować', 'I realised my mistake only when he resigned.'),
  F('at the end of the day', 'koniec końców, w gruncie rzeczy', 'At the end of the day, for him, I didn’t care.'),
  F('the funny thing is', 'zabawne jest to, że', 'The funny thing is, I didn’t notice anything.'),
  F('to acknowledge a mistake', 'przyznać się do błędu', 'A good leader acknowledges his mistakes.'),
  F('to make a joke at yourself', 'żartować z samego siebie', 'He made a joke at himself to relax the audience.'),
  F('arsenal', 'arsenał (zbiór „broni”)', 'Stories are the most powerful weapon in a leader’s arsenal.'),
];
const FISZKI_MAIL = [
  F('an early reply', 'szybka odpowiedź', 'I would appreciate an early reply.'),
  F('feel free to', 'śmiało, nie krępuj się', 'Please feel free to call me directly.'),
  F('apparently', 'podobno, jak się okazuje', 'Apparently there was some confusion over the booking.'),
  F('confusion over', 'zamieszanie wokół', 'There was some confusion over the hotel rooms.'),
  F('this end', 'po naszej stronie, u nas', 'Let me know if there is anything I can do this end.'),
  F('re', 'w sprawie (regarding)', 'Re your email of 3 March…'),
  F('a double-booking', 'podwójna rezerwacja', 'Unfortunately, there was a double-booking.'),
  F('to assure', 'zapewnić', 'They assured me it will not happen again.'),
  F('unless', 'chyba że', 'We’ll book the hotel unless you tell us otherwise.'),
  F('provided that', 'pod warunkiem że', 'You get a discount provided that you pay now.'),
  F('in case', 'na wypadek gdyby', 'Take my number in case you get lost.'),
  F('otherwise', 'w przeciwnym razie', 'Please confirm by Monday; otherwise, we may lose the rooms.'),
];

// ─────────────────────────────── KURS ───────────────────────────────
export const KURS = {
  slug: 'angielski',
  jezyk: 'en-GB',
  po: 'angielsku',
  znaki: [],
  otwarte: true,
  etap: 'Etap',
  pochwaly: ['Great!', 'Well done!', 'Spot on!', 'Nice one!', 'Brilliant!', 'Dobrze!'],
  uwagaPisownia: '✓ Dobrze — sprawdź pisownię',
  okrzykBoss: 'You made it!',
  nazwa: 'Angielski',
  flaga: '🇬🇧',
  h1: 'Angielski',
  h1Grad: 'czasy i Unit 6 pod kolokwium',
  opis: 'Słówka z listy z zajęć jako fiszki (najpierw polski, potem angielski), wszystkie arkusze z czasami z zajęć (wpisujesz formy jak na kolokwium) i cały dział 6 „The business of tourism”: fiszki ze słówkami, kolokacje, artykuł, networking, storytelling i e-mail do partnera. Każda lekcja jest otwarta od razu, a na końcu czeka próbne kolokwium jako escape room.',
  kolokwium: { nazwa: 'kolokwium', jednostki: ['v1', 't1', 't2', 't3', 't4', 'u1', 'u2', 'u3', 'u4', 'u5'], boss: 'boss1' },
  sekcje: [
    SEKCJA_SLOWKA,
    SEKCJA_CZASY,
    {
      id: 's1', nazwa: 'Unit 6 · The business of tourism', pl: 'lekcje 6.1–6.5 w kolejności podręcznika · możesz zacząć od dowolnej',
      jednostki: [
        // ───────────── 6.1 ─────────────
        {
          id: 'u1', tytul: '6.1 The impact of tourism', pl: 'słownictwo: turystyka i hotelarstwo, kolokacje', ikona: '🏝️', kolokwium: true, zrodlo: 'podręcznik 6.1, s. 59, ćw. 6–9',
          lekcje: [
            { id: 'u1f', tytul: 'Fiszki: słówka 6.1', ile: 12, nowe: [{ h: 'Jak działają fiszki', html: 'Stuknij kartę, żeby ją odwrócić i usłyszeć wymowę. Potem oceń się uczciwie: <b>Umiem</b> albo <b>Jeszcze nie</b>. Fiszki „jeszcze nie” wracają na końcu lekcji i trafiają do „Powtórz błędy”.' }], pula: fiszki([...KOLOKACJE, ...WYSPA]) },
            {
              id: 'u1l1', tytul: 'Collocations — połącz słowa', ile: 10,
              nowe: [
                { h: '13 kolokacji z ćwiczenia 6', html: `Kolokacja to słowa, które „chodzą parami”. Słowo z lewego pudełka + słowo z prawego:${tab(KOLOKACJE.map(([a, b]) => [en(a), b]), ['kolokacja', 'znaczy'])}Do rozróżnienia:<br>• ${en('eco-tourism')} (ekoturystyka) też istnieje, ale w ćwiczeniu „tourism” jest tylko raz i zajmuje je ${en('mass tourism')}. Dlatego eco- łączy się z ${en('resort')}.<br>• ${en('tour guide')} to osoba, a ${en('package tour')} to wycieczka w pakiecie.<br>• ${en('overdeveloped')} = za bardzo zabudowany, a ${en('underdeveloped')} = słabo rozwinięty.` },
              ],
              pula: [
                PARY([['bed', 'and breakfast'], ['whale-', 'watching'], ['white-sand', 'beach'], ['hotel', 'chain'], ['main', 'land']], 'Połącz początek z końcem kolokacji'),
                PARY([['marine', 'life'], ['mass', 'tourism'], ['over', 'develop'], ['package', 'tour'], ['tour', 'guide']], 'Połącz początek z końcem kolokacji'),
                PARY([['national', 'park'], ['tourist', 'trap'], ['eco-', 'resort'], ['white-sand', 'beach'], ['bed', 'and breakfast']], 'Połącz początek z końcem kolokacji'),
                ...paryZ(KOLOKACJE, 5, 'Połącz kolokację ze znaczeniem'),
                W('Drogie, zatłoczone miejsce z tandetnymi pamiątkami, które istnieje tylko dla turystów, to…', ['a tourist trap', 'a tour guide', 'a package tour', 'a national park'], '<b>tourist trap</b> = pułapka na turystów. Tour guide to przewodnik, a package tour — wycieczka w pakiecie.'),
                W('Mieszkaniec wyspy mówi: „Twice a week I take the ferry to the …”', ['mainland', 'marine life', 'hotel chain', 'white-sand beach'], '<b>mainland</b> = ląd stały. Z wyspy płynie się promem właśnie tam.'),
                W('Lot, hotel i transfer kupione razem w biurze podróży to…', ['a package tour', 'a bed and breakfast', 'a tourist trap', 'an eco-resort'], '<b>package tour</b> = wycieczka zorganizowana w pakiecie.'),
                W('Które słowo z prawego pudełka pasuje do „eco-”, jeśli „tourism” zajęło już „mass”?', ['resort', 'trap', 'guide', 'chain'], '<b>eco-resort</b> = ekologiczny ośrodek. Każde słowo z pudełka jest użyte raz, a „trap” pasuje tylko do „tourist”.'),
                P('Ryby, rafy koralowe i delfiny to marine …', 'life', '<b>marine life</b> = życie morskie.', { pod: 'jedno słowo' }),
                P('Mały pensjonat: pokój i śniadanie. Bed and …', 'breakfast', '<b>bed and breakfast</b> (B&B) = pensjonat ze śniadaniem.', { pod: 'jedno słowo' }),
                P('Wybrzeże pełne betonowych hoteli jest over…', ['overdeveloped', 'developed'], '<b>overdeveloped</b> = nadmiernie zabudowany (over + develop).', { pod: 'dokończ słowo' }),
                KAT('Posortuj: nocleg, aktywność czy przyroda i miejsce?', ['nocleg', 'aktywność / wyjazd', 'przyroda i miejsce'], [['bed and breakfast', 0], ['eco-resort', 0], ['hotel chain', 0], ['whale-watching', 1], ['package tour', 1], ['national park', 2], ['white-sand beach', 2], ['marine life', 2]], 'Noclegi: B&B, eco-resort, sieć hoteli. Aktywności: whale-watching, package tour. Przyroda: park narodowy, plaża, życie morskie.'),
              ],
            },
            {
              id: 'u1l2', tytul: 'Tourism vocabulary in context', ile: 10,
              nowe: [
                { h: 'Słówka z tekstu o wyspie', html: `${tab(WYSPA.map(([a, b]) => [en(a), b]), ['po angielsku', 'znaczy'])}Przydatne zdania:<br>• ${en('It’s a good idea to tip waiters, housekeepers and tour guides.')} — warto dawać napiwki kelnerom, pokojówkom i przewodnikom.<br>• ${en('Visit the island before it becomes overdeveloped.')} — odwiedź wyspę, zanim zostanie zabudowana.<br>• ${en('The island is still somewhat underdeveloped.')} — wyspa jest wciąż dość słabo rozwinięta.` },
              ],
              pula: [
                LUKI('Uzupełnij tekst o wyspie Coralia.', 'Coralia is a small island an hour by ferry from the [[mainland]]. Most visitors come for its [[white-sand]] beaches, but you can also go [[whale-watching]] or dive and admire the colourful [[marine life]]. Many travellers book a [[package tour]], so big [[hotel chains]] have opened resorts on the coast. If you want to meet the locals, stay in a family-run [[bed and breakfast]] and hire a local [[tour guide]]. Go soon, before the island becomes [[overdeveloped]].', ['mainland', 'white-sand', 'whale-watching', 'marine life', 'package tour', 'hotel chains', 'bed and breakfast', 'tour guide', 'overdeveloped'], 'Wszystkie luki to kolokacje z ćwiczenia 6. „Before it becomes overdeveloped” = zanim zostanie zabudowana.'),
                ...paryZ(WYSPA.slice(0, 5), 5, 'Połącz słowo ze znaczeniem'),
                ...paryZ(WYSPA.slice(5), 5, 'Połącz słowo ze znaczeniem'),
                P('Would you offer rooms in your home or set up a … for visitors? (pokoje ze śniadaniem)', ['bed and breakfast', 'B&B', 'bed & breakfast'], '<b>set up a bed and breakfast</b> = założyć pensjonat.', { pod: 'trzy słowa' }),
                P('When you travel, do you prefer boutique hotels or larger hotel …?', ['chains', 'chain'], '<b>hotel chains</b> = sieci hoteli. Po „larger” liczba mnoga: chains.', { pod: 'jedno słowo' }),
                W('„Crowds of cheap-holiday visitors on the same beaches every summer” to przykład…', ['mass tourism', 'eco-tourism', 'whale-watching', 'a well-kept secret'], '<b>mass tourism</b> = turystyka masowa: dużo ludzi, tanio, te same miejsca.'),
                W('„The island is still somewhat … – there are few recycling facilities.”', ['underdeveloped', 'overdeveloped', 'overbooked', 'unspoilt'], '<b>underdeveloped</b> = słabo rozwinięty (mało infrastruktury). Overdeveloped to odwrotność: za dużo zabudowy.'),
                W('Pracownicy hoteli dostają niskie płace, więc warto…', ['tip waiters and housekeepers', 'book a package tour', 'go whale-watching', 'stay on the mainland'], '<b>to tip</b> = dać napiwek. Housekeeper = pokojówka.'),
                W('Co znaczy „unspoilt area”?', ['teren nietknięty przez turystykę i zabudowę', 'teren zniszczony przez turystów', 'teren zamknięty dla turystów', 'teren z wieloma hotelami'], '<b>unspoilt</b> = niezniszczony, w naturalnym stanie (spoil = zepsuć).'),
                P('Woda tak czysta, że widać dno: crystal-… waters', ['clear'], '<b>crystal-clear waters</b> = krystalicznie czysta woda.', { pod: 'jedno słowo' }),
                U('Ułóż: Odwiedź wyspę, zanim stanie się pułapką na turystów.', 'Visit the island before it becomes a tourist trap.', 'Po <b>before</b> o przyszłości używamy czasu teraźniejszego: before it <b>becomes</b>, nie „will become”.', ['will', 'guide'], { alt: ['Before it becomes a tourist trap, visit the island.'] }),
              ],
            },
            {
              id: 'u1l3', tytul: 'Project: the hotel debate', ile: 8,
              nowe: [
                { h: 'Debata: hotel w nietkniętej okolicy', html: `Sytuacja z projektu: mieszkasz w ${en('unspoilt area')} z wysokim bezrobociem. Międzynarodowa sieć hoteli chce zbudować duży kompleks. Grupy A i B mają karty z argumentami, potem głosowanie.<br><b>Argumenty za:</b> ${en('create jobs')}, ${en('boost the local economy')}, ${en('improve infrastructure')} (drogi, transport).<br><b>Argumenty przeciw:</b> ${en('spoil the landscape')}, ${en('seasonal, low-paid jobs')}, zyski dla sieci zamiast dla mieszkańców, szkody dla ${en('marine life')}.${tab(DEBATA.map(([a, b]) => [en(a), b]), ['zwrot do debaty', 'znaczy'])}` },
              ],
              pula: [
                KAT('Argument za budową hotelu czy przeciw?', ['for (za)', 'against (przeciw)'], [['It will create hundreds of jobs.', 0], ['It will boost the local economy.', 0], ['The region will get better roads.', 0], ['Young people won’t have to move away.', 0], ['It will spoil the landscape.', 1], ['Most jobs will be seasonal and low-paid.', 1], ['Profits will go abroad.', 1], ['It could damage marine life.', 1]], 'Za: miejsca pracy, gospodarka, infrastruktura. Przeciw: krajobraz, sezonowe prace, zyski poza regionem, przyroda.'),
                PARY(DEBATA.slice(0, 5), 'Połącz zwrot z tłumaczeniem'),
                W('Chcesz grzecznie się nie zgodzić. Co powiesz?', ['That’s a fair point, but the jobs will only be seasonal.', 'You are wrong. The jobs are bad.', 'No. Seasonal jobs.', 'I am agree with you, but jobs are seasonal.'], '<b>That’s a fair point, but…</b> — najpierw docenić, potem kontrargument. „I am agree” to błąd: mówimy <b>I agree</b>.'),
                W('Które zdanie jest poprawne?', ['I’m in favour of the new hotel.', 'I’m in favour for the new hotel.', 'I’m favour of the new hotel.', 'I’m on favour of the new hotel.'], '<b>be in favour of</b> something = być za czymś. Przyimki: in + of.'),
                W('„It will boost the local economy” znaczy, że hotel…', ['pobudzi lokalną gospodarkę', 'zniszczy lokalną gospodarkę', 'zastąpi lokalną gospodarkę', 'zbada lokalną gospodarkę'], '<b>boost</b> = pobudzić, wzmocnić.'),
                U('Ułóż: Z drugiej strony większość prac będzie sezonowa.', 'On the other hand, most jobs will be seasonal.', '<b>On the other hand</b> = z drugiej strony. Przecinek po zwrocie.', ['hands', 'season']),
                P('Uzupełnij: I see what you …. However, we need the jobs.', 'mean', '<b>I see what you mean</b> = rozumiem, co masz na myśli.', { pod: 'jedno słowo' }),
                PISZ('Napisz 3–4 zdania na debatę: jesteś za albo przeciw nowemu hotelowi. Użyj co najmniej dwóch zwrotów z karty.', 'I’m against the new hotel complex. On the one hand, it will create jobs. On the other hand, most of them will be seasonal and low-paid, and the profits will go to the international chain. What about our unspoilt landscape and marine life?', ['stanowisko na początku: I’m in favour of / I’m against…', 'argument + kontrargument: On the one hand… On the other hand…', 'słówka z działu: unspoilt, marine life, boost the local economy', 'pytanie na koniec: What about…?']),
              ],
            },
          ],
        },
        // ───────────── 6.2 ─────────────
        {
          id: 'u2', tytul: '6.2 Evolving tourism', pl: 'artykuł o Hiszpanii, czasy przeszłe, discourse markers', ikona: '🇪🇸', kolokwium: true, zrodlo: 'podręcznik 6.2, s. 60–61, ćw. 2–8',
          lekcje: [
            { id: 'u2f', tytul: 'Fiszki: słówka z artykułu', ile: 12, pula: fiszki(ARTYKUL) },
            {
              id: 'u2l1', tytul: 'Reading: from mass market to luxury', ile: 10,
              nowe: [
                { h: 'O czym jest artykuł', html: `Hiszpania zmienia wizerunek: z taniej turystyki masowej na luksus.<br>• Ms García Castelo prowadzi ${en('Heritage Madrid Hotel')} w ekskluzywnej dzielnicy Salamanca. Pokój kosztuje 250–1200 € za noc. Goście to zamożni Europejczycy i Latynosi: szukają gastronomii i luksusowych zakupów.<br>• W latach 60. Hiszpania „wymyśliła” turystykę masową dla klasy robotniczej z Europy. Główny eksport: pomarańcze, buty i słońce.<br>• 2017: 81,9 mln turystów, 87 mld €. Drugie miejsce na świecie po Francji. Turystyka to prawie 15% PKB.<br>• ${en('Aubocassa')}: farma oliwek na Majorce z luksusową „turystyką oliwną”.<br>• Sierpień 2018: turystów mniej o 1,9%, ale wydali o 1,8% więcej (11,5 mld €).<br>• Hałaśliwi turyści → żądania limitów najmu krótkoterminowego → ${en('turismofobia')}.<br>• Madryt jako cel luksusowy dopiero raczkuje w porównaniu z Paryżem czy Londynem.` },
                { h: 'Słówka z artykułu', html: tab(ARTYKUL.map(([a, b]) => [en(a), b]), ['po angielsku', 'znaczy']) },
              ],
              pula: [
                ...paryZ(ARTYKUL.slice(0, 5), 5, 'Połącz słowo ze znaczeniem'),
                ...paryZ(ARTYKUL.slice(5, 10), 5, 'Połącz słowo ze znaczeniem'),
                ...paryZ(ARTYKUL.slice(10), 5, 'Połącz słowo ze znaczeniem'),
                W('Jakich turystów Hiszpania chce teraz przyciągnąć?', ['zamożnych, szukających luksusu', 'tanich, na wczasach w pakiecie', 'studentów z plecakami', 'tylko turystów biznesowych'], 'Artykuł opisuje zmianę <b>from mass market to luxury</b>: od turystyki masowej do luksusu.'),
                W('Które miejsce na świecie zajmowała Hiszpania w 2017 r. pod względem liczby turystów?', ['drugie, po Francji', 'pierwsze, przed Francją', 'trzecie, po Francji i Włoszech', 'drugie, po Włoszech'], '81,9 mln turystów: <b>the world’s second most visited country, behind France</b>.'),
                W('Co było głównym „eksportem” Hiszpanii w latach 60.?', ['pomarańcze, buty i słońce', 'oliwa, wino i ser', 'hotele, plaże i słońce', 'samochody, buty i wino'], '„Our main exports were <b>oranges, shoes and sunshine</b>”.'),
                W('Czym jest Aubocassa?', ['farmą oliwek na Majorce z luksusową turystyką oliwną', 'hotelem w Madrycie', 'restauracją w Kraju Basków', 'siecią hoteli w Katalonii'], 'Aubocassa = <b>an olive farm in Mallorca</b> that offers a luxury oil tourism experience.'),
                WIELE('Sierpień 2018. Zaznacz wszystkie zdania zgodne z artykułem.', ['Fewer people visited Spain than a year earlier.', 'Tourists spent more money.', 'Spending rose by 1.8%.', 'Tourist numbers rose by 1.9%.', 'Spending fell to €11.5 bn.'], [0, 1, 2], 'Turystów było mniej (−1,9%), ale wydali więcej (+1,8%, do 11,5 mld €). Dlatego zwrot ku luksusowi „comes at a good time”.'),
                W('Skąd się wzięła „turismofobia”?', ['z hałaśliwych turystów i żądań limitów najmu krótkoterminowego', 'ze zbyt wysokich cen hoteli', 'ze spadku liczby turystów', 'z braku luksusowych hoteli'], '<b>Rowdy tourist behaviour has led to calls for limits on short-term rentals</b>, a to wywołało turismofobię.'),
                W('„Compared with Paris or London, we are still in our infancy.” Co to znaczy?', ['Madryt jako luksusowy cel dopiero zaczyna', 'Madryt jest lepszy niż Paryż i Londyn', 'Madryt jest za mały na turystów', 'Madryt przyciąga głównie rodziny z dziećmi'], '<b>be in your infancy</b> = być na samym początku, raczkować.'),
                P('Uzupełnij: Directly and indirectly, tourism accounts for almost 15 percent of Spain’s …', ['GDP', 'gross domestic product'], '<b>GDP</b> = gross domestic product = PKB.', { pod: 'skrót' }),
              ],
            },
            {
              id: 'u2l2', tytul: 'Article: extracts a–j', ile: 10,
              nowe: [
                { h: 'Jak dopasować fragmenty do luk', html: `W ćwiczeniu 3 każdy fragment a–j pasuje do jednej luki. Wskazówki:<br>• <b>gramatyka</b>: po „Europeans and Latin Americans” pasuje imiesłów (${en('looking first for…')}), po „a sector” — zdanie względne (${en('that always existed…')});<br>• <b>czas</b>: „In 2010” + „and spent” → zdanie o przeszłości (${en('had visited')});<br>• <b>logika</b>: średnik i „in August 2018 … down 1.9 percent” → zdanie o spadku (${en('Although tourist numbers … have been falling')});<br>• <b>zaimki</b>: „It more or less invented mass tourism” — „It” to Hiszpania, więc zdanie wcześniej musi mówić o Hiszpanii.<br>Rozwiązanie: 1 b, 2 j, 3 h, 4 i, 5 c, 6 g, 7 f, 8 e, 9 a, 10 d.` },
              ],
              pula: [
                W('Luka 1: „…are wealthy Europeans and Latin Americans ___.”', ['looking first for a mix of gastronomy and also for high-end shopping', 'when Spain was booming as a destination', 'that always existed but hadn’t been growing', 'of tourism'], 'Po opisie gości pasuje imiesłów: kogo szukają → <b>b</b> (looking first for…).'),
                W('Luka 2: „My family’s idea … was to do a sort of homage to the Madrid of art and culture. ___ for high-end cultural tourism.”', ['It seemed to us that Madrid had what was needed', 'Spain has long been a low-cost destination', 'Now Spain is fully developed', 'In recent years, rowdy tourist behaviour has led to'], 'Mówi właścicielka hotelu o Madrycie: Madryt miał to, czego trzeba <b>for high-end cultural tourism</b> → <b>j</b>.'),
                W('Luka 3: „___. It more or less invented mass tourism in the 1960s…”', ['Spain has long been a low-cost destination', 'It seemed to us that Madrid had what was needed', 'In 2010, 52.7 m foreign tourists had visited Spain', 'Although tourist numbers in Spain have been falling'], '„It” w następnym zdaniu to Hiszpania, a „mass tourism” pasuje do „low-cost destination” → <b>h</b>.'),
                W('Luka 4: „It more or less invented mass tourism in the 1960s, ___ for Europe’s working classes.”', ['when Spain was booming as a destination', 'looking first for a mix of gastronomy', 'that always existed but hadn’t been growing', 'of tourism'], 'Po „in the 1960s” — <b>when</b> + tło w Past Continuous (was booming) → <b>i</b>.'),
                W('Luka 5: „___ and spent €48.9 bn, while 2017 saw 81.9 m visitors who spent €87 bn.”', ['In 2010, 52.7 m foreign tourists had visited Spain', 'In the 1960s, we had an authoritarian regime', 'Although tourist numbers in Spain have been falling', 'Spain has long been a low-cost destination'], 'Liczby turystów i „and spent” → porównanie 2010 z 2017 → <b>c</b>.'),
                W('Luka 6: „‘___, and our main exports were oranges, shoes and sunshine,’ says Francisco Rabena.”', ['In the 1960s, we had an authoritarian regime and our tourist industry wasn’t well-developed', 'Now Spain is fully developed and Spaniards are concerned about the sustainability', 'It seemed to us that Madrid had what was needed', 'Spain has long been a low-cost destination'], '„Were” (Past Simple) i dawny eksport → opis przeszłości → <b>g</b>.'),
                W('Luka 7: „‘___ of tourism.’”', ['Now Spain is fully developed and Spaniards are concerned about the sustainability', 'In the 1960s, we had an authoritarian regime', 'that always existed but hadn’t been growing', 'when Spain was booming as a destination'], 'Fragment kończy się na „the sustainability”, a luka — na „of tourism”: razem <b>the sustainability of tourism</b> → <b>f</b>.'),
                W('Luka 8: „‘We opened a sector ___,’ says Agustín Santolaya.”', ['that always existed but hadn’t been growing', 'looking first for a mix of gastronomy', 'when Spain was booming as a destination', 'of tourism'], 'Po rzeczowniku „a sector” pasuje zdanie względne <b>that…</b> → <b>e</b>.'),
                W('Luka 9: „The shift toward luxury comes at a good time for Spain. ___; in August 2018 10.2 m people visited Spain, down 1.9 percent…”', ['Although tourist numbers in Spain have been falling', 'In 2010, 52.7 m foreign tourists had visited Spain', 'Spain has long been a low-cost destination', 'Now Spain is fully developed'], 'Dalej jest dowód spadku (down 1.9 percent) → <b>a</b>. Although = chociaż.'),
                W('Luka 10: „___ calls for limits on short-term rentals, prompting what is known as turismofobia.”', ['In recent years, rowdy tourist behaviour has led to', 'Although tourist numbers in Spain have been falling', 'Now Spain is fully developed and', 'It seemed to us that'], '„Has led to” + „calls for limits” → <b>d</b>. Lead to = doprowadzić do.'),
              ],
            },
            {
              id: 'u2l3', tytul: 'Past tenses — który czas?', ile: 10,
              nowe: [
                { h: 'Sześć czasów z ćwiczenia 5A', html: `${tab(CZASY.map(([n, f, u, p]) => [`<b>${n}</b><br><small>${f}</small>`, u, en(p)]), ['czas', 'kiedy', 'przykład z artykułu'])}Słowa-sygnały:<br>• ${en('in 2010, in the 1960s, yesterday, ago')} → Past Simple;<br>• ${en('when / while')} + tło → Past Continuous;<br>• ${en('before, by the time, already')} (w przeszłości) → Past Perfect;<br>• ${en('for, since, long, in recent years')} (do teraz) → Present Perfect (Continuous).` },
              ],
              pula: [
                KAT('Posortuj czasowniki z artykułu według czasu.', K_CZASY, [['we had an authoritarian regime', 0], ['it seemed to us', 0], ['Spain was booming', 1], ['tourists had visited', 2], ['it hadn’t been growing', 3], ['behaviour has led to', 4], ['Spain has long been', 4], ['numbers have been falling', 5]], 'had, seemed → Past Simple; was booming → Past Continuous; had visited → Past Perfect; hadn’t been growing → Past Perfect Continuous; has led, has been → Present Perfect; have been falling → Present Perfect Continuous.'),
                W('„Tourist numbers <b>have been falling</b>.” Dlaczego ten czas?', ['spadek zaczął się w przeszłości i trwa nadal', 'spadek skończył się w konkretnym roku', 'spadek był tłem dla innej czynności', 'spadek nastąpił przed innym wydarzeniem w przeszłości'], '<b>Present Perfect Continuous</b>: od jakiegoś czasu do teraz, z naciskiem na trwanie.'),
                W('„…a sector that always existed but <b>hadn’t been growing</b>.” Jaki to czas?', ['Past Perfect Continuous', 'Past Continuous', 'Present Perfect Continuous', 'Past Perfect Simple'], '<b>had + been + -ing</b> = Past Perfect Continuous: sektor nie rósł aż do momentu, gdy go „otworzyli”.'),
                W('„…when Spain <b>was booming</b> as a destination.” Jaki to czas i po co?', ['Past Continuous — sytuacja w toku w latach 60.', 'Past Simple — jednorazowe zdarzenie', 'Present Perfect — skutek widoczny dziś', 'Past Perfect — coś wcześniej niż lata 60.'], '<b>was + -ing</b> = Past Continuous: tło, sytuacja trwająca w danym okresie.'),
                W('„In 2010, 52.7 m foreign tourists <b>had visited</b> Spain.” Jaki to czas?', ['Past Perfect Simple', 'Present Perfect Simple', 'Past Simple', 'Past Perfect Continuous'], '<b>had + III forma</b> (visited) = Past Perfect Simple.'),
                W('Wybierz poprawne: „Spain ___ a low-cost destination for a long time.”', ['has been', 'was being', 'had been being', 'is'], 'Stan trwający od dawna do dziś → <b>Present Perfect</b>: has been. „Is … for a long time” to typowy błąd z polskiego („jest od dawna”).'),
                W('Wybierz poprawne: „While we ___ in, the fire alarm went off.”', ['were checking', 'checked', 'have checked', 'had checked'], 'Czynność w toku (tło) przerwana inną → <b>Past Continuous</b>: were checking.'),
                W('Wybierz poprawne: „By the time we arrived, the tour ___.”', ['had already started', 'has already started', 'already starts', 'is already starting'], '<b>By the time</b> + przeszłość → wcześniejsza czynność w <b>Past Perfect</b>: had started.'),
                W('Wybierz poprawne: „Since 2015 the number of visitors ___.”', ['has doubled', 'doubled', 'had doubled', 'was doubling'], '<b>Since</b> + okres do teraz → <b>Present Perfect</b>: has doubled.'),
                W('Wybierz poprawne: „We ___ for the guide for 40 minutes and he still isn’t here!”', ['have been waiting', 'waited', 'had been waiting', 'were waiting'], 'Trwa do teraz („still isn’t here”), nacisk na czas → <b>Present Perfect Continuous</b>.'),
                W('Wybierz poprawne: „I ___ at the hotel for three years when it closed.”', ['had been working', 'have been working', 'was working', 'worked'], 'Trwało do momentu w przeszłości (when it closed) i liczymy czas (for three years) → <b>Past Perfect Continuous</b>.'),
              ],
            },
            {
              id: 'u2l4', tytul: 'Past tenses — wpisz formę (6A)', ile: 9,
              nowe: [
                { h: 'Formy nieregularne z ćwiczenia 6A', html: `${tab([[en('run'), en('ran'), en('run')], [en('take over'), en('took over'), en('taken over')], [en('shrink'), en('shrank'), en('shrunk')], [en('bring'), en('brought'), en('brought')], [en('feel'), en('felt'), en('felt')], [en('be'), en('was / were'), en('been')]], ['bezokolicznik', 'Past Simple', 'III forma'])}Pułapka: ${en('found')} (założyć) jest regularny: ${en('found – founded – founded')}. A ${en('found')} jako przeszłość od ${en('find')} to zupełnie inne słowo.` },
              ],
              pula: [
                P('In the 1960s, the family … (run) a three-star hotel in Madrid.', ['ran', 'were running'], 'Konkretny okres w przeszłości → Past Simple <b>ran</b> (run – ran – run). „Were running” też pasuje: sytuacja w toku w latach 60.', { pod: 'forma czasownika' }),
                P('…a hotel which her grandfather … (found) years before.', ['had founded'], 'Założenie hotelu było wcześniej niż lata 60. → Past Perfect: <b>had founded</b> (found – founded – founded = założyć).', { pod: 'forma czasownika' }),
                P('Then, in the 1990s, the family … (take over) a failing hotel project.', ['took over'], 'Then + in the 1990s → Past Simple: <b>took over</b>.', { pod: 'forma czasownika' }),
                P('…and … (launch) the five-star hotel we see today.', ['launched'], 'Kolejne zdarzenie w latach 90. → Past Simple: <b>launched</b>.', { pod: 'forma czasownika' }),
                P('More recently, technology and easy air travel … (shrink) distances.', ['have shrunk'], 'Skutek widoczny dziś, bez daty → Present Perfect: <b>have shrunk</b> (shrink – shrank – shrunk).', { pod: 'forma czasownika' }),
                P('This means that for some years now high-end travellers … (demand) authentic local experiences.', ['have been demanding', 'have demanded'], 'Trend od jakiegoś czasu do teraz → <b>have been demanding</b> (nacisk na trwanie). „Have demanded” też jest poprawne.', { pod: 'forma czasownika' }),
                P('The luxury market … (bring) in €9.2 bn the previous year.', ['brought', 'had brought'], '„The previous year” = konkretny czas w przeszłości → <b>brought</b>. „Had brought” jest możliwe, gdy liczymy od innego momentu w przeszłości.', { pod: 'forma czasownika' }),
                P('Revenue per room in Barcelona … (be) down 11.3 percent in 2018.', ['was'], 'Konkretny rok → Past Simple: <b>was</b>.', { pod: 'forma czasownika' }),
                P('…because of how luxury clients … (feel) about insecurity during their trips.', ['felt', 'had felt', 'were feeling'], 'Opis przeszłości → Past Simple: <b>felt</b> (feel – felt – felt). „Had felt” i „were feeling” też pasują.', { pod: 'forma czasownika' }),
                W('Który zapis jest poprawny?', ['Her grandfather had founded the hotel.', 'Her grandfather had found the hotel.', 'Her grandfather had finded the hotel.', 'Her grandfather has founded the hotel in 1950.'], '<b>found – founded – founded</b> = założyć. „Had found” to „znalazł”. Z datą (in 1950) nie używamy Present Perfect.'),
                U('Ułóż: Rodzina przejęła upadający projekt w latach 90.', 'The family took over a failing project in the 1990s.', 'Konkretny czas (in the 1990s) → Past Simple: <b>took over</b>.', ['has', 'taken'], { alt: ['In the 1990s, the family took over a failing project.'] }),
              ],
            },
            {
              id: 'u2l5', tytul: 'Discourse markers & reference', ile: 10,
              nowe: [
                { h: 'Wyrażenia czasu (discourse markers)', html: `${tab([['<b>point in time</b><br>moment', en('in 2010, in the 1960s, in the 1990s, in 2018, the previous year, now, when…')], ['<b>duration</b><br>czas trwania', en('in recent years, (has) long (been), for three years, since 2015, during their trips, over the past decade')], ['<b>sequence</b><br>kolejność', en('first, then, after that, later, eventually, finally')]], ['typ', 'przykłady'])}${en('then')} może znaczyć „potem” (kolejność) albo „wtedy” (moment).` },
                { h: 'Do czego odnoszą się zaimki', html: `Zaimek zastępuje coś, co już padło w tekście:<br>• ${en('<u>It</u> more or less invented mass tourism in the 1960s, <u>when</u> Spain was booming…')} → It = Spain, when = in the 1960s.<br>• ${en('a hotel <u>which</u> her grandfather had founded')} → which = the hotel.<br>• ${en('…the luxury market brought in €9.2 bn. <u>That</u> is a third of…')} → That = €9.2 bn.<br>• ${en('…how <u>they</u> felt during <u>their</u> trips')} → they, their = luxury clients.` },
              ],
              pula: [
                KAT('Posortuj: moment, czas trwania czy kolejność?', ['point in time', 'duration', 'sequence'], [['in 2010', 0], ['in the 1960s', 0], ['the previous year', 0], ['in recent years', 1], ['for three years', 1], ['since 2015', 1], ['first', 2], ['after that', 2], ['eventually', 2]], 'Moment: kiedy dokładnie. Czas trwania: jak długo. Kolejność: co po czym.'),
                KAT('Wyrażenia z fragmentów a–j: moment, czas trwania czy kolejność?', ['point in time', 'duration', 'sequence'], [['In 2010', 0], ['Now', 0], ['In the 1960s', 0], ['when', 0], ['In recent years', 1], ['long (has long been)', 1], ['first (looking first for)', 2]], 'Moment: In 2010, Now, In the 1960s, when. Czas trwania: In recent years, long. Kolejność: first.'),
                W('„<b>It</b> more or less invented mass tourism in the 1960s.” Do czego odnosi się „It”?', ['Spain', 'the hotel', 'Madrid', 'the 1960s'], 'Zdanie wcześniej mówi, że <b>Spain</b> has long been a low-cost destination.'),
                W('„…in the 1960s, <b>when</b> Spain was booming…” Do czego odnosi się „when”?', ['in the 1960s', 'now', 'in 2010', 'the previous year'], '<b>when</b> łączy się z ostatnio wymienionym czasem: in the 1960s.'),
                W('„…a three-star hotel <b>which</b> her grandfather had founded.” Do czego odnosi się „which”?', ['the three-star hotel', 'Madrid', 'the family', 'the grandfather'], '<b>which</b> zastępuje rzecz tuż przed nim: the hotel.'),
                W('„The luxury market brought in €9.2 bn. <b>That</b> is a third of the size of the market in Italy and France.” Co to jest „That”?', ['€9.2 bn', 'the luxury market in Italy', 'the previous year', 'Spain'], '<b>That</b> = kwota 9,2 mld €, która stanowi jedną trzecią rynku Włoch i Francji.'),
                W('„…luxury clients and how <b>they</b> felt during <b>their</b> trips.” Kim są „they”?', ['luxury clients', 'hotels in Barcelona', 'Spaniards', 'tour guides'], '<b>they / their</b> = luxury clients, ostatni rzeczownik w liczbie mnogiej.'),
                W('„Technology has shrunk distances. <b>This</b> means travellers demand local experiences.” Co to jest „This”?', ['to, że technologia skróciła odległości', 'technologia', 'podróżni', 'lokalne doświadczenia'], '<b>This</b> na początku zdania często zastępuje całą poprzednią myśl, nie jedno słowo.'),
                W('Wybierz poprawne: „___, the hotel was small. Later, the family added a new wing.”', ['At first', 'During', 'Since', 'For'], '<b>At first</b> = na początku (kolejność). During, since, for wymagają rzeczownika albo daty.'),
                W('Wybierz poprawne: „Tourism has grown fast ___ the past decade.”', ['over', 'since', 'ago', 'at'], '<b>over the past decade</b> = w ciągu ostatniej dekady (czas trwania). Since wymaga początku (since 2015).'),
              ],
            },
            {
              id: 'u2l6', tytul: 'Writing: article about tourism', ile: 6,
              nowe: [
                { h: 'Artykuł do magazynu pokładowego (ćw. 8)', html: `Zadanie: 220–260 słów o rozwoju turystyki w Twoim kraju, z tytułem. Plan:<br>1. <b>Tytuł</b>, który zaciekawia.<br>2. <b>Przeszłość</b> (Past Simple, Past Perfect): jak było kiedyś.<br>3. <b>Zmiana</b> (sequence: then, after that, at first): co ją wywołało.<br>4. <b>Dziś</b> (Present Perfect): co się zmieniło do teraz.<br>5. <b>Problemy i przyszłość</b> (in recent years, sustainability).<br><b>Wzór (fragment):</b> ${en('From Cheap Weekends to City Breaks. In the early 1990s, few Western tourists had ever thought of Poland as a holiday destination. The country had just left communism behind and most foreign visitors came on business. Everything began to change after 2004, when Poland joined the European Union. At first, low-cost airlines brought mainly weekend visitors to Kraków. Then, before Euro 2012, the country had been building new motorways and airports for several years. Since then, Poland has become a popular destination for city breaks, and Gdańsk and Wrocław have been attracting more and more visitors. In recent years, however, some residents have complained about overcrowding and short-term rentals.')}` },
              ],
              pula: [
                W('Artykuł do magazynu pokładowego powinien mieć…', ['tytuł i ciekawe otwarcie', 'nagłówek „Dear Sir or Madam”', 'podpis z numerem telefonu', 'listę punktów zamiast akapitów'], 'Artykuł = <b>tytuł</b> + akapity. „Dear Sir or Madam” to list, nie artykuł.'),
                W('Który czas pasuje do zdania o stanie sprzed 2004 r., gdy opisujesz 2004 r.?', ['Past Perfect: few tourists had visited Poland', 'Present Perfect: few tourists have visited Poland', 'Present Continuous: few tourists are visiting', 'Future: few tourists will visit'], 'Coś wcześniej niż inny moment w przeszłości → <b>Past Perfect</b>.'),
                W('„___ 2004, Poland has become a popular destination.”', ['Since', 'In', 'During', 'Ago'], '<b>Since</b> + początek okresu + Present Perfect.'),
                W('„___ the tournament, the country had been building motorways for years.”', ['Before', 'Since', 'For', 'Then'], '<b>Before the tournament</b> + Past Perfect Continuous: budowa trwała do turnieju.'),
                U('Ułóż: W ostatnich latach Gdańsk przyciąga coraz więcej turystów.', 'In recent years, Gdańsk has been attracting more and more tourists.', '<b>In recent years</b> + Present Perfect Continuous: trend trwa do teraz.', ['attracted', 'ago'], { alt: ['Gdańsk has been attracting more and more tourists in recent years.'] }),
                PISZ('Napisz początek artykułu (4–5 zdań) o rozwoju turystyki w Polsce. Użyj co najmniej trzech różnych czasów przeszłych i dwóch wyrażeń czasu.', 'From Cheap Weekends to City Breaks. In the early 1990s, few Western tourists had ever thought of Poland as a holiday destination. While the economy was changing fast, tourism was growing slowly. Everything began to change after 2004, when Poland joined the EU. Since then, Kraków has become one of the most popular city-break destinations in Europe.', ['tytuł', 'Past Simple + Past Perfect + Past Continuous', 'Present Perfect na „dziś” (since then, in recent years)', 'wyrażenia czasu: in the early 1990s, after 2004, since then', 'słówka z działu: destination, low-cost, mass tourism, sustainable']),
              ],
            },
          ],
        },
        // ───────────── 6.3 ─────────────
        {
          id: 'u3', tytul: '6.3 Business networking', pl: 'networking na targach, słówka z wideo, zwroty', ikona: '🤝', kolokwium: true, zrodlo: 'podręcznik 6.3, s. 62–63, ćw. 1–6',
          lekcje: [
            { id: 'u3f', tytul: 'Fiszki: networking', ile: 12, pula: [...fiszki(WIDEO_PL), ...fiszki(MAIL_DONNY), ...FISZKI_NETWORKING] },
            {
              id: 'u3l1', tytul: 'Networking at a trade fair', ile: 10,
              nowe: [
                { h: 'Pojęcia i sytuacja', html: `${en('networking')} — poznawanie innych profesjonalistów, żeby wymieniać informacje, zdobywać kontakty i pomagać sobie nawzajem.<br>${en('small talk')} — uprzejma, przyjazna rozmowa o nieważnych sprawach.<br>Cytat: ${en('‘Networking is more about farming than it is about hunting.’')} (Ivan Misner) — networking to „uprawa”: budowanie relacji na długo, a nie „polowanie” na szybki zysk.<br><b>Sytuacja:</b> Susan Lam pisze dla magazynu online ${en('Lifestyle')}. Szefowa, Donna Johnson (Assistant Editor), wysyła ją na ${en('Global Travel Fair')} w Londynie (czwartek i piątek). Susan ma: napisać artykuł o najnowszych trendach w podróżach, nawiązać kontakty i rozpowszechnić informację o magazynie, pozyskać reklamy od wystawców, odebrać identyfikator prasowy na miejscu.${tab(MAIL_DONNY.map(([a, b]) => [en(a), b]), ['z maila', 'znaczy'])}` },
                { h: 'Susan i Charlie', html: `Susan: ${en('Been assigned to cover the GTF next week.')} Networking ${en('doesn’t come naturally')} to her, so she is ${en('feeling anxious')}.<br>Charlie radzi:<br>• ${en('Don’t say sorry for the imposition.')} — nie przepraszaj, że się narzucasz;<br>• ${en('Don’t show them you’re shy or feeling awkward.')};<br>• ${en('You don’t want to come across as lacking in confidence.')} — nie chcesz sprawiać wrażenia niepewnej;<br>• ${en('Everyone else is networking, too.')};<br>• ${en('Stay cool and fake it till you make it.')} — udawaj pewność, aż ją zdobędziesz.` },
              ],
              pula: [
                ...paryZ(MAIL_DONNY.slice(0, 4), 4, 'Połącz zwrot z maila ze znaczeniem'),
                ...paryZ(MAIL_DONNY.slice(4), 4, 'Połącz zwrot z maila ze znaczeniem'),
                WIELE('Co Donna chce, żeby Susan zrobiła na targach? Zaznacz wszystko.', ['write an article about the latest trends in travel', 'do some networking and spread the word about Lifestyle', 'drum up advertising from some of the exhibitors', 'give a presentation to 300 experts', 'book a stand for Lifestyle'], [0, 1, 2], 'Mail Donny: artykuł o trendach, networking i promocja magazynu, pozyskanie reklam od wystawców. Prezentacji ani stoiska nie ma.'),
                W('Jak Susan czuje się przed targami?', ['zdenerwowana — networking nie przychodzi jej naturalnie', 'podekscytowana — uwielbia networking', 'znudzona — była tam wiele razy', 'zła na Donnę za dodatkową pracę'], '„Really doesn’t come naturally to me!!! <b>Feeling anxious</b>” = denerwuję się.'),
                W('„Networking is more about farming than it is about hunting.” Co to znaczy?', ['relacje buduje się cierpliwie, na długo', 'trzeba szybko „upolować” klienta', 'networking jest dla rolników', 'lepiej działać samemu niż w grupie'], 'Farming = uprawiać, dbać i czekać na plon. Hunting = szybko złapać zdobycz. Networking to <b>budowanie relacji</b>.'),
                W('Która rada NIE pochodzi od Charliego?', ['Apologise for interrupting people.', 'Don’t say sorry for the imposition.', 'Don’t show them you’re shy.', 'Fake it till you make it.'], 'Charlie mówi wprost: <b>nie przepraszaj</b> (don’t say sorry for the imposition).'),
                W('„You don’t want to come across as lacking in confidence.” Co znaczy „come across as”?', ['sprawiać wrażenie', 'przypadkiem spotkać', 'przejść na drugą stronę', 'zgodzić się z kimś'], '<b>come across as</b> + cecha = sprawiać wrażenie (kogoś).'),
                W('„Drum up advertising from some of the exhibitors” znaczy…', ['pozyskać reklamy od wystawców', 'zagrać na bębnach dla wystawców', 'skrytykować reklamy wystawców', 'wydrukować reklamy dla wystawców'], '<b>drum up</b> business / advertising = napędzić, zdobyć (klientów, reklamy).'),
                P('Uzupełnij: networking = the practice of meeting other … to share information and make useful contacts', ['professionals', 'people'], 'Definicja z podręcznika: meeting other <b>professionals</b>.', { pod: 'jedno słowo' }),
                P('Uzupełnij: small … = polite friendly conversation about unimportant subjects', 'talk', '<b>small talk</b> = rozmowa o niczym ważnym (pogoda, podróż).', { pod: 'jedno słowo' }),
              ],
            },
            {
              id: 'u3l2', tytul: 'Video vocabulary (ćw. 5)', ile: 10,
              nowe: [
                { h: '10 słówek z wideo', html: `Wideo: Susan Lam (Lifestyle) rozmawia na targach z Martinem Kleinem, właścicielem wypożyczalni łodzi na wakacje.${tab(WIDEO_PL.map(([a, b], i) => [en(a), b, `<small>${WIDEO[i][1]}</small>`]), ['słówko', 'znaczy', 'definicja z ćwiczenia'])}${en('pique')} czyta się jak ${en('peek')} [piːk].` },
              ],
              pula: [
                PARY(WIDEO.slice(0, 5).map(([a, b]) => [a, b]), 'Połącz słówko z definicją'),
                PARY(WIDEO.slice(5).map(([a, b]) => [a, b]), 'Połącz słówko z definicją'),
                ...paryZ(WIDEO_PL, 5, 'Połącz słówko ze znaczeniem'),
                W('„This little village is really ___ — hardly any tourists ever find it.”', ['off the beaten track', 'laid-back', 'homesick', 'a novice'], '<b>off the beaten track</b> = na uboczu, z dala od tras turystów.'),
                W('„Only the locals know about this beach. It’s a ___.”', ['well-kept secret', 'novice', 'interface', 'picturesque'], '<b>a well-kept secret</b> = coś, o czym wie niewielu.'),
                W('„I’m a complete ___ at networking — it’s my first trade fair.”', ['novice', 'interface', 'secret', 'track'], '<b>novice</b> = początkujący.'),
                W('„Don’t worry, you’ll soon get the ___ of it.”', ['hang', 'track', 'interest', 'secret'], '<b>get the hang of something</b> = nabrać wprawy.'),
                W('„The headline should ___ readers’ interest.”', ['pique', 'peak', 'pick', 'hang'], '<b>pique someone’s interest</b> = wzbudzić zainteresowanie. Pisownia „pique”, choć czyta się jak „peak”.'),
                W('„A ___ fishing village with old stone houses.”', ['picturesque', 'homesick', 'laid-back', 'neat'], '<b>picturesque</b> = malowniczy.'),
                W('„After a month abroad, she felt really ___.”', ['homesick', 'laid-back', 'picturesque', 'neat'], '<b>homesick</b> = tęskniący za domem.'),
                W('„You can book and pay in one click? ___”', ['That’s neat!', 'That’s homesick!', 'That’s off the beaten track!', 'That’s a novice!'], '<b>That’s neat!</b> = sprytne, proste i skuteczne!'),
                P('Uzupełnij: The staff are very laid-…: nobody is ever stressed.', 'back', '<b>laid-back</b> = wyluzowany.', { pod: 'jedno słowo' }),
                P('Uzupełnij: The app has a really simple … — even my grandma can use it.', 'interface', '<b>interface</b> = to, jak program wygląda na ekranie i jak się go obsługuje.', { pod: 'jedno słowo' }),
              ],
            },
            {
              id: 'u3l3', tytul: 'Networking techniques & phrases', ile: 9,
              nowe: [
                { h: 'Rozmowa networkingowa krok po kroku', html: `Pytania do wideo pokazują, na co patrzy ocena: pewny start, promocja, wspólny grunt, sterowanie rozmową, sprzedaż bez nachalności. Typowe zwroty:${tab([['<b>start</b> (pewność)', en('Hi, I’m Susan Lam from Lifestyle magazine. Is this your first time at the fair?')], ['<b>wspólny grunt</b>', en('Oh really? I’ve been there too! / So, what brings you here?')], ['<b>promocja</b>', en('Our readers are exactly the people who…')], ['<b>sterowanie</b>', en('Speaking of… / That reminds me… / Coming back to what you said about…')], ['<b>zamknięcie</b>', en('Here’s my card. Let’s keep in touch. / Could I send you some information about…?')]], ['etap', 'zwrot'])}` },
              ],
              pula: [
                KAT('Do którego etapu rozmowy pasuje zwrot?', ['start', 'sterowanie rozmową', 'zamknięcie'], [['Hi, I’m Susan from Lifestyle magazine.', 0], ['Is this your first time at the fair?', 0], ['Speaking of boats…', 1], ['That reminds me…', 1], ['Coming back to what you said about…', 1], ['Here’s my card.', 2], ['Let’s keep in touch.', 2], ['It’s been great talking to you.', 2]], 'Start: przedstaw się i zadaj lekkie pytanie. Sterowanie: przejście do tematu. Zamknięcie: wizytówka i dalszy kontakt.'),
                W('Jak pewnie zacząć rozmowę z nieznajomym na targach?', ['Hi, I’m Susan Lam from Lifestyle magazine. Is this your first time here?', 'Sorry to bother you, I’m really sorry, do you have a minute?', 'Do you want to buy advertising?', 'I’m a bit shy, but…'], 'Imię, firma i lekkie pytanie. Bez przeprosin (rada Charliego) i bez sprzedaży w pierwszym zdaniu.'),
                W('Jak znaleźć wspólny grunt (common ground)?', ['Oh really? I’ve been there too! What did you think of it?', 'Our prices are the lowest on the market.', 'I have to go now.', 'Here’s my card.'], 'Wspólny grunt = coś, co łączy rozmówców (miejsce, doświadczenie).'),
                W('Jak przejść od small talku do biznesu?', ['Speaking of holidays, our readers love boat trips…', 'Anyway, buy an advert.', 'Let’s talk about the weather again.', 'Goodbye.'], '<b>Speaking of…</b> = skoro mowa o… — płynne przejście do tematu.'),
                W('Jak zamknąć rozmowę i zostawić otwarte drzwi?', ['It’s been great talking to you. Here’s my card — let’s keep in touch.', 'OK, bye.', 'Sorry for taking your time.', 'I’ll call you every day.'], 'Podziękuj, daj wizytówkę i zaproponuj dalszy kontakt.'),
                PARY([['Speaking of…', 'skoro mowa o…'], ['That reminds me…', 'to mi przypomina…'], ['Let’s keep in touch.', 'bądźmy w kontakcie'], ['What brings you here?', 'co cię tu sprowadza?'], ['Mind if I join you?', 'mogę się dosiąść / dołączyć?']], 'Połącz zwrot ze znaczeniem'),
                U('Ułóż: Co cię sprowadza na targi?', 'What brings you to the fair?', '<b>What brings you…?</b> — klasyczne pytanie na otwarcie rozmowy.', ['bring', 'for']),
                U('Ułóż: Mogę przesłać ci informacje o naszym magazynie?', 'Could I send you some information about our magazine?', '<b>Could I…?</b> — grzeczna propozycja na koniec rozmowy.', ['sent', 'informations']),
                W('Który zwrot jest poprawny?', ['It’s been great talking to you.', 'It was great to talking with you.', 'It’s been great talk to you.', 'Was great talking you.'], '<b>It’s been great talking to you.</b> — talk to + forma -ing po „great”.'),
              ],
            },
          ],
        },
        // ───────────── 6.4 ─────────────
        {
          id: 'u4', tytul: '6.4 Storytelling in presentations', pl: 'historia Ángela, struktura w 10 krokach, techniki', ikona: '🎤', kolokwium: true, zrodlo: 'podręcznik 6.4, ćw. 1–6',
          lekcje: [
            { id: 'u4f', tytul: 'Fiszki: storytelling', ile: 10, pula: FISZKI_STORY },
            {
              id: 'u4l1', tytul: 'Ángel’s story', ile: 9,
              nowe: [
                { h: 'O kim i o czym', html: `Cytat: ${en('‘Stories constitute the single most powerful weapon in a leader’s arsenal.’')} — Dr Howard Gardner, Harvard University.<br><b>Ángel Navarro</b> pracuje dla ${en('ProCoast')}, organizacji lobbingowej ds. środowiska z południowej Hiszpanii. Mówi na konferencji liderów branży budowlanej o problemach wybrzeża Morza Śródziemnego.<br><b>Historia:</b> Tom, „great guy”, przy kolacji we włoskiej restauracji mówi Ángelowi, że odchodzi z firmy. Powód: Ángela nigdy nie było, a Tom czuł, że Ángelowi nie zależy. Ángel jest zszokowany i rozczarowany. Ironia: swój błąd zrozumiał dopiero, gdy Tom złożył wypowiedzenie.<br><b>Morał:</b> lekcja o przewodzeniu ludziom: trzeba bardziej dbać o ważne relacje.<br><b>Większa lekcja:</b> branża budowlana powinna bardziej dbać o środowisko.` },
              ],
              pula: [
                W('Kim jest Ángel Navarro?', ['pracownikiem ProCoast, organizacji lobbingowej ds. środowiska', 'szefem firmy budowlanej z Madrytu', 'właścicielem włoskiej restauracji', 'profesorem z Harvardu'], 'Ángel works for <b>ProCoast, an environmental lobby organisation</b> based in southern Spain.'),
                W('Do kogo mówi Ángel?', ['do liderów branży budowlanej na konferencji', 'do studentów na wykładzie', 'do swojego zespołu w biurze', 'do turystów na wybrzeżu'], 'He is speaking at <b>a conference of construction industry leaders</b>.'),
                W('Jaką decyzję podjął Tom?', ['że odchodzi z firmy', 'że zostaje szefem zespołu', 'że otwiera restaurację', 'że przeprowadza się do Hiszpanii'], '„Ángel, I’ve made a decision. <b>I’m leaving the company.</b>”'),
                W('Dlaczego Tom odszedł?', ['bo Ángela nigdy nie było i Tom czuł, że mu nie zależy', 'bo dostał lepszą pensję gdzie indziej', 'bo nie lubił włoskiej kuchni', 'bo firma przeniosła się nad morze'], '„The problem … was that <b>I was never around</b>. … for him, <b>I didn’t care</b>.”'),
                W('Jak zareagował Ángel?', ['był zszokowany i rozczarowany', 'był zadowolony', 'był obojętny', 'był zły na Toma'], '„I was really <b>shocked and disappointed</b>.”'),
                W('Czego ta historia nauczyła Ángela o przewodzeniu ludziom?', ['że trzeba bardziej dbać o ważne relacje', 'że trzeba więcej pracować po godzinach', 'że kolacje służbowe to strata czasu', 'że nie warto zatrudniać przyjaciół'], 'Morał: <b>the need for us to care more about important relationships</b>.'),
                W('Jaki jest główny cel tej historii w prezentacji?', ['pokazać, że trzeba dbać o ważne rzeczy, takie jak środowisko', 'pokazać, jak dbać o pracowników', 'rozbawić publiczność przed przerwą', 'opowiedzieć o włoskiej restauracji'], 'Historia o Tomie prowadzi do tematu: <b>how, as an industry, you can show more care for our environment</b>. To odpowiedź „b” z ćwiczenia 3.6.'),
                W('„Stories constitute the single most powerful weapon in a leader’s arsenal.” Kto to powiedział?', ['Howard Gardner, Harvard University', 'Ivan Misner', 'Hans Christian Andersen', 'Ángel Navarro'], 'Dr <b>Howard Gardner</b>, profesor z Harvardu. Misner to cytat o networkingu, Andersen — „To travel is to live”.'),
                P('Uzupełnij: I realised my mistake only when he …', ['resigned', 'left', 'quit', 'left the company'], '<b>resign</b> = złożyć wypowiedzenie, zrezygnować.', { pod: 'jedno słowo' }),
              ],
            },
            {
              id: 'u4l2', tytul: 'Story structure 1–10', ile: 10,
              nowe: [
                { h: 'Struktura historii w 10 krokach (ćw. 5A)', html: tab(ETAPY.map(([e, lit, cytat], i) => [`<b>${i + 1}</b>`, `${e}<br><small>${ETAP_PL[i]}</small>`, `<b>${lit}</b> ${en(cytat)}`]), ['', 'etap', 'fragment']) },
              ],
              pula: [
                ...ETAPY.map((_, i) => ktoryEtap(i)),
                PARY([['To begin, I’d like to tell you about…', ETAP_PL[0]], ['So, the story starts with Tom.', ETAP_PL[1]], ['And then all of a sudden…', ETAP_PL[3]], ['I have to tell you, I was really shocked.', ETAP_PL[4]], ['You know what the funny thing is…', ETAP_PL[6]]], 'Połącz zwrot z etapem historii'),
                PARY([['In the end, after a lot of thinking, we decided to…', ETAP_PL[2]], ['The problem with all of this was that…', ETAP_PL[5]], ['This has taught me an important lesson about…', ETAP_PL[7]], ['I think we can all learn from this because…', ETAP_PL[8]], ['So that’s what I want to talk about today:', ETAP_PL[9]]], 'Połącz zwrot z etapem historii'),
                W('Co przychodzi zaraz po punkcie zwrotnym (turning point)?', ['emocje w trudnym momencie', 'morał historii', 'główny temat prezentacji', 'przedstawienie kluczowych osób'], 'Kolejność: … 4 turning point → <b>5 emotions</b> → 6 why the failure happened → 7 irony …'),
                W('Kiedy w tej strukturze pojawia się główny temat prezentacji?', ['na samym końcu historii (krok 10)', 'na samym początku (krok 1)', 'zaraz po punkcie zwrotnym', 'w środku, przed emocjami'], 'Krok 10: <b>introduce the main subject of your presentation at the end of the story</b>.'),
              ],
            },
            {
              id: 'u4l3', tytul: 'Storytelling techniques & phrases', ile: 10,
              nowe: [
                { h: 'Techniki z ćwiczenia 3', html: `${tab([['seria krótkich zdań', en('He was smart. He was funny. He was loyal.')], ['angażowanie emocji', en('I was really shocked and disappointed.')], ['pytania retoryczne', en('How many of us really listen to our teams?')], ['szczegółowy opis emocji', en('My stomach dropped. My hands were shaking.')], ['żart z samego siebie', en('I’m the kind of boss who forgets his own birthday.')], ['ironia', en('The funny thing is, I realised my mistake only when he resigned.')], ['przyznanie się do błędu', en('I made a big mistake. I wasn’t there for him.')]], ['technika', 'przykład'])}Historię opowiada się często w czasie teraźniejszym dla efektu „na żywo”: ${en('Tom stops eating and looks at me…')}` },
              ],
              pula: [
                W('„He was smart. He was funny. He was loyal.” Jaka to technika?', ['seria krótkich zdań', 'pytanie retoryczne', 'ironia', 'żart z samego siebie'], 'Krótkie zdania jedno po drugim podkreślają zalety osoby i dodają rytmu.'),
                W('„How many of us really listen to the people we lead?” Jaka to technika?', ['pytanie retoryczne', 'seria krótkich zdań', 'opis emocji', 'przyznanie się do błędu'], 'Pytanie bez oczekiwania na odpowiedź = <b>rhetorical question</b>. Skłania publiczność do refleksji.'),
                W('„My stomach dropped. My hands were shaking. I couldn’t say a word.” Jaka to technika?', ['szczegółowy opis emocji', 'pytanie retoryczne', 'ironia', 'żart z samego siebie'], 'Opis tego, co działo się w ciele i głowie = <b>describing emotions in more detail</b>.'),
                W('„And you know what the funny thing is? I realised my mistake only when he resigned.” Jaka to technika?', ['ironia', 'seria krótkich zdań', 'żart z publiczności', 'bezpośrednie żądanie'], 'Zrozumiał dopiero, gdy było za późno: to <b>irony</b>.'),
                W('„I’m the kind of manager who forgets his own birthday.” Jaka to technika?', ['żart z samego siebie', 'pytanie retoryczne', 'morał', 'opis emocji'], '<b>Making a joke at yourself</b> rozluźnia salę i buduje sympatię.'),
                W('Dlaczego Ángel mówi „Tom <b>stops</b> eating and <b>looks</b> at me” w czasie teraźniejszym?', ['żeby słuchacze poczuli się, jakby byli na miejscu', 'bo to błąd gramatyczny', 'bo historia dzieje się teraz', 'bo w prezentacjach nie używa się czasów przeszłych'], 'Czas teraźniejszy w punkcie zwrotnym ożywia historię („historic present”).'),
                LUKI('Uzupełnij zwroty z historii.', 'To [[begin]], however, I’d like to tell you about something that happened to me. So, the story [[starts]] with Tom. And then all of a [[sudden]], Tom stops eating. I have to [[tell]] you, I was really shocked. And you know what the [[funny]] thing is? So, this has [[taught]] me an important lesson.', ['begin', 'starts', 'sudden', 'tell', 'funny', 'taught'], 'Stałe zwroty: to begin, the story starts with, all of a sudden, I have to tell you, the funny thing is, this has taught me.'),
                U('Ułóż: Historia zaczyna się od Toma.', 'So, the story starts with Tom.', '<b>The story starts with…</b> — wprowadzenie kluczowej osoby (krok 2).', ['begin', 'from']),
                U('Ułóż: To nauczyło mnie ważnej lekcji.', 'This has taught me an important lesson.', '<b>teach – taught – taught</b>. Present Perfect, bo lekcja jest ważna teraz.', ['teached', 'learned']),
                PISZ('Opowiedz historię Ángela w pierwszej osobie (5–6 zdań), jakbyś był Ángelem. Użyj co najmniej czterech zwrotów z lekcji.', 'To begin, I’d like to tell you about something that happened to me. So, the story starts with Tom, a great guy from my team. One evening we went to a little Italian restaurant and, all of a sudden, he said, ‘I’m leaving the company.’ I have to tell you, I was really shocked and disappointed. The problem was that I was never around. And you know what the funny thing is? I realised my mistake only when he resigned. This has taught me an important lesson: we need to care more about important relationships.', ['zapowiedź: To begin, I’d like to tell you…', 'osoba: So, the story starts with…', 'punkt zwrotny: all of a sudden', 'emocje: I have to tell you, I was…', 'ironia i morał: the funny thing is… / This has taught me…']),
              ],
            },
          ],
        },
        // ───────────── 6.5 ─────────────
        {
          id: 'u5', tytul: '6.5 Email to a business partner', pl: 'struktura maila, odpowiedź, ton, if and alternatives', ikona: '✉️', kolokwium: true, zrodlo: 'podręcznik 6.5, ćw. 1–4',
          lekcje: [
            { id: 'u5f', tytul: 'Fiszki: e-mail', ile: 12, pula: FISZKI_MAIL },
            {
              id: 'u5l1', tytul: 'Email: customer → supplier', ile: 10,
              nowe: [
                { h: 'Mail klienta do dostawcy (7 części)', html: `Kontekst: Wei Yongli, agentka turystyczna z Wuhanu (Chiny), pisze do Jamesa Robertsona z małego biura podróży w Edynburgu (Szkocja).${tab(MAIL_KLIENT.map(([k, z], i) => [`<b>${i + 1}. ${k}</b>`, en(z)]), ['część', 'zwrot'])}Słówka: ${en('early reply')} — szybka odpowiedź; ${en('feel free to')} — śmiało; ${en('apparently')} — podobno, jak się okazuje; ${en('confusion over')} — zamieszanie wokół.` },
              ],
              pula: [
                W('„I would like to thank you for…” — która to część maila?', ['Positive opening', 'Next steps', 'Negative points', 'Requirements'], 'Mail zaczyna się pozytywnie: podziękowanie = <b>positive opening</b>.'),
                W('„We would like you to organise everything else, including…” — która to część?', ['Requirements', 'Questions', 'Reason for writing', 'Positive ending'], 'Czego klient wymaga od dostawcy = <b>requirements</b>.'),
                W('„Apparently there was some confusion over…” — która to część?', ['Negative points', 'Questions', 'Next steps', 'Positive opening'], 'Problem opisany łagodnie (apparently, some confusion) = <b>negative points</b>.'),
                W('„I would appreciate an early reply.” — która to część?', ['Next steps', 'Positive ending', 'Requirements', 'Reason for writing'], 'Co ma się stać dalej (odpowiedź) = <b>next steps</b>.'),
                W('„We have opened bookings for another group to visit Edinburgh. I have a few questions.” — która to część?', ['Reason for writing', 'Requirements', 'Questions', 'Positive opening'], 'Po co piszę = <b>reason for writing</b>.'),
                W('Co przychodzi w mailu klienta zaraz po „Questions”?', ['Negative points', 'Positive ending', 'Reason for writing', 'Requirements'], 'Kolejność: positive opening → reason → requirements → questions → <b>negative points</b> → next steps → positive ending.'),
                PARY([['Positive opening', 'I would like to thank you for …'], ['Reason for writing', 'I have a few questions.'], ['Requirements', 'We would like you to organise everything else, including …'], ['Next steps', 'Please feel free to email or call me directly.']], 'Połącz część maila ze zwrotem'),
                PARY([['Negative points', 'Apparently there was some confusion over …'], ['Next steps', 'I would appreciate an early reply.'], ['Positive ending', 'I look forward to working with you again.'], ['Questions', 'Can you confirm your prices will remain the same?']], 'Połącz część maila ze zwrotem'),
                U('Ułóż grzeczną prośbę o szybką odpowiedź.', 'I would appreciate an early reply.', '<b>I would appreciate…</b> — grzeczna prośba. Early reply = szybka odpowiedź.', ['appreciated', 'fast']),
                U('Ułóż: Śmiało dzwoń do mnie bezpośrednio, jeśli masz pytania.', 'Please feel free to call me directly if you have any questions.', '<b>feel free to</b> = śmiało; <b>if you have any questions</b> — stały zwrot na koniec maila.', ['will', 'freely'], { alt: ['If you have any questions, please feel free to call me directly.'] }),
                P('Uzupełnij: I hope that we will have a successful, long-… business relationship.', 'term', '<b>long-term</b> = długoterminowy.', { pod: 'jedno słowo' }),
              ],
            },
            {
              id: 'u5l2', tytul: 'Reply: supplier → customer', ile: 10,
              nowe: [
                { h: 'Odpowiedź dostawcy (6 części)', html: `${tab(MAIL_DOSTAWCA.map(([k, z], i) => [`<b>${i + 1}. ${k}</b>`, en(z)]), ['część', 'zwrot'])}Słówka: ${en('this end')} — po naszej stronie; ${en('re')} — w sprawie; ${en('double-booking')} — podwójna rezerwacja; ${en('assure')} — zapewnić; ${en('work well for us')} — pasują nam.` },
              ],
              pula: [
                W('„Great to hear from you again.” — która to część odpowiedzi?', ['Friendly opening', 'Positive start', 'Friendly closing', 'Answer questions'], 'Ciepłe przywitanie = <b>friendly opening</b>.'),
                W('„The dates of your next trip work well for us.” — która to część?', ['Positive start', 'Friendly opening', 'Help and alternatives', 'Dealing with negative points'], 'Dobra wiadomość na start = <b>positive start</b>.'),
                W('„If you wish, we could…” — która to część?', ['Help and alternatives', 'Answer questions', 'Friendly closing', 'Positive start'], 'Propozycja pomocy albo innej opcji = <b>help and alternatives</b>.'),
                W('„Unfortunately, there was a double-booking…” — która to część?', ['Dealing with negative points', 'Answer questions', 'Help and alternatives', 'Friendly opening'], 'Odpowiedź na skargę = <b>dealing with negative points</b>: podziękuj za feedback, wyjaśnij, zapewnij, że się nie powtórzy.'),
                W('Jak dostawca odpowiada na skargę klienta?', ['Thank you for the feedback on the hotel. Unfortunately, there was a double-booking, but they have assured me it will not happen again.', 'It was not our fault. The hotel made a mistake.', 'We don’t know what happened.', 'Please don’t complain about small things.'], 'Kolejno: <b>thank you for the feedback</b> → <b>unfortunately</b> + wyjaśnienie → <b>assured me it will not happen again</b>.'),
                W('„Let me know if there is anything I can do this end re the transfers.” Co znaczy „re”?', ['w sprawie', 'ponownie', 'odpowiedź', 'rezerwacja'], '<b>re</b> = regarding = w sprawie (skrót z korespondencji).'),
                W('„…anything I can do this end” — co znaczy „this end”?', ['po naszej stronie', 'na końcu maila', 'na koniec wycieczki', 'tym razem'], '<b>this end</b> = u nas, po naszej stronie.'),
                PARY(MAIL_DOSTAWCA.slice(0, 3).concat([MAIL_DOSTAWCA[5]]).map(([k, z]) => [k, z.split(' / ')[0]]), 'Połącz część odpowiedzi ze zwrotem'),
                U('Ułóż: Z przyjemnością powitamy Państwa w Edynburgu.', 'We look forward to welcoming you here in Edinburgh.', '<b>look forward to + -ing</b>: welcoming, nie „welcome”.', ['welcome', 'see']),
                P('Uzupełnij: Yes, our prices will … the same for your next visit.', ['remain', 'stay'], '<b>remain the same</b> = pozostać bez zmian (stay the same też dobrze).', { pod: 'jedno słowo' }),
                W('Które zdanie jest poprawne?', ['We look forward to hearing from you.', 'We look forward to hear from you.', 'We are looking forward hear from you.', 'We look forward hearing from you.'], 'Po <b>look forward to</b> zawsze forma <b>-ing</b>: hearing.'),
              ],
            },
            {
              id: 'u5l3', tytul: 'Tone: positive & polite', ile: 9,
              nowe: [
                { h: 'Ton maila (ćw. 2)', html: `• <b>Krótkie akapity na otwarcie i zamknięcie</b> nie wnoszą informacji, ale budują relację. Warto je zostawić.<br>• <b>Pytania</b>: bezpośrednie, ale grzeczne (${en('Can you confirm…?')}, ${en('Could you let me know…?')}).<br>• <b>Problemy</b>: prosto, wprost i grzecznie. Zmiękczacze: ${en('apparently')}, ${en('some confusion over')}, ${en('unfortunately')}.<br>• <b>Odpowiedź na problem</b>: podziękuj za feedback, wyjaśnij, zapewnij, że się nie powtórzy.` },
              ],
              pula: [
                W('Które pytanie jest bezpośrednie, ale grzeczne?', ['Can you confirm your prices will remain the same?', 'Your prices better stay the same.', 'Why are your prices always changing?', 'Prices?'], '<b>Can you confirm…?</b> — konkretnie i uprzejmie.'),
                W('Jak grzecznie zgłosić problem?', ['Apparently there was some confusion over the hotel booking.', 'You made a terrible mistake with the hotel.', 'The hotel booking was a disaster because of you.', 'Never do that again.'], '<b>Apparently</b> i <b>some confusion</b> zmiękczają zarzut, ale problem jest jasno nazwany.'),
                W('Czy krótkie, „puste” akapity na początku i końcu warto zostawić?', ['tak — budują relację z partnerem', 'nie — trzeba od razu przejść do konkretów', 'tylko w mailu do przyjaciela', 'tylko gdy mail jest bardzo długi'], 'Nie dodają informacji, ale <b>help the business relationship</b> — o to pyta ćwiczenie 2.'),
                WIELE('Zaznacz zwroty, które zmiękczają złą wiadomość.', ['Unfortunately,…', 'Apparently,…', 'There was some confusion over…', 'You failed to…', 'It’s your fault that…'], [0, 1, 2], 'Unfortunately, apparently, some confusion = grzecznie. „You failed” i „your fault” brzmią jak oskarżenie.'),
                W('Wybierz najlepsze zakończenie maila do stałego partnera.', ['I look forward to working with you again.', 'That’s all.', 'Answer quickly.', 'Bye.'], 'Pozytywne zakończenie buduje relację: <b>I look forward to working with you again</b>.'),
                W('Które zdanie najlepiej odpowiada na skargę klienta?', ['Thank you for your feedback. I have spoken to the hotel and they have assured me it will not happen again.', 'This is not our problem.', 'Other clients never complain.', 'OK.'], 'Podziękowanie + działanie + zapewnienie = profesjonalny ton.'),
                P('Uzupełnij grzeczną prośbę: Could you … me know by Friday?', 'let', '<b>Could you let me know…?</b> = czy mógłby Pan dać znać…?', { pod: 'jedno słowo' }),
                U('Ułóż: Dziękujemy za uwagi dotyczące hotelu.', 'Thank you for the feedback on the hotel.', '<b>feedback on</b> something — przyimek <b>on</b>. Feedback jest niepoliczalny (bez „a” i bez „-s”).', ['feedbacks', 'about']),
                U('Ułóż: Zapewnili mnie, że to się nie powtórzy.', 'They assured me it will not happen again.', '<b>assure somebody</b> = zapewnić kogoś (bez „to”).', ['to', 'repeat']),
              ],
            },
            {
              id: 'u5l4', tytul: 'If and alternatives', ile: 10,
              nowe: [
                { h: 'If i jego zamienniki', html: `${tab([[en('if'), 'jeśli', en('Let me know if there is anything I can do.')], [en('unless'), 'chyba że = if … not', en('We’ll book the hotel unless you tell us otherwise.')], [en('provided / providing (that)'), 'pod warunkiem że', en('We can keep this price provided that you confirm by Friday.')], [en('as long as'), 'o ile, pod warunkiem że', en('You can change the dates as long as you tell us a week before.')], [en('on condition that'), 'pod warunkiem że (formalnie)', en('We offer a discount on condition that you book 50 rooms.')], [en('in case'), 'na wypadek gdyby (zabezpieczenie)', en('I’ll send you my mobile number in case you have any problems.')], [en('otherwise'), 'w przeciwnym razie', en('Please confirm by Monday; otherwise, we may lose the rooms.')], [en('Should you…'), 'gdyby Pan… (bardzo formalnie)', en('Should you have any questions, please contact me.')], [en('if you wish / if necessary / if so / if not'), 'jeśli Pan sobie życzy / w razie potrzeby / jeśli tak / jeśli nie', en('If you wish, we could organise a dinner.')]], ['zwrot', 'znaczy', 'przykład'])}Pułapka: ${en('in case')} ≠ ${en('if')}. „In case” mówi o zabezpieczeniu z góry, a „if” — o warunku.` },
              ],
              pula: [
                W('„We’ll book the hotel ___ you tell us otherwise.” (chyba że)', ['unless', 'if', 'in case', 'provided'], '<b>unless</b> = chyba że (if … not).'),
                W('„We can keep this price ___ you confirm by Friday.” (pod warunkiem że)', ['provided that', 'unless', 'in case', 'otherwise'], '<b>provided (that)</b> = pod warunkiem że.'),
                W('„Take my number ___ you get lost.” (na wypadek gdybyś…)', ['in case', 'unless', 'provided', 'otherwise'], '<b>in case</b> = na wszelki wypadek, zabezpieczenie z góry.'),
                W('„Please confirm by Monday; ___, we may lose the rooms.”', ['otherwise', 'unless', 'in case', 'as long as'], '<b>otherwise</b> = w przeciwnym razie. Stoi na początku zdania, z przecinkiem.'),
                W('„___ you have any questions, please do not hesitate to contact me.” (bardzo formalnie)', ['Should', 'Would', 'Unless', 'Otherwise'], '<b>Should you have…</b> = If you have… (inwersja, styl formalny).'),
                W('„You can change the dates ___ you tell us a week before.”', ['as long as', 'unless', 'in case', 'otherwise'], '<b>as long as</b> = o ile, pod warunkiem że.'),
                W('Które zdanie znaczy to samo co „We won’t send the contract unless you pay the deposit”?', ['We won’t send the contract if you don’t pay the deposit.', 'We will send the contract if you don’t pay the deposit.', 'We won’t send the contract in case you pay the deposit.', 'We will send the contract unless you pay the deposit.'], '<b>unless</b> = if … not.'),
                W('„___ you wish, we could organise a guided tour of the castle.”', ['If', 'Unless', 'Otherwise', 'In case'], '<b>If you wish</b> — grzeczna propozycja z maila Jamesa.'),
                P('Przepisz formalnie: If you need anything, please call me. → … you need anything, please call me.', 'should', '<b>Should you need anything</b> = If you need anything (formalnie).', { pod: 'jedno słowo' }),
                LUKI('Uzupełnij mail.', 'Dear Ms Meier, the conference centre is available on 4–6 March. [[If]] you wish, we could also book a dinner cruise. We can keep this price [[provided]] that you confirm by Friday; [[otherwise]], we may lose the venue. I attach the hotel list [[in case]] you would like to compare options. [[Should]] you have any questions, please do not hesitate to contact me.', ['If', 'provided', 'otherwise', 'in case', 'Should'], 'If you wish — propozycja; provided that — warunek; otherwise — w przeciwnym razie; in case — na wszelki wypadek; Should you… — formalne „if”.'),
              ],
            },
            {
              id: 'u5l5', tytul: 'Task: Greenleaves → City Events', ile: 7,
              nowe: [
                { h: 'Zadanie 4: konferencja w Singapurze', html: `${en('Greenleaves')} — globalna firma agrochemiczna — organizuje międzynarodową konferencję sprzedażową w Singapurze z pomocą lokalnej firmy eventowej ${en('City Events')}.<br>A: Anna Meier (Greenleaves) pisze do Jia Yumei (City Events) — użyj 7 części maila klienta.<br>B: Jia Yumei odpowiada — użyj 6 części odpowiedzi dostawcy.<br>Sprawdź w parach (ćw. 4C): czy są elementy z ćwiczenia 2 (ton), czy mail ma dobrą strukturę, akapity, numerację pytań?` },
              ],
              pula: [
                W('Kim jest Anna Meier?', ['pracownicą Greenleaves, klientem City Events', 'pracownicą City Events, dostawcą', 'agentką turystyczną z Wuhanu', 'właścicielką biura w Edynburgu'], 'Anna Meier at <b>Greenleaves</b> (klient) pisze do Jia Yumei at <b>City Events</b> (dostawca).'),
                W('Jaki mail pisze Jia Yumei?', ['odpowiedź dostawcy do klienta', 'pierwszy mail klienta do dostawcy', 'zaproszenie dla uczestników', 'reklamację do hotelu'], 'City Events to firma, która organizuje wydarzenie, czyli <b>dostawca</b>: odpowiada na mail Anny.'),
                W('Jak najlepiej zadać kilka pytań w mailu?', ['ponumerować je: 1., 2., 3.', 'wpisać je w jedno długie zdanie', 'zadać je dopiero w ostatnim akapicie', 'pominąć je i zadzwonić'], 'Numeracja ułatwia odpowiedź punkt po punkcie — o to pyta ćwiczenie 4C.'),
                U('Ułóż: Chcielibyśmy, żebyście zorganizowali też transfery z lotniska.', 'We would like you to organise the airport transfers as well.', '<b>would like you to</b> + bezokolicznik — wymaganie wobec dostawcy (requirements).', ['organising', 'that']),
                U('Ułóż: Czy możecie potwierdzić, że sala pomieści 200 osób?', 'Can you confirm that the room can hold 200 people?', '<b>Can you confirm that…?</b> — pytanie w części questions.', ['confirmation', 'holds']),
                PISZ('Napisz mail Anny Meier do Jia Yumei (6–8 zdań). Szczegóły wymyśl sam, ale zachowaj 7 części maila klienta.', 'Dear Jia Yumei,\nI would like to thank you for your quick response to our enquiry. We are organising our international sales conference in Singapore, and I have a few questions. We would like you to organise the venue and accommodation, including airport transfers and a welcome dinner. 1. Can you confirm that the conference room can hold all our participants? 2. Could you send us a price for each option? At our last conference, there was some confusion over the hotel bookings, so could you please confirm all reservations in writing? I would appreciate an early reply. Please feel free to call me directly if you have any questions. I look forward to working with you.\nBest regards,\nAnna Meier', ['positive opening: I would like to thank you for…', 'reason for writing + requirements: We would like you to organise…, including…', 'ponumerowane pytania: Can you confirm…?', 'negative point łagodnie: there was some confusion over…', 'next steps + positive ending: I would appreciate an early reply… I look forward to…']),
                PISZ('Napisz odpowiedź Jia Yumei do Anny Meier (5–7 zdań). Zachowaj 6 części odpowiedzi dostawcy.', 'Dear Anna,\nGreat to hear from you. The dates of your conference work well for us. 1. Yes, the conference room can hold all your participants. 2. I attach a price list for each option. Thank you for the feedback on your last event. We will confirm every reservation in writing, so this will not happen again. If you wish, we could also organise a city tour for your guests. We look forward to welcoming you here in Singapore.\nBest regards,\nJia Yumei', ['friendly opening + positive start', 'odpowiedzi na pytania w tej samej kolejności i numeracji', 'dealing with negative points: thank you for the feedback… will not happen again', 'help and alternatives: If you wish, we could…', 'friendly closing: We look forward to welcoming you…']),
              ],
            },
          ],
        },
        // ───────────── tematy z egzaminu ustnego ─────────────
        {
          id: 'u6', tytul: 'Exam topics: Unit 6', pl: 'tematy 15–17 z listy na egzamin: wzorcowe odpowiedzi i zwroty', ikona: '🎙️', zrodlo: 'lista „Zagadnienia na egzamin”, tematy 15–17 (U6)',
          lekcje: [
            {
              id: 'u6l1', tytul: 'Topics 15–17', ile: 8,
              nowe: [
                { h: '15. Why do people like travelling?', html: `<i>Why do people like travelling? What are your favourite destinations? Talk about a place which was a real eye-opener for you.</i><br>${en('an eye-opener')} = coś, co zaskakuje i otwiera oczy, uczy czegoś nowego.<br><b>Wzór:</b> ${en('People like travelling because it lets them escape their daily routine and see how others live. Travelling broadens the mind: you learn about other cultures, food and history. I love city breaks, but my favourite places are off the beaten track. A real eye-opener for me was a trip to Lisbon. I had expected a typical tourist city, but I discovered a laid-back, friendly place full of different cultures. It taught me that the best experiences are often unplanned.')}` },
                { h: '16. The tourism boom: pros and cons', html: `<i>Discuss the positive and negative aspects of the current boom in tourism. Provide some examples.</i><br><b>Wzór:</b> ${en('On the one hand, the tourism boom creates jobs, boosts the local economy and pays for better infrastructure. On the other hand, mass tourism can damage nature and marine life, and many coastal towns have become overdeveloped. In cities like Barcelona, rowdy tourists and short-term rentals have pushed up rents, which has led to protests and “turismofobia”. Many jobs in tourism are also seasonal and low-paid. In my opinion, the answer is sustainable tourism that respects local people and nature.')}` },
                { h: '17. What is networking?', html: `<i>What is networking and why is it important in business? Where can networking take place?</i><br><b>Wzór:</b> ${en('Networking means meeting other professionals to share information, make useful contacts and support each other. It is important because many jobs, clients and partners come through personal contacts. As Ivan Misner says, networking is more about farming than hunting: you build relationships slowly. Networking can take place at trade fairs, conferences and industry events, but also at university, on LinkedIn or even during small talk at a party. To network well, introduce yourself confidently, find common ground and follow up after the meeting.')}` },
              ],
              pula: [
                W('Co znaczy „a real eye-opener”?', ['coś, co zaskakuje i uczy czegoś nowego', 'otwieracz do butelek', 'wczesna pobudka', 'miejsce z pięknym widokiem'], '<b>eye-opener</b> = doświadczenie, które „otwiera oczy”.'),
                KAT('Tourism boom: plus czy minus?', ['positive', 'negative'], [['creates jobs', 0], ['boosts the local economy', 0], ['better infrastructure', 0], ['cultural exchange', 0], ['damages marine life', 1], ['overdeveloped coast', 1], ['higher rents', 1], ['seasonal, low-paid jobs', 1]], 'Plusy: praca, gospodarka, infrastruktura, kontakt kultur. Minusy: przyroda, zabudowa, czynsze, sezonowe prace.'),
                WIELE('Gdzie może odbywać się networking? Zaznacz wszystko, co pasuje.', ['at trade fairs', 'at conferences', 'on LinkedIn', 'at university events', 'only in the office of your boss'], [0, 1, 2, 3], 'Networking to każde miejsce, gdzie poznajesz ludzi z branży: targi, konferencje, sieć, uczelnia.'),
                W('Jak dobrze zacząć odpowiedź „pros and cons”?', ['On the one hand, …', 'Firstly of all, …', 'In my opinion of it, …', 'From one side hand, …'], '<b>On the one hand… On the other hand…</b> „Firstly of all” to błąd: „First of all” albo „Firstly”.'),
                U('Ułóż: Podróże poszerzają horyzonty.', 'Travelling broadens the mind.', '<b>broaden the mind</b> = poszerzać horyzonty.', ['broad', 'minds']),
                PISZ('Temat 15: Why do people like travelling? Talk about a place which was a real eye-opener for you. (4–6 zdań)', 'People like travelling because it lets them escape their daily routine. A real eye-opener for me was a trip to Lisbon. I had expected a typical tourist city, but I discovered a laid-back, friendly place. It taught me that the best experiences are often unplanned.', ['dlaczego ludzie podróżują (2 powody)', 'ulubione miejsca', 'eye-opener: co myślałeś przed, co odkryłeś (Past Perfect + Past Simple)', 'słówka z działu: off the beaten track, laid-back, picturesque']),
                PISZ('Temat 16: Discuss the positive and negative aspects of the current boom in tourism. (5–6 zdań)', 'On the one hand, the tourism boom creates jobs and boosts the local economy. On the other hand, mass tourism damages nature and many coastal towns have become overdeveloped. In Barcelona, short-term rentals have pushed up rents. In my opinion, we need sustainable tourism.', ['On the one hand… On the other hand…', '2 plusy i 2 minusy', 'przykład miasta albo kraju', 'własne zdanie: In my opinion…']),
                PISZ('Temat 17: What is networking and why is it important? Where can it take place? (4–6 zdań)', 'Networking means meeting other professionals to share information and make useful contacts. It is important because many jobs and clients come through personal contacts. It can take place at trade fairs, conferences or on LinkedIn. To network well, find common ground and follow up after the meeting.', ['definicja: meeting other professionals to…', 'dlaczego ważny (kontakty, praca, klienci)', 'gdzie: trade fairs, conferences, LinkedIn…', 'rada: find common ground, follow up']),
              ],
            },
          ],
        },
      ],
      powtorka: { id: 's1rep', tytul: 'Mieszana powtórka Unit 6', ile: 14 },
      boss: {
        id: 'boss1', tytul: 'Escape room: próbne kolokwium', pl: 'Siedem etapów, po jednym z każdej części działu. Za każdy etap jedna litera hasła wyjścia.', haslo: 'TOURISM',
        retos: [
          { nazwa: 'Collocations', pula: [
            LUKI('Uzupełnij kolokacje (wpisz brakujące słowo).', 'We stayed in a small bed and [[breakfast]] near a national [[park]]. In the morning we went whale-[[watching]] with a local tour [[guide]]. Sadly, the old town has become a tourist [[trap]].', null, 'bed and breakfast, national park, whale-watching, tour guide, tourist trap.'),
            W('Które połączenie NIE jest kolokacją z ćwiczenia 6?', ['marine chain', 'hotel chain', 'marine life', 'package tour'], 'Hotel chain, marine life, package tour — tak. <b>Marine chain</b> nie istnieje.'),
          ] },
          { nazwa: 'Reading', pula: [
            W('Luka: „The shift toward luxury comes at a good time for Spain. ___; in August 2018 10.2 m people visited Spain, down 1.9 percent.”', ['Although tourist numbers in Spain have been falling', 'Spain has long been a low-cost destination', 'It seemed to us that Madrid had what was needed', 'Now Spain is fully developed'], 'Dalej jest dowód spadku → fragment <b>a</b>.'),
            W('Luka: „‘We opened a sector ___,’ says Agustín Santolaya.”', ['that always existed but hadn’t been growing', 'when Spain was booming as a destination', 'looking first for a mix of gastronomy', 'of tourism'], 'Po „a sector” zdanie względne → fragment <b>e</b>.'),
          ] },
          { nazwa: 'Past tenses', pula: [
            LUKI('Wpisz czasowniki w odpowiedniej formie.', 'In the 1960s, the family [[ran|were running]] (run) a hotel which her grandfather [[had founded]] (found). Since then, cheap flights [[have shrunk]] (shrink) distances, and for some years luxury travellers [[have been demanding|have demanded]] (demand) authentic experiences.', null, 'ran (Past Simple), had founded (wcześniej → Past Perfect), have shrunk (skutek dziś → Present Perfect), have been demanding (trend do teraz).'),
            W('„By the time the guests arrived, the chef ___ dinner.”', ['had already prepared', 'has already prepared', 'already prepares', 'was already prepare'], '<b>By the time</b> + przeszłość → Past Perfect.'),
          ] },
          { nazwa: 'Time & reference', pula: [
            KAT('Moment, czas trwania czy kolejność?', ['point in time', 'duration', 'sequence'], [['in 2018', 0], ['now', 0], ['in recent years', 1], ['since 2015', 1], ['first', 2], ['eventually', 2]], 'Moment: in 2018, now. Czas trwania: in recent years, since 2015. Kolejność: first, eventually.'),
            W('„It more or less invented mass tourism in the 1960s.” — „It” to…', ['Spain', 'Madrid', 'the hotel', 'France'], '<b>It = Spain</b>.'),
          ] },
          { nazwa: 'Networking', pula: [
            P('Wpisz: początkujący = …', 'novice', '<b>novice</b>.', { pod: 'jedno słowo' }),
            P('Wpisz: tęskniący za domem = …', 'homesick', '<b>homesick</b>.', { pod: 'jedno słowo' }),
            W('„This beach is a ___ — only locals know about it.”', ['well-kept secret', 'novice', 'laid-back', 'interface'], '<b>well-kept secret</b>.'),
            W('„Networking is more about farming than hunting” znaczy, że…', ['relacje buduje się cierpliwie', 'trzeba szybko zdobyć klienta', 'networking to strata czasu', 'trzeba unikać small talku'], 'Farming = cierpliwe budowanie relacji.'),
          ] },
          { nazwa: 'Storytelling', pula: [
            W('„And then all of a sudden, Tom stops eating and says, ‘I’m leaving the company.’” — który to etap?', ['4. punkt zwrotny', '5. emocje', '2. kluczowe osoby', '8. morał'], 'Nagła zmiana = <b>turning point</b> (krok 4).'),
            W('„So that’s what I want to talk about today…” — który to etap?', ['10. główny temat prezentacji', '1. zapowiedź historii', '9. połączenie z publicznością', '8. morał'], 'Temat prezentacji pojawia się na końcu historii (krok 10).'),
            W('„How many of us really listen to our teams?” — jaka to technika?', ['pytanie retoryczne', 'ironia', 'seria krótkich zdań', 'żart z siebie'], '<b>Rhetorical question</b>.'),
          ] },
          { nazwa: 'Email', pula: [
            LUKI('Uzupełnij odpowiedź dostawcy.', 'Great to [[hear]] from you again. The dates of your next trip work well for us. Yes, our prices will [[remain]] the same. Thank you for the [[feedback]] on the hotel. Unfortunately, there was a double-booking, but they have [[assured]] me it will not happen again. [[If]] you wish, we could organise a dinner. We look forward to [[welcoming]] you here in Edinburgh.', ['hear', 'remain', 'feedback', 'assured', 'If', 'welcoming'], 'hear from you, remain the same, feedback on, assured me, if you wish, look forward to welcoming.'),
            W('„___ you have any questions, please do not hesitate to contact me.”', ['Should', 'Unless', 'Otherwise', 'In case of'], '<b>Should you have…</b> = If you have… (formalnie).'),
          ] },
        ],
      },
    },
  ],
};

// Kamienie milowe. Wspólne warunki liczy silnik; { jednostka } i { boss } — z danych (src/scripts/jezyki/silnik.js).
export const ODZNAKI = [
  { id: 'start', ikona: '🌱', nazwa: 'Pierwszy krok', opis: 'Ukończ pierwszą lekcję.' },
  { id: 'perfekt', ikona: '💎', nazwa: 'Bez pudła', opis: 'Ukończ lekcję bez ani jednego błędu.' },
  { id: 'combo10', ikona: '⚡', nazwa: 'Combo ×10', opis: '10 dobrych odpowiedzi z rzędu.' },
  { id: 'seria3', ikona: '🔥', nazwa: 'Trzy dni z rzędu', opis: 'Ucz się 3 dni pod rząd.' },
  { id: 'seria7', ikona: '🌋', nazwa: 'Tydzień ognia', opis: 'Ucz się 7 dni pod rząd.' },
  { id: 'xp250', ikona: '⭐', nazwa: '250 XP', opis: 'Zbierz 250 punktów doświadczenia.' },
  { id: 'xp1000', ikona: '🌟', nazwa: '1000 XP', opis: 'Zbierz 1000 punktów doświadczenia.' },
  { id: 'bledy', ikona: '🩹', nazwa: 'Naprawione błędy', opis: 'Zrób powtórkę swoich błędów.' },
  { id: 'v1', ikona: '🗂️', nazwa: 'Słówka opanowane', opis: 'Przejdź wszystkie fiszki ze słówkami z zajęć.', jednostka: 'v1' },
  { id: 't1', ikona: '⏱️', nazwa: 'Since or ago?', opis: 'Ukończ wszystkie lekcje z arkusza I.', jednostka: 't1' },
  { id: 't2', ikona: '⏪', nazwa: 'Past master', opis: 'Ukończ wszystkie lekcje z arkusza II.', jednostka: 't2' },
  { id: 't3', ikona: '🔀', nazwa: 'Mixed tenses', opis: 'Ukończ wszystkie lekcje z arkusza IV.', jednostka: 't3' },
  { id: 't4', ikona: '📄', nazwa: 'Teksty z lukami', opis: 'Ukończ wszystkie lekcje z arkusza III.', jednostka: 't4' },
  { id: 'u1', ikona: '🏝️', nazwa: 'Tourism words', opis: 'Ukończ wszystkie lekcje 6.1.', jednostka: 'u1' },
  { id: 'u2', ikona: '⏳', nazwa: 'Past tenses', opis: 'Ukończ wszystkie lekcje 6.2.', jednostka: 'u2' },
  { id: 'u3', ikona: '🤝', nazwa: 'Networker', opis: 'Ukończ wszystkie lekcje 6.3.', jednostka: 'u3' },
  { id: 'u4', ikona: '🎤', nazwa: 'Storyteller', opis: 'Ukończ wszystkie lekcje 6.4.', jednostka: 'u4' },
  { id: 'u5', ikona: '✉️', nazwa: 'Email pro', opis: 'Ukończ wszystkie lekcje 6.5.', jednostka: 'u5' },
  { id: 'sekcja1', ikona: '🎒', nazwa: 'Cały Unit 6', opis: 'Ukończ wszystkie lekcje Unit 6.' },
  { id: 'boss1', ikona: '🚪', nazwa: 'Escaped!', opis: 'Wyjdź z escape roomu z wynikiem min. 80%.' },
  { id: 'gotowy', ikona: '🎓', nazwa: 'Kolokwium w zasięgu', opis: 'Gotowość na kolokwium min. 90%.' },
];
