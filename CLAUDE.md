# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static single-page website for **Maison Lumière**, an upscale French restaurant in Singapore. No build tools, no package manager, no frameworks — open `index.html` directly in a browser.

## Running the site

Open `index.html` in a browser. No server required. For live-reload during editing, any static file server works:

```
npx serve .
# or
python -m http.server 8080
```

## File structure

```
index.html   — all markup, single page, five sections
styles.css   — all styles (~700 lines, no preprocessor)
script.js    — all JS, wrapped in a single IIFE
```

## Architecture decisions

**CSS custom properties** — All design tokens live in `:root` at the top of `styles.css` (palette, type scale, spacing, shadows, transitions). Edit tokens there first before touching component rules.

**Scroll animation pattern** — Elements start with `.fade-in` (opacity 0, translateY 32px). `IntersectionObserver` in `script.js` adds `.is-visible` once, then unobserves. Menu cards use a second observer per `.menu-grid` to stagger children with `setTimeout(fn, i * 120ms)`.

**Carousel** — `.carousel__track` is a flex row where each `.testimonial-card` is `min-width: 100%`. JS drives position with `transform: translateX(-N * 100%)`. Dots are built dynamically from the card count.

**Form validation** — The `validators` object in `script.js` maps field `id` → `{ validate(v), message }`. `validateField(name)` is called on `blur`, on `input` (only if already invalid), and for all required fields on `submit`. On success the form is hidden via `form.hidden = true` and the `#form-success` panel's `hidden` attribute is removed.

**Images** — All photos are Unsplash CDN URLs with `?w=600&q=80` (dishes) or `?w=1920&q=85` (hero). The hero background is set in CSS on `.hero`, not inline HTML.

**Mobile nav** — Hamburger is CSS-only at rest; JS toggles `.is-open` on both the button and `.nav__links`. Body scroll is locked (`overflow: hidden`) while the drawer is open.

**Responsive breakpoints** — `≤1024px` tablet, `≤768px` mobile (single-column grid, drawer nav, `background-attachment: scroll` on hero), `≤480px` small mobile. All in the final layer of `styles.css`.

## Currency & locale

Prices are displayed in SGD (e.g. `S$28`). The success message formats the reservation date using `toLocaleDateString('en-SG', {...})`.
