/* ================================================================
   THE WAY OF HOLINESS CHURCH — MIND OF CHRIST MINISTRY
   main.js — All interactions, animations & effects
   ================================================================ */

'use strict';

/* ── Page Loader ────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 500);
  }
});

/* ── Gold Particle System ───────────────────────────────────── */
class GoldParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.isMobile = window.innerWidth < 768;
    this.count = this.isMobile ? 45 : 90;
    this.running = true;
    this.raf = null;

    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
      this.resize();
    });
    document.addEventListener('visibilitychange', () => {
      this.running = !document.hidden;
      if (this.running) this.animate();
    });
  }

  resize() {
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  create(randomY = false) {
    return {
      x:      Math.random() * this.canvas.width,
      y:      randomY ? Math.random() * this.canvas.height : this.canvas.height + 5,
      size:   Math.random() * 1.8 + 0.3,
      base:   Math.random() * 0.55 + 0.08,
      speed:  Math.random() * 0.35 + 0.08,
      dx:     (Math.random() - 0.5) * 0.25,
      theta:  Math.random() * Math.PI * 2,
      dtheta: Math.random() * 0.018 + 0.004,
    };
  }

  init() {
    for (let i = 0; i < this.count; i++) {
      this.particles.push(this.create(true));
    }
  }

  update() {
    this.particles.forEach((p, i) => {
      p.y -= p.speed;
      p.x += p.dx;
      p.theta += p.dtheta;
      if (p.y < -5) this.particles[i] = this.create();
    });
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.particles.forEach(p => {
      const alpha = p.base + Math.sin(p.theta) * 0.18;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${alpha.toFixed(3)})`;
      ctx.fill();
    });
  }

  animate() {
    if (!this.running) return;
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(() => this.animate());
  }
}

const heroCanvas = document.getElementById('heroParticles');
if (heroCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  new GoldParticles(heroCanvas);
}

/* ── Navigation ─────────────────────────────────────────────── */
const nav        = document.getElementById('mainNav');
const toggle     = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const tickerH    = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ticker-h')) || 38;

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (nav) {
    nav.classList.toggle('scrolled', y > 60);
  }
  lastScroll = y;

  const btt = document.getElementById('backToTop');
  if (btt) btt.classList.toggle('visible', y > 500);
}, { passive: true });

if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* Set active nav link based on current page */
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── Back to Top ────────────────────────────────────────────── */
const btt = document.getElementById('backToTop');
if (btt) {
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Scroll Reveal ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('revealed'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ── Counter Animation ──────────────────────────────────────── */
function runCounter(el) {
  const target   = parseInt(el.dataset.counter);
  const suffix   = el.dataset.suffix || '';
  const display  = el.querySelector('.stat__number');
  if (!display || el.dataset.counted) return;
  el.dataset.counted = '1';

  const dur = 2200;
  const start = performance.now();

  function step(now) {
    const p   = Math.min((now - start) / dur, 1);
    const val = Math.floor(easeOutCubic(p) * target);
    display.textContent = val >= 1000 ? val.toLocaleString() : val;
    if (p < 1) requestAnimationFrame(step);
    else display.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

/* ── Testimonial Slider ─────────────────────────────────────── */
const slides = document.querySelectorAll('.testimonial');
const dots   = document.querySelectorAll('.testimonials__dot');
let current  = 0;
let autoSlide;

function goTo(i) {
  slides[current]?.classList.remove('active');
  dots[current]?.classList.remove('active');
  current = (i + slides.length) % slides.length;
  slides[current]?.classList.add('active');
  dots[current]?.classList.add('active');
}

function startAuto() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => goTo(current + 1), 5500);
}

dots.forEach(d => {
  d.addEventListener('click', () => { goTo(+d.dataset.index); startAuto(); });
});

if (slides.length > 0) startAuto();

/* Touch/drag for slider */
(function() {
  const wrap = document.querySelector('.testimonials__wrap');
  if (!wrap) return;
  let startX = 0;
  wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
  }, { passive: true });
})();

/* ── Ministry Card 3D Tilt ──────────────────────────────────── */
if (!('ontouchstart' in window)) {
  document.querySelectorAll('.ministry-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 10;
      card.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Contact Form ───────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const success = document.getElementById('formSuccess');

    btn.disabled = true;
    btn.textContent = 'Sending…';

    /* Simulate async send — replace with real endpoint */
    setTimeout(() => {
      contactForm.style.display = 'none';
      if (success) success.classList.add('show');
    }, 1200);
  });

  /* Live validation */
  contactForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => {
      const ok = input.checkValidity();
      input.style.borderColor = input.value
        ? (ok ? 'rgba(201,168,76,0.5)' : 'rgba(200,60,60,0.6)')
        : '';
    });
    input.addEventListener('focus', () => { input.style.borderColor = ''; });
  });
}

/* ── Ticker duplication for seamless loop ───────────────────── */
const track = document.querySelector('.ticker__track');
if (track) {
  const clone = track.cloneNode(true);
  track.parentNode.appendChild(clone);
}

/* ── Smooth anchor scroll offset (accounts for sticky nav) ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const offset = (nav ? nav.offsetHeight : 80) + tickerH + 20;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── YouTube Click-to-Load Embed ────────────────────────────── */
/*
   Each .video-tile with a valid data-youtube ID auto-loads a YouTube
   thumbnail. Clicking the tile replaces it with the embedded iframe.
   To set a video: change data-youtube="VIDEO_ID" on each tile.
   The VIDEO_ID is the part after `v=` in a YouTube URL —
   e.g. https://youtube.com/watch?v=dQw4w9WgXcQ → "dQw4w9WgXcQ".
*/
document.querySelectorAll('.video-tile[data-youtube]').forEach(tile => {
  const id = tile.dataset.youtube;
  const placeholder = tile.querySelector('.video-tile__placeholder');
  if (!id || /^\[.*\]$/.test(id)) return;

  if (placeholder) {
    placeholder.style.background =
      `linear-gradient(180deg, rgba(4,8,15,0.15) 40%, rgba(4,8,15,0.85) 100%), url("https://img.youtube.com/vi/${id}/hqdefault.jpg") center/cover no-repeat`;
    placeholder.querySelector('.video-tile__placeholder-text')?.remove();
  }

  tile.addEventListener('click', () => {
    if (tile.dataset.loaded) return;
    tile.dataset.loaded = '1';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = 'YouTube video player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    tile.appendChild(iframe);
    placeholder?.remove();
  });
});

/* ── Hero Logo Parallax (subtle mouse follow on desktop) ──── */
(function () {
  const wrap = document.querySelector('.hero__logo-wrap');
  if (!wrap || 'ontouchstart' in window || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
    wrap.style.transform = `translate(${x}px, ${y}px)`;
  });
  hero.addEventListener('mouseleave', () => { wrap.style.transform = ''; });
})();

/* ════════════════════════════════════════════════════════════════
   ADVANCED INTERACTIVITY LAYER
   ════════════════════════════════════════════════════════════════ */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = 'ontouchstart' in window;

/* ── Scroll Progress Bar ────────────────────────────────────── */
(function () {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }, { passive: true });
})();

/* ── Cursor Spotlight ───────────────────────────────────────── */
(function () {
  if (isTouch || reduce) return;
  const spot = document.createElement('div');
  spot.className = 'cursor-spot';
  document.body.appendChild(spot);
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    spot.classList.add('active');
  });
  document.addEventListener('mouseleave', () => spot.classList.remove('active'));
  function loop() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    spot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── Magnetic Buttons ───────────────────────────────────────── */
(function () {
  if (isTouch || reduce) return;
  document.querySelectorAll('.btn--gold, .btn--gold-outline').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

/* ── Sparkle Burst on Gold Button Click ─────────────────────── */
(function () {
  if (reduce) return;
  document.querySelectorAll('.btn--gold').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const sx = e.clientX - r.left;
      const sy = e.clientY - r.top;
      for (let i = 0; i < 10; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.style.left = sx + 'px';
        s.style.top  = sy + 'px';
        const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
        const dist  = 28 + Math.random() * 22;
        s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        s.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        btn.appendChild(s);
        setTimeout(() => s.remove(), 950);
      }
    });
  });
})();

/* ── 3D Tilt on Cards ──────────────────────────────────────── */
(function () {
  if (isTouch) return;
  const cards = document.querySelectorAll('.service-card, .program-card, .video-tile, .mv-card, .founder-portrait__frame');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
      card.style.transform = `perspective(1100px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ── Hero Title Char Split ─────────────────────────────────── */
(function () {
  if (reduce) return;
  document.querySelectorAll('.hero__title span').forEach((span, si) => {
    const text = span.textContent;
    span.textContent = '';
    [...text].forEach((ch, i) => {
      const c = document.createElement('span');
      c.className = 'char';
      c.textContent = ch === ' ' ? ' ' : ch;
      c.style.animationDelay = (si * 0.15 + i * 0.04 + 0.3) + 's';
      span.appendChild(c);
    });
  });
})();

/* ── Stat Counter Glow on Complete ─────────────────────────── */
(function () {
  const orig = window.runCounter;
})();
/* hook into existing counter — add `counted` class when done */
document.querySelectorAll('[data-counter]').forEach(stat => {
  const obs = new MutationObserver(() => {
    if (stat.dataset.counted === '1' && !stat.classList.contains('counted')) {
      stat.classList.add('counted');
    }
  });
  obs.observe(stat, { attributes: true, attributeFilter: ['data-counted'] });
});

/* ── Section Stagger Observer ──────────────────────────────── */
(function () {
  const targets = document.querySelectorAll('.services__grid, .programs-grid, .videos__grid, .ministry-grid, .mv-grid, .values-grid, .event-list, .leader-grid, .stats__grid');
  targets.forEach(t => t.setAttribute('data-stagger', ''));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in-view');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
})();

/* ── Hero Rays Scroll Parallax ─────────────────────────────── */
(function () {
  if (reduce) return;
  const rays = document.querySelector('.hero__rays');
  const glow = document.querySelector('.hero__glow');
  if (!rays && !glow) return;
  let raf = null;
  window.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < 900) {
        if (rays) rays.style.transform = `translateY(${y * 0.15}px)`;
        if (glow) glow.style.transform = `translateX(-50%) translateY(${y * 0.25}px)`;
      }
      raf = null;
    });
  }, { passive: true });
})();

/* ── Inject hover view icon into gallery tiles ─────────────── */
document.querySelectorAll('.gallery-tile').forEach(t => {
  if (t.querySelector('.gallery-tile__icon')) return;
  const icon = document.createElement('span');
  icon.className = 'gallery-tile__icon';
  icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M21 3l-7 7"/><path d="M9 21H3v-6"/><path d="M3 21l7-7"/></svg>';
  t.appendChild(icon);
});

/* ── Lightbox for Gallery ──────────────────────────────────── */
(function () {
  const box = document.getElementById('lightbox');
  if (!box) return;
  const img = box.querySelector('.lightbox__img');
  const cap = box.querySelector('.lightbox__caption');
  const closeBtn = box.querySelector('.lightbox__close');
  const prevBtn  = box.querySelector('.lightbox__nav--prev');
  const nextBtn  = box.querySelector('.lightbox__nav--next');
  const tiles = [...document.querySelectorAll('.gallery-tile:not(.gallery-tile--missing)[data-lightbox]')];
  let idx = 0;

  function show(i) {
    idx = (i + tiles.length) % tiles.length;
    const t = tiles[idx];
    img.src = t.getAttribute('href');
    img.alt = t.querySelector('img')?.alt || '';
    cap.textContent = t.querySelector('.gallery-tile__caption')?.textContent || '';
  }
  function open(i) {
    show(i);
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-tile[data-lightbox]').forEach((tile, i) => {
    tile.addEventListener('click', e => {
      if (tile.classList.contains('gallery-tile--missing')) return;
      e.preventDefault();
      const visibleIdx = tiles.indexOf(tile);
      if (visibleIdx >= 0) open(visibleIdx);
    });
  });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => show(idx - 1));
  nextBtn?.addEventListener('click', () => show(idx + 1));
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

/* ── Section Heading In-View Underline ─────────────────────── */
(function () {
  const headings = document.querySelectorAll('.section-heading');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
    });
  }, { threshold: 0.4 });
  headings.forEach(h => io.observe(h));
})();

