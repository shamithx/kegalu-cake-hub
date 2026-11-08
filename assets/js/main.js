const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-nav-toggle]');
const menu = document.getElementById('mobile-menu');

function syncHeader() {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

if (toggle && menu) {
  const toggleIcon = toggle.querySelector('use');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
    document.body.classList.toggle('menu-open', open);
    if (toggleIcon) {
      toggleIcon.setAttribute('href', open ? 'assets/img/icons.svg#icon-close' : 'assets/img/icons.svg#icon-menu');
    }
    if (open) {
      const firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
    } else if (document.activeElement && menu.contains(document.activeElement)) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000 && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
}

const revealItems = [...document.querySelectorAll('[data-reveal]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const heroMedia = document.querySelector('.hero__media');
if (heroMedia && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const layers = [
    { el: heroMedia.querySelector('.hero__main img'), depth: 8 },
    { el: heroMedia.querySelector('.hero__secondary img'), depth: 14 },
  ].filter((layer) => layer.el);
  if (layers.length) {
    let raf = 0;
    const setOffset = (x, y) => {
      layers.forEach(({ el, depth }) => {
        el.style.setProperty('--px', `${(x * depth).toFixed(2)}px`);
        el.style.setProperty('--py', `${(y * depth).toFixed(2)}px`);
      });
    };
    heroMedia.addEventListener('pointermove', (event) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = heroMedia.getBoundingClientRect();
        setOffset(
          (event.clientX - rect.left) / rect.width - 0.5,
          (event.clientY - rect.top) / rect.height - 0.5,
        );
      });
    });
    heroMedia.addEventListener('pointerleave', () => {
      layers.forEach(({ el }) => {
        el.style.removeProperty('--px');
        el.style.removeProperty('--py');
      });
    });
  }
}

if (!revealItems.length) {
  // Nothing to animate.
} else if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
  );
  revealItems.forEach((item) => observer.observe(item));
}
