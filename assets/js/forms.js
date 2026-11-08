import { whatsappUrl } from './pricing-core.js';

const todayValue = (() => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
})();

function digits(value) {
  return value.replace(/\D/g, '');
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function errorFor(form, name) {
  return form.querySelector(`[data-error-for="${name}"]`);
}

function setError(form, name, message) {
  const field = form.elements.namedItem(name);
  const error = errorFor(form, name);
  if (field instanceof HTMLElement) field.setAttribute('aria-invalid', 'true');
  if (error) error.textContent = message;
}

function clearError(form, name) {
  const field = form.elements.namedItem(name);
  const error = errorFor(form, name);
  if (field instanceof HTMLElement) field.removeAttribute('aria-invalid');
  if (error) error.textContent = '';
}

function validateEnquiry(form) {
  const get = (name) => String(form.elements.namedItem(name)?.value || '').trim();
  const errors = [];

  if (get('name').length < 2) {
    setError(form, 'name', 'Please enter your name.');
    errors.push('name');
  }
  if (digits(get('contact')).length < 7) {
    setError(form, 'contact', 'Please enter a WhatsApp or contact number with at least 7 digits.');
    errors.push('contact');
  }
  if (!get('event')) {
    setError(form, 'event', 'Please choose an event type.');
    errors.push('event');
  }
  if (!get('date')) {
    setError(form, 'date', 'Please choose your event date.');
    errors.push('date');
  } else if (get('date') < todayValue) {
    setError(form, 'date', 'Please choose today or a future date.');
    errors.push('date');
  }
  if (!get('category')) {
    setError(form, 'category', 'Please choose a product category.');
    errors.push('category');
  }
  if (!get('quantity')) {
    setError(form, 'quantity', 'Please tell us the quantity or size you need.');
    errors.push('quantity');
  }
  if (get('reference') && !isHttpUrl(get('reference'))) {
    setError(form, 'reference', 'Enter a full link starting with https://, or leave this blank.');
    errors.push('reference');
  }

  return errors;
}

function validateContact(form) {
  const get = (name) => String(form.elements.namedItem(name)?.value || '').trim();
  const errors = [];

  if (get('name').length < 2) {
    setError(form, 'name', 'Please enter your name.');
    errors.push('name');
  }
  if (digits(get('contact')).length < 7) {
    setError(form, 'contact', 'Please enter a WhatsApp or contact number with at least 7 digits.');
    errors.push('contact');
  }
  if (get('message').length < 5) {
    setError(form, 'message', 'Please write a short message so we can help.');
    errors.push('message');
  }

  return errors;
}

function buildQuoteMessage(form) {
  const get = (name) => String(form.elements.namedItem(name)?.value || '').trim();
  const lines = [
    'Hello Kegalu Cake Hub! I would like to request a quote.',
    '',
    `Name: ${get('name')}`,
    `WhatsApp / contact: ${get('contact')}`,
    `Event type: ${get('event')}`,
    `Event date: ${formatDate(get('date'))}`,
    `Product category: ${get('category')}`,
    `Quantity / size: ${get('quantity')}`,
  ];

  if (get('theme')) lines.push(`Preferred design / theme: ${get('theme')}`);
  if (get('budget')) lines.push(`Budget: ${get('budget')}`);
  if (get('reference')) lines.push(`Reference: ${get('reference')}`);
  if (get('notes')) lines.push('', 'Additional requirements:', get('notes'));

  lines.push('', 'Please confirm availability and the final price. Thank you!');
  return lines.join('\n');
}

function buildContactMessage(form) {
  const get = (name) => String(form.elements.namedItem(name)?.value || '').trim();
  return [
    'Hello Kegalu Cake Hub! I have a question.',
    '',
    `Name: ${get('name')}`,
    `WhatsApp / contact: ${get('contact')}`,
    '',
    get('message'),
    '',
    'Thank you!',
  ].join('\n');
}

function showStatus(form, type, message, linkUrl, linkText) {
  const status = form.querySelector('.form-status');
  if (!status) return;

  status.className = `form-status form-status--${type} is-visible`;
  status.textContent = message;

  if (linkUrl && linkText) {
    const link = document.createElement('a');
    link.href = linkUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = linkText;
    status.append(link);
  }
}

document.querySelectorAll('form[data-form]').forEach((form) => {
  const isEnquiry = form.dataset.form === 'enquiry';
  const validate = isEnquiry ? validateEnquiry : validateContact;

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    if (!field.name) return;
    const eventName = field.tagName === 'SELECT' || field.type === 'date' ? 'change' : 'input';
    field.addEventListener(eventName, () => clearError(form, field.name));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.querySelectorAll('[data-error-for]').forEach((error) => {
      error.textContent = '';
    });
    form.querySelectorAll('[aria-invalid]').forEach((field) => field.removeAttribute('aria-invalid'));

    const errors = validate(form);
    if (errors.length) {
      showStatus(form, 'error', 'Please check the highlighted fields and try again.');
      form.elements.namedItem(errors[0])?.focus();
      return;
    }

    const message = isEnquiry ? buildQuoteMessage(form) : buildContactMessage(form);
    const url = whatsappUrl(message);

    window.open(url, '_blank', 'noopener');
    showStatus(
      form,
      'ok',
      'Your message is ready. If WhatsApp did not open automatically, use this link: ',
      url,
      'Open WhatsApp to send it.',
    );

    const status = form.querySelector('.form-status');
    if (status) {
      status.append(document.createTextNode(' Nothing is sent until you press send in WhatsApp.'));
    }
  });
});

const dateInput = document.getElementById('enq-date');
if (dateInput) dateInput.min = todayValue;

const enquiryForm = document.getElementById('enquiry-form');
const categorySelect = document.getElementById('enq-category');
if (categorySelect) {
  const preselected = new URLSearchParams(window.location.search).get('category');
  if (preselected && [...categorySelect.options].some((option) => option.value === preselected)) {
    categorySelect.value = preselected;
  }
}

document.querySelectorAll('[data-enquire-category]').forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.enquireCategory;
    if (categorySelect && [...categorySelect.options].some((option) => option.value === value)) {
      categorySelect.value = value;
      if (enquiryForm) clearError(enquiryForm, 'category');
    }
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('enq-name')?.focus({ preventScroll: true });
  });
});
