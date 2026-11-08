/**
 * KEGALU CAKE HUB — SINGLE CONTENT CONFIGURATION
 * ------------------------------------------------
 * This is the only file the owner needs to edit for prices, cake photos,
 * Facebook links and reviews. After editing, run `npm run build` (Netlify and
 * Cloudflare run this automatically) and deploy the `_site` folder.
 *
 * A price left as `null` is shown as "Price to be confirmed" and the order
 * button asks the business to confirm it. Never guess a price.
 */

export const site = {
  name: 'Kegalu Cake Hub',
  tagline: 'Bake with Love',
  url: 'https://kegalucakehub.pages.dev',
  phoneDisplay: '076 051 2238',
  phoneE164: '+94760512238',
  whatsappNumber: '94760512238',
  owner: 'Kalani Paranagama',
  facebook: 'https://web.facebook.com/profile.php?id=100087444283691',
  googleListing: 'https://maps.app.goo.gl/DRbNbMtdkNL9pkdL8',
  googleReview: 'https://g.page/r/CbjDaWxqvme3EBM/review',
  googleDirections:
    'https://www.google.com/maps/dir/?api=1&destination=Kegalu%20Cake%20Hub%2C%20280%20Kandy%20Road%2C%20Kegalle%2071000%2C%20Sri%20Lanka',
  mapEmbed:
    'https://maps.google.com/maps?q=Kegalu%20Cake%20Hub%2C%20280%20Kandy%20Rd%2C%20Kegalle%2071000&z=16&output=embed',
  address: {
    line1: '280 Kandy Road',
    city: 'Kegalle 71000',
    country: 'Sri Lanka',
    lat: 7.252653,
    lng: 80.328627,
  },
  orderLeadTime:
    'Recommended notice: 2–5 days for regular cakes and 10–14 days for wedding cakes.',
  deliveryNote:
    'Local delivery in the Kegalle area is available. Message us with your address to confirm availability and any delivery charge.',
  priceDisclaimer:
    'Every price is confirmed by Kegalu Cake Hub on WhatsApp before an order is accepted.',
};

export const cakePrices = {
  symbol: 'Rs.',
  weights: [
    { id: '500g', label: '500g', hint: 'Smaller celebration cake' },
    { id: '1kg', label: '1kg', hint: 'Larger celebration cake' },
  ],
  flavors: [
    { id: 'vanilla', label: 'Vanilla', hint: 'Vanilla flavour' },
    { id: 'chocolate', label: 'Chocolate', hint: 'Chocolate flavour' },
  ],
  designs: [
    { id: 'classic', label: 'Classic cream finish' },
    { id: 'floral', label: 'Floral / buttercream detail' },
    { id: 'themed', label: 'Themed / character design' },
    { id: 'custom', label: 'Custom design' },
  ],
  /**
   * Final prices go here, for example:
   *   '500g': { vanilla: 2500, chocolate: 2800 },
   *   '1kg':  { vanilla: 4800, chocolate: 5200 },
   * Leave null until the owner confirms each combination.
   */
  prices: {
    '500g': { vanilla: null, chocolate: null },
    '1kg': { vanilla: null, chocolate: null },
  },
  provisional: {
    '500g': {
      range: 'Rs. 500 – 3,800',
      note: 'Provisional guide for 500g standard cakes only. Not a final quote.',
    },
    '1kg': {
      range: null,
      note: '1kg prices are being finalised by the business. Ask on WhatsApp for the current price.',
    },
  },
  note: 'The displayed price is for the selected weight and flavour. Extra decoration can change the final quote.',
};

export const weddingPricing = {
  disclaimer:
    'Wedding and custom prices are quoted individually. The figures below are provisional guidance from the business, not a final quote.',
  categories: [
    {
      id: 'wedding-cakes',
      label: 'Wedding Cakes',
      image: 'weddingTier',
      guide: 'Up to Rs. 8,000 (provisional)',
      description:
        'Custom wedding cake designs, finished by hand to suit your celebration.',
      note: 'Price depends on design, size, decorations and requirements.',
      formCategory: 'Wedding Cake',
    },
    {
      id: 'wedding-cupcakes',
      label: 'Wedding Cupcakes',
      image: 'cupcakeBox',
      guide: 'Up to Rs. 200 per cupcake (provisional)',
      description:
        'Cupcake designs and decoration options for weddings and engagements.',
      note: 'The final quote depends on the requested design and quantity.',
      formCategory: 'Wedding Cupcakes',
    },
    {
      id: 'wedding-mini-cakes',
      label: 'Wedding Mini Cakes',
      image: 'cupcakeBox',
      guide: 'Up to Rs. 300 per mini cake (provisional)',
      description:
        'Elegant miniature cakes for place settings, gifts and dessert tables.',
      note: 'Bulk orders are welcome; the final quote depends on design and quantity.',
      formCategory: 'Wedding Mini Cakes',
    },
    {
      id: 'slab-cakes',
      label: 'Slab Cakes',
      image: 'daisySlab',
      guide: 'Quote required',
      description:
        'Rectangular slab cakes for parties, offices and larger gatherings.',
      note: 'Price depends on dimensions, design, decoration and order requirements.',
      formCategory: 'Slab Cake',
    },
  ],
};

/**
 * Gallery items. Add a new object to show a new cake.
 * `image` refers to a name in scripts/image-manifest.json (generated from
 * photos placed in assets/img/legacy, assets/img/google or assets/img/fb).
 * Run `npm run images` after adding a new source photo.
 */
export const galleryCategories = [
  { id: 'birthday', label: 'Birthday Cakes', short: 'Birthday', image: 'rosette' },
  { id: 'chocolate', label: 'Chocolate Cakes', short: 'Chocolate', image: 'brownies' },
  { id: 'vanilla', label: 'Vanilla Cakes', short: 'Vanilla', image: 'goldBalloon' },
  { id: 'custom', label: 'Custom Celebration Cakes', short: 'Custom Celebration', image: 'butterfly' },
  { id: 'wedding', label: 'Wedding Cakes', short: 'Wedding', image: 'weddingTier' },
  { id: 'wedding-cupcakes', label: 'Wedding Cupcakes', short: 'Wedding Cupcakes', image: 'cupcakeBox' },
  { id: 'wedding-mini', label: 'Wedding Mini Cakes', short: 'Wedding Mini Cakes', image: 'cupcakeBox' },
  { id: 'slab', label: 'Slab Cakes', short: 'Slab Cakes', image: 'daisySlab' },
];

export const cakeGallery = [
  {
    id: 'butterfly-blush',
    title: 'Butterfly & Blush Birthday Cake',
    categories: ['birthday', 'custom', 'vanilla'],
    image: 'butterfly',
    alt: 'Cream-finished birthday cake with pink butterflies, burgundy piped flowers and gold lettering',
    description:
      'Soft cream finish, blush butterflies and hand-piped blooms for a birthday that feels personal.',
    featured: true,
  },
  {
    id: 'rosette-cream',
    title: 'Rosette Cream Cake',
    categories: ['birthday', 'vanilla'],
    image: 'rosette',
    alt: 'Cream cake decorated with red piped buttercream roses and pearl sprinkles',
    description:
      'A timeless cream cake with hand-piped roses and delicate pearl detail.',
    featured: true,
  },
  {
    id: 'gold-balloon',
    title: 'Golden Balloon Celebration Cake',
    categories: ['birthday', 'custom', 'vanilla'],
    image: 'goldBalloon',
    alt: 'Cream celebration cake with gold and pearl balloon decorations and a gold happy birthday topper',
    description:
      'Gold and pearl balloon details with butterfly accents for a milestone celebration.',
    featured: true,
  },
  {
    id: 'safari-first-birthday',
    title: 'Safari First Birthday Cake',
    categories: ['birthday', 'custom'],
    image: 'safari',
    alt: 'Bright yellow first birthday cake with safari animal cut-outs and a birthday party backdrop',
    description:
      'A cheerful themed cake with hand-cut animal details for a first birthday party.',
    featured: false,
  },
  {
    id: 'roses-hearts',
    title: 'Roses & Hearts Birthday Cake',
    categories: ['birthday'],
    image: 'heartCake',
    alt: 'Heart-shaped pink birthday cake with piped cream roses, gold number topper and a bouquet of flowers',
    description:
      'A heart-shaped birthday cake with piped roses, gold numbers and a matching bouquet.',
    featured: true,
  },
  {
    id: 'daisy-garden-slab',
    title: 'Daisy Garden Slab Cake',
    categories: ['slab', 'custom'],
    image: 'daisySlab',
    alt: 'Rectangular cream slab cake with daisy and lilac flowers and gold happy birthday toppers',
    description:
      'A rectangular slab cake with a garden of daisies and gold lettering — made for sharing.',
    featured: true,
  },
  {
    id: 'burgundy-ivory-tier',
    title: 'Burgundy & Ivory Wedding Tier',
    categories: ['wedding'],
    image: 'weddingTier',
    alt: 'Three-tier ivory wedding cake with textured detailing, burgundy roses and gold accents',
    description:
      'Three tiers of ivory texture, burgundy roses and gold accents for an elegant wedding.',
    featured: true,
  },
  {
    id: 'wedding-celebration',
    title: 'A Kegalle Wedding Celebration',
    categories: ['wedding'],
    image: 'weddingCouple',
    alt: 'Bride and groom cutting a white wedding cake surrounded by flowers',
    description:
      'A wedding cake made for a celebration in Kegalle, captured at the cake cutting.',
    featured: false,
  },
  {
    id: 'cupcake-mini-gift-box',
    title: 'Cupcake & Mini Cake Gift Box',
    categories: ['wedding-cupcakes', 'wedding-mini'],
    image: 'cupcakeBox',
    alt: 'Gift box containing buttercream cupcakes and a small decorated cake with a teddy bear and flowers',
    description:
      'A gift box of cupcakes with a matching mini cake — ideal for weddings and engagements.',
    featured: false,
  },
  {
    id: 'chocolate-brownie-box',
    title: 'Chocolate Brownie Box',
    categories: ['chocolate'],
    image: 'brownies',
    alt: 'Box of chocolate brownies with glossy chocolate glaze, gold sprinkles and yellow decoration',
    description:
      'Fudgy chocolate brownies boxed for sharing. Chocolate celebration cakes are quoted on request.',
    featured: false,
  },
];

export const smallTreats = [
  {
    id: 'jar-cakes',
    title: 'Layered Jar Cakes',
    image: 'jarCakes',
    alt: 'Glass jars filled with layered cake and buttercream, tied with twine and thank-you tags',
    description: 'Layered cake in jars, finished with tags for gifts and favours.',
    message: 'Hello Kegalu Cake Hub! I would like to enquire about layered jar cakes.',
  },
  {
    id: 'brownies',
    title: 'Chocolate Brownies',
    image: 'brownies',
    alt: 'Box of chocolate brownies topped with chocolate glaze and gold sprinkles',
    description: 'Chocolate brownies in a sharing box, finished with a glossy glaze.',
    message: 'Hello Kegalu Cake Hub! I would like to enquire about chocolate brownies.',
  },
  {
    id: 'cupcakes',
    title: 'Cupcakes',
    image: 'cupcakeBox',
    alt: 'Box of buttercream cupcakes with a small decorated cake',
    description: 'Buttercream cupcakes for parties, gifts and dessert tables.',
    message: 'Hello Kegalu Cake Hub! I would like to enquire about cupcakes.',
  },
];

export const facebook = {
  pageUrl: site.facebook,
  handle: '@KegaluCakeHub',
  reels: [
    {
      id: 'delivery-reel',
      url: 'https://www.facebook.com/100087444283691/videos/1074378768042931/',
      title: 'A cake delivery in Kegalle',
      description:
        'A recent doorstep delivery from our home kitchen in Kegalle.',
      cover: 'reelDelivery',
    },
    {
      id: 'cutting-reel',
      url: 'https://www.facebook.com/100087444283691/videos/1497022467822987/',
      title: 'Celebration cake cutting',
      description:
        'A birthday celebration with a Kegalu Cake Hub cake.',
      cover: 'reelCutting',
    },
  ],
  posts: [
    {
      id: 'post-2026-al',
      url: 'https://www.facebook.com/100087444283691/posts/1023064447285022/',
      title: '2026 A/L batch cake',
      text: 'A celebration cake for the 2026 A/L batch, with thanks for the order.',
    },
    {
      id: 'post-iduwara',
      url: 'https://www.facebook.com/100087444283691/posts/1072880102303456/',
      title: 'Happy birthday, Iduwara',
      text: 'A dinosaur-themed birthday cake with matching cupcakes for Iduwara.',
    },
    {
      id: 'post-cupcake-flowers',
      url: 'https://www.facebook.com/100087444283691/posts/1075738778684255/',
      title: 'Birthday flowers & cupcake box',
      text: 'A birthday order with a box of decorated cupcakes and a fresh flower bouquet.',
    },
  ],
};

export const reviews = {
  google: {
    rating: 5.0,
    count: 5,
    url: site.googleReview,
    checked: '2026-10-26',
    /** Add verified Google reviews here when available:
     * { name: '...', rating: 5, date: '2026-...', text: '...' }
     */
    items: [],
  },
  /** Customer feedback published on the previous Kegalu Cake Hub website.
   *  It is NOT shown on the site until the owner confirms each quote is genuine
   *  and gives permission to publish it again. Then set the flag below to true.
   */
  showPreviousWebsiteTestimonials: false,
  testimonials: [
    {
      name: 'Sanduni P.',
      location: 'Kegalle',
      quote:
        'The birthday cake for my daughter was absolutely perfect! So soft, so tasty — everyone asked where we got it. Will definitely order again!',
    },
    {
      name: 'Nishen Ronald',
      location: 'Kegalle, Ranwala Road',
      quote:
        'Ordered a wedding cake and it was beyond expectations. Beautiful design, delivered on time, and the taste was incredible. Thank you!',
    },
    {
      name: 'Priyantha',
      location: 'Kegalle Town',
      quote:
        'The jar cakes are my favourite! Ordered a box of 6 for our office and everyone loved them. Very fresh, beautifully packed, fast delivery!',
    },
  ],
};

export const eventTypes = [
  'Birthday',
  'Wedding',
  'Homecoming',
  'Engagement',
  'Anniversary',
  'Baby shower',
  'Corporate event',
  'Other',
];

export const enquiryCategories = [
  'Wedding Cake',
  'Wedding Cupcakes',
  'Wedding Mini Cakes',
  'Slab Cake',
  'Custom Celebration Cake',
  'Standard 500g Cake',
  'Standard 1kg Cake',
  'Other',
];
