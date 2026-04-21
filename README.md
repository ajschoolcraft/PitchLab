# AI Presentation Coach

> An AI-powered web app that helps entrepreneurs, small business owners, and job seekers craft compelling pitch scripts and practice delivering them on camera.

Built as a senior capstone project at **Loyola Marymount University** (ISBA 2026) by A.J. Schoolcraft, Joaquin Crespo, and Emma Sprankle.

---

## What It Does

Most small business owners know their product inside and out — but freeze when they try to explain it on camera. AI Presentation Coach solves this by combining **AI script generation** with a **multi-take recording studio**, so users go from "I don't know what to say" to a polished video in minutes.

### Core Features

| Feature | Description |
|---------|-------------|
| **AI Script Generator** | A guided 11-question flow feeds the user's authentic story to Claude AI, which produces a ready-to-read 30-second pitch script. |
| **Multi-Take Video Recorder** | Record as many takes as you need with a 60-second timer. Auto-uploads to the cloud with thumbnails. Review, compare, and keep your best. |
| **Built-In Teleprompter** | Full-screen script display with adjustable speed, font size, mirror mode, and keyboard controls. Records alongside the camera view. |
| **Video Library** | Browse all saved recordings with thumbnails, playback, download, and "mark as final" status. |
| **Social Sharing Guides** | Platform-specific step-by-step instructions for posting to Instagram, TikTok, YouTube, and Facebook. |
| **Responsive Design** | Mobile-first UI that works equally well on phones and laptops. Bottom tab bar on mobile, top nav on desktop. |
| **Authentication** | Email/password and Google OAuth via Supabase Auth. Row-level security ensures complete data isolation between users. |

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | React 19, React Router 7, Vite 7 | Component-based UI with fast HMR and modern tooling |
| **AI** | Anthropic Claude API (Sonnet) | Natural, coach-like tone that encourages users |
| **Database** | Supabase (PostgreSQL) | Relational data with RLS policies for security |
| **Auth** | Supabase Auth | Email + Google OAuth, session management |
| **Storage** | Supabase Storage | Video and thumbnail file storage with per-user isolation |
| **Serverless** | Vercel Functions | API endpoint for Claude without exposing keys client-side |
| **Deployment** | Vercel | Automatic deploys on push, SPA routing via `vercel.json` |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (React SPA)                       │
│                                                                  │
│  Landing ─► Auth ─► Dashboard ─► Script Generator               │
│                         │              │                         │
│                         ▼              ▼                         │
│                    Recordings     Record Page                    │
│                         │         ┌────┴────┐                   │
│                         │    Teleprompter  VideoRecorder         │
│                         │                    │                   │
│                         ▼                    ▼                   │
│                    Video Playback    Auto-Upload to Storage      │
└──────────────────────────┬───────────────────┬──────────────────┘
                           │                   │
                    ┌──────▼──────┐    ┌───────▼──────┐
                    │  Supabase   │    │   Vercel     │
                    │  - Postgres │    │   Functions  │
                    │  - Auth     │    │   /api/...   │
                    │  - Storage  │    └───────┬──────┘
                    └─────────────┘            │
                                       ┌──────▼──────┐
                                       │ Claude API  │
                                       │ (Anthropic) │
                                       └─────────────┘
```

---

## Project Structure

```
src/
├── pages/
│   ├── Landing.jsx              # Public marketing page
│   ├── Auth.jsx                 # Sign up / sign in (email + Google OAuth)
│   ├── Dashboard.jsx            # Home — stats, scripts, recordings, quick actions
│   ├── ScriptGenerator.jsx      # Guided questionnaire → AI script generation
│   ├── Record.jsx               # Video recording interface + teleprompter
│   ├── Recordings.jsx           # Video library — playback, download, manage
│   ├── Profile.jsx              # Account settings and user stats
│   ├── Share.jsx                # Platform-specific upload guides
│   ├── Help.jsx                 # Troubleshooting, tips, and FAQs
│   └── NotFound.jsx             # 404 page
├── components/
│   ├── MultiTakeVideoRecorder.jsx  # Camera capture, recording, upload logic
│   ├── Teleprompter.jsx            # Full-screen scrolling script display
│   ├── NavBar.jsx                  # Responsive nav (mobile tabs + desktop bar)
│   ├── ProtectedRoute.jsx          # Auth-required route wrapper
│   ├── Onboarding.jsx              # First-time user walkthrough
│   └── Toast.jsx                   # Toast notification system
├── context/
│   └── AuthContext.jsx          # Global auth state provider
├── lib/
│   └── supabase.js              # Supabase client initialization
├── styles/                      # Modular CSS (one file per component/page)
├── App.jsx                      # Route definitions
└── main.jsx                     # Application entry point

api/
└── generate-script.js           # Vercel serverless function (Claude API)
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- A [Supabase](https://supabase.com) project (free tier works)
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
git clone https://github.com/ajschoolcraft/AI-Presentation-Coach.git
cd AI-Presentation-Coach
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For the serverless function, set this in your Vercel project settings:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> **Security:** API keys are never committed to the repository. The Anthropic key lives server-side only.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build     # Optimized production build
npm run preview   # Preview the build locally
```

---

## Supabase Setup

The app requires the following in your Supabase project:

### Tables

| Table | Purpose |
|-------|---------|
| `scripts` | Stores generated scripts with user answers and metadata |
| `user_vids` | Recording metadata (storage path, duration, thumbnail URL, status) |
| `questions` | Configurable questionnaire questions (fetched at runtime) |

### Storage Buckets

| Bucket | Purpose |
|--------|---------|
| `videos` | Raw .webm recording files |
| `thumbnails` | Auto-generated JPEG thumbnails |

### Security

All tables and buckets are protected by **Row Level Security (RLS)** policies:
- Users can only SELECT, INSERT, UPDATE, and DELETE their own rows
- Storage policies enforce per-user path isolation (`{user_id}/...`)

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Mobile-first design** | Target users (entrepreneurs) record on their phones. Desktop support scales up naturally via responsive CSS. |
| **Claude API over GPT-4** | Claude's output reads like a supportive coach — tone matters for a confidence-building app. |
| **Supabase over Firebase** | Real Postgres with SQL, built-in RLS, and a free tier that keeps the app live without cost. |
| **Guided questionnaire over open prompt** | Users who freeze on camera also freeze on blank text boxes. Specific questions break the wall. |
| **Multi-take workflow** | Nobody gets it right on the first try. Normalizing multiple takes reduces pressure and improves outcomes. |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (output in `dist/`) |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

Deployed on [Vercel](https://vercel.com):

- Frontend builds from `vite build` and serves as a static SPA
- `/api/generate-script.js` deploys as a serverless function automatically
- SPA routing is handled via `vercel.json` rewrites
- Automatic deploys trigger on every push to `main`

---

## Built With

- **Methodology:** Agile Scrum with weekly sprints
- **Development Tool:** [Claude Code](https://claude.ai/code) (AI-assisted development)
- **University:** Loyola Marymount University — ISBA Capstone 2026

---

## License

This project was built for academic purposes as part of the LMU ISBA capstone program.
