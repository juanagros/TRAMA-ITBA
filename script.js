/* ============================================================
   TRAMA ITBA — Scripts
   ============================================================ */

/* ----- Hamburger Menu ----- */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Cerrar menú al hacer click en un enlace (mobile)
navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Cerrar menú si se hace click fuera
document.addEventListener('click', (e) => {
  if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});


/* ----- Scroll Reveal (Intersection Observer) ----- */
const sections = document.querySelectorAll('main section');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

sections.forEach((section, index) => {
  // Escalonar la animación de entrada
  section.style.transitionDelay = `${index * 0.07}s`;
  revealObserver.observe(section);
});

/* ----- Navbar: marcar link activo al hacer scroll ----- */
const navLinks = document.querySelectorAll('.navbar a[href^="#"]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => navObserver.observe(section));

/* ----- Smooth scroll con offset para la navbar sticky ----- */
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ----- Botón Scroll to Top ----- */
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ----- Lightbox for galleries ----- */
function createLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Cerrar">✕</button><img src="" alt=""/>';
  document.body.appendChild(overlay);
  const img = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lightbox-close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('visible');
    img.src = '';
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) close();
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  return { open, close };
}

const lightbox = createLightbox();

document.querySelectorAll('.photo-gallery img').forEach((thumb) => {
  thumb.style.cursor = 'zoom-in';
  thumb.addEventListener('click', () => {
    // open the optimized image in the lightbox; if thumb src is a thumbnail, use its src
    lightbox.open(thumb.src, thumb.alt);
  });
});
