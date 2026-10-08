/* =========================================================
   1. PRELOADER  (multi-language greetings, skip, first visit only)
   ========================================================= */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const greetingEl = document.getElementById('greeting');
  const skipBtn = document.getElementById('skip');

  // Returning visitor: the inline script in <head> already hid the preloader.
  if (document.documentElement.classList.contains('seen')) {
    preloader.remove();
    document.body.classList.remove('locked');
    document.body.classList.add('loaded');
    return;
  }

  const greetings = ['Hello', 'नमस्ते', 'Hola', 'Bonjour', 'こんにちは', 'Ciao', 'Hallo', '안녕하세요'];

  const STEP_MS = 420;     // time each greeting stays on screen
  let index = 0;
  let timer = null;
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    clearInterval(timer);

    try { localStorage.setItem('ad_seen', '1'); } catch (e) {}

    preloader.classList.add('done');                  // slides up
    document.body.classList.remove('locked');         // scrolling allowed again
    document.body.classList.add('loaded');            // hook for later animations

    setTimeout(() => preloader.remove(), 1000);       // remove once the slide-up ends
  }

  greetingEl.textContent = greetings[0];

  timer = setInterval(() => {
    index++;
    if (index >= greetings.length) { finish(); return; }
    greetingEl.textContent = greetings[index];
  }, STEP_MS);

  skipBtn.addEventListener('click', finish);
})();

/* =========================================================
   3. CURSOR GLOW + RING FOLLOWER (ring grows over navbar links)
   ========================================================= */
(function () {
  const glow = document.querySelector('.glow'), dot = document.querySelector('.dot');
  if (!glow || !dot) return;
  let x = innerWidth / 2, y = innerHeight / 2, dx = x, dy = y;

  addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    glow.style.setProperty('--gx', x + 'px');
    glow.style.setProperty('--gy', y + 'px');
    dot.style.opacity = 1;
  });

  (function f() {
    dx += (x - dx) * .18; dy += (y - dy) * .18;
    dot.style.transform = `translate(${dx}px,${dy}px)`;
    requestAnimationFrame(f);
  })();

  // navbar: the ring grows while the cursor is over a nav link or the Menu button
  document.querySelectorAll('#nav a, #nav button').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('big'));
    el.addEventListener('mouseleave', () => dot.classList.remove('big'));
  });
})();

/* =========================================================
   4. NAVBAR (show on scroll, mobile menu, active link)
   ========================================================= */
(function () {
  const nav = document.getElementById('nav');
  addEventListener('scroll', () => nav.classList.toggle('show', scrollY > innerHeight * .6), { passive: true });
  document.getElementById('menuBtn').onclick = () => nav.classList.toggle('open');
  nav.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  const links = [...nav.querySelectorAll('.menu a[href^="#"]')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(l => {
    const target = document.querySelector(l.getAttribute('href'));
    if (target) io.observe(target);
  });
})();

/* =========================================================
   5. TIMELINE dot moves with scroll
   ========================================================= */
(function () {
  const tl = document.querySelector('.tl');
  if (!tl) return;
  const upd = () => {
    const r = tl.getBoundingClientRect();
    tl.style.setProperty('--p', Math.min(1, Math.max(0, (innerHeight * .5 - r.top) / r.height)));
  };
  addEventListener('scroll', upd, { passive: true });
  upd();
})();

/* =========================================================
   6. TECH STACK: one flat grid of tall cards (edit the list below!)
      Format: ["Name", "devicon-folder/devicon-file" or null, invertOnDark?, "small line under the name"]
   ========================================================= */
(function () {
  const base = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
  const stack = [
    ["HTML",       "html5/html5-original",             false, "Structure"],
    ["CSS",        "css3/css3-original",               false, "Styling"],
    ["JavaScript", "javascript/javascript-original",   false, "Language of the web"],
    ["React",      "react/react-original",             false, "UI library"],
    ["Tailwind",   "tailwindcss/tailwindcss-original", false, "Utility-first CSS"],
    ["Node.js",    "nodejs/nodejs-original",           false, "JS runtime"],
    ["Express",    "express/express-original",         true,  "Backend framework"],
    ["MongoDB",    "mongodb/mongodb-original",         false, "Database"],
    ["WebSockets", null,                               false, "Real-time apps"],
    ["Python",     "python/python-original",           false, "Scripting"],
    ["C++",        "cplusplus/cplusplus-original",     false, "Fast & low-level"],
    ["Java",       "java/java-original",               false, "Object-oriented"],
    ["Git",        "git/git-original",                 false, "Version control"],
    ["GitHub",     "github/github-original",           true,  "Code hosting"],
    ["Postman",    "postman/postman-original",         false, "API testing"],
    ["VS Code",    "vscode/vscode-original",           false, "Code editor"]
  ];

  const mount = document.getElementById('techGroups');
  if (!mount) return;

  mount.innerHTML = stack.map(([name, icon, inv, note]) => `
    <div class="tech-card">
      <div class="tech-icon">
        ${icon
          ? `<img src="${base}/${icon}.svg" alt="" class="${inv ? 'invert' : ''}">`
          : `<span>⚡</span>`}
      </div>
      <h3>${name}</h3>
      <p>${note}</p>
    </div>`).join('');
})();

/* =========================================================
   7. PROJECTS horizontal scroll (replace dummy data with real projects)
   ========================================================= */
(function () {
 const projects = [
  {
    name: 'EcoQuest',
    desc: 'EcoQuest is a gamified web app that makes environmental learning fun for students. They complete daily eco challenges like going plastic-free for a day, take quizzes, play a waste-sorting game, earn points and badges, and compete on a class leaderboard. Challenges use layered verification (a self-declared checklist, photo proof, and planned teacher approval), so higher-trust proof earns more points. It supports light and dark themes and works on mobile. Built for Smart India Hackathon 2025.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/adityadeshwal2529/EcoQuest'
  },
  {
    name: 'HealthFit',
    desc: 'HealthFit is a health-tech web app built for HackRust 1.0 (theme: Viksit Bharat 2047). It serves three roles: donors earn Arogya Credits for donating and redeem them for OPD consultations, hospitals manage real-time blood inventory and broadcast requests, and emergency seekers find nearby blood instantly with a map and SOS button.',
    tech: ['React','Tailwind CSS', 'Leaflet.js', 'Node.js', 'Express', 'Firebase Realtime Database', 'Google Auth / OTP'],
    github: 'https://github.com/adityadeshwal2529/HealthFit'
  },
  {
    name: 'URL Shortener',
    desc: 'A URL shortener built to handle read-heavy traffic. Short codes are generated by base62-encoding a database-assigned ID, so there are no collisions and no retry logic. Redirects are served from a Redis cache with TTLs tied to link expiry, falling back to PostgreSQL on a miss. The API validates URLs, allows only http/https, and rate-limits link creation per IP.',
    tech: ['Redis', 'PostgreSQL', 'Base62', 'REST API'],
    github: 'https://github.com/adityadeshwal2529/url-shortner'
  },
  
  {
    name: 'Collab Document Editor',
    desc: 'Collab Editor is a real-time collaborative document editor, similar to a lightweight Google Docs. Multiple people can edit the same document at once, and their changes merge automatically with no overwriting, using Yjs (a CRDT) over a Node.js WebSocket server. It has rich-text formatting, live cursors with user names, one shared room per link, and documents saved on the server so they survive restarts.',
    tech: ['Node.js', 'WebSockets', 'Yjs (CRDT)'],
    github: 'https://github.com/adityadeshwal2529/collab-editor'
  }
];
  const track = document.getElementById('track'), sec = document.getElementById('projects');
  if (!track || !sec) return;

  track.innerHTML = projects.map(p => `<div class="card"><h3>${p.name}</h3><p>${p.desc}</p><div class="tech">${p.tech.map(t => `<span>${t}</span>`).join('')}</div><a href="${p.github}" target="_blank">GitHub ↗</a></div>`).join('');
  const upd = () => {
    const max = track.scrollWidth - innerWidth * .8, r = sec.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (sec.offsetHeight - innerHeight)));
    track.style.transform = `translateX(${-max * p}px)`;
  };
  addEventListener('scroll', upd, { passive: true });
  addEventListener('resize', upd);
  upd();
})();

/* =========================================================
   8. HERO NAME flies to the top-left (About) while scrolling
   ========================================================= */
(function () {
  const n = document.getElementById('hero-name'), ph = document.getElementById('aboutName');
  if (!n || !ph) return;

  function upd() {
    const vw = innerWidth, vh = innerHeight, w = n.offsetWidth, h = n.offsetHeight;
    const p = Math.min(1, scrollY / (vh * .85)), e = 1 - Math.pow(1 - p, 3);   // 0 = centre, 1 = arrived
    const r = ph.getBoundingClientRect();
    const x0 = (vw - w) / 2, y0 = (vh - h) / 2, s = 1 + (r.width / w - 1) * e;
    n.style.transform = `translate(${x0 + (r.left - x0) * e}px,${y0 + (r.top - y0) * e}px) scale(${s})`;
    n.dataset.s = s;
  }
  addEventListener('scroll', upd, { passive: true });
  addEventListener('resize', upd);
  if (document.fonts) document.fonts.ready.then(upd);
  upd();
})();

/* =========================================================
   9. BY THE NUMBERS: count-up, bars, tilt + glow
   ========================================================= */
(function () {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);

    const c = e.target, val = +c.dataset.val, dec = +(c.dataset.dec || 0), suf = c.dataset.suffix || '', num = c.querySelector('strong');
    c.querySelector('.bar b').style.width = (val / +c.dataset.max * 100) + '%';

    const t0 = performance.now();
    (function step(t) {
      const p = Math.min(1, (t - t0) / 1400), v = val * (1 - Math.pow(1 - p, 3));
      num.textContent = v.toFixed(dec) + (p === 1 ? suf : '');
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }), { threshold: .4 });

  document.querySelectorAll('.stat').forEach(c => {
    io.observe(c);
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--x', x + 'px'); c.style.setProperty('--y', y + 'px');
      c.style.transform = `perspective(700px) rotateY(${(x / r.width - .5) * 10}deg) rotateX(${-(y / r.height - .5) * 10}deg) translateY(-4px)`;
    });
    c.addEventListener('mouseleave', () => c.style.transform = '');
  });
})();

/* =========================================================
   10. CONNECT: copy email + magnetic button
   ========================================================= */
(function () {
  const b = document.getElementById('mailBtn');
  if (!b) return;
  const small = b.querySelector('small');

  b.addEventListener('click', () => {
    navigator.clipboard.writeText(b.dataset.email).then(() => {
      small.textContent = 'Copied!';
      setTimeout(() => small.textContent = 'Click to copy', 1800);
    });
  });
  b.addEventListener('mousemove', e => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
  });
  b.addEventListener('mouseleave', () => b.style.transform = '');
})();

/* =========================================================
   11. ABOUT: typing effect (types a role, pauses, backspaces, next role)
       Edit the roles list below to change / add / remove roles.
   ========================================================= */
(function () {
  const el = document.getElementById('typed');
  if (!el) return;

  const roles = ['Student', 'Web Developer', 'MERN Stack Developer', 'Problem Solver', 'AI/ML Learner', 'Software Engineer'];

  // reduced motion: no typing, just show the first role
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = roles[0]; return; }

  let r = 0, c = 0, deleting = false;
  (function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, c);

    let wait = deleting ? 40 : 85;                 // backspace is faster than typing
    if (!deleting && c === word.length) { deleting = true; wait = 1400; }                 // pause on full word
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; wait = 350; }   // next role
    else c += deleting ? -1 : 1;

    setTimeout(tick, wait);
  })();
})();

/* =========================================================
   12. ABOUT: simple rotating dotted globe (drag to spin)
   ========================================================= */
(function () {
  const cv = document.getElementById('globe');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  /* rough continent outlines as [longitude, latitude] pairs */
  const land = [
    [[-168,66],[-163,69],[-156,71.3],[-141,69.6],[-130,70],[-120,69],[-110,68],[-100,68],[-95,71],[-90,69],[-85,67],[-93,61],[-94,58.5],[-88,56.5],[-82,55],[-79,51.5],[-78,55],[-77,60],[-72,62],[-65,60],[-61,56],[-57,52],[-60,48],[-66,44],[-70,43],[-70,41.5],[-74,40],[-76,37],[-76,35],[-81,31],[-80,26],[-82,26],[-84,30],[-89,30],[-94,29.5],[-97,26],[-97,22],[-96,19],[-91,18.5],[-90,21],[-87,21],[-88,16],[-84,15.5],[-83,11],[-80,9],[-77,8.5],[-79,7.5],[-83,8.5],[-86,11],[-88,13],[-92,14.5],[-96,15.8],[-100,17],[-105,20],[-109,25],[-113,29.5],[-115,30],[-117,32.5],[-121,35],[-124,40],[-124,46],[-124,48.5],[-128,51],[-133,55],[-138,59],[-146,60.5],[-152,59],[-158,57],[-164,55],[-158,58.5],[-162,60],[-165,62.5],[-164,64.5]],
    [[-80,9],[-77,8],[-72,12],[-64,10.5],[-60,8.5],[-52,5],[-50,0],[-44,-2.5],[-35,-5],[-35,-9],[-39,-14],[-39,-18],[-41,-22],[-48,-25.5],[-49,-29],[-53,-34],[-58,-34.5],[-57,-38],[-62,-39],[-65,-42],[-65,-45],[-68,-47],[-69,-51],[-68,-54],[-72,-54],[-75,-50],[-74,-44],[-73,-38],[-71.5,-30],[-70.5,-20],[-76,-14],[-81,-5],[-80,-1],[-78,3],[-77,7.5]],
    [[-9,37],[-9,43],[-2,43.5],[-1.5,46],[-4.5,48.5],[2,51],[5,53.5],[8.5,54],[8,57],[10.5,57.5],[10.5,55],[12,54.2],[14,54],[19,54.4],[21,57],[24,57.3],[23.5,59.3],[29,60],[22,60.5],[21.5,63],[25,65.5],[22,65.7],[17.5,62.5],[19,60],[16.5,56.5],[12.5,56],[11,59],[5.5,58.5],[5,62],[10,64],[14,67.5],[20,70],[28,71],[40,67.5],[44,68.5],[53,68.5],[60,69.5],[68,69],[69,73],[80,73.5],[87,75],[100,77],[113,74],[128,73],[140,72.5],[150,71],[160,69.5],[170,70],[180,69],[180,65],[177,62.5],[165,60.5],[163,57],[156,51],[156,57],[160,61],[154,59.5],[143,59.2],[136,54.5],[141,53],[140,48],[135,43],[131,42.5],[129.5,41],[127.5,39.5],[129.3,36],[126.5,34.5],[126,37.5],[125,39.5],[121.5,39],[118,39],[119.5,37],[122.5,37],[119,34.5],[121.5,31.5],[122,29.5],[119.5,25.5],[116,22.8],[110,21.2],[108,21.5],[106.5,19],[109,15],[109,12],[105,8.6],[103,10.5],[100,13.5],[100.3,9],[103.5,1.5],[101,3],[98.5,8.5],[98.5,13],[94.5,16.5],[94,19.5],[91.5,22.5],[88,21.7],[86.5,20],[84,18],[80.2,15.5],[80,10],[77.5,8],[76,10.5],[73.5,16.5],[72.8,21],[70,21],[68,23.5],[66.5,25.5],[61.5,25.3],[57,25.7],[56,26],[56.5,24.5],[59.5,22.5],[57.5,19],[52,16.5],[45,13],[43,13],[42.7,16],[39,21.5],[35,28],[34.9,29.5],[34.3,31.2],[35,33],[36,36.5],[30,36.3],[27,37],[26.3,39.5],[26.5,40.5],[23,40],[24,37.5],[22,36.5],[21.5,38.5],[19.5,40],[19.5,42],[16,43.5],[13.7,45.6],[14,42],[16,41.5],[18.5,40.2],[16.5,38.8],[16,38],[15.7,40],[14,41],[12,42],[10.5,43],[9,44.4],[7.5,43.8],[4,43.3],[3,42],[0,40],[-0.5,38.5],[-2,36.8],[-5.5,36]],
    [[-17,21],[-16,16],[-17,14.5],[-15,11],[-13,8],[-10,6],[-7.5,4.5],[-3,5],[2,6],[4,6.4],[8,4.3],[9.5,3.5],[9,0],[12,-5],[13,-9],[12,-17],[14.5,-23],[16,-28],[18,-32],[20,-34.8],[26,-34],[31,-29.5],[33,-25.5],[35.5,-24],[35,-20],[40.5,-15],[40,-10.5],[39,-6.5],[41,-1.5],[43.5,1.5],[48,5],[51,11.5],[44,10.5],[43,12.5],[40,15.5],[37.5,18],[35.5,23],[33.5,27.5],[32.5,30],[32,31.3],[28,31],[24,32],[20,31],[15,32.2],[10.5,34],[11,37],[8,37],[0,35.7],[-5,35.8],[-9,33],[-9.8,30],[-13,27.5],[-16,23]],
    [[44,-25],[47,-25],[49.5,-16],[49,-12.2],[47,-15],[44,-17],[43.5,-22]],
    [[114,-22],[114,-26],[115,-34],[118,-35],[123,-34],[130,-32],[135,-35],[138,-35.5],[140,-38],[146,-39],[150,-37],[153,-31],[153.5,-25],[149,-20.5],[146,-19],[145.5,-15],[143.5,-14],[142.5,-10.5],[141,-17],[136,-15],[137,-12],[132,-11.5],[129,-15],[126,-14],[122,-17.5],[121,-20],[117,-20.5]],
    [[-73,78],[-60,82],[-30,83.5],[-20,80],[-18,76],[-20,70],[-25,68],[-40,65],[-43,60],[-50,63],[-53,68],[-56,72],[-68,76]],
    [[-5.5,50],[1.5,51],[1.7,53],[-0.5,55],[-2,57.5],[-4,58.5],[-6.5,58],[-5,55],[-3,54],[-4.5,53],[-5,51.5]],
    [[-10,51.5],[-6,52],[-6,54.5],[-8.5,55],[-10,54]],
    [[-24,64],[-22,63.5],[-14,64.5],[-14,66],[-22,66.4]],
    [[130,31],[132,33.5],[135,33.5],[139,34.7],[141,38],[142,40],[141.5,41.5],[140,40],[139.7,38],[136.5,37],[133,35.5],[130.5,33.8]],
    [[140,42],[142,42.5],[145,43.5],[142,45.5],[140.5,43.5]],
    [[95,5.5],[98,4],[104,-1],[106,-3.5],[104,-5.8],[101,-3],[98,0.5]],
    [[105.2,-6.5],[114.5,-7.8],[114.5,-8.7],[106,-7.5]],
    [[109,1.5],[111,2],[114,4.5],[118,5],[119,1],[117.5,-1],[116,-4],[111,-3.3],[109.5,-1]],
    [[131,-1],[135,-3.5],[138,-8],[141,-9],[143,-9],[147,-10],[150,-10.5],[146,-6],[141,-2.5],[137,-1.5]],
    [[173,-35],[175,-37],[178,-38],[175.5,-41.5],[174.5,-39.5]],
    [[172.5,-40.5],[174,-41.5],[171,-44.5],[169,-46.5],[166.5,-46],[170,-43],[171.5,-41.5]],
    [[79.8,9.5],[81.5,7.5],[81,6],[80,6],[79.8,8]],
    [[120,18.5],[122,18.3],[122,14],[124,13],[121,13.8],[120,16]],
    [[122,8],[126,9],[126.5,6.5],[124,6.3],[122,7]],
    [[-85,22],[-80,23],[-74,20],[-77.5,19.8]],
    [[-74.5,18.5],[-72,19.8],[-68.5,18.5],[-71,17.8]],
    [[-180,-72],[-120,-74],[-60,-68],[0,-70],[60,-67],[120,-66],[180,-72],[180,-90],[-180,-90]]
  ];

  function inside(lon, lat, poly) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a[1] > lat) !== (b[1] > lat) && lon < (b[0] - a[0]) * (lat - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }

  /* evenly spread points over the sphere, keep only the ones that fall on land */
  const D = Math.PI / 180, N = 5600, pts = [];
  for (let i = 0; i < N; i++) {
    const lat = Math.asin(1 - 2 * (i + 0.5) / N) / D;
    const lon = ((i * 137.50776) % 360) - 180;
    if (land.some(p => inside(lon, lat, p))) pts.push([lon * D, Math.cos(lat * D), Math.sin(lat * D)]);
  }

  let S = 300, dpr = 1;
  function fit() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    S = cv.clientWidth || 300;
    cv.width = S * dpr; cv.height = S * dpr;
  }
  fit();
  addEventListener('resize', fit);

  const tilt = 20 * D, sinT = Math.sin(tilt), cosT = Math.cos(tilt);
  let lon0 = 70 * D, dragging = false, lastX = 0, visible = true;

  cv.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; });
  cv.addEventListener('pointermove', e => { if (!dragging) return; lon0 -= (e.clientX - lastX) * 0.5 * D; lastX = e.clientX; });
  cv.addEventListener('pointerup', () => { dragging = false; cv.style.cursor = 'grab'; });

  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(cv);

  function draw() {
    const R = S * 0.43, cx = S / 2, cy = S / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, S, S);

    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(139,92,246,0.07)'; ctx.fill();
    ctx.strokeStyle = 'rgba(139,92,246,0.4)'; ctx.lineWidth = 1; ctx.stroke();

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], dl = p[0] - lon0, cl = p[1], sl = p[2];
      const z = sinT * sl + cosT * cl * Math.cos(dl);
      if (z <= 0) continue;                                   // far side of the globe
      const x = cl * Math.sin(dl), y = cosT * sl - sinT * cl * Math.cos(dl);
      ctx.fillStyle = 'rgba(196,181,253,' + (0.2 + 0.8 * z).toFixed(2) + ')';
      ctx.fillRect(cx + x * R - 1, cy - y * R - 1, 2, 2);
    }
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(); addEventListener('resize', draw); return; }

  (function loop() {
    if (visible) {
      if (!dragging) lon0 += 0.0035;                          // slow auto-rotation
      draw();
    }
    requestAnimationFrame(loop);
  })();
})();