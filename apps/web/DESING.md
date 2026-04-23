# Glinter Web Design Guide (for agents)

Use this as the **source of truth** for UI style decisions in `apps/web`.

## 1) Visual identity

- Dark, minimal, terminal-inspired interface.
- High contrast, low noise, subtle borders, soft hover transitions.
- Product feeling: technical, clean, serious, practical.

## 2) Design tokens (must match current site)

- **Primary bg**: `#0a0a0a`
- **Surface bg**: `zinc-900/40` to `zinc-950`
- **Primary text**: `text-secondary` (`#fff`)
- **Muted text**: `text-secondary/60` or `text-secondary/50`
- **Accent**: `text-accent` (`#059669`, emerald)
- **Borders**: `border-secondary/10` (default), `border-secondary/20` (interactive)

Defined in `src/styles/global.css`:

- `--color-primary: #000000`
- `--color-secondary: #ffffff`
- `--color-accent: #059669`

## 3) Typography

- Font family: **Jost Variable** (already loaded in `Layout.astro`).
- Headings: bold, compact, clear hierarchy (`text-3xl`/`text-4xl`/hero larger).
- Body copy: readable and muted (`text-secondary/60`, `leading-relaxed`).
- Terminal/data-like blocks: use `font-mono`.
- Avoid decorative fonts and heavy letter effects.

## 4) Layout & spacing patterns

- Container baseline: `max-w-7xl mx-auto`.
- Horizontal padding: `px-6` on mobile, remove or reduce on large screens.
- Section rhythm: generous vertical spacing (`mb-20`, `lg:mb-60`, `lg:mt-60`).
- Corners: mostly `rounded-xl` or `rounded-lg`.
- Cards/lists: thin separators (`divide-secondary/10`, `border-secondary/10`).

## 5) Component style rules

- Prefer simple geometric structure: cards, list rows, code blocks.
- Interactions should be subtle:
  - `transition-colors` / `transition-all`
  - Hover states with opacity shifts (`/70`, `/80`) or border emphasis.
- Keep icon color muted unless focused/hovered.
- Keep terminal aesthetic for command-focused UI.

## 6) Content tone in UI text

- Short, direct, utility-first copy.
- Focus on workflow speed, safety, clarity.
- Avoid marketing-heavy language or emoji-heavy UI text.

## 7) Accessibility & UX baseline

- Maintain strong contrast on dark background.
- Preserve semantic structure (`section`, `article`, heading order).
- Ensure clickable controls remain clear (hover + focus-visible styles when adding new controls).
- Do not hide important information behind animation only.

## 8) Agent implementation checklist

Before finishing any UI change, verify:

1. Uses existing tokens (`secondary`, `accent`, zinc dark surfaces), no random new palette.
2. Matches spacing/container rhythm (`max-w-7xl`, `px-6`, generous section gaps).
3. Uses subtle transitions, not flashy effects.
4. Keeps terminal/minimal style consistent with existing sections/components.
5. Keeps typography hierarchy and muted body text style.

## 9) Avoid

- Bright multicolor gradients as primary style.
- Glassmorphism-heavy blur UI.
- Thick borders, deep shadows everywhere, or over-animated elements.
- Introducing a new visual language that conflicts with current dark terminal identity.
