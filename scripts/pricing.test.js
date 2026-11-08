import test from 'node:test';
import assert from 'node:assert/strict';
import { cakePrices, site } from '../assets/js/config.js';
import {
  buildOrderMessage,
  designLabel,
  formatPrice,
  getPrice,
  priceLabel,
  whatsappUrl,
} from '../assets/js/pricing-core.js';

test('unconfirmed prices render as Price to be confirmed', () => {
  assert.equal(getPrice('500g', 'vanilla'), null);
  assert.equal(getPrice('1kg', 'chocolate'), null);
  assert.equal(formatPrice(null), null);
  assert.equal(priceLabel(null), 'Price to be confirmed');
});

test('formatPrice uses the configured currency and thousands separators', () => {
  assert.equal(formatPrice(2500), 'Rs. 2,500');
  assert.equal(formatPrice(8000), 'Rs. 8,000');
  assert.equal(priceLabel('not a price'), 'Price to be confirmed');
});

test('order message uses the selected weight, flavour and design without inventing a price', () => {
  const message = buildOrderMessage({ weight: '1kg', flavor: 'chocolate', design: 'classic' });
  assert.match(message, /Weight: 1kg/);
  assert.match(message, /Flavour: Chocolate/);
  assert.match(message, /Design: Classic cream finish/);
  assert.match(message, /Price shown on website: Price to be confirmed/);
  assert.doesNotMatch(message, /Rs\./);
});

test('each price is looked up independently and 1kg is never calculated from 500g', () => {
  const original = cakePrices.prices['500g'].vanilla;
  try {
    cakePrices.prices['500g'].vanilla = 2500;
    assert.equal(getPrice('500g', 'vanilla'), 2500);
    assert.equal(getPrice('500g', 'chocolate'), null);
    assert.equal(getPrice('1kg', 'vanilla'), null);

    const fiveHundred = buildOrderMessage({ weight: '500g', flavor: 'vanilla', design: 'classic' });
    assert.match(fiveHundred, /Price shown on website: Rs\. 2,500/);

    const oneKilo = buildOrderMessage({ weight: '1kg', flavor: 'vanilla', design: 'classic' });
    assert.match(oneKilo, /Price shown on website: Price to be confirmed/);
    assert.doesNotMatch(oneKilo, /Rs\. 5,000/);
  } finally {
    cakePrices.prices['500g'].vanilla = original;
  }
});

test('numeric strings from the config are treated as prices', () => {
  const original = cakePrices.prices['1kg'].chocolate;
  try {
    cakePrices.prices['1kg'].chocolate = '5200';
    assert.equal(getPrice('1kg', 'chocolate'), 5200);
  } finally {
    cakePrices.prices['1kg'].chocolate = original;
  }
});

test('WhatsApp URL uses the business number and encodes line breaks', () => {
  const message = 'Hello & welcome\nWeight: 500g';
  const url = whatsappUrl(message);
  assert.ok(url.startsWith(`https://wa.me/${site.whatsappNumber}?text=`));
  assert.ok(url.includes(encodeURIComponent(message)));
  assert.ok(!url.includes('\n'));
});

test('design labels accept ids, labels and fall back safely', () => {
  assert.equal(designLabel('classic'), 'Classic cream finish');
  assert.equal(designLabel('Classic cream finish'), 'Classic cream finish');
  assert.equal(designLabel(''), 'Not specified');
});
