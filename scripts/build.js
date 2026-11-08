import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  site,
  cakePrices,
  weddingPricing,
  galleryCategories,
  cakeGallery,
  facebook,
  reviews,
} from '../assets/js/config.js';
import {
  esc,
  attr,
  waUrl,
  img,
  renderFeatured,
  renderCategories,
  renderFilters,
  renderGalleryGrid,
  renderGalleryJsonLd,
  renderSmallTreats,
  renderSocialStrip,
  renderRatingSummary,
  renderReviewCards,
  renderReviewsNote,
  renderWeddingCards,
  renderPriceRows,
  renderWeightOptions,
  renderFlavorOptions,
  renderDesignOptions,
  renderProvisional,
  renderEventOptions,
  renderCategoryOptions,
  renderReels,
  renderPosts,
} from './render.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const partialsDir = path.join(srcDir, 'partials');
const outDir = path.join(root, '_site');

const [checkedYear, checkedMonth, checkedDay] = reviews.google.checked.split('-').map(Number);
const reviewsChecked = new Date(Date.UTC(checkedYear, checkedMonth - 1, checkedDay)).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const bakeryJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  '@id': `${site.url}/#bakery`,
  name: site.name,
  url: site.url,
  image: `${site.url}/assets/img/opt/og-home.jpg`,
  telephone: site.phoneE164,
  priceRange: 'Rs. 500 – 8,000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.line1,
    addressLocality: 'Kegalle',
    postalCode: '71000',
    addressCountry: 'LK',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: site.address.lat,
    longitude: site.address.lng,
  },
  sameAs: [site.facebook, site.googleListing],
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Kegalle District, Sri Lanka',
  },
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Birthday cakes' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Wedding cakes' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Custom celebration cakes' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Cupcakes and mini cakes' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Slab cakes' } },
  ],
});

const globalTokens = {
  SITE_NAME: esc(site.name),
  TAGLINE: esc(site.tagline),
  PHONE_DISPLAY: esc(site.phoneDisplay),
  PHONE_E164: attr(site.phoneE164),
  WA_ORDER: attr(waUrl('Hello Kegalu Cake Hub! I would like to order a cake.')),
  WA_ENQUIRY: attr(waUrl('Hello Kegalu Cake Hub! I have a question about a cake.')),
  WA_CUSTOM: attr(
    waUrl(
      'Hello Kegalu Cake Hub! I would like to discuss a custom celebration cake. Here is what I have in mind:',
    ),
  ),
  WA_WEDDING: attr(
    waUrl(
      'Hello Kegalu Cake Hub! I would like to request a quote for a wedding cake or wedding desserts.',
    ),
  ),
  WA_PRICES: attr(
    waUrl('Hello Kegalu Cake Hub! I would like to confirm the current cake prices.'),
  ),
  FB_URL: attr(site.facebook),
  GOOGLE_URL: attr(site.googleListing),
  GOOGLE_REVIEW_URL: attr(site.googleReview),
  DIRECTIONS_URL: attr(site.googleDirections),
  MAP_EMBED: attr(site.mapEmbed),
  ADDRESS_LINE1: esc(site.address.line1),
  ADDRESS_CITY: esc(site.address.city),
  ADDRESS_COUNTRY: esc(site.address.country),
  ADDRESS_ONE_LINE: esc(`${site.address.line1}, ${site.address.city}, ${site.address.country}`),
  OWNER: esc(site.owner),
  LEAD_TIME: esc(site.orderLeadTime),
  DELIVERY_NOTE: esc(site.deliveryNote),
  PRICE_DISCLAIMER: esc(site.priceDisclaimer),
  PRICE_NOTE: esc(cakePrices.note),
  SITE_URL: site.url,
  OG_IMAGE: `${site.url}/assets/img/opt/og-home.jpg`,
  YEAR: String(new Date().getFullYear()),
  GOOGLE_RATING: reviews.google.rating.toFixed(1),
  GOOGLE_COUNT: String(reviews.google.count),
  REVIEWS_CHECKED: esc(reviewsChecked),
  BAKERY_JSONLD: `<script type="application/ld+json">${bakeryJsonLd.replace(/</g, '\\u003c')}</script>`,
};

const pageTokens = {
  'index.html': {
    HOME_HERO_MAIN: img('owner', {
      alt: 'Cake maker holding a pink and cream celebration cake with gold decorations',
      sizes: '(max-width: 1000px) 84vw, 42vw',
      loading: 'eager',
      fetchpriority: 'high',
    }),
    HOME_HERO_SECONDARY: img('butterfly', {
      alt: 'Cream birthday cake with blush butterflies and hand-piped flowers',
      sizes: '(max-width: 760px) 46vw, 20vw',
    }),
    HOME_EDITORIAL_IMAGE: img('heartCake', {
      alt: 'Heart-shaped pink birthday cake with piped cream roses and a gold number topper',
      sizes: '(max-width: 1000px) 100vw, 45vw',
    }),
    HOME_FEATURED: renderFeatured(),
    HOME_CATEGORIES: renderCategories(),
    HOME_SOCIAL: renderSocialStrip(),
    GOOGLE_SUMMARY: renderRatingSummary(),
    REVIEW_CARDS: renderReviewCards(),
    REVIEWS_NOTE: esc(renderReviewsNote()),
  },
  'gallery.html': {
    GALLERY_FILTERS: renderFilters(),
    GALLERY_GRID: renderGalleryGrid(),
    GALLERY_COUNT: String(cakeGallery.length),
    SMALL_TREATS: renderSmallTreats(),
    GALLERY_JSONLD: renderGalleryJsonLd(),
  },
  'prices.html': {
    WEIGHT_OPTIONS: renderWeightOptions(),
    FLAVOR_OPTIONS: renderFlavorOptions(),
    DESIGN_OPTIONS: renderDesignOptions(),
    PRICE_ROWS: renderPriceRows(),
    PROVISIONAL_500: renderProvisional('500g'),
    PROVISIONAL_1KG: renderProvisional('1kg'),
  },
  'weddings.html': {
    WEDDING_CARDS: renderWeddingCards(),
    WEDDING_DISCLAIMER: esc(weddingPricing.disclaimer),
    EVENT_OPTIONS: renderEventOptions(),
    CATEGORY_OPTIONS: renderCategoryOptions(),
  },
  'social.html': {
    REELS: renderReels(),
    POSTS: renderPosts(),
  },
  'contact.html': {},
  '404.html': {},
};

function copyRecursive(from, to) {
  const stat = fs.statSync(from);
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from)) {
      copyRecursive(path.join(from, entry), path.join(to, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

function renderPage(file, tokens) {
  const template = fs.readFileSync(path.join(srcDir, file), 'utf8');
  let output = template;

  for (const partial of fs.readdirSync(partialsDir)) {
    const marker = `{{> ${partial}}}`;
    if (!output.includes(marker)) continue;
    let markup = fs.readFileSync(path.join(partialsDir, partial), 'utf8');
    if (partial === 'header.html') {
      const pageHref = file === 'index.html' ? '/' : file.replace(/\.html$/, '');
      const escaped = pageHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      markup = markup.replace(
        new RegExp(`<a href="${escaped}"`, 'g'),
        `<a href="${pageHref}" aria-current="page"`,
      );
    }
    output = output.split(marker).join(markup);
  }

  for (const [key, value] of Object.entries({ ...globalTokens, ...tokens })) {
    output = output.split(`{{${key}}}`).join(value);
  }
  const leftovers = output.match(/\{\{[A-Z0-9_]+\}\}|\{\{> [^}]+\}\}/g);
  if (leftovers) {
    throw new Error(`Unreplaced tokens in ${file}: ${[...new Set(leftovers)].join(', ')}`);
  }
  fs.writeFileSync(path.join(outDir, file), output);
  return output;
}

function buildSitemap() {
  const pages = ['', 'gallery', 'prices', 'weddings', 'social', 'contact'];
  const lastmod = '2026-10-26';
  const urls = pages
    .map(
      (page) =>
        `  <url><loc>${site.url}/${page}</loc><lastmod>${lastmod}</lastmod><changefreq>${
          page === '' ? 'weekly' : 'monthly'
        }</changefreq><priority>${page === '' ? '1.0' : '0.8'}</priority></url>`,
    )
    .join('\n');
  fs.writeFileSync(
    path.join(outDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
}

function buildRobots() {
  fs.writeFileSync(
    path.join(outDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
  );
}

function report() {
  console.log('\nKegalu Cake Hub build');
  console.log(`  Gallery: ${cakeGallery.length} designs across ${galleryCategories.length} categories`);
  const empty = galleryCategories.filter(
    (category) => !cakeGallery.some((item) => item.categories.includes(category.id)),
  );
  if (empty.length) console.log(`  Empty categories: ${empty.map((c) => c.label).join(', ')}`);
  const missing = [];
  for (const weight of cakePrices.weights) {
    for (const flavor of cakePrices.flavors) {
      if (cakePrices.prices[weight.id]?.[flavor.id] == null) {
        missing.push(`${weight.label} ${flavor.label}`);
      }
    }
  }
  console.log(
    missing.length
      ? `  Prices awaiting owner: ${missing.join(', ')} (shown as Price to be confirmed)`
      : '  All standard prices configured',
  );
  console.log(`  Facebook: ${facebook.reels.length} Reels, ${facebook.posts.length} posts`);
  console.log(
    `  Google reviews: ${reviews.google.rating}/5 from ${reviews.google.count} (aggregate only)`,
  );
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const dir of ['assets/css', 'assets/js', 'assets/fonts', 'assets/img/opt', 'assets/img/brand']) {
  copyRecursive(path.join(root, dir), path.join(outDir, dir));
}
for (const file of ['assets/img/icons.svg', 'favicon.svg', 'site.webmanifest', '_headers', '_redirects']) {
  copyRecursive(path.join(root, file), path.join(outDir, file));
}
for (const file of fs.readdirSync(path.join(root, 'assets/img')).filter((f) => f.startsWith('icon-'))) {
  fs.copyFileSync(path.join(root, 'assets/img', file), path.join(outDir, 'assets/img', file));
}

for (const [file, tokens] of Object.entries(pageTokens)) {
  renderPage(file, tokens);
}
buildSitemap();
buildRobots();
report();
console.log(`  Output: ${path.relative(root, outDir)}/\n`);
