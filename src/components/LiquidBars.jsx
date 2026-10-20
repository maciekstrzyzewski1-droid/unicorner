import { useEffect, useRef } from 'react';

/**
 * LiquidBars — animowane tlo: pionowe, faliste "plynne" pasy w naszej palecie.
 * Wlasny shader WebGL (nie kod z React Bits Pro). Wypelnia rodzica (position:fixed inset:0).
 */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uBars;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0,0.0)), c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){ float v=0.0, a=0.55; for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.03; a *= 0.5; } return v; }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime * 0.11;

  float bx  = uv.x * uBars;
  float bar = floor(bx);
  float fx  = fract(bx);
  float ph  = bar * 2.37;

  // plynny przeplyw: domain-warped fbm plynacy do gory, przesuniety per pas
  vec2 p = vec2(uv.x * 2.4, uv.y * 1.7 - t) + ph;
  float q = fbm(p + vec2(0.0, t * 0.6));
  float r = fbm(p + q * 1.25 + vec2(ph, t * 0.2));

  // rampa kolorow: gleboki granat -> fiolet -> magenta -> gorace
  vec3 c1 = vec3(0.02, 0.01, 0.06);
  vec3 c2 = vec3(0.33, 0.11, 0.78);
  vec3 c3 = vec3(0.86, 0.18, 0.78);
  vec3 c4 = vec3(1.00, 0.58, 0.98);
  vec3 col = mix(c1, c2, smoothstep(0.18, 0.55, r));
  col = mix(col, c3, smoothstep(0.52, 0.80, r));
  col = mix(col, c4, smoothstep(0.80, 0.99, r));

  // ciemne szwy miedzy pasami
  float seam = smoothstep(0.0, 0.035, fx) * smoothstep(1.0, 0.965, fx);
  col *= 0.22 + 0.78 * seam;

  gl_FragColor = vec4(col, 1.0);
}`;

export default function LiquidBars({ bars = 7 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
    if (!gl) return;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uBars = gl.getUniformLocation(prog, 'uBars');
    gl.uniform1f(uBars, bars);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);

    let raf, t0 = performance.now(), running = true;
    // pauza gdy poza ekranem (oszczedza GPU po zescrollowaniu z hero)
    const io = new IntersectionObserver((es) => { running = es[0].isIntersecting; if (running) loop(); }, { threshold: 0 });
    io.observe(canvas);

    const loop = () => {
      if (!running) return;
      resize();
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false; cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize); io.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [bars]);

  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true" />;
}
