// Neonowy napis UNICORNER w hero (wariant „Siatka”).
// Tekst nagłówka jest rysowany na ukrytym płótnie 2D, z niego powstaje mapa wysokości (ta sama maska rozmyta
// czterema promieniami), a shader WebGL2 robi z niej wypukłe, błyszczące litery w fiolecie napisu ze stopki:
// kursor jest punktowym światłem (refleks sunie po literach), co kilka sekund przechodzi po nich pasmo światła,
// przy starcie litery migają jak zapalany neon, a szybki scroll rwie je w poziome paski.
// Bez WebGL2 zostaje zwykły tekst ze świecącym cieniem: klasa `bez-gl` na <html>.

const CZCIONKA = '"Chakra Petch"';
const WAGA = 700;
const html = document.documentElement;
const RM = html.classList.contains('rm');
const ogr = (v, a, b) => Math.min(b, Math.max(a, v));

const WIERZCH = `#version 300 es
void main(){ vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); gl_Position = vec4(p * 2. - 1., 0., 1.); }`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uMapa;     // r: maska liter, g: faza krawędzi, b: kopuła litery, a: szeroka poświata
uniform vec2 uRozm;          // rozmiar płótna w pikselach
uniform vec2 uKrok1, uKrok2; // odstęp próbek przy liczeniu nachylenia (w uv)
uniform vec2 uWiersz;        // środek i połowa wysokości wersalików (w uv)
uniform vec2 uMysz;          // kursor w uv płótna
uniform float uCzas, uPred, uWejscie, uDotyk;
out vec4 kolor;

const vec3 FIOLET = vec3(.741, .545, 1.);    // #bd8bff
const vec3 NEON = vec3(.659, .333, .969);    // #a855f7
const vec3 GLEBIA = vec3(.33, .13, .74);
const vec3 LAWENDA = vec3(.93, .87, 1.);

float los(vec2 p){ p = fract(p * vec2(127.1, 311.7)); p += dot(p, p + 34.53); return fract(p.x * p.y); }

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = vec2(fc.x / uRozm.x, 1. - fc.y / uRozm.y);
  float prop = uRozm.x / uRozm.y;
  vec2 q = vec2(uv.x * prop, uv.y);
  float t = uCzas;

  // glitch: poziome paski przesuwają się na boki przy zapalaniu i przy szybkim scrollu
  float pas = floor(uv.y * 24.);
  float trzask = step(.8, los(vec2(pas, floor(t * 16.)))) * clamp(uPred * 1.1 + (1. - uWejscie) * .9, 0., 1.);
  vec2 s = uv + vec2((los(vec2(pas, floor(t * 16.) + 7.)) - .5) * .05 * trzask, 0.);
  vec4 M = texture(uMapa, s);

  float aa = fwidth(M.r) * .75 + .002;
  float A = smoothstep(.5 - aa, .5 + aa, M.r);
  float halo = M.a * M.a;
  if (A < .003 && halo < .003) { kolor = vec4(0.); return; }

  // zapalanie: każda litera miga we własnym rytmie, aż się ustabilizuje
  float kol8 = floor(uv.x * 9.);
  float miga = step(los(vec2(kol8, floor(t * 22.))), uWejscie * 1.35 - .12 * los(vec2(kol8, 2.)));
  float moc = mix(.12, 1., max(miga, step(.999, uWejscie)));

  // normalna z mapy wysokości: ostra faza przy krawędzi + łagodna kopuła litery
  vec2 n1 = vec2(texture(uMapa, s + vec2(uKrok1.x, 0.)).g - texture(uMapa, s - vec2(uKrok1.x, 0.)).g,
                 texture(uMapa, s + vec2(0., uKrok1.y)).g - texture(uMapa, s - vec2(0., uKrok1.y)).g);
  vec2 n2 = vec2(texture(uMapa, s + vec2(uKrok2.x, 0.)).b - texture(uMapa, s - vec2(uKrok2.x, 0.)).b,
                 texture(uMapa, s + vec2(0., uKrok2.y)).b - texture(uMapa, s - vec2(0., uKrok2.y)).b);
  vec3 N = normalize(vec3(-(n1.x * 7. + n2.x * 2.6), n1.y * 7. + n2.y * 2.6, 1.));

  // kolor litery: fiolet napisu, jaśniejszy tam, gdzie powierzchnia patrzy w górę
  float ly = clamp((uv.y - uWiersz.x) / uWiersz.y, -1.4, 1.4);
  vec3 kol = mix(GLEBIA * .72, FIOLET, smoothstep(-.95, .55, N.y * 1.8 - ly * .5));
  kol = mix(kol, LAWENDA, smoothstep(.45, 1., N.y) * .55);

  // światło kursora: punkt nad literami; refleks i rozjaśnienie suną za myszą
  vec3 P = vec3(q, 0.);
  vec3 Lp = vec3(uMysz.x * prop, uMysz.y, .22);
  vec3 L = normalize(Lp - P);
  float odl = length(Lp.xy - P.xy);
  float zasieg = exp(-odl * odl * 5.5) * uDotyk;
  vec3 H = normalize(L + vec3(0., 0., 1.));
  kol += FIOLET * max(dot(N, L), 0.) * zasieg * .55;
  kol += LAWENDA * pow(max(dot(N, H), 0.), 48.) * zasieg * 1.5;

  // stałe światło z góry i pasmo, które co kilka sekund przechodzi po napisie
  vec3 Hg = normalize(normalize(vec3(-.35, .75, .55)) + vec3(0., 0., 1.));
  kol += LAWENDA * pow(max(dot(N, Hg), 0.), 150.) * .8;
  float pasmo = exp(-pow((uv.x * 1.25 - uv.y * .3 - fract(t * .09) * 2.6 + .7) * 6., 2.));
  kol += LAWENDA * pasmo * .34 * smoothstep(.55, 1., N.z);

  // rozżarzona krawędź, delikatne linie skanowania
  float fr = pow(1. - clamp(N.z, 0., 1.), 1.6);
  kol = mix(kol, vec3(1., .95, 1.), fr * .5);
  kol *= .94 + .06 * sin(fc.y * 1.7 + t * 2.4);
  kol *= mix(.55, 1., smoothstep(.5, .66, M.r)) * moc;
  kol = clamp(kol, 0., 1.) + (los(fc) - .5) / 255.;

  // poświata wokół liter (alfa mniejsza niż kolor: na ciemnym tle świeci jak neon)
  float pos = halo * moc;
  kolor = vec4(kol * A + NEON * pos * .95 * (1. - A), A + pos * .22 * (1. - A));
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

// Wielkość liter tak, żeby napis zajął całą dostępną szerokość sceny (z limitem wysokości z data-maxh).
function dopasuj(scena) {
  const h1 = scena.querySelector('.napis-t');
  const cs = getComputedStyle(scena);
  const miejsce = scena.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const odstep = parseFloat(getComputedStyle(h1).letterSpacing) / parseFloat(getComputedStyle(h1).fontSize) || 0;
  const tekst = h1.textContent.trim();
  p2d.font = `${WAGA} 100px ${CZCIONKA}`;
  const szer = p2d.measureText(tekst).width + odstep * 100 * (tekst.length - 1);
  let fs = (miejsce / szer) * 100 * 0.99;
  const maxH = parseFloat(scena.dataset.maxh || 0);
  if (maxH) fs = Math.min(fs, (innerHeight * maxH) / 0.9);
  h1.style.fontSize = fs.toFixed(2) + 'px';
}

class Napis {
  constructor(scena) {
    this.scena = scena;
    this.h1 = scena.querySelector('.napis-t');
    this.cv = scena.querySelector('canvas');
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
    for (const n of ['uMapa', 'uRozm', 'uKrok1', 'uKrok2', 'uWiersz', 'uMysz', 'uCzas', 'uPred', 'uWejscie', 'uDotyk']) this.U[n] = gl.getUniformLocation(pr, n);
    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(this.U.uMapa, 0);
    gl.clearColor(0, 0, 0, 0);
    this.mysz = [0.5, -0.6]; this.cel = [0.5, -0.6];
    this.dotyk = 0; this.dotykCel = 0;
    this.t0 = -1; this.w = 0; this.h = 0; this.gotowy = false; this.zgubiony = false; this.co2 = false;
    this.cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.zgubiony = true; html.classList.remove('gl'); html.classList.add('bez-gl'); });
    this.buduj();
  }

  // Kursor w oknie -> współrzędne płótna (silnik woła to z jednego wspólnego nasłuchu pointermove).
  // `r` to prostokąt płótna zmierzony bez transformacji dokowania.
  kursor(x, y, r, aktywny) {
    if (aktywny) { this.cel = [(x - r.left) / r.width, (y - r.top) / r.height]; this.dotykCel = 1; }
    else this.dotykCel = 0;
  }

  // Maska liter -> mapa wysokości -> tekstura. Wołane na starcie i po zmianie rozmiaru.
  buduj() {
    const W = this.scena.offsetWidth, H = this.scena.offsetHeight;
    if (W < 10 || H < 10) return;
    this.w = W; this.h = H;
    const gl = this.gl;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sm = Math.min(dpr, 1.5);   // maska może być rzadsza niż płótno, i tak jest rozmywana
    this.cv.width = Math.round(W * dpr); this.cv.height = Math.round(H * dpr);
    const mw = Math.round(W * sm), mh = Math.round(H * sm);
    plotno.width = mw; plotno.height = mh;
    p2d.fillStyle = '#000'; p2d.fillRect(0, 0, mw, mh);

    const cs = getComputedStyle(this.h1);
    const fs = parseFloat(cs.fontSize) * sm, odstep = (parseFloat(cs.letterSpacing) || 0) * sm;
    const tekst = this.h1.textContent.trim();
    // położenie tekstu wewnątrz sceny liczymy z układu (offset*), więc transformacja dokowania nie przeszkadza
    p2d.font = `${WAGA} ${fs}px ${CZCIONKA}`;
    p2d.textBaseline = 'alphabetic';
    const m = p2d.measureText(tekst);
    const szerTekstu = m.width + odstep * (tekst.length - 1);
    const x0 = this.h1.offsetLeft * sm + (this.h1.offsetWidth * sm - szerTekstu) / 2;
    const wzn = m.fontBoundingBoxAscent || fs * 0.95, opad = m.fontBoundingBoxDescent || fs * 0.25;
    const wers = m.actualBoundingBoxAscent || fs * 0.7;
    const baza = this.h1.offsetTop * sm + (this.h1.offsetHeight * sm - (wzn + opad)) / 2 + wzn;
    p2d.fillStyle = '#fff'; p2d.strokeStyle = '#fff'; p2d.lineJoin = 'round'; p2d.lineWidth = fs * 0.022;
    for (let k = 0; k < tekst.length; k++) {
      const x = x0 + p2d.measureText(tekst.slice(0, k)).width + k * odstep;
      p2d.fillText(tekst[k], x, baza); p2d.strokeText(tekst[k], x, baza);
    }
    const px = p2d.getImageData(0, 0, mw, mh).data;
    const maska = new Float32Array(mw * mh);
    for (let i = 0; i < maska.length; i++) maska[i] = px[i * 4] / 255;
    const ostra = rozmyj(maska, mw, mh, fs * 0.008, 2);
    const faza = rozmyj(maska, mw, mh, fs * 0.028, 3);
    const kopula = rozmyj(maska, mw, mh, fs * 0.08, 2);
    const poswiata = rozmyj(maska, mw, mh, fs * 0.19, 2);
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
    gl.uniform2f(this.U.uWiersz, (baza - wers / 2) / mh, wers / 2 / mh);
    gl.viewport(0, 0, this.cv.width, this.cv.height);
    this.gotowy = true;
  }

  // Jedna klatka. `pred` 0..1: wygładzona prędkość scrolla.
  klatka(t, pred) {
    if (!this.gotowy || this.zgubiony) return;
    const gl = this.gl, U = this.U;
    if (this.t0 < 0) this.t0 = t;
    const wej = RM ? 1 : ogr((t - this.t0 - 150) / 1300, 0, 1);
    // w bezruchu (po zapaleniu, bez scrolla i kursora) rysujemy co drugą klatkę: ruch jest powolny, a telefon mniej się grzeje
    this.co2 = !this.co2;
    if (!RM && wej >= 1 && pred < 0.02 && this.dotyk < 0.02 && !this.dotykCel && this.co2) return;
    this.mysz[0] += (this.cel[0] - this.mysz[0]) * 0.12;
    this.mysz[1] += (this.cel[1] - this.mysz[1]) * 0.12;
    this.dotyk += (this.dotykCel - this.dotyk) * (this.dotykCel ? 0.08 : 0.03);
    gl.useProgram(this.pr);
    gl.uniform1f(U.uCzas, RM ? 3.1 : t / 1000);
    gl.uniform1f(U.uPred, RM ? 0 : pred);
    gl.uniform1f(U.uWejscie, wej);
    gl.uniform1f(U.uDotyk, RM ? 0 : this.dotyk);
    gl.uniform2f(U.uMysz, this.mysz[0], this.mysz[1]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

// Uruchamia napis w scenie [data-napis]. Zwraca { napis, dopasuj } (napis = null, gdy WebGL2 nie działa).
export async function startNapis() {
  const scena = document.querySelector('[data-napis]');
  if (!scena) return { napis: null, dopasuj() {} };
  if (document.fonts && document.fonts.load) {
    await Promise.race([document.fonts.load(`${WAGA} 100px ${CZCIONKA}`, 'UNICORNER'), new Promise((r) => setTimeout(r, 2500))]).catch(() => {});
  }
  dopasuj(scena);
  let napis = null;
  try { napis = new Napis(scena); }
  catch (e) {
    console.warn('Neonowy napis: wersja zastępcza (bez WebGL2).', e && e.message);
    html.classList.add('bez-gl');
    return { napis: null, dopasuj: () => dopasuj(scena) };
  }
  // rozgrzewka: pierwsze rysowanie kompiluje shader, więc robimy je od razu
  napis.klatka(performance.now(), 0); napis.t0 = -1;
  html.classList.add('gl');
  return {
    napis,
    dopasuj: () => { dopasuj(scena); if (Math.abs(scena.offsetWidth - napis.w) > 1 || Math.abs(scena.offsetHeight - napis.h) > 1) napis.buduj(); },
  };
}
