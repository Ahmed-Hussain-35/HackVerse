/* ===========================
   COUNTDOWN
   =========================== */
const target = new Date('2026-01-10T09:00:00');
const el = (id) => document.getElementById(id);
function tick() {
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) { ['dd','hh','mm','ss'].forEach(id => el(id).textContent = '00'); return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff % 86400000 / 3600000);
  const m = Math.floor(diff % 3600000 / 60000);
  const s = Math.floor(diff % 60000 / 1000);
  el('dd').textContent = String(d).padStart(2,'0');
  el('hh').textContent = String(h).padStart(2,'0');
  el('mm').textContent = String(m).padStart(2,'0');
  el('ss').textContent = String(s).padStart(2,'0');
}
setInterval(tick, 1000); tick();

/* ===========================
   FOOTER YEAR
   =========================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===========================
   LIGHTWEIGHT STARFIELD
   =========================== */
(function stars(){
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  let W, H, stars = [];
  const N = 60;

  function resize(){
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }
  window.addEventListener('resize', resize); resize();

  function make(){
    stars = Array.from({length:N}, () => ({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.6 + .4,
      v: Math.random()*0.25 + 0.05,
      a: Math.random()*Math.PI*2
    }));
  }
  make();

  function loop(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for(const s of stars){
      s.x += Math.cos(s.a) * s.v;
      s.y += Math.sin(s.a) * s.v;
      if (s.x < -5) s.x = W+5; if (s.x > W+5) s.x = -5;
      if (s.y < -5) s.y = H+5; if (s.y > H+5) s.y = -5;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();













































/* ===========================
   COUNT-UP STATS (when in view)
   =========================== */
const counters = document.querySelectorAll('.stat-num');
const io = new IntersectionObserver((entries)=>{
  for(const e of entries){
    if(!e.isIntersecting) continue;
    const node = e.target;
    const target = parseInt(node.dataset.target, 10) || 0;
    const prefix = node.dataset.prefix || '';
    const suffix = node.dataset.suffix || '';
    const format = node.dataset.format || '';
    let curr = 0;
    const dur = 1600;
    const start = performance.now();

    function step(t){
      const p = Math.min(1, (t - start) / dur);
      curr = Math.floor(target * p);
      node.textContent = prefix + (format === 'comma' ? curr.toLocaleString() : curr) + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    io.unobserve(node);
  }
},{threshold:0.25});
counters.forEach(c => io.observe(c)); 
