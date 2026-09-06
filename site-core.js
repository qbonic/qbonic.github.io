/**
 * site-core.js — Qbonic Website Shared JS Core
 *
 * Consolidates all shared logic across marketing and documentation pages
 * into a single cached module.
 *
 * Modules:
 *   1. ThemeManager         — Synchronous head-side theme resolution + toggle
 *   2. AuthRouter           — Centralised URL builder for app redirects
 *   3. CrossDomainLinkSync  — Universal click interceptor preserving ?theme=
 *   4. NavDrawerManager     — Mobile drawer open/close/escape
 *   5. HeaderScrollObserver — Glassmorphic .scrolled class on scroll
 *   6. FaqAccordion         — FAQ open/close accordion logic
 *   7. SignupHashPulse      — Pulse on #signup navigation
 *   8. NavButtons           — Element ID click bindings
 */

/* ==========================================================================
   1. THEME MANAGER
   Synchronous head IIFE already ran inline in <head> (prevents FOWT).
   This module handles the toggle switch UI and cross-tab sync.
   ========================================================================== */
const ThemeManager = (() => {
  function initSync() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTheme = urlParams.get('theme');
      const savedTheme = urlTheme || localStorage.getItem('qbonic_theme');
      const isLight = savedTheme === 'light' || savedTheme === 'qbonic-light';
      const finalTheme = isLight ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', finalTheme);
      localStorage.setItem('qbonic_theme', finalTheme);
    } catch (e) { /* storage blocked */ }
  }

  function getTheme() {
    const docTheme = document.documentElement.getAttribute('data-theme');
    if (docTheme === 'light' || docTheme === 'qbonic-light') return 'light';
    if (docTheme === 'dark' || docTheme === 'qbonic-dark') return 'dark';
    const toggle = document.getElementById('themeToggle');
    if (toggle) return toggle.checked ? 'light' : 'dark';
    try {
      const saved = localStorage.getItem('qbonic_theme');
      if (saved === 'light' || saved === 'qbonic-light') return 'light';
    } catch (e) { /* storage blocked */ }
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('qbonic_theme', theme); } catch (e) { /* storage blocked */ }
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.checked = (theme === 'light');
  }

  function initToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.checked = (getTheme() === 'light');
    toggle.addEventListener('change', () => {
      applyTheme(toggle.checked ? 'light' : 'dark');
    });
  }

  return { initSync, getTheme, applyTheme, initToggle };
})();

/* ==========================================================================
   2. AUTH ROUTER
   Centralised URL builder for all app redirects (login, signup, demo, pricing, faqs, legal).
   Injects current theme so the app launches in the user's preferred mode.
   ========================================================================== */
const AuthRouter = (() => {
  function _baseUrl(path) {
    const isLocal = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1';
    const base = isLocal ? 'http://localhost:5173' : 'https://console.qbonic.com';
    return `${base}/${path}`;
  }

  function _themed(url) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}theme=${ThemeManager.getTheme()}`;
  }

  function redirectToLogin(e) {
    if (e) e.preventDefault();
    window.location.href = _themed(_baseUrl('?auth=signin'));
  }

  function redirectToSignup(e, plan) {
    if (e) e.preventDefault();
    const planParam = plan ? `&plan=${plan}` : '';
    window.location.href = _themed(_baseUrl(`?auth=signup${planParam}`));
  }

  function redirectToDemo(e) {
    if (e) e.preventDefault();
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'try_demo_click', {
          event_category: 'engagement',
          event_label: (e && e.currentTarget && e.currentTarget.id) || 'website_cta',
          theme: ThemeManager.getTheme()
        });
      } catch (err) { /* non-critical */ }
    }
    window.location.href = _themed(_baseUrl('?demo=true'));
  }

  function redirectToPricing(e) {
    if (e) e.preventDefault();
    window.location.href = _themed(_baseUrl('pricing.html'));
  }

  function redirectToFaqs(e) {
    if (e) e.preventDefault();
    window.location.href = _themed(_baseUrl('detailed_faqs.html'));
  }

  function redirectToPrivacy(e) {
    if (e) e.preventDefault();
    window.location.href = _themed(_baseUrl('privacy.html'));
  }

  function redirectToTerms(e) {
    if (e) e.preventDefault();
    window.location.href = _themed(_baseUrl('terms.html'));
  }

  function redirectToRefund(e) {
    if (e) e.preventDefault();
    window.location.href = _themed(_baseUrl('refund.html'));
  }

  return {
    redirectToLogin,
    redirectToSignup,
    redirectToDemo,
    redirectToPricing,
    redirectToFaqs,
    redirectToPrivacy,
    redirectToTerms,
    redirectToRefund
  };
})();

// Expose as global functions
window.redirectToLogin   = AuthRouter.redirectToLogin;
window.redirectToSignup  = AuthRouter.redirectToSignup;
window.redirectToDemo    = AuthRouter.redirectToDemo;
window.redirectToPricing = AuthRouter.redirectToPricing;
window.redirectToFaqs    = AuthRouter.redirectToFaqs;
window.redirectToPrivacy = AuthRouter.redirectToPrivacy;
window.redirectToTerms   = AuthRouter.redirectToTerms;
window.redirectToRefund  = AuthRouter.redirectToRefund;
window.redirectToApp     = (plan) => AuthRouter.redirectToSignup(null, plan);

/* ==========================================================================
   3. CROSS-DOMAIN LINK THEME PRESERVER
   Universal click interceptor: ensures any link to console or legal/pricing/faq
   pages always includes ?theme=light/dark so theme choice never flickers.
   ========================================================================== */
const CrossDomainLinkSync = (() => {
  function init() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

      const targetPages = ['privacy.html', 'terms.html', 'refund.html', 'pricing.html', 'detailed_faqs.html'];
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const consoleOrigin = isLocal ? 'http://localhost:5173' : 'https://console.qbonic.com';
      const isConsoleUrl = href.includes('console.qbonic.com') || (isLocal && href.includes('localhost:5173'));
      const isTargetPage = targetPages.some(page => href.includes(page));

      if (isConsoleUrl || isTargetPage) {
        e.preventDefault();
        const currentTheme = ThemeManager.getTheme();

        let targetPath = href;
        if (href.startsWith('http://') || href.startsWith('https://')) {
          try {
            const urlObj = new URL(href);
            targetPath = urlObj.pathname + urlObj.search + urlObj.hash;
            if (targetPath.startsWith('/')) targetPath = targetPath.slice(1);
          } catch (err) {}
        } else if (targetPath.startsWith('/')) {
          targetPath = targetPath.slice(1);
        }

        const [pathWithoutHash, hash] = targetPath.split('#');
        const [cleanPath, search] = pathWithoutHash.split('?');
        const params = new URLSearchParams(search || '');
        params.set('theme', currentTheme);

        const finalUrl = `${consoleOrigin}/${cleanPath}?${params.toString()}${hash ? '#' + hash : ''}`;
        window.location.href = finalUrl;
      }
    });
  }

  return { init };
})();

/* ==========================================================================
   4. NAV DRAWER MANAGER
   Mobile drawer open/close, backdrop click, Escape key listener.
   ========================================================================== */
const NavDrawerManager = (() => {
  let drawer, toggle, closeBtn, drawerLinks;

  function open() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function init() {
    drawer      = document.getElementById('mobileDrawer');
    toggle      = document.getElementById('mobileToggle');
    closeBtn    = document.getElementById('drawerClose');
    drawerLinks = document.querySelectorAll('.drawer-link');

    if (toggle)   toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    drawerLinks.forEach(link => link.addEventListener('click', close));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  return { init, open, close };
})();

/* ==========================================================================
   5. HEADER SCROLL OBSERVER
   Applies glassmorphic .scrolled class to #siteHeader on scroll > 15px.
   ========================================================================== */
const HeaderScrollObserver = (() => {
  function init() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 15);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  return { init };
})();

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
const FaqAccordion = (() => {
  function init() {
    if (document.getElementById('faqSearchInput')) return;
    document.querySelectorAll('.faq-item').forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.faq-item').forEach(i => {
          const t = i.querySelector('.faq-trigger');
          if (t) { t.setAttribute('aria-expanded', 'false'); i.classList.remove('active'); }
        });
        if (!isOpen) {
          trigger.setAttribute('aria-expanded', 'true');
          item.classList.add('active');
        }
      });
    });
  }
  return { init };
})();

/* ==========================================================================
   7. SIGNUP HASH PULSE
   ========================================================================== */
const SignupHashPulse = (() => {
  function pulse() {
    if (window.location.hash !== '#signup') return;
    const card = document.querySelector('.signup-card-wrapper');
    if (!card) return;
    card.classList.remove('highlight-pulse');
    void card.offsetWidth;
    card.classList.add('highlight-pulse');
  }
  function init() {
    window.addEventListener('hashchange', pulse);
    if (window.location.hash === '#signup') setTimeout(pulse, 300);
  }
  return { init };
})();

/* ==========================================================================
   8. NAV BUTTON LISTENERS
   ========================================================================== */
const NavButtons = (() => {
  function init() {
    const loginIds   = ['navLoginBtn', 'drawerLoginBtn'];
    const demoIds    = ['navDemoBtn', 'drawerDemoBtn', 'heroTryDemoBtn', 'bottomTryDemoBtn', 'pricingDemoBtn'];
    const signupIds  = ['drawerSignupBtn', 'heroGetStartedBtn', 'bottomGetStartedBtn'];
    const pricingIds = ['navPricingBtn', 'drawerPricingBtn', 'footerPricingBtn'];
    const faqsIds    = ['navFaqsBtn', 'drawerFaqsBtn', 'footerFaqsBtn', 'whitepaperFaqsBtn'];
    const privacyIds = ['navPrivacyBtn', 'drawerPrivacyBtn', 'footerPrivacyBtn'];
    const termsIds   = ['navTermsBtn', 'drawerTermsBtn', 'footerTermsBtn'];
    const refundIds  = ['navRefundBtn', 'drawerRefundBtn', 'footerRefundBtn'];

    loginIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', AuthRouter.redirectToLogin);
    });
    demoIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', AuthRouter.redirectToDemo);
    });
    signupIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', AuthRouter.redirectToSignup);
    });
    pricingIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', AuthRouter.redirectToPricing);
    });
    faqsIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', AuthRouter.redirectToFaqs);
    });
    privacyIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', AuthRouter.redirectToPrivacy);
    });
    termsIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', AuthRouter.redirectToTerms);
    });
    refundIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', AuthRouter.redirectToRefund);
    });
  }
  return { init };
})();

/* ==========================================================================
   BOOTSTRAP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.initToggle();
  CrossDomainLinkSync.init();
  NavDrawerManager.init();
  HeaderScrollObserver.init();
  FaqAccordion.init();
  SignupHashPulse.init();
  NavButtons.init();
});
