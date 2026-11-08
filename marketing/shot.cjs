const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BRAVE = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const PORT = 9333;
const OUT = __dirname;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url);
  return res.json();
}

async function capture({ width, height, mobile, url, file }) {
  const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method) {
      events.push(msg.method);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, (msg) => (msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)));
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 2,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
  await send('Page.navigate', { url });
  for (let i = 0; i < 60 && !events.includes('Page.loadEventFired'); i++) await sleep(100);
  await sleep(2500);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, file), Buffer.from(shot.data, 'base64'));
  ws.close();
  console.log('saved', file, width + 'x' + height, mobile ? '(mobile)' : '(desktop)');
}

(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'brave-shot-'));
  const brave = spawn(BRAVE, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ]);

  try {
    for (let i = 0; i < 50; i++) {
      try {
        await getJson(`http://127.0.0.1:${PORT}/json/version`);
        break;
      } catch {
        await sleep(200);
      }
    }
    await capture({ width: 1440, height: 900, mobile: false, url: 'https://kegalucakehub.pages.dev/', file: 'shots/desktop.png' });
    await capture({ width: 390, height: 844, mobile: true, url: 'https://kegalucakehub.pages.dev/', file: 'shots/mobile.png' });
  } finally {
    brave.kill();
  }
})();
