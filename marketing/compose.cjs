const sharp = require('sharp');
const BG = process.env.BG || 'og-home.jpg';
const OUT = process.env.OUT || 'kegalucakehub-showcase.png';
const path = require('path');

const W = 1600;
const H = 1200;
const dir = __dirname;
const img = (p) => path.join(dir, p);

const roundedMask = (w, h, r) =>
  Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#fff"/></svg>`,
  );

async function card(file, w, r) {
  const src = await sharp(file);
  const meta = await src.metadata();
  const h = Math.round((w * meta.height) / meta.width);
  const body = await sharp(file).resize(w, h).toBuffer();
  const clipped = await sharp(body)
    .composite([{ input: roundedMask(w, h, r), blend: 'dest-in' }])
    .png()
    .toBuffer();
  return { buf: clipped, w, h };
}

async function shadow(w, h, r) {
  const pad = 90;
  const svg = Buffer.from(
    `<svg width="${w + pad * 2}" height="${h + pad * 2}" xmlns="http://www.w3.org/2000/svg"><rect x="${pad}" y="${pad}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#000" fill-opacity="0.65"/></svg>`,
  );
  return { buf: await sharp(svg).blur(30).png().toBuffer(), pad };
}

(async () => {
  const bg = await sharp(path.join(dir, '..', 'assets/img/opt', BG))
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .blur(16)
    .modulate({ brightness: 0.52, saturation: 1.02 })
    .toBuffer();

  const overlay = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>` +
      `<radialGradient id="v" cx="50%" cy="44%" r="80%"><stop offset="0%" stop-color="#221410" stop-opacity="0.10"/><stop offset="100%" stop-color="#140d0a" stop-opacity="0.62"/></radialGradient>` +
      `<radialGradient id="g" cx="50%" cy="44%" r="52%"><stop offset="0%" stop-color="#d6b278" stop-opacity="0.16"/><stop offset="100%" stop-color="#d6b278" stop-opacity="0"/></radialGradient>` +
      `</defs><rect width="100%" height="100%" fill="url(#v)"/><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );

  const desktop = await card(img('shots/desktop.png'), 900, 18);
  const phoneShot = await card(img('shots/mobile.png'), 238, 20);

  const dx = 200;
  const dy = 140;
  const phoneW = 260;
  const phoneH = phoneShot.h + 22;
  const px = 1050;
  const py = 395;

  const dShadow = await shadow(desktop.w, desktop.h, 18);
  const pShadow = await shadow(phoneW, phoneH, 30);

  const frame = Buffer.from(
    `<svg width="${phoneW}" height="${phoneH}" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="${phoneW - 1}" height="${phoneH - 1}" rx="30" ry="30" fill="#ffffff" fill-opacity="0.98" stroke="#000000" stroke-opacity="0.08"/></svg>`,
  );

  await sharp(bg)
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: dShadow.buf, top: dy - dShadow.pad + 18, left: dx - dShadow.pad + 10 },
      { input: desktop.buf, top: dy, left: dx },
      { input: pShadow.buf, top: py - pShadow.pad + 20, left: px - pShadow.pad + 12 },
      { input: frame, top: py, left: px },
      { input: phoneShot.buf, top: py + 11, left: px + (phoneW - phoneShot.w) / 2 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(img(OUT));

  console.log('showcase saved', desktop.w + 'x' + desktop.h, 'phone', phoneShot.w + 'x' + phoneShot.h);
})();
