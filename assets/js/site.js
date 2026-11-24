/* Site: sticky header, mobile menu, active nav link, work filter, scroll animations */
(function () {
  'use strict';

  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav-toggle');

  // Header shadow once the page scrolls
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  // First check on the next frame: reading scrollY during page load forces a synchronous layout before first paint
  requestAnimationFrame(onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.innerHTML = '<i class="bi bi-list"></i>';
  };
  toggle.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    if (!open) return closeMenu();
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    toggle.innerHTML = '<i class="bi bi-x-lg"></i>';
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // The active menu link is set per page in the HTML (aria-current="page")

  // FAQ: keep one answer open at a time
  const faqs = document.querySelectorAll('.faq-list details');
  faqs.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
  }));

  // Work filter
  const filterBtns = document.querySelectorAll('.filters button');
  const cards = document.querySelectorAll('.polaroid');
  filterBtns.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
    cards.forEach((card) => { card.hidden = !(f === 'all' || card.dataset.cat === f); });
  }));

  // Colour theme picker (footer). The saved choice is applied early by a tiny script in <head>.
  const swatches = document.querySelectorAll('[data-theme-set]');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const applyTheme = (t) => {
    if (t === 'forest') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    swatches.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === t)));
    if (metaTheme) metaTheme.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--forest').trim());
  };
  // Each page sets its default in <html data-theme>; a visitor's saved choice takes priority.
  let saved = document.documentElement.getAttribute('data-theme') || 'forest';
  try { saved = localStorage.getItem('vm-theme') || saved; } catch (e) {}
  if (document.querySelector(`[data-theme-set="${saved}"]`)) applyTheme(saved);
  swatches.forEach((b) => b.addEventListener('click', () => {
    applyTheme(b.dataset.themeSet);
    try { localStorage.setItem('vm-theme', b.dataset.themeSet); } catch (e) {}
  }));

  // Theme button in the main menu: opens a small swatch panel (always open inside the mobile menu)
  const navTheme = document.querySelector('.nav-theme');
  if (navTheme) {
    const ntBtn = navTheme.querySelector('.nt-btn');
    const setOpen = (open) => {
      navTheme.classList.toggle('is-open', open);
      ntBtn.setAttribute('aria-expanded', String(open));
    };
    ntBtn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!navTheme.classList.contains('is-open')); });
    navTheme.querySelectorAll('.tp-swatch').forEach((b) => b.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', (e) => { if (!navTheme.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // Scroll animations
  // Started at DOMContentLoaded (AOS default), not window load, so content isn't hidden while images/video download
  if (window.AOS) AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
})();
