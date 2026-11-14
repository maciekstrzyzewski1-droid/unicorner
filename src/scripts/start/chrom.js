// Napis z płynnego chromu na stronie głównej (hero i stopka).
// Jak to działa: tekst nagłówka jest rysowany na ukrytym płótnie 2D, z niego powstaje mapa wysokości
// (ta sama maska rozmyta czterema promieniami), a mały shader WebGL2 zamienia ją w metal, który odbija
// nocne niebo, żar horyzontu i neonową siatkę podłogi. Scroll przesuwa odbicie i rozjaśnia niebo do świtu,
// kursor wybrzusza litery i puszcza po nich kręgi.
// Bez WebGL2 (albo gdy shader się nie skompiluje) zostaje zwykły tekst z gradientem: klasa `bez-gl` na <html>.

const CZCIONKA = '"Chakra Petch"';
const WAGA = 700;
const html = document.documentElement;
const RM = html.classList.contains('rm');
const ogr = (v, a, b) => Math.min(b, Math.max(a, v));

const WIERZCH = `#version 300 es
void main(){ vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); gl_Position = vec4(p * 2. - 1., 0., 1.); }`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uMapa;   // r: maska liter, g: faza krawędzi, b: kopuła litery, a: szeroka poświata
uniform vec2 uRozm;        // rozmiar płótna w pikselach
uniform vec2 uKrok1, uKrok2; // odstęp próbek przy liczeniu nachylenia (w uv)
uniform vec4 uWiersze;     // środek i połowa wysokości wersalików: wiersz 1 (xy), wiersz 2 (zw)
uniform vec2 uMysz;        // kursor w uv płótna
uniform float uCzas, uScroll, uPred, uWejscie, uSwit, uDotyk;
out vec4 kolor;

const vec3 TUSZ = vec3(.027, .024, .059);
const vec3 FIOLET = vec3(.655, .545, .98);
const vec3 CYJAN = vec3(.153, .91, 1.);
const vec3 MAGENTA = vec3(1., .18, .592);
const vec3 ZLOTO = vec3(1., .847, .29);

float los(vec2 p){ p = fract(p * vec2(127.1, 311.7)); p += dot(p, p + 34.53); return fract(p.x * p.y); }

// tęcza marki: cyjan, fiolet, magenta, złoto
vec3 teczowka(float t){
  t = fract(t);
  vec3 c = mix(CYJAN, FIOLET, smoothstep(0., .3, t));
  c = mix(c, MAGENTA, smoothstep(.3, .6, t));
  c = mix(c, ZLOTO, smoothstep(.6, .85, t));
  return mix(c, CYJAN, smoothstep(.85, 1., t));
}

// świat, który odbija się w metalu
vec3 otoczenie(vec3 r){
  float az = atan(r.x, r.z) - uScroll * .55 + (uMysz.x - .5) * .5 * uDotyk;
  float el = asin(clamp(r.y, -1., 1.)) + .05 - uScroll * .2 + (uMysz.y - .5) * .16 * uDotyk;

  // niebo nocą: biało-różowa kreska na horyzoncie, żar magenty, jasny fiolet, wyżej coraz ciemniej
  vec3 noc = mix(vec3(1., .78, .93), MAGENTA * 1.1, smoothstep(0., .03, el));
  noc = mix(noc, vec3(.66, .4, 1.), smoothstep(.025, .13, el));
  noc = mix(noc, vec3(.24, .14, .62), smoothstep(.12, .36, el));
  noc = mix(noc, vec3(.08, .055, .24), smoothstep(.34, .8, el));
  noc = mix(noc, vec3(.045, .035, .12), smoothstep(.8, 1.3, el));
  // niebo o świcie: złoto, koral, magenta, fiolet
  vec3 swit = mix(vec3(1., .97, .82), ZLOTO, smoothstep(0., .03, el));
  swit = mix(swit, vec3(1., .52, .45), smoothstep(.02, .1, el));
  swit = mix(swit, MAGENTA * .92, smoothstep(.08, .2, el));
  swit = mix(swit, vec3(.38, .22, .78), smoothstep(.18, .42, el));
  swit = mix(swit, vec3(.08, .05, .22), smoothstep(.4, 1., el));
  vec3 niebo = mix(noc, swit, uSwit);

  // gwiazdy, gasną o świcie
  vec2 g = vec2(az, el) * 46.; vec2 id = floor(g); vec2 f = fract(g) - .5;
  niebo += step(.975, los(id)) * smoothstep(.16, 0., length(f)) * (1. - uSwit) * smoothstep(.2, .45, el) * 1.2;

  // dwie neonowe lampy po bokach: długie pasy światła, na metalu dają smugi
  float pas = smoothstep(.03, .12, el) * smoothstep(1., .35, el);
  float l1 = exp(-pow((az - .95) * 5.5, 2.)), l2 = exp(-pow((az + 1.15) * 4.5, 2.));
  niebo += (CYJAN * l1 + MAGENTA * l2) * pas * mix(1.3, .45, uSwit);

  // podłoga: siatka w perspektywie, płynie w stronę widza
  float d = max(-el, .0015);
  vec2 p = vec2(sin(az), cos(az)) / tan(d);
  p.y += uCzas * .55;
  vec2 q = p * .38;
  float rozm = .012 / (d * d + .002);   // im dalej, tym szersza plama piksela: linie zlewają się w poświatę
  vec2 odl = abs(fract(q - .5) - .5);
  vec2 ln = (1. - smoothstep(vec2(.05), vec2(.05 + rozm), odl)) / (1. + rozm * 3.);
  float siatka = max(ln.x, ln.y);
  vec3 podl = mix(vec3(.22, .09, .42), vec3(.035, .03, .09), smoothstep(0., .24, d));   // fioletowa mgła pod horyzontem, niżej ciemno
  podl = mix(podl, vec3(.1, .17, .52), smoothstep(.5, 1.3, d));                         // stromo w dół: łuna neonu z podłogi
  podl = mix(podl, mix(MAGENTA * .7, ZLOTO * .8, uSwit), exp(-d * 26.));
  podl += mix(FIOLET, CYJAN, .4) * siatka * exp(-d * 1.6) * .42;

  vec3 c = mix(podl, niebo, smoothstep(-.004, .004, el));
  c += mix(MAGENTA, ZLOTO, uSwit) * exp(-abs(el) * 90.) * .55;   // cienka gorąca linia horyzontu
  return c;
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = vec2(fc.x / uRozm.x, 1. - fc.y / uRozm.y);
  float prop = uRozm.x / uRozm.y;
  vec2 q = vec2(uv.x * prop, uv.y);
  vec2 dm = q - vec2(uMysz.x * prop, uMysz.y);
  float odl = length(dm);
  float t = uCzas, faza = uScroll * 8.;

  // powolne falowanie metalu; mocniejsze przy wejściu i przy szybkim scrollu
  float amp = .0016 + uPred * .016 + (1. - uWejscie) * .011;
  vec2 fala = vec2(sin(q.y * 8.5 + t * 1.3 + faza) + .5 * sin(q.y * 19. - t * 1.9),
                   sin(q.x * 5.5 - t * 1.05 + faza * .6) + .5 * sin(q.x * 14. + t * 1.5)) * amp;
  fala -= dm * .11 * exp(-odl * odl * 24.) * uDotyk;   // litery wybrzuszają się w stronę kursora
  vec2 s = uv + vec2(fala.x / prop, fala.y);
  vec4 M = texture(uMapa, s);

  // wejście: litery pęcznieją od lewej do prawej
  float sw = clamp(uWejscie * 1.9 - uv.x * .9, 0., 1.); sw = sw * sw * (3. - 2. * sw);
  float prog = mix(.99, .5, sw);
  float aa = fwidth(M.r) * .75 + .002;
  float A = smoothstep(prog - aa, prog + aa, M.r);
  float posw = M.a * M.a * sw;
  if (A < .003 && posw < .004) { kolor = vec4(0.); return; }

  // normalna z mapy wysokości: ostra faza przy krawędzi + łagodna kopuła całej litery
  vec2 n1 = vec2(texture(uMapa, s + vec2(uKrok1.x, 0.)).g - texture(uMapa, s - vec2(uKrok1.x, 0.)).g,
                 texture(uMapa, s + vec2(0., uKrok1.y)).g - texture(uMapa, s - vec2(0., uKrok1.y)).g);
  vec2 n2 = vec2(texture(uMapa, s + vec2(uKrok2.x, 0.)).b - texture(uMapa, s - vec2(uKrok2.x, 0.)).b,
                 texture(uMapa, s + vec2(0., uKrok2.y)).b - texture(uMapa, s - vec2(0., uKrok2.y)).b);
  vec2 nach = n1 * 7.5 + n2 * 2.9;

  // zmarszczki na powierzchni i kręgi rozchodzące się od kursora
  vec2 zm = vec2(sin(q.x * 12. + q.y * 4. - t * 1.7 - faza) + .55 * sin(q.x * 26. - q.y * 7. + t * 1.2 + faza * .5),
                 cos(q.y * 15. - q.x * 5. + t * 1.4 + faza * .4) + .5 * cos(q.y * 29. + q.x * 10. - t * 2.1));
  float sila = .045 + uPred * .45 + (1. - uWejscie) * .4;
  zm = zm * sila + dm / (odl + 1e-4) * sin(odl * 55. - t * 7.) * exp(-odl * 5.) * uDotyk * 1.5 * sila;
  vec3 N = normalize(vec3(-nach.x + zm.x, nach.y + zm.y, 1.));

  // skąd patrzymy: w pionie liczy się położenie w wierszu liter, dzięki temu horyzont przechodzi przez środek znaków
  float c0 = uWiersze.x, hh = uWiersze.y;
  if (uWiersze.w > 0. && abs(uv.y - uWiersze.z) < abs(uv.y - uWiersze.x)) { c0 = uWiersze.z; hh = uWiersze.w; }
  float ly = clamp((uv.y - c0) / hh, -1.6, 1.6);
  vec3 V = normalize(vec3((uv.x - .5) * .5, -ly * .34, -1.));
  vec3 kol = otoczenie(reflect(V, N));

  // tęczowy połysk na krawędziach, ostry błysk, cień tuż przy brzegu
  float fr = pow(1. - clamp(N.z, 0., 1.), 1.35);
  vec3 ir = teczowka(fr * 1.15 + uv.x * .3 + t * .03);
  kol = mix(kol, kol * ir * 1.5 + ir * .07, clamp(fr * .62, 0., .62));
  vec3 H = normalize(normalize(vec3(-.4, .7, .6)) + vec3(0., 0., 1.));
  kol += pow(max(dot(N, H), 0.), 140.) * vec3(1., .97, .95) * 1.3;
  kol *= mix(.38, 1., smoothstep(.5, .7, M.r));
  kol = clamp(kol, 0., 1.) + (los(fc) - .5) / 255.;

  // poświata pod literami zamiast cienia (alfa mniejsza niż kolor, więc na ciemnym tle świeci)
  vec3 kp = mix(mix(FIOLET, MAGENTA, .45), mix(MAGENTA, ZLOTO, .55), uSwit);
  kolor = vec4(kol * A + kp * posw * .5 * (1. - A), A + posw * .22 * (1. - A));
}`;

// Rozmycie pudełkowe w obie strony, powtórzone kilka razy (zbliża się do rozmycia Gaussa). Zwraca nową tablicę.
function rozmyj(zrodlo, w, h, promien, powt) {
  const r = Math.max(1, Math.round(promien)), n = 2 * r + 1;
  let a = zrodlo;
  const b = new Float32Array(w * h);
  for (let k = 0; k < powt; k++) {
    for (let y = 0; y < h; y++) {
      const o = y * w; let suma = 0;
      for (let x = -r; x <= r; x++) suma += a[o + ogr(x, 0, w - 1)];
      for (let x = 0; x < w; x++) { b[o + x] = suma / n; suma += a[o + Math.min(w - 1, x + r + 1)] - a[o + Math.max(0, x - r)]; }
    }
    const c = a === zrodlo ? new Float32Array(w * h) : a;
    for (let x = 0; x < w; x++) {
      let suma = 0;
      for (let y = -r; y <= r; y++) suma += b[ogr(y, 0, h - 1) * w + x];
      for (let y = 0; y < h; y++) { c[y * w + x] = suma / n; suma += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x]; }
    }
    a = c;
  }
  return a;
}

const plotno = document.createElement('canvas');
const p2d = plotno.getContext('2d', { willReadFrequently: true });

// Dopasuj wielkość liter tak, żeby napis zajął całą dostępną szerokość sceny.
function dopasuj(sceny) {
  for (const sc of sceny) {
    const h1 = sc.querySelector('.chrom-t');
    const wiersze = [...h1.querySelectorAll('.ct-l')];
    const cs = getComputedStyle(sc);
    const miejsce = sc.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const dwa = getComputedStyle(wiersze[0]).display === 'block';
    const odstep = parseFloat(getComputedStyle(h1).letterSpacing) / parseFloat(getComputedStyle(h1).fontSize) || 0;
    p2d.font = `${WAGA} 100px ${CZCIONKA}`;
    const szer = (s) => p2d.measureText(s).width + odstep * 100 * (s.length - 1);
    const teksty = wiersze.map((w) => w.textContent.trim());
    const najszerszy = dwa ? Math.max(...teksty.map(szer)) : szer(teksty.join(''));
    let fs = (miejsce / najszerszy) * 100 * 0.99;
    const maxH = parseFloat(sc.dataset.maxh || 0);
    if (maxH) fs = Math.min(fs, (innerHeight * maxH) / (dwa ? 1.75 : 0.9));
    h1.style.fontSize = fs.toFixed(2) + 'px';
  }
}

class Chrom {
  constructor(scena) {
    this.scena = scena;
    this.h1 = scena.querySelector('.chrom-t');
    this.cv = scena.querySelector('canvas');
    this.swit = scena.dataset.chrom === 'swit';
    const gl = (this.gl = this.cv.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false }));
    if (!gl) throw new Error('brak WebGL2');
    const shader = (typ, kod) => {
      const s = gl.createShader(typ);
      gl.shaderSource(s, kod); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
      return s;
    };
    const pr = (this.pr = gl.createProgram());
    gl.attachShader(pr, shader(gl.VERTEX_SHADER, WIERZCH));
    gl.attachShader(pr, shader(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr) || 'program');
    gl.useProgram(pr);
    this.U = {};
    for (const n of ['uMapa', 'uRozm', 'uKrok1', 'uKrok2', 'uWiersze', 'uMysz', 'uCzas', 'uScroll', 'uPred', 'uWejscie', 'uSwit', 'uDotyk']) this.U[n] = gl.getUniformLocation(pr, n);
    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(this.U.uMapa, 0);
    gl.clearColor(0, 0, 0, 0);

    this.mysz = [0.5, 0.5]; this.cel = [0.5, 0.5];
    this.dotyk = 0; this.dotykCel = 0;
    this.t0 = -1; this.widac = false; this.w = 0; this.h = 0; this.gotowy = false; this.zgubiony = false;

    // kursor: reagujemy na całą sekcję, nie tylko na płótno
    const gospodarz = scena.closest('[data-chrom-pole]') || scena;
    const ustaw = (e) => {
      const r = this.cv.getBoundingClientRect();
      this.cel = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
      this.dotykCel = 1;
    };
    gospodarz.addEventListener('pointermove', ustaw, { passive: true });
    gospodarz.addEventListener('pointerdown', ustaw, { passive: true });
    gospodarz.addEventListener('pointerleave', () => { this.dotykCel = 0; }, { passive: true });
    gospodarz.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') this.dotykCel = 0; }, { passive: true });
    gospodarz.addEventListener('pointercancel', () => { this.dotykCel = 0; }, { passive: true });

    this.cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.zgubiony = true; html.classList.remove('gl'); html.classList.add('bez-gl'); });
    new IntersectionObserver((w) => { this.widac = w[0].isIntersecting; }, { rootMargin: '80px' }).observe(scena);
    this.buduj();
  }

  // Maska liter -> mapa wysokości -> tekstura. Wołane na starcie i po zmianie rozmiaru.
  buduj() {
    const r = this.scena.getBoundingClientRect(), W = r.width, H = r.height;
    if (W < 10 || H < 10) return;
    this.w = W; this.h = H;
    const gl = this.gl;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sm = Math.min(dpr, 1.5);   // maska może być rzadsza niż płótno, i tak jest rozmywana
    this.cv.width = Math.round(W * dpr); this.cv.height = Math.round(H * dpr);
    const mw = Math.round(W * sm), mh = Math.round(H * sm);
    plotno.width = mw; plotno.height = mh;
    p2d.fillStyle = '#000'; p2d.fillRect(0, 0, mw, mh);

    const odstepCss = parseFloat(getComputedStyle(this.h1).letterSpacing) || 0;
    const wiersze = [...this.h1.querySelectorAll('.ct-l')].map((el) => {
      const b = el.getBoundingClientRect();
      return { t: el.textContent.trim(), x: (b.left - r.left) * sm, y: (b.top - r.top) * sm, h: b.height * sm, fs: parseFloat(getComputedStyle(el).fontSize) * sm };
    });
    const fs = wiersze[0].fs, odstep = odstepCss * sm;
    p2d.font = `${WAGA} ${fs}px ${CZCIONKA}`;
    p2d.textBaseline = 'alphabetic';
    const m = p2d.measureText('UNICORNER');
    const wzn = m.fontBoundingBoxAscent || fs * 0.95, opad = m.fontBoundingBoxDescent || fs * 0.25;
    const wers = m.actualBoundingBoxAscent || fs * 0.7;   // wysokość wersalików
    p2d.fillStyle = '#fff'; p2d.strokeStyle = '#fff';
    p2d.lineJoin = 'round'; p2d.lineWidth = fs * 0.03;     // lekkie pogrubienie i zaokrąglenie: litery wychodzą pulchniejsze
    const U = [0, 0, 0, 0];
    wiersze.forEach((l, i) => {
      l.baza = l.y + (l.h - (wzn + opad)) / 2 + wzn;
      for (let k = 0; k < l.t.length; k++) {
        const x = l.x + p2d.measureText(l.t.slice(0, k)).width + k * odstep;
        p2d.fillText(l.t[k], x, l.baza); p2d.strokeText(l.t[k], x, l.baza);
      }
      if (i < 2) { U[i * 2] = (l.baza - wers / 2) / mh; U[i * 2 + 1] = wers / 2 / mh; }
    });
    const dwa = wiersze.length > 1 && Math.abs(wiersze[1].y - wiersze[0].y) > fs * 0.3;
    if (!dwa) { U[2] = 0; U[3] = 0; }

    const px = p2d.getImageData(0, 0, mw, mh).data;
    const maska = new Float32Array(mw * mh);
    for (let i = 0; i < maska.length; i++) maska[i] = px[i * 4] / 255;
    const ostra = rozmyj(maska, mw, mh, fs * 0.008, 2);
    const faza = rozmyj(maska, mw, mh, fs * 0.03, 3);
    const kopula = rozmyj(maska, mw, mh, fs * 0.085, 2);
    const poswiata = rozmyj(maska, mw, mh, fs * 0.17, 2);
    const dane = new Float32Array(mw * mh * 4);
    for (let i = 0, j = 0; i < maska.length; i++, j += 4) { dane[j] = ostra[i]; dane[j + 1] = faza[i]; dane[j + 2] = kopula[i]; dane[j + 3] = poswiata[i]; }

    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, mw, mh, 0, gl.RGBA, gl.FLOAT, dane);
    const fcss = fs / sm;
    gl.useProgram(this.pr);
    gl.uniform2f(this.U.uRozm, this.cv.width, this.cv.height);
    gl.uniform2f(this.U.uKrok1, (0.009 * fcss) / W, (0.009 * fcss) / H);
    gl.uniform2f(this.U.uKrok2, (0.03 * fcss) / W, (0.03 * fcss) / H);
    gl.uniform4f(this.U.uWiersze, U[0], U[1], U[2], U[3]);
    gl.viewport(0, 0, this.cv.width, this.cv.height);
    this.gotowy = true;
  }

  // Jedna klatka. `postep` 0..1: jak daleko przewinięto sekcję; `pred` 0..1: wygładzona prędkość scrolla.
  klatka(t, postep, pred) {
    if (!this.gotowy || this.zgubiony) return;
    const gl = this.gl, U = this.U;
    if (this.t0 < 0) this.t0 = t;
    const wej = RM ? 1 : ogr((t - this.t0 - 80) / 1500, 0, 1);
    this.mysz[0] += (this.cel[0] - this.mysz[0]) * 0.08;
    this.mysz[1] += (this.cel[1] - this.mysz[1]) * 0.08;
    this.dotyk += (this.dotykCel - this.dotyk) * (this.dotykCel ? 0.06 : 0.025);
    gl.useProgram(this.pr);
    gl.uniform1f(U.uCzas, RM ? 2.5 : t / 1000);
    gl.uniform1f(U.uScroll, postep);
    gl.uniform1f(U.uPred, RM ? 0 : pred);
    gl.uniform1f(U.uWejscie, 1 - Math.pow(1 - wej, 3));
    gl.uniform1f(U.uSwit, this.swit ? 1 : postep * 0.85);
    gl.uniform1f(U.uDotyk, RM ? 0 : this.dotyk);
    gl.uniform2f(U.uMysz, this.mysz[0], this.mysz[1]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

// Uruchamia wszystkie sceny [data-chrom]. Zwraca listę instancji (pustą, gdy WebGL2 nie działa).
export async function startChrom() {
  const sceny = [...document.querySelectorAll('[data-chrom]')];
  if (!sceny.length) return { lista: [], dopasuj() {} };
  if (document.fonts && document.fonts.load) {
    await Promise.race([document.fonts.load(`${WAGA} 100px ${CZCIONKA}`, 'UNICORNER'), new Promise((r) => setTimeout(r, 2500))]).catch(() => {});
  }
  dopasuj(sceny);
  let lista = [];
  try { lista = sceny.map((s) => new Chrom(s)); }
  catch (e) {
    console.warn('Chromowy napis: wersja zastępcza (bez WebGL2).', e && e.message);
    html.classList.add('bez-gl');
    return { lista: [], dopasuj: () => dopasuj(sceny) };
  }
  html.classList.add('gl');
  return {
    lista,
    dopasuj: () => {
      dopasuj(sceny);
      for (const c of lista) { const r = c.scena.getBoundingClientRect(); if (Math.abs(r.width - c.w) > 1 || Math.abs(r.height - c.h) > 1) c.buduj(); }
    },
  };
}
