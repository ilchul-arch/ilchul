/* ============================================
   일철 — main.js
   모든 인터랙션 및 기능 처리
   ============================================ */

// ─── Header scroll effect ───────────────────
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  // Show/hide floating scroll-top button
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) scrollTopBtn.style.opacity = window.scrollY > 400 ? '1' : '0.4';
}, { passive: true });

// ─── Mobile hamburger ────────────────────────
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('mainNav');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('open');
});
// Close nav on link click
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
  });
});

// ─── Scroll-to-top ───────────────────────────
document.getElementById('scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Smooth scroll for anchor links ─────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── Scroll-reveal animation ─────────────────
const animateObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animateObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('[data-animate]').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  animateObserver.observe(el);
});

// ─── Counter animation ────────────────────────
function animateCounter(el, target, isFloat, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = eased * target;
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString('ko-KR');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString('ko-KR');
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stats__number').forEach(numEl => {
        const isFloat = numEl.dataset.float === 'true';
        const target = isFloat ? parseFloat(numEl.dataset.target) : parseInt(numEl.dataset.target, 10);
        animateCounter(numEl, target, isFloat);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

// ─── Gallery tabs ─────────────────────────────
const tabs = document.querySelectorAll('.gallery__tab');
const grids = document.querySelectorAll('.gallery__grid');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Update tabs
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update grids
    grids.forEach(grid => {
      grid.classList.remove('active');
      if (grid.id === `gallery-${target}`) {
        grid.classList.add('active');
      }
    });
  });
});

// ─── Image modal ──────────────────────────────
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');

document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.dataset.src;
    const alt = item.querySelector('img')?.alt || '';
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { modalImg.src = ''; }, 300);
}
modalClose?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─── Toast notification ───────────────────────
function showToast(msg, type = 'success', duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.classList.remove('show'); }, duration);
}

// ─── Estimate form ────────────────────────────
const estimateForm = document.getElementById('estimateForm');

function getVal(id) { return document.getElementById(id)?.value.trim() || ''; }
function setError(id, msg) {
  const errEl = document.getElementById(`${id}Error`);
  const inputEl = document.getElementById(id);
  if (errEl) errEl.textContent = msg;
  if (inputEl) inputEl.classList.toggle('error', !!msg);
}
function clearErrors() {
  ['name', 'phone', 'address', 'service'].forEach(id => setError(id, ''));
}

function validateForm() {
  clearErrors();
  let valid = true;
  const name = getVal('name');
  const phone = getVal('phone');
  const address = getVal('address');
  const service = getVal('service');

  if (!name) { setError('name', '성함을 입력해주세요.'); valid = false; }
  if (!phone) {
    setError('phone', '연락처를 입력해주세요.'); valid = false;
  } else if (!/^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}$/.test(phone.replace(/\s/g, ''))) {
    setError('phone', '올바른 전화번호를 입력해주세요.'); valid = false;
  }
  if (!address) { setError('address', '시공 주소를 입력해주세요.'); valid = false; }
  if (!service) { setError('service', '서비스 종류를 선택해주세요.'); valid = false; }

  return valid;
}

const serviceLabels = {
  demolition: '철거',
  interior: '인테리어',
  scrap: '잡철 수거',
  combined: '복합 시공',
};

estimateForm?.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm()) return;

  const name = getVal('name');
  const phone = getVal('phone');
  const address = getVal('address');
  const service = getVal('service');
  const message = getVal('message');
  const serviceName = serviceLabels[service] || service;

  // Compose mailto link
  const subject = encodeURIComponent(`[일출 견적신청] ${name} - ${serviceName}`);
  const body = encodeURIComponent(
    `[견적 신청 정보]\n\n` +
    `성함: ${name}\n` +
    `연락처: ${phone}\n` +
    `시공 주소: ${address}\n` +
    `서비스 종류: ${serviceName}\n` +
    `추가 요청사항: ${message || '없음'}\n\n` +
    `---\n일출 홈페이지를 통해 접수된 견적 신청입니다.`
  );

  window.location.href = `mailto:jjyjjy4189@hanmail.net?subject=${subject}&body=${body}`;

  // Show success feedback
  showToast('✅ 견적 신청서가 이메일로 전송됩니다!', 'success', 4000);

  // Reset form after short delay
  setTimeout(() => {
    estimateForm.reset();
    clearErrors();
  }, 500);
});

// ─── Hero background subtle parallax ─────────
const heroBg = document.getElementById('heroBg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
}

// ─── Active nav link on scroll ────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--clr-accent)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(sec => navObserver.observe(sec));

console.log('✅ 일출 홈페이지 초기화 완료');
