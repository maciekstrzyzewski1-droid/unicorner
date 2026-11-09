// Słowniczek kursu „Metody badań rynku”. Każdy nowy moduł dopisuje tu swoje pozycje (pole `modul` = slug modułu).
// Bez pola t — słowniczek pojęć (kolumna symbolu znika sama).

export const SLOWNICZEK = [
  // --- Skale pomiarowe i kafeteria ---
  { nazwa: 'Kwestionariusz', znaczy: 'Lista pytań, na które odpowiada respondent. W ankiecie internetowej wypełnia ją sam, w wywiadzie czyta ją ankieter.', modul: 'skale' },
  { nazwa: 'Respondent', znaczy: 'Osoba, która odpowiada na pytania w badaniu.', modul: 'skale' },
  { nazwa: 'Kafeteria', znaczy: 'Zestaw gotowych odpowiedzi pod pytaniem, z których respondent wybiera. Nazwa jak „bufet”: wybierasz z tego, co podano.', modul: 'skale' },
  { nazwa: 'Kafeteria rozłączna', znaczy: 'Żadne dwie odpowiedzi nie pokrywają się. Każdy respondent pasuje tylko do jednej.', modul: 'skale' },
  { nazwa: 'Kafeteria wyczerpująca', znaczy: 'Każdy respondent znajdzie odpowiedź dla siebie. Pomagają „inne, jakie?” i „nie korzystam”.', modul: 'skale' },
  { nazwa: 'Kafeteria równomierna', znaczy: 'Żadna odpowiedź nie ściąga do siebie zdecydowanej większości. Przy ocenach: tyle samo stopni na plus i na minus.', modul: 'skale' },
  { nazwa: 'Kafeteria adekwatna', znaczy: 'Wszystkie odpowiedzi odpowiadają na to pytanie, które zadano, a nie na inne.', modul: 'skale' },
  { nazwa: 'Skala nominalna', znaczy: 'Odpowiedzi to same nazwy kategorii, bez kolejności (tak/nie, PIN/odcisk palca). Można tylko policzyć, ile osób jest w każdej.', modul: 'skale' },
  { nazwa: 'Skala porządkowa', znaczy: 'Odpowiedzi da się ułożyć od najmniejszej do największej (rzadko → często, ocena 1–10), ale nie wiemy, o ile jedna jest większa od drugiej.', modul: 'skale' },
  { nazwa: 'Skala stosunkowa (ilorazowa)', znaczy: 'Odpowiedź to liczba z prawdziwym zerem (liczba banków, wiek, wydatki). Można powiedzieć „dwa razy więcej”.', modul: 'skale' },
  { nazwa: 'Skala rang', znaczy: 'Respondent układa kilka rzeczy w kolejności ważności, np. wpisuje kody do kratek: pierwsza kratka = najważniejsze.', modul: 'skale' },
  { nazwa: 'Porównawcza skala sumowanych cech', znaczy: 'Respondent dzieli punkty (zwykle 10 albo 100) między dwa obiekty z pary, np. dwa soki.', modul: 'skale' },
  { nazwa: 'Rangowa skala sumowanych ocen', znaczy: 'Respondent dzieli pulę punktów (np. 100) między kilka czynników. Najwięcej dostaje najważniejszy.', modul: 'skale' },
  { nazwa: 'Skala semantyczna', znaczy: 'Para przeciwnych określeń (uprzejmi — nieuprzejmi), a między nimi kratki. Respondent zaznacza, bliżej którego końca jest jego opinia.', modul: 'skale' },
  { nazwa: 'Skala pozycyjna', znaczy: 'Lista cech lub rzeczy (część nominalna), a przy każdej ta sama skala porządkowa, np. bardzo często … w ogóle.', modul: 'skale' },
  { nazwa: 'Skala Likerta', znaczy: 'Lista stwierdzeń i przy każdym stopień zgody, zwykle od 1 „całkowicie nie zgadzam się” do 5 „całkowicie zgadzam się”.', modul: 'skale' },
  { nazwa: 'Skala Stapela', znaczy: 'Jedno określenie (np. „szybka”) i skala liczb od minusa do plusa bez zera. Respondent ocenia, jak bardzo określenie pasuje.', modul: 'skale' },
  { nazwa: 'Skala Thurstone’a', znaczy: 'Lista stwierdzeń, którym eksperci wcześniej nadali wartości. Respondent zaznacza te, z którymi się zgadza; wynik to przeciętna z ich wartości.', modul: 'skale' },
  { nazwa: 'Pytanie podwójne (wielowątkowe)', znaczy: 'Jedno pytanie lub stwierdzenie o dwóch rzeczach naraz („szybka i wiarygodna”). Nie wiadomo, do której odnosi się odpowiedź.', modul: 'skale' },
  { nazwa: 'Pytanie sugerujące', znaczy: 'Pytanie, które podpowiada „właściwą” odpowiedź, np. powołuje się na ekspertów albo większość.', modul: 'skale' },
  { nazwa: 'Pytanie filtrujące', znaczy: 'Pytanie, które odsyła dalej tylko część osób, np. „Czy korzystasz z…?” — kto nie korzysta, pomija pytania o korzystanie.', modul: 'skale' },
];
