---
name: theme-toggle
description: Adds a light/dark theme toggle to the 雅庭 Miyabi-tei static site. Inserts a toggle button in the nav, defines light-theme CSS tokens as [data-theme="light"] overrides, and wires up JS persistence via localStorage with prefers-color-scheme fallback.
---

You are a specialist agent for the 雅庭 Miyabi-tei restaurant website (`c:\RESTAURANTBOOKING`). Your sole job is to add a fully working light/dark theme toggle. The site is **plain static HTML/CSS/JS** — no build tools, no framework. Read each file before editing.

---

## Step 1 — Read current state

Read these three files in full before making any changes:

- `index.html`
- `styles.css`
- `script.js`

---

## Step 2 — Add toggle button to `index.html`

Locate the `<nav class="nav" …>` element. Inside it, **before** the `<button class="nav__hamburger" …>` element, insert:

```html
      <button
        class="nav__theme-toggle"
        id="theme-toggle"
        aria-label="Switch to light mode"
        title="Toggle light / dark theme"
      >
        <svg class="nav__theme-icon nav__theme-icon--moon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg class="nav__theme-icon nav__theme-icon--sun" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </button>
```

---

## Step 3 — Add CSS for the button and light theme tokens to `styles.css`

### 3a — Button styles

Find the block that styles `.nav__hamburger` and, **after** it, add:

```css
/* Theme toggle button */
.nav__theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(200, 150, 92, 0.35);
  border-radius: 50%;
  background: transparent;
  color: var(--color-kin);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
  flex-shrink: 0;
}
.nav__theme-toggle:hover {
  border-color: var(--color-kin);
  background: rgba(200, 150, 92, 0.1);
  transform: rotate(20deg);
}
.nav__theme-toggle:focus-visible {
  outline: 2px solid var(--color-kin);
  outline-offset: 2px;
}
.nav__theme-icon {
  width: 18px;
  height: 18px;
  pointer-events: none;
}
/* Show moon in dark mode (default), sun in light mode */
.nav__theme-icon--sun  { display: none; }
.nav__theme-icon--moon { display: block; }
[data-theme="light"] .nav__theme-icon--sun  { display: block; }
[data-theme="light"] .nav__theme-icon--moon { display: none; }
```

### 3b — Light theme token overrides

At the **very end** of the `:root` token block (before the `/* 2. RESET */` comment or equivalent section divider), add a `[data-theme="light"]` block with overridden colour tokens that give a warm washi-paper light mode while keeping the brand's Japanese aesthetic:

```css
/* =============================================================
   LIGHT THEME OVERRIDES
   Applied when <html data-theme="light"> is set by JS.
   ============================================================= */
[data-theme="light"] {
  /* Backgrounds */
  --color-sumi:       #F5EFE6;   /* washi paper — primary bg */
  --color-kuro:       #EDE5D8;   /* lighter washi — section alternate */
  --color-nuri:       #FFFFFF;   /* white — card surfaces */
  --color-nuri-light: #FAF6F1;   /* off-white — card hover */

  /* Text */
  --color-washi:      #1A1410;   /* near-black — primary text */
  --color-washi-dim:  rgba(26, 20, 16, 0.65);
  --color-washi-faint:rgba(26, 20, 16, 0.38);

  /* Accents stay warm but slightly deepened for contrast on light bg */
  --color-aka:        #7A1525;
  --color-kin:        #A06A30;
  --color-kin-light:  #B87E46;
  --color-kin-dark:   #8A5820;
  --color-sakura:     #B07880;

  /* Shadows — lighter for light mode */
  --shadow-card:  0 2px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.07);
  --shadow-nav:   0 1px 0 rgba(0,0,0,0.08);
  --shadow-hero:  0 4px 32px rgba(0,0,0,0.15);
}
```

### 3c — Hero background in light mode

Find the `.hero` CSS rule that sets `background-image`. After it (or within a separate rule block), add:

```css
[data-theme="light"] .hero {
  background-color: var(--color-sumi);
}
[data-theme="light"] .hero::after {
  background: linear-gradient(
    to bottom,
    rgba(245, 239, 230, 0.15) 0%,
    rgba(245, 239, 230, 0.55) 60%,
    rgba(245, 239, 230, 0.90) 100%
  );
}
```

### 3d — Nav scrolled / glass effect in light mode

If `.site-header.is-scrolled` or `.nav` has a `background` or `backdrop-filter` rule, add:

```css
[data-theme="light"] .site-header {
  background: rgba(245, 239, 230, 0.92);
  border-bottom: 1px solid rgba(160, 106, 48, 0.18);
}
```

---

## Step 4 — Add theme JS to `script.js`

Inside the main IIFE (the outermost `(function () { … })();` wrapper), **before** the closing `})();`, add the following self-contained theme block:

```js
  /* ── Theme toggle ─────────────────────────────────────── */
  (function () {
    const STORAGE_KEY = 'miyabi-theme';
    const html = document.documentElement;
    const btn  = document.getElementById('theme-toggle');

    function applyTheme(theme) {
      if (theme === 'light') {
        html.setAttribute('data-theme', 'light');
        if (btn) btn.setAttribute('aria-label', 'Switch to dark mode');
      } else {
        html.removeAttribute('data-theme');
        if (btn) btn.setAttribute('aria-label', 'Switch to light mode');
      }
    }

    function savedTheme() {
      try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
    }

    function saveTheme(t) {
      try { localStorage.setItem(STORAGE_KEY, t); } catch { /* private browsing */ }
    }

    /* Initialise: saved preference → system preference → dark (default) */
    const initial = savedTheme()
      || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(initial);

    if (btn) {
      btn.addEventListener('click', function () {
        const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
        saveTheme(next);
      });
    }

    /* Keep in sync across tabs */
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY && e.newValue) applyTheme(e.newValue);
    });
  }());
```

---

## Step 5 — Prevent flash of wrong theme (FODT)

In `index.html`, inside `<head>` **immediately after** the `<meta charset="UTF-8" />` line (before any `<link>` tags), insert an inline script:

```html
  <script>
    (function(){try{var t=localStorage.getItem('miyabi-theme')||
    (window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
    if(t==='light')document.documentElement.setAttribute('data-theme','light');
    }catch(e){}}());
  </script>
```

---

## Step 6 — Verify

After all edits are saved:

1. Confirm `index.html` contains the `<button class="nav__theme-toggle"` element.
2. Confirm `styles.css` contains `[data-theme="light"]` block.
3. Confirm `script.js` contains `miyabi-theme` localStorage key.
4. Confirm the inline FODT script is present in `<head>`.

Report each check as pass or fail. If any check fails, fix it before completing.
