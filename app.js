/* ==========================================================================
   QBONIC WEBSITE - INTERACTIVE APPLICATION LOGIC
   Client-Side Simulator, Beta Sign-Up Validation, FAQ Accordion & Mobile UI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Global Config: Set Google Apps Script Web App URL to append form submissions directly to Google Sheet
  window.QBONIC_CONFIG = window.QBONIC_CONFIG || {
    googleSheetScriptUrl: "https://script.google.com/macros/s/AKfycbwun8Q74rTpGmV4e_tVZGJP-_u6oAFcY-Rx_OIvr01FNV0wVg83bwZdsqACp8-TlIbPCA/exec" // Paste your deployed Google Apps Script Web App URL here
  };

  /* --------------------------------------------------------------------------
     1. SAMPLE DATASETS FOR IN-BROWSER SIMULATOR
     -------------------------------------------------------------------------- */
  const DATASETS = {
    ecom: {
      fileStatus: "q3_sales_report.csv (14,850 rows) • 100% In-Browser Memory",
      m1: { label: "Total Revenue", val: "$184,920.00", trend: "↑ +18.4% vs last period" },
      m2: { label: "Avg Order Value", val: "$84.50", trend: "↑ +4.2% vs last period" },
      m3: { label: "Total Orders", val: "2,188", trend: "↑ +12.1% vs last period" },
      m4: { label: "Conversion Rate", val: "3.82%", trend: "↑ +0.6% vs last period" },
      chartTitle: "Revenue & Order Volume Trend (Client-Side Rendered)",
      points: [
        { label: "Day 1", v1: 4200, v2: 52 },
        { label: "Day 5", v1: 6800, v2: 80 },
        { label: "Day 10", v1: 9100, v2: 110 },
        { label: "Day 15", v1: 14500, v2: 172 },
        { label: "Day 20", v1: 11200, v2: 135 },
        { label: "Day 25", v1: 18900, v2: 224 },
        { label: "Day 30", v1: 22400, v2: 265 }
      ]
    },
    saas: {
      fileStatus: "saas_arr_metrics_2026.csv (8,400 rows) • 100% Local Execution",
      m1: { label: "Monthly Recurring (MRR)", val: "$42,800.00", trend: "↑ +24.1% MoM growth" },
      m2: { label: "Avg Revenue Per User", val: "$142.10", trend: "↑ +8.5% MoM expansion" },
      m3: { label: "Active Subscribers", val: "301 Accounts", trend: "↑ +18 New accounts" },
      m4: { label: "Net Revenue Churn", val: "0.82%", trend: "↓ -0.3% Churn reduction" },
      chartTitle: "MRR Expansion & Net New Subscribers",
      points: [
        { label: "Jan", v1: 28000, v2: 190 },
        { label: "Feb", v1: 31200, v2: 215 },
        { label: "Mar", v1: 34500, v2: 240 },
        { label: "Apr", v1: 36800, v2: 258 },
        { label: "May", v1: 39900, v2: 282 },
        { label: "Jun", v1: 42800, v2: 301 }
      ]
    },
    ads: {
      fileStatus: "google_meta_ad_spend.csv (31,200 rows) • 100% Private",
      m1: { label: "Total Ad Spend", val: "$68,400.00", trend: "Target CAC achieved" },
      m2: { label: "Blended ROAS", val: "4.28x", trend: "↑ +0.45x Efficiency" },
      m3: { label: "Ad Clicks", val: "48,910", trend: "↑ +15.2% Traffic" },
      m4: { label: "Customer Acq. Cost", val: "$34.20", trend: "↓ -$4.80 Optimization" },
      chartTitle: "Blended Ad Spend vs. Return On Ad Spend (ROAS)",
      points: [
        { label: "Week 1", v1: 12000, v2: 3.8 },
        { label: "Week 2", v1: 14500, v2: 4.0 },
        { label: "Week 3", v1: 13800, v2: 4.1 },
        { label: "Week 4", v1: 17100, v2: 4.4 },
        { label: "Week 5", v1: 21000, v2: 4.28 }
      ]
    }
  };

  let currentDatasetKey = 'ecom';

  /* --------------------------------------------------------------------------
     2. RENDER EXECUTIVE DASHBOARD SPARKLINE CHARTS & INTERACTIVE HOVER SYNC
     -------------------------------------------------------------------------- */
  function drawSparklineSvg(svgId, points, color) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    const width = 350;
    const height = 40;
    const padding = 6;

    const minV = Math.min(...points);
    const maxV = Math.max(...points);
    const range = maxV - minV || 1;
    const stepX = (width - padding * 2) / (points.length - 1);

    const coords = points.map((val, i) => ({
      x: padding + i * stepX,
      y: height - padding - ((val - minV) / range) * (height - padding * 2)
    }));

    let pathD = '';
    let areaD = `M ${padding} ${height - padding} `;

    coords.forEach((pt, i) => {
      if (i === 0) {
        pathD += `M ${pt.x} ${pt.y} `;
        areaD += `L ${pt.x} ${pt.y} `;
      } else {
        const prev = coords[i - 1];
        const cp1x = prev.x + stepX / 2;
        const cp1y = prev.y;
        const cp2x = pt.x - stepX / 2;
        const cp2y = pt.y;
        pathD += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y} `;
        areaD += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y} `;
      }
    });

    areaD += `L ${coords[coords.length - 1].x} ${height - padding} Z`;

    const gradId = `sparkGrad_${svgId}`;
    let html = `
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#${gradId})" />
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>
    `;

    coords.forEach((pt, i) => {
      html += `<circle cx="${pt.x}" cy="${pt.y}" r="3" fill="var(--bg-surface)" stroke="${color}" stroke-width="2" class="spark-node" />`;
    });

    svg.innerHTML = html;
  }

  function renderAllExecutiveSparklines() {
    drawSparklineSvg('sparkSvgSales', [1.2, 1.98, 1.6, 2.1, 2.45, 2.6], '#38BDF8');
    drawSparklineSvg('sparkSvgShipping', [180, 214.43, 195, 230, 250, 270], '#34D399');
    drawSparklineSvg('sparkSvgProfit', [190, 225.23, 210, 240, 260, 290], '#F87171');
    drawSparklineSvg('sparkSvgQuantity', [22, 27.75, 25, 29, 31, 33], '#FB923C');
    drawSparklineSvg('sparkSvgDiscount', [1.4, 1.11, 1.3, 1.25, 1.15, 1.05], '#818CF8');
    drawSparklineSvg('sparkSvgRevenue', [1.35, 2.19, 1.8, 2.3, 2.65, 2.8], '#10B981');
    drawSparklineSvg('sparkSvgMargin', [10.5, 11.4, 11.0, 11.8, 12.1, 12.5], '#C084FC');
    drawSparklineSvg('sparkSvgAov', [230, 250.87, 242, 258, 264, 272], '#22D3EE');
  }

  // Interactive Hover Sync Popup for Sparkline Trend Column
  const sparklineCol = document.getElementById('sparklineCol');
  const syncPopup = document.getElementById('syncTooltipPopup');

  if (sparklineCol && syncPopup) {
    sparklineCol.addEventListener('mousemove', (e) => {
      const rect = sparklineCol.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;

      syncPopup.style.opacity = '1';
      syncPopup.style.top = `${Math.max(10, Math.min(relativeY - 40, rect.height - 200))}px`;
    });

    sparklineCol.addEventListener('mouseleave', () => {
      syncPopup.style.opacity = '0.95';
    });
  }

  // Render sparklines initially
  renderAllExecutiveSparklines();


  /* --------------------------------------------------------------------------
     3. BETA SIGN-UP FORM VALIDATION & MODAL SUBMISSION
     -------------------------------------------------------------------------- */
  const betaForm = document.getElementById('betaForm');
  const betaModal = document.getElementById('betaModal');
  const modalClose = document.getElementById('modalClose');
  const modalDoneBtn = document.getElementById('modalDoneBtn');

  if (betaForm) {
    betaForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName');
      const workEmail = document.getElementById('workEmail');
      const userRole = document.getElementById('userRole');
      const userCountry = document.getElementById('userCountry');
      const dataTool = document.getElementById('dataTool');
      const primaryFrustration = document.getElementById('primaryFrustration');
      const founderInterviewOptIn = document.getElementById('founderInterviewOptIn');

      let isValid = true;

      // Full Name Validation
      if (!fullName.value.trim()) {
        fullName.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        fullName.closest('.form-group').classList.remove('has-error');
      }

      // Email Format Regex Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!workEmail.value.trim() || !emailRegex.test(workEmail.value.trim())) {
        workEmail.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        workEmail.closest('.form-group').classList.remove('has-error');
      }

      // Role Selection Validation
      if (!userRole.value) {
        userRole.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        userRole.closest('.form-group').classList.remove('has-error');
      }

      // Country Selection Validation
      if (userCountry && !userCountry.value) {
        userCountry.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else if (userCountry) {
        userCountry.closest('.form-group').classList.remove('has-error');
      }

      // Frustration Selection Validation
      if (primaryFrustration && !primaryFrustration.value) {
        primaryFrustration.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else if (primaryFrustration) {
        primaryFrustration.closest('.form-group').classList.remove('has-error');
      }

      if (!isValid) return;

      // Trigger Submission Loading State
      const submitBtn = document.getElementById('submitBtn');
      const submitBtnText = document.getElementById('submitBtnText');
      const submitSpinner = document.getElementById('submitSpinner');

      submitBtn.disabled = true;
      submitBtnText.innerText = "Generating Access Ticket...";
      submitSpinner.style.display = "inline-block";

      setTimeout(() => {
        // Reset Button
        submitBtn.disabled = false;
        submitBtnText.innerText = "Request Beta Access";
        submitSpinner.style.display = "none";

        // Generate Beta Reference Code
        const randCode = "QB-BETA-2026-" + Math.random().toString(36).substring(2, 7).toUpperCase();

        document.getElementById('passUserName').innerText = fullName.value.split(' ')[0];
        document.getElementById('ticketCode').innerText = randCode;
        document.getElementById('passEmailSub').innerText = `We will notify you at ${workEmail.value}`;

        const signupData = {
          fullName: fullName.value,
          workEmail: workEmail.value,
          userRole: userRole.value,
          userCountry: userCountry ? userCountry.value : '',
          dataTool: dataTool ? dataTool.value : '',
          primaryFrustration: primaryFrustration ? primaryFrustration.value : '',
          founderInterviewOptIn: founderInterviewOptIn ? founderInterviewOptIn.checked : false,
          code: randCode,
          timestamp: new Date().toISOString()
        };

        // Submit to Google Sheets via Google Apps Script Web App (if URL is set)
        const GOOGLE_APPS_SCRIPT_WEB_APP_URL = window.QBONIC_CONFIG?.googleSheetScriptUrl || "";
        if (GOOGLE_APPS_SCRIPT_WEB_APP_URL) {
          fetch(GOOGLE_APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
          }).catch(err => console.log('Google Sheet submit error:', err));
        }

        try {
          localStorage.setItem('qbonic_beta_signup', JSON.stringify(signupData));
          console.log('Saved beta signup & survey feedback:', signupData);
        } catch (err) {
          console.log('localStorage unavailable');
        }

        // Open Dialog
        if (betaModal && typeof betaModal.showModal === 'function') {
          betaModal.showModal();
        } else {
          alert(`Welcome to Qbonic Beta!\nYour Pass Code: ${randCode}`);
        }

        betaForm.reset();
      }, 700);
    });
  }

  // Modal Close Handlers
  if (modalClose) {
    modalClose.addEventListener('click', () => betaModal.close());
  }

  if (modalDoneBtn) {
    modalDoneBtn.addEventListener('click', () => betaModal.close());
  }

  // Copy Code Button
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const ticketCode = document.getElementById('ticketCode').innerText;
      navigator.clipboard.writeText(ticketCode).then(() => {
        copyCodeBtn.innerText = "Copied!";
        setTimeout(() => copyCodeBtn.innerText = "Copy", 2000);
      });
    });
  }


  /* --------------------------------------------------------------------------
     4. FAQ ACCORDION HANDLER
     -------------------------------------------------------------------------- */
  const faqAccordion = document.getElementById('faqAccordion');
  if (faqAccordion) {
    faqAccordion.addEventListener('click', (e) => {
      const trigger = e.target.closest('.faq-trigger');
      if (!trigger) return;

      const item = trigger.closest('.faq-item');
      const content = item.querySelector('.faq-content');

      const isActive = item.classList.contains('active');

      // Close all items
      faqAccordion.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-content').style.maxHeight = null;
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  }


  /* --------------------------------------------------------------------------
     5. HEADER SCROLL & MOBILE DRAWER NAVIGATION
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    });

    if (drawerClose) {
      drawerClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    }

    mobileDrawer.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Back to Top Button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     7. DAY & NIGHT THEME SWITCHER (Light / Dark Mode Slider)
     -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('qbonic_theme');
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  const isLight = savedTheme === 'light' || (!savedTheme && systemPrefersLight);
  if (isLight) {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggle) themeToggle.checked = true;
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.checked = false;
  }

  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      const newTheme = themeToggle.checked ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      try {
        localStorage.setItem('qbonic_theme', newTheme);
      } catch (err) {
        console.log('Unable to save theme preference');
      }

      // Re-render sparklines to match new theme contrast
      renderAllExecutiveSparklines();
    });
  }

  /* --------------------------------------------------------------------------
     8. AUTO ROTATING DEMO: DASHBOARD & CONFIGURATION SCREENS (15 SEC INTERVAL)
     -------------------------------------------------------------------------- */
  const dashGrid = document.querySelector('.dash-3col-grid');
  const metricsStrip = document.querySelector('.sim-metrics-strip');
  const configPanel = document.getElementById('configPanel');
  const dotNavs = document.querySelectorAll('.sim-dot-nav');

  let currentSimView = 'dashboard'; // 'dashboard' or 'config'
  let simAutoTimer = null;

  function switchSimView(viewMode) {
    currentSimView = viewMode;

    // Update bottom pagination dots active state
    dotNavs.forEach(dot => {
      if (dot.getAttribute('data-view') === viewMode) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (viewMode === 'dashboard') {
      if (configPanel) configPanel.classList.add('hidden');
      if (metricsStrip) metricsStrip.classList.remove('hidden');
      if (dashGrid) dashGrid.classList.remove('hidden');
      // Re-render sparklines to ensure smooth SVG rendering
      renderAllExecutiveSparklines();
    } else {
      if (dashGrid) dashGrid.classList.add('hidden');
      if (metricsStrip) metricsStrip.classList.add('hidden');
      if (configPanel) configPanel.classList.remove('hidden');
    }
  }

  function startSimAutoRotation() {
    if (simAutoTimer) clearInterval(simAutoTimer);
    simAutoTimer = setInterval(() => {
      const nextView = currentSimView === 'dashboard' ? 'config' : 'dashboard';
      switchSimView(nextView);
    }, 15000); // 15 seconds delay
  }

  // Dot click navigation with timer reset
  dotNavs.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetView = dot.getAttribute('data-view');
      if (targetView && targetView !== currentSimView) {
        switchSimView(targetView);
        startSimAutoRotation();
      }
    });
  });

  // Start 15-second rotation initially
  if (configPanel && dashGrid) {
    startSimAutoRotation();
  }

  /* --------------------------------------------------------------------------
     9. PRIVACY POLICY & GDPR MODAL HANDLERS
     -------------------------------------------------------------------------- */
  const privacyModal = document.getElementById('privacyModal');
  const openPrivacyModal = document.getElementById('openPrivacyModal');
  const footerPrivacyLink = document.getElementById('footerPrivacyLink');
  const privacyModalClose = document.getElementById('privacyModalClose');
  const privacyDoneBtn = document.getElementById('privacyDoneBtn');

  function showPrivacyModal() {
    if (privacyModal && typeof privacyModal.showModal === 'function') {
      privacyModal.showModal();
    }
  }

  function hidePrivacyModal() {
    if (privacyModal && typeof privacyModal.close === 'function') {
      privacyModal.close();
    }
  }

  if (openPrivacyModal) openPrivacyModal.addEventListener('click', showPrivacyModal);
  if (footerPrivacyLink) footerPrivacyLink.addEventListener('click', showPrivacyModal);
  if (privacyModalClose) privacyModalClose.addEventListener('click', hidePrivacyModal);
  if (privacyDoneBtn) privacyDoneBtn.addEventListener('click', hidePrivacyModal);

});
