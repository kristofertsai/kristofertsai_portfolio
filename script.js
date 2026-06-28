/*
  Static portfolio interactions
  -----------------------------
  Vanilla JavaScript only. No frameworks, no build step, and no backend.
*/

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');
const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeMobileNav() {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
  document.body.classList.remove('nav-open');
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('open', !isOpen);
    document.body.classList.toggle('nav-open', !isOpen);
  });
}

navItems.forEach((link) => {
  link.addEventListener('click', closeMobileNav);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      navItems.forEach((link) => link.classList.remove('active'));
      if (activeLink) activeLink.classList.add('active');
    });
  },
  {
    threshold: 0.28,
    rootMargin: '-20% 0px -55% 0px'
  }
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMobileNav();
  }
});
