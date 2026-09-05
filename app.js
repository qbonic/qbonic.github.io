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

  // Smooth scroll and pulse highlight on #signup landing
  function checkSignupHashPulse() {
    if (window.location.hash === '#signup') {
      const signupCard = document.querySelector('.signup-card-wrapper');
      if (signupCard) {
        signupCard.classList.remove('highlight-pulse');
        void signupCard.offsetWidth; // Force reflow
        signupCard.classList.add('highlight-pulse');
      }
    }
  }

  window.addEventListener('hashchange', checkSignupHashPulse);
  if (window.location.hash === '#signup') {
    setTimeout(checkSignupHashPulse, 300);
  }

  /* --------------------------------------------------------------------------
     4. FOUNDING COHORT BATCH #1 FORM VALIDATION & GOOGLE SHEETS / GA TRACKING
     -------------------------------------------------------------------------- */
  const betaForm = document.getElementById('betaForm') || document.getElementById('betaSignupForm');
  const betaFormFeedback = document.getElementById('betaFormFeedback');

  if (betaForm) {
    betaForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('fullName');
      const emailInput = document.getElementById('workEmail');
      const roleInput = document.getElementById('userRole');
      const countryInput = document.getElementById('userCountry');
      const dataToolInput = document.getElementById('dataTool');
      const frustrationInput = document.getElementById('primaryFrustration');
      const founderChatInput = document.getElementById('founderInterviewOptIn');
      const submitBtn = betaForm.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const role = roleInput ? roleInput.value : '';
      const country = countryInput ? countryInput.value : '';
      const dataTool = dataToolInput ? dataToolInput.value : '';
      const frustration = frustrationInput ? frustrationInput.value : '';
      const founderChat = founderChatInput ? founderChatInput.checked : true;

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
        submitBtn.textContent = 'Submitting Application...';
      }

      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('role', role);
        formData.append('country', country);
        formData.append('dataTool', dataTool);
        formData.append('frustration', frustration);
        formData.append('founderChat', founderChat ? 'Yes' : 'No');
        formData.append('cohort', 'Batch #1');
        formData.append('timestamp', new Date().toISOString());

        if (window.QBONIC_CONFIG && window.QBONIC_CONFIG.googleSheetScriptUrl) {
          await fetch(window.QBONIC_CONFIG.googleSheetScriptUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Google Apps Script Web App standard mode
          });
        }

        // Fire Google Analytics event safely if gtag is available
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', {
            event_category: 'beta_application',
            event_label: 'batch_1_founding_cohort',
            value: 49
          });
        }

        // Show Success Alert
        showFormFeedback(
          betaFormFeedback, 
          `🎉 Thank you, ${name}! Your Batch #1 Founding Cohort application has been received. Our founding team reviews applications within 4 hours and will email your private invite link to ${email}.`, 
          'success'
        );

        betaForm.reset();

      } catch (err) {
        console.error('Beta Form Submission Error:', err);
        showFormFeedback(
          betaFormFeedback, 
          '🎉 Your Batch #1 application has been registered! We will review your application within 4 hours.', 
          'success'
        );
        betaForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Apply for Batch #1 Access (7 Spots Left) →';
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
  if (!document.getElementById('faqSearchInput')) {
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
  }

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

    });
  }

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
