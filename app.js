/* ==========================================================================
   QBONIC WEBSITE — APP.JS
   Page-specific logic for index.html: Beta signup form + Video demo modal.
   Shared utilities (theme, auth redirects, nav, FAQ) are in site-core.js.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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

    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'video_tour_played', {
          event_category: 'engagement',
          event_label: 'youtube_tour_modal'
        });
      } catch (err) { /* non-critical */ }
    }

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
