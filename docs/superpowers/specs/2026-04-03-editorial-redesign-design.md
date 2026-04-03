# Editorial Redesign — Design Spec

**Date:** 2026-04-03
**Scope:** Comprehensive visual refresh of all pages
**Approach:** Design system first, then restyle each page
**Priority:** Mobile-first, desktop as strong secondary
**Aesthetic:** Editorial / Luxury — dark backgrounds, serif typography, warm amber accents

---

## 1. Design System

### 1.1 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0f0f13` | Page backgrounds |
| `--bg-surface` | `#161621` | Cards, panels |
| `--bg-elevated` | `#1c1c2a` | Inputs, elevated elements |
| `--text-primary` | `#f5f0eb` | Headings, primary text |
| `--text-secondary` | `#c4b8a9` | Body text, descriptions |
| `--text-muted` | `#7a7168` | Hints, labels, timestamps |
| `--accent` | `#d4a574` | Primary brand accent (warm amber) |
| `--accent-hover` | `#c4905a` | Hover/active state |
| `--accent-light` | `#e8c9a0` | Highlights, light accents |
| `--success` | `#4ade80` | Recording states, confirmations |
| `--error` | `#f87171` | Destructive actions, validation errors |
| `--border` | `rgba(212, 165, 116, 0.12)` | Subtle amber-tinted borders |

### 1.2 Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display / Headings | Playfair Display | 400, 700 | Page titles, hero text, card headings |
| Body / UI | DM Sans (existing) | 300–700 | Body text, buttons, labels, navigation |
| Monospace accents | JetBrains Mono | 400, 500 | Recording timers, stats numbers, step counters |

**Fluid sizing for headings** using `clamp()`:
- Hero: `clamp(32px, 6vw, 56px)`
- Page title: `clamp(24px, 4vw, 40px)`
- Section heading: `clamp(18px, 3vw, 28px)`
- Body: 15–16px
- Small/label: 12–13px

### 1.3 Spacing

- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 48, 64
- Mobile page margins: 16–20px
- Desktop max-width: 1100px, centered
- CSS variables: `--space-1` through `--space-9`

### 1.4 Shadows & Effects

- Card shadow: `0 4px 24px rgba(212, 165, 116, 0.08)`
- Card hover: `0 8px 32px rgba(212, 165, 116, 0.14)` + `translateY(-2px)`
- Input focus: `0 0 0 2px rgba(212, 165, 116, 0.25)` (glow ring)
- Transitions: `0.2s ease` for colors, `0.3s ease` for transforms

### 1.5 Border Radius

- Cards: 12px
- Buttons: 10px
- Inputs: 8px
- Badges/pills: 20px
- Avatars: 50% (circle)

---

## 2. Shared Components

### 2.1 NavBar

**Mobile (bottom tab bar):**
- Fixed to bottom, dark background (`--bg-primary`), top border (`--border`)
- 4 tabs: Dashboard, Scripts, Record, Profile
- Each tab: icon + label (12px)
- Active: amber icon + label (`--accent`), inactive: muted (`--text-muted`)
- 48px+ touch targets

**Desktop (top bar):**
- Sticky top, dark background, horizontal links
- Logo/wordmark left, navigation center or left-aligned, user avatar right
- Active link: amber underline or text color
- Max-width 1100px centered content

### 2.2 Cards

- Background: `--bg-surface`
- Border: 1px `--border`
- Radius: 12px
- Padding: 20–24px
- Heading: Playfair Display
- Body: DM Sans, `--text-secondary`
- Hover: shadow increase + subtle lift
- Script cards: title + first-line preview + date
- Recording cards: thumbnail + duration badge (monospace) + status pill

### 2.3 Buttons

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Primary | gradient `#c4905a` → `#d4a574` | `#f5f0eb` | none |
| Secondary | transparent | `--accent` | 1px `--accent` |
| Destructive | transparent | `--error` | 1px `--error` |

- Min-height: 48px on mobile (touch-friendly)
- Border-radius: 10px
- Font: DM Sans, 500 weight
- Hover: darken/lighten + subtle shadow

### 2.4 Form Inputs

- Background: `--bg-elevated`
- Border: 1px `--border`
- Text: `--text-primary`
- Placeholder: `--text-muted`
- Focus: amber border + amber glow ring
- Label: DM Sans, 12px, uppercase letter-spacing, `--text-muted`
- Radius: 8px
- Min-height: 48px on mobile

### 2.5 Toast Notifications

- Background: `--bg-surface`
- Left accent bar: 3px amber (or red for errors, green for success)
- Slides up from bottom on mobile
- Auto-dismisses after 4 seconds

---

## 3. Page Designs

### 3.1 Landing Page

- **Hero**: Full-bleed dark background, radial gradient behind text for depth. Large Playfair headline ("Speak with Confidence."), amber accent line, DM Sans subtitle. Amber gradient CTA button.
- **How it Works**: 3-step section. Horizontal on desktop, vertical stack on mobile. Numbered amber circles, Playfair step titles, DM Sans descriptions.
- **Features grid**: 2x2 on desktop, single column on mobile. Dark cards with amber icon accents, Playfair titles.
- **Testimonial**: Large serif pull-quote, placeholder attribution. Subtle amber quotation mark decoration.
- **CTA footer**: Dark section, Playfair headline, amber gradient button.
- **Mobile**: All sections single-column, generous vertical spacing, large tap targets.

### 3.2 Auth Page

- Centered dark card on `--bg-primary` background
- Playfair heading ("Welcome Back" / "Get Started")
- Toggle between login and signup
- Form inputs in dark style with amber focus states
- Google OAuth button: dark surface, subtle border, Google icon
- Primary amber button for submit
- Mobile: card fills width with 16px side margins

### 3.3 Dashboard

- **Welcome**: Playfair greeting ("Good evening, [Name].")
- **Stats row**: 3 small cards, monospace numbers (JetBrains Mono), amber labels. Horizontal scroll on mobile if needed.
- **Quick actions**: 2 prominent cards — "New Script" and "Record" — amber gradient accents, large tap targets.
- **My Scripts**: Vertical card list with title + preview line + date + use/delete actions.
- **My Recordings**: Thumbnail grid — 2 columns on mobile, 3 on desktop. Duration badge overlay (monospace), status pill, action buttons.
- **Mobile**: Everything stacks vertically, generous spacing between sections.

### 3.4 Script Generator

- **Progress**: Thin amber progress bar at top showing step X of 11.
- **Question screen**: One question per view. Playfair question text, DM Sans example/hint below. Large textarea or text input in dark style.
- **Navigation**: "Back" (secondary) and "Next" (primary amber) buttons. Fixed to bottom on mobile for easy thumb reach.
- **Generation screen**: Loading state with amber pulse animation. Result displayed in styled card — script text with clear section formatting.
- **Mobile**: Question fills viewport height, bottom-anchored navigation buttons.

### 3.5 Record Page

- **Immersive dark layout**: Camera viewfinder takes majority of screen.
- **Teleprompter**: Text overlay below/above video (existing implementation, restyled).
- **Controls**: Large circular record button — amber ring idle, red when recording. Take counter in monospace.
- **Takes list**: Horizontal scrollable row of thumbnail cards below controls. Each shows duration badge + "final" pill.
- **Mobile**: Viewfinder full-width, controls large and bottom-anchored, takes scroll horizontally.

### 3.6 Profile Page

- Dark card layout on `--bg-primary` background
- Avatar circle with amber border (initials if no image)
- Playfair display name, DM Sans bio
- Stats section with monospace numbers, amber labels
- Edit mode: inline form fields with dark styling, amber focus
- Sign out: secondary button at bottom
- Mobile: single column, full-width card

### 3.7 Not Found (404)

- Centered dark layout
- Playfair "404" in large display size, amber tint
- DM Sans subtitle explaining the error
- Amber button to return to dashboard

---

## 4. Implementation Approach

### 4.1 Create Design System File

Create `src/styles/theme.css` containing:
- All CSS custom properties (colors, spacing, typography, shadows)
- Base element resets styled to the theme
- Google Fonts imports (Playfair Display, JetBrains Mono — DM Sans already imported)

### 4.2 Create Shared Component Styles

Create `src/styles/components.css` containing:
- `.btn-primary`, `.btn-secondary`, `.btn-destructive`
- `.card` base styles
- `.input`, `.textarea`, `.label` form styles
- `.badge`, `.pill` decorative elements
- NavBar styles (mobile bottom bar + desktop top bar)

### 4.3 Restyle Pages

For each page (Landing, Auth, Dashboard, ScriptGenerator, Record, Profile, NotFound):
- Replace inline style objects with CSS classes from the design system
- Replace scoped `<style>` blocks with imports from shared styles + page-specific CSS file where needed
- Ensure mobile-first responsive behavior (base styles = mobile, media queries add desktop)

### 4.4 Responsive Strategy

- Base CSS = mobile layout (single column, bottom nav, full-width cards)
- `@media (min-width: 768px)` = tablet adjustments
- `@media (min-width: 1024px)` = desktop (top nav, multi-column grids, max-width container)

---

## 5. Files to Create

| File | Purpose |
|------|---------|
| `src/styles/theme.css` | CSS variables, base resets, font imports |
| `src/styles/components.css` | Shared component classes |
| `src/styles/landing.css` | Landing page specific styles (replace existing) |
| `src/styles/auth.css` | Auth page styles |
| `src/styles/dashboard.css` | Dashboard styles |
| `src/styles/script-generator.css` | Script generator styles |
| `src/styles/record.css` | Record page styles |
| `src/styles/profile.css` | Profile page styles |

## 6. Files to Modify

| File | Changes |
|------|---------|
| `src/main.jsx` | Import `theme.css` and `components.css` globally |
| `src/index.css` | Remove/replace with theme.css import, or gut and redirect |
| `src/App.css` | Remove global styles that move into theme.css |
| `src/App.jsx` | No structural changes expected |
| `src/components/NavBar.jsx` | Restyle to bottom tab bar (mobile) + top bar (desktop) |
| `src/components/Toast.jsx` | Restyle to match dark theme with accent bar |
| `src/components/MultiTakeVideoRecorder.jsx` | Restyle controls and takes list |
| `src/components/Teleprompter.jsx` | Restyle for dark immersive look |
| `src/components/Onboarding.jsx` | Restyle modal to match theme |
| `src/pages/Landing.jsx` | Replace inline styles with CSS classes |
| `src/pages/Auth.jsx` | Replace inline/scoped styles with CSS classes |
| `src/pages/Dashboard.jsx` | Replace inline/scoped styles with CSS classes |
| `src/pages/ScriptGenerator.jsx` | Replace inline style objects with CSS classes |
| `src/pages/Record.jsx` | Replace inline/scoped styles with CSS classes |
| `src/pages/Profile.jsx` | Replace inline/scoped styles with CSS classes |
| `src/pages/NotFound.jsx` | Restyle to match theme |
| `src/styles/Landing.css` | Replace contents with new editorial landing styles |
