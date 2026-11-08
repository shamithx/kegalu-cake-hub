import fs from 'node:fs';
import {
  site,
  cakePrices,
  weddingPricing,
  galleryCategories,
  cakeGallery,
  smallTreats,
  facebook,
  reviews,
  eventTypes,
  enquiryCategories,
} from '../assets/js/config.js';

const manifest = JSON.parse(
  fs.readFileSync(new URL('./image-manifest.json', import.meta.url), 'utf8'),
);
const IMG = 'assets/img/opt';

export const esc = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);

const attr = esc;
export { attr };

export const waUrl = (message) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const formatPrice = (price) =>
  typeof price === 'number' ? `${cakePrices.symbol} ${price.toLocaleString('en-US')}` : null;

export const priceText = (price) => formatPrice(price) || 'Price to be confirmed';

function imageWidths(name) {
  const entry = manifest[name];
  if (!entry) throw new Error(`Missing image "${name}" in scripts/image-manifest.json`);
  return entry.widths;
}

export function img(name, options = {}) {
  const entry = manifest[name];
  if (!entry) throw new Error(`Missing image "${name}" in scripts/image-manifest.json`);
  const widths = imageWidths(name);
  const fallback = widths.includes(800) ? 800 : widths[widths.length - 1];
  const srcset = widths.map((w) => `${IMG}/${name}-${w}.webp ${w}w`).join(', ');
  const loading = options.loading || 'lazy';
  const priority = options.fetchpriority ? ` fetchpriority="${attr(options.fetchpriority)}"` : '';
  const className = options.className ? ` class="${attr(options.className)}"` : '';
  return `<img src="${IMG}/${name}-${fallback}.webp" srcset="${srcset}" sizes="${attr(
    options.sizes || '(max-width: 700px) 100vw, 50vw',
  )}" width="${entry.width}" height="${entry.height}" alt="${attr(options.alt || '')}" loading="${attr(
    loading,
  )}" decoding="async"${priority}${className}>`;
}

export function fullImage(name) {
  const widths = imageWidths(name);
  const largest = widths.includes(1200) ? 1200 : widths[widths.length - 1];
  return `${IMG}/${name}-${largest}.webp`;
}

const categoryById = Object.fromEntries(galleryCategories.map((c) => [c.id, c]));

export const categoryLabel = (id) => categoryById[id]?.label || id;

export function icon(name, className = 'icon') {
  return `<svg class="${className}" aria-hidden="true" focusable="false"><use href="assets/img/icons.svg#icon-${name}"></use></svg>`;
}

const countForCategory = (id) => cakeGallery.filter((item) => item.categories.includes(id)).length;

function galleryWa(item) {
  return waUrl(
    `Hello Kegalu Cake Hub! I would like to enquire about the "${item.title}" design shown on your website. Please confirm availability and the final price.`,
  );
}

export function renderFeatured(limit = 6) {
  const items = [
    ...cakeGallery.filter((item) => item.featured),
    ...cakeGallery.filter((item) => !item.featured),
  ].slice(0, limit);

  return items
    .map(
      (item) => `
      <article class="cake-card" data-reveal>
        <a class="cake-card__media" href="gallery#cake-${attr(item.id)}" aria-label="${attr(categoryLabel(item.categories[0]))}: view ${attr(item.title)} in the cake gallery">
          ${img(item.image, {
            alt: item.alt,
            sizes: '(max-width: 700px) 100vw, (max-width: 1000px) 45vw, 30vw',
          })}
          <span class="cake-card__tag">${esc(categoryLabel(item.categories[0]))}</span>
          <span class="cake-card__zoom" aria-hidden="true">View gallery ${icon('arrow-up-right')}</span>
        </a>
        <div class="cake-card__body">
          <h3 class="cake-card__title">${esc(item.title)}</h3>
          <p class="cake-card__desc">${esc(item.description)}</p>
          <div class="cake-card__actions">
            <a class="text-link" href="${attr(galleryWa(item))}" target="_blank" rel="noopener">${icon('whatsapp')} Enquire</a>
            <a class="text-link text-link--muted" href="gallery#cake-${attr(item.id)}">Details ${icon('arrow-right')}</a>
          </div>
        </div>
      </article>`,
    )
    .join('');
}

export function renderCategories() {
  return galleryCategories
    .map((category) => {
      const count = countForCategory(category.id);
      const first = cakeGallery.find((item) => item.categories.includes(category.id));
      const feature = cakeGallery.find((item) => item.image === category.image) || first;
      return `
      <a class="category-card" href="gallery?category=${attr(category.id)}" data-reveal>
        ${
          feature
            ? img(feature.image, {
                alt: `${category.label} — ${feature.title}`,
                sizes: '(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw',
              })
            : ''
        }
        <span class="category-card__shade"></span>
        <span class="category-card__body">
          <span class="category-card__label">${esc(category.short)}</span>
          <span class="category-card__meta">${count} ${count === 1 ? 'design' : 'designs'}</span>
        </span>
        <span class="category-card__arrow">${icon('arrow-up-right')}</span>
      </a>`;
    })
    .join('');
}

export function renderFilters() {
  const total = cakeGallery.length;
  const buttons = [
    `<button class="filter is-active" type="button" data-filter="all" data-label="All cake designs" aria-pressed="true">All <span class="filter__count">${total}</span></button>`,
    ...galleryCategories.map((category) => {
      const count = countForCategory(category.id);
      return `<button class="filter" type="button" data-filter="${attr(category.id)}" data-label="${attr(
        category.label,
      )}" aria-pressed="false">${esc(category.short)} <span class="filter__count">${count}</span></button>`;
    }),
  ];
  return buttons.join('');
}

export function renderGalleryGrid() {
  return cakeGallery
    .map((item) => {
      const wa = galleryWa(item);
      const tags = item.categories.map((id) => categoryLabel(id));
      return `
      <article class="cake-card" id="cake-${attr(item.id)}" data-categories="${attr(item.categories.join(' '))}"
        data-title="${attr(item.title)}" data-desc="${attr(item.description)}" data-category="${attr(tags[0])}"
        data-full="${attr(fullImage(item.image))}" data-wa="${attr(wa)}"
        data-facebook="${attr(item.facebook || '')}">
        <button class="cake-card__media" type="button" data-lightbox aria-label="${attr(tags[0])}: view a larger image and details of ${attr(item.title)}">
          ${img(item.image, {
            alt: item.alt,
            sizes: '(max-width: 640px) 100vw, (max-width: 1000px) 45vw, 30vw',
          })}
          <span class="cake-card__tag">${esc(tags[0])}</span>
          <span class="cake-card__zoom" aria-hidden="true">${icon('arrow-right')} View</span>
        </button>
        <div class="cake-card__body">
          <ul class="tag-list" aria-label="Categories">
            ${tags.map((tag) => `<li>${esc(tag)}</li>`).join('')}
          </ul>
          <h3 class="cake-card__title">${esc(item.title)}</h3>
          <p class="cake-card__desc">${esc(item.description)}</p>
          <div class="cake-card__actions">
            <a class="text-link" href="${attr(wa)}" target="_blank" rel="noopener">${icon('whatsapp')} Enquire</a>
            <button class="text-link text-link--muted" type="button" data-lightbox>View details ${icon('arrow-right')}</button>
          </div>
        </div>
      </article>`;
    })
    .join('');
}

export function renderSmallTreats() {
  return smallTreats
    .map(
      (item) => `
      <article class="treat-card">
        ${img(item.image, { alt: item.alt, sizes: '(max-width: 700px) 100vw, 33vw' })}
        <div class="treat-card__body">
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.description)}</p>
          <a class="text-link" href="${attr(waUrl(item.message))}" target="_blank" rel="noopener">${icon('whatsapp')} Enquire</a>
        </div>
      </article>`,
    )
    .join('');
}

function facebookPluginUrl(kind, url) {
  const base =
    kind === 'video'
      ? 'https://www.facebook.com/plugins/video.php'
      : 'https://www.facebook.com/plugins/post.php';
  const params = new URLSearchParams({
    href: url,
    show_text: kind === 'post' ? 'true' : 'false',
    width: kind === 'post' ? '500' : '340',
  });
  return `${base}?${params.toString()}`;
}

export function renderReels() {
  if (!facebook.reels.length) {
    return `<p class="empty-state">No Reels have been added yet. <a class="text-link" href="${attr(facebook.pageUrl)}" target="_blank" rel="noopener">Visit our Facebook page</a>.</p>`;
  }
  return facebook.reels
    .map(
      (reel) => `
      <article class="social-card social-card--reel">
        <div class="embed-frame embed-frame--reel">
          <iframe src="${attr(facebookPluginUrl('video', reel.url))}" title="Facebook Reel: ${attr(reel.title)}"
            loading="lazy" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
        <div class="social-card__body">
          <p class="social-card__kicker">${icon('play')} Facebook Reel</p>
          <h3>${esc(reel.title)}</h3>
          <p>${esc(reel.description)}</p>
          <a class="text-link" href="${attr(reel.url)}" target="_blank" rel="noopener">Open this Reel on Facebook ${icon('arrow-up-right')}</a>
          <p class="embed-fallback">If the video does not load, the link above opens it on Facebook.</p>
        </div>
      </article>`,
    )
    .join('');
}

export function renderPosts() {
  if (!facebook.posts.length) {
    return `<p class="empty-state">No posts have been added yet. <a class="text-link" href="${attr(facebook.pageUrl)}" target="_blank" rel="noopener">Visit our Facebook page</a>.</p>`;
  }
  return facebook.posts
    .map(
      (post) => `
      <article class="social-card social-card--post">
        <div class="embed-frame embed-frame--post">
          <iframe src="${attr(facebookPluginUrl('post', post.url))}" title="Facebook post: ${attr(post.title)}"
            loading="lazy" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
        <div class="social-card__body">
          <p class="social-card__kicker">${icon('facebook')} Facebook post</p>
          <h3>${esc(post.title)}</h3>
          <p>${esc(post.text)}</p>
          <a class="text-link" href="${attr(post.url)}" target="_blank" rel="noopener">Open this post on Facebook ${icon('arrow-up-right')}</a>
          <p class="embed-fallback">If the post does not load, the link above opens it on Facebook.</p>
        </div>
      </article>`,
    )
    .join('');
}

export function renderRatingSummary() {
  const { rating, count, url, checked } = reviews.google;
  const stars = Array.from({ length: 5 }, () => icon('star', 'icon star')).join('');
  const [year, month, day] = checked.split('-').map(Number);
  const checkedLabel = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return `
    <div class="rating-card">
      <p class="script-kicker">Loved in Kegalle</p>
      <div class="rating-card__score">
        <span class="rating-card__number">${esc(rating.toFixed(1))}</span>
        <span class="rating-card__outof">/ 5</span>
      </div>
      <p class="rating-card__stars" role="img" aria-label="${attr(rating)} out of 5 stars">${stars}</p>
      <p class="rating-card__meta">Based on ${esc(count)} Google reviews</p>
      <a class="btn btn-secondary btn-small" href="${attr(url)}" target="_blank" rel="noopener">Read reviews on Google ${icon('arrow-up-right')}</a>
      <p class="rating-card__checked">Rating checked ${esc(checkedLabel)}</p>
    </div>`;
}

export function renderReviewCards() {
  if (reviews.google.items.length) {
    return reviews.google.items
      .map((review) => {
        const stars = Array.from({ length: 5 }, (_, index) =>
          icon('star', `icon star${index < review.rating ? '' : ' star--empty'}`),
        ).join('');
        return `
        <figure class="quote-card">
          <p class="quote-card__stars" aria-label="${attr(review.rating)} out of 5 stars">${stars}</p>
          <blockquote>${esc(review.text)}</blockquote>
          <figcaption><span class="quote-card__name">${esc(review.name)}</span><span class="quote-card__meta">${esc(
            review.date || 'Google review',
          )}</span></figcaption>
        </figure>`;
      })
      .join('');
  }

  if (!reviews.showPreviousWebsiteTestimonials) {
    return `
      <div class="reviews-verified">
        ${icon('star', 'icon reviews-verified__icon')}
        <p class="reviews-verified__title">Reviewed on Google</p>
        <p>Our rating is the aggregate shown on our Google Business Profile. We only publish the wording of reviews once we can verify it, so the full reviews live on Google.</p>
        <a class="text-link" href="${attr(reviews.google.url)}" target="_blank" rel="noopener">Read all reviews on Google ${icon('arrow-up-right')}</a>
      </div>`;
  }

  return reviews.testimonials
    .map((review) => {
      const initials = review.name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
      return `
      <figure class="quote-card">
        ${icon('quote', 'icon quote-card__mark')}
        <blockquote>${esc(review.quote)}</blockquote>
        <figcaption>
          <span class="quote-card__avatar" aria-hidden="true">${esc(initials)}</span>
          <span><span class="quote-card__name">${esc(review.name)}</span><span class="quote-card__meta">${esc(
            review.location,
          )}</span></span>
        </figcaption>
      </figure>`;
    })
    .join('');
}

export function renderReviewsNote() {
  if (reviews.google.items.length) {
    return 'Reviews shown above are from our Google listing. Ratings and wording are as published on Google.';
  }
  if (!reviews.showPreviousWebsiteTestimonials) {
    return 'The 5.0 rating is the aggregate currently shown on Google. Individual review text is not reproduced here unless it can be verified and attributed.';
  }
  return 'The feedback below was shared with us and published on our previous website. For verified, up-to-date reviews, read our Google listing.';
}

export function renderSocialStrip() {
  const cards = [
    {
      href: 'social',
      image: facebook.reels[0]?.cover,
      title: facebook.reels[0]?.title || 'Latest Reel',
      meta: 'Watch the Reel',
      play: true,
    },
    {
      href: 'social',
      image: facebook.reels[1]?.cover,
      title: facebook.reels[1]?.title || 'Latest Reel',
      meta: 'Watch the Reel',
      play: true,
    },
    {
      href: 'gallery?category=wedding',
      image: 'weddingTier',
      title: 'Burgundy & Ivory Wedding Tier',
      meta: 'From the gallery',
      play: false,
    },
  ];

  return cards
    .map(
      (card) => `
      <a class="social-tile" href="${attr(card.href)}">
        ${img(card.image, {
          alt: card.title,
          sizes: '(max-width: 700px) 100vw, 33vw',
        })}
        <span class="social-tile__shade"></span>
        ${card.play ? `<span class="social-tile__play">${icon('play')}</span>` : ''}
        <span class="social-tile__body">
          <span class="social-tile__meta">${esc(card.meta)}</span>
          <span class="social-tile__title">${esc(card.title)}</span>
        </span>
      </a>`,
    )
    .join('');
}

export function renderWeddingCards() {
  return weddingPricing.categories
    .map(
      (category) => `
      <article class="wedding-card">
        <div class="wedding-card__media">
          ${img(category.image, {
            alt: `${category.label} by Kegalu Cake Hub`,
            sizes: '(max-width: 700px) 100vw, 50vw',
          })}
          <span class="wedding-card__guide">${esc(category.guide)}</span>
        </div>
        <div class="wedding-card__body">
          <h3>${esc(category.label)}</h3>
          <p>${esc(category.description)}</p>
          <p class="wedding-card__note">${esc(category.note)}</p>
          <button class="btn btn-secondary btn-small" type="button" data-enquire-category="${attr(
            category.formCategory,
          )}">Request a quote ${icon('arrow-right')}</button>
        </div>
      </article>`,
    )
    .join('');
}

export function renderPriceRows() {
  return cakePrices.weights
    .flatMap((weight) =>
      cakePrices.flavors.map((flavor) => {
        const price = cakePrices.prices[weight.id]?.[flavor.id];
        const display = priceText(price);
        return `<tr>
          <th scope="row">${esc(weight.label)} · ${esc(flavor.label)}</th>
          <td>${esc(display)}</td>
          <td><span class="status ${price === null ? 'status--pending' : 'status--ok'}">${
            price === null ? 'Awaiting price' : 'Confirmed'
          }</span></td>
        </tr>`;
      }),
    )
    .join('');
}

export function renderWeightOptions() {
  return cakePrices.weights
    .map(
      (weight, index) => `
      <label class="choice">
        <input type="radio" name="weight" value="${attr(weight.id)}" ${index === 0 ? 'checked' : ''}>
        <span class="choice__inner">
          <span class="choice__label">${esc(weight.label)}</span>
          <span class="choice__hint">${esc(weight.hint)}</span>
        </span>
      </label>`,
    )
    .join('');
}

export function renderFlavorOptions() {
  return cakePrices.flavors
    .map(
      (flavor, index) => `
      <label class="choice">
        <input type="radio" name="flavor" value="${attr(flavor.id)}" ${index === 0 ? 'checked' : ''}>
        <span class="choice__inner">
          <span class="swatch swatch--${attr(flavor.id)}" aria-hidden="true"></span>
          <span class="choice__label">${esc(flavor.label)}</span>
          <span class="choice__hint">${esc(flavor.hint)}</span>
        </span>
      </label>`,
    )
    .join('');
}

export function renderDesignOptions() {
  return cakePrices.designs
    .map((design) => `<option value="${attr(design.label)}">${esc(design.label)}</option>`)
    .join('');
}

export function renderProvisional(weightId) {
  const guide = cakePrices.provisional[weightId];
  if (!guide) return '';
  if (!guide.range) return `<p class="price-guide">${esc(guide.note)}</p>`;
  return `<p class="price-guide"><strong>Provisional ${esc(weightId)} guide: ${esc(
    guide.range,
  )}</strong> ${esc(guide.note)}</p>`;
}

export function renderEventOptions() {
  return eventTypes.map((type) => `<option value="${attr(type)}">${esc(type)}</option>`).join('');
}

export function renderCategoryOptions() {
  return enquiryCategories
    .map((category) => `<option value="${attr(category)}">${esc(category)}</option>`)
    .join('');
}

export function renderGalleryJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kegalu Cake Hub cake gallery',
    itemListElement: cakeGallery.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: item.title,
        description: item.description,
        image: `${site.url}/${fullImage(item.image)}`,
        genre: categoryLabel(item.categories[0]),
      },
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}
