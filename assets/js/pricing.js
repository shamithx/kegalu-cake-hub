import { cakePrices } from './config.js';
import {
  buildOrderMessage,
  getPrice,
  priceLabel,
  whatsappUrl,
  designLabel,
  weightLabel,
  flavorLabel,
} from './pricing-core.js';

const form = document.getElementById('price-form');
const valueEl = document.getElementById('price-value');
const noteEl = document.getElementById('price-note');
const orderLink = document.getElementById('price-order');
const summaryWeight = document.getElementById('summary-weight');
const summaryFlavor = document.getElementById('summary-flavor');
const summaryDesign = document.getElementById('summary-design');
const designSelect = document.getElementById('price-design');

if (form && valueEl && noteEl && orderLink) {
  const update = () => {
    const weight = form.querySelector('input[name="weight"]:checked')?.value;
    const flavor = form.querySelector('input[name="flavor"]:checked')?.value;
    if (!weight || !flavor) return;

    const design = designSelect?.value || '';
    const price = getPrice(weight, flavor);
    const label = priceLabel(price);

    valueEl.textContent = label;
    valueEl.classList.toggle('is-pending', price === null);
    noteEl.textContent =
      price === null
        ? 'This combination has not been priced on the website yet. Message us and we will confirm the price before you order.'
        : cakePrices.note;

    if (summaryWeight) summaryWeight.textContent = weightLabel(weight);
    if (summaryFlavor) summaryFlavor.textContent = flavorLabel(flavor);
    if (summaryDesign) summaryDesign.textContent = designLabel(design);

    orderLink.href = whatsappUrl(buildOrderMessage({ weight, flavor, design }));
  };

  form.addEventListener('change', update);
  update();
}
