/* script.js — Sajan Bajgain Portfolio */

// ── MOBILE MENU ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mmLinks = document.querySelectorAll('.mm-link');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

mmLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── ACTIVE NAV LINK ──────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observerNav.observe(s));

// ── CANVAS GRID BACKGROUND ───────────────────────────────
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');

let W, H, cols, rows;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  cols = Math.ceil(W / 60);
  rows = Math.ceil(H / 60);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const nodes = [];

function initNodes() {
  nodes.length = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (Math.random() > 0.85) {
        nodes.push({
          x: i * 60 + 30,
          y: j * 60 + 30,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    }
  }
}

initNodes();

function drawGrid() {
  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(57,211,83,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Nodes and connections
  nodes.forEach(node => {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > W) node.vx *= -1;
    if (node.y < 0 || node.y > H) node.vy *= -1;

    // Connect nearby nodes
    nodes.forEach(other => {
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180 && dist > 0) {
        ctx.strokeStyle = `rgba(57,211,83,${0.15 * (1 - dist / 180)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    });

    // Draw node dot
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(57,211,83,${node.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawGrid);
}

// Only run canvas on non-mobile for performance
if (window.innerWidth > 768) {
  drawGrid();
} else {
  canvas.style.display = 'none';
}

// ── TYPED ROLE EFFECT ─────────────────────────────────────
const roles = [
  'IT Support L1/L2 Specialist',
  'SOC Analyst Tier 1 & 2',
  'Cybersecurity Graduate',
  'Jr. Systems Administrator',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-role');

function typeLoop() {
  if (!typedEl) return;
  const current = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 70;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  setTimeout(typeLoop, delay);
}

setTimeout(typeLoop, 1200);

// ── SCROLL REVEAL ─────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.about-text, .about-aside, .skill-block, .cert-row, .tl-item, .contact-left, .contact-right, .section-label, .section-heading'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 0.04}s`;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// ── CONTACT FORM ──────────────────────────────────────────
const form = document.getElementById('contactForm');
const successEl = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
      } else {
        btn.disabled = false;
        btn.textContent = 'Try Again';
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Try Again';
    }
  });
}

// ── NAV SCROLL STYLE ──────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(7,11,15,0.97)';
  } else {
    nav.style.background = 'rgba(7,11,15,0.85)';
  }
});
