/**
 * qbonic-footer.js — Shared Qbonic Footer Web Component (Single Source of Truth)
 * 
 * Reusable across:
 *  1. React App (AppLegalFooter.jsx / console.qbonic.com)
 *  2. Marketing Website (qbonic.com / index.html, whats-new.html, etc.)
 *  3. Static Legal & Pricing Pages (pricing.html, terms.html, privacy.html, refund.html, detailed_faqs.html)
 * 
 * Usage:
 *  <qbonic-footer></qbonic-footer>                <!-- Exact 1-row legal bar matching AppLegalFooter.jsx -->
 *  <qbonic-footer mode="full"></qbonic-footer>    <!-- 2-tier footer with upper product navigation -->
 */

(function () {
  if (typeof window === 'undefined') return;
  if (customElements.get('qbonic-footer')) {
    return;
  }

  class QbonicFooter extends HTMLElement {
    constructor() {
      super();
      this._observer = null;
      this._closeMenuHandler = null;
    }

    connectedCallback() {
      this.render();
      this.observeTheme();
    }

    disconnectedCallback() {
      if (this._observer) {
        this._observer.disconnect();
      }
      if (this._closeMenuHandler) {
        document.removeEventListener('click', this._closeMenuHandler);
      }
    }

    static get observedAttributes() {
      return ['mode', 'year'];
    }

    attributeChangedCallback() {
      this.render();
    }

    isLightTheme() {
      const html = document.documentElement;
      const body = document.body;
      const themeAttr = html.getAttribute('data-theme') || (body && body.getAttribute('data-theme')) || '';
      return themeAttr === 'light' || themeAttr === 'qbonic-light' || html.classList.contains('light') || (body && body.classList.contains('light'));
    }

    observeTheme() {
      if (typeof MutationObserver === 'undefined') return;
      this._observer = new MutationObserver(() => {
        this.render();
      });
      this._observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
      if (document.body) {
        this._observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'class'] });
      }
    }

    render() {
      const isLight = this.isLightTheme();
      const mode = this.getAttribute('mode') || (this.hasAttribute('full') ? 'full' : 'legal');
      const year = this.getAttribute('year') || '2026';

      // Dynamic local vs production base URLs
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const isLocal = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.port === '5173' ||
        window.location.port === '8080' ||
        window.location.port === '8088'
      );

      const consoleBase = isLocal ? origin : 'https://console.qbonic.com';
      const websiteBase = isLocal ? origin : 'https://qbonic.com';

      // Exact color tokens from AppLegalFooter.jsx (Tailwind/DaisyUI)
      const colors = {
        bg: isLight ? 'rgba(248, 250, 252, 0.85)' : 'rgba(8, 12, 20, 0.70)',
        border: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
        textMuted: isLight ? 'rgba(15, 23, 42, 0.70)' : 'rgba(248, 250, 252, 0.70)',
        textMain: isLight ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
        textHeading: isLight ? '#0F172A' : '#F8FAFC',
        primary: isLight ? '#0284C7' : '#38BDF8',
        dot: isLight ? 'rgba(15, 23, 42, 0.30)' : 'rgba(248, 250, 252, 0.30)',
      };

      let upperHtml = '';
      if (mode === 'full') {
        upperHtml = `
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; padding-bottom: 0.85rem; border-bottom: 1px solid ${colors.border};">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; font-size: 1.1rem; font-weight: 800; color: ${colors.textHeading}; letter-spacing: -0.3px;">
                Qbonic<span style="color: ${colors.primary};">.</span>
              </span>
              <p style="margin: 0; font-size: 12px; color: ${colors.textMuted}; font-weight: 400;">Interactive Pivot Dashboards</p>
            </div>
            <nav style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;" aria-label="Product navigation">
              <a href="${websiteBase}/#demo" style="font-size: 12px; font-weight: 500; color: ${colors.textMuted}; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.color='${colors.primary}'" onmouseout="this.style.color='${colors.textMuted}'">Product Tour</a>
              <a href="${websiteBase}/#problem" style="font-size: 12px; font-weight: 500; color: ${colors.textMuted}; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.color='${colors.primary}'" onmouseout="this.style.color='${colors.textMuted}'">Why Qbonic</a>
              
              <!-- Comparisons Dropdown Popover -->
              <div style="position: relative; display: inline-block;" class="qbonic-comparisons-wrapper">
                <button type="button" class="qbonic-comparisons-trigger" style="background: transparent; border: none; padding: 0; font-size: 12px; font-weight: 500; color: ${colors.textMuted}; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-family: inherit; transition: color 0.15s ease;" onmouseover="this.style.color='${colors.primary}'" onmouseout="if(!this.classList.contains('active')) this.style.color='${colors.textMuted}'">
                  <span>Comparisons</span>
                  <span style="font-size: 8px; opacity: 0.7; transition: transform 0.2s ease;" class="qbonic-comp-arrow">▲</span>
                </button>
                <div class="qbonic-comparisons-menu" style="display: none; position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%); min-width: 230px; background: ${isLight ? '#FFFFFF' : '#0F172A'}; border: 1px solid ${isLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(56, 189, 248, 0.3)'}; border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,0.35); padding: 6px; z-index: 99999; backdrop-filter: blur(12px);">
                  <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${colors.primary}; padding: 6px 10px 4px;">Comparisons & Alternatives</div>
                  <a href="${websiteBase}/alternatives/privacy-first-bi.html" style="display: block; padding: 8px 10px; font-size: 12px; font-weight: 600; color: ${colors.textHeading}; text-decoration: none; border-radius: 6px; transition: background 0.15s ease;" onmouseover="this.style.background='${isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(56, 189, 248, 0.12)'}'; this.style.color='${colors.primary}'" onmouseout="this.style.background='transparent'; this.style.color='${colors.textHeading}'">
                    Privacy-First BI Alternatives
                    <span style="display: block; font-size: 10px; font-weight: 400; color: ${colors.textMuted}; margin-top: 1px;">Client-side RAM vs cloud uploads</span>
                  </a>
                  <a href="${websiteBase}/vs/excel-pivots.html" style="display: block; padding: 8px 10px; font-size: 12px; font-weight: 600; color: ${colors.textHeading}; text-decoration: none; border-radius: 6px; transition: background 0.15s ease;" onmouseover="this.style.background='${isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(56, 189, 248, 0.12)'}'; this.style.color='${colors.primary}'" onmouseout="this.style.background='transparent'; this.style.color='${colors.textHeading}'">
                    vs Excel Pivot Tables
                    <span style="display: block; font-size: 10px; font-weight: 400; color: ${colors.textMuted}; margin-top: 1px;">Zero freezing on large datasets</span>
                  </a>
                  <a href="${websiteBase}/vs/powerbi-local.html" style="display: block; padding: 8px 10px; font-size: 12px; font-weight: 600; color: ${colors.textHeading}; text-decoration: none; border-radius: 6px; transition: background 0.15s ease;" onmouseover="this.style.background='${isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(56, 189, 248, 0.12)'}'; this.style.color='${colors.primary}'" onmouseout="this.style.background='transparent'; this.style.color='${colors.textHeading}'">
                    vs Power BI Local
                    <span style="display: block; font-size: 10px; font-weight: 400; color: ${colors.textMuted}; margin-top: 1px;">Zero desktop install, 100% in-browser</span>
                  </a>
                </div>
              </div>

              <a href="${websiteBase}/whats-new.html" style="font-size: 12px; font-weight: 500; color: ${colors.textMuted}; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.color='${colors.primary}'" onmouseout="this.style.color='${colors.textMuted}'">What's New</a>
              <a href="${consoleBase}/detailed_faqs.html" style="font-size: 12px; font-weight: 500; color: ${colors.textMuted}; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.color='${colors.primary}'" onmouseout="this.style.color='${colors.textMuted}'">Security & FAQs</a>
              <a href="${websiteBase}/#contact" style="font-size: 12px; font-weight: 500; color: ${colors.textMuted}; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.color='${colors.primary}'" onmouseout="this.style.color='${colors.textMuted}'">Contact</a>
            </nav>
          </div>
        `;
      }

      this.innerHTML = `
        <footer style="width: 100%; background: ${colors.bg}; border-top: 1px solid ${colors.border}; padding: 0.75rem 1rem; margin-top: auto; user-select: none; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-sizing: border-box;">
          <div style="max-width: 1440px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.75rem; box-sizing: border-box;">
            ${upperHtml}
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 0.75rem; font-size: 12px; line-height: 1rem; color: ${colors.textMuted};" class="qbonic-footer-bottom-grid">
              <!-- Left: Copyright -->
              <div style="justify-self: start; white-space: nowrap; opacity: 0.8;" class="qbonic-footer-left">
                &copy; ${year} Qbonic. All rights reserved.
              </div>

              <!-- Middle: Attribution (Guaranteed Dead-Centered) -->
              <div style="justify-self: center; text-align: center; font-weight: 600; white-space: nowrap; color: ${colors.textMain};" class="qbonic-footer-mid">
                Crafted with ❤️ by <strong style="font-weight: 700; color: ${colors.textMain};">VitanuGenAI Technology Pvt Ltd, India 🇮🇳</strong>
              </div>

              <!-- Right: Distinct Primary Hyperlinks -->
              <nav style="justify-self: end; display: flex; align-items: center; gap: 0.5rem; flex-wrap: nowrap; white-space: nowrap;" class="qbonic-footer-right" aria-label="Legal & Application navigation">
                <a href="${consoleBase}/pricing.html" style="color: ${colors.primary}; font-weight: 600; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Pricing</a>
                <span style="opacity: 0.3; color: ${colors.dot}; font-size: 10px;">•</span>
                <a href="${consoleBase}/terms.html" style="color: ${colors.primary}; font-weight: 600; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Terms of Service</a>
                <span style="opacity: 0.3; color: ${colors.dot}; font-size: 10px;">•</span>
                <a href="${consoleBase}/privacy.html" style="color: ${colors.primary}; font-weight: 600; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Privacy Policy</a>
                <span style="opacity: 0.3; color: ${colors.dot}; font-size: 10px;">•</span>
                <a href="${consoleBase}/refund.html" style="color: ${colors.primary}; font-weight: 600; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Refund Policy</a>
              </nav>
            </div>
          </div>
        </footer>
        <style>
          @media (max-width: 992px) {
            .qbonic-footer-bottom-grid {
              grid-template-columns: 1fr !important;
              justify-items: center !important;
              text-align: center !important;
              gap: 0.5rem !important;
            }
            .qbonic-footer-left, .qbonic-footer-mid, .qbonic-footer-right {
              justify-self: center !important;
            }
            .qbonic-footer-right {
              flex-wrap: wrap !important;
              justify-content: center !important;
            }
          }
        </style>
      `;

      const trigger = this.querySelector('.qbonic-comparisons-trigger');
      const menu = this.querySelector('.qbonic-comparisons-menu');
      const arrow = this.querySelector('.qbonic-comp-arrow');

      if (trigger && menu) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = menu.style.display === 'block';
          menu.style.display = isOpen ? 'none' : 'block';
          trigger.classList.toggle('active', !isOpen);
          trigger.style.color = !isOpen ? colors.primary : colors.textMuted;
          if (arrow) arrow.style.transform = !isOpen ? 'rotate(180deg)' : 'none';
        });

        const closeMenu = (e) => {
          if (!this.contains(e.target)) {
            menu.style.display = 'none';
            trigger.classList.remove('active');
            trigger.style.color = colors.textMuted;
            if (arrow) arrow.style.transform = 'none';
          }
        };
        document.removeEventListener('click', this._closeMenuHandler);
        this._closeMenuHandler = closeMenu;
        document.addEventListener('click', this._closeMenuHandler);
      }
    }
  }

  customElements.define('qbonic-footer', QbonicFooter);
})();
