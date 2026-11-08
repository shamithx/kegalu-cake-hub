const grid = document.getElementById('gallery-grid');
const cards = grid ? [...grid.querySelectorAll('.cake-card')] : [];
const filters = [...document.querySelectorAll('.filter[data-filter]')];
const statusEl = document.getElementById('gallery-status');
const emptyEl = document.getElementById('gallery-empty');
const resetButton = document.querySelector('[data-filter-reset]');
const dialog = document.getElementById('cake-lightbox');

const validFilters = new Set(filters.map((button) => button.dataset.filter));
let currentCard = null;
let lastFocused = null;

function setFilter(filter, { updateUrl = true } = {}) {
  const active = validFilters.has(filter) ? filter : 'all';
  let shown = 0;

  cards.forEach((card) => {
    const matches =
      active === 'all' || (card.dataset.categories || '').split(/\s+/).includes(active);
    card.hidden = !matches;
    if (matches) shown += 1;
  });

  filters.forEach((button) => {
    const isActive = button.dataset.filter === active;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  const activeButton = filters.find((button) => button.dataset.filter === active);
  const label = activeButton?.dataset.label || 'All cake designs';
  if (statusEl) {
    statusEl.textContent =
      active === 'all'
        ? `Showing all ${cards.length} cake designs.`
        : `Showing ${shown} of ${cards.length} designs in ${label}.`;
  }

  emptyEl?.classList.toggle('is-visible', shown === 0);

  if (updateUrl) {
    const url = new URL(window.location.href);
    if (active === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', active);
    url.hash = '';
    history.replaceState(null, '', url);
  }
}

filters.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

resetButton?.addEventListener('click', () => setFilter('all'));

const initialFilter = new URLSearchParams(window.location.search).get('category') || 'all';
setFilter(initialFilter, { updateUrl: false });

if (dialog && typeof dialog.showModal === 'function') {
  const image = document.getElementById('lightbox-img');
  const kicker = document.getElementById('lightbox-category');
  const title = document.getElementById('lightbox-title');
  const desc = document.getElementById('lightbox-desc');
  const waLink = document.getElementById('lightbox-wa');
  const fbLink = document.getElementById('lightbox-fb');

  const visibleCards = () => cards.filter((card) => !card.hidden);

  const openLightbox = (card) => {
    if (!card) return;

    const cardImage = card.querySelector('.cake-card__media img');
    currentCard = card;

    if (image) {
      image.src = card.dataset.full || cardImage?.currentSrc || cardImage?.src || '';
      image.alt = cardImage?.alt || card.dataset.title || '';
    }
    if (kicker) kicker.textContent = card.dataset.category || 'Cake design';
    if (title) title.textContent = card.dataset.title || '';
    if (desc) desc.textContent = card.dataset.desc || '';
    if (waLink) waLink.href = card.dataset.wa || waLink.href;

    if (fbLink) {
      const facebook = card.dataset.facebook;
      fbLink.hidden = !facebook;
      if (facebook) fbLink.href = facebook;
    }

    if (!dialog.open) {
      lastFocused = document.activeElement;
      dialog.showModal();
      document.body.classList.add('no-scroll');
    }
  };

  const step = (direction) => {
    const list = visibleCards();
    if (list.length < 2 || !currentCard) return;
    let index = list.indexOf(currentCard);
    if (index === -1) index = 0;
    openLightbox(list[(index + direction + list.length) % list.length]);
  };

  cards.forEach((card) => {
    card.querySelectorAll('[data-lightbox]').forEach((button) => {
      button.addEventListener('click', () => openLightbox(card));
    });
  });

  dialog.querySelectorAll('[data-lightbox-close]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });

  dialog.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => step(-1));
  dialog.querySelector('[data-lightbox-next]')?.addEventListener('click', () => step(1));

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    }
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    if (lastFocused && document.contains(lastFocused) && !lastFocused.hidden) {
      lastFocused.focus({ preventScroll: true });
    }
    currentCard = null;
    const url = new URL(window.location.href);
    url.hash = '';
    history.replaceState(null, '', url);
  });

  const openFromHash = () => {
    const match = /^#cake-(.+)$/.exec(window.location.hash);
    if (!match) return;
    const card = document.getElementById(`cake-${decodeURIComponent(match[1])}`);
    if (!card || !grid?.contains(card)) return;
    if (card.hidden) setFilter('all', { updateUrl: false });
    requestAnimationFrame(() => openLightbox(card));
  };

  openFromHash();
  window.addEventListener('hashchange', openFromHash);
}
