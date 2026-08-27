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
const experienceTabs = document.querySelectorAll('.experience-tab');
const experiencePanels = document.querySelectorAll('.experience-panel');
const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeMobileNav({ restoreFocus = false } = {}) {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
  navLinks.classList.remove('open');
  document.body.classList.remove('nav-open');
  if (restoreFocus) navToggle.focus();
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navLinks.classList.toggle('open', !isOpen);
    document.body.classList.toggle('nav-open', !isOpen);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMobileNav();
    }
  });
}

navItems.forEach((link) => {
  link.addEventListener('click', closeMobileNav);
});

function activateExperienceTab(tab) {
  const tabName = tab.dataset.tab;

  experienceTabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-selected', String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  experiencePanels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== tabName;
  });
}

experienceTabs.forEach((tab, index) => {
  tab.tabIndex = tab.classList.contains('active') ? 0 : -1;

  tab.addEventListener('click', () => {
    activateExperienceTab(tab);
  });

  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    let nextIndex;
    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = experienceTabs.length - 1;
    else {
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      nextIndex = (index + direction + experienceTabs.length) % experienceTabs.length;
    }
    experienceTabs[nextIndex].focus();
    activateExperienceTab(experienceTabs[nextIndex]);
  });
});

if ('IntersectionObserver' in window) {
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
        navItems.forEach((link) => {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        });
        if (activeLink) {
          activeLink.classList.add('active');
          activeLink.setAttribute('aria-current', 'location');
        }
      });
    },
    {
      threshold: 0.28,
      rootMargin: '-20% 0px -55% 0px'
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const wasOpen = navToggle?.getAttribute('aria-expanded') === 'true';
    closeMobileNav({ restoreFocus: wasOpen });
  }
});
