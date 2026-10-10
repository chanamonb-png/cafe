// เมนูมือถือ
const nav = document.getElementById('nav');
document.getElementById('menuToggle').addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// เงาของ header + ปุ่มกลับขึ้นบน
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
  toTop.classList.toggle('show', window.scrollY > 500);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// กรองเมนู
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.card');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    cards.forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.cat !== f));
  });
});

// ตัวเลขนับขึ้นเมื่อเลื่อนมาถึง
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const end = +el.dataset.count;
    const start = performance.now();
    const duration = 1400;
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(end * p).toLocaleString('th-TH');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => countObserver.observe(c));

// สไลด์รีวิว
const slides = document.querySelectorAll('.slide');
const dotsWrap = document.getElementById('dots');
let current = 0;
let timer;
slides.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', 'รีวิวที่ ' + (i + 1));
  d.addEventListener('click', () => { show(i); restart(); });
  dotsWrap.appendChild(d);
});
function show(i) {
  current = i;
  slides.forEach((s, k) => s.classList.toggle('active', k === i));
  dotsWrap.querySelectorAll('.dot').forEach((d, k) => d.classList.toggle('active', k === i));
}
function restart() {
  clearInterval(timer);
  timer = setInterval(() => show((current + 1) % slides.length), 5000);
}
restart();

// ฟอร์มจองโต๊ะ (ตรวจสอบข้อมูลเบื้องต้น)
const form = document.getElementById('bookingForm');
const msg = document.getElementById('formMsg');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const phoneOk = /^0\d{8,9}$/.test(phone.value.replace(/[-\s]/g, ''));
  name.classList.toggle('error', !name.value.trim());
  phone.classList.toggle('error', !phoneOk);
  if (!name.value.trim() || !phoneOk) {
    msg.className = 'form-msg bad';
    msg.textContent = 'กรุณากรอกชื่อและเบอร์โทรให้ถูกต้อง';
    return;
  }
  msg.className = 'form-msg ok';
  msg.textContent = 'ขอบคุณคุณ ' + name.value.trim() + ' เราจะติดต่อกลับเพื่อยืนยันการจองครับ';
  form.reset();
});
