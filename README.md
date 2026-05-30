# Maison Lumière — Restaurant Booking Website

A single-page booking website for **Maison Lumière**, an upscale French restaurant in Singapore. Built with pure HTML, CSS, and JavaScript — no frameworks, no build tools.

## Live Preview

Open `index.html` directly in any browser. No server or build step required.

For live-reload during development:

```bash
npx serve .
# or
python -m http.server 8080
```

## Features

- **Hero section** — Full-viewport parallax background with a call-to-action
- **Menu** — Three categories (Entrées, Plats Principaux, Desserts) with 9 dishes, Unsplash photography, and SGD pricing
- **Testimonials** — Auto-rotating carousel with touch swipe, keyboard navigation, and dot indicators
- **Reservation form** — Client-side validation with real-time error feedback and a personalised success message
- **Responsive** — Mobile drawer nav, single-column layouts, and touch-friendly controls at all breakpoints
- **Accessible** — Semantic HTML, ARIA labels, focus management, and `aria-live` error announcements

## File Structure

```
index.html   — all markup, single page, five sections
styles.css   — all styles (~700 lines, CSS custom properties)
script.js    — all JS, wrapped in a single IIFE
```

## Tech Stack

| Layer      | Choice                                          |
|------------|-------------------------------------------------|
| Markup     | HTML5 (semantic elements)                       |
| Styles     | CSS3 (custom properties, grid, flex)            |
| Scripts    | Vanilla ES5 JavaScript (IIFE)                   |
| Fonts      | Google Fonts — Cormorant Garamond + Montserrat  |
| Images     | Unsplash CDN (`?w=600&q=80`)                    |
| Currency   | SGD — `toLocaleDateString('en-SG')`             |

## Sections

| # | Section      | ID              |
|---|--------------|-----------------|
| 1 | Navigation   | `.site-header`  |
| 2 | Hero         | `#hero`         |
| 3 | Menu         | `#menu`         |
| 4 | Testimonials | `#testimonials` |
| 5 | Reservations | `#reservations` |
| 6 | Footer       | `.site-footer`  |

## Design Tokens

All colours, typography, and spacing live in `:root` at the top of `styles.css`:

```css
--color-charcoal: #1a1a1a
--color-cream:    #f5f0e8
--color-gold:     #c9a96e
--font-serif:     'Cormorant Garamond', Georgia, serif
--font-sans:      'Montserrat', 'Helvetica Neue', Arial, sans-serif
```

## Form Validation

The reservation form validates six fields client-side:

- Full name (min 2 characters)
- Email address (format check)
- Phone number (digits, spaces, `+`, `-`, brackets)
- Date (today or future)
- Preferred time (required)
- Number of guests (required)

On success, the form is replaced with a personalised confirmation message including the guest's first name, formatted date, and time.
