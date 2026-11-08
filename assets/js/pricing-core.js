import { cakePrices, site } from './config.js';

export function getPrice(weightId, flavorId) {
  const value = cakePrices.prices?.[weightId]?.[flavorId];
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatPrice(price) {
  return typeof price === 'number' && Number.isFinite(price)
    ? `${cakePrices.symbol} ${price.toLocaleString('en-US')}`
    : null;
}

export function priceLabel(price) {
  return formatPrice(price) || 'Price to be confirmed';
}

export function weightLabel(weightId) {
  return cakePrices.weights.find((weight) => weight.id === weightId)?.label || weightId;
}

export function flavorLabel(flavorId) {
  return cakePrices.flavors.find((flavor) => flavor.id === flavorId)?.label || flavorId;
}

export function designLabel(value) {
  if (!value) return 'Not specified';
  const design = cakePrices.designs.find((item) => item.id === value || item.label === value);
  return design?.label || value;
}

export function whatsappUrl(message) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage({ weight, flavor, design }) {
  const price = getPrice(weight, flavor);
  return [
    'Hello Kegalu Cake Hub! I would like to order a cake.',
    `Weight: ${weightLabel(weight)}`,
    `Flavour: ${flavorLabel(flavor)}`,
    `Design: ${designLabel(design)}`,
    `Price shown on website: ${priceLabel(price)}`,
    'Please confirm availability and the final price before I order. Thank you!',
  ].join('\n');
}
