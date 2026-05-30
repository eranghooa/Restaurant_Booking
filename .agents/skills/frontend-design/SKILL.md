---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces for a HIGH-CLASS CHINESE RESTAURANT. Red luxury theme, Chinese menu photography, and refined Chinese aesthetic. Use this skill when the user asks to build web components, pages, or interfaces for this project.
license: Complete terms in LICENSE.txt
---

This skill guides creation of production-grade frontend interfaces for an **upscale Chinese fine-dining restaurant**. Every output must feel like it belongs to a Michelin-starred establishment in Shanghai or Hong Kong — not a generic takeaway.

The user provides frontend requirements: a component, page, application, or interface to build.

## Brand Identity (NON-NEGOTIABLE)

**Restaurant concept**: High-class Chinese fine dining. Think: gilded private dining rooms, lacquered chopsticks, century-old recipes elevated with modern plating, aged Moutai and premium pu-erh tea.

**Mandatory colour palette** (use as CSS custom properties):
```css
--color-crimson:    #8B0000;   /* deep imperial red — dominant */
--color-gold:       #C9A84C;   /* warm 24k gold — accents, borders, dividers */
--color-lacquer:    #1A0A00;   /* near-black with red undertone — backgrounds */
--color-ivory:      #F5ECD7;   /* aged parchment — body text on dark */
--color-jade:       #3D7A5C;   /* cool jade green — rare accent only */
--color-smoke:      #2C1810;   /* dark smoke — card surfaces */
```

The UI is **predominantly dark** (lacquer/crimson backgrounds) with gold and ivory typography. Avoid white backgrounds entirely.

**Typography**:
- Display / headings: `Noto Serif SC` or `Ma Shan Zheng` (Google Fonts — traditional Chinese serif feel) paired with `Cinzel` for romanised names
- Body: `Lora` or `EB Garamond` — never Inter, Roboto, Arial
- Use `font-weight: 300` or `400` for elegance; avoid heavy weights except for single-word hero statements

**Decorative motifs**: Incorporate subtle Chinese design elements — lattice patterns (CSS `repeating-linear-gradient` or SVG), cloud scroll borders, plum blossom or peony accents (Unicode: ✿ ❀ 梅 牡丹), red lantern shapes (CSS circles/ovals with glow), dragon scale textures.

## Chinese Menu Photography

**ALL food imagery must be sourced from Unsplash using these curated Chinese cuisine search paths.** Use `?w=600&q=80` for cards, `?w=1920&q=85` for hero/banners.

Approved Unsplash image topics (use these exact search terms when constructing photo IDs):
- Dim sum / yum cha: `photo-1563245372-f21724e3856d` (har gow), `photo-1607301405390-d831c242f59b` (siu mai)
- Peking duck: `photo-1565557623262-b51c2513a641`
- Steamed fish: `photo-1512058564366-18510be2db19`
- Hot pot: `photo-1585032226651-759b368d7246`
- Xiaolongbao (soup dumplings): `photo-1496116218417-1a781b1c416c`
- Char siu (BBQ pork): `photo-1563379091339-03b21ab4a4f8`
- Mapo tofu: `photo-1582878826629-29b7ad1cdc43`
- Chinese tea ceremony: `photo-1556742049-0cfed4f6a45d`
- Restaurant interior / red lanterns: `photo-1552566626-52f8b828add9`
- Fried rice / noodles: `photo-1569050467447-ce54b3bbc37d`

Construct full URLs as: `https://images.unsplash.com/{photo-id}?w=600&q=80`

When photo IDs above don't fit the exact dish, use descriptive Unsplash source URLs with Chinese food keywords. Never use generic food images or non-Chinese cuisine photos.

## Menu Content

Use these **authentic dishes** when generating menu items:

**冷盤 Cold Starters**
- 鎮江肴肉 Zhenjiang Crystal Pork Terrine — S$32
- 夫妻肺片 Husband & Wife Beef Slices — S$28
- 蒜泥白肉 Garlic-Dressed Pork Belly — S$26

**點心 Dim Sum Signatures**
- 蟹黃小籠包 Crab Roe Xiaolongbao (6 pcs) — S$38
- 蝦餃皇 King Prawn Har Gow (4 pcs) — S$22
- 叉燒酥 Honey BBQ Pork Pastry (3 pcs) — S$18

**主菜 Main Courses**
- 北京烤鴨 Peking Duck (whole, two services) — S$188
- 清蒸石斑魚 Steamed Garoupa with Superior Soy — S$98/市價
- 紅燒獅子頭 Braised Pork Lion's Head — S$58
- 麻婆豆腐 Silken Tofu with Sichuan Spiced Minced Beef — S$42

**甜品 Desserts**
- 芒果班戟 Mango Pancake with Fresh Cream — S$18
- 桂花湯圓 Osmanthus Glutinous Rice Balls — S$16
- 楊枝甘露 Mango Pomelo Sago — S$20

## Design Thinking

Before coding, commit to ONE of these two aesthetic directions:

**Option A — Imperial Maximalism**: Dark lacquer backgrounds, abundant gold filigree, large hero imagery, dramatic entrance animations (fade + golden shimmer). Dense but organised. Like stepping into the Forbidden City.

**Option B — Modern Luxury Minimalism**: Deep crimson fields, generous whitespace (ivory), razor-thin gold rules, one bold Chinese character as a centrepiece graphic. Less is more — surgical precision. Like a contemporary Cantonese fine-dining room in a glass tower.

Both are valid — choose based on the component requested. A hero section suits Maximalism; a booking form suits Minimalism.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Imbued with the feel of high-end Chinese hospitality
- Cohesive — every detail reinforces the Imperial Red identity
- Meticulously refined in spacing, typography, and motion

## Animation & Motion

- Page load: staggered fade-in with a warm golden shimmer (`filter: brightness()` pulse)
- Hover on cards: subtle lift + gold border glow (`box-shadow: 0 0 20px rgba(201,168,76,0.4)`)
- Section reveals: `IntersectionObserver` + `translateY(24px) → 0` with `opacity` — same pattern as the existing codebase
- Lantern sway: CSS `@keyframes` gentle pendulum for decorative lantern SVGs (optional but memorable)
- NEVER use garish blinking or neon effects — elegance always wins

## What to NEVER Do

- White or light-grey backgrounds
- Non-Chinese food photography
- Generic fonts (Inter, Roboto, Arial, system-ui)
- Purple, blue, or teal as primary colours (jade green is the ONLY allowed cool accent, used sparingly)
- Clip-art dragons or stereotypical "Chinese restaurant" fonts (e.g. Wonton)
- Cookie-cutter card layouts — vary composition, use asymmetry and overlap
- Placeholder text like "Lorem ipsum" — always use real Chinese restaurant copy

Remember: this is a **destination restaurant** that competes with Amber, Shisen Hanten, and Jaan. The interface must feel like it was designed by a luxury brand agency, not generated from a template.
