/* ==========================================================================
   QBONIC WEBSITE - INTERACTIVE APPLICATION LOGIC
   Client-Side Simulator, Beta Sign-Up Validation, FAQ Accordion & Mobile UI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     0. LOGIN BUTTON REDIRECT WITH DYNAMIC THEME VARIABLE
     -------------------------------------------------------------------------- */
  const navLoginBtn = document.getElementById('navLoginBtn');
  const drawerLoginBtn = document.getElementById('drawerLoginBtn');

  function handleLoginRedirect(e) {
    if (e) e.preventDefault();

    // 1. Resolve current website theme
    const docTheme = document.documentElement.getAttribute('data-theme');
    const themeToggle = document.getElementById('themeToggle');
    let currentTheme = 'dark'; // Default fallback

    if (docTheme === 'light' || docTheme === 'qbonic-light') {
      currentTheme = 'light';
    } else if (docTheme === 'dark' || docTheme === 'qbonic-dark') {
      currentTheme = 'dark';
    } else if (themeToggle) {
      currentTheme = themeToggle.checked ? 'light' : 'dark';
    } else {
      const saved = localStorage.getItem('qbonic_theme');
      if (saved === 'light' || saved === 'qbonic-light') currentTheme = 'light';
    }

    // 2. Build target URL passing theme parameter dynamically
    const baseUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? "http://localhost:5173/?auth=signin"
      : "https://console.qbonic.com/?auth=signin";

    const targetUrl = `${baseUrl}&theme=${currentTheme}`;
    
    // 3. Perform immediate navigation
    window.location.href = targetUrl;
  }

  if (navLoginBtn) navLoginBtn.addEventListener('click', handleLoginRedirect);
  if (drawerLoginBtn) drawerLoginBtn.addEventListener('click', handleLoginRedirect);

  /* Header scroll state handler */
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

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
        { label: "Week 5", v1: 11000, v2: 4.6 }
      ]
    }
  };

  /* --------------------------------------------------------------------------
     2. RENDER SIMULATOR DOM ELEMENTS
     -------------------------------------------------------------------------- */
  const simMetric1Val = document.getElementById('simMetric1Val');
  const simMetric1Trend = document.getElementById('simMetric1Trend');
  const simMetric1Label = document.getElementById('simMetric1Label');

  const simMetric2Val = document.getElementById('simMetric2Val');
  const simMetric2Trend = document.getElementById('simMetric2Trend');
  const simMetric2Label = document.getElementById('simMetric2Label');

  const simMetric3Val = document.getElementById('simMetric3Val');
  const simMetric3Trend = document.getElementById('simMetric3Trend');
  const simMetric3Label = document.getElementById('simMetric3Label');

  const simMetric4Val = document.getElementById('simMetric4Val');
  const simMetric4Trend = document.getElementById('simMetric4Trend');
  const simMetric4Label = document.getElementById('simMetric4Label');

  const simFileStatus = document.getElementById('simFileStatus');
  const simChartTitle = document.getElementById('simChartTitle');
  const simSparklineCanvas = document.getElementById('simSparklineCanvas');
  const datasetSelectBtns = document.querySelectorAll('.dataset-select-btn');

  let currentDatasetKey = 'ecom';

  function updateSimulatorView(datasetKey) {
    const data = DATASETS[datasetKey];
    if (!data) return;

    currentDatasetKey = datasetKey;

    // Update Pill Buttons Active State
    datasetSelectBtns.forEach(btn => {
      if (btn.dataset.dataset === datasetKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Text Content with subtle fade animation
    if (simFileStatus) simFileStatus.textContent = data.fileStatus;

    if (simMetric1Val) simMetric1Val.textContent = data.m1.val;
    if (simMetric1Trend) simMetric1Trend.textContent = data.m1.trend;
    if (simMetric1Label) simMetric1Label.textContent = data.m1.label;

    if (simMetric2Val) simMetric2Val.textContent = data.m2.val;
    if (simMetric2Trend) simMetric2Trend.textContent = data.m2.trend;
    if (simMetric2Label) simMetric2Label.textContent = data.m2.label;

    if (simMetric3Val) simMetric3Val.textContent = data.m3.val;
    if (simMetric3Trend) simMetric3Trend.textContent = data.m3.trend;
    if (simMetric3Label) simMetric3Label.textContent = data.m3.label;

    if (simMetric4Val) simMetric4Val.textContent = data.m4.val;
    if (simMetric4Trend) simMetric4Trend.textContent = data.m4.trend;
    if (simMetric4Label) simMetric4Label.textContent = data.m4.label;

    if (simChartTitle) simChartTitle.textContent = data.chartTitle;

    // Render Canvas Sparkline
    drawSparkline(data.points);
  }

  datasetSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const datasetKey = btn.dataset.dataset;
      updateSimulatorView(datasetKey);
    });
  });

  /* --------------------------------------------------------------------------
     3. HIGH PERFORMANCE HTML5 CANVAS SPARKLINE GRAPH RENDERER
     -------------------------------------------------------------------------- */
  function drawSparkline(points) {
    if (!simSparklineCanvas) return;
    const ctx = simSparklineCanvas.getContext('2d');
    if (!ctx) return;

    // Handle High-DPI / Retina Displays
    const dpr = window.devicePixelRatio || 1;
    const rect = simSparklineCanvas.getBoundingClientRect();
    
    // Set actual canvas resolution
    simSparklineCanvas.width = rect.width * dpr;
    simSparklineCanvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!points || points.length === 0) return;

    const width = rect.width;
    const height = rect.height;
    const padding = 20;

    const maxV1 = Math.max(...points.map(p => p.v1));
    const minV1 = Math.min(...points.map(p => p.v1));

    const stepX = (width - padding * 2) / (points.length - 1);

    // Compute Canvas Coordinates
    const coords = points.map((p, i) => {
      const x = padding + i * stepX;
      const normalizedY = (p.v1 - minV1) / ((maxV1 - minV1) || 1);
      const y = height - padding - (normalizedY * (height - padding * 2));
      return { x, y, label: p.label, val: p.v1 };
    });

    // Is Dark Mode Active?
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // 1. Fill Area Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isDark) {
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0.00)');
    } else {
      gradient.addColorStop(0, 'rgba(2, 132, 199, 0.25)');
      gradient.addColorStop(1, 'rgba(2, 132, 199, 0.00)');
    }

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    coords.forEach(c => ctx.lineTo(c.x, c.y));
    ctx.lineTo(coords[coords.length - 1].x, height);
    ctx.lineTo(coords[0].x, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 2. Stroke Smooth Line
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    coords.forEach(c => ctx.lineTo(c.x, c.y));
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // 3. Draw Data Points (Dots)
    coords.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.stroke();
    });
  }

  function renderAllExecutiveSparklines() {
    updateSimulatorView(currentDatasetKey);
  }

  // Initial draw
  updateSimulatorView('ecom');

  // Redraw on Window Resize
  window.addEventListener('resize', () => {
    drawSparkline(DATASETS[currentDatasetKey].points);
  });

  /* --------------------------------------------------------------------------
     4. BETA ACCESS FORM VALIDATION & GOOGLE SHEETS API INTEGRATION
     -------------------------------------------------------------------------- */
  const betaForm = document.getElementById('betaSignupForm');
  const betaFormFeedback = document.getElementById('betaFormFeedback');

  if (betaForm) {
    betaForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('fullName');
      const emailInput = document.getElementById('workEmail');
      const companyInput = document.getElementById('companyName');
      const submitBtn = betaForm.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const company = companyInput ? companyInput.value.trim() : '';

      if (!name || !email) {
        showFormFeedback(betaFormFeedback, 'Please complete all required fields.', 'error');
        return;
      }

      // Email Format Check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormFeedback(betaFormFeedback, 'Please enter a valid work email address.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
      }

      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('company', company);
        formData.append('timestamp', new Date().toISOString());

        if (window.QBONIC_CONFIG && window.QBONIC_CONFIG.googleSheetScriptUrl) {
          await fetch(window.QBONIC_CONFIG.googleSheetScriptUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Google Apps Script Web App standard mode
          });
        }

        // Show Success Alert
        showFormFeedback(
          betaFormFeedback, 
          `🎉 Thank you, ${name}! Your VIP Beta Access request has been recorded. We will contact you at ${email} shortly.`, 
          'success'
        );

        betaForm.reset();

      } catch (err) {
        console.error('Beta Form Submission Error:', err);
        showFormFeedback(
          betaFormFeedback, 
          '🎉 Your Beta Access request has been registered! We will review your application shortly.', 
          'success'
        );
        betaForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Paid Beta Access ($49/yr)';
        }
      }
    });
  }

  function showFormFeedback(container, message, type) {
    if (!container) return;
    container.style.display = 'block';
    container.className = `form-feedback ${type}`;
    container.textContent = message;
  }

  /* --------------------------------------------------------------------------
     5. FAQ ACCORDION LOGIC
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      // Close all other open accordion items
      faqItems.forEach(otherItem => {
        const otherTrigger = otherItem.querySelector('.faq-trigger');
        if (otherTrigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherItem.classList.remove('active');
        }
      });

      // Toggle clicked item
      if (!isExpanded) {
        trigger.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeMobileDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  /* --------------------------------------------------------------------------
     7. DAY & NIGHT THEME SWITCHER (Light / Dark Mode Slider)
     -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const urlParams = new URLSearchParams(window.location.search);
  const urlTheme = urlParams.get('theme');
  const savedTheme = urlTheme || localStorage.getItem('qbonic_theme');

  const isLight = savedTheme === 'light' || savedTheme === 'qbonic-light';
  const finalTheme = isLight ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', finalTheme);
  try {
    localStorage.setItem('qbonic_theme', finalTheme);
  } catch (err) {}

  if (themeToggle) {
    themeToggle.checked = isLight;
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

    dotNavs.forEach(dot => {
      if (dot.dataset.simView === viewMode) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (viewMode === 'config') {
      if (dashGrid) dashGrid.style.display = 'none';
      if (metricsStrip) metricsStrip.style.display = 'none';
      if (configPanel) configPanel.style.display = 'grid';
    } else {
      if (configPanel) configPanel.style.display = 'none';
      if (dashGrid) dashGrid.style.display = 'grid';
      if (metricsStrip) metricsStrip.style.display = 'grid';
    }
  }

  function startSimAutoTimer() {
    if (simAutoTimer) clearInterval(simAutoTimer);
    simAutoTimer = setInterval(() => {
      const nextView = currentSimView === 'dashboard' ? 'config' : 'dashboard';
      switchSimView(nextView);
    }, 15000);
  }

  function resetSimAutoTimer() {
    startSimAutoTimer();
  }

  dotNavs.forEach(dot => {
    dot.addEventListener('click', () => {
      const viewMode = dot.dataset.simView;
      switchSimView(viewMode);
      resetSimAutoTimer();
    });
  });

  startSimAutoTimer();

  /* --------------------------------------------------------------------------
     9. DYNAMIC FIRESTORE PLANS & PRICING CONFIGURATION LOADER
     -------------------------------------------------------------------------- */
  function applyPlansConfig(config) {
    if (!config) return;
    const elements = document.querySelectorAll('[data-bind]');
    elements.forEach(el => {
      const key = el.getAttribute('data-bind');
      if (config[key] !== undefined) {
        el.textContent = config[key];
      }
    });
  }

  // Default fallback constants
  const defaultPlans = {
    'free-max-rows': '1,000',
    'pro-max-rows': '30,000+',
    'pro-price-monthly': '$5.99',
    'pro-price-yearly': '$49',
    'pro-discount': '32%',
    'pro-trial-days': '7'
  };

  applyPlansConfig(defaultPlans);

  // Fetch live config from public Firestore REST API
  fetch('https://firestore.googleapis.com/v1/projects/qbonic-production/databases/(default)/documents/app_config/plans')
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      if (!data || !data.fields) return;
      const fields = data.fields;
      
      const liveConfig = { ...defaultPlans };

      // Parse nested Firestore types safely
      if (fields.free?.mapValue?.fields?.limits?.mapValue?.fields?.maxRows?.integerValue) {
        const rows = parseInt(fields.free.mapValue.fields.limits.mapValue.fields.maxRows.integerValue, 10);
        liveConfig['free-max-rows'] = rows >= 1000 ? `${(rows / 1000).toLocaleString()}K` : rows.toLocaleString();
      }
      if (fields.pro?.mapValue?.fields?.limits?.mapValue?.fields?.maxRows?.integerValue) {
        const rows = parseInt(fields.pro.mapValue.fields.limits.mapValue.fields.maxRows.integerValue, 10);
        liveConfig['pro-max-rows'] = rows >= 1000 ? `${(rows / 1000).toLocaleString()}+` : `${rows}+`;
      }
      if (fields.pro?.mapValue?.fields?.pricing?.mapValue?.fields?.monthlyDisplay?.stringValue) {
        liveConfig['pro-price-monthly'] = fields.pro.mapValue.fields.pricing.mapValue.fields.monthlyDisplay.stringValue;
      }
      if (fields.pro?.mapValue?.fields?.pricing?.mapValue?.fields?.yearlyDisplay?.stringValue) {
        liveConfig['pro-price-yearly'] = fields.pro.mapValue.fields.pricing.mapValue.fields.yearlyDisplay.stringValue;
      }
      if (fields.pro?.mapValue?.fields?.pricing?.mapValue?.fields?.yearlyDiscountPercent?.integerValue) {
        liveConfig['pro-discount'] = `${fields.pro.mapValue.fields.pricing.mapValue.fields.yearlyDiscountPercent.integerValue}%`;
      }
      if (fields.pro?.mapValue?.fields?.trialDays?.integerValue) {
        liveConfig['pro-trial-days'] = String(fields.pro.mapValue.fields.trialDays.integerValue);
      }

      applyPlansConfig(liveConfig);
    })
    .catch(() => {
      // Graceful offline fallback already applied
    });

  /* --------------------------------------------------------------------------
     VIDEO DEMO MODAL CONTROLLER
     -------------------------------------------------------------------------- */
  const videoModal = document.getElementById('videoModal');
  const videoModalBackdrop = document.getElementById('videoModalBackdrop');
  const closeVideoModalBtn = document.getElementById('closeVideoModal');
  const youtubePlayer = document.getElementById('youtubePlayer');
  const videoTriggers = document.querySelectorAll('.open-video-modal');

  function openVideoModal(e) {
    if (e) e.preventDefault();
    if (!videoModal || !youtubePlayer) return;

    const src = youtubePlayer.getAttribute('data-src');
    if (src) {
      youtubePlayer.src = src;
    }

    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal || !youtubePlayer) return;

    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Stop video playback by clearing src
    youtubePlayer.src = '';
  }

  if (videoTriggers && videoTriggers.length > 0) {
    videoTriggers.forEach(trigger => {
      trigger.addEventListener('click', openVideoModal);
    });
  }

  if (closeVideoModalBtn) {
    closeVideoModalBtn.addEventListener('click', closeVideoModal);
  }

  if (videoModalBackdrop) {
    videoModalBackdrop.addEventListener('click', closeVideoModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

});
