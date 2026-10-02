// Sekcja WIEDZA — metadane artykułów.
// Treść każdego artykułu to plik HTML w src/teksty/<slug>.html (wynik skilla „artykuł badawczy”).
// Tytuł, lead i czas czytania są wyciągane z pliku automatycznie (src/lib/wiedza.js).
// Tu ustawiasz tylko: kategorię, serię, kolejność i tytuł pod Google (seoTitle).
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
  { slug: 'anatomia-procesu',   category: 'krypto', series: 'krypto', part: 1, seoTitle: 'Anatomia procesu — Ripple kontra SEC, wyjaśnienie sprawy XRP' },
  { slug: 'anatomia-wybranca',  category: 'krypto', series: 'krypto', part: 2, seoTitle: 'Anatomia wybrańca — historia Ripple i fakty o XRP' },
  { slug: 'anatomia-narracji',  category: 'krypto', series: 'krypto', part: 3, seoTitle: 'Anatomia narracji — mit „monet ISO 20022” pod lupą' },
  { slug: 'anatomia-wahadla',   category: 'krypto', series: 'krypto', part: 4, seoTitle: 'Anatomia wahadła — SEC za Genslera i zwrot w 2025 roku' },
  { slug: 'anatomia-tlumu',     category: 'krypto', series: 'krypto', part: 5, seoTitle: 'Anatomia tłumu — pump and dump, shilling i oszustwa w krypto' },
  { slug: 'anatomia-zaufania',  category: 'krypto', series: 'krypto', part: 6, seoTitle: 'Anatomia zaufania — jak upadła giełda FTX' },
  { slug: 'anatomia-konfliktu', category: 'krypto', series: 'krypto', part: 7, seoTitle: 'Anatomia konfliktu — memecoin Trumpa i pieniądze z krypto' },
  { slug: 'anatomia-obietnicy', category: 'krypto', seoTitle: 'Anatomia obietnicy — czy Tether (USDT) jest wart dolara?' },

  // --- Seria polityczna ---
  { slug: 'anatomia-wladzy',      category: 'polityka', series: 'polityka', part: 1, seoTitle: 'Anatomia władzy — jak działa polska polityka i jak sprawdzać polityków' },
  { slug: 'anatomia-zaniechania', category: 'polityka', series: 'polityka', part: 2, seoTitle: 'Anatomia zaniechania — powódź 2024 i odpowiedzialność państwa' },
  { slug: 'anatomia-podsluchu',   category: 'polityka', series: 'polityka', part: 3, seoTitle: 'Anatomia podsłuchu — afera Pegasusa bez partyjnych okularów' },
  { slug: 'anatomia-koncernu',    category: 'polityka', series: 'polityka', part: 4, seoTitle: 'Anatomia koncernu — Orlen między giełdą a polityką' },
  { slug: 'anatomia-luki',        category: 'polityka', series: 'polityka', part: 5, seoTitle: 'Anatomia luki — afera reprywatyzacyjna w Warszawie' },
  { slug: 'anatomia-liczby',      category: 'polityka', series: 'polityka', part: 6, seoTitle: 'Anatomia liczby — afera wizowa i liczby jako broń' },
  { slug: 'anatomia-sporu',       category: 'polityka', series: 'polityka', part: 7, seoTitle: 'Anatomia sporu — o co toczy się spór o praworządność' },
  { slug: 'anatomia-zakladu',     category: 'polityka', series: 'polityka', part: 8, seoTitle: 'Anatomia zakładu — CPK: na co dokładnie stawia Polska' },
  { slug: 'anatomia-weta',        category: 'polityka', seoTitle: 'Anatomia weta — Karol Nawrocki: fakty, zarzuty i weta' },

  // --- Zdrowie i umysł ---
  { slug: 'anatomia-znikania', category: 'zdrowie', seoTitle: 'Anatomia znikania — narkolepsja poza sennością' },
  { slug: 'anatomia-slodyczy', category: 'zdrowie', seoTitle: 'Anatomia słodyczy — cukier, wątroba i zdrowie metaboliczne' },
  { slug: 'trening-umyslu',    category: 'zdrowie', seoTitle: 'Trening umysłu — co nauka naprawdę mówi o medytacji' },
  { slug: 'mieso-czy-rosliny', category: 'zdrowie', seoTitle: 'Mięso czy rośliny — zdrowie, klimat i etyka w liczbach' },

  // --- Świat i technika ---
  { slug: 'anatomia-predkosci', category: 'swiat', seoTitle: 'Anatomia prędkości — jak działa samochód i kultura motoryzacji' },
];
