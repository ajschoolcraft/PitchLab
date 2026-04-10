# Mobile Polish + Recorder Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship final pre-launch polish for AI Presentation Coach — hybrid mobile nav (4-slot tab bar + slide-out drawer), auto-save every recorded take, restore the broken thumbnail helper, per-take save status + delete, Help placeholder page, and restyle Share + Recordings to the editorial theme.

**Architecture:** Client-only work on `main`. NavBar becomes a single file with three internal sub-components (BottomTabs, MobileDrawer, DesktopTopBar). The recorder's Supabase upload logic is extracted from `downloadTake()` into a `saveTakeToSupabase()` helper that runs fire-and-forget from `recorder.onstop`; takes gain `saveStatus`/`dbId`/`saveError` fields for UI feedback. Share + Recordings get mechanical CSS ports (hardcoded colors → theme variables). Help is a new minimal placeholder page.

**Tech Stack:** React 19, react-router-dom 7, Supabase JS, Vite, CSS variables. No test framework — verification is manual via a walkthrough per task.

**Source spec:** `docs/superpowers/specs/2026-04-09-mobile-polish-recorder-fixes-design.md`

---

## Notes on verification

This project has no test runner. Every task uses a manual verification block instead of a failing test. Before any work, run `npm run dev` in one terminal; leave it running for the full plan. After each task, perform the verification steps listed and confirm the expected output before committing.

Commits are small and frequent — one per task, with a Conventional Commits prefix (`feat:`, `fix:`, `style:`, `refactor:`, `chore:`). Do not batch tasks into a single commit.

---

## Task 1: Restore `generateThumbnail` helper in the recorder

**Why first:** standalone bug fix, unblocks the auto-save task (which calls `generateThumbnail`), and can be verified in isolation by hitting Download on a take.

**Files:**
- Modify: `src/components/MultiTakeVideoRecorder.jsx` (insert helper after line 194, before `stopRecording`)

- [ ] **Step 1: Add the helper function**

Open `src/components/MultiTakeVideoRecorder.jsx`. After the closing `};` of `startRecordingNow` (currently line 194) and before `const stopRecording = () => {` (currently line 196), insert:

```javascript
  const generateThumbnail = (videoUrl) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;
      video.muted = true;
      video.onloadeddata = () => {
        video.currentTime = 0.1;
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob returned null'));
          },
          'image/jpeg',
          0.7
        );
      };
      video.onerror = () => reject(new Error('Video load failed'));
    });
  };

```

- [ ] **Step 2: Verify the app still compiles**

Run: `npm run lint`
Expected: Exit code 0. No new errors. (Pre-existing warnings are OK — just confirm nothing new from your edit.)

Then check the dev server in your browser; it should hot-reload without a red overlay.

- [ ] **Step 3: Manual smoke test**

1. Visit `/record` in the browser.
2. Enable camera → Start Recording → wait ~3s → Stop.
3. Click the "Download" button on the take.
4. In the browser DevTools console, confirm you see `Thumbnail saved: https://...` (no `ReferenceError: generateThumbnail is not defined`).
5. Open Supabase Studio → Storage → `thumbnails` bucket. Confirm a new `.jpg` file appears under `<your-user-id>/`.
6. Navigate to `/dashboard`. The just-recorded video should show an actual thumbnail image, not the 🎥 placeholder.

Expected: all six checks pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/MultiTakeVideoRecorder.jsx
git commit -m "fix: restore generateThumbnail helper lost in editorial merge"
```

---

## Task 2: Create the Help placeholder page

**Why next:** self-contained (one new page, one new stylesheet, one new route), and the NavBar refactor in Task 6 will need `/help` to exist before wiring the drawer link.

**Files:**
- Create: `src/pages/Help.jsx`
- Create: `src/styles/help.css`
- Modify: `src/App.jsx` (add import + route)

- [ ] **Step 1: Create `src/pages/Help.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import '../styles/help.css';

export default function Help() {
  const navigate = useNavigate();

  // TODO: replace with the real support inbox before shipping
  const supportEmail = 'support@presentationcoach.example';

  return (
    <div className="help">
      <div className="help-inner">
        <button className="help-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="help-header">
          <p className="help-label">Support</p>
          <h1 className="help-title">Help & Troubleshooting</h1>
          <p className="help-subtitle">
            We're still building this out — here's how to get in touch in the meantime.
          </p>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">📬 Contact us</h2>
          <p className="help-card-text">
            Found a bug, have a feature request, or just need a hand? Drop us a note:
          </p>
          <a className="help-email" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">📖 Coming soon</h2>
          <p className="help-card-text">
            A full troubleshooting guide with camera/mic setup tips, browser compatibility notes,
            and answers to common questions is on the way.
          </p>
        </div>

        <button className="help-dashboard-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/styles/help.css`**

```css
/* src/styles/help.css */

.help {
  min-height: 100vh;
  padding: var(--space-8) var(--space-6) 100px;
}

.help-inner {
  max-width: 720px;
  margin: 0 auto;
}

.help-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  margin-bottom: var(--space-6);
  padding: 0;
  transition: color 0.2s;
}
.help-back:hover {
  color: var(--accent);
}

.help-header {
  margin-bottom: var(--space-7);
}

.help-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: var(--space-2);
  font-family: var(--font-body);
}

.help-title {
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.help-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.help-card {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-7);
  border: 1px solid var(--border);
  margin-bottom: var(--space-6);
}

.help-card-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.help-card-text {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-4);
}

.help-email {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 15px;
  color: var(--accent);
  padding: var(--space-3) var(--space-4);
  background: var(--accent-glow);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.2s;
}
.help-email:hover {
  background: var(--accent-glow-strong);
  color: var(--accent-light);
}

.help-dashboard-btn {
  width: 100%;
  padding: var(--space-4);
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-body);
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}
.help-dashboard-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-glow);
}

@media (max-width: 767px) {
  .help { padding: var(--space-6) var(--space-4) 100px; }
  .help-title { font-size: 26px; }
  .help-card { padding: var(--space-6) var(--space-5); }
}
```

- [ ] **Step 3: Wire the route in `src/App.jsx`**

Add the import after the existing page imports (e.g., after line 14 `import Recordings from './pages/Recordings'`):

```javascript
import Help from './pages/Help'
```

Add the route inside `<Routes>`, after the `/share` route block (currently lines 51–55) and before the catch-all `<Route path="*" element={<NotFound />} />`:

```jsx
          <Route path="/help" element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          } />
```

- [ ] **Step 4: Manual verification**

1. In the browser address bar, navigate to `/help`.
2. Expected: the Help page renders with the label "Support", title "Help & Troubleshooting", two cards, and a "Back to Dashboard" button at the bottom.
3. Click "← Back to Dashboard" (top) → lands on `/dashboard`.
4. Navigate back to `/help`, click "Back to Dashboard" (bottom button) → lands on `/dashboard`.
5. Colors/fonts should match Profile and Dashboard (amber accent, Playfair Display heading, DM Sans body).
6. Resize to mobile width (<768px). Layout should stack cleanly; nothing overflows.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Help.jsx src/styles/help.css src/App.jsx
git commit -m "feat: add Help placeholder page with contact info"
```

---

## Task 3: Port `src/styles/share.css` to theme variables

**Why here:** pure CSS, touches no JS, independent of the NavBar work. Mechanical find-and-replace against theme tokens.

**Files:**
- Rewrite: `src/styles/share.css`

- [ ] **Step 1: Replace the whole file**

Overwrite `src/styles/share.css` with this content (same class names, same structure, just using theme tokens):

```css
/* src/styles/share.css */

.share {
  min-height: 100vh;
  padding: var(--space-8) var(--space-6) 100px;
  font-family: var(--font-body);
}

.share-inner {
  max-width: 900px;
  margin: 0 auto;
}

.share-back {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: var(--space-7);
}
.share-back:hover {
  background: var(--accent-glow);
  color: var(--accent);
  border-color: var(--accent);
}

.share-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.share-label {
  font-size: 12px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  margin-bottom: var(--space-2);
  font-family: var(--font-body);
}

.share-title {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.share-subtitle {
  font-size: 17px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-5);
  margin-bottom: var(--space-8);
}

.platform-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-7);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  font-family: var(--font-body);
  color: var(--text-primary);
}
.platform-card:hover {
  border-color: var(--accent);
  background: var(--bg-elevated);
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
}

.platform-icon {
  font-size: 48px;
}

.platform-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-body);
}

.instructions-container {
  animation: fadeIn 0.3s;
}

.back-btn {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-body);
  cursor: pointer;
  margin-bottom: var(--space-7);
  transition: all 0.2s;
}
.back-btn:hover {
  background: var(--accent-glow);
  color: var(--accent);
  border-color: var(--accent);
}

.platform-header {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  margin-bottom: var(--space-7);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--border);
}

.platform-icon-large {
  font-size: 64px;
}

.platform-header h2 {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.instructions-section {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-5);
}

.section-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: var(--space-4);
}

.steps-list,
.tips-list {
  margin: 0;
  padding-left: var(--space-5);
}

.steps-list li,
.tips-list li {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--space-3);
  font-family: var(--font-body);
}

.tips-list li {
  color: var(--text-muted);
}

.reminder-box {
  background: var(--accent-glow);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-7);
}

.reminder-box strong {
  color: var(--accent);
  font-size: 15px;
  font-family: var(--font-body);
}

.reminder-box p {
  color: var(--text-secondary);
  margin: var(--space-2) 0 0;
  line-height: 1.6;
  font-family: var(--font-body);
}

.done-btn {
  background: linear-gradient(135deg, var(--accent-hover), var(--accent));
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-7);
  font-size: 16px;
  font-weight: 700;
  font-family: var(--font-body);
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
  box-shadow: var(--shadow-button);
}
.done-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

@media (max-width: 767px) {
  .share {
    padding: var(--space-6) var(--space-4) 100px;
  }
  .share-title {
    font-size: 28px;
  }
  .platform-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--space-4);
  }
  .platform-card {
    padding: var(--space-5);
  }
  .platform-icon {
    font-size: 36px;
  }
  .platform-header {
    flex-direction: column;
    text-align: center;
  }
  .platform-header h2 {
    font-size: 22px;
  }
}
```

- [ ] **Step 2: Manual verification**

1. Visit `/share` in the browser.
2. Header should use Playfair Display (`.share-title`). Label should be amber small-caps.
3. Platform cards should have amber hover borders and lift on hover (same feel as Dashboard action cards).
4. Click into a platform (e.g., Instagram). Section titles should be amber Playfair; steps should be readable cream text.
5. Open Dashboard in another tab and visually compare surfaces, spacing, accents — they should look like the same app.
6. Resize to mobile. Cards should reflow into narrower columns, header stacks, nothing overflows.

- [ ] **Step 3: Commit**

```bash
git add src/styles/share.css
git commit -m "style: port share.css to editorial theme variables"
```

---

## Task 4: Port `src/styles/recordings.css` to theme variables

**Why here:** same mechanical port as Task 3, independent from other work.

**Files:**
- Rewrite: `src/styles/recordings.css`

- [ ] **Step 1: Replace the whole file**

Overwrite `src/styles/recordings.css` with:

```css
/* src/styles/recordings.css */

.recordings {
  min-height: 100vh;
  padding: var(--space-8) var(--space-6) 100px;
  font-family: var(--font-body);
}

.recordings-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.recordings-back {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: var(--space-7);
}
.recordings-back:hover {
  background: var(--accent-glow);
  color: var(--accent);
  border-color: var(--accent);
}

.recordings-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.recordings-label {
  font-size: 12px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  margin-bottom: var(--space-2);
  font-family: var(--font-body);
}

.recordings-title {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.recordings-subtitle {
  font-size: 17px;
  color: var(--text-secondary);
}

.loading {
  text-align: center;
  color: var(--text-muted);
  font-size: 17px;
  padding: var(--space-9);
  font-family: var(--font-body);
}

.empty-state {
  text-align: center;
  padding: var(--space-9) var(--space-7);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: var(--space-4);
}

.empty-state h2 {
  font-family: var(--font-display);
  color: var(--text-primary);
  font-size: 24px;
  margin-bottom: var(--space-2);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: var(--space-7);
  font-family: var(--font-body);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-hover), var(--accent));
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-7);
  font-size: 16px;
  font-weight: 700;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-button);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.recordings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-5);
}

.recording-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  transition: all 0.2s;
}
.recording-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
}

.recording-thumb,
.recording-thumb-placeholder {
  width: 100%;
  height: 180px;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
  object-fit: cover;
}

.recording-thumb-placeholder {
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  border: 1px solid var(--border);
}

.recording-info h3 {
  font-family: var(--font-display);
  color: var(--text-primary);
  font-size: 18px;
  margin-bottom: var(--space-2);
}

.final-badge {
  color: var(--accent);
}

.recording-date {
  color: var(--text-muted);
  font-size: 14px;
  font-family: var(--font-body);
}

.recording-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.btn-view {
  flex: 1;
  background: linear-gradient(135deg, var(--accent-hover), var(--accent));
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  font-size: 14px;
  font-weight: 700;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-view:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-button);
}

.btn-mark {
  background: var(--bg-elevated);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-mark.active {
  background: var(--accent-glow);
  border-color: var(--accent);
  color: var(--accent);
}

.btn-delete {
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.25);
  color: var(--error);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-delete:hover {
  background: rgba(248, 113, 113, 0.15);
}

.playback-view {
  animation: fadeIn 0.3s;
}

.back-btn {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-body);
  cursor: pointer;
  margin-bottom: var(--space-7);
  transition: all 0.2s;
}
.back-btn:hover {
  background: var(--accent-glow);
  color: var(--accent);
  border-color: var(--accent);
}

.playback-container {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-7);
}

.playback-video {
  width: 100%;
  max-height: 600px;
  border-radius: var(--radius-md);
  background: #000;
  margin-bottom: var(--space-7);
}

.loading-video {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  margin-bottom: var(--space-7);
  font-family: var(--font-body);
}

.playback-info {
  margin-top: var(--space-5);
}

.playback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-7);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--border);
}

.playback-header h2 {
  font-family: var(--font-display);
  color: var(--text-primary);
  font-size: 24px;
  margin: 0;
}

.playback-date {
  color: var(--text-muted);
  font-size: 14px;
  font-family: var(--font-body);
}

.other-takes {
  margin-bottom: var(--space-7);
}

.other-takes h3 {
  font-family: var(--font-display);
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: var(--space-4);
}

.takes-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.take-btn {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.2s;
}
.take-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.take-btn.active {
  background: var(--accent-glow);
  border-color: var(--accent);
  color: var(--accent);
}

.playback-actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.btn-download,
.btn-share,
.btn-final {
  flex: 1;
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-size: 15px;
  font-weight: 700;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border);
}

.btn-download {
  background: var(--bg-elevated);
  color: var(--text-primary);
}
.btn-download:hover {
  background: var(--accent-glow);
  color: var(--accent);
  border-color: var(--accent);
}

.btn-share {
  background: linear-gradient(135deg, var(--accent-hover), var(--accent));
  color: var(--bg-primary);
  border: none;
  box-shadow: var(--shadow-button);
}
.btn-share:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.btn-final {
  background: var(--bg-elevated);
  color: var(--text-muted);
}
.btn-final:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.btn-final.active {
  background: var(--accent-glow);
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 767px) {
  .recordings {
    padding: var(--space-6) var(--space-4) 100px;
  }
  .recordings-title {
    font-size: 28px;
  }
  .recordings-grid {
    grid-template-columns: 1fr;
  }
  .playback-container {
    padding: var(--space-5);
  }
  .playback-actions {
    flex-direction: column;
  }
  .playback-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
}
```

- [ ] **Step 2: Manual verification**

1. Visit `/recordings`. If you have no recordings yet, record one first.
2. Page header: Playfair Display title, amber small-caps label.
3. Recording cards: amber hover border, lift on hover.
4. Click a recording → playback view renders with themed button trio (Download / Share / Mark as Final) — amber Share button, subtle Download + Final buttons.
5. Side-by-side with Dashboard → consistent.
6. Mobile width: grid collapses to one column, actions stack vertically, nothing overflows.

- [ ] **Step 3: Commit**

```bash
git add src/styles/recordings.css
git commit -m "style: port recordings.css to editorial theme variables"
```

---

## Task 5: Add drawer CSS to `src/styles/navbar.css`

**Why before the JSX refactor:** the CSS can land first and be invisible. Then Task 6's JSX changes immediately have the styles they need, and the diff is smaller on each side.

**Files:**
- Modify: `src/styles/navbar.css` (add new drawer styles inside the existing mobile block)

- [ ] **Step 1: Append drawer styles**

Open `src/styles/navbar.css`. After line 59 (the closing `}` of `.nav-tab.active .nav-tab-label`) and before line 61 (`/* Desktop top nav - hidden on mobile */`), insert:

```css

/* ---- Mobile: Slide-out Drawer ---- */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 150;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.drawer-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(84vw, 320px);
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  z-index: 200;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.28s ease;
  padding: calc(var(--space-7) + env(safe-area-inset-top)) var(--space-5) calc(var(--space-5) + env(safe-area-inset-bottom));
  font-family: var(--font-body);
}
.drawer.open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-bottom: var(--space-5);
  margin-bottom: var(--space-5);
  border-bottom: 1px solid var(--border);
}

.drawer-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--accent-hover), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--bg-primary);
  flex-shrink: 0;
}

.drawer-user-email {
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawer-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: var(--font-body);
  text-align: left;
  transition: all 0.18s ease;
}
.drawer-link:hover {
  color: var(--accent);
  background: var(--accent-glow);
}
.drawer-link-icon {
  font-size: 18px;
  width: 22px;
  text-align: center;
}

.drawer-footer {
  padding-top: var(--space-5);
  border-top: 1px solid var(--border);
}

.drawer-logout {
  width: 100%;
  padding: var(--space-3) var(--space-4);
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
.drawer-logout:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-glow);
}
```

Then, inside the existing desktop media query (currently starting at line 67 with `@media (min-width: 768px) {`), add rules hiding the drawer on desktop. Find the `.nav { display: none; }` block (currently lines 68–70) and add immediately after it (still inside the `@media` block):

```css
  .drawer,
  .drawer-backdrop {
    display: none;
  }
```

- [ ] **Step 2: Manual verification**

No visible change yet — the JSX doesn't render the drawer elements. Confirm:

1. `npm run lint` exits 0.
2. Existing mobile nav still renders correctly at mobile width (no regressions).
3. Existing desktop top bar still renders at ≥768px.

- [ ] **Step 3: Commit**

```bash
git add src/styles/navbar.css
git commit -m "style: add mobile drawer styles to navbar.css"
```

---

## Task 6: Refactor `NavBar.jsx` to hybrid pattern (4 bottom tabs + drawer)

**Why now:** CSS from Task 5 is in place, Help page from Task 2 is routable, so the drawer's full link list can point at real routes.

**Files:**
- Rewrite: `src/components/NavBar.jsx`

- [ ] **Step 1: Replace the whole file**

Overwrite `src/components/NavBar.jsx` with:

```jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/navbar.css'

// Mobile bottom tab bar — 4 slots + "More" that opens the drawer.
function BottomTabs({ isActive, onOpenDrawer, drawerOpen, navigate }) {
  const tabs = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/record', label: 'Record', icon: '🎥' },
    { path: '/recordings', label: 'Videos', icon: '🎬' },
  ]

  return (
    <nav className="nav">
      <div className="nav-inner">
        {tabs.map(tab => (
          <button
            key={tab.path}
            className={`nav-tab ${isActive(tab.path) ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="nav-tab-icon">{tab.icon}</span>
            <span className="nav-tab-label">{tab.label}</span>
          </button>
        ))}
        <button
          className={`nav-tab ${drawerOpen ? 'active' : ''}`}
          onClick={onOpenDrawer}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
        >
          <span className="nav-tab-icon">☰</span>
          <span className="nav-tab-label">More</span>
        </button>
      </div>
    </nav>
  )
}

// Slide-out drawer for less-frequent destinations.
function MobileDrawer({ open, onClose, user, onLogout, navigate }) {
  const links = [
    { path: '/script-generator', label: 'Scripts', icon: '✍️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/share', label: 'Share', icon: '📤' },
    { path: '/help', label: 'Help', icon: '❓' },
  ]

  const initial = (user?.email?.[0] || '?').toUpperCase()

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="drawer-header">
          <div className="drawer-avatar">{initial}</div>
          <div className="drawer-user-email">{user?.email}</div>
        </div>

        <nav className="drawer-nav">
          {links.map(link => (
            <button
              key={link.path}
              className="drawer-link"
              onClick={() => {
                navigate(link.path)
                onClose()
              }}
            >
              <span className="drawer-link-icon">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="drawer-footer">
          <button className="drawer-logout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </aside>
    </>
  )
}

// Desktop top bar — unchanged behavior, extracted for clarity.
function DesktopTopBar({ user, isActive, navigate, onLogout }) {
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/script-generator', label: 'Scripts', icon: '✍️' },
    { path: '/record', label: 'Record', icon: '🎥' },
    { path: '/recordings', label: 'Recordings', icon: '🎬' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  return (
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
          <button className="nav-logout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, loading } = useContext(AuthContext)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [drawerOpen])

  // Close drawer on Escape.
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  if (loading) return null
  if (!user) return null

  const handleLogout = async () => {
    setDrawerOpen(false)
    await logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <BottomTabs
        isActive={isActive}
        onOpenDrawer={() => setDrawerOpen(true)}
        drawerOpen={drawerOpen}
        navigate={navigate}
      />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onLogout={handleLogout}
        navigate={navigate}
      />
      <DesktopTopBar
        user={user}
        isActive={isActive}
        navigate={navigate}
        onLogout={handleLogout}
      />
    </>
  )
}
```

- [ ] **Step 2: Manual verification — mobile width**

1. Resize browser to <768px (or use DevTools device toolbar).
2. Bottom bar shows 4 slots: Home · Record · Videos · More.
3. Tap "More" → drawer slides in from the left, backdrop dims behind it.
4. Drawer shows: avatar+email header, Scripts / Profile / Share / Help links, Log Out footer.
5. Tap Scripts → navigates to `/script-generator`, drawer closes.
6. Tap "More" → drawer opens → tap backdrop → drawer closes.
7. Tap "More" → press Escape → drawer closes.
8. Active state: on `/dashboard` → "Home" tab active; on `/record` → "Record" active; on `/recordings` → "Videos" active; while drawer is open → "More" active.
9. When drawer is open, you cannot scroll the page behind it.

- [ ] **Step 3: Manual verification — desktop width**

1. Resize to ≥768px.
2. Bottom tab bar + drawer + backdrop are all hidden (CSS `display: none`).
3. Top bar unchanged from before: logo, nav links, email, Log Out.
4. Click each nav link → active state updates correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavBar.jsx
git commit -m "feat: hybrid mobile nav with 4-tab bar + slide-out drawer"
```

---

## Task 7: Extract `saveTakeToSupabase` helper from `downloadTake`

**Why as a distinct task:** it's a pure refactor — same behavior, different shape. Smaller diff to review. Task 8 will then wire this into `recorder.onstop`.

**Files:**
- Modify: `src/components/MultiTakeVideoRecorder.jsx`

- [ ] **Step 1: Add the new helper**

Open `src/components/MultiTakeVideoRecorder.jsx`. After the `generateThumbnail` helper you added in Task 1 (and before `const stopRecording = () => {`), add:

```javascript
  const saveTakeToSupabase = async (take) => {
    if (!user) {
      throw new Error('User not logged in');
    }

    // Convert blob URL to actual blob
    const response = await fetch(take.url);
    const blob = await response.blob();

    // Generate unique video ID
    const videoId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const storagePath = `${user.id}/${videoId}.webm`;

    // Upload video
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(storagePath, blob);

    if (uploadError) {
      throw new Error(`Video upload failed: ${uploadError.message}`);
    }

    // Generate + upload thumbnail (non-fatal — log and continue on failure)
    let thumbnailUrl = null;
    try {
      const thumbBlob = await generateThumbnail(take.url);
      const thumbPath = `${user.id}/${videoId}.jpg`;
      const { error: thumbUploadError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbPath, thumbBlob);

      if (thumbUploadError) {
        console.error('Thumbnail upload error:', thumbUploadError);
      } else {
        const { data: thumbUrlData } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(thumbPath);
        thumbnailUrl = thumbUrlData?.publicUrl || null;
      }
    } catch (thumbErr) {
      console.error('Thumbnail generation error:', thumbErr);
    }

    // Insert DB row
    const { data: dbData, error: dbError } = await supabase
      .from('user_vids')
      .insert({
        user_id: user.id,
        script_id: scriptData?.id || null,
        storage_path: storagePath,
        thumbnail_url: thumbnailUrl,
        duration_secs: Math.round(take.duration || 0),
        final_size_bytes: blob.size,
        status: 'draft',
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    return { dbId: dbData.id, thumbnailUrl, storagePath };
  };

```

- [ ] **Step 2: Shrink `downloadTake` to pure file-download**

Replace the entire existing `downloadTake` function (currently lines 218–311 — from `const downloadTake = async (take) => {` through its closing `};`) with:

```javascript
  const downloadTake = (take) => {
    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    const filename = `PresentationCoach_${userName}_${String(downloadCounter).padStart(3, '0')}.webm`;

    const a = document.createElement('a');
    a.href = take.url;
    a.download = filename;
    a.click();

    const newCounter = downloadCounter + 1;
    setDownloadCounter(newCounter);
    localStorage.setItem('presentationCoachCounter', newCounter.toString());
  };
```

Note: `downloadTake` is no longer `async` and no longer calls Supabase or `alert()`.

- [ ] **Step 3: Manual verification**

1. Run `npm run lint`; exit code 0, no new errors.
2. In the browser, navigate to `/record`. Enable camera, record a 3-second take, stop.
3. Click Download.
4. Expected: the file downloads locally (same as before). No `alert('Video saved...')` appears. **No** new Supabase row is created by Download alone — because `downloadTake` no longer calls `saveTakeToSupabase`. (The auto-save path gets added in Task 8.)
5. Check `user_vids` in Supabase to confirm no new rows from this step.
6. Check DevTools console — no errors.

(This is a transient intermediate state: between Task 7 and Task 8, takes are not persisted. Task 8 completes the feature.)

- [ ] **Step 4: Commit**

```bash
git add src/components/MultiTakeVideoRecorder.jsx
git commit -m "refactor: extract saveTakeToSupabase helper from downloadTake"
```

---

## Task 8: Auto-save on recorder stop + add `saveStatus`/`dbId`/`saveError` fields

**Why now:** Task 7 gave us the helper; this wires it to the recorder lifecycle and tracks per-take save state. UI for that state comes in Task 9.

**Files:**
- Modify: `src/components/MultiTakeVideoRecorder.jsx`

- [ ] **Step 1: Update `recorder.onstop` to create take with status + fire auto-save**

Find the current `recorder.onstop` block (currently starting at line 148). Replace the entire block through its closing `};` (currently line 171) with:

```javascript
    recorder.onstop = () => {
      console.log('⏹ Stopped. Chunks:', chunksRef.current.length);

      setTimeout(() => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        console.log('🎥 Blob size:', blob.size);
        const url = URL.createObjectURL(blob);

        const duration = recordingStartTimeRef.current
          ? Math.round((Date.now() - recordingStartTimeRef.current) / 1000)
          : 0;

        const takeId = Date.now();
        const newTake = {
          id: takeId,
          url,
          blob,
          timestamp: new Date().toLocaleString(),
          duration,
          saveStatus: 'pending',
          dbId: null,
          saveError: null,
        };

        setTakes(prev => [...prev, newTake]);

        // Fire-and-forget upload — UI stays responsive, next take can start immediately.
        saveTakeToSupabase(newTake)
          .then(({ dbId }) => {
            setTakes(prev => prev.map(t =>
              t.id === takeId
                ? { ...t, saveStatus: 'saved', dbId, saveError: null }
                : t
            ));
          })
          .catch(err => {
            console.error('Auto-save failed:', err);
            setTakes(prev => prev.map(t =>
              t.id === takeId
                ? { ...t, saveStatus: 'failed', saveError: err.message }
                : t
            ));
          });

        setShowTeleprompter(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }, 100);
    };
```

- [ ] **Step 2: Add a retry handler**

Inside the component (a good location is right above `const recordAnother = () => {`), add:

```javascript
  const retrySaveTake = (take) => {
    setTakes(prev => prev.map(t =>
      t.id === take.id
        ? { ...t, saveStatus: 'pending', saveError: null }
        : t
    ));
    saveTakeToSupabase(take)
      .then(({ dbId }) => {
        setTakes(prev => prev.map(t =>
          t.id === take.id
            ? { ...t, saveStatus: 'saved', dbId, saveError: null }
            : t
        ));
      })
      .catch(err => {
        console.error('Retry save failed:', err);
        setTakes(prev => prev.map(t =>
          t.id === take.id
            ? { ...t, saveStatus: 'failed', saveError: err.message }
            : t
        ));
      });
  };

```

- [ ] **Step 3: Add a delete handler**

Immediately after `retrySaveTake`, add:

```javascript
  const deleteTake = async (take) => {
    if (!window.confirm('Delete this take? This cannot be undone.')) return;

    if (take.saveStatus === 'saved' && take.dbId) {
      try {
        // Look up the storage path from the DB row (stored at insert time)
        const { data: row, error: fetchErr } = await supabase
          .from('user_vids')
          .select('storage_path, thumbnail_url')
          .eq('id', take.dbId)
          .single();

        if (!fetchErr && row?.storage_path) {
          await supabase.storage.from('videos').remove([row.storage_path]);
        }
        if (!fetchErr && row?.thumbnail_url) {
          // thumbnail_url is a public URL — derive the path by taking the last two segments
          const match = row.thumbnail_url.match(/thumbnails\/(.+)$/);
          if (match && match[1]) {
            await supabase.storage.from('thumbnails').remove([match[1]]);
          }
        }

        const { error: delErr } = await supabase
          .from('user_vids')
          .delete()
          .eq('id', take.dbId);
        if (delErr) {
          console.error('DB delete failed:', delErr);
          alert('Could not delete from your account. Please try again.');
          return;
        }
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Could not delete from your account. Please try again.');
        return;
      }
    }

    // Remove from local state + revoke blob URL
    URL.revokeObjectURL(take.url);
    setTakes(prev => {
      const next = prev.filter(t => t.id !== take.id);
      if (selectedTake?.id === take.id) {
        setSelectedTake(next[next.length - 1] || null);
      }
      return next;
    });
  };

```

- [ ] **Step 4: Manual verification**

1. In DevTools, open the Network tab, filter by "supabase".
2. Visit `/record`, enable camera, record a 3-second take, stop.
3. In the console, watch for two requests: POST to `storage/v1/object/videos/...` and POST to `rest/v1/user_vids`.
4. Wait ~3 seconds. In Supabase Studio → `user_vids` table, a new row should appear with `status: 'draft'`, non-null `storage_path`, non-null `thumbnail_url`.
5. Record a **second** take back-to-back without waiting. Both rows should appear in `user_vids`, both with thumbnails. Dashboard's Recordings card should show both with thumbnail images.
6. Take 3 — temporarily break uploading by opening DevTools → Network tab → Offline. Record a take and stop. The take should still appear locally in the review panel (the state update still happens), but the upload throws. Check console for `Auto-save failed:`. No DB row is created. Re-enable network.
7. No `alert()` popups at any point in the flow.

- [ ] **Step 5: Commit**

```bash
git add src/components/MultiTakeVideoRecorder.jsx
git commit -m "feat: auto-save each take on recorder stop with per-take status"
```

---

## Task 9: Update the review panel UI — thumbnails, status line, delete button

**Why last:** the data is all in place from Task 8; this is pure render layer + some CSS.

**Files:**
- Modify: `src/components/MultiTakeVideoRecorder.jsx` (review panel JSX)
- Modify: `src/styles/recorder.css` (new rules for status + delete)

- [ ] **Step 1: Redesign the "All Takes" list**

In `src/components/MultiTakeVideoRecorder.jsx`, find the current `recorder-takes-list` block (currently around line 460–473, inside the `{selectedTake && (...)}` branch):

```jsx
          {takes.length > 1 && (
            <div className="recorder-takes-list">
              <h3>All Takes:</h3>
              {takes.map((take, i) => (
                <button
                  key={take.id}
                  onClick={() => selectTake(take)}
                  className={`recorder-take-btn ${selectedTake.id === take.id ? 'recorder-take-btn-active' : ''}`}
                >
                  #{i + 1} ({take.duration}s)
                </button>
              ))}
            </div>
          )}
```

Replace it with this richer list that always renders (not gated on `length > 1`) and shows thumbnail + status + delete:

```jsx
          {takes.length > 0 && (
            <div className="recorder-takes-list">
              <h3>All Takes:</h3>
              {takes.map((take, i) => {
                const isActive = selectedTake.id === take.id;
                return (
                  <div
                    key={take.id}
                    className={`recorder-take-row ${isActive ? 'recorder-take-row-active' : ''}`}
                  >
                    <button
                      className="recorder-take-main"
                      onClick={() => selectTake(take)}
                    >
                      <video
                        className="recorder-take-thumb"
                        src={take.url}
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="recorder-take-meta">
                        <div className="recorder-take-title">
                          Take #{i + 1} · {take.duration}s
                        </div>
                        {take.saveStatus === 'pending' && (
                          <div className="recorder-take-status recorder-take-status-pending">
                            ⟳ Saving…
                          </div>
                        )}
                        {take.saveStatus === 'saved' && (
                          <div className="recorder-take-status recorder-take-status-saved">
                            ✓ Saved
                          </div>
                        )}
                        {take.saveStatus === 'failed' && (
                          <button
                            type="button"
                            className="recorder-take-status recorder-take-status-failed"
                            onClick={(e) => {
                              e.stopPropagation();
                              retrySaveTake(take);
                            }}
                            title={take.saveError || 'Upload failed'}
                          >
                            ⚠ Failed — retry
                          </button>
                        )}
                      </div>
                    </button>
                    <button
                      className="recorder-take-delete"
                      onClick={() => deleteTake(take)}
                      aria-label={`Delete take ${i + 1}`}
                    >
                      🗑
                    </button>
                  </div>
                );
              })}
            </div>
          )}
```

- [ ] **Step 2: Add matching styles to `src/styles/recorder.css`**

Open `src/styles/recorder.css` and append (at the end of the file):

```css

/* ---- Take review: rich rows with status + delete ---- */
.recorder-take-row {
  display: flex;
  align-items: stretch;
  gap: var(--space-2);
  padding: var(--space-2);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
  transition: all 0.18s ease;
}
.recorder-take-row:hover {
  border-color: var(--accent);
}
.recorder-take-row-active {
  background: var(--accent-glow);
  border-color: var(--accent);
}

.recorder-take-main {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: transparent;
  border: none;
  padding: var(--space-2);
  cursor: pointer;
  text-align: left;
  font-family: var(--font-body);
  color: var(--text-primary);
}

.recorder-take-thumb {
  width: 72px;
  height: 48px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  flex-shrink: 0;
}

.recorder-take-meta {
  flex: 1;
  min-width: 0;
}

.recorder-take-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.recorder-take-status {
  font-size: 12px;
  font-family: var(--font-body);
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: default;
}
.recorder-take-status-pending {
  color: var(--accent);
}
.recorder-take-status-saved {
  color: var(--success);
}
.recorder-take-status-failed {
  color: var(--error);
  cursor: pointer;
  text-decoration: underline;
}
.recorder-take-status-failed:hover {
  color: var(--error);
  opacity: 0.8;
}

.recorder-take-delete {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  font-size: 16px;
  padding: 0 var(--space-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.18s ease;
  align-self: center;
}
.recorder-take-delete:hover {
  color: var(--error);
  border-color: rgba(248, 113, 113, 0.25);
  background: rgba(248, 113, 113, 0.08);
}
```

- [ ] **Step 3: Manual verification — happy path**

1. Visit `/record`, enable camera, record 3 takes back-to-back (don't click Download).
2. Click "Review Takes".
3. Expected: three rows render, each with a small video thumbnail (the local blob as preview), title "Take #1 · Ns", and a status line.
4. First take shows `⟳ Saving…` briefly → then `✓ Saved` (amber → green).
5. Same for takes 2 and 3 (they may overlap — that's fine, uploads are async).
6. In Supabase → `user_vids`: 3 new rows, all with `thumbnail_url` populated.
7. Dashboard "My Recordings" card and `/recordings` both show the three new videos with real thumbnails.

- [ ] **Step 4: Manual verification — failure + retry**

1. Enable DevTools Offline mode.
2. Record a new take, click Review Takes.
3. Expected: new row shows `⚠ Failed — retry` in red (clickable, underlined).
4. Disable offline mode.
5. Click `⚠ Failed — retry`. Status flips to `⟳ Saving…` then `✓ Saved`. New row in `user_vids`.

- [ ] **Step 5: Manual verification — delete**

1. With at least 2 saved takes visible, click the 🗑 on a saved take.
2. Confirm the browser `confirm()` dialog → OK.
3. Expected: row disappears from the review panel.
4. Check `user_vids` in Supabase — the corresponding row is gone.
5. Check the `videos` bucket — the .webm is gone.
6. Record a 4th take. While it's still `⟳ Saving…`, click its 🗑. Confirm → expected: row disappears locally. No DB row was created for that take (may depend on timing — check `user_vids` to confirm no orphan row). If the upload was already in flight, it may complete as an orphan; accepted per spec.
7. Cancel a delete (click 🗑 → Cancel in the dialog). Row stays put.

- [ ] **Step 6: Commit**

```bash
git add src/components/MultiTakeVideoRecorder.jsx src/styles/recorder.css
git commit -m "feat: take review panel with thumbnails, save status, delete"
```

---

## Final verification (run once, after all 9 tasks)

This mirrors the spec's manual verification checklist in full. Run top to bottom.

**NavBar**
- [ ] Resize browser to <768px → bottom tab bar renders with 4 slots (Home · Record · Videos · More)
- [ ] Tap "More" → drawer slides in from the left with backdrop dim
- [ ] Tap each drawer item → navigates + closes drawer
- [ ] Tap backdrop → drawer closes
- [ ] Press Escape → drawer closes
- [ ] Resize to ≥768px → bottom bar + drawer both hidden, top bar visible and unchanged
- [ ] Active state shows on the correct tab for every route

**Recorder auto-save**
- [ ] Record 3 takes back-to-back without clicking Download; each shows `⟳ Saving…` then `✓ Saved`
- [ ] `user_vids` in Supabase has 3 new rows with `thumbnail_url` populated
- [ ] `videos` + `thumbnails` buckets each gained 3 new files
- [ ] Dashboard "My Recordings" card and `/recordings` page both show real thumbnails (no 🎥 placeholder)

**Recorder delete**
- [ ] Delete a saved take → row disappears locally + DB row + storage files gone
- [ ] Delete a pending take → row disappears locally, no (new) Supabase calls on cancel
- [ ] Confirm dialog blocks accidental deletes

**Thumbnail fix**
- [ ] Fresh take → `thumbnails` bucket gains a new `.jpg`
- [ ] Dashboard recording item shows the generated image, not the 🎥 placeholder

**Share + Recordings restyle**
- [ ] `/share` — amber accents, display font heading, spacing matches Dashboard
- [ ] `/recordings` — same visual consistency
- [ ] Both pages look correct on mobile width (no overflow, content clears bottom tab bar)

**Help**
- [ ] Open drawer → tap Help → `/help` page renders with placeholder content
- [ ] Both back buttons work

**Before shipping — flagged TODOs**
- [ ] Replace `supportEmail` placeholder in `src/pages/Help.jsx` with the real support address (asks AJ)
- [ ] Push rescue commit `e86ff98` (already done before this plan started, but double-check with `git log origin/main` to confirm)

---

## Appendix: files touched

**Modified**
- `src/App.jsx` — add `/help` route (Task 2)
- `src/components/NavBar.jsx` — rewrite for hybrid pattern (Task 6)
- `src/components/MultiTakeVideoRecorder.jsx` — thumbnail helper (1), saveTakeToSupabase (7), onstop auto-save + retry + delete (8), review panel UI (9)
- `src/styles/navbar.css` — drawer styles (Task 5)
- `src/styles/recorder.css` — take row status + delete styles (Task 9)
- `src/styles/share.css` — theme variable port (Task 3)
- `src/styles/recordings.css` — theme variable port (Task 4)

**Added**
- `src/pages/Help.jsx` (Task 2)
- `src/styles/help.css` (Task 2)

**Not touched**
- `src/pages/Dashboard.jsx`, `src/pages/Record.jsx`, `src/pages/Profile.jsx`, `src/pages/ScriptGenerator.jsx`, `src/pages/Landing.jsx`, `src/pages/Auth.jsx`, `src/pages/Share.jsx` (JSX), `src/pages/Recordings.jsx` (JSX)
- `src/components/Teleprompter.jsx`, `src/components/Onboarding.jsx`, `src/components/Toast.jsx`, `src/components/ProtectedRoute.jsx`
- `src/context/AuthContext.jsx`, `src/lib/supabase.js`
- Anything under `api/`, `public/`, or the root config files
