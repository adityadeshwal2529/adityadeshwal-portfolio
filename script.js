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

  const greetings = [
    'Hello',
    'नमस्ते',
    'Hola',
    'Bonjour',
    'こんにちは',
    'Ciao',
    'Hallo',
    '안녕하세요'
  ];

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

    // remove from DOM once the slide-up ends
    setTimeout(() => preloader.remove(), 1000);
  }

  greetingEl.textContent = greetings[0];

  timer = setInterval(() => {
    index++;
    if (index >= greetings.length) {
      finish();
      return;
    }
    greetingEl.textContent = greetings[index];
  }, STEP_MS);

  skipBtn.addEventListener('click', finish);
})();

/* =========================================================
   2. HERO: text fades near the cursor
   ========================================================= */
(function initHeroHover() {
  const name = document.getElementById('hero-name');
  if (!name) return;

  // only for devices with a real mouse (phones/tablets skip this)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let targetX = -9999, targetY = -9999;   // where the mouse is
  let currentX = -9999, currentY = -9999; // where the effect is (follows smoothly)
  let running = false;

  function loop() {
    // ease towards the mouse so the movement feels soft
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;

    name.style.setProperty('--mx', currentX + 'px');
    name.style.setProperty('--my', currentY + 'px');

    const stillMoving =
      Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5;

    if (stillMoving) requestAnimationFrame(loop);
    else running = false;
  }

  function start() {
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  window.addEventListener('mousemove', (e) => {
    const rect = name.getBoundingClientRect();
    const sc = parseFloat(name.dataset.s) || 1;      // name is scaled while it flies up
    const x = (e.clientX - rect.left) / sc;
    const y = (e.clientY - rect.top) / sc;

    // first move: jump straight to the cursor instead of flying in from far away
    if (currentX < -5000) { currentX = x; currentY = y; }

    targetX = x;
    targetY = y;
    start();
  });

  // cursor leaves the window: effect disappears
  document.addEventListener('mouseleave', () => {
    targetX = currentX = -9999;
    targetY = currentY = -9999;
    name.style.setProperty('--mx', '-9999px');
    name.style.setProperty('--my', '-9999px');
  });
})();

/* NEXT SECTION SCRIPTS GO BELOW THIS LINE */

/* =========================================================
   3. CURSOR GLOW + FOLLOWER
   ========================================================= */
(function(){
  const glow=document.querySelector('.glow'),dot=document.querySelector('.dot');
  let x=innerWidth/2,y=innerHeight/2,dx=x,dy=y;
  addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;glow.style.setProperty('--gx',x+'px');glow.style.setProperty('--gy',y+'px');dot.style.opacity=1});
  (function f(){dx+=(x-dx)*.18;dy+=(y-dy)*.18;dot.style.transform=`translate(${dx}px,${dy}px)`;requestAnimationFrame(f)})();
})();

/* =========================================================
   4. NAVBAR (show on scroll, mobile menu, active link)
   ========================================================= */
(function(){
  const nav=document.getElementById('nav');
  addEventListener('scroll',()=>nav.classList.toggle('show',scrollY>innerHeight*.6),{passive:true});
  document.getElementById('menuBtn').onclick=()=>nav.classList.toggle('open');
  nav.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  const links=[...nav.querySelectorAll('.menu a[href^="#"]')];
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
  links.forEach(l=>io.observe(document.querySelector(l.getAttribute('href'))));
})();

/* =========================================================
   5. TIMELINE dot moves with scroll
   ========================================================= */
(function(){
  const tl=document.querySelector('.tl');
  const upd=()=>{const r=tl.getBoundingClientRect();tl.style.setProperty('--p',Math.min(1,Math.max(0,(innerHeight*.5-r.top)/r.height)))};
  addEventListener('scroll',upd,{passive:true});upd();
})();

/* =========================================================
   6. TECH STACK spotlight (edit this list!)
   ========================================================= */
(function(){
  const list=['HTML','CSS','JavaScript','React','Node.js','Express','MongoDB','Python','C++','Java','Git','GitHub','Tailwind','WebSockets','Postman','VS Code'];
  const g=document.getElementById('techGrid');
  g.innerHTML=list.map(t=>`<div>${t}</div>`).join('');
})();

/* =========================================================
   7. PROJECTS horizontal scroll (replace dummy data with real projects)
   ========================================================= */
(function(){
  const projects=Array.from({length:8},(_,i)=>({name:'Project '+(i+1),desc:'Short description of the project goes here.'}));
  const track=document.getElementById('track'),sec=document.getElementById('projects');
  track.innerHTML=projects.map(p=>`<div class="card"><h3>${p.name}</h3><p>${p.desc}</p><a href="#">GitHub</a><a href="#">Live</a><a href="#">Demo</a></div>`).join('');
  const upd=()=>{
    const max=track.scrollWidth-innerWidth*.8,r=sec.getBoundingClientRect();
    const p=Math.min(1,Math.max(0,-r.top/(sec.offsetHeight-innerHeight)));
    track.style.transform=`translateX(${-max*p}px)`;
  };
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
})();


/* =========================================================
   8. HERO NAME flies to the top-left (About) while scrolling
   ========================================================= */
(function(){
  const n=document.getElementById('hero-name'),ph=document.getElementById('aboutName');
  if(!n||!ph)return;
  function upd(){
    const vw=innerWidth,vh=innerHeight,w=n.offsetWidth,h=n.offsetHeight;
    const p=Math.min(1,scrollY/(vh*.85)),e=1-Math.pow(1-p,3);   // 0 = centre, 1 = arrived
    const r=ph.getBoundingClientRect();
    const x0=(vw-w)/2,y0=(vh-h)/2,s=1+(r.width/w-1)*e;
    n.style.transform=`translate(${x0+(r.left-x0)*e}px,${y0+(r.top-y0)*e}px) scale(${s})`;
    n.dataset.s=s;
  }
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);
  if(document.fonts)document.fonts.ready.then(upd);
  upd();
})();

/* 9. BY THE NUMBERS: count-up, bars, tilt + glow */
(function(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    io.unobserve(e.target);
    const c=e.target,val=+c.dataset.val,dec=+(c.dataset.dec||0),suf=c.dataset.suffix||'',num=c.querySelector('strong');
    c.querySelector('.bar b').style.width=(val/+c.dataset.max*100)+'%';
    const t0=performance.now();
    (function step(t){
      const p=Math.min(1,(t-t0)/1400),v=val*(1-Math.pow(1-p,3));
      num.textContent=v.toFixed(dec)+(p===1?suf:'');
      if(p<1)requestAnimationFrame(step);
    })(t0);
  }),{threshold:.4});
  document.querySelectorAll('.stat').forEach(c=>{
    io.observe(c);
    c.addEventListener('mousemove',e=>{
      const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      c.style.setProperty('--x',x+'px');c.style.setProperty('--y',y+'px');
      c.style.transform=`perspective(700px) rotateY(${(x/r.width-.5)*10}deg) rotateX(${-(y/r.height-.5)*10}deg) translateY(-4px)`;
    });
    c.addEventListener('mouseleave',()=>c.style.transform='');
  });
})();

/* 10. CONNECT: copy email + magnetic button */
(function(){
  const b=document.getElementById('mailBtn');
  if(!b)return;
  const small=b.querySelector('small');
  b.addEventListener('click',()=>{
    navigator.clipboard.writeText(b.dataset.email).then(()=>{
      small.textContent='Copied!';
      setTimeout(()=>small.textContent='Click to copy',1800);
    });
  });
  b.addEventListener('mousemove',e=>{
    const r=b.getBoundingClientRect();
    b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`;
  });
  b.addEventListener('mouseleave',()=>b.style.transform='');
})();