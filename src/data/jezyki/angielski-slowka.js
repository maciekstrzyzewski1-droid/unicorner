// Angielski — sekcja „Słówka z zajęć”: lista słówek Unit 6 od prowadzącego (dwie kartki, 2026-11-24),
// bez powtórzeń (marine life, mainland / main land, package / package tour, white-sand beach(es)).
// Fiszki odwrotne: na przodzie polski, na odwrocie angielski z wymową i przykładem. Przykłady własne.
import { FPL, en, tab } from './narzedzia.js';

// [angielski, polski, przykład]
const TURYSTYKA = [
  ['hotel chain', 'sieć hoteli', 'Big hotel chains are opening resorts on the coast.'],
  ['eco-resort', 'ekologiczny ośrodek wypoczynkowy', 'The eco-resort uses solar power and recycles its water.'],
  ['eco-tourism', 'ekoturystyka', 'Eco-tourism helps to protect nature.'],
  ['mainland', 'ląd stały (nie wyspa)', 'The ferry to the mainland takes an hour.'],
  ['marine life', 'życie morskie: ryby, rafy, delfiny', 'Divers come here to see the marine life.'],
  ['mass tourism', 'turystyka masowa', 'Mass tourism has changed many Spanish beaches.'],
  ['national park', 'park narodowy', 'The national park protects rare animals.'],
  ['to overdevelop', 'nadmiernie zabudować', 'Some coastal towns have been overdeveloped.'],
  ['package tour', 'wycieczka w pakiecie (lot + hotel)', 'You can book a package tour and choose a luxury hotel.'],
  ['tour guide', 'przewodnik (osoba)', 'Our tour guide showed us the old town.'],
  ['tourist trap', 'pułapka na turystów', 'That restaurant is a tourist trap. Avoid it!'],
  ['hotspot', 'modne, oblegane miejsce', 'Barcelona is a tourist hotspot.'],
  ['white-sand beach', 'plaża z białym piaskiem', 'The island is famous for its white-sand beaches.'],
  ['infrastructure', 'infrastruktura (drogi, lotniska, sieci)', 'Infrastructure has improved in recent years.'],
  ['guesthouse', 'pensjonat, dom gościnny', 'We stayed in a small family-run guesthouse.'],
  ['bed and breakfast', 'pensjonat ze śniadaniem (B&B)', 'We stayed at a cosy bed and breakfast.'],
];
const BOOM = [
  ['underbelly', 'ciemna, ukryta strona (czegoś)', 'This is the dark underbelly of the tourism boom.'],
  ['solitude', 'samotność, odosobnienie (w spokoju)', 'People come to Iceland for its solitude.'],
  ['to grab a shot', 'szybko zrobić zdjęcie', 'Everyone stops to grab a shot of the waterfall.'],
  ['photobombing', 'wchodzenie komuś w kadr', 'Photobombing is a problem at crowded sights.'],
  ['heritage', 'dziedzictwo', 'The old town is part of our cultural heritage.'],
  ['to account for', 'stanowić (część czegoś)', 'Tourism accounts for almost 15 percent of GDP.'],
  ['retired', 'emerytowany, na emeryturze', 'Many visitors are retired couples.'],
  ['to get a grip on', 'opanować (sytuację), zapanować nad', 'The government must get a grip on mass tourism.'],
  ['till', 'kasa sklepowa (też: do, = until)', 'Tourist money goes straight into the till.'],
  ['growing pains', 'problemy wzrostu (trudności szybkiego rozwoju)', 'Iceland’s tourism industry is going through growing pains.'],
  ['to put a ceiling on / to cap', 'ustalić limit, ograniczyć', 'The city wants to cap the number of visitors.'],
  ['to get booted out', 'zostać wyrzuconym', 'Locals get booted out of their flats to make room for tourists.'],
  ['to ban', 'zakazać', 'Some cities ban big cruise ships.'],
  ['oversupply', 'nadpodaż', 'There is an oversupply of hotel rooms in winter.'],
  ['the downside of', 'minus, wada (czegoś)', 'The downside of tourism is overcrowding.'],
  ['sky-high', 'niebotyczny, bardzo wysoki (np. ceny)', 'Prices in Reykjavík are sky-high.'],
];
const NETWORKING = [
  ['unique visitor', 'unikalny użytkownik strony (liczony raz)', 'Our website has two million unique visitors a month.'],
  ['interface design', 'projekt interfejsu (wygląd i obsługa ekranu)', 'The app has clean interface design.'],
  ['to pique someone’s interest', 'wzbudzić czyjeś zainteresowanie', 'The headline piqued my interest.'],
  ['novice', 'nowicjusz, początkujący', 'I’m a complete novice at networking.'],
  ['to be homesick', 'tęsknić za domem', 'She was homesick during her first month abroad.'],
  ['picturesque', 'malowniczy (ładny w starym stylu)', 'It’s a picturesque fishing village.'],
  ['laid-back', 'wyluzowany, spokojny', 'The staff are very laid-back.'],
  ['to look into something', 'przyjrzeć się czemuś, sprawdzić', 'I’ll look into it and call you back.'],
  ['we can fill you in', 'możemy wprowadzić cię w szczegóły', 'Call us and we can fill you in on the details.'],
  ['That’s neat!', 'Sprytne! Fajnie to działa!', 'You can book in one click? That’s neat!'],
];

export const SLOWKA_LICZBA = TURYSTYKA.length + BOOM.length + NETWORKING.length;
const lista = (slowa) => tab(slowa.map(([a, pl]) => [en(a), pl]), ['angielski', 'polski']);
const fiszki = (slowa) => slowa.map(([a, pl, ex]) => FPL(pl, a, ex));
const lekcja = (id, tytul, slowa, h) => ({
  id, tytul, ile: slowa.length,
  nowe: [{ h, html: `Przejrzyj listę, potem fiszki: na przodzie <b>polski</b>, powiedz po angielsku, stuknij i na odwrocie sprawdź odpowiedź i wymowę. Oceniaj się uczciwie: „Jeszcze nie” wraca na końcu lekcji.${lista(slowa)}` }],
  pula: fiszki(slowa),
});

export const SEKCJA_SLOWKA = {
  id: 's3', nazwa: 'Słówka z zajęć', pl: `${SLOWKA_LICZBA} słówek z listy prowadzącego · fiszki: najpierw polski, potem angielski`,
  jednostki: [
    {
      id: 'v1', tytul: 'Vocabulary · Unit 6', pl: 'turystyka, boom turystyczny, networking', ikona: '🗂️', kolokwium: true, zrodlo: 'lista słówek z zajęć (Unit 6)',
      lekcje: [
        lekcja('v1l1', 'Turystyka 1/2', TURYSTYKA.slice(0, 8), 'Turystyka i hotelarstwo (1/2)'),
        lekcja('v1l2', 'Turystyka 2/2', TURYSTYKA.slice(8), 'Turystyka i hotelarstwo (2/2)'),
        lekcja('v1l3', 'Boom turystyczny 1/2', BOOM.slice(0, 8), 'Boom turystyczny (1/2)'),
        lekcja('v1l4', 'Boom turystyczny 2/2', BOOM.slice(8), 'Boom turystyczny (2/2)'),
        lekcja('v1l5', 'Networking i opisy', NETWORKING, 'Networking i opisy miejsc'),
      ],
    },
  ],
  powtorka: { id: 's3rep', tytul: 'Wszystkie słówka losowo', ile: 15 },
};
