// ===== Finance Tools - Global JS =====

// FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      const isOpen = q.classList.contains('open');
      // close all
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

// Number formatting
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

// Show results
function showResults() {
  document.querySelectorAll('.calc-results').forEach(el => el.classList.add('show'));
}
function hideResults() {
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
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };
}

// Inject FAQ schema
function injectFaqSchema(faqItems) {
  const schema = buildFaqSchema(faqItems);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
