// Kurs „Hiszpański” — ścieżka w kolejności zajęć (UEP, hiszpański w biznesie, poziom A1).
// Źródła: notatki z zajęć z folderu „Hiszpański nauka” (semestr letni: 9.03–1.06, semestr zimowy:
// 13.10–listopad), „powtórka przed testem” (escape room, Reto 1–7) i zakres kolokwium 1 z notatek:
// Reto 1 (rodzaj przymiotników i zawodów: str. 33 ćw. 10 + niebieskie słówka ze str. 31 ćw. 3b),
// cele na przyszłość (querer), zaimki dzierżawcze, opis osoby z obrazka, odmiana czasowników, kolory.
// Ćwiczenia to własne opracowanie — zdania z zajęć są przeformułowane, nie przepisane.
import { W, WIELE, P, U, PARY, KAT, LUKI, SLUCHAJ, PISZ, es, tab, paryZ, znaczy, jakPowiesz } from './narzedzia.js';

// ─────────────────────────────── czasowniki ───────────────────────────────
export const OSOBY = ['yo', 'tú', 'él / ella / usted', 'nosotros / nosotras', 'vosotros / vosotras', 'ellos / ellas / ustedes'];
// `reg`: końcówka czasownika regularnego (sprawdzane skryptem narzedzia/jezyki-check/sprawdz.mjs)
export const V = {
  ser: { pl: 'być', f: ['soy', 'eres', 'es', 'somos', 'sois', 'son'], uw: 'SER jest nieregularny — formy trzeba znać na pamięć.' },
  llamarse: { pl: 'nazywać się', f: ['me llamo', 'te llamas', 'se llama', 'nos llamamos', 'os llamáis', 'se llaman'], uw: 'Przed czasownikiem stoi zaimek: me, te, se, nos, os, se.' },
  estudiar: { pl: 'uczyć się, studiować', reg: 'ar', f: ['estudio', 'estudias', 'estudia', 'estudiamos', 'estudiáis', 'estudian'] },
  hablar: { pl: 'mówić, rozmawiać', reg: 'ar', f: ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan'] },
  trabajar: { pl: 'pracować', reg: 'ar', f: ['trabajo', 'trabajas', 'trabaja', 'trabajamos', 'trabajáis', 'trabajan'] },
  llevar: { pl: 'nosić, zanosić', reg: 'ar', f: ['llevo', 'llevas', 'lleva', 'llevamos', 'lleváis', 'llevan'] },
  ensenar: { pl: 'uczyć (kogoś)', bez: 'enseñar', reg: 'ar', f: ['enseño', 'enseñas', 'enseña', 'enseñamos', 'enseñáis', 'enseñan'] },
  vender: { pl: 'sprzedawać', reg: 'er', f: ['vendo', 'vendes', 'vende', 'vendemos', 'vendéis', 'venden'] },
  leer: { pl: 'czytać', reg: 'er', f: ['leo', 'lees', 'lee', 'leemos', 'leéis', 'leen'] },
  aprender: { pl: 'uczyć się (czegoś)', reg: 'er', f: ['aprendo', 'aprendes', 'aprende', 'aprendemos', 'aprendéis', 'aprenden'] },
  vivir: { pl: 'mieszkać, żyć', reg: 'ir', f: ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven'] },
  escribir: { pl: 'pisać', reg: 'ir', f: ['escribo', 'escribes', 'escribe', 'escribimos', 'escribís', 'escriben'] },
  recibir: { pl: 'przyjmować, dostawać', reg: 'ir', f: ['recibo', 'recibes', 'recibe', 'recibimos', 'recibís', 'reciben'] },
  hacer: { pl: 'robić', f: ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen'], uw: 'Nieregularna jest tylko forma „yo”: hago. Reszta jak w czasownikach na -er.' },
  tener: { pl: 'mieć', f: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'], uw: 'TENER: e → ie (tienes, tiene, tienen), ale nosotros i vosotros zostają z „e”. „Yo” ma własną formę: tengo.' },
  querer: { pl: 'chcieć', f: ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren'], uw: 'QUERER: e → ie we wszystkich osobach poza nosotros i vosotros (queremos, queréis).' },
  ir: { pl: 'iść, jechać', f: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'], uw: 'IR jest całkiem nieregularny: voy, vas, va, vamos, vais, van.' },
};
const nazwa = (v) => V[v].bez || v;

/** Krótki dryl: osoba + bezokolicznik → forma. */
function dryl(v, idx) {
  return idx.map((i) => P(`<b>${OSOBY[i]}</b> … <i>(${nazwa(v)})</i>`, V[v].f[i],
    `${OSOBY[i]} → ${es(V[v].f[i])}. ${V[v].uw || `Regularny czasownik na -${V[v].reg}: końcówki jak w tabelce.`}`, { pod: 'forma czasownika' }));
}
/** Pełna odmiana w 6 polach. */
const ODM = (v, x) => ({ t: 'odm', v: nazwa(v), pl: V[v].pl, f: V[v].f, q: `Odmień czasownik ${es(nazwa(v))} (${V[v].pl})`, x: x || V[v].uw || `Regularny na -${V[v].reg}: odcinasz -${V[v].reg} i dokładasz końcówki.` });
/** Tabelka odmiany do kart „Nowe”. */
const tabOdm = (v) => tab(OSOBY.map((o, i) => [o, es(V[v].f[i])]), [`${nazwa(v)} — ${V[v].pl}`, '']);

// ─────────────────────────────── postacie do opisu ───────────────────────────────
// Parametry: plec m/k, wzrost alto/bajo, wiek joven/mayor, budowa delgado/gordo,
// pelo rubio/moreno/blanco (blanco tylko u osób starszych), ojos azules/verdes/marrones/negros,
// gafas, barba, bigote (barba i bigote tylko u mężczyzn).
const r = (p, m, k) => (p.plec === 'k' ? k : m);
function cechy(p) {
  const s = [];
  s.push(`Es ${r(p, p.wzrost, p.wzrost.replace(/o$/, 'a'))}.`);
  s.push(`Es ${p.wiek}.`);
  s.push(`Es ${r(p, p.budowa, p.budowa.replace(/o$/, 'a'))}.`);
  if (p.pelo === 'blanco') s.push('Tiene el pelo blanco.');
  else s.push(`Es ${r(p, p.pelo, p.pelo.replace(/o$/, 'a'))}.`);
  s.push(`Tiene los ojos ${p.ojos}.`);
  return s;
}
const PRZECIW = { alto: 'bajo', bajo: 'alto', joven: 'mayor', mayor: 'joven', delgado: 'gordo', gordo: 'delgado', rubio: 'moreno', moreno: 'rubio' };
const INNE_OCZY = { azules: 'marrones', verdes: 'negros', marrones: 'azules', negros: 'verdes' };
/** Zdania fałszywe o postaci — po jednym na cechę (klucze jak w `cechy`). */
function falsz(p) {
  const f = (w) => r(p, w, w.replace(/o$/, 'a'));
  return {
    wzrost: `Es ${f(PRZECIW[p.wzrost])}.`,
    wiek: `Es ${PRZECIW[p.wiek]}.`,
    budowa: `Es ${f(PRZECIW[p.budowa])}.`,
    ojos: `Tiene los ojos ${INNE_OCZY[p.ojos]}.`,
    gafas: p.gafas ? 'No lleva gafas.' : 'Lleva gafas.',
  };
}
function dodatki(p) {
  const s = [];
  if (p.gafas) s.push('Lleva gafas.');
  if (p.barba) s.push('Lleva barba.');
  if (p.bigote) s.push('Lleva bigote.');
  return s;
}
/** Zestaw ćwiczeń do jednej postaci: zaznacz prawdziwe, wpisz kolor oczu, ułóż opis. */
function opisz(p) {
  const [tWzrost, tWiek, , tPelo, tOjos] = cechy(p);
  const zle = falsz(p);
  // 4 prawdziwe + 3 fałszywe, przeplecione
  const dod = dodatki(p);
  const nosi = [p.gafas && 'gafas', p.barba && 'barba', p.bigote && 'bigote'].filter(Boolean);
  const o = [tWzrost, zle.wzrost, tOjos, zle.ojos, tWiek, zle.gafas, tPelo, ...dod.slice(0, 1)];
  const d = [0, 2, 4, 6, ...(dod.length ? [7] : [])];
  const ona = p.plec === 'k';
  const wzrost = r(p, p.wzrost, p.wzrost.replace(/o$/, 'a'));
  const budowa = r(p, p.budowa, p.budowa.replace(/o$/, 'a'));
  return [
    WIELE(`Popatrz na ${ona ? 'nią' : 'niego'}. Zaznacz <b>wszystkie</b> zdania prawdziwe.`, o, d,
      `Prawdziwe: ${d.map((i) => es(o[i])).join(' ')} Pamiętaj: wygląd → <b>ser</b> (es ${wzrost}), oczy → <b>tener</b> (tiene los ojos…), okulary, broda, wąsy → <b>llevar</b>.`, { aw: p }),
    P('Uzupełnij: Tiene los ojos …', p.ojos, `Kolor oczu podajemy z <b>tener los ojos</b>. Ojos to liczba mnoga, więc kolor też: ${es('tiene los ojos ' + p.ojos)}.`, { aw: p, pod: 'kolor' }),
    U(`Ułóż opis: ${ona ? 'Ona' : 'On'} jest ${ona ? (p.wzrost === 'alto' ? 'wysoka' : 'niska') : (p.wzrost === 'alto' ? 'wysoki' : 'niski')} i ${ona ? (p.budowa === 'delgado' ? 'szczupła' : 'gruba') : (p.budowa === 'delgado' ? 'szczupły' : 'gruby')}.`,
      `Es ${wzrost} y ${budowa}.`,
      `${es(`Es ${wzrost} y ${budowa}.`)} Przymiotnik zgadza się z osobą: ${ona ? 'kobieta → końcówka -a' : 'mężczyzna → końcówka -o'}.`,
      [r(p, p.wzrost.replace(/o$/, 'a'), p.wzrost), 'tiene', 'lleva'], { aw: p, alt: [`Es ${budowa} y ${wzrost}.`] }),
    ...(nosi.length ? [P('Popatrz i uzupełnij: Lleva …', [nosi.join(' y '), [...nosi].reverse().join(' y ')], `Okulary, brodę i wąsy się nosi: ${es('lleva ' + nosi.join(' y '))}.`, { aw: p, pod: 'co nosi?' })] : []),
  ];
}
const POSTACIE = {
  lucia: { imie: 'Lucía', plec: 'k', wzrost: 'alto', wiek: 'joven', budowa: 'delgado', pelo: 'rubio', ojos: 'azules', gafas: true, barba: false, bigote: false },
  jorge: { imie: 'Jorge', plec: 'm', wzrost: 'bajo', wiek: 'mayor', budowa: 'gordo', pelo: 'blanco', ojos: 'marrones', gafas: false, barba: true, bigote: true },
  pablo: { imie: 'Pablo', plec: 'm', wzrost: 'alto', wiek: 'joven', budowa: 'delgado', pelo: 'moreno', ojos: 'verdes', gafas: true, barba: false, bigote: true },
  carmen: { imie: 'Carmen', plec: 'k', wzrost: 'bajo', wiek: 'mayor', budowa: 'gordo', pelo: 'blanco', ojos: 'verdes', gafas: true, barba: false, bigote: false },
  ana: { imie: 'Ana', plec: 'k', wzrost: 'bajo', wiek: 'joven', budowa: 'delgado', pelo: 'moreno', ojos: 'negros', gafas: false, barba: false, bigote: false },
  diego: { imie: 'Diego', plec: 'm', wzrost: 'alto', wiek: 'joven', budowa: 'gordo', pelo: 'rubio', ojos: 'azules', gafas: false, barba: true, bigote: false },
};
export { POSTACIE, cechy, dodatki };

// ─────────────────────────────── słownictwo ───────────────────────────────
const SALUDOS = [['hola', 'cześć'], ['adiós', 'do widzenia'], ['hasta luego', 'do zobaczenia'], ['buenos días', 'dzień dobry (6–14)'], ['¿qué tal?', 'jak leci?'], ['buenas noches', 'dobry wieczór / dobranoc (21–6)'], ['buenas tardes', 'dzień dobry (14–21)'], ['regular', 'tak sobie']];
const CLASE = [['no entiendo', 'nie rozumiem'], ['no sé', 'nie wiem'], ['repite', 'powtórz'], ['¿está claro?', 'czy to jasne?'], ['el ejercicio', 'ćwiczenie'], ['el nombre', 'imię'], ['el apellido', 'nazwisko'], ['¿listo?', 'gotowe?']];
const NUM = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
  'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'treinta y uno'];
const DIAS = [['lunes', 'poniedziałek'], ['martes', 'wtorek'], ['miércoles', 'środa'], ['jueves', 'czwartek'], ['viernes', 'piątek'], ['sábado', 'sobota'], ['domingo', 'niedziela']];
const MESES = [['enero', 'styczeń'], ['febrero', 'luty'], ['marzo', 'marzec'], ['abril', 'kwiecień'], ['mayo', 'maj'], ['junio', 'czerwiec'], ['julio', 'lipiec'], ['agosto', 'sierpień'], ['septiembre', 'wrzesień'], ['octubre', 'październik'], ['noviembre', 'listopad'], ['diciembre', 'grudzień']];
const DIRECCION = [['la calle', 'ulica'], ['la avenida', 'aleja'], ['la urbanización', 'osiedle'], ['la plaza', 'plac'], ['el paseo', 'deptak, promenada'], ['el código postal', 'kod pocztowy'], ['la dirección', 'adres'], ['el correo electrónico', 'e-mail'], ['la arroba', 'znak @ (małpa)'], ['el punto', 'kropka']];
const EMPRESA = [['la empresa', 'firma'], ['el departamento', 'dział (w firmie)'], ['el puesto', 'stanowisko'], ['el departamento comercial', 'dział handlowy'], ['el departamento financiero', 'dział finansowy'], ['el departamento de personal', 'dział kadr'], ['la tarjeta de visita', 'wizytówka'], ['el cumpleaños', 'urodziny'], ['el santo', 'imieniny'], ['la edad', 'wiek']];
const PAISES = [['Polonia', 'Varsovia'], ['Alemania', 'Berlín'], ['Francia', 'París'], ['Italia', 'Roma'], ['Reino Unido', 'Londres', 'del Reino Unido'], ['Japón', 'Tokio'], ['China', 'Pekín'], ['Cuba', 'La Habana'], ['Colombia', 'Bogotá'], ['España', 'Madrid']];
const PROF = [['el médico / la médica', 'lekarz / lekarka'], ['el profesor / la profesora', 'nauczyciel / nauczycielka'], ['el / la periodista', 'dziennikarz / dziennikarka'], ['el / la recepcionista', 'recepcjonista / recepcjonistka'], ['el camarero / la camarera', 'kelner / kelnerka'], ['el mecánico / la mecánica', 'mechanik'], ['el abogado / la abogada', 'adwokat, prawnik'], ['el / la contable', 'księgowy / księgowa'], ['el dependiente / la dependienta', 'sprzedawca / sprzedawczyni'], ['el peluquero / la peluquera', 'fryzjer / fryzjerka'], ['el fotógrafo / la fotógrafa', 'fotograf'], ['el ingeniero / la ingeniera', 'inżynier'], ['el / la economista', 'ekonomista / ekonomistka']];
const FAMILIA = [['el padre', 'ojciec'], ['la madre', 'matka'], ['los padres', 'rodzice'], ['el hijo', 'syn'], ['la hija', 'córka'], ['los hijos', 'dzieci'], ['el hermano', 'brat'], ['la hermana', 'siostra'], ['los hermanos', 'rodzeństwo / bracia'], ['el abuelo', 'dziadek'], ['la abuela', 'babcia'], ['los abuelos', 'dziadkowie'], ['el tío', 'wujek'], ['la tía', 'ciocia'], ['el primo', 'kuzyn'], ['la prima', 'kuzynka']];
const FISICO = [['alto', 'wysoki'], ['bajo', 'niski'], ['joven', 'młody'], ['mayor', 'starszy, w podeszłym wieku'], ['delgado', 'szczupły'], ['gordo', 'gruby'], ['rubio', 'blondyn (jasne włosy)'], ['moreno', 'brunet (ciemne włosy)'], ['guapo', 'przystojny, ładny'], ['feo', 'brzydki'], ['las gafas', 'okulary'], ['la barba', 'broda'], ['el bigote', 'wąsy']];
const COLORES = [['rojo', 'czerwony', '#e5383b'], ['amarillo', 'żółty', '#ffd23f'], ['azul', 'niebieski', '#3a86ff'], ['verde', 'zielony', '#2fbf71'], ['blanco', 'biały', '#f5f5f5'], ['negro', 'czarny', '#111111'], ['gris', 'szary', '#8d8d99'], ['marrón', 'brązowy', '#8b5a2b'], ['naranja', 'pomarańczowy', '#ff8c1a'], ['rosa', 'różowy', '#ff7eb6'], ['morado', 'fioletowy', '#8e44ec']];
const CARACTER = [['tranquilo', 'spokojny'], ['nervioso', 'nerwowy'], ['ordenado', 'uporządkowany'], ['desordenado', 'nieuporządkowany, bałaganiarz'], ['simpático', 'sympatyczny'], ['antipático', 'niesympatyczny'], ['alegre', 'wesoły'], ['triste', 'smutny'], ['optimista', 'optymista'], ['pesimista', 'pesymista'], ['amable', 'miły'], ['tímido', 'nieśmiały'], ['divertido', 'zabawny'], ['serio', 'poważny']];
const CONTRARIOS = [['responsable', 'irresponsable'], ['extrovertido', 'introvertido'], ['distante', 'cercano'], ['formal', 'informal'], ['trabajador', 'vago'], ['simpático', 'antipático'], ['abierto', 'cerrado']];
const CUALIDADES = [['motivador', 'motywujący'], ['creativo', 'kreatywny'], ['formal', 'poważny, formalny'], ['conciliador', 'pojednawczy, łagodzący spory'], ['innovador', 'innowacyjny'], ['abierto', 'otwarty'], ['comunicativo', 'komunikatywny'], ['habilidoso', 'zdolny, zręczny'], ['eficaz', 'skuteczny'], ['rápido', 'szybki']];
const PLANES = [['ir a la playa', 'jechać na plażę'], ['salir de noche', 'wychodzić wieczorem'], ['ganar mucho dinero', 'zarabiać dużo pieniędzy'], ['tener un buen horario', 'mieć dobre godziny pracy'], ['trabajar en otro país', 'pracować w innym kraju'], ['ir de compras', 'iść na zakupy'], ['hacer un curso de cocina', 'zrobić kurs gotowania'], ['tener un jefe amable', 'mieć miłego szefa'], ['ir a un concierto', 'iść na koncert'], ['descansar', 'odpoczywać']];

// Kategorie z Reto 1 (zajęcia: „powtórka przed testem”)
const K3 = ['-o / -a (-os / -as)', '-or / -ora (-ores / -oras)', 'formas invariables (ta sama forma)'];
// Tłumaczenia przymiotników ze str. 33 ćw. 10 (karta „Nowe” i pary w u8l2)
const CONTRARIOS_PL = { responsable: 'odpowiedzialny', irresponsable: 'nieodpowiedzialny', extrovertido: 'otwarty na ludzi (ekstrawertyk)', introvertido: 'skryty (introwertyk)', distante: 'zdystansowany', cercano: 'przystępny, bezpośredni', formal: 'formalny', informal: 'swobodny, nieformalny', trabajador: 'pracowity', vago: 'leniwy', simpático: 'sympatyczny', antipático: 'niesympatyczny', abierto: 'otwarty', cerrado: 'zamknięty' };

// ─────────────────────────────── KURS ───────────────────────────────
export const KURS = {
  slug: 'hiszpanski',
  jezyk: 'es-ES',
  nazwa: 'Hiszpański',
  flaga: '🇪🇸',
  h1: 'Hiszpański',
  h1Grad: 'krok po kroku',
  opis: 'Ścieżka w kolejności zajęć z hiszpańskiego w biznesie na UEP: od powitań i danych osobowych, przez zawody, rodzinę i wygląd, po zaimki dzierżawcze i cele na przyszłość. Krótkie lekcje, natychmiastowe wyjaśnienia i próbne kolokwium jako escape room.',
  kolokwium: { nazwa: 'Kolokwium 1', jednostki: ['u7', 'u8', 'u9', 'u10'], boss: 'boss1' },
  sekcje: [
    {
      id: 's1', nazwa: 'Sekcja 1 · Primeros pasos', pl: 'semestr letni: od „¡Hola!” do rozmowy na targach pracy',
      jednostki: [
        // ───────────── U1 ─────────────
        {
          id: 'u1', tytul: '¡Hola!', pl: 'powitania, przedstawianie się, liczby 0–20', ikona: '👋', zrodlo: 'zajęcia: Saludos, 9.03',
          lekcje: [
            {
              id: 'u1l1', tytul: 'Saludos — powitania', ile: 9,
              nowe: [
                { h: 'Formalnie czy na luzie?', html: `Powitanie zależy od pory dnia (godziny jak na zajęciach):${tab([[es('Buenos días.'), '6–14', 'dzień dobry'], [es('Buenas tardes.'), '14–21', 'dzień dobry (po południu)'], [es('Buenas noches.'), '21–6', 'dobry wieczór / dobranoc'], [es('Adiós.'), '—', 'do widzenia']], ['formalne', 'godz.', 'znaczy'])}Na luzie: ${es('Hola.')} ${es('Hola, ¿qué tal?')} — ${es('Bien / regular, ¿y tú?')} Pożegnanie: ${es('Hasta luego')} — do zobaczenia.` },
              ],
              pula: [
                W('Jest 9:30. Wchodzisz do sekretariatu dziekanatu. Mówisz:', ['Buenos días.', 'Buenas tardes.', 'Buenas noches.', 'Hasta luego.'], 'Do 14:00 mówimy <b>buenos días</b>. Buenas tardes jest od 14 do 21, a buenas noches od 21.'),
                W('Jest 16:00. Witasz klienta w firmie. Mówisz:', ['Buenas tardes.', 'Buenos días.', 'Buenas noches.', 'Adiós.'], 'Między 14 a 21 mówimy <b>buenas tardes</b>. Adiós to pożegnanie, nie powitanie.'),
                W('Jest 22:00, wychodzisz z imprezy firmowej. Mówisz:', ['Buenas noches.', 'Buenos días.', 'Buenas tardes.', 'Hola.'], 'Po 21 mówimy <b>buenas noches</b> — działa i na powitanie, i na pożegnanie.'),
                W('Kolega pyta: „Hola, ¿qué tal?”. Co odpowiesz?', ['Bien, ¿y tú?', 'Buenas noches.', 'Me llamo Eva.', 'Adiós.'], '¿Qué tal? = jak leci? Odpowiadamy: <b>bien</b> (dobrze) albo <b>regular</b> (tak sobie) i odbijamy pytanie: <b>¿y tú?</b>'),
                KAT('Posortuj: formalne czy nieformalne?', ['formalne', 'nieformalne'], [['Buenos días.', 0], ['Buenas tardes.', 0], ['Adiós.', 0], ['Hola.', 1], ['¿Qué tal?', 1], ['Hasta luego.', 1]], 'Na zajęciach: formalne to buenos días / buenas tardes / buenas noches / adiós, nieformalne to hola, ¿qué tal?, hasta luego.'),
                U('Ułóż: Cześć, jak leci?', 'Hola, ¿qué tal?', 'Pytajnik po hiszpańsku stawiamy na początku (odwrócony ¿) i na końcu pytania.', ['Adiós', 'días']),
                P('Napisz po hiszpańsku: do zobaczenia', ['hasta luego', 'hasta pronto', 'nos vemos'], `Do zobaczenia = ${es('hasta luego')}. Też dobrze: ${es('hasta pronto')}, ${es('nos vemos')}.`),
                ...paryZ(SALUDOS.slice(0, 5)),
                SLUCHAJ('Buenas tardes', ['Buenas tardes', 'Buenas noches', 'Buenos días', 'Hasta luego'], 'Słychać <b>tardes</b> — po południu.'),
              ],
            },
            {
              id: 'u1l2', tytul: 'Me llamo… — jak się nazywasz', ile: 9,
              nowe: [
                { h: 'LLAMARSE — nazywać się', html: `${tabOdm('llamarse')}Pytanie i odpowiedź: ${es('¿Cómo te llamas?')} — ${es('Me llamo Eva Rufo.')}<br>Do Pana/Pani (usted): ${es('¿Cómo se llama usted?')}<br>Jak się pisze? ${es('¿Cómo se escribe?')} — ${es('El nombre se escribe…')} · ${es('El apellido se escribe…')}` },
              ],
              pula: [
                ODM('llamarse'),
                ...dryl('llamarse', [0, 1, 3, 4, 5]),
                W('Jak zapytasz kolegę o imię?', ['¿Cómo te llamas?', '¿Cómo se llama usted?', '¿Cómo se escribe?', '¿Qué tal?'], 'Do kolegi mówimy na „ty”: <b>¿Cómo te llamas?</b> Forma z „usted” jest do Pana/Pani.'),
                W('Jak zapytasz o imię profesora (grzecznie)?', ['¿Cómo se llama usted?', '¿Cómo te llamas?', '¿Cómo os llamáis?', '¿Cómo me llamo?'], '<b>Usted</b> (Pan/Pani) odmienia się jak él/ella: se llama.'),
                PARY([['el nombre', 'imię'], ['el apellido', 'nazwisko'], ['¿Cómo se escribe?', 'Jak się pisze?'], ['¿Cómo te llamas?', 'Jak się nazywasz?'], ['Me llamo…', 'Nazywam się…']]),
                U('Ułóż: Nazywam się Ana, a ty, jak się nazywasz?', 'Me llamo Ana, ¿y tú, cómo te llamas?', 'Odbicie pytania: <b>¿y tú…?</b> = a ty…?', ['se', 'usted']),
              ],
            },
            {
              id: 'u1l3', tytul: 'SER — być', ile: 9,
              nowe: [
                { h: 'SER — być', html: `${tabOdm('ser')}${es('Soy Eva.')} = Jestem Eva. ${es('Soy estudiante.')} = Jestem studentem/studentką.<br>${es('el / la estudiante')} — ta sama forma dla obu rodzajów, zmienia się tylko rodzajnik.<br>Na zajęciach: nosotr@s = nosotros / nosotras, vosotr@s = vosotros / vosotras, ell@s = ellos / ellas.` },
              ],
              pula: [
                ODM('ser'),
                ...dryl('ser', [0, 1, 2, 3, 4, 5]),
                P('Uzupełnij: Eva y Pedro … estudiantes.', 'son', `Eva y Pedro = ellos → ${es('son')}.`),
                P('Uzupełnij: Nosotros … de Poznań.', 'somos', `nosotros → ${es('somos')}.`),
                U('Ułóż: Jestem studentką.', 'Soy estudiante.', 'Przy ser przed zawodem nie stawiamy un/una: <b>Soy estudiante.</b> „Yo” też nie jest potrzebne. Forma soy już mówi, kto.', ['es', 'una']),
                W('Która forma pasuje? „¿Vosotros … estudiantes?”', ['sois', 'somos', 'son', 'eres'], 'vosotros → <b>sois</b>.'),
              ],
            },
            {
              id: 'u1l4', tytul: 'Liczby 0–20 i zwroty z zajęć', ile: 10,
              nowe: [
                { h: 'Liczby 0–20', html: tab([[`0 ${es('cero')}`, `7 ${es('siete')}`, `14 ${es('catorce')}`], [`1 ${es('uno')}`, `8 ${es('ocho')}`, `15 ${es('quince')}`], [`2 ${es('dos')}`, `9 ${es('nueve')}`, `16 ${es('dieciséis')}`], [`3 ${es('tres')}`, `10 ${es('diez')}`, `17 ${es('diecisiete')}`], [`4 ${es('cuatro')}`, `11 ${es('once')}`, `18 ${es('dieciocho')}`], [`5 ${es('cinco')}`, `12 ${es('doce')}`, `19 ${es('diecinueve')}`], [`6 ${es('seis')}`, `13 ${es('trece')}`, `20 ${es('veinte')}`]]) + '16–19 to „dziesięć i…”: dieci-séis, dieci-siete…' },
                { h: 'Na zajęciach', html: `${es('No entiendo.')} — nie rozumiem. ${es('No sé.')} — nie wiem.<br>${es('¿Cómo se dice … en español?')} — jak się mówi … po hiszpańsku?<br>${es('¿Qué significa … en polaco?')} — co znaczy … po polsku?<br>${es('Repite.')} — powtórz. ${es('¿Está claro?')} — czy to jasne?<br>${es('el ejercicio')} — ćwiczenie.` },
              ],
              pula: [
                W('Ile to jest: quince?', ['15', '5', '50', '14'], `${es('quince')} = 15. Nie myl z cinco (5) i catorce (14).`),
                W('Ile to jest: doce?', ['12', '2', '10', '20'], `${es('doce')} = 12.`),
                P('Napisz słownie: 14', 'catorce', `14 = ${es('catorce')}.`),
                P('Napisz słownie: 17', 'diecisiete', `17 = ${es('diecisiete')} (dieci + siete).`),
                P('Napisz słownie: 11', 'once', `11 = ${es('once')}.`),
                SLUCHAJ('dieciséis', ['16', '6', '60', '13'], `${es('dieciséis')} = 16.`),
                SLUCHAJ('trece', ['13', '3', '30', '12'], `${es('trece')} = 13.`),
                ...paryZ(CLASE.slice(0, 5)),
                W('Nie rozumiesz polecenia. Mówisz:', ['No entiendo.', 'No sé.', '¿Está claro?', 'Repite.'], '<b>No entiendo</b> = nie rozumiem. No sé = nie wiem.'),
                U('Ułóż: Jak się mówi „długopis” po hiszpańsku?', '¿Cómo se dice „długopis” en español?', '¿Cómo se dice … en español? — przydatne na każdych zajęciach. „En español” może też stać przed słowem.', ['significa', 'polaco'], { alt: ['¿Cómo se dice en español „długopis”?'] }),
              ],
            },
          ],
        },
        // ───────────── U2 ─────────────
        {
          id: 'u2', tytul: 'Datos personales', pl: 'telefon, e-mail, adres, daty, wiek', ikona: '🪪', zrodlo: 'zajęcia: 23.III i „Los días festivos”',
          lekcje: [
            {
              id: 'u2l1', tytul: 'Telefon, e-mail, adres', ile: 10,
              nowe: [
                { h: 'Pytamy o dane', html: `${es('¿Cuál es tu número de teléfono?')} — ${es('Mi número de teléfono es el 612 345 678.')}<br>${es('¿Cuál es tu correo electrónico?')} — ${es('Mi correo electrónico es eva.rufo@example.com')} (@ = ${es('arroba')}, . = ${es('punto')})<br>${es('¿Cuál es tu dirección?')} — ${es('Mi dirección es calle Taczaka 9.')}<br>Numer alarmowy w Polsce: ${es('Es el 112.')}` },
                { h: 'Adres', html: tab([[es('la calle'), 'ulica'], [es('la avenida'), 'aleja'], [es('la urbanización'), 'osiedle'], [es('la plaza'), 'plac'], [es('el paseo'), 'deptak'], [es('el código postal'), 'kod pocztowy']]) },
              ],
              pula: [
                ...paryZ(DIRECCION, 5),
                W('Jak przeczytasz znak @ w adresie e-mail?', ['arroba', 'punto', 'correo', 'calle'], '@ = <b>arroba</b>, kropka = <b>punto</b>.'),
                W('Pytasz o adres. Które pytanie?', ['¿Cuál es tu dirección?', '¿Qué es tu dirección?', '¿Dónde es tu dirección?', '¿Cómo es tu dirección?'], 'O dane (numer, adres, e-mail, zawód) pytamy <b>¿Cuál es…?</b>'),
                U('Ułóż: Mój numer telefonu to 600 100 200.', 'Mi número de teléfono es el 600 100 200.', 'Przed numerem stawiamy rodzajnik <b>el</b>: es el 600…', ['tu', 'la'], { alt: ['El 600 100 200 es mi número de teléfono.'] }),
                P('Uzupełnij: ¿… es tu correo electrónico?', ['Cuál'], 'O e-mail pytamy <b>¿Cuál es…?</b> (jaki jest…?). W pytaniu cuál ma akcent.'),
                ...znaczy(DIRECCION, [0, 2, 6]),
              ],
            },
            {
              id: 'u2l2', tytul: 'Dni, miesiące, daty', ile: 10,
              nowe: [
                { h: 'Dni tygodnia', html: tab(DIAS.map(([s, p]) => [es(s), p])) + 'Dni i miesiące piszemy <b>małą literą</b>. ' + `${es('¿Qué día es hoy?')} — ${es('Hoy es lunes, 23 de marzo.')}` },
                { h: 'Miesiące i liczby 20–32', html: tab([[es('enero'), es('febrero'), es('marzo'), es('abril')], [es('mayo'), es('junio'), es('julio'), es('agosto')], [es('septiembre'), es('octubre'), es('noviembre'), es('diciembre')]]) + `20 ${es('veinte')} · 21 ${es('veintiuno')} · 22 ${es('veintidós')} · 23 ${es('veintitrés')} · 24 ${es('veinticuatro')} · 25 ${es('veinticinco')} · 26 ${es('veintiséis')} · 27 ${es('veintisiete')} · 28 ${es('veintiocho')} · 29 ${es('veintinueve')}<br>21–29 piszemy razem: veinti + jedność.<br>30 ${es('treinta')} · 31 ${es('treinta y uno')} · 32 ${es('treinta y dos')}. Od 31 piszemy osobno, z „y”.<br>${es('¿Cuándo es tu cumpleaños?')} — ${es('Mi cumpleaños es el 6 de febrero.')} (el santo = imieniny)` },
              ],
              pula: [
                ...paryZ(DIAS, 4, 'Połącz dzień z tłumaczeniem'),
                ...jakPowiesz(MESES, [1, 5, 8, 10]),
                W('Który dzień jest po „miércoles”?', ['jueves', 'martes', 'viernes', 'lunes'], 'lunes → martes → miércoles → <b>jueves</b> → viernes → sábado → domingo.'),
                P('Napisz słownie: 23', 'veintitrés', `23 = ${es('veintitrés')} (z akcentem).`),
                P('Napisz słownie: 31', 'treinta y uno', `Od 31 piszemy osobno: ${es('treinta y uno')}.`),
                U('Ułóż: Dzisiaj jest piątek, 14 listopada.', 'Hoy es viernes, 14 de noviembre.', 'Data: dzień + <b>de</b> + miesiąc (małą literą).', ['el', 'en']),
                U('Ułóż: Moje urodziny są 6 lutego.', 'Mi cumpleaños es el 6 de febrero.', 'Gdy podajemy, kiedy coś jest, przed liczbą dnia stoi <b>el</b>: es el 6 de febrero.', ['santo', 'en'], { alt: ['El 6 de febrero es mi cumpleaños.'] }),
                SLUCHAJ('veintiocho', ['28', '18', '38', '8'], `${es('veintiocho')} = 28.`),
              ],
            },
            {
              id: 'u2l3', tytul: 'TENER, wiek i „usted”', ile: 10,
              nowe: [
                { h: 'TENER — mieć (e → ie)', html: `${tabOdm('tener')}${es('¿Cuántos años tienes?')} — ${es('Tengo veinte años.')}<br>21 lat: ${es('Tengo veintiún años.')} Krótko: ${es('Tengo veintiuno.')} Przed słowem años „veintiuno” traci -o.<br>W notatkach z zajęć jest zapis E&lt;IE. To ta sama zmiana: e zamienia się w ie.` },
                { h: 'Tú czy usted?', html: tab([[es('¿Cómo te llamas?'), es('¿Cómo se llama usted?')], [es('¿Cuál es tu dirección?'), es('¿Cuál es su dirección?')], [es('¿Cuándo es tu cumpleaños?'), es('¿Cuándo es su cumpleaños?')], [es('¿En qué departamento trabajas?'), es('¿En qué departamento trabaja usted?')]], ['tú (ty)', 'usted (Pan/Pani)']) + `Usted odmienia się jak él/ella. ${es('Señor García')} = Pan García (Sr.), ${es('Señora López')} = Pani López (Sra.).` },
                { h: 'Firma', html: `${es('S.A.')} = sociedad anónima (spółka akcyjna), ${es('S.L.')} = sociedad limitada (sp. z o.o.)<br>${es('el departamento comercial / financiero / de marketing / de personal')} — dział handlowy / finansowy / marketingu / kadr<br>${es('¿En qué departamento trabajas?')} — w jakim dziale pracujesz?<br>${es('el puesto')} — stanowisko · ${es('la tarjeta de visita')} — wizytówka` },
              ],
              pula: [
                ODM('tener'),
                ...dryl('tener', [0, 2, 3, 4]),
                W('Masz 21 lat. Jak to powiesz?', ['Tengo veintiún años.', 'Tengo veintiuno años.', 'Soy veintiún años.', 'Tengo veinte y uno años.'], 'Wiek podajemy z <b>tener</b>: tengo … años. Przed años veintiuno traci -o: <b>veintiún años</b>.'),
                W('Wypełniasz formularz z klientką. Mówisz do niej „Pani”. Pytasz o jej adres:', ['¿Cuál es su dirección?', '¿Cuál es tu dirección?', '¿Cómo te llamas?', '¿Cuál es vuestra dirección?'], 'Do Pani/Pana (usted) mówimy <b>su</b>, nie tu. Vuestra to „wasza” — do kilku osób na „ty”.'),
                PARY([['S.A.', 'spółka akcyjna'], ['S.L.', 'sp. z o.o.'], ['el puesto', 'stanowisko'], ['la tarjeta de visita', 'wizytówka'], ['el departamento', 'dział']]),
                P('Uzupełnij: ¿Cuántos años … (tú)?', 'tienes', `tú → ${es('tienes')} (e → ie).`),
                U('Ułóż: W jakim dziale Pan pracuje?', '¿En qué departamento trabaja usted?', 'Do Pana/Pani mówimy tak jak o nim/o niej: trabajas → <b>trabaja</b>.', ['trabajas', 'tu'], { alt: ['Usted, ¿en qué departamento trabaja?'] }),
                P('Uzupełnij: Nosotros … muchos clientes.', 'tenemos', `nosotros → ${es('tenemos')} — bez zmiany e → ie.`),
              ],
            },
          ],
        },
        // ───────────── U3 ─────────────
        {
          id: 'u3', tytul: 'Países y nacionalidades', pl: 'kraje, stolice, narodowości, hablar i vivir', ikona: '🌍', zrodlo: 'zajęcia: 11.05, str. 19',
          lekcje: [
            {
              id: 'u3l1', tytul: 'Kraje i stolice', ile: 9,
              nowe: [
                { h: 'La capital de…', html: tab(PAISES.map(([p, c]) => [es(p), es(c)]), ['país', 'capital']) + `${es('¿Cuál es la capital de Polonia?')} — ${es('La capital de Polonia es Varsovia.')}` },
              ],
              pula: [
                ...PAISES.slice(1, 9).map(([p, c, de = `de ${p}`], i) => W(`¿Cuál es la capital ${de}?`, [c, ...[1, 2, 3].map((k) => PAISES[(i + 1 + k * 3) % PAISES.length][1]).filter((z) => z !== c)], `${es(`La capital ${de} es ${c}.`)}`)),
                U('Ułóż: Stolicą Polski jest Warszawa.', 'La capital de Polonia es Varsovia.', 'Varsovia = Warszawa, Cracovia = Kraków. Szyk „Varsovia es la capital de Polonia” też jest dobry.', ['Cracovia', 'en'], { alt: ['Varsovia es la capital de Polonia.'] }),
                P('Napisz po hiszpańsku: Warszawa', 'Varsovia', `Warszawa = ${es('Varsovia')}. Kraków to Cracovia. Polskie miasta często mają hiszpańskie nazwy.`),
              ],
            },
            {
              id: 'u3l2', tytul: 'Narodowości', ile: 10,
              nowe: [
                { h: 'Rodzaj męski i żeński', html: tab([[es('polaco → polaca'), es('italiano → italiana')], [es('alemán → alemana'), es('inglés → inglesa')], [es('francés → francesa'), es('japonés → japonesa')], [es('canadiense'), es('estadounidense')]]) + '<b>Trzy wzory:</b> -o → -a; spółgłoska → dodaj -a (akcent znika: alemán → alemana); -e → bez zmiany (canadiense dla obu rodzajów).' },
              ],
              pula: [
                P('Rodzaj żeński: alemán → …', 'alemana', `${es('alemana')} — dodajesz -a, a akcent znika.`),
                P('Rodzaj żeński: francés → …', 'francesa', `francés → ${es('francesa')}: dodajemy -a, a akcent znika.`),
                P('Rodzaj żeński: polaco → …', 'polaca', `${es('polaca')} (-o → -a).`),
                P('Rodzaj żeński: japonés → …', 'japonesa', `japonés → ${es('japonesa')}: dodajemy -a, a akcent znika.`),
                P('Rodzaj żeński: canadiense → …', 'canadiense', `${es('canadiense')} — końcówka -e, forma ta sama dla obu rodzajów.`),
                KAT('Jak tworzy się rodzaj żeński?', ['-o → -a', 'dodaj -a', 'bez zmian'], [['italiano', 0], ['mexicano', 0], ['brasileño', 0], ['inglés', 1], ['alemán', 1], ['francés', 1], ['canadiense', 2], ['estadounidense', 2]], 'Słowa na -o zmieniają -o na -a, słowa na spółgłoskę dostają -a, słowa na -e się nie zmieniają.'),
                W('Eva jest z Niemiec. Eva es…', ['alemana', 'alemán', 'Alemania', 'alemanes'], 'Kobieta → <b>alemana</b>. Alemania to nazwa kraju.'),
                W('Pedro jest z Kolumbii. Pedro es…', ['colombiano', 'colombiana', 'Colombia', 'colombianos'], 'Mężczyzna → końcówka -o: <b>colombiano</b>. Colombia to nazwa kraju.'),
              ],
            },
            {
              id: 'u3l3', tytul: '¿De dónde eres? HABLAR i VIVIR', ile: 10,
              nowe: [
                { h: 'Skąd jesteś?', html: `${es('¿De dónde eres?')} — ${es('Soy de Polonia. Soy polaco.')}<br>${es('¿Qué idiomas hablas?')} — ${es('Hablo inglés, alemán y un poco de español.')}<br>Przed i/hi „y” zmienia się w <b>e</b>: ${es('Hablo alemán e italiano.')}<br>${es('¿Dónde vives?')} — ${es('Soy de Koszalin, pero ahora vivo y estudio en Poznań.')}` },
                { h: 'Regularne: -ar i -ir', html: tab(OSOBY.map((o, i) => [o, es(V.hablar.f[i]), es(V.vivir.f[i])]), ['', 'hablar', 'vivir']) + 'Takie samo jest tylko yo: habl<b>o</b>, viv<b>o</b>. W -ar po rdzeniu stoi „a”: habl<b>as</b>, habl<b>a</b>, habl<b>amos</b>, habl<b>áis</b>, habl<b>an</b>. W -ir stoi „e”: viv<b>es</b>, viv<b>e</b>, viv<b>en</b>. Wyjątek: nosotros i vosotros w -ir mają „i”: viv<b>imos</b>, viv<b>ís</b>.' },
              ],
              pula: [
                ODM('hablar'),
                ODM('vivir'),
                ...dryl('vivir', [3, 4]),
                ...dryl('hablar', [1, 4]),
                W('Uzupełnij: Hablo alemán … italiano. (Mówię po niemiecku i po włosku.)', ['e', 'y', 'o', 'u'], 'Przed słowem na <b>i-</b> spójnik y zmienia się w <b>e</b>. „O” znaczy „albo”.'),
                U('Ułóż: Jestem z Polski, ale mieszkam w Hiszpanii.', 'Soy de Polonia, pero vivo en España.', 'Skąd — <b>ser de</b>, gdzie mieszkasz — <b>vivir en</b>.', ['estoy', 'a']),
                W('¿De dónde eres?', ['Soy de Poznań.', 'Vivo Poznań.', 'Soy en Poznań.', 'Es de Poznań.'], 'Pytanie jest do ciebie (eres). Odpowiadamy więc <b>soy de</b> + miasto. Es de Poznań mówi o kimś innym.'),
              ],
            },
          ],
        },
        // ───────────── U4 ─────────────
        {
          id: 'u4', tytul: 'Profesiones', pl: 'zawody, czasowniki regularne, liczba mnoga', ikona: '💼', zrodlo: 'zajęcia: 25.05, str. 20–23',
          lekcje: [
            {
              id: 'u4l1', tytul: 'Zawody i miejsca pracy', ile: 10,
              nowe: [
                { h: 'Kto gdzie pracuje', html: tab([[`${es('el médico')} — lekarz`, `${es('el hospital')} — szpital`], [`${es('el profesor')} — nauczyciel`, `${es('la escuela')} — szkoła`], [`${es('el periodista')} — dziennikarz`, `${es('el periódico')} — gazeta`], [`${es('el mecánico')} — mechanik`, `${es('el taller')} — warsztat`], [`${es('el camarero')} — kelner`, `${es('el bar')} — bar`], [`${es('el abogado')} — adwokat`, `${es('el bufete')} — kancelaria`]], ['zawód', 'miejsce']) + `${es('¿Cuál es tu profesión?')} — ${es('Soy estudiante.')} · ${es('Esta persona trabaja en un hospital.')}` },
                { h: 'Więcej zawodów', html: tab([3, 7, 8, 9, 10, 11, 12].map((i) => [es(PROF[i][0]), PROF[i][1]])) },
              ],
              pula: [
                PARY([['mecánico', 'el taller'], ['profesor', 'la escuela'], ['médico', 'el hospital'], ['periodista', 'el periódico'], ['camarero', 'el bar']], 'Połącz zawód z miejscem pracy'),
                ...paryZ(PROF.slice(0, 10), 5, 'Połącz zawód z tłumaczeniem'),
                ...znaczy(PROF, [6, 7, 9, 12]),
                W('Gdzie pracuje abogado?', ['en un bufete', 'en un taller', 'en un periódico', 'en un bar'], 'Abogado (adwokat) pracuje w kancelarii: <b>el bufete</b>.'),
                U('Ułóż: Ta osoba pracuje w szpitalu.', 'Esta persona trabaja en un hospital.', 'Esta persona = ta osoba; trabajar <b>en</b> = pracować w.', ['es', 'a']),
              ],
            },
            {
              id: 'u4l2', tytul: 'Co robisz w pracy? Czasowniki regularne', ile: 11,
              nowe: [
                { h: 'Trzy grupy: -ar, -er, -ir', html: tab(OSOBY.map((o, i) => [o, es(V.trabajar.f[i]), es(V.vender.f[i]), es(V.escribir.f[i])]), ['', 'trabajar', 'vender', 'escribir']) + 'Odcinasz -ar/-er/-ir i dokładasz końcówkę. -er i -ir różnią się tylko w nosotros i vosotros.<br>Też regularne: ' + `${es('leer')} — czytać, ${es('enseñar')} — uczyć (kogoś), ${es('recibir')} — dostawać, przyjmować.` + '<br>Wyjątek z zajęć: <b>hacer</b> (robić) → yo <b>hago</b>.' },
                { h: 'Kto co robi', html: `${es('Las secretarias escriben mensajes.')} — piszą wiadomości<br>${es('El contable controla las cuentas.')} — kontroluje rachunki<br>${es('Los comerciales buscan clientes.')} — szukają klientów<br>${es('La directora de Recursos Humanos contrata a los empleados.')} — zatrudnia pracowników<br>${es('El director de producción revisa los productos.')} — sprawdza produkty` },
              ],
              pula: [
                ODM('trabajar'),
                ODM('vender'),
                ODM('escribir'),
                ...dryl('leer', [1, 4]),
                ...dryl('recibir', [2, 3]),
                ...dryl('hacer', [0, 3]),
                ...dryl('ensenar', [2]),
                P('Uzupełnij: Las secretarias … (escribir) mensajes.', 'escriben', `ellas → ${es('escriben')}.`),
                P('Uzupełnij: El contable … (controlar) las cuentas.', 'controla', `él → ${es('controla')} (-ar → -a).`),
                W('Los comerciales … clientes.', ['buscan', 'busca', 'buscamos', 'buscáis'], 'Los comerciales = ellos → <b>buscan</b>.'),
                U('Ułóż: Piszę wiadomości i sprzedaję produkty.', 'Escribo mensajes y vendo productos.', 'yo → końcówka -o: escrib<b>o</b>, vend<b>o</b>.', ['escribe', 'vende'], { alt: ['Vendo productos y escribo mensajes.'] }),
              ],
            },
            {
              id: 'u4l3', tytul: 'Liczba mnoga', ile: 10,
              nowe: [
                { h: 'Jak tworzyć liczbę mnogą', html: tab([['samogłoska → +s', es('la médica → las médicas')], ['spółgłoska → +es', es('el profesor → los profesores')], ['akcentowane -í → +es', es('iraní → iraníes')], ['-z → -ces', es('eficaz → eficaces')]]) + `Przymiotnik narodowości stoi po rzeczowniku: ${es('los profesores españoles')}, ${es('las recepcionistas alemanas')}, ${es('los camareros italianos')}, ${es('los periodistas canadienses')}.` },
              ],
              pula: [
                P('Liczba mnoga: el profesor → los …', ['profesores', 'los profesores'], `Spółgłoska → +es: ${es('profesores')}.`),
                P('Liczba mnoga: la médica → las …', ['médicas', 'las médicas'], `Samogłoska → +s: ${es('médicas')}.`),
                P('Liczba mnoga: iraní → …', 'iraníes', `Akcentowane -í → +es: ${es('iraníes')}.`),
                P('Liczba mnoga: eficaz → …', 'eficaces', `-z → -ces: ${es('eficaces')}.`),
                P('Liczba mnoga: el empleado alemán → los empleados …', ['alemanes', 'empleados alemanes', 'los empleados alemanes'], `${es('alemanes')} — kreska (akcent pisany) znika. W wymowie akcent zostaje na „ma”: a-le-MÁN → a-le-MA-nes. Teraz to przedostatnia sylaba, a słowo kończy się na -s. Wtedy kreski nie piszemy. Odwrotnie jest w joven → jóvenes.`),
                W('niemieckie recepcjonistki =', ['las recepcionistas alemanas', 'los recepcionistas alemanes', 'las recepcionistas alemanes', 'las alemanas recepcionistas'], 'Rodzaj żeński, liczba mnoga, przymiotnik <b>po</b> rzeczowniku: las recepcionistas alemanas.'),
                W('Pedro i Juan są z Kolumbii. Son…', ['colombianos', 'colombianas', 'colombiano', 'Colombia'], 'Dwóch mężczyzn → liczba mnoga rodzaju męskiego: <b>colombianos</b>.'),
                W('włoscy kelnerzy =', ['los camareros italianos', 'las camareras italianas', 'los italianos camareros', 'el camarero italiano'], 'Rodzaj męski, liczba mnoga: los camareros italianos.'),
                U('Ułóż: kanadyjscy dziennikarze', 'los periodistas canadienses', 'periodista i canadiense mają jedną formę dla obu rodzajów — rodzaj widać w rodzajniku <b>los</b>.', ['las', 'canadiense', 'el']),
              ],
            },
            {
              id: 'u4l4', tytul: 'Sport i studia', ile: 10,
              nowe: [
                { h: 'Czas wolny', html: `${es('¿Haces deporte?')} — czy uprawiasz sport? ${es('¿Qué deporte haces?')} — ${es('Hago yoga / natación.')} ${es('Juego al tenis / al baloncesto.')} — gram w tenisa / w koszykówkę.<br>${es('Voy al gimnasio / a la piscina.')} — chodzę na siłownię / na basen. ${es('Corro todos los días.')} — biegam codziennie.<br>${es('¿Tienes coche?')} — masz samochód?` },
                { h: 'Na uczelni', html: `${es('Hacemos exámenes.')} ${es('Escribimos trabajos.')} ${es('Escuchamos a los profesores.')} ${es('Hacemos proyectos y presentaciones.')} ${es('Leemos libros y artículos.')} ${es('Hacemos deberes.')} ${es('Hablamos con los amigos.')}` },
              ],
              pula: [
                W('¿Qué deporte haces?', ['Hago yoga.', 'Hace yoga.', 'Voy yoga.', 'Soy yoga.'], 'Sport: <b>hacer</b> + nazwa sportu, yo → <b>hago</b>. Gry z piłką zwykle z jugar: juego al tenis.'),
                W('Chodzę na basen =', ['Voy a la piscina.', 'Voy al piscina.', 'Hago la piscina.', 'Voy en la piscina.'], 'piscina jest rodzaju żeńskiego → <b>a la</b> piscina. Al = a + el (al gimnasio).'),
                P('Uzupełnij: Voy … gimnasio.', 'al', `a + el = ${es('al')}: voy al gimnasio.`),
                P('Uzupełnij: Nosotros … (hacer) proyectos.', 'hacemos', `${es('hacemos')} — nieregularne jest tylko yo (hago).`),
                P('Uzupełnij: Nosotros … (leer) artículos.', 'leemos', `${es('leemos')} (-er → -emos).`),
                U('Ułóż: Na uczelni piszemy prace i robimy prezentacje.', 'En la universidad escribimos trabajos y hacemos presentaciones.', 'nosotros: escrib<b>imos</b> (-ir), hac<b>emos</b> (-er). Egzamin po hiszpańsku się „robi”: hacemos exámenes.', ['escriben', 'hacen'], { alt: ['Escribimos trabajos y hacemos presentaciones en la universidad.', 'En la universidad hacemos presentaciones y escribimos trabajos.'] }),
                ...dryl('estudiar', [1, 3]),
                PARY([['todos los días', 'codziennie'], ['el coche', 'samochód'], ['el baloncesto', 'koszykówka'], ['correr', 'biegać'], ['los deberes', 'zadanie domowe']]),
              ],
            },
          ],
        },
        // ───────────── U5 ─────────────
        {
          id: 'u5', tytul: 'En la feria de empleo', pl: 'przedstawianie, pytania, przyimki', ikona: '🤝', zrodlo: 'zajęcia: 1.06, „Completa las preguntas”, DEBER DE CASA',
          lekcje: [
            {
              id: 'u5l1', tytul: 'Przedstawiamy się na targach', ile: 9,
              nowe: [
                { h: 'Le presento a…', html: `${es('Le presento a la señora Castillo.')} — przedstawiam Panu/Pani panią Castillo.<br>${es('Le presento al señor López.')} — <b>al = a + el</b>.<br>${es('Mucho gusto.')} / ${es('Encantado.')} / ${es('Encantada.')} — bardzo mi miło (kobieta mówi encantad<b>a</b>).<br>${es('¡Bienvenido a Poznań!')} — witamy w Poznaniu (do mężczyzny). ${es('¡Bienvenida!')} — do kobiety. ${es('¡Bienvenidos!')} — do grupy. Tu forma zależy od tego, <b>kogo</b> witamy. Przy encantado / encantada liczy się ten, <b>kto mówi</b>.<br>${es('Este es mi colega.')} / ${es('Esta es mi colega.')} — to mój kolega / moja koleżanka.<br>${es('¿Cómo está usted?')} — ${es('Bien, gracias, ¿y usted?')}<br>${es('¡Qué alegría!')} — jak się cieszę! · ${es('la feria (de empleo)')} — targi (pracy) · ${es('Atención al Cliente')} — obsługa klienta` },
              ],
              pula: [
                W('Marta poznaje nową szefową. Co mówi Marta?', ['Encantada.', 'Encantado.', 'Bienvenido.', 'Adiós.'], 'Forma zależy od tego, kto mówi. Mówi kobieta → <b>encantada</b>. Mężczyzna powie encantado.'),
                W('Le presento … señor García.', ['al', 'a el', 'a la', 'el'], '<b>a + el = al</b>: le presento al señor García. Tak łączy się rodzajnik el. Zaimek él (on) się nie łączy: a él.'),
                W('Przedstawiasz koleżankę: „… es mi colega Marta.”', ['Esta', 'Este', 'Esto', 'Estas'], 'Kobieta → <b>esta</b>, mężczyzna → este.'),
                PARY([['Mucho gusto.', 'Bardzo mi miło.'], ['¡Bienvenido!', 'Witamy!'], ['¡Qué alegría!', 'Jak się cieszę!'], ['la feria', 'targi'], ['Atención al Cliente', 'Obsługa Klienta']]),
                U('Ułóż: Dzień dobry, jak się Pan miewa?', 'Buenos días, ¿cómo está usted?', 'Do Pana/Pani: <b>¿cómo está usted?</b>', ['estás', 'tú']),
                P('Uzupełnij: Bienvenido … Varsovia.', 'a', `Witamy w… = ${es('bienvenido a')}.`),
              ],
            },
            {
              id: 'u5l2', tytul: 'Pytania: qué, cómo, dónde…', ile: 11,
              nowe: [
                { h: 'Słówka pytające', html: tab([[es('¿Qué?'), 'co? jaki?'], [es('¿Cómo?'), 'jak?'], [es('¿Dónde?'), 'gdzie?'], [es('¿De dónde?'), 'skąd?'], [es('¿Cuándo?'), 'kiedy?'], [es('¿Cuánto? ¿Cuántos?'), 'ile?'], [es('¿Por qué?'), 'dlaczego? (odp.: porque…)'], [es('¿Para qué?'), 'po co? w jakim celu?'], [es('¿Cuál?'), 'który? jaki? (dane)']]) + 'Wszystkie mają akcent. W odpowiedzi „bo” piszemy razem i bez akcentu: <b>porque</b>.' },
              ],
              pula: [
                PARY([['¿Dónde vives?', 'En la calle Mayor 5.'], ['¿Cuándo estudias?', 'Por la noche.'], ['¿Cuántos hermanos tienes?', 'Dos.'], ['¿Por qué no trabajas hoy?', 'Porque es fiesta.'], ['¿Para qué estudias idiomas?', 'Para trabajar en el extranjero.']], 'Połącz pytanie z odpowiedzią'),
                PARY([['¿De dónde son los empleados?', 'De Marruecos.'], ['¿Qué estudias?', 'Economía.'], ['¿Cuánto vale el curso?', '300 euros.'], ['¿Cómo se llama tu empresa?', 'Intesa S.A.'], ['¿Cuál es tu teléfono?', 'El 600 100 200.']], 'Połącz pytanie z odpowiedzią'),
                P('¿… vive usted? — En Madrid.', ['Dónde'], `Odpowiedź to miejsce → ${es('¿Dónde?')}`),
                P('¿… son los profesores? — De Sevilla.', ['De dónde'], `Pochodzenie → ${es('¿De dónde?')}`),
                P('¿… años tienes? — 23.', ['Cuántos'], `Ile lat → ${es('¿Cuántos años?')} (años to liczba mnoga rodzaju męskiego).`),
                P('¿… día es hoy? — Lunes.', ['Qué'], `Pytamy o dzień tygodnia: ${es('¿Qué día es hoy?')} = jaki dziś dzień?`),
                P('¿… se llama tu jefa? — Eva Gómez.', ['Cómo'], `Pytamy o imię: ${es('¿Cómo se llama…?')} = jak się nazywa…?`),
                W('Zadaj pytanie do odpowiedzi: „Tengo veinte años.”', ['¿Cuántos años tienes?', '¿Qué años tienes?', '¿Cuál es tu edad años?', '¿Cuándo tienes años?'], 'Pytamy o liczbę → <b>¿Cuántos…?</b>'),
                W('Zadaj pytanie do odpowiedzi: „Es el 11 de noviembre.”', ['¿Cuándo es la fiesta nacional de Polonia?', '¿Dónde es la fiesta nacional de Polonia?', '¿Por qué es la fiesta nacional de Polonia?', '¿Cuánto es la fiesta nacional de Polonia?'], 'Data → <b>¿Cuándo?</b>'),
                W('„Bo dziś jest święto” to:', ['Porque hoy es fiesta.', 'Por qué hoy es fiesta.', 'Para qué hoy es fiesta.', 'Porqué hoy es fiesta.'], 'W odpowiedzi: <b>porque</b> (razem, bez akcentu). ¿Por qué? to pytanie.'),
              ],
            },
            {
              id: 'u5l3', tytul: 'Przyimki i rozmowa z nową osobą', ile: 10,
              nowe: [
                { h: 'a, de, en, con', html: `${es('Hablo con los clientes.')} — z klientami<br>${es('Eva es de Barcelona, pero vive en Valencia.')} — z / w<br>${es('Departamento de Atención al Cliente')} — al = a + el<br>${es('Bienvenido a Varsovia.')}` },
                { h: 'Na imprezie firmowej', html: `${es('Eres la nueva empleada, ¿verdad?')} — jesteś nową pracownicą, prawda?<br>${es('¡Bienvenida a la empresa!')} ${es('¡Qué interesante!')} ${es('¡Qué bien!')}<br>Pytania: ${es('¿En qué departamento trabajas?')} ${es('¿De dónde eres?')} ${es('¿Qué idiomas hablas?')}<br>${es('¿Tienes mascota?')} — masz zwierzę? ${es('Sí, un gato.')} — tak, kota.<br>${es('¿Qué aficiones tienes?')} — jakie masz zainteresowania?` },
              ],
              pula: [
                P('Yo en mi trabajo hablo mucho … los clientes.', 'con', `Rozmawiać z kimś = ${es('hablar con')}.`),
                P('Eva es … Barcelona.', 'de', `Pochodzenie: ${es('ser de')}.`),
                P('Eva vive y trabaja … Valencia.', 'en', `Miejsce: ${es('en')}.`),
                P('Trabajamos en el Departamento de Atención … Cliente.', 'al', `${es('a + el = al')}.`),
                PARY([['¿Tienes mascota?', 'Sí, un gato.'], ['¿Trabajas?', 'No, estudio.'], ['¿Qué aficiones tienes?', 'El deporte y la fotografía.'], ['Mucho gusto.', 'Encantada.'], ['¿Cómo está usted?', 'Muy bien, gracias.']], 'Połącz pytanie z reakcją'),
                U('Ułóż: Jesteś nową pracownicą, prawda?', 'Eres la nueva empleada, ¿verdad?', '¿verdad? na końcu = prawda? Oba szyki są dobre: la nueva empleada i la empleada nueva.', ['es', 'nuevo'], { alt: ['Eres la empleada nueva, ¿verdad?'] }),
                W('Ktoś mówi, że gra w tenisa i fotografuje. Reagujesz:', ['¡Qué interesante!', 'Buenas noches.', 'Hasta luego.', 'No entiendo, adiós.'], '<b>¡Qué interesante!</b> / <b>¡Qué bien!</b> — naturalna reakcja w rozmowie.'),
                PISZ('Przedstaw się w 4 zdaniach: imię, skąd jesteś, co studiujesz, jakie znasz języki.', 'Hola, me llamo Kasia. Soy de Gdańsk, pero vivo en Poznań. Estudio Finanzas en la Universidad de Ciencias Económicas. Hablo polaco, inglés y un poco de español.', ['me llamo / soy + imię', 'soy de + miasto', 'estudio + kierunek', 'hablo + języki']),
              ],
            },
          ],
        },
      ],
      powtorka: { id: 's1rep', tytul: 'Powtórka sekcji 1', ile: 14 },
    },
    {
      id: 's2', nazwa: 'Sekcja 2 · Personas y empresa', pl: 'semestr zimowy — wszystko, co będzie na kolokwium 1',
      jednostki: [
        // ───────────── U6 ─────────────
        {
          id: 'u6', tytul: 'La familia', pl: 'rodzina, rodzeństwo, kuzyni', ikona: '👨‍👩‍👧', zrodlo: 'zajęcia: „El padre”, 20.10',
          lekcje: [
            {
              id: 'u6l1', tytul: 'Członkowie rodziny', ile: 10,
              nowe: [
                { h: 'Rodzina', html: tab([[es('el padre + la madre'), es('los padres'), 'rodzice'], [es('el hijo + la hija'), es('los hijos'), 'dzieci'], [es('el hermano + la hermana'), es('los hermanos'), 'rodzeństwo'], [es('el abuelo + la abuela'), es('los abuelos'), 'dziadkowie'], [es('el tío + la tía'), es('los tíos'), 'wujostwo'], [es('el primo + la prima'), es('los primos'), 'kuzynostwo']]) + 'Grupa mieszana (kobiety i mężczyźni) dostaje formę męską w liczbie mnogiej: <b>los padres</b> to rodzice, nie tylko ojcowie.' },
              ],
              pula: [
                ...paryZ(FAMILIA.slice(0, 15), 5, 'Połącz członka rodziny z tłumaczeniem'),
                W('los padres (padre + madre) to:', ['rodzice', 'ojcowie', 'dziadkowie', 'bracia'], 'Ojciec + matka = <b>los padres</b> (rodzice).'),
                W('los hermanos (brat + siostra) to:', ['rodzeństwo', 'bracia i kuzyni', 'rodzice', 'dzieci'], 'Grupa mieszana → forma męska w liczbie mnogiej.'),
                W('El hijo de la hermana de mi madre es mi…', ['primo', 'tío', 'hermano', 'abuelo'], 'Syn siostry mamy = mój kuzyn: <b>el primo</b>.'),
                W('La madre de mi primo es mi…', ['tía', 'abuela', 'madre', 'prima'], 'Mama kuzyna to siostra mamy albo taty = <b>la tía</b>.'),
                W('El padre de mi padre es mi…', ['abuelo', 'tío', 'primo', 'hijo'], 'Tata taty = <b>el abuelo</b>.'),
                P('Napisz po hiszpańsku: córka', ['la hija', 'hija'], `córka = ${es('la hija')}. Syn to el hijo. Litery h na początku nie czytamy.`),
                P('Napisz po hiszpańsku: kuzynka', ['la prima', 'prima'], `Kuzynka to ${es('la prima')}. Kuzyn to ${es('el primo')}.`),
                W('mis tíos (wujek + ciocia) to:', ['wujostwo (wujek i ciocia)', 'tylko wujkowie', 'kuzyni', 'dziadkowie'], 'Grupa mieszana dostaje formę męską w liczbie mnogiej. Los tíos to wujek i ciocia razem.'),
              ],
            },
            {
              id: 'u6l2', tytul: '¿Tienes hermanos?', ile: 9,
              nowe: [
                { h: 'Rozmowa o rodzinie', html: `${es('¿Tienes hermanos?')} — ${es('Sí, tengo una hermana.')} / ${es('Sí, tengo dos hermanos.')} / ${es('No, soy hijo único.')} (${es('hija única')})<br>${es('un hermano mayor')} — starszy brat, ${es('una hermana menor')} — młodsza siostra<br>${es('¿Tienes hijos?')} — ${es('Sí, tengo una hija.')} · ${es('¿Cuántos primos tienes?')}<br>${es('Mi hermano es mayor que yo.')} — mój brat jest starszy ode mnie.` },
              ],
              pula: [
                W('Pedro nie ma rodzeństwa. Ktoś go pyta: „¿Tienes hermanos?”. Co odpowiada Pedro?', ['No, soy hijo único.', 'No, soy hija única.', 'No, tengo hijo único.', 'No, es hijo único.'], 'Jedynak = <b>hijo único</b>, jedynaczka = hija única. Mówimy z ser: soy.'),
                W('Starsza siostra to:', ['una hermana mayor', 'una hermana menor', 'una mayor hermana', 'una hermana alta'], 'mayor = starszy (>), menor = młodszy (<), przymiotnik po rzeczowniku.'),
                U('Ułóż: Mam dwóch braci i jedną siostrę.', 'Tengo dos hermanos y una hermana.', 'Mieć rodzeństwo → <b>tener</b>.', ['soy', 'un'], { alt: ['Tengo una hermana y dos hermanos.'] }),
                U('Ułóż: Ile masz kuzynów?', '¿Cuántos primos tienes?', 'primos to rodzaj męski → cuántos.', ['cuántas', 'tiene']),
                P('Uzupełnij: ¿… (tú) hijos? — Sí, tengo una hija.', ['Tienes'], `tú → ${es('tienes')}.`),
                P('Uzupełnij: Mi hermano … (ser) mayor que yo.', ['es'], `Mi hermano = él → ${es('es')}. Mayor que yo = starszy ode mnie.`),
                W('Dziewczyna bez rodzeństwa odpowiada na pytanie „¿Tienes hermanos?”:', ['No, soy hija única.', 'No, soy hijo único.', 'No, soy hija único.', 'No, tengo hija única.'], 'Jedynaczka to hija única. Obie części mają końcówkę -a. Używamy ser, nie tener.'),
                P('Uzupełnij: Tengo un hermano … (młodszy).', ['menor'], `Młodszy to ${es('menor')}. Starszy to ${es('mayor')}. Przymiotnik stoi po rzeczowniku.`),
                U('Ułóż: Moja siostra jest starsza ode mnie.', 'Mi hermana es mayor que yo.', `„Starsza od” to ${es('mayor que')}. „Młodsza od” to ${es('menor que')}. „Ode mnie” to ${es('que yo')}.`, ['menor', 'tiene']),
                PISZ('Opisz swoją rodzinę w 3 zdaniach.', 'En mi familia somos cuatro: mis padres, mi hermana y yo. Mi hermana es menor que yo. Tengo cinco primos y dos abuelos.', ['tengo + liczba + członkowie rodziny', 'mayor / menor', 'somos + ile osób']),
              ],
            },
          ],
        },
        // ───────────── U7 ─────────────
        {
          id: 'u7', tytul: '¿Cómo es?', pl: 'wygląd, kolory i opis osoby z obrazka', ikona: '🧑‍🎨', zrodlo: 'zajęcia: 13.10, 20.10; kolokwium: opis osoby, kolory', kolokwium: true,
          lekcje: [
            {
              id: 'u7l1', tytul: 'Wygląd: alto, bajo, rubio…', ile: 10,
              nowe: [
                { h: 'Aspecto físico', html: tab([[es('alto / alta'), es('bajo / baja'), 'wysoki ≠ niski'], [es('joven'), es('mayor'), 'młody ≠ starszy'], [es('delgado / delgada'), es('gordo / gorda'), 'szczupły ≠ gruby'], [es('rubio / rubia'), es('moreno / morena'), 'blondyn ≠ brunet'], [es('guapo / guapa'), es('feo / fea'), 'ładny ≠ brzydki']]) + `${es('¿Cómo es?')} = jaki jest? — ${es('Es alto y delgado.')}<br>${es('Una persona alta — que mide 1,90 metros.')} = wysoka osoba, która mierzy 1,90 m (${es('mide')} = mierzy). Joven i mayor mają tę samą formę dla obu rodzajów.` },
              ],
              pula: [
                ...paryZ(FISICO.slice(0, 10), 5, 'Połącz przymiotnik z tłumaczeniem'),
                P('Przeciwieństwo: alto ≠ …', 'bajo', `${es('alto ≠ bajo')}.`),
                P('Przeciwieństwo: joven ≠ …', ['mayor', 'viejo'], `${es('joven ≠ mayor')}. Viejo też jest dobrze, ale mayor jest grzeczniejsze.`),
                P('Przeciwieństwo: rubia ≠ …', 'morena', `${es('rubia ≠ morena')} — kobieta, więc końcówka -a.`),
                P('Przeciwieństwo: delgado ≠ …', 'gordo', `${es('delgado ≠ gordo')}.`),
                W('Eva mierzy 1,55 m. Eva es…', ['baja', 'bajo', 'alta', 'mayor'], 'Niska kobieta → <b>baja</b>.'),
                W('„morena” (o włosach) to po polsku:', ['brunetka (ciemne włosy)', 'blondynka', 'ruda', 'siwa'], 'moreno / morena to ciemne włosy (brunet / brunetka). Uwaga: morena może też znaczyć „opalona, śniada”.'),
                KAT('O kim to można powiedzieć?', ['tylko o kobiecie', 'tylko o mężczyźnie', 'o obojgu'], [['alta', 0], ['rubia', 0], ['delgada', 0], ['bajo', 1], ['moreno', 1], ['gordo', 1], ['joven', 2], ['mayor', 2]], 'Przymiotniki na -o mają dla kobiety formę na -a. Joven i mayor mają jedną formę dla obu rodzajów.'),
                U('Ułóż: Jest wysoka, młoda i szczupła.', 'Es alta, joven y delgada.', 'joven nie zmienia się w rodzaju żeńskim.', ['alto', 'jovena'], { alt: ['Es alta, delgada y joven.', 'Es joven, alta y delgada.', 'Es joven, delgada y alta.', 'Es delgada, alta y joven.', 'Es delgada, joven y alta.'] }),
              ],
            },
            {
              id: 'u7l2', tytul: 'ser, tener, llevar', ile: 11,
              nowe: [
                { h: 'Trzy czasowniki do opisu', html: tab([[es('ser'), es('Es alto / joven / rubio.'), 'cechy: wzrost, wiek, budowa, włosy'], [es('tener'), es('Tiene los ojos azules.'), 'oczy (i inne części ciała)'], [es('llevar'), es('Lleva gafas / barba / bigote.'), 'okulary, broda, wąsy (to, co się „nosi”). Przy brodzie i wąsach można też: tiene barba.']]) + `${es('Esta persona es alta, joven y delgada. Tiene los ojos azules. Lleva gafas.')}` },
                { h: 'LLEVAR — nosić', html: tabOdm('llevar') + `${es('Muchos estudiantes llevan barba y bigote.')} — wielu studentów nosi brodę i wąsy.` },
              ],
              pula: [
                ODM('llevar'),
                ...dryl('llevar', [0, 4, 5]),
                W('Mój szef nosi okulary:', ['Mi jefe lleva gafas.', 'Mi jefe es gafas.', 'Mi jefe tiene las gafas azules.', 'Mi jefe lleva los gafas.'], 'Okulary, brodę i wąsy się „nosi”: <b>llevar</b>. Gafas są rodzaju żeńskiego (las gafas).'),
                W('Ma zielone oczy:', ['Tiene los ojos verdes.', 'Es los ojos verdes.', 'Lleva los ojos verdes.', 'Tiene el ojo verdes.'], 'Oczy → <b>tener</b> + los ojos + kolor w l. mnogiej.'),
                W('Jest wysoki:', ['Es alto.', 'Tiene alto.', 'Lleva alto.', 'Es alta.'], 'Cecha wyglądu → <b>ser</b>: es alto. On → końcówka -o.'),
                KAT('Który czasownik pasuje?', ['es…', 'tiene…', 'lleva…'], [['alto', 0], ['joven', 0], ['rubia', 0], ['los ojos azules', 1], ['los ojos negros', 1], ['gafas', 2], ['barba', [1, 2]], ['bigote', [1, 2]]], 'ser → cechy (es alto). tener → oczy (tiene los ojos…). llevar → okulary (lleva gafas). Brodę i wąsy na zajęciach opisujemy przez lleva. Tiene barba też jest poprawne.'),
                LUKI('Uzupełnij opis.', 'Mi profesora [[es]] joven y morena. [[Tiene]] los ojos marrones y [[lleva]] gafas. Sus hijos [[son]] rubios y [[tienen]] los ojos azules.', ['es', 'tiene', 'lleva', 'son', 'tienen'], 'Wygląd → ser, oczy → tener, okulary → llevar. Liczba mnoga (sus hijos) → son, tienen.'),
                P('Uzupełnij: Nosotros … (llevar) gafas.', 'llevamos', `nosotros → ${es('llevamos')}. Llevar to regularny czasownik na -ar.`),
                P('Uzupełnij: Mis compañeros … (llevar) barba.', 'llevan', `ellos → ${es('llevan')}.`),
              ],
            },
            {
              id: 'u7l3', tytul: 'Los colores — kolory', ile: 12,
              nowe: [
                { h: 'Kolory', html: COLORES.map(([s, p, h]) => `<span class="jz-kol"><i style="background:${h}"></i>${es(s)} <small>${p}</small></span>`).join('') },
                { h: 'Kolor zgadza się z rzeczownikiem', html: tab([['-o / -a', es('el coche rojo · la casa roja · los ojos negros')], ['-e, spółgłoska', es('el ojo verde · la camisa azul · los ojos azules · los ojos marrones')], ['naranja, rosa', es('el coche naranja · la camisa rosa')]]) + 'Kolory na -o mają 4 formy: rojo, roja, rojos, rojas. Kolory na -e i na spółgłoskę mają jedną formę dla obu rodzajów. W liczbie mnogiej dostają +s albo +es: verdes, azules, grises, marrones. W marrones akcent znika. Naranja i rosa nie zmieniają się w rodzaju.' + `<br>Pytanie o kolor: ${es('¿De qué color es el coche?')} — jakiego koloru jest samochód?` },
              ],
              pula: [
                W('Pomarańczowy samochód:', ['el coche naranja', 'el coche naranjo', 'la coche naranja', 'el coche naranjos'], 'Naranja nie zmienia się w rodzaju: el coche naranja, la camisa naranja. El naranjo to drzewo pomarańczy.'),
                W('Różowa koszula:', ['la camisa rosa', 'la camisa roso', 'el camisa rosa', 'la camisa rosas'], 'Rosa nie zmienia się w rodzaju: la camisa rosa, el coche rosa.'),
                ...COLORES.map(([s, p, h], i) => W('Jaki to kolor?', [s, ...[1, 2, 3].map((k) => COLORES[(i + k * 3) % COLORES.length][0]).filter((z) => z !== s)], `${es(s)} = ${p}.`, { kol: h })),
                P('Liczba mnoga: los ojos (azul) → los ojos …', 'azules', `Spółgłoska → +es: ${es('azules')}.`),
                P('Liczba mnoga: los ojos (marrón) → los ojos …', 'marrones', `${es('marrones')} — +es i akcent znika.`),
                P('Uzupełnij kolor: la camisa (rojo) → la camisa …', 'roja', `Camisa jest rodzaju żeńskiego → ${es('roja')}.`),
                P('Uzupełnij kolor: las casas (blanco) → las casas …', 'blancas', `Żeński, liczba mnoga → ${es('blancas')}.`),
                W('Flaga Polski jest biało-czerwona:', ['La bandera de Polonia es blanca y roja.', 'La bandera de Polonia es blanco y rojo.', 'La bandera de Polonia es blancas y rojas.', 'La bandera de Polonia tiene blanca y roja.'], 'La bandera (flaga) jest rodzaju żeńskiego → <b>blanca y roja</b>.'),
                W('Flaga Hiszpanii jest czerwono-żółta:', ['La bandera de España es roja y amarilla.', 'La bandera de España es rojo y amarillo.', 'La bandera de España es azul y amarilla.', 'La bandera de España es roja y verde.'], 'Rodzaj żeński: roja, amarilla.'),
                W('Zielone oczy:', ['los ojos verdes', 'los ojos verde', 'las ojos verdes', 'los ojos verdos'], 'verde ma jedną formę dla obu rodzajów, w liczbie mnogiej +s: <b>verdes</b>.'),
                P('Napisz po hiszpańsku: żółty', 'amarillo', `Żółty to ${es('amarillo')}. W środku jest podwójne „l”.`),
                P('Napisz po hiszpańsku: szary', 'gris', `Szary to ${es('gris')}.`),
                W('Jak zapytać o kolor samochodu?', ['¿De qué color es el coche?', '¿Cómo color es el coche?', '¿Qué es color el coche?', '¿Dónde color es el coche?'], `O kolor pytamy: ${es('¿De qué color es…?')} Na początku stoi „de”.`),
                P('Uzupełnij kolor: los coches (negro) → los coches …', 'negros', `Coches to rodzaj męski, liczba mnoga. Kolor na -o dostaje -os: ${es('negros')}.`),
                P('Uzupełnij kolor: las camisas (gris) → las camisas …', 'grises', `Gris kończy się spółgłoską. W liczbie mnogiej dostaje -es: ${es('grises')}.`),
                P('Uzupełnij kolor: la camisa (naranja) → la camisa …', 'naranja', `Naranja nie zmienia się w rodzaju: ${es('el coche naranja, la camisa naranja')}.`),
                W('Ona nosi zieloną koszulę:', ['Lleva una camisa verde.', 'Lleva una camisa verda.', 'Tiene una verde camisa.', 'Es una camisa verde.'], 'Ubranie się nosi: llevar. Verde ma jedną formę dla obu rodzajów. Kolor stoi po rzeczowniku.'),
                SLUCHAJ('amarillo', ['amarillo', 'morado', 'marrón', 'blanco'], `${es('amarillo')} = żółty.`),
              ],
            },
            {
              id: 'u7l4', tytul: 'Opisz osobę z obrazka', ile: 9,
              nowe: [
                { h: 'Przepis na opis (zadanie z kolokwium)', html: `<ol><li><b>Ser</b> — wzrost, wiek, budowa, włosy: ${es('Es alta, joven, delgada y rubia.')}</li><li><b>Tener</b> — oczy: ${es('Tiene los ojos azules.')}</li><li><b>Llevar</b> — okulary, broda, wąsy: ${es('Lleva gafas.')}</li><li>Końcówki: kobieta → -a (alta, rubia), mężczyzna → -o. Joven i mayor się nie zmieniają.</li><li>Uwaga: po <b>Esta persona es…</b> przymiotnik ma formę żeńską (alta, rubia). Persona jest rodzaju żeńskiego. Tak jest także o mężczyźnie: ${es('Esta persona es alta.')} Ale: ${es('Este hombre es alto.')} — ten mężczyzna jest wysoki.</li></ol>Starsza osoba z siwymi włosami: ${es('Es mayor. Tiene el pelo blanco.')}` },
              ],
              pula: [
                ...opisz(POSTACIE.lucia),
                ...opisz(POSTACIE.jorge),
                ...opisz(POSTACIE.pablo),
                ...opisz(POSTACIE.carmen),
                ...opisz(POSTACIE.ana),
                ...opisz(POSTACIE.diego),
                LUKI('Popatrz na postać i uzupełnij opis. Bez podpowiedzi.', 'Esta persona es un hombre. No es joven, es [[mayor]]. No es alto, es [[bajo]] y gordo. Tiene el pelo [[blanco|gris|canoso]] y los ojos [[marrones]]. [[Lleva]] barba y bigote.', [], 'Wiek i wzrost → ser: es mayor, es bajo. Włosy i oczy → tener: tiene el pelo blanco, tiene los ojos marrones. Broda i wąsy → llevar.', { aw: POSTACIE.jorge }),
                LUKI('Popatrz na postać i uzupełnij opis. Bez podpowiedzi.', 'Esta persona es una mujer. No es mayor, es [[joven]]. No es baja, es [[alta]] y delgada. No es morena, es [[rubia]]. Tiene los ojos [[azules]]. [[Lleva]] gafas.', [], 'To kobieta, więc końcówka -a: alta, rubia. Joven się nie zmienia. Oczy → tener. Okulary → llevar.', { aw: POSTACIE.lucia }),
                PISZ('Opisz osobę z obrazka w 3–4 zdaniach (jak na kolokwium).', 'Esta persona es un hombre joven. Es alto, delgado y moreno. Tiene los ojos verdes. Lleva gafas y bigote.', ['es + wzrost, wiek, budowa, włosy', 'tiene los ojos + kolor (-s/-es)', 'lleva + gafas / barba / bigote', 'końcówki: po „Es…” jak osoba (-o / -a), po „Esta persona es…” forma żeńska (-a)'], '', { aw: POSTACIE.pablo }),
              ],
            },
          ],
        },
        // ───────────── U8 ─────────────
        {
          id: 'u8', tytul: 'El carácter', pl: 'charakter, przeciwieństwa i trzy grupy przymiotników (Reto 1–3)', ikona: '🧠', zrodlo: 'zajęcia: 13.10, 27.10; str. 31 ćw. 3b, str. 33 ćw. 10; powtórka: Reto 1–3', kolokwium: true,
          lekcje: [
            {
              id: 'u8l1', tytul: 'Charakter czy wygląd?', ile: 10,
              nowe: [
                { h: 'Carácter ≠ aspecto físico', html: tab([[`${es('tranquilo ≠ nervioso')}<br><small>spokojny ≠ nerwowy</small>`, `${es('mayor ≠ joven')}<br><small>starszy ≠ młody</small>`], [`${es('ordenado ≠ desordenado')}<br><small>uporządkowany ≠ nieuporządkowany</small>`, `${es('bajo ≠ alto')}<br><small>niski ≠ wysoki</small>`], [`${es('simpático ≠ antipático')}<br><small>sympatyczny ≠ niesympatyczny</small>`, `${es('rubio ≠ moreno')}<br><small>blondyn ≠ brunet</small>`], [`${es('alegre ≠ triste')}<br><small>wesoły ≠ smutny</small>`, `${es('feo ≠ guapo / bonito')}<br><small>brzydki ≠ ładny</small>`], [`${es('optimista ≠ pesimista')}<br><small>optymista ≠ pesymista</small>`, `${es('gordo ≠ delgado')}<br><small>gruby ≠ szczupły</small>`]], ['carácter (charakter)', 'aspecto físico (wygląd)']) + `Nowe: ${es('amable')} (miły), ${es('flexible')} (elastyczny), ${es('tímido')} (nieśmiały), ${es('divertido')} (zabawny), ${es('serio')} (poważny), ${es('decidido')} (zdecydowany), ${es('interesante')} (ciekawy).` },
              ],
              pula: [
                KAT('Charakter czy wygląd?', ['carácter', 'aspecto físico'], [['ordenado', 0], ['antipático', 0], ['optimista', 0], ['alegre', 0], ['nervioso', 0], ['mayor', 1], ['bajo', 1], ['moreno', 1], ['delgado', 1], ['guapo', 1]], 'Charakter to to, jaki ktoś jest „w środku”; wygląd to to, co widać na zdjęciu.'),
                KAT('Charakter czy wygląd?', ['carácter', 'aspecto físico'], [['tranquilo', 0], ['simpático', 0], ['pesimista', 0], ['desordenado', 0], ['triste', 0], ['alto', 1], ['rubio', 1], ['gordo', 1], ['feo', 1], ['joven', 1]], 'Wygląd: wzrost, wiek, budowa, włosy, uroda. Reszta to charakter.'),
                ...paryZ(CARACTER.slice(0, 10), 5, 'Połącz cechę z tłumaczeniem'),
                ...znaczy(CARACTER, [10, 11, 12, 13]),
                PARY([['flexible', 'elastyczny'], ['decidido', 'zdecydowany'], ['interesante', 'ciekawy'], ['amable', 'miły'], ['tímido', 'nieśmiały']], 'Połącz cechę z tłumaczeniem'),
                P('Przeciwieństwo: optimista ≠ …', 'pesimista', `${es('optimista ≠ pesimista')}.`),
                P('Przeciwieństwo: alegre ≠ …', 'triste', `${es('alegre ≠ triste')}.`),
              ],
            },
            {
              id: 'u8l2', tytul: 'Przeciwieństwa (str. 33, ćw. 10)', ile: 11,
              nowe: [
                { h: 'Los adjetivos contrarios', html: tab(CONTRARIOS.map(([a, b]) => [`${es(a)}<br><small>${CONTRARIOS_PL[a]}</small>`, `${es(b)}<br><small>${CONTRARIOS_PL[b]}</small>`]), ['cecha', 'przeciwieństwo']) + '<b>Uwaga na końcówkę!</b> W zdaniu przeciwieństwo dostaje rodzaj i liczbę osoby: ' + `${es('Jaime y Eva no son trabajadores, son vagos.')} ${es('Eva no es rubia, es morena.')}` },
              ],
              pula: [
                ...paryZ(Object.entries(CONTRARIOS_PL), 5, 'Połącz cechę z tłumaczeniem'),
                PARY(CONTRARIOS.slice(0, 4), 'Połącz przeciwieństwa'),
                PARY(CONTRARIOS.slice(3, 7), 'Połącz przeciwieństwa'),
                P('Eva no es alta, es …', 'baja', `Eva → kobieta → ${es('baja')}.`),
                P('Jaime y Eva no son trabajadores, son …', ['vagos', 'perezosos'], `Grupa mieszana → męski, liczba mnoga: ${es('vagos')}. Perezosos znaczy to samo.`),
                P('Nosotros no somos abiertos, somos …', 'cerrados', `Nosotros → liczba mnoga: abiertos ≠ ${es('cerrados')}.`),
                P('Los polacos no son cercanos, son …', 'distantes', `distante → liczba mnoga ${es('distantes')}.`),
                P('Los jefes no son formales, son …', 'informales', `${es('informales')} (spółgłoska → +es).`),
                P('Eva y Adam no son jóvenes, son …', ['mayores', 'viejos'], `Eva y Adam → liczba mnoga: jóvenes ≠ ${es('mayores')}. Mayor dostaje -es. Viejos też jest dobrze, ale mayores jest grzeczniejsze.`),
                P('Mi hermana no es introvertida, es …', 'extrovertida', `Mi hermana → kobieta: introvertida ≠ ${es('extrovertida')}.`),
                P('Tus compañeras no son antipáticas, son …', 'simpáticas', `Żeński, liczba mnoga: ${es('simpáticas')}.`),
                P('El director no es responsable, es …', 'irresponsable', `${es('irresponsable')} — przedrostek ir-.`),
                W('Las profesoras no son vagas, son…', ['trabajadoras', 'trabajadores', 'trabajadoros', 'trabajadora'], 'trabajador → żeński: trabajador<b>a</b>, liczba mnoga: trabajador<b>as</b>.'),
              ],
            },
            {
              id: 'u8l3', tytul: 'Trzy grupy przymiotników (Reto 1)', ile: 9,
              nowe: [
                { h: 'Trzy grupy — to będzie na kolokwium', html: tab([[`<b>-o / -a</b><br>-os / -as`, es('simpático, simpática, simpáticos, simpáticas') + '<br>' + es('ingeniero, médico, secretario, arquitecto')], [`<b>-or / -ora</b><br>-ores / -oras`, es('trabajador, trabajadora, trabajadores, trabajadoras') + '<br>' + es('profesor, programador, asesor')], [`<b>formas invariables</b><br>(ta sama forma, zmienia się tylko liczba)`, es('responsable, inteligente, formal, distante, eficaz, joven, mayor, optimista') + '<br>' + es('agente, periodista, recepcionista, estudiante')]]) + '<b>Przepis:</b> 1) Spójrz na formę męską. 2) Końcówka -o → grupa 1. 3) Końcówka -or → grupa 2. Wyjątek: mayor i menor mają jedną formę (la hermana mayor). 4) Końcówka -e, -ista albo inna spółgłoska (formal, eficaz, joven) → grupa 3. Rodzaj widać wtedy tylko po el / la. Uwaga: narodowości na spółgłoskę dostają -a (español → española, inglés → inglesa). Kilka zawodów na -e też ma formę na -a: el jefe → la jefa.' },
              ],
              pula: [
                KAT('Posortuj zawody (Reto 1).', K3, [['ingeniero', 0], ['médico', 0], ['secretario', 0], ['arquitecto', 0], ['profesor', 1], ['programador', 1], ['asesor', 1], ['agente', 2], ['periodista', 2], ['recepcionista', 2]], 'Zawody na -o mają formę na -a: médica. Zawody na -or dostają -ora: asesora. Agente, periodista i recepcionista się nie zmieniają. Zmienia się tylko el / la.'),
                KAT('Posortuj przymiotniki ze str. 33, ćw. 10 (1/2).', K3, [['responsable', 2], ['irresponsable', 2], ['extrovertido', 0], ['introvertido', 0], ['distante', 2], ['cercano', 0], ['formal', 2]], 'Responsable, irresponsable, distante i formal mają jedną formę. Extrovertido, introvertido i cercano mają -o / -a.'),
                KAT('Posortuj przymiotniki ze str. 33, ćw. 10 (2/2).', K3, [['informal', 2], ['trabajador', 1], ['vago', 0], ['simpático', 0], ['antipático', 0], ['abierto', 0], ['cerrado', 0]], 'Trabajador to jedyny na -or. Informal ma jedną formę. Reszta ma -o / -a.'),
                KAT('Posortuj niebieskie słówka (str. 31, ćw. 3b).', K3, [['creativo', 0], ['comunicativo', 0], ['habilidoso', 0], ['rápido', 0], ['motivador', 1], ['conciliador', 1], ['innovador', 1], ['formal', 2], ['eficaz', 2], ['abierto', 0]], 'Motivador, conciliador i innovador mają formę na -ora. Formal i eficaz mają jedną formę dla obu rodzajów. W liczbie mnogiej: formales, eficaces.'),
                KAT('Mieszanka: posortuj.', K3, [['antipático', 0], ['ordenado', 0], ['delgado', 0], ['guapo', 0], ['trabajador', 1], ['motivador', 1], ['inteligente', 2], ['joven', 2], ['mayor', 2], ['optimista', 2]], 'Joven i mayor to wygląd, ale też grupa 3. Mayor kończy się na -or, a mimo to ma jedną formę (el hermano mayor, la hermana mayor). Optimista kończy się na -a, a mimo to jest taki sam dla obu rodzajów (el chico optimista, la chica optimista).'),
                P('Rodzaj żeński: innovador → …', 'innovadora', `${es('innovadora')} (-or → -ora).`),
                P('Rodzaj żeński: eficaz → …', 'eficaz', `${es('eficaz')} — grupa 3, ta sama forma.`),
                P('Liczba mnoga żeńska: conciliador → …', 'conciliadoras', `${es('conciliadoras')} (-oras).`),
                P('Liczba mnoga: joven → …', 'jóvenes', `${es('jóvenes')} — w liczbie mnogiej dochodzi akcent.`),
                W('Która forma jest błędna?', ['la jefa responsabla', 'la jefa responsable', 'la jefa trabajadora', 'la jefa simpática'], 'Responsable jest w grupie 3 — nie ma formy „responsabla”.'),
                W('Która para jest poprawna?', ['un asesor / una asesora', 'un asesor / una asesor', 'un asesoro / una asesora', 'un asesor / una asesoro'], 'Asesor kończy się na -or → żeński asesor<b>a</b>.'),
              ],
            },
            {
              id: 'u8l4', tytul: 'Cechy dobrego szefa (Reto 3)', ile: 10,
              nowe: [
                { h: 'Las cualidades (str. 31, ćw. 3b)', html: tab(CUALIDADES.map(([s, p]) => [es(s), p])) + `${es('¿Cómo es tu jefa?')} — ${es('Creo que es una mujer abierta y eficaz.')} (myślę, że to otwarta i skuteczna kobieta)<br>${es('Creo que…')} — myślę, że… ${es('¿No crees?')} — nie sądzisz? ${es('Es verdad.')} — to prawda.<br>Uwaga: po ${es('una persona')} przymiotnik ma formę żeńską. Persona jest rodzaju żeńskiego. Tak jest także o mężczyźnie: ${es('Mi jefe es una persona creativa.')}` },
                { h: 'Muy, bastante, no muy', html: `${es('Es grande.')} — jest duży. ${es('Es muy grande.')} — bardzo duży.<br>${es('Es bastante grande.')} — dość duży. ${es('No es muy grande.')} — niezbyt duży.` },
              ],
              pula: [
                P('Una persona que motiva a otros es …', 'motivadora', `${es('motivadora')} — od motivar (motywować). Persona jest rodzaju żeńskiego. Dlatego przymiotnik ma -a: motivador<b>a</b>. Tak samo, gdy chodzi o mężczyznę.`),
                P('Una persona que tiene ideas originales es …', 'creativa', `${es('creativa')}. Po una persona zawsze forma żeńska.`),
                P('Una persona que se comunica bien con otras personas es …', 'comunicativa', `${es('comunicativa')}. Po una persona zawsze forma żeńska.`),
                P('Una persona con mucho talento es …', ['habilidosa', 'talentosa'], `${es('habilidosa')}. Talentosa też jest dobrze. Po una persona zawsze forma żeńska.`),
                P('Una persona que introduce cosas nuevas es …', 'innovadora', `${es('innovadora')} (-or → -ora). Po una persona zawsze forma żeńska.`),
                P('Una persona que trabaja mucho es …', 'trabajadora', `${es('trabajadora')} (-or → -ora). Po una persona zawsze forma żeńska.`),
                W('Una persona que ayuda a resolver conflictos es…', ['conciliadora', 'cerrada', 'distante', 'rápida'], '<b>conciliador/-a</b> — łagodzi spory, szuka porozumienia.'),
                W('Una persona que consigue buenos resultados es…', ['eficaz', 'vaga', 'tímida', 'formal'], '<b>eficaz</b> — skuteczny; jedna forma dla obu rodzajów.'),
                ...paryZ(CUALIDADES, 5, 'Połącz cechę z tłumaczeniem'),
                U('Ułóż: Myślę, że to inteligentna kobieta.', 'Creo que es una mujer inteligente.', 'Creo que… = myślę, że…; przymiotnik po rzeczowniku.', ['un', 'inteligenta']),
                W('„No es muy grande” to:', ['niezbyt duży', 'bardzo duży', 'dość duży', 'za duży'], '<b>no es muy</b> + przymiotnik = niezbyt.'),
              ],
            },
          ],
        },
        // ───────────── U9 ─────────────
        {
          id: 'u9', tytul: 'Los posesivos', pl: 'mi, tu, su, nuestro, vuestro (Reto 4)', ikona: '🔑', zrodlo: 'zajęcia: 20.10; powtórka: Reto 4', kolokwium: true,
          lekcje: [
            {
              id: 'u9l1', tytul: 'mi, tu, su', ile: 10,
              nowe: [
                { h: 'Zaimki dzierżawcze', html: tab([['yo', es('mi / mis'), 'mój, moja'], ['tú', es('tu / tus'), 'twój, twoja'], ['él, ella, usted', es('su / sus'), 'jego, jej, Pana, Pani'], ['nosotros', es('nuestro / nuestra / nuestros / nuestras'), 'nasz, nasza'], ['vosotros', es('vuestro / vuestra / vuestros / vuestras'), 'wasz, wasza'], ['ellos, ellas, ustedes', es('su / sus'), 'ich, Państwa']], ['czyje?', 'forma', 'znaczy']) + '<b>Najważniejsze:</b> forma zgadza się z <b>rzeczą</b>, którą się ma, nie z właścicielem. Mi, tu, su mają tylko liczbę: ' + `${es('mi jefe')} → ${es('mis jefes')}.` },
              ],
              pula: [
                W('… jefes son muy serios. (moi szefowie)', ['Mis', 'Mi', 'Mío', 'Nuestros'], 'Jefes to liczba mnoga → <b>mis</b>.'),
                W('¿Cuál es … dirección, señor García?', ['su', 'tu', 'sus', 'vuestra'], 'Do Pana (usted) → <b>su</b>.'),
                W('Eva trabaja en Madrid. … empresa es grande.', ['Su', 'Sus', 'Tu', 'Mi'], 'Firma Evy → jej firma → <b>su</b> (jedna firma).'),
                P('los empleados de Eva → … empleados', 'sus', `Właściciel: ella → su; rzecz: empleados (liczba mnoga) → ${es('sus')}.`),
                P('el trabajo de ti → … trabajo', 'tu', `de ti = tú → ${es('tu')} (bez akcentu! tú z akcentem to „ty”).`),
                P('los clientes de ti → … clientes', 'tus', `de ti → tú → tu. Clientes to liczba mnoga → ${es('tus')}.`),
                P('el despacho de mí → … despacho', 'mi', `de mí → yo → ${es('mi')}. Bez akcentu: mí z akcentem znaczy „mnie”.`),
                P('las compañeras de mí → … compañeras', 'mis', `de mí → yo → mi. Compañeras to liczba mnoga → ${es('mis')}.`),
                P('la dirección de usted → … dirección', 'su', `usted → ${es('su')}.`),
                P('los hijos de usted → … hijos', 'sus', `Usted → su. Hijos to liczba mnoga, więc ${es('sus')}.`),
                P('la familia de ti → … familia', 'tu', `de ti = tú → ${es('tu')}. Familia to jedna rzecz. Zaimek tu piszemy bez akcentu.`),
                P('los amigos de Sara → … amigos', 'sus', `Sara → su; amigos to liczba mnoga → ${es('sus')}.`),
              ],
            },
            {
              id: 'u9l2', tytul: 'nuestro, vuestro', ile: 10,
              nowe: [
                { h: '4 formy: rodzaj i liczba rzeczy', html: tab([[es('nuestro jefe'), es('nuestra empresa')], [es('nuestros jefes'), es('nuestras empresas')], [es('vuestro trabajo'), es('vuestra oficina')], [es('vuestros clientes'), es('vuestras jefas')]], ['rzecz męska', 'rzecz żeńska']) + 'Patrzysz na rzeczownik po zaimku: el / la, jeden / wiele. Kto jest właścicielem (chłopcy czy dziewczyny), nie ma znaczenia.' },
              ],
              pula: [
                P('las empresas de nosotros → … empresas', 'nuestras', `Empresas: żeński, l. mnoga → ${es('nuestras')}.`),
                P('el jefe de vosotros → … jefe', 'vuestro', `Jefe: męski, l. pojedyncza → ${es('vuestro')}.`),
                P('las jefas de vosotros → … jefas', 'vuestras', `Jefas: żeński, l. mnoga → ${es('vuestras')}.`),
                P('la oficina de nosotros → … oficina', 'nuestra', `Oficina: żeński, jedna → ${es('nuestra')}.`),
                P('los proyectos de nosotras → … proyectos', 'nuestros', `Właścicielki są kobietami, ale proyectos to rodzaj męski → ${es('nuestros')}.`),
                P('la universidad de vosotros → … universidad', 'vuestra', `Universidad jest rodzaju żeńskiego → ${es('vuestra')}.`),
                W('Ana y Marta: „… profesor es muy simpático.”', ['Nuestro', 'Nuestra', 'Nuestros', 'Nuestras'], 'Liczy się rzecz: profesor (męski, jeden) → <b>nuestro</b>, mimo że mówią dwie kobiety.'),
                W('¿Dónde están … padres? (wasi rodzice)', ['vuestros', 'vuestras', 'vuestro', 'sus'], 'padres → męski, liczba mnoga → <b>vuestros</b>.'),
                P('los compañeros de vosotras → … compañeros', 'vuestros', `Właścicielki to kobiety, ale liczy się rzecz. Compañeros to rodzaj męski, liczba mnoga. Wynik: ${es('vuestros')}.`),
                KAT('Gdzie pasuje „nuestro”, a gdzie „nuestra”?', ['nuestro', 'nuestra'], [['jefe', 0], ['trabajo', 0], ['departamento', 0], ['país', 0], ['empresa', 1], ['oficina', 1], ['universidad', 1], ['mascota', 1]], 'Rodzaj rzeczownika: el jefe, el trabajo, el departamento, el país → nuestro; la empresa, la oficina, la universidad, la mascota → nuestra.'),
              ],
            },
            {
              id: 'u9l3', tytul: 'Zamień „X de Y” (Reto 4)', ile: 10,
              nowe: [
                { h: 'Przepis w dwóch krokach', html: '<ol><li><b>Kto ma?</b> Zamień właściciela na osobę: <br>de mí → yo · de ti → tú · de Eva / de usted → él/ella/usted<br>de mí y de ti → <b>nosotros</b> · de Eva y de ti → <b>vosotros</b> · de Eva y Adam / de ustedes → ellos/ustedes</li><li><b>Co ma?</b> Spójrz na rzecz: rodzaj i liczba → wybierz formę.</li></ol>' + `Przykład: ${es('la mascota de Eva y de ti')} → Eva i ty = vosotros → mascota: żeński, jedna → ${es('vuestra mascota')}.` },
              ],
              pula: [
                P('el departamento de Eva y Ada → … departamento', 'su', `Eva i Ada = ellas → ${es('su')}.`),
                P('el trabajo de mí y de ti → … trabajo', 'nuestro', `Ja i ty = nosotros; trabajo męski → ${es('nuestro')}.`),
                P('la mascota de Eva y de ti → … mascota', 'vuestra', `Eva i ty = vosotros; mascota żeńska → ${es('vuestra')}.`),
                P('la oficina de ustedes → … oficina', 'su', `ustedes → ${es('su')}.`),
                P('el país de ti y de mí → … país', 'nuestro', `Ty i ja = nosotros → ${es('nuestro')}.`),
                P('las reuniones de ti y de mí → … reuniones', 'nuestras', `nosotros; reuniones: żeński, l. mnoga → ${es('nuestras')}.`),
                P('los jefes de Marta y de ti → … jefes', 'vuestros', `Marta i ty = vosotros; jefes → ${es('vuestros')}.`),
                P('el coche de Pablo → … coche', 'su', `Pablo = él → su. Coche jest jeden → ${es('su')}.`),
                P('las preguntas de los estudiantes → … preguntas', 'sus', `ellos; preguntas l. mnoga → ${es('sus')}.`),
                P('la casa de mis abuelos → … casa', 'su', `Moi dziadkowie = ellos; casa (jedna) → ${es('su')}.`),
                P('el país de Eva y de mí → … país', 'nuestro', `Eva i ja = nosotros → ${es('nuestro')}.`),
                P('las facturas de usted → … facturas', 'sus', `usted; facturas l. mnoga → ${es('sus')}.`),
              ],
            },
            {
              id: 'u9l4', tytul: 'Zaimki w zdaniach', ile: 9,
              nowe: [],
              pula: [
                LUKI('Uzupełnij zaimki.', 'Eva y yo trabajamos en un banco. [[Nuestra]] oficina está en el centro y [[nuestros]] clientes son muy amables. ¿Y vosotros? ¿Dónde está [[vuestra]] empresa? ¿Cómo es [[vuestro]] jefe?', ['Nuestra', 'nuestros', 'vuestra', 'vuestro', 'nuestro', 'vuestros'], 'Eva y yo = nosotros (nuestra oficina, nuestros clientes); vosotros → vuestra empresa, vuestro jefe.'),
                LUKI('Uzupełnij zaimki.', 'Me llamo Pablo. [[Mi]] hermana es médica y [[sus]] pacientes son muy simpáticos. [[Mis]] padres viven en Sevilla. ¿Y tú? ¿Dónde viven [[tus]] padres?', ['Mi', 'sus', 'Mis', 'tus', 'su', 'tu'], 'mi hermana (jedna), sus pacientes (jej, wielu), mis padres, tus padres.'),
                U('Ułóż: Nasza firma jest dość duża.', 'Nuestra empresa es bastante grande.', 'empresa jest żeńska → nuestra; bastante = dość.', ['Nuestro', 'muy']),
                U('Ułóż: Jak ma na imię Pana szef?', '¿Cómo se llama su jefe?', 'Pana → su.', ['tu', 'vuestro']),
                W('Señores, ¿dónde está … oficina?', ['su', 'vuestra', 'tu', 'sus'], 'Señores → ustedes → <b>su</b>. Vuestra to „wasza” na ty.'),
                W('Pytasz kolegów z roku (na „wy”): ¿Cómo se llama … profesor?', ['vuestro', 'su', 'nuestro', 'vuestros'], 'Do kolegów na „wy” → vosotros. Profesor jest rodzaju męskiego i jest jeden → <b>vuestro</b>. Su to „Państwa” (ustedes).'),
                W('Señora Gómez, ¿cómo se llaman … hijos?', ['sus', 'su', 'tus', 'vuestros'], 'Do Pani mówimy usted, więc su. Hijos to liczba mnoga, więc sus.'),
                U('Ułóż: Wasza szefowa jest bardzo miła.', 'Vuestra jefa es muy amable.', 'Wy na ty to vosotros. Jefa jest rodzaju żeńskiego, więc vuestra.', ['Vuestro', 'Nuestra']),
                W('Tengo un gato. … gato es negro.', ['Mi', 'Mis', 'Su', 'Tu'], 'Mój → <b>mi</b>.'),
              ],
            },
          ],
        },
        // ───────────── U10 ─────────────
        {
          id: 'u10', tytul: 'Mi futuro', pl: 'QUERER, plany i cele zawodowe (Reto 5–7)', ikona: '🚀', zrodlo: 'zajęcia: 27.10, „querer”; powtórka: Reto 5–7', kolokwium: true,
          lekcje: [
            {
              id: 'u10l1', tytul: 'QUERER — chcieć (e → ie)', ile: 10,
              nowe: [
                { h: 'QUERER', html: tabOdm('querer') + `Zmiana e → ie jest wszędzie poza <b>nosotros</b> i <b>vosotros</b> (queremos, queréis). Tak samo zmienia się tener: tienes, tiene, tienen. Tener ma jeszcze własną formę yo: <b>tengo</b> (nie „tieno”).<br>${es('En el futuro quiero trabajar en el departamento de ventas.')} — w przyszłości chcę pracować w dziale sprzedaży.<br>${es('Queremos un jefe comunicativo y abierto.')} — chcemy komunikatywnego i otwartego szefa.` },
              ],
              pula: [
                ODM('querer'),
                ...dryl('querer', [0, 1, 2, 3, 4, 5]),
                P('Y vosotros, ¿qué … (querer) para vuestro futuro profesional?', 'queréis', `vosotros → ${es('queréis')} (bez ie, z akcentem).`),
                P('Mis padres … (querer) un coche nuevo.', 'quieren', `ellos → ${es('quieren')}.`),
                W('Nosotros … tener un buen salario.', ['queremos', 'quieremos', 'quieren', 'queréis'], 'nosotros nie ma ie → <b>queremos</b>. „quieremos” to typowy błąd.'),
                U('Ułóż: W przyszłości chcę pracować w dziale sprzedaży.', 'En el futuro quiero trabajar en el departamento de ventas.', 'quiero + bezokolicznik (trabajar).', ['trabajo', 'quiere'], { alt: ['Quiero trabajar en el departamento de ventas en el futuro.'] }),
              ],
            },
            {
              id: 'u10l2', tytul: 'Plany i cele (Reto 6)', ile: 10,
              nowe: [
                { h: 'Quiero + bezokolicznik', html: tab([[es('ir'), es('a la playa · de compras · a un concierto · al cine')], [es('salir'), es('de noche')], [es('hacer'), es('un curso de cocina · deporte')], [es('ganar'), es('mucho dinero')], [es('tener'), es('un buen horario · un jefe amable · un trabajo interesante · un buen salario')], [es('trabajar'), es('en una empresa internacional · en otro país')]], ['czasownik', 'z czym']) + `${es('¿Qué planes tienes para el fin de semana?')} — ${es('Quiero ir al cine y descansar.')}<br>${es('¿Qué quieres para tu futuro profesional?')} — ${es('Quiero trabajar en otro país y ganar mucho dinero.')}` },
              ],
              pula: [
                KAT('Który czasownik pasuje do wyrażenia?', ['ir', 'salir', 'hacer', 'ganar', 'tener', 'trabajar'], [['a la playa', 0], ['de noche', [1, 5]], ['un curso de cocina', 2], ['mucho dinero', [3, 4]], ['un buen horario', 4], ['en otro país', 5], ['a un concierto', 0], ['un jefe amable', 4]], 'ir a la playa, salir de noche, hacer un curso, ganar mucho dinero (zarabiać; tener mucho dinero = mieć dużo pieniędzy też jest poprawne), tener un buen horario, trabajar en otro país. Trabajar de noche (pracować nocą) też jest poprawne.'),
                KAT('Który czasownik pasuje do wyrażenia?', ['ir', 'hacer', 'tener', 'trabajar'], [['de compras', 0], ['deporte', 1], ['un trabajo interesante', [1, 2]], ['en una empresa internacional', 3], ['al cine', 0], ['buenos compañeros', 2]], 'ir de compras, hacer deporte, tener un trabajo interesante (mieć ciekawą pracę; hacer un trabajo interesante = wykonywać ciekawą pracę, też dobrze), trabajar en una empresa internacional, ir al cine, tener buenos compañeros.'),
                ...paryZ(PLANES, 5, 'Połącz plan z tłumaczeniem'),
                W('„Mieć dobre godziny pracy” to:', ['tener un buen horario', 'ganar un buen horario', 'hacer un buen horario', 'ir a un buen horario'], 'horario = grafik, godziny pracy → <b>tener un buen horario</b>.'),
                U('Ułóż: Chcę pójść do kina i odpocząć.', 'Quiero ir al cine y descansar.', 'Po quiero dwa bezokoliczniki: ir, descansar. al = a + el.', ['a el', 'voy'], { alt: ['Quiero descansar y ir al cine.'] }),
                U('Ułóż: Chcemy mieć ciekawą pracę.', 'Queremos tener un trabajo interesante.', 'queremos + tener.', ['tenemos', 'quieremos']),
                P('Uzupełnij: Quiero … (iść) de compras.', ['ir'], `Po quiero stoi bezokolicznik. Iść na zakupy to ${es('ir de compras')}.`),
                W('Pytanie do kolegi: „Czy chcesz pracować w innym kraju?”', ['¿Quieres trabajar en otro país?', '¿Quiere trabajar en otro país?', '¿Quieres trabajas en otro país?', '¿Queres trabajar en otro país?'], 'Do kolegi mówimy na ty, więc quieres. Po quieres stoi bezokolicznik: trabajar.'),
                P('Uzupełnij: Quiero … (zarabiać) mucho dinero.', 'ganar', `zarabiać = ${es('ganar')}.`),
              ],
            },
            {
              id: 'u10l3', tytul: 'ser, tener, querer, llevar (Reto 5)', ile: 9,
              nowe: [
                { h: 'Który czasownik?', html: tab([[es('ser'), 'jaki ktoś jest, kim jest, jaki dziś dzień', es('Mis jefes son serios. Hoy es viernes.')], [es('tener'), 'mieć; oczy; lata', es('Tenemos mucho trabajo. Tiene los ojos azules.')], [es('querer'), 'chcieć + bezokolicznik', es('Queremos terminar a las 13.')], [es('llevar'), 'nosić okulary, brodę, wąsy', es('Llevan barba y bigote.')]]) },
              ],
              pula: [
                LUKI('Uzupełnij formami ser, tener, querer, llevar.', 'Mi jefa [[es]] muy simpática. [[Tiene]] los ojos verdes y [[lleva]] gafas. Normalmente nosotros [[tenemos]] mucho trabajo, pero hoy [[es]] viernes y [[queremos]] salir de noche.', ['es', 'Tiene', 'lleva', 'tenemos', 'es', 'queremos'], 'Cecha → ser, oczy → tener, okulary → llevar, praca → tener, dzień → ser, plan → querer.'),
                LUKI('Uzupełnij formami ser, tener, querer, llevar.', 'Mis compañeros [[son]] jóvenes y muchos [[llevan|tienen]] barba. El hijo de Ana [[es]] rubio y [[tiene]] los ojos azules. ¿Y tú, qué [[quieres]] para tu futuro?', ['son', 'llevan', 'es', 'tiene', 'quieres'], 'Liczba mnoga (compañeros) → son, llevan; el hijo → es, tiene; tú → quieres.'),
                W('Muchos estudiantes … barba y bigote. (noszą)', ['llevan', 'tienen los', 'son', 'quieren'], 'Noszą brodę i wąsy → <b>llevan</b>. Tienen barba (bez „los”) też jest poprawne.'),
                W('Hoy … viernes.', ['es', 'tiene', 'está', 'lleva'], 'Dzień tygodnia → <b>ser</b>: hoy es viernes.'),
                W('Nosotros … mucho trabajo. (mamy)', ['tenemos', 'somos', 'llevamos', 'queremos'], 'Mamy dużo pracy → <b>tener</b>: tenemos.'),
                P('Y vosotros, ¿qué … (querer) hacer?', 'queréis', `vosotros → ${es('queréis')}. Bez ie, bo to vosotros.`),
                P('Ellos … (ser) muy serios.', 'son', `ellos → ${es('son')}. Cechę charakteru opisuje ser.`),
                P('Yo … (tener) veintidós años.', 'tengo', `yo → ${es('tengo')}. Wiek podajemy z tener.`),
                P('Tú … (llevar) gafas.', 'llevas', `tú → ${es('llevas')}. Okulary się nosi: llevar.`),
                ODM('ser'),
                ODM('tener'),
                ODM('trabajar'),
                ...dryl('ser', [4]),
                ...dryl('tener', [4]),
              ],
            },
            {
              id: 'u10l4', tytul: 'Moja uczelnia (Reto 7)', ile: 8,
              nowe: [
                { h: 'Opis uczelni', html: `${es('Mi universidad es bastante grande.')} — dość duża. ${es('Tiene diez mil estudiantes.')} — ma 10 000 studentów (${es('mil')} = tysiąc).<br>${es('El campus está en el centro de la ciudad.')} — kampus jest w centrum miasta (${es('la ciudad')} = miasto). To „está” traktujemy jako zwrot.<br>${es('Sus edificios son modernos / antiguos.')} — budynki są nowoczesne / stare.<br>${es('grande ≠ pequeño')} · ${es('antiguo ≠ moderno')}<br>${es('Aprendo mucho.')} — dużo się uczę.` },
                { h: 'E-mail do kolegi', html: `${es('Hola, Pedro:')} … ${es('¡Bienvenido a la Universidad de Ciencias Económicas y Empresariales de Poznań!')}<br>Na koniec: ${es('Saludos / Un saludo / Un abrazo')} — pozdrowienia / uściski.` },
              ],
              pula: [
                LUKI('Uzupełnij tekst (jak w Reto 7).', 'Hola, me llamo Marta y [[soy]] estudiante. Mi universidad es [[bastante|muy]] grande: tiene diez [[mil]] estudiantes. El campus [[está]] en el centro de la [[ciudad]]. Sus [[edificios]] son modernos. Estudio en la Facultad de Finanzas y en el futuro [[quiero]] ser asesora financiera. [[Nuestros|Mis|Los]] profesores son responsables y trabajadores. [[Aprendo|Estudio]] mucho.', ['soy', 'bastante', 'mil', 'está', 'ciudad', 'edificios', 'quiero', 'Nuestros', 'Aprendo'], 'Zwróć uwagę: diez mil (10 000), está en el centro (znajduje się), quiero ser (chcę być), nuestros profesores (rzecz w l. mnogiej).'),
                PARY([['grande', 'pequeño'], ['antiguo', 'moderno'], ['alegre', 'triste'], ['trabajador', 'vago'], ['abierto', 'cerrado']], 'Połącz przeciwieństwa'),
                W('„Jest dość duży” to:', ['Es bastante grande.', 'Es muy grande.', 'No es muy grande.', 'Es grande bastante.'], '<b>bastante</b> = dość, stoi przed przymiotnikiem.'),
                W('Kampus znajduje się w centrum:', ['El campus está en el centro.', 'El campus es en el centro.', 'El campus tiene en el centro.', 'El campus lleva en el centro.'], 'Położenie → <b>está</b> (zwrot z zajęć).'),
                U('Ułóż: Moi koledzy z wydziału są mili i otwarci.', 'Mis compañeros de la Facultad son amables y abiertos.', 'compañeros (l. mnoga) → mis, son, abiertos.', ['Mi', 'abiertas'], { alt: ['Mis compañeros de la Facultad son abiertos y amables.'] }),
                W('Na końcu maila do kolegi piszesz:', ['Un abrazo.', 'Buenos días.', 'Le presento.', 'Mucho gusto.'], '<b>Un abrazo / Saludos</b> — pozdrowienia na koniec.'),
                P('Mi universidad no es pequeña, es …', ['grande'], `${es('pequeño ≠ grande')}. Grande ma jedną formę dla obu rodzajów.`),
                P('Los edificios no son modernos, son …', ['antiguos'], `${es('moderno ≠ antiguo')}. Edificios to rodzaj męski, liczba mnoga. Wynik: ${es('antiguos')}.`),
                ODM('aprender'),
                P('Uzupełnij: En el futuro quiero … (być) médica.', 'ser', `chcę być = ${es('quiero ser')}.`),
              ],
            },
            {
              id: 'u10l5', tytul: 'Opowiedz o sobie i swoich celach', ile: 7,
              nowe: [
                { h: 'Wzór wypowiedzi', html: `${es('Soy una persona ordenada, creativa y comunicativa.')} — jestem osobą uporządkowaną, kreatywną i komunikatywną.<br>${es('Quiero trabajar en el departamento de marketing porque me gusta la publicidad.')} — chcę pracować w dziale marketingu, bo lubię reklamę (${es('me gusta')} = lubię, ${es('la publicidad')} = reklama).<br>${es('En el futuro quiero tener un trabajo interesante y ganar mucho dinero.')} — w przyszłości chcę mieć ciekawą pracę i dużo zarabiać.<br>W grupie: ${es('En nuestro grupo somos responsables, abiertos y trabajadores.')} — w naszej grupie jesteśmy odpowiedzialni, otwarci i pracowici. ${es('Dos personas quieren trabajar en finanzas y una en recursos humanos.')} — dwie osoby chcą pracować w finansach, a jedna w dziale kadr (${es('recursos humanos')} = kadry, HR).` },
              ],
              pula: [
                U('Ułóż: Jestem osobą uporządkowaną i kreatywną.', 'Soy una persona ordenada y creativa.', 'Persona jest rodzaju żeńskiego → ordenad<b>a</b>, creativ<b>a</b>. Tak samo mówi mężczyzna.', ['ordenado', 'un'], { alt: ['Soy una persona creativa y ordenada.'] }),
                U('Ułóż: Chcę pracować w marketingu, bo lubię reklamę.', 'Quiero trabajar en marketing porque me gusta la publicidad.', 'porque = bo; me gusta = lubię.', ['por qué', 'trabajo']),
                U('Ułóż: W naszej grupie jesteśmy odpowiedzialni i pracowici.', 'En nuestro grupo somos responsables y trabajadores.', 'grupo (męski) → nuestro; somos + l. mnoga.', ['nuestra', 'son'], { alt: ['En nuestro grupo somos trabajadores y responsables.', 'Somos responsables y trabajadores en nuestro grupo.', 'Somos trabajadores y responsables en nuestro grupo.'] }),
                W('Dwie osoby chcą pracować w marketingu:', ['Dos personas quieren trabajar en marketing.', 'Dos personas quiere trabajar en marketing.', 'Dos personas queremos trabajar en marketing.', 'Dos personas quieren trabajan en marketing.'], 'Dos personas = ellas → <b>quieren</b> + bezokolicznik.'),
                W('¿En qué departamento quieres trabajar? — …', ['Quiero trabajar en recursos humanos.', 'Quiero trabajas en recursos humanos.', 'Quiere trabajar en recursos humanos.', 'Quiero trabajar a recursos humanos.'], 'quiero + bezokolicznik (trabajar). Pracować w → <b>trabajar en</b>.'),
                LUKI('Uzupełnij bez podpowiedzi. Po polsku: „W przyszłości chcę pracować w międzynarodowej firmie. Chcę mieć dobre godziny pracy i zarabiać dużo pieniędzy. Chcę pracować w dziale marketingu, bo lubię reklamę.”', 'En el futuro [[quiero]] trabajar [[en|para]] una empresa internacional. Quiero [[tener]] un buen horario y [[ganar|tener]] mucho dinero. Quiero trabajar en el departamento de marketing [[porque]] me gusta la publicidad.', [], 'Po quiero stoi bezokolicznik. Pracować w to trabajar en. „Bo” to porque, razem i bez akcentu.'),
                P('Napisz po hiszpańsku: Chcę pracować w innym kraju.', ['Quiero trabajar en otro país', 'Yo quiero trabajar en otro país', 'En el futuro quiero trabajar en otro país'], `${es('Quiero trabajar en otro país.')} Po quiero stoi bezokolicznik. Przed otro nie stawiamy „un”.`),
                PISZ('Opowiedz o swoich celach na przyszłość (cele zawodowe) w 3–4 zdaniach — to temat z kolokwium.', 'En el futuro quiero trabajar en una empresa internacional, por ejemplo en el departamento de finanzas. Quiero tener un buen horario y un jefe amable. También quiero ganar mucho dinero y trabajar en otro país.', ['quiero + bezokolicznik (min. 3 razy)', 'gdzie: en una empresa / en el departamento de…', 'co: tener, ganar, trabajar, hacer', 'porque + powód (bonus)']),
                PISZ('Opisz swój charakter (3 cechy). Napisz, w jakim dziale chcesz pracować i dlaczego.', 'Soy una persona responsable, comunicativa y trabajadora. Quiero trabajar en el departamento de recursos humanos porque me gusta trabajar con personas.', ['soy una persona + 3 cechy', 'po persona forma żeńska: comunicativa, trabajadora', 'grupa 3 bez zmian: responsable, eficaz', 'quiero trabajar en el departamento de…', 'porque…']),
              ],
            },
          ],
        },
      ],
      boss: {
        id: 'boss1', tytul: 'Escape room: kolokwium 1', pl: 'Próbne kolokwium — siedem zagadek jak na powtórce i ósma: opis osoby i kolory (też na kolokwium). Za każdą jedna litera hasła wyjścia.', haslo: 'APROBADO',
        retos: [
          { nazwa: 'Klasyfikacja', pula: [
            KAT('Reto 1 · Posortuj zawody i cechy według rodzaju.', K3, [['arquitecto', 0], ['cercano', 0], ['habilidoso', 0], ['asesor', 1], ['conciliador', 1], ['trabajador', 1], ['recepcionista', 2], ['eficaz', 2], ['distante', 2], ['inteligente', 2]], 'Grupa 1: -o/-a. Grupa 2: -or/-ora. Grupa 3: jedna forma dla obu rodzajów (zmienia się tylko liczba).'),
          ] },
          { nazwa: 'Przeciwieństwa', pula: [
            P('Reto 2 · Ana no es rubia, es …', 'morena', `Ana → kobieta: rubia ≠ ${es('morena')}.`),
            P('Reto 2 · Mis primos no son vagos, son …', 'trabajadores', `${es('trabajadores')} (-or → -ores).`),
            P('Reto 2 · Las jefas no son distantes, son …', 'cercanas', `Las jefas → żeński, l. mnoga: distantes ≠ ${es('cercanas')}.`),
            P('Reto 2 · Tú no eres gorda, eres …', 'delgada', `Tú (kobieta) → gorda ≠ ${es('delgada')}.`),
          ] },
          { nazwa: 'Cualidades', pula: [
            P('Reto 3 · Una persona que tiene ideas originales es …', 'creativa', `${es('creativa')}. Persona jest żeńska, więc -a.`),
            P('Reto 3 · Una persona que motiva a otros es …', 'motivadora', `${es('motivadora')}. Persona jest żeńska, więc -a.`),
            P('Reto 3 · Una persona que se comunica bien es …', 'comunicativa', `${es('comunicativa')}. Persona jest żeńska, więc -a.`),
          ] },
          { nazwa: 'Posesivos', pula: [
            P('Reto 4 · los empleados de Eva → … empleados', 'sus', `Eva → su. Empleados to liczba mnoga → ${es('sus')}.`),
            P('Reto 4 · las jefas de vosotros → … jefas', 'vuestras', `vosotros → vuestro. Jefas: żeński, l. mnoga → ${es('vuestras')}.`),
            P('Reto 4 · el trabajo de mí y de ti → … trabajo', 'nuestro', `Ja i ty = nosotros. Trabajo: męski, jeden → ${es('nuestro')}.`),
            P('Reto 4 · la oficina de ustedes → … oficina', 'su', `ustedes → su. Oficina jest jedna → ${es('su')}.`),
            P('Reto 4 · las clientas de mí → … clientas', 'mis', `de mí → yo → mi. Clientas to liczba mnoga → ${es('mis')}.`),
          ] },
          { nazwa: 'Verbos', pula: [
            LUKI('Reto 5 · ser, tener, querer, llevar.', 'Mis jefes [[son]] muy serios. Hoy [[es]] lunes y nosotros [[tenemos]] una reunión. Mi jefe [[lleva]] gafas y [[tiene]] los ojos negros. ¿Y vosotros, qué [[queréis]] hacer el fin de semana?', ['son', 'es', 'tenemos', 'lleva', 'tiene', 'queréis'], 'Cechy i dzień → ser; spotkanie, oczy → tener; okulary → llevar; vosotros + chcieć → queréis.'),
          ] },
          { nazwa: 'Planes', pula: [
            KAT('Reto 6 · Który czasownik?', ['ir', 'salir', 'hacer', 'ganar', 'tener', 'trabajar'], [['a la playa', 0], ['mucho dinero', [3, 4]], ['un curso de cocina', 2], ['en una empresa internacional', 5], ['de noche', [1, 5]], ['un buen horario', 4]], 'ir a la playa · ganar mucho dinero · hacer un curso · trabajar en una empresa · salir de noche · tener un buen horario. Trabajar de noche (pracować nocą) też jest dobrze.'),
          ] },
          { nazwa: 'La carta', pula: [
            LUKI('Reto 7 · Uzupełnij list.', 'Hola, soy Adam. Estudio en Poznań. Mi universidad es muy [[grande|moderna|bonita|antigua]] y tiene doce [[mil]] estudiantes. El campus [[está]] cerca del centro. En el futuro [[quiero]] ser asesor financiero. [[Nuestros|Mis|Los]] profesores son inteligentes y mis compañeros son [[simpáticos|amables|abiertos]].', ['grande', 'mil', 'está', 'quiero', 'Nuestros', 'simpáticos'], 'grande, doce mil, está (położenie), quiero ser, nuestros profesores, compañeros simpáticos (l. mnoga).'),
          ] },
          { nazwa: 'La persona', pula: [
            WIELE('Reto 8 · Popatrz na postać. Zaznacz wszystkie zdania prawdziwe.', ['Es alto.', 'Es mayor.', 'Es joven.', 'Tiene los ojos azules.', 'Lleva barba.', 'Tiene los ojos verdes.', 'Es rubio.'], [0, 2, 3, 4, 6], 'Diego: es alto, joven, gordo y rubio; tiene los ojos azules; lleva barba.', { aw: POSTACIE.diego }),
            W('Reto 8 · Kolor flagi Włoch: la bandera de Italia es verde, blanca y …', ['roja', 'rojo', 'rojas', 'azul'], 'bandera (żeńska) → <b>roja</b>.'),
          ] },
        ],
      },
    },
  ],
};

// Kamienie milowe (odznaki). Warunki liczy silnik (src/scripts/jezyki/silnik.js).
export const ODZNAKI = [
  { id: 'start', ikona: '🌱', nazwa: 'Pierwszy krok', opis: 'Ukończ pierwszą lekcję.' },
  { id: 'perfekt', ikona: '💎', nazwa: 'Bez pudła', opis: 'Ukończ lekcję bez ani jednego błędu.' },
  { id: 'combo10', ikona: '⚡', nazwa: 'Combo ×10', opis: '10 dobrych odpowiedzi z rzędu.' },
  { id: 'seria3', ikona: '🔥', nazwa: 'Trzy dni z rzędu', opis: 'Ucz się 3 dni pod rząd.' },
  { id: 'seria7', ikona: '🌋', nazwa: 'Tydzień ognia', opis: 'Ucz się 7 dni pod rząd.' },
  { id: 'xp250', ikona: '⭐', nazwa: '250 XP', opis: 'Zbierz 250 punktów doświadczenia.' },
  { id: 'xp1000', ikona: '🌟', nazwa: '1000 XP', opis: 'Zbierz 1000 punktów doświadczenia.' },
  { id: 'bledy', ikona: '🩹', nazwa: 'Naprawione błędy', opis: 'Zrób powtórkę swoich błędów.' },
  { id: 'sekcja1', ikona: '🎒', nazwa: 'Primeros pasos', opis: 'Ukończ wszystkie lekcje sekcji 1.' },
  { id: 'opis', ikona: '🧑‍🎨', nazwa: 'Portret gotowy', opis: 'Ukończ lekcję „Opisz osobę z obrazka”.' },
  { id: 'posesivos', ikona: '🔑', nazwa: 'Zaimki opanowane', opis: 'Ukończ całą jednostkę „Los posesivos”.' },
  { id: 'boss1', ikona: '🚪', nazwa: '¡Aprobado!', opis: 'Wyjdź z escape roomu z wynikiem min. 80%.' },
  { id: 'gotowy', ikona: '🎓', nazwa: 'Kolokwium w zasięgu', opis: 'Gotowość na kolokwium 1 min. 90%.' },
];
