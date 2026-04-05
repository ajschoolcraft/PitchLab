# Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the entire AI Presentation Coach UI from a light/orange theme to a dark editorial aesthetic with warm amber accents, serif display typography, and mobile-first design.

**Architecture:** Create a shared CSS design system (theme.css + components.css), then restyle each page/component to use CSS classes instead of inline styles and scoped `<style>` blocks. The NavBar becomes a bottom tab bar on mobile and a horizontal top bar on desktop.

**Tech Stack:** CSS custom properties, Google Fonts (Playfair Display, JetBrains Mono), existing React + Vite stack unchanged.

**Note on testing:** This is a pure visual/CSS redesign. There is no test suite in this project. Each task includes visual verification steps — run `npm run dev` and check the result in browser (mobile and desktop viewports).

---

## File Structure

### Files to Create
| File | Responsibility |
|------|---------------|
| `src/styles/theme.css` | CSS variables, font imports, base resets, keyframe animations |
| `src/styles/components.css` | Shared component classes (buttons, cards, inputs, badges, nav) |
| `src/styles/landing.css` | Landing page styles |
| `src/styles/auth.css` | Auth page styles |
| `src/styles/dashboard.css` | Dashboard page styles |
| `src/styles/script-generator.css` | Script generator page styles |
| `src/styles/record.css` | Record page styles |
| `src/styles/recorder.css` | MultiTakeVideoRecorder component styles |
| `src/styles/profile.css` | Profile page styles |
| `src/styles/not-found.css` | 404 page styles |
| `src/styles/onboarding.css` | Onboarding modal styles |
| `src/styles/teleprompter.css` | Teleprompter overlay styles |
| `src/styles/toast.css` | Toast notification styles |

### Files to Modify
| File | Changes |
|------|---------|
| `index.html` | Add Google Fonts preconnect links |
| `src/main.jsx` | Import `theme.css` and `components.css` |
| `src/index.css` | Gut entirely — replaced by theme.css |
| `src/App.css` | Gut entirely — replaced by theme.css |
| `src/components/NavBar.jsx` | Remove `<style>` block, add CSS import, restructure JSX for bottom tab bar on mobile |
| `src/components/Toast.jsx` | Remove `<style>` block, add CSS import |
| `src/components/MultiTakeVideoRecorder.jsx` | Remove inline `styles` object, add CSS import, use class names |
| `src/components/Teleprompter.jsx` | Remove `<style>` block, add CSS import |
| `src/components/Onboarding.jsx` | Remove `<style>` block, add CSS import |
| `src/pages/Landing.jsx` | Remove `<style>` block, add CSS import, use class names |
| `src/pages/Auth.jsx` | Remove `<style>` block, add CSS import |
| `src/pages/Dashboard.jsx` | Remove `<style>` block, add CSS import |
| `src/pages/ScriptGenerator.jsx` | Remove inline `styles` object, add CSS import, use class names |
| `src/pages/Record.jsx` | Remove `<style>` block, add CSS import |
| `src/pages/Profile.jsx` | Remove `<style>` block, add CSS import |
| `src/pages/NotFound.jsx` | Remove `<style>` block, add CSS import |
| `src/styles/Landing.css` | Delete (replaced by `src/styles/landing.css`) |

---

### Task 1: Create Design System — theme.css

**Files:**
- Create: `src/styles/theme.css`

- [ ] **Step 1: Create theme.css with CSS variables, fonts, resets, and animations**

```css
/* src/styles/theme.css */

/* Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* Colors */
  --bg-primary: #0f0f13;
  --bg-surface: #161621;
  --bg-elevated: #1c1c2a;
  --text-primary: #f5f0eb;
  --text-secondary: #c4b8a9;
  --text-muted: #7a7168;
  --accent: #d4a574;
  --accent-hover: #c4905a;
  --accent-light: #e8c9a0;
  --accent-glow: rgba(212, 165, 116, 0.08);
  --accent-glow-strong: rgba(212, 165, 116, 0.14);
  --success: #4ade80;
  --error: #f87171;
  --border: rgba(212, 165, 116, 0.12);
  --border-strong: rgba(212, 165, 116, 0.25);

  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 48px;
  --space-9: 64px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --radius-pill: 100px;

  /* Shadows */
  --shadow-card: 0 4px 24px var(--accent-glow);
  --shadow-card-hover: 0 8px 32px var(--accent-glow-strong);
  --shadow-button: 0 4px 16px rgba(196, 144, 90, 0.25);
  --shadow-input-focus: 0 0 0 2px rgba(212, 165, 116, 0.25);

  /* Nav height for spacing */
  --nav-height-mobile: 64px;
  --nav-height-desktop: 68px;
}

/* Base Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--accent);
  text-decoration: none;
}
a:hover {
  color: var(--accent-light);
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

p {
  margin: 0;
}

img {
  max-width: 100%;
  display: block;
}

/* Keyframes */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Utility */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.mono {
  font-family: var(--font-mono);
}

/* Page wrapper — adds padding for mobile bottom nav */
.page {
  min-height: 100vh;
  padding: var(--space-7) var(--space-4) calc(var(--nav-height-mobile) + var(--space-7));
}

@media (min-width: 768px) {
  .page {
    padding: var(--space-8) var(--space-6) var(--space-8);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/theme.css
git commit -m "feat: add editorial design system theme.css"
```

---

### Task 2: Create Shared Component Styles — components.css

**Files:**
- Create: `src/styles/components.css`

- [ ] **Step 1: Create components.css with buttons, cards, inputs, badges**

```css
/* src/styles/components.css */

/* ---- Buttons ---- */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--font-body);
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--accent-hover), var(--accent));
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-button);
  min-height: 48px;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(196, 144, 90, 0.35);
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--font-body);
  color: var(--accent);
  background: transparent;
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
}
.btn-secondary:hover {
  background: rgba(212, 165, 116, 0.08);
}

.btn-destructive {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--font-body);
  color: var(--error);
  background: transparent;
  border: 1px solid var(--error);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
}
.btn-destructive:hover {
  background: rgba(248, 113, 113, 0.1);
}

.btn-sm {
  padding: 6px 14px;
  font-size: 13px;
  min-height: 32px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  min-height: unset;
  font-size: 16px;
}

/* ---- Cards ---- */
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all 0.2s ease;
}
.card:hover {
  box-shadow: var(--shadow-card-hover);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.card-icon {
  width: 44px;
  height: 44px;
  background: rgba(212, 165, 116, 0.1);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.card-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

/* ---- Form Inputs ---- */
.input,
.textarea {
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  font-family: var(--font-body);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  transition: all 0.2s ease;
  min-height: 48px;
}
.input:focus,
.textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--shadow-input-focus);
}
.input::placeholder,
.textarea::placeholder {
  color: var(--text-muted);
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--space-2);
}

.form-field {
  margin-bottom: var(--space-5);
}

.form-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: var(--space-1);
}

/* ---- Badges / Pills ---- */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-pill);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.badge-accent {
  background: rgba(212, 165, 116, 0.15);
  border: 1px solid rgba(212, 165, 116, 0.3);
  color: var(--accent);
}

.badge-success {
  background: rgba(74, 222, 128, 0.15);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: var(--success);
}

.badge-error {
  background: rgba(248, 113, 113, 0.15);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: var(--error);
}

/* ---- Section Labels ---- */
.section-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: var(--space-2);
  font-family: var(--font-body);
}

/* ---- Empty States ---- */
.empty-state {
  text-align: center;
  padding: var(--space-7) var(--space-4);
}

.empty-state-icon {
  font-size: 40px;
  display: block;
  margin-bottom: var(--space-3);
  opacity: 0.5;
}

.empty-state-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: var(--space-1);
}

.empty-state-text {
  font-size: 13px;
  color: var(--text-muted);
  opacity: 0.7;
}

/* ---- Error Box ---- */
.error-box {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: var(--error);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: 14px;
  text-align: center;
}

/* ---- Spinner ---- */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-4);
}

/* ---- Stat Card ---- */
.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: center;
  transition: all 0.2s ease;
}
.stat-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.stat-number {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: 500;
  color: var(--accent);
  line-height: 1;
  margin-bottom: var(--space-2);
}

.stat-label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

/* ---- Divider ---- */
.divider {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin: var(--space-6) 0;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}
.divider-text {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/components.css
git commit -m "feat: add shared component styles"
```

---

### Task 3: Wire Up Design System + Gut Old Styles

**Files:**
- Modify: `index.html`
- Modify: `src/main.jsx:1-13`
- Modify: `src/index.css` (replace contents)
- Modify: `src/App.css` (replace contents)
- Delete: `src/styles/Landing.css`

- [ ] **Step 1: Add Google Fonts preconnect to index.html**

Replace the `<head>` contents in `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <title>PresentationCoach</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Update main.jsx to import new styles**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/theme.css";
import "./styles/components.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 3: Gut index.css (empty it)**

Replace entire contents of `src/index.css` with:

```css
/* Styles moved to src/styles/theme.css */
```

- [ ] **Step 4: Gut App.css (empty it)**

Replace entire contents of `src/App.css` with:

```css
/* Styles moved to src/styles/theme.css */
```

- [ ] **Step 5: Delete old Landing.css**

```bash
rm src/styles/Landing.css
```

- [ ] **Step 6: Verify — run `npm run dev`, open browser. Page should have dark background, correct fonts loading**

- [ ] **Step 7: Commit**

```bash
git add index.html src/main.jsx src/index.css src/App.css
git rm src/styles/Landing.css
git commit -m "feat: wire up design system, gut old global styles"
```

---

### Task 4: Restyle NavBar — Mobile Bottom Tabs + Desktop Top Bar

**Files:**
- Create: `src/styles/navbar.css`
- Modify: `src/components/NavBar.jsx`

- [ ] **Step 1: Create navbar.css**

```css
/* src/styles/navbar.css */

/* ---- Mobile: Bottom Tab Bar ---- */
.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--bg-primary);
  border-top: 1px solid var(--border);
  padding: var(--space-2) 0 calc(var(--space-2) + env(safe-area-inset-bottom));
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  max-width: 480px;
  margin: 0 auto;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-2) var(--space-3);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  transition: color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  min-width: 64px;
}

.nav-tab-icon {
  font-size: 22px;
  line-height: 1;
  filter: grayscale(1) opacity(0.5);
  transition: filter 0.2s ease;
}

.nav-tab-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.nav-tab.active .nav-tab-icon {
  filter: none;
}

.nav-tab.active .nav-tab-label {
  color: var(--accent);
  font-weight: 600;
}

/* Desktop top nav - hidden on mobile */
.nav-desktop {
  display: none;
}

/* ---- Desktop: Top Bar ---- */
@media (min-width: 768px) {
  .nav {
    display: none;
  }

  .nav-desktop {
    display: block;
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border);
    padding: 0 var(--space-6);
  }

  .nav-desktop-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--nav-height-desktop);
  }

  .nav-logo {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    transition: opacity 0.2s;
  }
  .nav-logo:hover {
    opacity: 0.8;
  }

  .nav-logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--accent-hover), var(--accent));
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .nav-link {
    padding: var(--space-2) var(--space-4);
    font-size: 15px;
    font-weight: 500;
    color: var(--text-muted);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  .nav-link:hover {
    color: var(--text-primary);
    background: var(--bg-surface);
  }
  .nav-link.active {
    color: var(--accent);
    background: rgba(212, 165, 116, 0.08);
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .nav-email {
    font-size: 13px;
    color: var(--text-muted);
  }

  .nav-logout {
    padding: var(--space-2) var(--space-5);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.2s ease;
  }
  .nav-logout:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: rgba(212, 165, 116, 0.08);
  }
}
```

- [ ] **Step 2: Rewrite NavBar.jsx**

```jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/navbar.css'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, loading } = useContext(AuthContext)

  if (loading) return null
  if (!user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/script-generator', label: 'Scripts', icon: '✍️' },
    { path: '/record', label: 'Record', icon: '🎥' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <nav className="nav">
        <div className="nav-inner">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-tab ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-tab-icon">{item.icon}</span>
              <span className="nav-tab-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Top Bar */}
      <div className="nav-desktop">
        <div className="nav-desktop-inner">
          <div className="nav-logo" onClick={() => navigate('/dashboard')}>
            <div className="nav-logo-icon">🎤</div>
            PresentationCoach
          </div>

          <div className="nav-links">
            {navItems.map(item => (
              <button
                key={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="nav-right">
            <span className="nav-email">{user.email}</span>
            <button className="nav-logout" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Verify — check mobile viewport (bottom tabs visible, top bar hidden) and desktop viewport (top bar visible, bottom tabs hidden)**

- [ ] **Step 4: Commit**

```bash
git add src/styles/navbar.css src/components/NavBar.jsx
git commit -m "feat: restyle NavBar — mobile bottom tabs + desktop top bar"
```

---

### Task 5: Restyle Toast Notifications

**Files:**
- Create: `src/styles/toast.css`
- Modify: `src/components/Toast.jsx`

- [ ] **Step 1: Create toast.css**

```css
/* src/styles/toast.css */

.toast-container {
  position: fixed;
  bottom: calc(var(--nav-height-mobile) + var(--space-4));
  left: var(--space-4);
  right: var(--space-4);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  pointer-events: none;
}

.toast {
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: 14px var(--space-5);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  animation: slideUp 0.3s ease;
  line-height: 1.4;
}
.toast.removing {
  animation: toastOut 0.3s ease forwards;
}

.toast-success { border-left: 3px solid var(--success); }
.toast-error { border-left: 3px solid var(--error); }
.toast-info { border-left: 3px solid var(--accent); }

.toast-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 16px;
  cursor: pointer;
  padding: 0 0 0 var(--space-2);
  flex-shrink: 0;
  transition: color 0.2s;
}
.toast-close:hover {
  color: var(--text-primary);
}

@keyframes toastOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(12px); }
}

@media (min-width: 768px) {
  .toast-container {
    bottom: unset;
    top: calc(var(--nav-height-desktop) + var(--space-4));
    left: unset;
    right: var(--space-5);
    max-width: 380px;
  }
}
```

- [ ] **Step 2: Update Toast.jsx — remove `<style>` block, add CSS import**

Replace the entire `ToastContainer` function's `<style>` block with an import at the top of the file:

```jsx
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import '../styles/toast.css'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }) {
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRemoving(true)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration)
    return () => clearTimeout(timer)
  }, [toast, onRemove])

  const icons = {
    success: '✓',
    error: '✕',
    info: '💡',
  }

  return (
    <div className={`toast toast-${toast.type} ${removing ? 'removing' : ''}`}>
      <span className="toast-icon">{icons[toast.type] || '✓'}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button className="toast-close" onClick={() => {
        setRemoving(true)
        setTimeout(() => onRemove(toast.id), 300)
      }}>
        ✕
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/toast.css src/components/Toast.jsx
git commit -m "feat: restyle toast notifications for dark theme"
```

---

### Task 6: Restyle Landing Page

**Files:**
- Create: `src/styles/landing.css`
- Modify: `src/pages/Landing.jsx`

- [ ] **Step 1: Create landing.css**

This is a large CSS file — see the design spec for full details. The landing page goes from white/orange to dark with amber accents and Playfair Display headings.

```css
/* src/styles/landing.css */

.landing {
  color: var(--text-primary);
  overflow-x: hidden;
}

/* Top Nav (landing-specific, user is NOT logged in) */
.landing-nav {
  padding: var(--space-5) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
}
.landing-nav-logo {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--text-primary);
}
.landing-nav-logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--accent-hover), var(--accent));
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

/* Hero */
.landing-hero {
  padding: 80px var(--space-6) 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.landing-hero::before {
  content: '';
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(212, 165, 116, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.landing-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: rgba(212, 165, 116, 0.1);
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: var(--space-7);
  animation: fadeInUp 0.6s ease;
}
.landing-hero h1 {
  font-size: clamp(32px, 6vw, 56px);
  line-height: 1.1;
  letter-spacing: -1px;
  margin: 0 auto var(--space-6);
  max-width: 700px;
  animation: fadeInUp 0.6s ease 0.1s both;
}
.landing-hero h1 span {
  color: var(--accent);
}
.landing-hero-sub {
  font-size: clamp(16px, 2.5vw, 20px);
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 520px;
  margin: 0 auto var(--space-8);
  animation: fadeInUp 0.6s ease 0.2s both;
}
.landing-hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  animation: fadeInUp 0.6s ease 0.3s both;
  flex-wrap: wrap;
}
.landing-hero-trust {
  margin-top: var(--space-9);
  font-size: 14px;
  color: var(--text-muted);
  animation: fadeInUp 0.6s ease 0.4s both;
}
.landing-hero-trust span {
  color: var(--accent);
  font-weight: 600;
}

/* How It Works */
.landing-how {
  padding: 100px var(--space-6);
  background: var(--bg-surface);
}
.landing-how-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.landing-section-label {
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: var(--space-4);
  font-family: var(--font-body);
}
.landing-section-title {
  text-align: center;
  font-size: clamp(24px, 4vw, 40px);
  margin-bottom: var(--space-4);
}
.landing-section-sub {
  text-align: center;
  font-size: 17px;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto var(--space-9);
  line-height: 1.6;
}
.landing-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-7);
}
.landing-step {
  text-align: center;
  padding: var(--space-8) var(--space-6);
  background: var(--bg-elevated);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}
.landing-step:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--border-strong);
}
.landing-step-num {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, var(--accent-hover), var(--accent));
  border-radius: var(--radius-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: var(--bg-primary);
  margin-bottom: var(--space-5);
  font-family: var(--font-mono);
}
.landing-step h3 {
  font-size: 20px;
  margin-bottom: var(--space-3);
}
.landing-step p {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Features */
.landing-features {
  padding: 100px var(--space-6);
}
.landing-features-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.landing-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}
.landing-feature {
  padding: var(--space-7);
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}
.landing-feature:hover {
  border-color: var(--border-strong);
  background: var(--bg-elevated);
}
.landing-feature-icon {
  width: 52px;
  height: 52px;
  background: rgba(212, 165, 116, 0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-bottom: var(--space-5);
}
.landing-feature h3 {
  font-size: 19px;
  margin-bottom: var(--space-2);
}
.landing-feature p {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Proof / Testimonial */
.landing-proof {
  padding: 80px var(--space-6);
  background: var(--bg-surface);
  text-align: center;
}
.landing-proof-inner {
  max-width: 700px;
  margin: 0 auto;
}
.landing-proof-quote {
  font-family: var(--font-display);
  font-size: clamp(20px, 3vw, 26px);
  font-weight: 400;
  font-style: italic;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}
.landing-proof-author {
  font-size: 15px;
  color: var(--text-muted);
}
.landing-proof-author strong {
  color: var(--text-secondary);
}

/* CTA */
.landing-cta {
  padding: 100px var(--space-6);
  text-align: center;
}
.landing-cta-bg {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px var(--space-6);
  position: relative;
  overflow: hidden;
}
.landing-cta-bg::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(212, 165, 116, 0.08), transparent);
  border-radius: 50%;
  pointer-events: none;
}
.landing-cta-inner {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}
.landing-cta h2 {
  font-size: clamp(24px, 4vw, 40px);
  margin-bottom: var(--space-4);
}
.landing-cta p {
  font-size: 17px;
  color: var(--text-secondary);
  margin-bottom: var(--space-8);
  line-height: 1.6;
}

/* Footer */
.landing-footer {
  padding: var(--space-8) var(--space-6);
  text-align: center;
  border-top: 1px solid var(--border);
}
.landing-footer p {
  color: var(--text-muted);
  font-size: 14px;
}

/* Mobile */
@media (max-width: 767px) {
  .landing-hero { padding: 50px var(--space-5) 70px; }
  .landing-steps { grid-template-columns: 1fr; gap: var(--space-4); }
  .landing-features-grid { grid-template-columns: 1fr; }
  .landing-hero-actions { flex-direction: column; }
  .landing-hero-actions .btn-primary,
  .landing-hero-actions .btn-secondary { width: 100%; text-align: center; }
  .landing-cta-bg { margin: 0 var(--space-3); padding: var(--space-9) var(--space-5); }
}
```

- [ ] **Step 2: Rewrite Landing.jsx — remove `<style>` block, import CSS, use new class names**

```jsx
import { useNavigate } from 'react-router-dom'
import '../styles/landing.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-nav-logo-icon">🎤</div>
          PresentationCoach
        </div>
        <button className="btn-primary btn-sm" onClick={() => navigate('/auth')}>
          Get Started Free
        </button>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-badge">
          ✨ AI-Powered Presentation Coaching
        </div>
        <h1>
          Speak with<br/><span>Confidence.</span>
        </h1>
        <p className="landing-hero-sub">
          Generate your script, practice on camera, and present like a pro.
          Your personal AI coach that helps you communicate clearly.
        </p>
        <div className="landing-hero-actions">
          <button className="btn-primary" onClick={() => navigate('/auth')}>
            Start For Free →
          </button>
          <button className="btn-secondary" onClick={() => {
            document.querySelector('.landing-how')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            See How It Works
          </button>
        </div>
        <p className="landing-hero-trust">
          Built for <span>entrepreneurs</span>, <span>small business owners</span>, and <span>job seekers</span>
        </p>
      </section>

      <section className="landing-how">
        <div className="landing-how-inner">
          <p className="landing-section-label">Simple as 1-2-3</p>
          <h2 className="landing-section-title">How It Works</h2>
          <p className="landing-section-sub">
            No experience needed. We guide you through every step.
          </p>
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-num">1</div>
              <h3>Tell Us Your Idea</h3>
              <p>Just describe what you want to talk about. Who's your audience? How long should it be? That's all we need.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">2</div>
              <h3>Get Your Script</h3>
              <p>Our AI writes a clear, structured script for you in seconds. Edit it, tweak it, make it yours.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">3</div>
              <h3>Record & Share</h3>
              <p>Practice on camera with your script as a guide. Download your best take and share it anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-features-inner">
          <p className="landing-section-label">Everything You Need</p>
          <h2 className="landing-section-title">Built For Real People</h2>
          <p className="landing-section-sub">
            No marketing jargon. No complicated tools. Just you, telling your story better.
          </p>
          <div className="landing-features-grid">
            <div className="landing-feature">
              <div className="landing-feature-icon">🤖</div>
              <h3>AI Script Generator</h3>
              <p>Tell us your topic and audience. Our AI creates a professional, structured script you can use right away — or customize to fit your voice.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">🎥</div>
              <h3>Multi-Take Recording</h3>
              <p>Record as many takes as you want. Review them side by side. Pick your best one. No pressure, no rush.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">📖</div>
              <h3>Built-In Teleprompter</h3>
              <p>Your script scrolls on screen while you record, so you never lose your place. Just look at the camera and speak naturally.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">📤</div>
              <h3>Share Anywhere</h3>
              <p>Download your video and post it to Instagram, TikTok, YouTube, or WhatsApp. We'll even tell you the best format for each platform.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-proof">
        <div className="landing-proof-inner">
          <p className="landing-section-label">Why It Matters</p>
          <p className="landing-proof-quote">
            "I used to spend hours trying to figure out what to say in my videos.
            Now I just type my idea and start recording in minutes."
          </p>
          <p className="landing-proof-author">
            <strong>Built by presenters, for presenters</strong> — LMU Capstone 2026
          </p>
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta-bg">
          <div className="landing-cta-inner">
            <h2>Ready to Present Better?</h2>
            <p>
              Join entrepreneurs and business owners who are telling their stories
              with clarity and confidence.
            </p>
            <button className="btn-primary" onClick={() => navigate('/auth')}>
              Get Started — It's Free
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>
          © 2026 PresentationCoach · Built with care at <a href="https://www.lmu.edu" target="_blank" rel="noreferrer">Loyola Marymount University</a>
        </p>
      </footer>
    </div>
  )
}
```

- [ ] **Step 3: Verify — check landing page on mobile and desktop viewports**

- [ ] **Step 4: Commit**

```bash
git add src/styles/landing.css src/pages/Landing.jsx
git commit -m "feat: restyle landing page with editorial dark theme"
```

---

### Task 7: Restyle Auth Page

**Files:**
- Create: `src/styles/auth.css`
- Modify: `src/pages/Auth.jsx`

- [ ] **Step 1: Create auth.css**

```css
/* src/styles/auth.css */

.auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.auth-wrapper {
  width: 100%;
  max-width: 420px;
}

.auth-logo {
  text-align: center;
  margin-bottom: var(--space-7);
}
.auth-logo-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--accent-hover), var(--accent));
  border-radius: var(--radius-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: var(--space-3);
}
.auth-logo-text {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.auth-card {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-7);
  border: 1px solid var(--border);
}

.auth-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: var(--space-1);
}

.auth-subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--space-7);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.auth-submit {
  width: 100%;
  margin-top: var(--space-1);
}

.auth-google {
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-family: var(--font-body);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  min-height: 48px;
}
.auth-google:hover {
  border-color: var(--border-strong);
  background: var(--bg-surface);
}

.auth-toggle {
  text-align: center;
  margin-top: var(--space-7);
  font-size: 14px;
  color: var(--text-secondary);
}
.auth-toggle button {
  background: none;
  border: none;
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  font-family: var(--font-body);
  margin-left: var(--space-1);
}
.auth-toggle button:hover {
  color: var(--accent-light);
}

.auth-back {
  text-align: center;
  margin-top: var(--space-5);
}
.auth-back button {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  font-family: var(--font-body);
}
.auth-back button:hover {
  color: var(--accent);
}

@media (max-width: 767px) {
  .auth { padding: var(--space-4); }
  .auth-card { padding: var(--space-7) var(--space-5); }
}
```

- [ ] **Step 2: Rewrite Auth.jsx — remove `<style>` block, import CSS, use new classes**

Replace the component's `<style>` block and update all `className` values to use the new auth CSS classes. Keep all existing logic (handleSubmit, handleGoogleSignIn, state) unchanged. Key class name mappings:
- `pc-auth` → `auth`
- `pc-auth-wrapper` → `auth-wrapper`
- `pc-auth-logo` → `auth-logo`
- `pc-auth-card` → `auth-card`
- `pc-auth-title` → `auth-title`
- `pc-auth-subtitle` → `auth-subtitle`
- `pc-auth-error` → `error-box` (from components.css)
- `pc-auth-form` → `auth-form`
- `pc-auth-field` → `form-field`
- `pc-auth-field label` → `form-label`
- `pc-auth-field input` → `input`
- `pc-auth-submit` → `btn-primary auth-submit`
- `pc-auth-divider` → `divider`
- `pc-auth-divider-line` → `divider-line`
- `pc-auth-divider-text` → `divider-text`
- `pc-auth-google` → `auth-google`
- `pc-auth-toggle` → `auth-toggle`
- `pc-auth-back` → `auth-back`

Add `import '../styles/auth.css'` at top.

- [ ] **Step 3: Verify — check auth page on mobile and desktop**

- [ ] **Step 4: Commit**

```bash
git add src/styles/auth.css src/pages/Auth.jsx
git commit -m "feat: restyle auth page with dark editorial theme"
```

---

### Task 8: Restyle Dashboard

**Files:**
- Create: `src/styles/dashboard.css`
- Modify: `src/pages/Dashboard.jsx`

- [ ] **Step 1: Create dashboard.css**

Style the dashboard with dark cards, Playfair greeting, monospace stat numbers, amber accents. Key patterns:
- `.dash` — page wrapper using `.page` base
- `.dash-greeting` — Playfair Display, amber
- `.dash-title` — Playfair Display, large
- `.dash-stats` — 3-col grid of `.stat-card`
- `.dash-action-card` — dark surface card with amber accent border-left
- `.dash-grid` — 2-col on desktop, 1-col on mobile
- Script items and recording items use dark surface backgrounds
- All existing functionality (delete, mark final, use script) preserved
- Mobile: everything stacks, bottom padding for nav

- [ ] **Step 2: Rewrite Dashboard.jsx — remove `<style>` block, import CSS, use new classes. Keep ALL logic unchanged.**

Replace `pc-dash-*` class names with new dashboard class names. Remove inline style objects. Add `import '../styles/dashboard.css'` at top.

- [ ] **Step 3: Verify — check dashboard with scripts and recordings on mobile and desktop**

- [ ] **Step 4: Commit**

```bash
git add src/styles/dashboard.css src/pages/Dashboard.jsx
git commit -m "feat: restyle dashboard with dark editorial theme"
```

---

### Task 9: Restyle Script Generator

**Files:**
- Create: `src/styles/script-generator.css`
- Modify: `src/pages/ScriptGenerator.jsx`

- [ ] **Step 1: Create script-generator.css**

Key changes:
- Dark background, Playfair question text
- Amber progress bar (replace blue)
- Dark card with elevated background
- Textarea with dark styling
- Back/Next buttons: btn-secondary / btn-primary
- Loading spinner uses amber
- Script result box already dark — refine with proper borders
- Mobile: question fills viewport, buttons fixed to bottom

- [ ] **Step 2: Rewrite ScriptGenerator.jsx — remove the `styles` object at bottom of file, import CSS, replace all `style={styles.xxx}` with `className="xxx"`. Keep ALL logic unchanged.**

- [ ] **Step 3: Verify — step through the wizard, generate a script, check mobile**

- [ ] **Step 4: Commit**

```bash
git add src/styles/script-generator.css src/pages/ScriptGenerator.jsx
git commit -m "feat: restyle script generator with dark editorial theme"
```

---

### Task 10: Restyle Record Page + MultiTakeVideoRecorder

**Files:**
- Create: `src/styles/record.css`
- Create: `src/styles/recorder.css`
- Modify: `src/pages/Record.jsx`
- Modify: `src/components/MultiTakeVideoRecorder.jsx`

- [ ] **Step 1: Create record.css for the Record page wrapper**

Dark background, Playfair title, dark teleprompter card, dark tips card with amber checkmarks. Mobile-first layout.

- [ ] **Step 2: Create recorder.css for MultiTakeVideoRecorder**

Dark card, circular record button with amber ring (red when recording), dark takes list, monospace timer, immersive teleprompter view with dark overlay. Replace the entire `styles` object at bottom of file.

- [ ] **Step 3: Rewrite Record.jsx — remove `<style>` block, import `record.css`, replace class names. Remove inline style objects for the script notification. Keep all logic unchanged.**

- [ ] **Step 4: Rewrite MultiTakeVideoRecorder.jsx — remove `styles` object, import `recorder.css`, replace all `style={styles.xxx}` with `className="xxx"`. Keep ALL recording/upload logic unchanged.**

- [ ] **Step 5: Verify — test camera enable, recording, stopping, reviewing takes, downloading on mobile and desktop**

- [ ] **Step 6: Commit**

```bash
git add src/styles/record.css src/styles/recorder.css src/pages/Record.jsx src/components/MultiTakeVideoRecorder.jsx
git commit -m "feat: restyle record page and video recorder with dark theme"
```

---

### Task 11: Restyle Teleprompter

**Files:**
- Create: `src/styles/teleprompter.css`
- Modify: `src/components/Teleprompter.jsx`

- [ ] **Step 1: Create teleprompter.css**

The teleprompter is already dark-themed. Changes needed:
- Replace orange (#FF9500) accent colors with amber (var(--accent))
- Use Playfair Display badge text
- Use CSS variables for consistency
- Keep all existing layout and functionality

- [ ] **Step 2: Rewrite Teleprompter.jsx — remove `<style>` block, import CSS. Keep all logic unchanged.**

- [ ] **Step 3: Verify — launch teleprompter, test scrolling, speed, mirror controls**

- [ ] **Step 4: Commit**

```bash
git add src/styles/teleprompter.css src/components/Teleprompter.jsx
git commit -m "feat: restyle teleprompter with editorial amber accents"
```

---

### Task 12: Restyle Profile Page

**Files:**
- Create: `src/styles/profile.css`
- Modify: `src/pages/Profile.jsx`

- [ ] **Step 1: Create profile.css**

Dark card layout, amber avatar border, Playfair display name, monospace stats, dark form fields with amber focus. Sign out uses btn-destructive pattern.

- [ ] **Step 2: Rewrite Profile.jsx — remove `<style>` block, import CSS, use new classes. Keep all logic unchanged.**

- [ ] **Step 3: Verify — check profile page, edit name/bio, check mobile**

- [ ] **Step 4: Commit**

```bash
git add src/styles/profile.css src/pages/Profile.jsx
git commit -m "feat: restyle profile page with dark editorial theme"
```

---

### Task 13: Restyle NotFound + Onboarding

**Files:**
- Create: `src/styles/not-found.css`
- Create: `src/styles/onboarding.css`
- Modify: `src/pages/NotFound.jsx`
- Modify: `src/components/Onboarding.jsx`

- [ ] **Step 1: Create not-found.css**

Centered dark layout, Playfair "404" in large amber-tinted text, DM Sans subtitle, amber CTA button.

- [ ] **Step 2: Create onboarding.css**

Dark overlay with blur, dark card instead of white, amber accents, Playfair title, amber gradient dots and buttons. Same 3-step carousel structure.

- [ ] **Step 3: Rewrite NotFound.jsx — remove `<style>` block, import CSS, use new classes**

- [ ] **Step 4: Rewrite Onboarding.jsx — remove `<style>` block, import CSS, use new classes. Keep all logic unchanged.**

- [ ] **Step 5: Verify — visit /nonexistent-path for 404, clear localStorage and visit dashboard for onboarding**

- [ ] **Step 6: Commit**

```bash
git add src/styles/not-found.css src/styles/onboarding.css src/pages/NotFound.jsx src/components/Onboarding.jsx
git commit -m "feat: restyle 404 page and onboarding modal"
```

---

### Task 14: Final Visual Review + Polish

- [ ] **Step 1: Run `npm run dev` and review every page on both mobile (375px) and desktop (1280px) viewports**

Check:
- Landing page: hero, how-it-works, features, testimonial, CTA, footer
- Auth page: sign up and sign in views
- Dashboard: stats, action card, scripts list, recordings list, quick actions
- Script Generator: step through questions, progress bar, generated script view
- Record page: teleprompter card, tips, video recorder, recording flow
- Profile: avatar, stats, edit form, sign out
- 404 page
- Onboarding modal
- Toast notifications
- NavBar: bottom tabs on mobile, top bar on desktop

- [ ] **Step 2: Fix any visual inconsistencies, spacing issues, or color mismatches found during review**

- [ ] **Step 3: Commit any polish fixes**

```bash
git add -A
git commit -m "fix: visual polish pass across all pages"
```
