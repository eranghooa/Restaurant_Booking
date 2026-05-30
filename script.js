/* =============================================================
   MAISON LUMIÈRE — script.js
   Mobile nav · Scroll animations · Carousel · Form validation
   ============================================================= */

(function () {
  'use strict';

  /* -----------------------------------------------------------
     DOM REFERENCES
  ----------------------------------------------------------- */
  var hamburger     = document.querySelector('.nav__hamburger');
  var navLinks      = document.querySelector('.nav__links');
  var form          = document.getElementById('reservation-form');
  var successPanel  = document.getElementById('form-success');
  var successMsg    = document.getElementById('success-message');
  var carouselTrack = document.getElementById('carousel-track');
  var dotsContainer = document.getElementById('carousel-dots');
  var prevBtn       = document.querySelector('.carousel__btn--prev');
  var nextBtn       = document.querySelector('.carousel__btn--next');
  var dateInput     = document.getElementById('date');

  /* -----------------------------------------------------------
     MOBILE NAVIGATION
  ----------------------------------------------------------- */
  function initMobileNav() {
    if (!hamburger || !navLinks) return;

    function openMenu() {
      navLinks.classList.add('is-open');
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navLinks.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* Close when any nav link is clicked */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    /* Close on click outside the nav */
    document.addEventListener('click', function (e) {
      if (
        navLinks.classList.contains('is-open') &&
        !hamburger.contains(e.target) &&
        !navLinks.contains(e.target)
      ) {
        closeMenu();
      }
    });

    /* Close on Escape key, return focus to hamburger */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  /* -----------------------------------------------------------
     SCROLL-IN ANIMATIONS (IntersectionObserver)
  ----------------------------------------------------------- */
  function initScrollAnimations() {
    /* Generic fade-in elements — section headers, category blocks, form */
    var fadeEls = document.querySelectorAll('.fade-in');

    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target); /* fire once */
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });

    /* Staggered card animation within each menu grid */
    document.querySelectorAll('.menu-grid').forEach(function (grid) {
      var cards = Array.from(grid.querySelectorAll('.menu-card'));

      var cardObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              cards.forEach(function (card, i) {
                /* 120ms delay between each card */
                setTimeout(function () {
                  card.classList.add('is-visible');
                }, i * 120);
              });
              cardObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );

      cardObserver.observe(grid);
    });
  }

  /* -----------------------------------------------------------
     TESTIMONIAL CAROUSEL
  ----------------------------------------------------------- */
  function initCarousel() {
    if (!carouselTrack || !dotsContainer || !prevBtn || !nextBtn) return;

    var cards   = Array.from(carouselTrack.querySelectorAll('.testimonial-card'));
    var total   = cards.length;
    var current = 0;
    var autoTimer = null;

    if (total === 0) return;

    /* Build dot navigation buttons */
    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1) + ' of ' + total);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    });

    function updateDots() {
      var dots = dotsContainer.querySelectorAll('.carousel__dot');
      dots.forEach(function (dot, i) {
        var active = i === current;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', String(active));
      });
    }

    function goTo(index) {
      current = ((index % total) + total) % total; /* wrap safely */
      carouselTrack.style.transform = 'translateX(-' + current * 100 + '%)';
      updateDots();
      resetAutoPlay();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetAutoPlay() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 5000);
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    /* Touch / swipe support */
    var touchStartX = 0;

    carouselTrack.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', function (e) {
      var delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        delta > 0 ? next() : prev();
      }
    }, { passive: true });

    /* Pause auto-advance when user hovers */
    var carouselEl = carouselTrack.closest('.carousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', function () {
        clearInterval(autoTimer);
      });
      carouselEl.addEventListener('mouseleave', resetAutoPlay);

      /* Pause on focus-within (keyboard navigation) */
      carouselEl.addEventListener('focusin', function () {
        clearInterval(autoTimer);
      });
      carouselEl.addEventListener('focusout', function (e) {
        if (!carouselEl.contains(e.relatedTarget)) {
          resetAutoPlay();
        }
      });
    }

    /* Keyboard arrow support */
    carouselEl && carouselEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { prev(); }
      if (e.key === 'ArrowRight') { next(); }
    });

    /* Start auto-play */
    resetAutoPlay();
  }

  /* -----------------------------------------------------------
     FORM VALIDATION
  ----------------------------------------------------------- */

  /* Validation rules — each has validate(value) → bool + error message */
  var validators = {
    'full-name': {
      validate: function (v) { return v.trim().length >= 2; },
      message: 'Please enter your full name (at least 2 characters).'
    },
    'email': {
      validate: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
      },
      message: 'Please enter a valid email address.'
    },
    'phone': {
      validate: function (v) {
        return /^\+?[\d\s\-().]{7,20}$/.test(v.trim());
      },
      message: 'Please enter a valid phone number (digits, spaces, +, -, brackets).'
    },
    'date': {
      validate: function (v) {
        if (!v) return false;
        var selected = new Date(v + 'T00:00:00');
        var today    = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
      },
      message: 'Please select today or a future date.'
    },
    'time': {
      validate: function (v) { return v !== ''; },
      message: 'Please select a preferred dining time.'
    },
    'guests': {
      validate: function (v) { return v !== ''; },
      message: 'Please select the number of guests.'
    }
  };

  /* Validate a single field; returns true if valid */
  function validateField(name) {
    var input   = document.getElementById(name);
    var errorEl = document.getElementById(name + '-error');
    var rule    = validators[name];

    if (!rule || !input) return true;

    var isValid = rule.validate(input.value);
    input.classList.toggle('is-invalid', !isValid);

    if (errorEl) {
      errorEl.textContent = isValid ? '' : rule.message;
    }

    return isValid;
  }

  /* Format a 24-hour time string to readable 12-hour format */
  function formatTime(timeVal) {
    var parts  = timeVal.split(':');
    var hour   = parseInt(parts[0], 10);
    var minute = parts[1];
    var ampm   = hour >= 12 ? 'PM' : 'AM';
    var h12    = hour % 12 || 12;
    return h12 + ':' + minute + ' ' + ampm;
  }

  /* Format an ISO date string (YYYY-MM-DD) to readable form */
  function formatDate(dateVal) {
    /* Append T00:00:00 to avoid UTC timezone shift causing off-by-one-day */
    var d = new Date(dateVal + 'T00:00:00');
    return d.toLocaleDateString('en-SG', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric'
    });
  }

  function initForm() {
    if (!form || !successPanel || !successMsg) return;

    /* Set the date picker's minimum value to today */
    if (dateInput) {
      var today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    /* Attach blur and input listeners for live validation feedback */
    Object.keys(validators).forEach(function (name) {
      var el = document.getElementById(name);
      if (!el) return;

      el.addEventListener('blur', function () {
        validateField(name);
      });

      /* Re-validate on input only if the field was already marked invalid */
      el.addEventListener('input', function () {
        if (el.classList.contains('is-invalid')) {
          validateField(name);
        }
      });
    });

    /* Form submission */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var requiredFields = ['full-name', 'email', 'phone', 'date', 'time', 'guests'];
      var formIsValid    = true;

      /* Validate all required fields */
      requiredFields.forEach(function (name) {
        if (!validateField(name)) {
          formIsValid = false;
        }
      });

      if (!formIsValid) {
        /* Scroll to and focus the first invalid field */
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
        return;
      }

      /* Build the confirmation message */
      var rawName  = document.getElementById('full-name').value.trim();
      var firstName = rawName.split(' ')[0]; /* Use first name in greeting */
      var dateVal  = document.getElementById('date').value;
      var timeVal  = document.getElementById('time').value;
      var guests   = document.getElementById('guests').value;

      var dateStr  = formatDate(dateVal);
      var timeStr  = formatTime(timeVal);
      var guestWord = guests === '1' ? 'guest' : 'guests';

      successMsg.textContent =
        'Thank you, ' + firstName + '. Your table for ' + guests + ' ' +
        guestWord + ' on ' + dateStr + ' at ' + timeStr + ' at Miyabi-tei has been received.';

      /* Hide form, reveal success panel */
      form.hidden        = true;
      successPanel.hidden = false;
      successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });

      /* Reset form to clean state */
      form.reset();
      form.querySelectorAll('.is-invalid').forEach(function (el) {
        el.classList.remove('is-invalid');
      });
      form.querySelectorAll('.form-error').forEach(function (el) {
        el.textContent = '';
      });
    });
  }

  /* -----------------------------------------------------------
     LEAD MANAGEMENT — Contact Us form + localStorage storage
  ----------------------------------------------------------- */
  var LEADS_KEY = 'miyabitei_leads';

  var contactValidators = {
    'contact-name': {
      validate: function (v) { return v.trim().length >= 2; },
      message: 'Please enter your full name (at least 2 characters).'
    },
    'contact-email': {
      validate: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
      },
      message: 'Please enter a valid email address.'
    },
    'contact-inquiry': {
      validate: function (v) { return v !== ''; },
      message: 'Please select an enquiry type.'
    },
    'contact-message': {
      validate: function (v) { return v.trim().length >= 10; },
      message: 'Please enter a message (at least 10 characters).'
    }
  };

  function validateContactField(name) {
    var input   = document.getElementById(name);
    var errorEl = document.getElementById(name + '-error');
    var rule    = contactValidators[name];
    if (!rule || !input) return true;
    var isValid = rule.validate(input.value);
    input.classList.toggle('is-invalid', !isValid);
    if (errorEl) { errorEl.textContent = isValid ? '' : rule.message; }
    return isValid;
  }

  function saveLeadToStorage(lead) {
    try {
      var leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
      leads.push(lead);
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch (_) { /* storage unavailable — silently skip */ }
  }

  function initContactForm() {
    var contactForm    = document.getElementById('contact-form');
    var contactSuccess = document.getElementById('contact-success');
    var contactMsg     = document.getElementById('contact-success-message');
    if (!contactForm || !contactSuccess || !contactMsg) return;

    Object.keys(contactValidators).forEach(function (name) {
      var el = document.getElementById(name);
      if (!el) return;
      el.addEventListener('blur', function () { validateContactField(name); });
      el.addEventListener('input', function () {
        if (el.classList.contains('is-invalid')) { validateContactField(name); }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var requiredFields = ['contact-name', 'contact-email', 'contact-inquiry', 'contact-message'];
      var formIsValid    = true;

      requiredFields.forEach(function (name) {
        if (!validateContactField(name)) { formIsValid = false; }
      });

      if (!formIsValid) {
        var firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
        return;
      }

      var name    = document.getElementById('contact-name').value.trim();
      var email   = document.getElementById('contact-email').value.trim();
      var phone   = (document.getElementById('contact-phone').value || '').trim();
      var inquiry = document.getElementById('contact-inquiry').value;
      var message = document.getElementById('contact-message').value.trim();

      saveLeadToStorage({
        id:          String(Date.now()),
        name:        name,
        email:       email,
        phone:       phone,
        inquiry:     inquiry,
        message:     message,
        submittedAt: new Date().toISOString()
      });

      contactMsg.textContent =
        'Thank you, ' + name.split(' ')[0] + '. Your enquiry has been received and ' +
        'our team will be in touch within one business day.';

      contactForm.hidden    = true;
      contactSuccess.hidden = false;
      contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

      contactForm.reset();
      contactForm.querySelectorAll('.is-invalid').forEach(function (el) {
        el.classList.remove('is-invalid');
      });
      contactForm.querySelectorAll('.form-error').forEach(function (el) {
        el.textContent = '';
      });
    });
  }

  /* -----------------------------------------------------------
     INIT — wire everything up after DOM is ready
  ----------------------------------------------------------- */
  function init() {
    initMobileNav();
    initScrollAnimations();
    initCarousel();
    initForm();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── WhatsApp tooltip dismiss ─────────────────────────────── */
  (function () {
    var tooltip     = document.getElementById('wa-tooltip');
    var closeBtn    = document.getElementById('wa-tooltip-close');
    var STORAGE_KEY = 'miyabi-wa-tooltip-dismissed';

    if (!tooltip || !closeBtn) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') {
        tooltip.classList.add('is-hidden');
      }
    } catch (e) {}

    closeBtn.addEventListener('click', function () {
      tooltip.classList.add('is-hidden');
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    });

    setTimeout(function () {
      if (!tooltip.classList.contains('is-hidden')) {
        tooltip.classList.add('is-hidden');
      }
    }, 8000);
  }());

})();
