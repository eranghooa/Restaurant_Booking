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

      /* Fire hook — triggers voice announcement and any other registered handlers */
      formHooks.fire('contact:submit:success', { name: name, email: email });

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
     FORM HOOKS — lightweight pub/sub for post-submission events
  ----------------------------------------------------------- */
  var formHooks = (function () {
    var _listeners = {};

    function on(event, fn) {
      if (!_listeners[event]) { _listeners[event] = []; }
      _listeners[event].push(fn);
    }

    function fire(event, data) {
      (_listeners[event] || []).forEach(function (fn) {
        try { fn(data); } catch (err) { /* swallow handler errors */ }
      });
    }

    return { on: on, fire: fire };
  }());

  /* -----------------------------------------------------------
     VOICE FEEDBACK — Web Speech API announcement on submission
  ----------------------------------------------------------- */
  function speakMessage(text) {
    if (!window.speechSynthesis) { return; }

    window.speechSynthesis.cancel();

    function buildAndSpeak() {
      var utterance    = new SpeechSynthesisUtterance(text);
      utterance.lang   = 'en-US';
      utterance.rate   = 0.95;
      utterance.pitch  = 1.1;
      utterance.volume = 1;

      var voices    = window.speechSynthesis.getVoices();
      var preferred = voices.find(function (v) {
        return v.lang === 'en-US' && v.localService;
      }) || voices.find(function (v) {
        return v.lang.startsWith('en');
      });
      if (preferred) { utterance.voice = preferred; }

      window.speechSynthesis.speak(utterance);
    }

    /* Voices may not be loaded yet on first call — wait for the event */
    var voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      buildAndSpeak();
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', function handler() {
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        buildAndSpeak();
      });
    }
  }

  /* Register the voice hook for enquiry form success */
  formHooks.on('contact:submit:success', function () {
    speakMessage(
      'Hurray! Thank you for your submission. We will get back to you in one business day.'
    );
  });

  /* -----------------------------------------------------------
     INIT — wire everything up after DOM is ready
  ----------------------------------------------------------- */
  /* -----------------------------------------------------------
     FAQ CHATBOT — keyword-matched answers from FAQ.md data
  ----------------------------------------------------------- */
  var FAQ_DATA = [
    {
      q: 'What is Miyabi-tei restaurant about',
      a: '雅庭 Miyabi-tei (meaning "elegant garden") is a Japanese fine dining restaurant in Singapore, established in 1994. We offer an <em>omakase</em> experience guided by the philosophy of <em>shun</em> — the peak of seasonal perfection.',
      tags: ['about', 'miyabi', 'restaurant', 'japanese', 'cuisine', 'what', 'established', '1994']
    },
    {
      q: 'Where is Miyabi-tei located address find',
      a: 'We are at <strong>8 Dempsey Road, #01-02, Singapore 249687</strong> in the Dempsey Hill enclave.',
      tags: ['address', 'location', 'where', 'find', 'dempsey', 'map', 'directions', 'area']
    },
    {
      q: 'Opening hours when open close schedule',
      a: 'We are open <strong>Tuesday – Saturday</strong>:<br>• Lunch: 12:00 – 14:30<br>• Dinner: 18:30 – 22:00<br><strong>Closed on Sundays and Mondays.</strong>',
      tags: ['hours', 'open', 'close', 'time', 'schedule', 'tuesday', 'saturday', 'sunday', 'monday', 'when', 'day']
    },
    {
      q: 'Are you open on weekend Saturday Sunday',
      a: 'We are open on <strong>Saturdays</strong> for both lunch and dinner. We are <strong>closed on Sundays and Mondays</strong>.',
      tags: ['weekend', 'saturday', 'sunday', 'open', 'close']
    },
    {
      q: 'Phone number contact call email',
      a: 'Reach us by phone at <strong>+65 6474 8228</strong> or email <a href="mailto:reservations@miyabitei.sg">reservations@miyabitei.sg</a>.',
      tags: ['phone', 'call', 'number', 'contact', 'reach', 'email', 'telephone']
    },
    {
      q: 'WhatsApp contact chat message',
      a: 'Yes — chat with us on WhatsApp at <strong>+65 9845 7877</strong>.',
      tags: ['whatsapp', 'chat', 'message', 'wa', 'text']
    },
    {
      q: 'How to make a reservation book a table',
      a: 'Use the <a href="#reservations">Reservation form</a> on this page, call <strong>+65 6474 8228</strong>, or email <strong>reservations@miyabitei.sg</strong>. You\'ll need your name, email, phone, preferred date, time, and guest count.',
      tags: ['reservation', 'book', 'table', 'reserve', 'booking', 'how', 'make']
    },
    {
      q: 'Available dining times lunch dinner slots',
      a: '<strong>Lunch Omakase:</strong> 12:00, 12:30, 1:00, 1:30 PM<br><strong>Dinner Omakase:</strong> 6:00, 6:30, 7:00, 7:30, 8:00, 8:30, 9:00 PM',
      tags: ['time', 'slot', 'available', 'lunch', 'dinner', 'omakase', 'session', 'sitting']
    },
    {
      q: 'Large group private dining event corporate',
      a: 'For <strong>8 or more guests</strong> we offer private dining rooms. Contact us at <strong>+65 6474 8228</strong> or <strong>reservations@miyabitei.sg</strong> to arrange.',
      tags: ['group', 'private', 'large', 'party', 'event', 'corporate', 'eight', 'room', 'function']
    },
    {
      q: 'Dietary requirements allergies special requests vegan vegetarian halal',
      a: 'Note dietary requirements and allergies in the <strong>Special Requests</strong> field when booking. For complex needs, email <strong>reservations@miyabitei.sg</strong> so we can plan your experience in advance.',
      tags: ['diet', 'allerg', 'vegetarian', 'vegan', 'halal', 'gluten', 'special', 'request', 'intolerance', 'kosher']
    },
    {
      q: 'What is omakase chef course tasting menu',
      a: '<em>Omakase</em> (おまかせ) means "I leave it up to you." Our <em>itamae</em> (master chef) composes a seasonal multi-course journey using the day\'s finest ingredients.',
      tags: ['omakase', 'chef', 'course', 'tasting', 'what', 'itamae', 'multi']
    },
    {
      q: 'Starters menu chawanmushi sashimi salmon moriawase',
      a: '<strong>Starters (前菜):</strong><br>• Chilled Chawanmushi — <strong>S$28</strong> (dashi egg custard, Hokkaido uni, yuzu)<br>• Sashimi Moriawase — <strong>S$68</strong> (7 seasonal cuts, Kishu cedar, Shizuoka wasabi)<br>• Sake Saikyo-yaki — <strong>S$42</strong> (Hokkaido salmon, Kyoto white miso, binchōtan)',
      tags: ['starter', 'chawanmushi', 'sashimi', 'salmon', 'sake', 'saikyo', 'moriawase', 'uni', 'appetizer', 'first']
    },
    {
      q: 'Nigiri sushi tuna otoro uni sea urchin nodoguro',
      a: '<strong>Nigiri Signatures (握り):</strong><br>• Otoro Nigiri — <strong>S$58</strong> for 2 pcs (fatty bluefin tuna, Ōma Aomori)<br>• Bafun Uni — <strong>S$72</strong> for 2 pcs (Rishiri Island sea urchin)<br>• Nodoguro Aburi — <strong>S$54</strong> for 2 pcs (flame-seared blackthroat sea perch)',
      tags: ['nigiri', 'sushi', 'tuna', 'otoro', 'uni', 'sea urchin', 'nodoguro', 'aburi', 'bluefin', 'bafun']
    },
    {
      q: 'Main course wagyu beef hamo shabu fillet',
      a: '<strong>Main Courses (主菜):</strong><br>• Wagyu Shabu-shabu — <strong>S$148</strong> (A5 Kagoshima Kuroge Wagyu, kombu dashi)<br>• Hamo Aburi-yaki — <strong>S$88</strong> (Kyoto pike conger, umeboshi, ponzu)<br>• Kuroge Wagyu Fillet — <strong>S$198</strong> (A5 Miyazaki tenderloin, binchōtan, dashi butter)',
      tags: ['main', 'wagyu', 'beef', 'hamo', 'shabu', 'fillet', 'kuroge', 'a5', 'pike', 'conger', 'steak']
    },
    {
      q: 'Dessert matcha mochi sakura warabi sweet',
      a: '<strong>Desserts (甘味):</strong><br>• Matcha Parfait — <strong>S$22</strong> (Uji matcha ice cream, azuki, houjicha granola, kuromitsu)<br>• Sakura Mochi — <strong>S$18</strong> (pink rice parcels, koshi-an red bean)<br>• Kuromitsu Warabi-mochi — <strong>S$16</strong> (bracken jelly, kinako, Okinawan black sugar)',
      tags: ['dessert', 'matcha', 'parfait', 'mochi', 'sakura', 'warabi', 'sweet', 'kuromitsu', 'ice cream', 'azuki']
    },
    {
      q: 'Price cost how much expensive menu SGD',
      a: 'All prices in SGD — a quick overview:<br>Starters: S$28–S$68 · Nigiri: S$54–S$72 · Mains: S$88–S$198 · Desserts: S$16–S$22.<br>Call <strong>+65 6474 8228</strong> or see the full menu above for details.',
      tags: ['price', 'cost', 'how much', 'sgd', 'dollar', 'expensive', 'cheap', 'afford', 'rate', 'fee']
    },
    {
      q: 'Where source ingredients Tsukiji Kyoto Hokkaido fresh',
      a: 'Ingredients are sourced daily from <strong>Tsukiji market (Tokyo)</strong> and <strong>Kyoto\'s finest producers</strong> — including Rishiri Island Hokkaido uni, Ōma Aomori bluefin tuna, Kagoshima/Miyazaki A5 Wagyu, Nishiki Kyoto white miso, and Shizuoka wasabi.',
      tags: ['source', 'ingredient', 'tsukiji', 'kyoto', 'hokkaido', 'japan', 'fresh', 'produce', 'quality', 'import']
    },
    {
      q: 'Reservation confirmation email receipt',
      a: 'Yes — after submitting your reservation a <strong>confirmation email</strong> will be sent to you, and our team will follow up to confirm your booking details.',
      tags: ['confirm', 'confirmation', 'email', 'receipt', 'acknowledgement', 'notif']
    },
    {
      q: 'Enquiry response time reply how long',
      a: 'Our team responds to all enquiries within <strong>one business day</strong>.',
      tags: ['response', 'reply', 'enquiry', 'contact', 'long', 'wait', 'business', 'day', 'time']
    },
    {
      q: 'What is shun seasonal philosophy',
      a: '<em>Shun</em> (旬) is the Japanese concept of seasonal perfection — the precise moment when an ingredient is at its peak in flavour and freshness. Every dish at Miyabi-tei honours <em>shun</em>, which is why the menu evolves with the seasons.',
      tags: ['shun', 'seasonal', 'season', 'philosophy', 'ingredient', 'philosophy', 'concept', 'japanese']
    },
    {
      q: 'What is omotenashi hospitality',
      a: '<em>Omotenashi</em> (おもてなし) is Japanese wholehearted hospitality — anticipating the guest\'s needs before they are expressed. It is the spirit behind every detail of the Miyabi-tei experience.',
      tags: ['omotenashi', 'hospitality', 'service', 'japanese', 'philosophy', 'concept']
    }
  ];

  function initChatbot() {
    var toggleBtn = document.getElementById('chat-toggle');
    var panel     = document.getElementById('chat-panel');
    var messages  = document.getElementById('chat-messages');
    var form      = document.getElementById('chat-form');
    var input     = document.getElementById('chat-input');

    if (!toggleBtn || !panel || !messages || !form || !input) return;

    var isOpen = false;

    var STOP = new Set([
      'a','an','the','is','are','was','were','do','does','did','i','me','my',
      'you','your','it','its','this','that','what','where','when','how','can',
      'could','would','should','will','have','has','had','be','been','to','of',
      'in','for','on','with','at','by','from','about','and','or','but','not',
      'any','some','all','which','who','there','they','we','us','our',
      'please','tell','know','get','give','want','need','make','see','let'
    ]);

    /* ---- panel open / close -------------------------------- */
    function openPanel() {
      isOpen = true;
      panel.hidden = false;
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.classList.add('is-open');
      if (messages.children.length === 0) {
        addBotMessage(
          'Irasshaimase! &#x6211; am the Miyabi-tei assistant. ' +
          'Ask me about our <strong>menu</strong>, <strong>opening hours</strong>, ' +
          '<strong>reservations</strong>, or anything else. &#x2747;'
        );
      }
      setTimeout(function () { input.focus(); }, 120);
    }

    function closePanel() {
      isOpen = false;
      panel.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('is-open');
      toggleBtn.focus();
    }

    toggleBtn.addEventListener('click', function () {
      if (isOpen) { closePanel(); } else { openPanel(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) { closePanel(); }
    });

    /* ---- message rendering --------------------------------- */
    function addBotMessage(html) {
      var el = document.createElement('div');
      el.className = 'chat-msg chat-msg--bot';
      el.innerHTML =
        '<span class="chat-msg__avatar" aria-hidden="true">&#x96C5;</span>' +
        '<div class="chat-msg__bubble">' + html + '</div>';
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function addUserMessage(text) {
      var el = document.createElement('div');
      el.className = 'chat-msg chat-msg--user';
      el.innerHTML = '<div class="chat-msg__bubble">' + escapeHtml(text) + '</div>';
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function addTypingIndicator() {
      var el = document.createElement('div');
      el.className = 'chat-msg chat-msg--bot chat-msg--typing';
      el.id = 'chat-typing';
      el.innerHTML =
        '<span class="chat-msg__avatar" aria-hidden="true">&#x96C5;</span>' +
        '<div class="chat-msg__bubble">' +
          '<span class="typing-dot"></span>' +
          '<span class="typing-dot"></span>' +
          '<span class="typing-dot"></span>' +
        '</div>';
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
      return el;
    }

    function removeTypingIndicator() {
      var el = document.getElementById('chat-typing');
      if (el) { el.parentNode.removeChild(el); }
    }

    function escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    /* ---- FAQ matching -------------------------------------- */
    function tokenize(text) {
      return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(function (t) { return t.length > 2 && !STOP.has(t); });
    }

    function findAnswer(query) {
      var tokens = tokenize(query);
      if (tokens.length === 0) { return null; }

      var best = null;
      var bestScore = 0;

      FAQ_DATA.forEach(function (entry) {
        var qLow    = entry.q.toLowerCase();
        var aLow    = entry.a.toLowerCase().replace(/<[^>]+>/g, ' ');
        var tagsStr = entry.tags.join(' ');
        var score   = 0;

        tokens.forEach(function (kw) {
          if (tagsStr.includes(kw)) { score += 4; }
          if (qLow.includes(kw))   { score += 3; }
          if (aLow.includes(kw))   { score += 1; }
        });

        if (score > bestScore) { bestScore = score; best = entry; }
      });

      return bestScore >= 3 ? best.a : null;
    }

    /* ---- form submit --------------------------------------- */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;

      addUserMessage(text);
      input.value = '';
      addTypingIndicator();

      setTimeout(function () {
        removeTypingIndicator();
        var answer = findAnswer(text);
        addBotMessage(answer ||
          'I\'m not certain about that — please call us at <strong>+65 6474 8228</strong> ' +
          'or email <a href="mailto:reservations@miyabitei.sg">reservations@miyabitei.sg</a> ' +
          'and our team will be delighted to assist.'
        );
      }, 750);
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
    initChatbot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
