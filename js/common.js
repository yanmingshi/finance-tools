// ===== Finance Tools - Global JS =====

// ===== Validation =====
function validateField(id, rules) {
  const el = document.getElementById(id);
  if (!el) return true;
  const val = parseFloat(el.value.replace(/[^0-9.\-]/g, ''));
  const group = el.closest('.form-group');
  const errorEl = group ? group.querySelector('.form-error') : null;

  // Clear previous error
  if (group) group.classList.remove('has-error');
  if (errorEl) { errorEl.classList.remove('show'); errorEl.textContent = ''; }

  for (const rule of rules) {
    if (rule.required && (el.value.trim() === '' || isNaN(val))) {
      showFieldError(group, errorEl, rule.msg || 'This field is required');
      return false;
    }
    if (rule.min !== undefined && val < rule.min) {
      showFieldError(group, errorEl, rule.msg || `Value must be at least ${rule.min}`);
      return false;
    }
    if (rule.max !== undefined && val > rule.max) {
      showFieldError(group, errorEl, rule.msg || `Value must be at most ${rule.max}`);
      return false;
    }
    if (rule.positive && val <= 0) {
      showFieldError(group, errorEl, rule.msg || 'Value must be greater than 0');
      return false;
    }
    if (rule.custom && !rule.custom(val)) {
      showFieldError(group, errorEl, rule.msg || 'Invalid value');
      return false;
    }
  }
  return true;
}

function showFieldError(group, errorEl, msg) {
  if (group) group.classList.add('has-error');
  if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('show'); }
}

function clearAllErrors() {
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
  document.querySelectorAll('.form-error').forEach(e => { e.classList.remove('show'); e.textContent = ''; });
}

// ===== Combo Input (editable dropdown with search) =====
function initCombo(id, options) {
  const container = document.getElementById(id);
  if (!container) return;
  const input = container.querySelector('input');
  const dropdown = container.querySelector('.combo-dropdown');
  const toggle = container.querySelector('.combo-toggle');

  function renderOptions(filter) {
    if (!dropdown) return;
    dropdown.innerHTML = '';
    const filterLower = (filter || '').toLowerCase();
    const filtered = filterLower
      ? options.filter(o => (typeof o === 'object' ? o.value : o).toLowerCase().includes(filterLower))
      : options;
    filtered.forEach(opt => {
      const div = document.createElement('div');
      div.className = 'combo-option';
      if (typeof opt === 'object') {
        div.innerHTML = opt.value + (opt.desc ? `<span class="combo-desc">${opt.desc}</span>` : '');
        div.dataset.value = opt.value;
      } else {
        div.textContent = opt;
        div.dataset.value = opt;
      }
      div.addEventListener('mousedown', (e) => {
        e.preventDefault(); // prevent blur
        input.value = div.dataset.value;
        dropdown.classList.remove('show');
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      dropdown.appendChild(div);
    });
  }

  // Populate options (initial full list)
  renderOptions('');

  // Toggle dropdown
  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      renderOptions(input.value);
      dropdown.classList.toggle('show');
    });
  }

  // Show dropdown on focus, filter on input
  if (input) {
    input.addEventListener('focus', () => {
      renderOptions(input.value);
      dropdown.classList.add('show');
    });
    input.addEventListener('input', () => {
      renderOptions(input.value);
      dropdown.classList.add('show');
    });
    // Close on blur (with delay to allow click)
    input.addEventListener('blur', () => {
      setTimeout(() => dropdown.classList.remove('show'), 200);
    });
  }
}

// ===== FAQ Accordion =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      const isOpen = q.classList.contains('open');
      q.closest('.faq-section, .content-section')?.querySelectorAll('.faq-question').forEach(x => {
        x.classList.remove('open');
        x.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        q.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
});

// ===== Number formatting =====
const fmt = {
  currency: (n, decimals = 2) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
  percent: (n, decimals = 2) => Number(n).toFixed(decimals) + '%',
  number: (n, decimals = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
  years: (n) => {
    const y = Math.floor(n);
    const m = Math.round((n - y) * 12);
    let s = y + (y === 1 ? ' year' : ' years');
    if (m > 0) s += ', ' + m + (m === 1 ? ' month' : ' months');
    return s;
  }
};

// Parse input helpers
function getVal(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const v = parseFloat(el.value.replace(/[^0-9.\-]/g, ''));
  return isNaN(v) ? 0 : v;
}
function getSelect(id) {
  return document.getElementById(id)?.value || '';
}

// Show/hide results
function showResults() {
  document.querySelector('.calc-box')?.classList.add('has-results');
  document.querySelectorAll('.calc-results').forEach(el => el.classList.add('show'));
}
function hideResults() {
  document.querySelector('.calc-box')?.classList.remove('has-results');
  document.querySelectorAll('.calc-results').forEach(el => el.classList.remove('show'));
}

// Set result value
function setResult(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// Schema.org FAQ data generation
function buildFaqSchema(faqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  };
}

function injectFaqSchema(faqItems) {
  const schema = buildFaqSchema(faqItems);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
