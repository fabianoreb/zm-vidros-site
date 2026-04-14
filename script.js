/* ══════════════════════════════════════
   ZM VIDROS — script.js
   ══════════════════════════════════════ */

'use strict';

/* ── 1. NAVBAR: sticky scroll + mobile menu ── */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const toggle     = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');
  const allLinks   = navLinks.querySelectorAll('a');

  // Scrolled state
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close menu on link click
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
    }
  });
})();


/* ── 2. SCROLL REVEAL ── */
(function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);

        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay * 1000);

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ── 3. SMOOTH SCROLL for anchor links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH   = parseInt(getComputedStyle(document.documentElement)
                      .getPropertyValue('--navbar-h')) || 72;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 4. WHATSAPP TYPING ANIMATION in contact card ── */
(function initTypingDemo() {
  const bubble = document.getElementById('typingBubble');
  if (!bubble) return;

  // After 2s, replace typing with a real reply
  setTimeout(() => {
    bubble.classList.remove('wa-typing');
    bubble.innerHTML = '✅ Perfeito! Em breve entraremos em contato com seu orçamento.';
    bubble.style.background = '#1f2c34';
    bubble.style.color      = '#e9edef';
    bubble.style.padding    = '10px 14px';
    bubble.style.borderRadius = '0 8px 8px 8px';
    bubble.style.fontSize   = '0.85rem';
    bubble.style.lineHeight = '1.5';
    bubble.style.alignSelf  = 'flex-start';
    bubble.style.maxWidth   = '78%';
    bubble.style.animation  = 'none';

    // Reset after 5 more seconds for demo loop
    setTimeout(() => {
      bubble.innerHTML       = '<span></span><span></span><span></span>';
      bubble.classList.add('wa-typing');
      bubble.style.cssText   = '';
      initTypingDemo();
    }, 5000);
  }, 2000);
})();


/* ── 5. ACTIVE NAV LINK on scroll ── */
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.navbar__links a[href^="#"]');
  const navH     = () => parseInt(getComputedStyle(document.documentElement)
                          .getPropertyValue('--navbar-h')) || 72;

  function updateActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navH() - 60) {
        current = sec.id;
      }
    });
    links.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + current
      );
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


/* ── 6. HERO PARALLAX (subtle) ── */
(function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroBg.style.transform = `scale(1.04) translateY(${scrollY * 0.18}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ── 7. COUNTER ANIMATION for stats ── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat__num');
  if (!stats.length) return;

  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    const from  = 0;

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased    = 1 - Math.pow(1 - progress, 4);
      const value    = Math.round(from + (target - from) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const text = el.textContent.trim();

      if (text.includes('9')) animateCounter(el, 9, '+', 1400);
      else if (text.includes('5')) animateCounter(el, 5, '', 900);
      else if (text.includes('100')) animateCounter(el, 100, '%', 1600);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
})();
