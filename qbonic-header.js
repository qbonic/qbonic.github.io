/**
 * qbonic-header.js — Shared Qbonic Header Navigation Web Component (Single Source of Truth)
 * 
 * Usage:
 *   <qbonic-header></qbonic-header>
 *   <qbonic-header active="pricing"></qbonic-header>
 *   <qbonic-header active="whats-new"></qbonic-header>
 *   <qbonic-header active="excel-pivots"></qbonic-header>
 */

(function () {
  if (typeof window === 'undefined') return;
  if (customElements.get('qbonic-header')) return;

  class QbonicHeader extends HTMLElement {
    constructor() {
      super();
      this._observer = null;
      this._closeDropdownTimeout = null;
      this._onScrollHandler = null;
      this._onDocClickHandler = null;
      this._onKeydownHandler = null;
    }

    static get observedAttributes() {
      return ['active'];
    }

    connectedCallback() {
      this.render();
      this.bindEvents();
      this.observeTheme();
    }

    disconnectedCallback() {
      if (this._observer) this._observer.disconnect();
      if (this._onScrollHandler) window.removeEventListener('scroll', this._onScrollHandler);
      if (this._onDocClickHandler) document.removeEventListener('click', this._onDocClickHandler);
      if (this._onKeydownHandler) document.removeEventListener('keydown', this._onKeydownHandler);
    }

    attributeChangedCallback() {
      this.render();
      this.bindEvents();
    }

    isLightTheme() {
      const html = document.documentElement;
      const body = document.body;
      const themeAttr = html.getAttribute('data-theme') || (body && body.getAttribute('data-theme')) || '';
      return themeAttr === 'light' || themeAttr === 'qbonic-light' || html.classList.contains('light') || (body && body.classList.contains('light'));
    }

    getTheme() {
      return this.isLightTheme() ? 'light' : 'dark';
    }

    observeTheme() {
      if (typeof MutationObserver === 'undefined') return;
      this._observer = new MutationObserver(() => {
        const toggle = this.querySelector('#themeToggle');
        if (toggle) toggle.checked = this.isLightTheme();
      });
      this._observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
      if (document.body) {
        this._observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'class'] });
      }
    }

    getUrls() {
      const isLocal = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      );
      const port = typeof window !== 'undefined' ? window.location.port : '';
      const isConsoleOrigin = typeof window !== 'undefined' && (
        window.location.hostname.includes('console.qbonic.com') ||
        (isLocal && (port === '5173' || port === '3000'))
      );
      const pathname = typeof window !== 'undefined' ? window.location.pathname || '' : '';
      const isSubdir = pathname.includes('/vs/') || pathname.includes('/alternatives/');

      // Console base URL: http://localhost:5173 in local dev, https://console.qbonic.com in production
      const consoleBase = isLocal ? 'http://localhost:5173' : 'https://console.qbonic.com';

      // Website base URL: http://localhost:8088 in local dev when accessed from console, https://qbonic.com in production
      const websiteOrigin = isLocal ? 'http://localhost:8088' : 'https://qbonic.com';
      const webBase = isConsoleOrigin ? websiteOrigin : (isSubdir ? '..' : '.');

      return {
        home: isConsoleOrigin ? `${websiteOrigin}/` : (isSubdir ? '../index.html' : 'index.html'),
        tour: isConsoleOrigin ? `${websiteOrigin}/#demo` : `${webBase}/index.html#demo`,
        problem: isConsoleOrigin ? `${websiteOrigin}/#problem` : `${webBase}/index.html#problem`,
        pricing: isConsoleOrigin ? 'pricing.html' : `${consoleBase}/pricing.html`,
        privacyBi: isConsoleOrigin ? `${websiteOrigin}/alternatives/privacy-first-bi.html` : `${webBase}/alternatives/privacy-first-bi.html`,
        excelPivots: isConsoleOrigin ? `${websiteOrigin}/vs/excel-pivots.html` : `${webBase}/vs/excel-pivots.html`,
        powerbiLocal: isConsoleOrigin ? `${websiteOrigin}/vs/powerbi-local.html` : `${webBase}/vs/powerbi-local.html`,
        mission: isConsoleOrigin ? `${websiteOrigin}/#about` : `${webBase}/index.html#about`,
        whatsNew: isConsoleOrigin ? `${websiteOrigin}/whats-new.html` : `${webBase}/whats-new.html`,
        faqs: isConsoleOrigin ? 'detailed_faqs.html' : `${consoleBase}/detailed_faqs.html`,
        contact: isConsoleOrigin ? `${websiteOrigin}/#contact` : `${webBase}/index.html#contact`,
        demo: `${consoleBase}/?demo=true`,
        login: `${consoleBase}/?auth=signin`,
        signup: `${consoleBase}/?auth=signup`
      };
    }

    render() {
      const active = (this.getAttribute('active') || '').toLowerCase().trim();
      const urls = this.getUrls();
      const isLight = this.isLightTheme();

      const isActive = (key) => active === key;
      const linkClass = (key) => `nav-link${isActive(key) ? ' active' : ''}`;
      const activeStyle = (key) => isActive(key) ? 'color: var(--primary); font-weight: 700;' : '';
      const dropdownItemStyle = (key) => isActive(key) ? 'background: rgba(56, 189, 248, 0.08);' : '';
      const dropdownTitleStyle = (key) => isActive(key) ? 'color: var(--primary); font-weight: 700;' : '';

      this.innerHTML = `
        <!-- Minimal Header -->
        <header class="site-header" id="siteHeader">
          <div class="header-inner">
            <a href="${urls.home}" class="brand-logo" id="headerBrandLogo">
              <div class="logo-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#header_logo_grad)" stroke="#38BDF8" stroke-width="1.5" stroke-linejoin="round" />
                  <defs>
                    <linearGradient id="header_logo_grad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#38BDF8" />
                      <stop offset="1" stop-color="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="brand-text-group">
                <span class="brand-name">Qbonic<span class="brand-dot">.</span></span>
                <span class="brand-tagline">Interactive Pivot Dashboards</span>
              </div>
            </a>

            <nav class="nav-menu" id="navMenu">
              <a href="${urls.tour}" class="${linkClass('tour')}" style="${activeStyle('tour')}">Product Tour</a>
              <a href="${urls.problem}" class="${linkClass('problem')}" style="${activeStyle('problem')}">Why Qbonic</a>
              <a href="${urls.pricing}" class="${linkClass('pricing')}" style="${activeStyle('pricing')}" id="navPricingBtn">Pricing</a>
              
              <!-- Resources ▾ Dropdown -->
              <div class="nav-dropdown" id="navResourcesDropdown">
                <button type="button" class="nav-dropdown-trigger" id="resourcesDropdownTrigger" aria-expanded="false" aria-haspopup="true">
                  <span>Resources</span>
                  <span class="nav-dropdown-arrow">▼</span>
                </button>
                <div class="nav-dropdown-menu" aria-labelledby="resourcesDropdownTrigger">
                  <div class="nav-dropdown-section-title">Comparisons & Alternatives</div>
                  <a href="${urls.privacyBi}" class="nav-dropdown-item" style="${dropdownItemStyle('privacy-bi')}">
                    <span class="nav-dropdown-item-title" style="${dropdownTitleStyle('privacy-bi')}">Privacy-First BI Alternatives</span>
                    <span class="nav-dropdown-item-desc">Client-side RAM vs cloud uploads</span>
                  </a>
                  <a href="${urls.excelPivots}" class="nav-dropdown-item" style="${dropdownItemStyle('excel-pivots')}">
                    <span class="nav-dropdown-item-title" style="${dropdownTitleStyle('excel-pivots')}">vs Excel Pivot Tables</span>
                    <span class="nav-dropdown-item-desc">Zero freezing on 50k+ row files</span>
                  </a>
                  <a href="${urls.powerbiLocal}" class="nav-dropdown-item" style="${dropdownItemStyle('powerbi-local')}">
                    <span class="nav-dropdown-item-title" style="${dropdownTitleStyle('powerbi-local')}">vs Power BI Local</span>
                    <span class="nav-dropdown-item-desc">Zero install, 100% in-browser</span>
                  </a>

                  <div class="nav-dropdown-divider"></div>
                  
                  <div class="nav-dropdown-section-title">Trust & Support</div>
                  <a href="${urls.mission}" class="nav-dropdown-item" style="${dropdownItemStyle('mission')}">
                    <span class="nav-dropdown-item-title" style="${dropdownTitleStyle('mission')}">🎯 Our Mission</span>
                    <span class="nav-dropdown-item-desc">Founder note & why we built Qbonic</span>
                  </a>
                  <a href="${urls.whatsNew}" class="nav-dropdown-item" style="${dropdownItemStyle('whats-new')}" id="navWhatsNewBtn">
                    <span class="nav-dropdown-item-title" style="${dropdownTitleStyle('whats-new')}">✨ What's New</span>
                    <span class="nav-dropdown-item-desc">Release notes and product updates</span>
                  </a>
                  <a href="${urls.faqs}" class="nav-dropdown-item" style="${dropdownItemStyle('faqs')}" id="navFaqsBtn">
                    <span class="nav-dropdown-item-title" style="${dropdownTitleStyle('faqs')}">🛡️ Security & FAQs</span>
                    <span class="nav-dropdown-item-desc">29-point GDPR & architecture FAQ</span>
                  </a>
                  <a href="${urls.contact}" class="nav-dropdown-item" style="${dropdownItemStyle('contact')}">
                    <span class="nav-dropdown-item-title" style="${dropdownTitleStyle('contact')}">💬 Contact Us</span>
                    <span class="nav-dropdown-item-desc">Direct email & founder support</span>
                  </a>
                </div>
              </div>
            </nav>

            <div class="header-actions">
              <div class="theme-switch-wrapper" title="Switch Theme">
                <span class="theme-switch-icon">🌙</span>
                <label class="theme-switch" for="themeToggle">
                  <input type="checkbox" id="themeToggle" ${isLight ? 'checked' : ''} aria-label="Toggle light or dark theme">
                  <span class="slider round"></span>
                </label>
                <span class="theme-switch-icon">☀️</span>
              </div>
              <a href="${urls.demo}" class="btn btn-secondary btn-sm nav-demo-btn" id="navDemoBtn"><span class="demo-bolt">⚡</span> Try Demo</a>
              <a href="${urls.login}" class="btn btn-primary btn-sm" id="navLoginBtn">Login</a>
              <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu">
                <span class="burger-bar"></span>
                <span class="burger-bar"></span>
              </button>
            </div>
          </div>
        </header>

        <!-- Mobile Drawer -->
        <div class="mobile-drawer" id="mobileDrawer" aria-hidden="true">
          <div class="drawer-content">
            <div class="drawer-header">
              <div class="brand-text-group">
                <span class="brand-name">Qbonic<span class="brand-dot">.</span></span>
                <span class="brand-tagline">Interactive Pivot Dashboards</span>
              </div>
              <button class="drawer-close" id="drawerClose">&times;</button>
            </div>
            <nav class="drawer-nav">
              <a href="${urls.tour}" class="drawer-link">Product Tour</a>
              <a href="${urls.problem}" class="drawer-link">Why Qbonic</a>
              <a href="${urls.pricing}" class="drawer-link" id="drawerPricingBtn">Pricing</a>
              
              <div style="font-size: 0.72rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 14px; padding-left: 2px;">
                Comparisons
              </div>
              <a href="${urls.privacyBi}" class="drawer-link" style="font-size: 0.92rem; padding-left: 10px;">Privacy-First BI</a>
              <a href="${urls.excelPivots}" class="drawer-link" style="font-size: 0.92rem; padding-left: 10px;">vs Excel Pivots</a>
              <a href="${urls.powerbiLocal}" class="drawer-link" style="font-size: 0.92rem; padding-left: 10px;">vs Power BI Local</a>

              <div style="font-size: 0.72rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 14px; padding-left: 2px;">
                Resources
              </div>
              <a href="${urls.mission}" class="drawer-link" style="font-size: 0.92rem; padding-left: 10px;">Our Mission</a>
              <a href="${urls.whatsNew}" class="drawer-link" style="font-size: 0.92rem; padding-left: 10px;" id="drawerWhatsNewBtn">What's New</a>
              <a href="${urls.faqs}" class="drawer-link" style="font-size: 0.92rem; padding-left: 10px;" id="drawerFaqsBtn">Security & FAQs</a>
              <a href="${urls.contact}" class="drawer-link" style="font-size: 0.92rem; padding-left: 10px;">Contact</a>

              <a href="${urls.demo}" class="drawer-link btn btn-secondary mt-3" id="drawerDemoBtn">⚡ Try Demo</a>
              <a href="${urls.signup}" class="drawer-link btn btn-primary mt-2" id="drawerSignupBtn">Join Free Beta &rarr;</a>
            </nav>
          </div>
        </div>
      `;
    }

    bindEvents() {
      const header = this.querySelector('#siteHeader');
      const toggle = this.querySelector('#themeToggle');
      const dropdown = this.querySelector('#navResourcesDropdown');
      const dropdownTrigger = this.querySelector('#resourcesDropdownTrigger');
      const mobileToggle = this.querySelector('#mobileToggle');
      const mobileDrawer = this.querySelector('#mobileDrawer');
      const drawerClose = this.querySelector('#drawerClose');
      const drawerLinks = this.querySelectorAll('.drawer-link');

      // Theme toggle change
      if (toggle) {
        toggle.addEventListener('change', (e) => {
          const newTheme = e.target.checked ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', newTheme);
          if (document.body) document.body.setAttribute('data-theme', newTheme);
          try { localStorage.setItem('qbonic_theme', newTheme); } catch (err) {}
        });
      }

      // Dropdown toggle & hover buffer
      if (dropdown && dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = dropdown.classList.contains('open');
          dropdown.classList.toggle('open', !isOpen);
          dropdownTrigger.setAttribute('aria-expanded', String(!isOpen));
        });

        dropdown.addEventListener('mouseenter', () => {
          if (this._closeDropdownTimeout) {
            clearTimeout(this._closeDropdownTimeout);
            this._closeDropdownTimeout = null;
          }
        });

        dropdown.addEventListener('mouseleave', () => {
          this._closeDropdownTimeout = setTimeout(() => {
            dropdown.classList.remove('open');
            dropdownTrigger.setAttribute('aria-expanded', 'false');
          }, 120);
        });
      }

      // Mobile drawer open/close
      const openDrawer = () => {
        if (!mobileDrawer) return;
        mobileDrawer.classList.add('open');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      };

      const closeDrawer = () => {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };

      if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
      if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
      drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

      // Scroll observer
      if (header) {
        if (this._onScrollHandler) window.removeEventListener('scroll', this._onScrollHandler);
        this._onScrollHandler = () => {
          header.classList.toggle('scrolled', window.scrollY > 15);
        };
        window.addEventListener('scroll', this._onScrollHandler, { passive: true });
        this._onScrollHandler();
      }

      // Click outside listener
      if (this._onDocClickHandler) document.removeEventListener('click', this._onDocClickHandler);
      this._onDocClickHandler = (e) => {
        if (dropdown && !e.target.closest('#navResourcesDropdown')) {
          dropdown.classList.remove('open');
          if (dropdownTrigger) dropdownTrigger.setAttribute('aria-expanded', 'false');
        }
      };
      document.addEventListener('click', this._onDocClickHandler);

      // Escape key listener
      if (this._onKeydownHandler) document.removeEventListener('keydown', this._onKeydownHandler);
      this._onKeydownHandler = (e) => {
        if (e.key === 'Escape') {
          if (dropdown) {
            dropdown.classList.remove('open');
            if (dropdownTrigger) dropdownTrigger.setAttribute('aria-expanded', 'false');
          }
          closeDrawer();
        }
      };
      document.addEventListener('keydown', this._onKeydownHandler);
    }
  }

  customElements.define('qbonic-header', QbonicHeader);
})();
