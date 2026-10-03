/* =========================================================
   BACKGROUND: drifting ring of dots (WebGL)
   The ring wanders on its own. It does NOT follow the cursor.
   ========================================================= */
(function () {
  const canvas = document.getElementById('bg');
  if (!canvas) return;

  /* ---- settings you can change ---- */
  const COLORS  = ['#f4f3f7', '#fefeff', '#f9f9fa']; // light -> mid -> dark (max 5)
  const SPEED   = 15;      // bigger = ring moves/animates faster (try 12 or 20)
  const DOT     = 1.2;    // dot size
  const RADIUS  = 0.25;   // ring size
  const TURB    = 1.0;    // how wobbly the dots are

  const gl = canvas.getContext('webgl', {
    alpha: true, antialias: false, premultipliedAlpha: false, depth: false
  });
  if (!gl) return;

  const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
    + i.y+vec4(0.0,i1.y,i2.y,1.0))
    + i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

  const FIELD = `
void fieldTerms(vec2 ref, vec2 ringPos, float time, float ringRadius, float w1, float w2, float turb,
                out vec2 disp, out float bandT, out float bandHot){
  float dist = distance(ref, ringPos);
  float n0 = snoise(vec3(ref * 0.2 + vec2(18.4924, 72.9744), time * 0.5));
  float dist1 = distance(ref + (n0 * 0.005), ringPos);
  float t  = smoothstep(ringRadius - (w1 * 2.0), ringRadius, dist) - smoothstep(ringRadius, ringRadius + w1, dist1);
  float t2 = smoothstep(ringRadius - (w2 * 2.0), ringRadius, dist) - smoothstep(ringRadius, ringRadius + w2, dist1);
  float t3 = smoothstep(ringRadius + w2, ringRadius, dist);
  t  = pow(max(t, 0.0), 2.0);
  t2 = pow(max(t2, 0.0), 3.0);
  t += t2 * 3.0;
  t += t3 * 0.4;
  t += snoise(vec3(ref * 30.0 + vec2(11.4924, 12.9744), time * 0.5)) * t3 * 0.5;
  float nS = snoise(vec3(ref * 2.0 + vec2(18.4924, 72.9744), time * 0.5));
  t += pow((nS + 1.5) * 0.5, 2.0) * 0.6;
  float n1 = snoise(vec3(ref * 4.0 + vec2(88.494, 32.4397), time * 0.35));
  float n2 = snoise(vec3(ref * 4.0 + vec2(50.904, 120.947), time * 0.35));
  float n3 = snoise(vec3(ref * 20.0 + vec2(18.4924, 72.9744), time * 0.5));
  float n4 = snoise(vec3(ref * 20.0 + vec2(50.904, 120.947), time * 0.5));
  vec2 d = vec2(n1, n2) * 0.03 + vec2(n3, n4) * 0.005;
  d.x += sin((ref.x * 20.0) + (time * 4.0)) * 0.02 * clamp(dist, 0.0, 1.0);
  d.y += cos((ref.y * 20.0) + (time * 3.0)) * 0.02 * clamp(dist, 0.0, 1.0);
  disp = d * turb;
  bandT = t;
  bandHot = t2;
}`;

  const VERT = `
precision highp float;
attribute vec2 aRef;
uniform float uProjF, uAspect, uCamDist, uPointScale, uRingRadius, uRingWidth, uRingWidth2, uTurb, uTime;
uniform vec2 uRingPos;
varying vec2 vLocalPos;
varying float vScale;
varying float vEnergy;
${NOISE}
${FIELD}
void main(){
  vec2 disp; float t; float t2;
  fieldTerms(aRef, uRingPos, uTime * 0.5, uRingRadius, uRingWidth, uRingWidth2, uTurb, disp, t, t2);
  vec4 state = vec4(aRef + disp, t, t * 0.5);
  vLocalPos = state.xy;
  vScale = state.z;
  vEnergy = state.w;
  vec2 world = state.xy * 5.0;
  gl_Position = vec4(world.x * uProjF / uAspect, world.y * uProjF, 0.0, uCamDist);
  gl_PointSize = max(vScale, 0.0) * 7.0 * uPointScale;
}`;

  const FRAG = `
precision highp float;
varying vec2 vLocalPos;
varying float vScale;
varying float vEnergy;
uniform vec3 uColors[5];
uniform int uColorCount;
uniform vec2 uRingPos;
uniform float uTime;
${NOISE}
float sdRoundBox(in vec2 p, in vec2 b, in float r){
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}
vec2 rotate(vec2 v, float a){
  float s = sin(a);
  float c = cos(a);
  return mat2(c, s, -s, c) * v;
}
void main(){
  float noiseAngle = snoise(vec3(vLocalPos * 10.0 + vec2(18.4924, 72.9744), uTime * 0.85));
  float noiseColor = snoise(vec3(vLocalPos * 2.0 + vec2(74.664, 91.556), uTime * 0.5));
  noiseColor = (noiseColor + 1.0) * 0.5;
  float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);
  vec2 uv = gl_PointCoord.xy - vec2(0.5);
  uv.y *= -1.0;
  uv = rotate(uv, -angle + (noiseAngle * 0.5));
  float p = smoothstep(0.0, 0.75, pow(noiseColor, 2.0));
  vec3 color = uColors[0];
  for (int i = 0; i < 4; i++) {
    if (i < uColorCount - 1) {
      float span = 1.0 / float(uColorCount - 1);
      float t = clamp((p - float(i) * span) / span, 0.0, 1.0);
      color = mix(color, uColors[i + 1], t);
    }
  }
  float d = sdRoundBox(uv, vec2(0.5, 0.2), 0.25);
  float mask = smoothstep(0.1, 0.0, d);
  float a = mask * smoothstep(0.1, 0.2, vScale);
  if (a < 0.01) discard;
  color = clamp(color, 0.0, 1.0);
  color *= clamp(vEnergy, 0.0, 1.0);
  gl_FragColor = vec4(color, clamp(a, 0.0, 1.0));
}`;

  /* ---- compile ---- */
  function shader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) {
    console.warn('Background effect disabled:', e.message);
    return;
  }
  gl.useProgram(prog);

  /* ---- points: a jittered grid covering the visible middle of the field ---- */
  const GX = 110, GY = 40, RX = 0.42, RY = 0.15;
  const pts = new Float32Array(GX * GY * 2);
  let n = 0;
  for (let j = 0; j < GY; j++) {
    for (let i = 0; i < GX; i++) {
      pts[n++] = ((i + 0.5 + (Math.random() - 0.5) * 0.9) / GX * 2 - 1) * RX;
      pts[n++] = ((j + 0.5 + (Math.random() - 0.5) * 0.9) / GY * 2 - 1) * RY;
    }
  }
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, pts, gl.STATIC_DRAW);
  const aRef = gl.getAttribLocation(prog, 'aRef');
  gl.enableVertexAttribArray(aRef);
  gl.vertexAttribPointer(aRef, 2, gl.FLOAT, false, 0, 0);

  /* ---- colours ---- */
  function hex(h) {
    h = h.replace('#', '');
    const v = parseInt(h, 16);
    return [(v >> 16 & 255) / 255, (v >> 8 & 255) / 255, (v & 255) / 255];
  }
  const flat = new Float32Array(15);
  for (let i = 0; i < 5; i++) flat.set(hex(COLORS[Math.min(i, COLORS.length - 1)]), i * 3);

  const U = {};
  ['uProjF', 'uAspect', 'uCamDist', 'uPointScale', 'uRingRadius', 'uRingWidth', 'uRingWidth2',
   'uTurb', 'uTime', 'uRingPos', 'uColors[0]', 'uColorCount'].forEach(k => U[k] = gl.getUniformLocation(prog, k));

  gl.uniform3fv(U['uColors[0]'], flat);
  gl.uniform1i(U.uColorCount, Math.min(COLORS.length, 5));
  gl.uniform1f(U.uCamDist, 1.6);
  gl.uniform1f(U.uRingWidth, 0.09);
  gl.uniform1f(U.uRingWidth2, 0.04);
  gl.uniform1f(U.uTurb, TURB);
  gl.uniform1f(U.uProjF, 1 / Math.tan((40 * Math.PI / 180) / 2));

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  /* ---- size ---- */
  let dpr = 1, W = 1, H = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(canvas.clientWidth, 1);
    H = Math.max(canvas.clientHeight, 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }
  resize();
  addEventListener('resize', resize);

  /* ---- random drifting (smooth value noise, no mouse) ---- */
  function vn(x, seed) {
    const i = Math.floor(x), f = x - i;
    const h = k => { const s = Math.sin((k + seed) * 127.1) * 43758.5453; return s - Math.floor(s); };
    const u = f * f * (3 - 2 * f);
    return h(i) * (1 - u) + h(i + 1) * u;
  }

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = 0, simTime = 0, wander = 0, rx = 0, ry = 0;

  function frame(now) {
    if (!still) requestAnimationFrame(frame);

    const dt = Math.min(last ? (now - last) / 1000 : 1 / 60, 1 / 20);
    last = now;
    simTime = (simTime + dt * SPEED / 50) % 3600;
    wander += dt * SPEED / 50;

    const tx = (vn(wander * 0.66, 94.234) - 0.5) * 2 * 0.2;
    const ty = (vn(wander * 0.75, 21.028) - 0.5) * 2 * 0.1;
    const k = 1 - Math.pow(1 - 0.01, dt * 60);
    rx += (tx - rx) * k;
    ry += (ty - ry) * k;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(U.uAspect, Math.max(W / H, 0.0001));
    gl.uniform1f(U.uPointScale, (W / 2000) * DOT * dpr * 0.5);
    gl.uniform1f(U.uRingRadius, RADIUS + Math.sin(simTime) * 0.03 + Math.cos(simTime * 3) * 0.02);
    gl.uniform2f(U.uRingPos, rx, ry);
    gl.uniform1f(U.uTime, simTime);

    gl.drawArrays(gl.POINTS, 0, GX * GY);
  }
  requestAnimationFrame(frame);
})();