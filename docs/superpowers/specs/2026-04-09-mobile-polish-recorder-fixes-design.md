# Mobile polish + recorder fixes — design spec

**Date:** 2026-04-09
**Status:** Design approved, ready for implementation planning
**Author:** AJ + Claude (brainstorming session)

---

## Context

The project is approaching completion and needs final polish. Two user-facing problems motivated this session:

1. **The app feels cramped on mobile.** The current bottom-tab navigation (Home / Scripts / Record / Profile) eats vertical space and doesn't scale to the number of destinations the app now has.
2. **Recordings aren't reliably saved.** Users who don't click "Download" on a take lose it, and recent recordings are missing thumbnails.

During investigation we also discovered:

3. **The local `main` branch was 4 commits behind `origin/main`.** The missing commits included the existing `Share.jsx` and `Recordings.jsx` pages built by a teammate. Pulling those in was a prerequisite for the rest of this work.
4. **The merge with `origin/main` clobbered the editorial-themed recorder** with an older inline-styles version that had also dropped the Supabase upload flow. This was reverted locally by restoring the recorder from commit `211acb8` (rescue commit `e86ff98`, not yet pushed).
5. **The Dashboard "Share" quick-action bug** (navigated to `/record` instead of a share screen) was automatically resolved by the merge — `origin/main` already points it at `/share`. No extra work needed.

## Scope

### In scope
1. **Mobile NavBar refactor** — hybrid pattern: 4-slot bottom tab bar + slide-out drawer.
2. **Recorder: auto-save every take on stop** — extract the Supabase upload out of `downloadTake()` and run it automatically from the `recorder.onstop` callback.
3. **Recorder: thumbnail bug fix** — restore the missing `generateThumbnail` helper.
4. **Recorder: per-take save status + delete** — visible save state and an inline delete affordance.
5. **Restyle `Share.jsx` and `Recordings.jsx`** — port their CSS from hardcoded dark colors to editorial theme variables.
6. **Help placeholder page** — a minimal "Coming soon + contact info" stub so the drawer's "Help" slot is functional.

### Explicitly out of scope
- Any new share-flow UX or logic. The existing `Share.jsx` is treated as done modulo restyling.
- Server-side / Supabase schema changes — all work is client-only. The `user_vids` and `thumbnails` buckets and columns are assumed to exist and remain unchanged.
- Automated tests. The project has none today; verification is manual per the walkthrough below.
- Offline-first recovery (persisting un-uploaded takes to IndexedDB). Acknowledged risk, not addressed.
- Analytics or telemetry.
- Any design work on the future full Help page. Only a placeholder ships.

### Parked / follow-up
- **Push the rescue commit `e86ff98`** to `origin/main` (manual — not part of the implementation plan, but must happen before teammates pull).

---

## Design decisions (locked in during brainstorming)

| # | Decision | Choice |
|---|---|---|
| 1 | Mobile nav pattern | **Hybrid**: bottom tab bar + slide-out drawer (vs. full-drawer-only, vs. top-hamburger-only) |
| 2 | Tab split | **Home · Record · Videos · ☰ More** (vs. Home/Scripts/Record/More, vs. 5-slot tab bar) |
| 3 | Drawer contents | Scripts · Profile · Share · Help · Log Out |
| 4 | Take save trigger | **Auto-save on recorder stop** (vs. save on navigate-away, vs. save on Download only) |
| 5 | Take save indicator | **Labeled status + inline delete icon** per take row (vs. inline check, vs. toast) |
| 6 | Help drawer slot | **Placeholder page with "Coming soon"** (vs. omit, vs. disabled slot) |
| 7 | Share / Recordings restyle | **In scope this session** |

**Recommendation rationales** are captured in the conversation log; key ones:
- Tab split (B) favors the record → review → share loop, which is the app's real workflow. Scripts is still reachable via the Home action card.
- Take status (C) makes the delete affordance explicit, handles the failure case, and beats a disappearing toast for reliability feedback.
- Hybrid nav (C) gives fast access to frequent destinations while keeping the drawer as a logical home for less-frequent items.

---

## Component-level design

### 1. NavBar refactor

**Files touched**
- `src/components/NavBar.jsx` (rewrite)
- `src/styles/navbar.css` (extend)
- `src/App.jsx` (add `/help` route)

**Structure.** `NavBar` remains the single source of nav truth. Internally split into three sub-pieces in the same file (no new files):

- **`<BottomTabs />`** — mobile-only. 4 slots: Home · Record · Videos · More. The "More" slot is a plain button, not a navigation link — its click handler toggles the drawer. Active-tab styling uses the existing `.nav-tab.active` class.
- **`<MobileDrawer open onClose />`** — slide-in panel from the left, full viewport height. Contains:
  - Header block: user avatar (first-initial circle) + email
  - Nav list: Scripts / Recordings / Profile / Share / Help — each uses `useNavigate()` and calls `onClose()` on click
  - Footer block: Log Out button pinned to the bottom
  - Backdrop: dimmed overlay behind the drawer; tapping it calls `onClose()`
  - Slide animation: `transform: translateX(-100%)` → `translateX(0)` with a CSS `transition`; backdrop fades via opacity
- **`<DesktopTopBar />`** — today's desktop nav, extracted into a named sub-component for clarity. No behavioral change. No drawer on desktop.

**State.** `const [drawerOpen, setDrawerOpen] = useState(false)` lives in `NavBar`. A `useEffect([location.pathname])` closes the drawer on any route change so that navigating also dismisses. Drawer state does not need to be lifted to context — no other component cares.

**Active tab mapping.**
- Home: `/dashboard`
- Record: `/record`
- Videos: `/recordings` (and should remain active while a recording is selected on that page)
- More: active when `drawerOpen === true`

**Body scroll.** When the drawer is open, `document.body.style.overflow = 'hidden'` prevents background scroll; restored on close.

**Accessibility.**
- Drawer has `role="dialog"` and `aria-modal="true"`
- Hamburger button has `aria-label="Open menu"` and `aria-expanded={drawerOpen}`
- Backdrop is `aria-hidden`
- Drawer closes on `Escape` keydown

**CSS additions (in `navbar.css`, mobile block only).**
- `.drawer` — fixed full-height left-aligned panel, `z-index: 200`
- `.drawer-backdrop` — fixed full-viewport dim overlay, `z-index: 150`
- `.drawer-header`, `.drawer-nav`, `.drawer-link`, `.drawer-footer` — themed using `var(--bg-primary)`, `var(--border)`, `var(--accent)`, `var(--font-body)`, spacing tokens
- Slide animation via `transform` + `transition` (GPU-friendly, no layout thrash)
- Hidden entirely on `min-width: 768px`

### 2. Recorder: auto-save, thumbnail fix, delete

**Files touched**
- `src/components/MultiTakeVideoRecorder.jsx`
- `src/styles/recorder.css` (add status line + delete button styles)

**Key idea.** The current recorder does all its Supabase work inside `downloadTake()`. This design extracts that into a pure helper and wires it to the recorder lifecycle instead of the download button.

**New helpers (added to the same file):**

```
generateThumbnail(videoUrl): Promise<Blob>
```
Restored verbatim from commit `08b0a7f`. 28 lines; creates an offscreen `<video>`, seeks to 0.1s, draws onto a 320x240 canvas, returns a JPEG blob via `canvas.toBlob()`. Rejects on video load error.

```
saveTakeToSupabase(take): Promise<{ dbId: string, thumbnailUrl: string | null }>
```
Takes a local `take` object, does everything the current `downloadTake` does after the file-download step: converts blob URL → blob, generates a unique `videoId`, uploads to `videos` bucket at `${user.id}/${videoId}.webm`, generates + uploads thumbnail to `thumbnails` bucket, inserts a row into `user_vids` with `status: 'draft'`. Returns the DB row id. Throws on any failure — caller handles it.

```
deleteTake(take): Promise<void>
```
If `take.saveStatus === 'saved'`: delete the Storage objects (`videos/${path}` + `thumbnails/${path}`), delete the `user_vids` row by `id`, then remove from local `takes` state.
If `take.saveStatus === 'pending' | 'failed'`: just remove from local state and `URL.revokeObjectURL(take.url)`. No Supabase calls.
Opens a `window.confirm()` before either branch (same pattern as Dashboard's existing delete).

**Take data-shape additions.** Each take in local state gains three fields (defaults on creation):

```
saveStatus: 'pending' | 'saved' | 'failed'
dbId: string | null
saveError: string | null
```

**`recorder.onstop` changes.** After the take is pushed into local state (current line ~160), fire-and-forget call `saveTakeToSupabase(newTake)` inside a status-tracking wrapper:

1. Take is created with `saveStatus: 'pending'`.
2. On success: update that take in state (match by `id`) → `saveStatus: 'saved'`, `dbId: <returned>`.
3. On failure: update that take → `saveStatus: 'failed'`, `saveError: err.message`.

The async work does **not** block the UI or the next recording. The user can immediately start another take while the previous one uploads.

**`downloadTake()` becomes pure.** Only does the file download + counter bump + `localStorage` update. No Supabase calls. Removes the existing `alert('Video saved to your account!')`.

**Review-panel UI.** Each take row in the "All Takes" list renders:

```
[thumbnail]  Take #N · {duration}s
             ✓ Saved                    🗑
```

- Thumbnail: the same 320x240 canvas image used for the saved thumbnail, rendered from the local blob URL for instant display (doesn't wait for upload).
- Title: `Take #N · {duration}s` (matches current behavior).
- Status line: color-coded small text below the title:
  - `pending` → amber `⟳ Saving…`
  - `saved` → green `✓ Saved`
  - `failed` → red `⚠ Failed — retry` (clickable; click re-invokes `saveTakeToSupabase` for that take)
- Delete icon: 🗑 button on the right. Calls `deleteTake(take)`.

The "Mark Final" control stays on the Dashboard/Recordings page, not in the in-session review panel (it operates on persisted rows).

**Failure handling & acknowledged gaps.**
- A retry click re-runs `saveTakeToSupabase` from scratch, generating a new `videoId`. Idempotency is not enforced at the Supabase layer — a successful retry after a partial earlier upload could leave orphaned storage files. Accepted for now.
- If the tab closes or refreshes while a take is `pending` or `failed`, the blob is lost. This is called out as a known risk.
- Upload errors are surfaced via the inline status line, not a toast or alert.

### 3. Share + Recordings restyle

**Files touched**
- `src/styles/share.css` (rewrite body)
- `src/styles/recordings.css` (rewrite body)
- Possibly minor className tweaks in `src/pages/Share.jsx` and `src/pages/Recordings.jsx` if a class name needs clarifying — otherwise no JSX changes.

**Mechanical port.** No visual redesign, just align with the editorial theme:

- Replace hardcoded colors (`#0f0f0f`, `rgba(255,255,255,*)`, hex amber values) with theme variables (`var(--bg-primary)`, `var(--bg-surface)`, `var(--bg-elevated)`, `var(--accent)`, `var(--accent-hover)`, `var(--accent-glow)`, `var(--border)`, `var(--text-primary)`, `var(--text-muted)`, `var(--error)`)
- Replace raw font stacks with `var(--font-body)` for body text, `var(--font-display)` for titles
- Replace raw `rem`/`px` spacing with `var(--space-*)` tokens to match Dashboard's rhythm
- Replace raw border-radius with `var(--radius-*)` tokens
- Add `padding-bottom: 100px` to the page wrapper so content clears the new mobile bottom tab bar
- Add the same mobile breakpoint (`@media (max-width: 767px)`) pattern used by `dashboard.css` — stack columns, compress paddings, resize headings

**Success criterion.** Side-by-side comparison with Dashboard and Profile should show consistent amber accent, display font headings, spacing scale, card surfaces, and mobile layouts.

### 4. Help placeholder page

**New files**
- `src/pages/Help.jsx`
- `src/styles/help.css`

**Component.** A single editorial-themed card wrapper containing:

- Small uppercase label: "Support"
- `<h1>` display-font title: "Help & Troubleshooting"
- Subtitle: "We're still building this out — here's how to get in touch in the meantime."
- Contact block: email link (placeholder address `support@presentationcoach.example` or whatever address AJ provides — leave as a `TODO` comment in the spec if unclear at implementation time)
- A "Back to Dashboard" secondary button at the bottom

**Routing.** Add `<Route path="/help">` under `ProtectedRoute` in `App.jsx`. Add `Help` to the drawer's nav list in `NavBar.jsx`.

**Styling.** New `help.css` using theme variables. Mobile media query follows the same pattern as Profile and Dashboard.

---

## Implementation ordering

Roughly, the cleanest order is:

1. **NavBar refactor** — self-contained, touches its own files. Verifiable in isolation on mobile width.
2. **Help placeholder page** — depends only on routing. Can be slotted in as soon as the drawer needs a working "Help" destination.
3. **Recorder: restore `generateThumbnail` helper** — standalone bug fix, doesn't depend on the refactor. Verifiable immediately by recording a take and checking the `thumbnails` bucket.
4. **Recorder: auto-save + status + delete** — the larger refactor. Depends on the helper function being in place.
5. **Share + Recordings restyle** — pure CSS, touches no JS. Can happen in parallel with anything else.

A writing-plans session will expand this into a TDD-style step-by-step plan.

---

## Manual verification checklist

For each chunk, the walkthrough to run before calling it done:

**NavBar**
- [ ] Resize browser to < 768px width; confirm bottom tab bar renders with 4 slots
- [ ] Tap "More"; drawer slides in from the left with backdrop dim
- [ ] Tap each drawer item; navigates + closes drawer
- [ ] Tap backdrop; drawer closes
- [ ] Press Escape; drawer closes
- [ ] Resize to ≥ 768px; bottom bar + drawer both hidden, top bar visible and unchanged
- [ ] Active state shows on the correct tab for every route

**Recorder auto-save**
- [ ] Record 3 takes back-to-back without clicking Download; each one shows `⟳ Saving…` then `✓ Saved` in the review panel
- [ ] Check `user_vids` in Supabase — 3 new rows with `thumbnail_url` populated
- [ ] Check `videos` and `thumbnails` buckets — 3 webm files + 3 jpg files
- [ ] Dashboard's "My Recordings" card and the new `/recordings` page both show thumbnails (no placeholder icon)

**Recorder delete**
- [ ] Delete a saved take → row disappears from the review panel, corresponding Supabase row and storage files are gone
- [ ] Delete a pending take → row disappears locally, no Supabase calls made
- [ ] Confirm modal blocks accidental deletes

**Thumbnail fix**
- [ ] Record one fresh take; the `thumbnails` bucket gains a new `.jpg`
- [ ] Dashboard recording item shows the generated image, not the 🎥 placeholder

**Share + Recordings restyle**
- [ ] Visit `/share` — amber accents, display font heading, spacing matches Dashboard
- [ ] Visit `/recordings` — same visual consistency
- [ ] Both pages look correct on mobile width (no overflow, content clears bottom tab bar)

**Help**
- [ ] Open drawer → tap Help → `/help` page renders with the placeholder content
- [ ] "Back to Dashboard" button works

---

## Risks and open questions

- **Failed-upload loss on refresh.** A take with `saveStatus: 'pending'` or `'failed'` lives only as an in-memory blob URL. If the tab closes, the blob is gone. Not addressed this session — would require IndexedDB persistence.
- **Retry idempotency.** A retry of a partially-failed upload generates a new `videoId`, so orphaned storage files are possible if an earlier attempt wrote one bucket but not the other. Accepted.
- **Help contact email address.** The placeholder page needs a real contact address. Unknown at spec-writing time — implementation should flag this with a `TODO` and ask before shipping.
- **Rescue commit `e86ff98` is unpushed.** All work in this design builds on top of it. If someone else pulls from origin and pushes more changes, a future reconciliation will be needed. Recommend pushing `e86ff98` before starting implementation.
- **No automated tests.** All verification is manual. Any regression risk is carried by the reviewer.

---

## Appendix: files touched

### Modified
- `src/App.jsx` — add `/help` route
- `src/components/NavBar.jsx` — rewrite for hybrid pattern
- `src/components/MultiTakeVideoRecorder.jsx` — auto-save, helpers, status tracking, delete
- `src/styles/navbar.css` — drawer styles
- `src/styles/recorder.css` — status line + delete button styles
- `src/styles/share.css` — theme variable port
- `src/styles/recordings.css` — theme variable port
- (optional) `src/pages/Share.jsx`, `src/pages/Recordings.jsx` — className tweaks only if needed

### Added
- `src/pages/Help.jsx`
- `src/styles/help.css`

### Not touched
- `src/pages/Dashboard.jsx` (already correct post-merge)
- `src/pages/Record.jsx`
- `src/pages/Profile.jsx`
- `src/pages/ScriptGenerator.jsx`
- `src/pages/Landing.jsx`
- `src/pages/Auth.jsx`
- `src/components/Teleprompter.jsx`
- `src/components/Onboarding.jsx`
- `src/components/Toast.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/context/AuthContext.jsx`
- `src/lib/supabase.js`
- Anything in `api/`, `public/`, or the root config files
