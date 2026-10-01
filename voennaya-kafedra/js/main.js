// Военная кафедра — основной скрипт
document.addEventListener('DOMContentLoaded', () => {
  // Подсветка активной ссылки
  const path = window.location.pathname;
  const current = path.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-main a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const file = href.split('/').pop();
    if (file === current || (current === '' && file === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Мобильное меню
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  // FAQ аккордеон
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  // Табы
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabs = btn.closest('.tabs');
      const panels = tabs.parentElement.querySelectorAll('.tab-panel');
      tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Переключатель языка в шапке
  document.querySelectorAll('.header-actions').forEach(actions => {
    if (actions.querySelector('.lang-switcher')) return;
    const wrap = document.createElement('div');
    wrap.className = 'lang-switcher';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Language');
    wrap.innerHTML =
      '<button type="button" class="lang-btn" data-lang="ru">RU</button>' +
      '<button type="button" class="lang-btn" data-lang="kk">ҚАЗ</button>';
    const login = actions.querySelector('.btn-login, a.btn-login');
    if (login) actions.insertBefore(wrap, login);
    else actions.insertBefore(wrap, actions.firstChild);
  });

  if (window.vkI18n) {
    window.vkI18n.init();
  }
});


/* ===== Анимация появления карточек ===== */
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  function show(el) {
    el.classList.add('visible');
  }

  if (!('IntersectionObserver' in window)) {
    els.forEach(show);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        show(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  els.forEach(el => {
    // Если уже в зоне видимости при загрузке — чуть задержка для эффекта
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (inView) {
      setTimeout(() => show(el), 80 + Array.from(els).indexOf(el) * 100);
    } else {
      io.observe(el);
    }
  });
})();


/* ===== Hero particles ===== */
(function () {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, raf;

  function resize() {
    const hero = canvas.parentElement;
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function create() {
    const count = Math.min(55, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25 - 0.1,
      a: Math.random() * 0.5 + 0.15,
      gold: Math.random() > 0.65
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201, 162, 39, ${p.a})`
        : `rgba(180, 210, 255, ${p.a * 0.7})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  resize();
  create();
  draw();
  window.addEventListener('resize', () => { resize(); create(); });
})();


/* ===== Параллакс героя ===== */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const bg = hero.querySelector('.hero-bg');
  const grid = hero.querySelector('.hero-grid');
  const orbs = hero.querySelector('.hero-orbs');
  const particles = hero.querySelector('.hero-particles');
  const inner = hero.querySelector('.hero-inner');

  // Отключаем на мобильных / reduced motion
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqMobile = window.matchMedia('(max-width: 768px)');
  if (mqReduce.matches || mqMobile.matches) return;

  let ticking = false;

  function update() {
    const rect = hero.getBoundingClientRect();
    const heroH = hero.offsetHeight || 1;
    // 0 = верх героя у верха окна, 1 = герой почти ушёл вверх
    const progress = Math.min(1, Math.max(0, -rect.top / (heroH * 0.9)));
    // смещение в px
    const y = progress * 120;

    if (bg) bg.style.transform = `translate3d(0, ${y * 0.45}px, 0) scale(${1 + progress * 0.04})`;
    if (grid) grid.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
    if (orbs) orbs.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
    if (particles) particles.style.transform = `translate3d(0, ${y * 0.2}px, 0)`;
    if (inner) inner.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  hero.classList.add('parallax-active');
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();




/* ===== Снайпер: реалистичный выстрел ===== */
(function () {
  if (!document.querySelector('.nav-main') && !document.querySelector('.hero')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const crosshair = document.createElement('div');
  crosshair.className = 'sniper-crosshair';
  crosshair.innerHTML = `
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- внешнее кольцо -->
      <circle cx="48" cy="48" r="42" stroke="rgba(201,162,39,0.35)" stroke-width="1"/>
      <circle cx="48" cy="48" r="34" stroke="#c9a227" stroke-width="1.4" opacity="0.95"/>
      <!-- мил-доты -->
      <circle cx="48" cy="48" r="18" stroke="rgba(201,162,39,0.5)" stroke-width="0.8" stroke-dasharray="2 3"/>
      <!-- перекрестие -->
      <line x1="48" y1="8" x2="48" y2="30" stroke="#e8d48b" stroke-width="1.3"/>
      <line x1="48" y1="66" x2="48" y2="88" stroke="#e8d48b" stroke-width="1.3"/>
      <line x1="8" y1="48" x2="30" y2="48" stroke="#e8d48b" stroke-width="1.3"/>
      <line x1="66" y1="48" x2="88" y2="48" stroke="#e8d48b" stroke-width="1.3"/>
      <!-- засечки -->
      <line x1="48" y1="34" x2="48" y2="38" stroke="#c9a227" stroke-width="1"/>
      <line x1="48" y1="58" x2="48" y2="62" stroke="#c9a227" stroke-width="1"/>
      <line x1="34" y1="48" x2="38" y2="48" stroke="#c9a227" stroke-width="1"/>
      <line x1="58" y1="48" x2="62" y2="48" stroke="#c9a227" stroke-width="1"/>
      <!-- центр -->
      <circle cx="48" cy="48" r="2.2" fill="#ff2a2a" opacity="0.95"/>
      <circle cx="48" cy="48" r="5" stroke="rgba(255,42,42,0.4)" stroke-width="0.8"/>
      <!-- уголки скопа -->
      <path d="M14 20 L14 14 L20 14" stroke="#c9a227" stroke-width="1.2" fill="none" opacity="0.7"/>
      <path d="M82 20 L82 14 L76 14" stroke="#c9a227" stroke-width="1.2" fill="none" opacity="0.7"/>
      <path d="M14 76 L14 82 L20 82" stroke="#c9a227" stroke-width="1.2" fill="none" opacity="0.7"/>
      <path d="M82 76 L82 82 L76 82" stroke="#c9a227" stroke-width="1.2" fill="none" opacity="0.7"/>
    </svg>`;
  document.body.appendChild(crosshair);

  const vignette = document.createElement('div');
  vignette.className = 'sniper-vignette';
  document.body.appendChild(vignette);

  const flash = document.createElement('div');
  flash.className = 'sniper-flash';
  document.body.appendChild(flash);

  const impact = document.createElement('div');
  impact.className = 'sniper-impact';
  document.body.appendChild(impact);

  const trail = document.createElement('div');
  trail.className = 'sniper-trail';
  document.body.appendChild(trail);

  const sparksBox = document.createElement('div');
  sparksBox.className = 'sniper-sparks';
  document.body.appendChild(sparksBox);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let armed = true;
  let smoothX = mx, smoothY = my;

  // Плавное следование прицела
  function tickAim() {
    smoothX += (mx - smoothX) * 0.28;
    smoothY += (my - smoothY) * 0.28;
    crosshair.style.left = smoothX + 'px';
    crosshair.style.top = smoothY + 'px';
    requestAnimationFrame(tickAim);
  }
  tickAim();

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    crosshair.classList.add('active');
    vignette.classList.add('on');
    document.body.classList.add('sniper-mode');
  });

  document.addEventListener('mouseleave', () => {
    crosshair.classList.remove('active');
    vignette.classList.remove('on');
    document.body.classList.remove('sniper-mode');
  });

  function isTarget(el) {
    if (!el || !el.closest) return null;
    return el.closest('a, button, .btn, .nav-main a, .stat-item-link, .link-all');
  }

  function spawnSparks(x, y) {
    sparksBox.innerHTML = '';
    sparksBox.style.left = x + 'px';
    sparksBox.style.top = y + 'px';
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('div');
      s.className = 'sniper-spark';
      const ang = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
      const dist = 18 + Math.random() * 28;
      s.style.setProperty('--sx', Math.cos(ang) * dist + 'px');
      s.style.setProperty('--sy', Math.sin(ang) * dist + 'px');
      sparksBox.appendChild(s);
    }
  }

  function playShotSound() {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const t0 = ac.currentTime;

      // Глухой удар + высокий щелчок
      const bufferSize = ac.sampleRate * 0.15;
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.pow(1 - i / bufferSize, 2.5);
        data[i] = (Math.random() * 2 - 1) * env * 0.4;
      }
      const noise = ac.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ac.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 400;
      noiseFilter.Q.value = 0.8;
      const noiseGain = ac.createGain();
      noiseGain.gain.setValueAtTime(0.35, t0);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ac.destination);
      noise.start(t0);

      const osc = ac.createOscillator();
      const og = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, t0);
      osc.frequency.exponentialRampToValueAtTime(35, t0 + 0.1);
      og.gain.setValueAtTime(0.2, t0);
      og.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12);
      osc.connect(og);
      og.connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + 0.13);
    } catch (e) {}
  }

  function shoot(tx, ty, targetEl) {
    if (!armed) return;
    armed = false;

    // Вспышка у прицела
    flash.style.left = smoothX + 'px';
    flash.style.top = smoothY + 'px';
    flash.classList.remove('bang');
    void flash.offsetWidth;
    flash.classList.add('bang');

    // Трассер
    const dx = tx - smoothX;
    const dy = ty - smoothY;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    trail.style.left = smoothX + 'px';
    trail.style.top = smoothY + 'px';
    trail.style.width = len + 'px';
    trail.style.transform = 'rotate(' + angle + 'deg)';
    trail.classList.remove('fire');
    void trail.offsetWidth;
    trail.classList.add('fire');

    // Тряска
    document.body.classList.remove('sniper-shake');
    void document.body.offsetWidth;
    document.body.classList.add('sniper-shake');
    setTimeout(() => document.body.classList.remove('sniper-shake'), 220);

    playShotSound();

    setTimeout(() => {
      impact.style.left = tx + 'px';
      impact.style.top = ty + 'px';
      impact.classList.remove('hit');
      void impact.offsetWidth;
      impact.classList.add('hit');
      spawnSparks(tx, ty);
      if (targetEl) {
        targetEl.classList.add('sniper-target-hit');
        setTimeout(() => targetEl.classList.remove('sniper-target-hit'), 500);
      }
    }, 70);

    setTimeout(() => { armed = true; }, 380);
  }

  document.addEventListener('click', (e) => {
    const target = isTarget(e.target);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    shoot(rect.left + rect.width / 2, rect.top + rect.height / 2, target);
  }, true);
})();
