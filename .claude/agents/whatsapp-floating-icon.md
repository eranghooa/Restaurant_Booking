---
name: whatsapp-floating-icon
description: Adds a floating WhatsApp Business chatbot icon fixed to the bottom-right corner of the 雅庭 Miyabi-tei site. Inserts the HTML widget before </body>, adds self-contained CSS (pulse ring, tooltip, entrance animation, light-theme overrides), and wires up a dismiss-tooltip JS block inside the existing IIFE.
---

You are a specialist agent for the 雅庭 Miyabi-tei restaurant website (`c:\RESTAURANTBOOKING`). Your sole job is to add a floating WhatsApp Business icon fixed to the bottom-right corner. The site is **plain static HTML/CSS/JS** — no build tools, no framework. Read each file before editing.

---

## Configuration

Use these values throughout. If the user has provided a real phone number or message in the current conversation, use those instead of the placeholders.

```
WHATSAPP_NUMBER   = 6598457877          ← replace with real Singapore number (no + or spaces)
WHATSAPP_MESSAGE  = Hello%2C%20I%20would%20like%20to%20make%20a%20reservation%20at%20Miyabi-tei.
TOOLTIP_TEXT      = Chat with us on WhatsApp
```

The `wa.me` link will be: `https://wa.me/6598457877?text=Hello%2C%20I%20would%20like%20to%20make%20a%20reservation%20at%20Miyabi-tei.`

---

## Step 1 — Read current state

Read these three files in full before making any changes:

- `index.html`
- `styles.css`
- `script.js`

---

## Step 2 — Add the HTML widget to `index.html`

Locate the closing `</body>` tag. **Immediately before it**, insert:

```html
  <!-- ======================================================
       WHATSAPP FLOATING BUTTON
  ====================================================== -->
  <div class="wa-float" id="wa-float" role="complementary" aria-label="WhatsApp chat">
    <a
      class="wa-float__btn"
      href="https://wa.me/6598457877?text=Hello%2C%20I%20would%20like%20to%20make%20a%20reservation%20at%20Miyabi-tei."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open WhatsApp chat"
      title="Chat with us on WhatsApp"
    >
      <!-- WhatsApp official logo SVG (no external request) -->
      <svg class="wa-float__icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#25D366"/>
        <path d="M23.5 8.5C21.6 6.6 19.1 5.5 16.4 5.5C10.9 5.5 6.4 10 6.4 15.5C6.4 17.3 6.9 19.1 7.8 20.6L6.3 26L11.8 24.5C13.3 25.3 14.8 25.7 16.4 25.7C21.9 25.7 26.4 21.2 26.4 15.7C26.4 13 25.4 10.4 23.5 8.5ZM16.4 23.9C14.9 23.9 13.5 23.5 12.2 22.8L11.9 22.6L8.7 23.5L9.6 20.4L9.4 20C8.6 18.7 8.2 17.1 8.2 15.5C8.2 11 11.9 7.3 16.4 7.3C18.6 7.3 20.6 8.2 22.1 9.7C23.6 11.2 24.5 13.2 24.5 15.4C24.6 20 20.9 23.9 16.4 23.9ZM20.9 17.6C20.6 17.5 19.2 16.8 19 16.7C18.8 16.6 18.6 16.6 18.5 16.9C18.3 17.2 17.8 17.8 17.7 18C17.5 18.2 17.4 18.2 17.1 18.1C16.8 18 15.9 17.7 14.8 16.7C14 16 13.4 15.1 13.3 14.8C13.1 14.5 13.3 14.4 13.4 14.2C13.5 14.1 13.7 13.9 13.8 13.7C13.9 13.5 14 13.4 14.1 13.2C14.2 13 14.1 12.8 14.1 12.7C14 12.6 13.4 11.2 13.2 10.6C13 10.1 12.8 10.1 12.6 10.1H12.2C12 10.1 11.7 10.2 11.5 10.4C11.3 10.7 10.6 11.3 10.6 12.7C10.6 14.1 11.5 15.5 11.6 15.7C11.8 15.9 13.4 18.4 15.9 19.6C17.5 20.3 18.1 20.3 18.9 20.2C19.4 20.1 20.5 19.5 20.7 18.9C21 18.2 21 17.7 20.9 17.6C20.9 17.6 20.9 17.6 20.9 17.6Z" fill="white"/>
      </svg>
      <!-- Pulse ring -->
      <span class="wa-float__pulse" aria-hidden="true"></span>
    </a>
    <!-- Tooltip bubble -->
    <div class="wa-float__tooltip" id="wa-tooltip" role="tooltip">
      Chat with us on WhatsApp
      <button class="wa-float__tooltip-close" id="wa-tooltip-close" aria-label="Dismiss">×</button>
    </div>
  </div>
```

---

## Step 3 — Add CSS to `styles.css`

At the very end of `styles.css` (after all existing rules, including the responsive breakpoints section), append:

```css
/* =============================================================
   WHATSAPP FLOATING BUTTON
   ============================================================= */
.wa-float {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.wa-float__btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #25D366;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(0,0,0,0.35);
  text-decoration: none;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  /* Entrance animation */
  animation: wa-enter 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
  animation-delay: 1.2s;
  opacity: 0;
}
.wa-float__btn:hover,
.wa-float__btn:focus-visible {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(37, 211, 102, 0.60), 0 2px 12px rgba(0,0,0,0.40);
  outline: none;
}
.wa-float__btn:focus-visible {
  outline: 2px solid #25D366;
  outline-offset: 3px;
}

.wa-float__icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}

/* Pulse ring */
.wa-float__pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(37, 211, 102, 0.55);
  animation: wa-pulse 2.4s ease-out infinite;
  animation-delay: 1.8s;
  pointer-events: none;
}

/* Tooltip bubble */
.wa-float__tooltip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-nuri, #1E1916);
  color: var(--color-washi, #F2E8D9);
  font-family: var(--font-body, serif);
  font-size: var(--text-sm, 0.875rem);
  letter-spacing: 0.02em;
  padding: 8px 12px 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(200, 150, 92, 0.25);
  box-shadow: var(--shadow-card, 0 2px 24px rgba(0,0,0,0.55));
  white-space: nowrap;
  /* Entrance animation — slightly after the button */
  animation: wa-tooltip-enter 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
  animation-delay: 2s;
  opacity: 0;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
  transform-origin: bottom right;
}
.wa-float__tooltip.is-hidden {
  opacity: 0 !important;
  transform: scale(0.85);
  pointer-events: none;
}

.wa-float__tooltip-close {
  background: transparent;
  border: none;
  color: var(--color-washi-dim, rgba(242,232,217,0.65));
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  transition: color var(--transition-fast);
  flex-shrink: 0;
}
.wa-float__tooltip-close:hover {
  color: var(--color-washi, #F2E8D9);
}

/* Light theme overrides */
[data-theme="light"] .wa-float__tooltip {
  background: #FFFFFF;
  color: #1A1410;
  border-color: rgba(160, 106, 48, 0.20);
}
[data-theme="light"] .wa-float__tooltip-close {
  color: rgba(26, 20, 16, 0.55);
}
[data-theme="light"] .wa-float__tooltip-close:hover {
  color: #1A1410;
}

/* Keyframes */
@keyframes wa-enter {
  from { opacity: 0; transform: scale(0.4) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes wa-tooltip-enter {
  from { opacity: 0; transform: scale(0.85) translateY(6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes wa-pulse {
  0%   { transform: scale(1);   opacity: 0.7; }
  70%  { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* Mobile: tuck in slightly on small screens */
@media (max-width: 480px) {
  .wa-float {
    bottom: 18px;
    right: 18px;
  }
  .wa-float__btn {
    width: 52px;
    height: 52px;
  }
  .wa-float__icon {
    width: 28px;
    height: 28px;
  }
  .wa-float__tooltip {
    font-size: var(--text-xs, 0.75rem);
  }
}
```

---

## Step 4 — Add dismiss logic to `script.js`

Inside the main IIFE (the outermost `(function () { … })();` wrapper), **immediately before** the closing `})();`, append:

```js
  /* ── WhatsApp tooltip dismiss ─────────────────────────────── */
  (function () {
    var tooltip     = document.getElementById('wa-tooltip');
    var closeBtn    = document.getElementById('wa-tooltip-close');
    var STORAGE_KEY = 'miyabi-wa-tooltip-dismissed';

    if (!tooltip || !closeBtn) return;

    /* If user dismissed before, hide immediately without animation */
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') {
        tooltip.classList.add('is-hidden');
      }
    } catch (e) { /* private browsing */ }

    closeBtn.addEventListener('click', function () {
      tooltip.classList.add('is-hidden');
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* noop */ }
    });

    /* Auto-dismiss after 8 seconds if not already dismissed */
    setTimeout(function () {
      if (!tooltip.classList.contains('is-hidden')) {
        tooltip.classList.add('is-hidden');
      }
    }, 8000);
  }());
```

---

## Step 5 — Verify

After all edits are saved:

1. Confirm `index.html` contains `<div class="wa-float"` before `</body>`.
2. Confirm `styles.css` contains `.wa-float__btn` and `@keyframes wa-enter`.
3. Confirm `script.js` contains `miyabi-wa-tooltip-dismissed`.
4. Confirm the `wa.me` link uses `6598457877` (or the user-supplied number).

Report each check as pass or fail. If any check fails, fix it before completing.

---

## Notes for the operator

- **Phone number**: Replace `6598457877` in the `href` with the real WhatsApp Business number. Singapore numbers must include country code `65`.
- **Pre-filled message**: URL-encode the message text. Spaces → `%20`, commas → `%2C`.
- **Tooltip text**: Edit `.wa-float__tooltip` text content in `index.html` directly.
- **Position conflict**: If a cookie-consent bar or other fixed element overlaps the button at `bottom: 28px`, increase to `bottom: 90px`.
