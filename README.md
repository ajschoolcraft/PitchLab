# AI Presentation Coach

A web app that helps entrepreneurs, business owners, and job seekers craft compelling pitch scripts and practice delivering them on camera — powered by AI script generation, a built-in teleprompter, and multi-take video recording.

---

## Features

- **AI Script Generator** — Answer guided questions about your business or idea, and Claude AI generates a polished 30-second pitch script for you.
- **Multi-Take Video Recorder** — Record as many takes as you need with a 60-second timer. Review, compare, and keep your best one.
- **Built-In Teleprompter** — Display your script on screen while recording so you can deliver naturally without memorizing.
- **Dashboard** — Manage all your scripts and recordings in one place. Mark favorites, download, or delete.
- **User Profiles** — Track your stats (scripts created, videos recorded) and customize your profile.
- **Authentication** — Sign up with email/password or Google OAuth. Your data stays private with row-level security.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router 7, Vite |
| Backend | Vercel Serverless Functions |
| AI | Anthropic Claude API |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + Google OAuth) |
| Storage | Supabase Storage (video uploads) |

---

## Project Structure

```
src/
├── pages/
│   ├── Landing.jsx              # Marketing landing page
│   ├── Auth.jsx                 # Sign up / login
│   ├── Dashboard.jsx            # Scripts & recordings hub
│   ├── ScriptGenerator.jsx      # Guided questionnaire + AI generation
│   ├── Record.jsx               # Video recording interface
│   ├── Profile.jsx              # User settings & stats
│   └── NotFound.jsx             # 404 page
├── components/
│   ├── MultiTakeVideoRecorder.jsx  # Camera, recording, & upload logic
│   ├── Teleprompter.jsx            # Full-screen script display
│   ├── NavBar.jsx                  # Top navigation
│   ├── ProtectedRoute.jsx          # Auth-required route wrapper
│   ├── Onboarding.jsx              # First-time user walkthrough
│   └── Toast.jsx                   # Toast notifications
├── context/
│   └── AuthContext.jsx          # Global auth state
├── lib/
│   └── supabase.js              # Supabase client setup
├── App.jsx                      # Route definitions
└── main.jsx                     # Entry point

api/
└── generate-script.js           # Vercel serverless function (Claude API)
```

---

## Getting Started

### Prerequisites

- Node.js 16+
- A [Supabase](https://supabase.com) project
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd AI-Presentation-Coach

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For the Vercel serverless function, set this in your Vercel project settings:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> **Note:** Never commit API keys to the repository.

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

The app expects the following in your Supabase project:

- **Tables:** `scripts`, `user_vids`, `questions`
- **Auth:** Email/password and Google OAuth providers enabled
- **Storage:** A `videos` bucket for recorded presentations
- **RLS:** Row-level security policies so users can only access their own data

---

## Deployment

The app is configured for [Vercel](https://vercel.com):

- The frontend builds from `vite build` and serves as a static SPA
- The `/api/generate-script.js` function deploys automatically as a serverless endpoint
- SPA routing is handled via `vercel.json`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Built With

This project was built collaboratively using Agile Scrum methodology.
