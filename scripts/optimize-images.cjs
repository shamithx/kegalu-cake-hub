const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = 'assets/img/opt';
fs.mkdirSync(outDir, { recursive: true });

const sources = {
  butterfly: 'assets/img/legacy/birthday-cake.jpg',
  daisySlab: 'assets/img/legacy/customcake.jpg',
  weddingTier: 'assets/img/legacy/wedding-cake.jpg',
  weddingCouple: 'assets/img/legacy/wedding.jpg',
  heartCake: 'assets/img/legacy/giftjpg.jpg',
  cupcakeBox: 'assets/img/legacy/cup-cake.jpg',
  owner: 'assets/img/legacy/hero-cake.jpeg',
  jarCakes: 'assets/img/legacy/jar-cake.jpeg',
  brownies: 'assets/img/legacy/brownies.jpg',
  rosette: 'assets/img/google/wanderlog-1.jpg',
  goldBalloon: 'assets/img/google/wanderlog-2.jpg',
  safari: 'assets/img/google/wanderlog-3.jpg',
  reelDelivery: 'assets/img/fb/reel1.jpg',
  reelCutting: 'assets/img/fb/reel2.jpg',
};

(async () => {
  const manifest = {};
  for (const [name, src] of Object.entries(sources)) {
    const meta = await sharp(src).metadata();
    const widths = [480, 800, 1200, 1600].filter((w) => w <= meta.width);
    if (!widths.length) widths.push(meta.width);
    manifest[name] = { src: src, width: meta.width, height: meta.height, widths: [] };
    for (const w of widths) {
      const out = path.join(outDir, `${name}-${w}.webp`);
      await sharp(src)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 })
        .toFile(out);
      manifest[name].widths.push(w);
    }
    console.log(name, meta.width + 'x' + meta.height, '->', manifest[name].widths.join(', '));
  }

  // Social share image, 1200x630
  await sharp('assets/img/legacy/birthday-cake.jpg')
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(outDir, 'og-home.jpg'));

  fs.writeFileSync('scripts/image-manifest.json', JSON.stringify(manifest, null, 2));
  console.log('OG image written');
})();
