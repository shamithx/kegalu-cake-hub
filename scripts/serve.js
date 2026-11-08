import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '_site');
const port = Number(process.env.PORT) || 4173;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

// Mirrors the production headers in _headers / netlify.toml (upgrade-insecure-requests is
// omitted locally so http://localhost previews keep working).
const securityHeaders = {
  'content-security-policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.facebook.com https://web.facebook.com https://m.facebook.com https://maps.google.com https://www.google.com https://maps.googleapis.com",
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let filePath = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
    if (!filePath.startsWith(root)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
      filePath = `${filePath}.html`;
    }
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { ...securityHeaders, 'content-type': types['.html'] });
      res.end(fs.readFileSync(path.join(root, '404.html')));
      return;
    }
    res.writeHead(200, {
      ...securityHeaders,
      'content-type': types[path.extname(filePath)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(port, () => console.log(`Preview: http://localhost:${port}`));
