// ===== CURSOR ORB =====
const cursorOrb = document.getElementById('cursor-orb');
let mx = -100, my = -100, cx = -100, cy = -100;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursorOrb.style.left = cx + 'px';
  cursorOrb.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== FIREFLY CANVAS =====
const canvas = document.getElementById('firefly-canvas');
const ctx = canvas.getContext('2d');
let flies = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createFly() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.5 + 1,
    alpha: Math.random() * 0.6 + 0.2,
    alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.006,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    hue: Math.random() > 0.7 ? 200 : 260
  };
}

for (let i = 0; i < 55; i++) flies.push(createFly());

function drawFlies() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  flies.forEach(f => {
    f.x += f.vx; f.y += f.vy;
    f.alpha += f.alphaDir;
    if (f.alpha > 0.85 || f.alpha < 0.08) f.alphaDir *= -1;
    if (f.x < 0) f.x = canvas.width;
    if (f.x > canvas.width) f.x = 0;
    if (f.y < 0) f.y = canvas.height;
    if (f.y > canvas.height) f.y = 0;

    const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
    grd.addColorStop(0, `hsla(${f.hue},100%,70%,${f.alpha})`);
    grd.addColorStop(1, `hsla(${f.hue},100%,60%,0)`);
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r * 5, 0, Math.PI * 2);
    ctx.fillStyle = grd; ctx.fill();
  });
  requestAnimationFrame(drawFlies);
}
drawFlies();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE NAV TOGGLE =====
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

// ===== MUSIC =====
const music = document.getElementById('bg-music');
const musicControl = document.getElementById('music-control');
const musicIcon = document.getElementById('music-icon');
const musicLabel = document.getElementById('music-label');
let musicPlaying = false;

musicControl.addEventListener('click', () => {
  if (musicPlaying) {
    music.pause();
    musicIcon.className = 'fas fa-volume-mute';
    musicLabel.textContent = 'Muted';
    musicPlaying = false;
  } else {
    music.play().catch(() => {});
    musicIcon.className = 'fas fa-music';
    musicLabel.textContent = 'Music';
    musicPlaying = true;
  }
});

// Try autoplay
window.addEventListener('click', () => {
  if (!musicPlaying) {
    music.play().then(() => { musicPlaying = true; }).catch(() => {});
  }
}, { once: true });

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars
      const fill = e.target.querySelector('.skill-fill');
      if (fill) {
        setTimeout(() => {
          fill.style.width = fill.dataset.width + '%';
        }, 200);
      }
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== MODALS =====
function openModal(name) {
  const modal = document.getElementById('modal-' + name);
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModalBtn(name) {
  const modal = document.getElementById('modal-' + name);
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}
function closeModal(e, name) {
  if (e.target === document.getElementById('modal-' + name)) closeModalBtn(name);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open'); document.body.style.overflow = '';
    });
  }
});

// ===== CONTACT FORM =====
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    document.getElementById('form-success').style.display = 'block';
    e.target.reset();
    setTimeout(() => { document.getElementById('form-success').style.display = 'none'; }, 5000);
  }, 1500);
}
