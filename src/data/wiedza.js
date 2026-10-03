// Sekcja WIEDZA — metadane artykułów.
// Treść każdego artykułu to plik HTML w src/teksty/<slug>.html (wynik skilla „artykuł badawczy”).
// Tytuł, lead i czas czytania są wyciągane z pliku automatycznie (src/lib/wiedza.js).
// Tu ustawiasz: kategorię, serię, kolejność, tytuł pod Google (seoTitle)
// i topic — prosty opis „o czym to jest”, który na kafelku jest głównym nagłówkiem
// (sama nazwa typu „Anatomia litra” nic nie mówi komuś, kto przegląda listę).
//
// Jak dodać nowy artykuł:
//   1. wrzuć plik do src/teksty/<slug>.html (slug: małe litery, myślniki, bez polskich znaków),
//   2. dopisz wpis poniżej,
//   3. commit + push.

export const CATEGORIES = [
  { id: 'krypto',   name: 'Krypto',          desc: 'Ripple, SEC, giełdy, stablecoiny i ludzie, którzy na tym zarabiają.' },
  { id: 'polityka', name: 'Polityka',        desc: 'Polskie afery i spory rozłożone na fakty, zarzuty i mechanizmy.' },
  { id: 'zdrowie',  name: 'Zdrowie i umysł', desc: 'Co nauka naprawdę mówi o jedzeniu, mózgu i uwadze.' },
  { id: 'swiat',    name: 'Świat i technika', desc: 'Jak działają rzeczy, które mijamy codziennie.' },
];

export const SERIES = {
  krypto:   { name: 'Seria krypto' },
  polityka: { name: 'Seria polityczna' },
};

export const ARTICLES = [
  // --- Seria krypto ---
  { slug: 'anatomia-procesu', topic: 'Ripple kontra SEC: o co toczył się proces o XRP i jak się skończył',    category: 'krypto', series: 'krypto', part: 1, seoTitle: 'Anatomia procesu — Ripple kontra SEC, wyjaśnienie sprawy XRP' },
  { slug: 'anatomia-wybranca', topic: 'Historia firmy Ripple i czy jej sukces oznacza zysk dla posiadaczy XRP',   category: 'krypto', series: 'krypto', part: 2, seoTitle: 'Anatomia wybrańca — historia Ripple i fakty o XRP' },
  { slug: 'anatomia-narracji', topic: 'Mit „monet ISO 20022”: skąd się wziął i dlaczego się nie sprawdził',   category: 'krypto', series: 'krypto', part: 3, seoTitle: 'Anatomia narracji — mit „monet ISO 20022” pod lupą' },
  { slug: 'anatomia-wahadla', topic: 'Jak amerykański regulator najpierw ścigał krypto, a potem nagle odpuścił',    category: 'krypto', series: 'krypto', part: 4, seoTitle: 'Anatomia wahadła — SEC za Genslera i zwrot w 2025 roku' },
  { slug: 'anatomia-tlumu', topic: 'Pompy, zrzuty i płatne polecenia: jak w krypto zarabia się na naiwnych',      category: 'krypto', series: 'krypto', part: 5, seoTitle: 'Anatomia tłumu — pump and dump, shilling i oszustwa w krypto' },
  { slug: 'anatomia-zaufania', topic: 'Jak w osiem dni upadła giełda FTX i jej założyciel',   category: 'krypto', series: 'krypto', part: 6, seoTitle: 'Anatomia zaufania — jak upadła giełda FTX' },
  { slug: 'anatomia-konfliktu', topic: 'Memecoin Trumpa i pieniądze, które jego rodzina zarobiła na krypto',  category: 'krypto', series: 'krypto', part: 7, seoTitle: 'Anatomia konfliktu — memecoin Trumpa i pieniądze z krypto' },
  { slug: 'anatomia-obietnicy', topic: 'Czy stablecoin Tether (USDT) naprawdę jest wart dolara',  category: 'krypto', seoTitle: 'Anatomia obietnicy — czy Tether (USDT) jest wart dolara?' },

  // --- Seria polityczna ---
  { slug: 'anatomia-wladzy', topic: 'Jak działa polska polityka i jak samodzielnie sprawdzać polityków',       category: 'polityka', series: 'polityka', part: 1, seoTitle: 'Anatomia władzy — jak działa polska polityka i jak sprawdzać polityków' },
  { slug: 'anatomia-zaniechania', topic: 'Powódź 2024: co zawalił system, a co konkretni ludzie',  category: 'polityka', series: 'polityka', part: 2, seoTitle: 'Anatomia zaniechania — powódź 2024 i odpowiedzialność państwa' },
  { slug: 'anatomia-podsluchu', topic: 'Afera Pegasusa: podsłuchy, za którymi nikt nie nadzoruje państwa',    category: 'polityka', series: 'polityka', part: 3, seoTitle: 'Anatomia podsłuchu — afera Pegasusa bez partyjnych okularów' },
  { slug: 'anatomia-koncernu', topic: 'Orlen: spółka giełdowa, narzędzie państwa czy łup polityków',     category: 'polityka', series: 'polityka', part: 4, seoTitle: 'Anatomia koncernu — Orlen między giełdą a polityką' },
  { slug: 'anatomia-luki', topic: 'Afera reprywatyzacyjna w Warszawie: jak brak ustawy oddał kamienice w złe ręce',         category: 'polityka', series: 'polityka', part: 5, seoTitle: 'Anatomia luki — afera reprywatyzacyjna w Warszawie' },
  { slug: 'anatomia-liczby', topic: 'Afera wizowa i to, jak liczby stają się bronią w polityce',       category: 'polityka', series: 'polityka', part: 6, seoTitle: 'Anatomia liczby — afera wizowa i liczby jako broń' },
  { slug: 'anatomia-sporu', topic: 'Spór o praworządność: o co naprawdę kłócą się obie strony',        category: 'polityka', series: 'polityka', part: 7, seoTitle: 'Anatomia sporu — o co toczy się spór o praworządność' },
  { slug: 'anatomia-zakladu', topic: 'CPK: na co dokładnie stawia Polska, budując nowe lotnisko',      category: 'polityka', series: 'polityka', part: 8, seoTitle: 'Anatomia zakładu — CPK: na co dokładnie stawia Polska' },
  { slug: 'anatomia-weta', topic: 'Karol Nawrocki: fakty, zarzuty i jego prezydenckie weta',         category: 'polityka', seoTitle: 'Anatomia weta — Karol Nawrocki: fakty, zarzuty i weta' },

  // --- Zdrowie i umysł ---
  { slug: 'anatomia-znikania', topic: 'Narkolepsja z bliska: objawy, badania i codzienne życie z chorobą',  category: 'zdrowie', seoTitle: 'Anatomia znikania — narkolepsja poza sennością' },
  { slug: 'anatomia-slodyczy', topic: 'Co cukier naprawdę robi z wątrobą i metabolizmem',  category: 'zdrowie', seoTitle: 'Anatomia słodyczy — cukier, wątroba i zdrowie metaboliczne' },
  { slug: 'trening-umyslu', topic: 'Co badania naprawdę mówią o medytacji',     category: 'zdrowie', seoTitle: 'Trening umysłu — co nauka naprawdę mówi o medytacji' },
  { slug: 'mieso-czy-rosliny', topic: 'Dieta mięsna czy roślinna: zdrowie, klimat i etyka w liczbach',  category: 'zdrowie', seoTitle: 'Mięso czy rośliny — zdrowie, klimat i etyka w liczbach' },

  // --- Świat i technika ---
  { slug: 'anatomia-litra', topic: 'Skąd się wzięły rekordowe ceny paliw w 2026 roku',  category: 'swiat', seoTitle: 'Anatomia litra — kryzys paliwowy 2026 i ceny paliw w Polsce' },
  { slug: 'anatomia-predkosci', topic: 'Jak działa szybki samochód: turbo, oznaczenia, marki i hipersamochody',  category: 'swiat', seoTitle: 'Anatomia prędkości — jak działa samochód i kultura motoryzacji' },
];
