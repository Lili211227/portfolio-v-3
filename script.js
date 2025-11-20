// ==============================
// script.js — Fixed & Feature-complete
// Matches IDs in your HTML exactly
// ==============================

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

/* --- Mobile menu (checkbox pattern) --- */
const menuCheckbox = $('#check');
const menuIcon = $('#menu');
const navLinksContainer = $('.nav-links');

if (menuIcon && menuCheckbox) {
  menuIcon.addEventListener('click', () => menuCheckbox.checked = !menuCheckbox.checked);
}

// close on nav link click
if (navLinksContainer && menuCheckbox) {
  navLinksContainer.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a && menuCheckbox.checked) setTimeout(() => menuCheckbox.checked = false, 50);
  });
}

/* --- Theme switcher & persistence --- */
const themeSelect = $('#theme');
const modeToggle = $('#mode-toggle');
const THEME_KEY = 'lili_theme_v1';

function applyTheme(theme) {
  document.body.classList.remove('theme1','theme2','theme3','theme4','dark-theme');
  if (!theme) theme = 'theme1';
  document.body.classList.add(theme);
  if (themeSelect) themeSelect.value = theme;
  try { localStorage.setItem(THEME_KEY, theme); } catch(e){}
}

if (themeSelect) {
  const stored = (() => { try { return localStorage.getItem(THEME_KEY); } catch(e) { return null; } })();
  applyTheme(stored || themeSelect.value || 'theme1');
  themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));
}

if (modeToggle) {
  modeToggle.addEventListener('click', () => {
    // toggle between theme4 (light) and currently stored theme (or theme1)
    const cur = document.body.classList.contains('theme4') ? 'theme4' : (localStorage.getItem(THEME_KEY) || 'theme1');
    if (cur !== 'theme4') applyTheme('theme4');
    else applyTheme('theme1');
  });
}

/* --- Help popup --- */
const helpBtn = $('#help-btn');
const helpModal = $('#help-popup');
const helpClose = $('#help-close');

if (helpBtn && helpModal && helpClose) {
  const open = () => {
    helpModal.classList.add('open');
    helpModal.setAttribute('aria-hidden','false');
    helpClose.focus();
  };
  const close = () => {
    helpModal.classList.remove('open');
    helpModal.setAttribute('aria-hidden','true');
    helpBtn.focus();
  };
  helpBtn.addEventListener('click', open);
  helpClose.addEventListener('click', close);
  window.addEventListener('click', (e) => { if (e.target === helpModal) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && helpModal.classList.contains('open')) close(); });
} else {
  console.info('Help popup elements missing:', !!helpBtn, !!helpModal, !!helpClose);
}

/* --- Profile upload preview --- */
const profileUpload = $('#upload-photo');
const profilePreview = $('#profile-preview');

if (profileUpload && profilePreview) {
  profileUpload.addEventListener('change', function () {
    const f = this.files && this.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    profilePreview.src = url;
    profilePreview.onload = () => { try { URL.revokeObjectURL(url); } catch(e){} };
  });
} else {
  console.info('Profile upload elements missing:', !!profileUpload, !!profilePreview);
}

/* --- Smooth scroll (account for sticky header) --- */
const header = $('header.header');
const headerHeight = header ? header.getBoundingClientRect().height : 0;
const navAnchors = $$('.nav-links a[href^="#"]');

navAnchors.forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
    if (menuCheckbox) menuCheckbox.checked = false;
  });
});

/* --- Fade-in using IntersectionObserver --- */
const fades = $$('.fade-in');
if ('IntersectionObserver' in window && fades.length) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  fades.forEach(el => io.observe(el));
} else {
  fades.forEach(el => el.classList.add('visible'));
}

/* --- Typing effect --- */
(function(){
  const t = $('#typing-text');
  if (!t) return;
  const names = ['Lili', 'Lielt', 'Lili Biniyam', 'Frontend Dev'];
  let si = 0, ci = 0, del = false;
  function step(){
    const full = names[si];
    t.textContent = full.slice(0, ci);
    if (!del) { ci++; if (ci > full.length) { del = true; setTimeout(step, 900); return; } }
    else { ci--; if (ci < 0) { del = false; si = (si+1)%names.length; ci = 0; } }
    setTimeout(step, del ? 60 : 120);
  }
  step();
})();

/* --- Back to top --- */
const backBtn = $('#back-to-top');
if (backBtn) {
  backBtn.style.display = 'none';
  window.addEventListener('scroll', () => backBtn.style.display = (window.scrollY > window.innerHeight/2) ? 'flex' : 'none');
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* --- Footer year --- */
const yearSpan = $('#year');
if (yearSpan) yearSpan.textContent = (new Date()).getFullYear();

/* --- global error logging to help debug --- */
window.addEventListener('error', (e) => console.error('Captured error:', e.message));
