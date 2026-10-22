// Sprawdza lib/konta.js na zadaniach z zajęć. Oczekiwane liczby przepisane ręcznie ze zdjęć tablicy (niezależnie od biblioteki).
// node narzedzia/mat-check/rachunkowosc/sprawdz-konta.mjs
import { ksieguj, typOperacji, krokiKsiegowania } from '../../../src/lib/konta.js';
let bledy = 0;
const ok = (warunek, opis) => { if (!warunek) { bledy++; console.log('BŁĄD:', opis); } else console.log('ok  ', opis); };

// Zad. 5.2, str. 64 — Kasa (Sp 1 300), druga strona jak na tablicy
const k52 = [
  { id: 'kasa', nazwa: 'Kasa', typ: 'A', sp: 1300 },
  { id: 'rb', nazwa: 'Rachunek bankowy', typ: 'A', sp: 10000 },
  { id: 'nal', nazwa: 'Pozostałe należności od pracowników', typ: 'A' },
  { id: 'zob', nazwa: 'Zobowiązania wobec dostawców', typ: 'P', sp: 1100 },
];
const o52 = [{ nr: 1, kwota: 4000, wn: 'kasa', ma: 'rb' }, { nr: 2, kwota: 2500, wn: 'nal', ma: 'kasa' }, { nr: 3, kwota: 1100, wn: 'zob', ma: 'kasa' }];
let r = ksieguj(k52, o52);
ok(r.zam.kasa.obrWn === 5300 && r.zam.kasa.obrMa === 3600, '5.2 obroty Kasy 5 300 / 3 600');
ok(r.zam.kasa.saldo === 1700 && r.zam.kasa.saldoStrona === 'wn' && r.zam.kasa.razem === 5300, '5.2 Sk Wn 1 700, sumy 5 300');
ok(['A', 'A', 'AP-'].join() === o52.map((o) => typOperacji(o, k52)).join(), '5.2 typy: AKTYWNA, AKTYWNA, AP- (jak na tablicy)');
ok(r.zam.zob.saldo === 0, '5.2 zobowiązanie za telefon spłacone do zera');

// Zad. 5.3, str. 65 — Zobowiązania (Sp 8 900); Sp rachunku 50 000 i towarów 20 000 jak na tablicy
const k53 = [
  { id: 'zob', nazwa: 'Zobowiązania z tyt. dostaw i usług', typ: 'P', sp: 8900 },
  { id: 'rb', nazwa: 'Rachunek bankowy', typ: 'A', sp: 50000 },
  { id: 'us', nazwa: 'Koszt — usługi obce', typ: 'K' },
  { id: 'tow', nazwa: 'Towary', typ: 'A', sp: 20000 },
];
const o53 = [{ nr: 1, kwota: 1700, wn: 'zob', ma: 'rb' }, { nr: 2, kwota: 2500, wn: 'us', ma: 'zob' }, { nr: 3, kwota: 1400, wn: 'zob', ma: 'tow' }];
r = ksieguj(k53, o53);
ok(r.zam.zob.obrWn === 3100 && r.zam.zob.obrMa === 11400, '5.3 obroty 3 100 / 11 400');
ok(r.zam.zob.saldo === 8300 && r.zam.zob.saldoStrona === 'ma' && r.zam.zob.razem === 11400, '5.3 Sk Ma 8 300, sumy 11 400');
ok(r.zam.rb.saldo === 48300 && r.zam.rb.razem === 50000, '5.3 rachunek: Sk Wn 48 300, sumy 50 000');
ok(r.zam.tow.saldo === 18600, '5.3 towary 20 000 − 1 400 = 18 600');
ok(['AP-', 'W', 'AP-'].join() === o53.map((o) => typOperacji(o, k53)).join(), '5.3 typy: AP-, wynikowa, AP- (jak na tablicy)');

// Konspekt „operacje bilansowe…”, przykład spółki X (bilans 1.01: 115 000). Op. 2 — przyjęte: zakup na kredyt kupiecki.
const kX = [
  { id: 'st', nazwa: 'Środki trwałe', typ: 'A', sp: 70000 },
  { id: 'mat', nazwa: 'Materiały', typ: 'A' },
  { id: 'nal', nazwa: 'Należności', typ: 'A', sp: 20000 },
  { id: 'rb', nazwa: 'Rachunek bieżący', typ: 'A', sp: 25000 },
  { id: 'kw', nazwa: 'Kapitał własny', typ: 'P', sp: 90000 },
  { id: 'kred', nazwa: 'Kredyt', typ: 'P', sp: 21000 },
  { id: 'zob', nazwa: 'Zobowiązania', typ: 'P', sp: 4000 },
];
const oX = [
  { nr: 1, kwota: 2500, wn: 'zob', ma: 'rb' }, { nr: 2, kwota: 8000, wn: 'mat', ma: 'zob' }, { nr: 3, kwota: 3000, wn: 'rb', ma: 'nal' },
  { nr: 4, kwota: 5000, wn: 'st', ma: 'zob' }, { nr: 5, kwota: 6000, wn: 'kred', ma: 'rb' },
];
r = krokiKsiegowania(kX, oX);
// niezależnie: stany po kolei
const st = { st: 70000, mat: 0, nal: 20000, rb: 25000, kw: 90000, kred: 21000, zob: 4000 };
st.zob -= 2500; st.rb -= 2500; st.mat += 8000; st.zob += 8000; st.rb += 3000; st.nal -= 3000; st.st += 5000; st.zob += 5000; st.kred -= 6000; st.rb -= 6000;
for (const id of Object.keys(st)) ok(r.zam[id].saldo === st[id], `spółka X: saldo ${id} = ${st[id]}`);
ok(r.sumaA === 119500 && r.sumaP === 119500, 'spółka X: bilans zamknięcia 119 500 = 119 500');
ok(['AP-', 'AP+', 'A', 'AP+', 'AP-'].join() === oX.map((o) => typOperacji(o, kX)).join(), 'spółka X: typy AP-, AP+, A, AP+, AP-');
ok(r.kroki.length === 1 + 5 + 7 + 1, 'spółka X: 14 kroków animacji');
console.log(bledy ? `\n${bledy} błędów` : '\nWszystko się zgadza.');
process.exit(bledy ? 1 : 0);
