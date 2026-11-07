document.addEventListener('DOMContentLoaded',()=>document.body.classList.add('loaded'));

// nav: show after hero, mobile menu, active link
(function(){
  const nav=document.getElementById('nav');
  addEventListener('scroll',()=>nav.classList.toggle('show',scrollY>innerHeight*.6),{passive:true});
  document.getElementById('menuBtn').onclick=()=>nav.classList.toggle('open');
  nav.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  const links=[...nav.querySelectorAll('.menu a[href^="#"]')];
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id));
  }),{rootMargin:'-45% 0px -50% 0px'});
  links.forEach(l=>{const t=document.querySelector(l.getAttribute('href'));if(t)io.observe(t)});
})();

// timeline dot follows scroll
(function(){
  const tl=document.querySelector('.tl');
  const upd=()=>{const r=tl.getBoundingClientRect();tl.style.setProperty('--p',Math.min(1,Math.max(0,(innerHeight*.5-r.top)/r.height)))};
  addEventListener('scroll',upd,{passive:true});upd();
})();

// hero name flies into the About heading
(function(){
  const n=document.getElementById('hero-name'),ph=document.getElementById('aboutName'),tg=document.getElementById('tagline'),aboutEl=document.getElementById('about');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('still');return}
  function upd(){
    const vw=innerWidth,vh=innerHeight,w=n.offsetWidth,h=n.offsetHeight;
    const S=aboutEl.offsetTop||vh,p=Math.min(1,scrollY/S),e=p;
    const r=ph.getBoundingClientRect();
    const x0=(vw-w)/2,y0=(vh-h)/2,s=1+(r.width/w-1)*e;
    n.style.transform=`translate(${x0+(r.left-x0)*e}px,${y0+(r.top+scrollY-Math.max(scrollY,S)-y0)*e}px) scale(${s})`;
    tg.style.top=(y0+h+14)+'px';tg.style.opacity=Math.max(0,1-p*3);tg.style.visibility=(p>.34||!document.body.classList.contains('loaded'))?'hidden':'visible';
  }
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);
  if(document.fonts)document.fonts.ready.then(upd);addEventListener('load',upd);
  upd();
})();

// copy email
(function(){
  const b=document.getElementById('mailBtn'),s=b.querySelector('small');
  b.addEventListener('click',()=>{
    navigator.clipboard.writeText(b.dataset.email).then(()=>{
      s.textContent='Copied';setTimeout(()=>s.textContent='Click to copy',1800);
    }).catch(()=>{s.textContent='Copy failed, select the email and copy it manually'});
  });
})();