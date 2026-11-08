const sharp = require('sharp');
const fs = require('fs');

(async () => {
  const svg = fs.readFileSync('favicon.svg');
  for (const size of [180, 192, 512]) {
    await sharp(svg, { density: 600 })
      .resize(size, size)
      .png()
      .toFile(`assets/img/icon-${size}.png`);
  }
  console.log('icons generated');
})();
