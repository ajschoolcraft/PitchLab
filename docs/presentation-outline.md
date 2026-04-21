# AI Presentation Coach — Capstone Presentation Outline

**Presenters:** A.J. Schoolcraft, Joaquin Crespo, Emma Sprankle
**ISBA Subfields:** Software Development | AI / Machine Learning | UI/UX Design | Cloud Computing & DevOps | Database Management

---

## Slide 1: Title Slide

**AI Presentation Coach**
*Your personal AI-powered speaking coach*

A.J. Schoolcraft, Joaquin Crespo, Emma Sprankle
LMU ISBA Capstone 2026

ISBA Subfields (displayed as visual badges):
- Software Development
- AI / Machine Learning
- UI/UX Design
- Cloud Computing & DevOps
- Database Management

---

## Slide 2: Hook (Introduction — 2-3 min)

**"75% of people rank public speaking as their number one fear — above death."**

And yet for entrepreneurs and small business owners, being on camera isn't optional anymore. Your next customer is scrolling Instagram, TikTok, or YouTube right now. If you can't show up and speak clearly, you're invisible.

So we asked: *what if the hardest part — figuring out what to say and getting comfortable on camera — had a coach built right into your phone?*

---

## Slide 3: Elevator Pitch

**We built an AI-powered web app that helps entrepreneurs and small business owners write professional pitch scripts and practice delivering them on camera — all from their phone.**

- **Who:** Entrepreneurs, small business owners, job seekers
- **Problem:** They know their business but struggle to communicate it clearly on video
- **Solution:** AI generates their script from guided questions, then they record, review, and reshoot until they're confident

---

## Slide 4: The Problem (Problem & Stakes — 2-3 min)

**The people we're helping:**

Picture a small business owner — maybe they run a bakery, a landscaping company, or a tutoring service. They're great at what they do. But their competitor down the street just posted a polished 30-second pitch on Instagram and got 200 new followers overnight.

Our user knows they need to do the same thing. But they sit down, open the camera, and freeze.

---

## Slide 5: Why This Problem Exists

**Three walls stand between them and a good video:**

1. **"What do I even say?"** — They know their business inside and out, but turning that knowledge into a clear, structured pitch feels impossible. They're not writers or marketers.

2. **"I sound terrible on camera"** — They record one take, hate it, and give up. No one told them that even professionals do 10+ takes.

3. **"I can't afford to hire someone"** — A professional video costs $500-$2,000+. A social media consultant charges monthly. These are small businesses — that budget doesn't exist.

**How they deal with it today:**
They don't. Or they spend an hour writing something that sounds stiff, record one awkward take, never post it, and go back to hoping word-of-mouth is enough. The workaround is avoidance.

---

## Slide 6: What This Costs Them

- Missed visibility on social media platforms where their customers already are
- Lost revenue from customers who chose the competitor who showed up on video
- Hours wasted trying to write scripts that don't sound like them
- Confidence erosion — every failed attempt makes the next one harder

**The gap isn't talent. It's tooling.**

---

## Slide 7: Our Solution (Solution & Demo — 5-7 min)

**AI Presentation Coach — a three-step workflow:**

1. **Answer guided questions** — Our AI script generator asks you 11 thoughtful questions about your business, audience, and goals
2. **Get a polished script** — Claude AI turns your answers into a natural, authentic pitch script
3. **Record with a teleprompter** — Practice on camera with your script scrolling on screen, take as many tries as you need, and download your best take

---

## Slide 8: Live Demo — Script Generator

> *Live walkthrough: navigate to the Script Generator page*

**This is where our AI / Machine Learning subfield comes in.** We use the Claude API to generate scripts. We chose Claude specifically because it produces responses in warm, encouraging language — it sounds like a coach, not a robot. The user answers questions like:

- "What does your business do in simple terms?"
- "Who is your ideal customer?"
- "What makes you different from competitors?"

The AI takes those real, personal answers and weaves them into a structured pitch. Show the generation in real time.

---

## Slide 9: Live Demo — Recording Studio

> *Live walkthrough: navigate to the Record page with a script loaded*

**This is where our UI/UX Design subfield comes in.** The entire recording experience was designed mobile-first, because that's what our users have in their pocket.

Walk through:
- Script loaded notification
- Teleprompter launching with the script
- 3-second countdown before recording starts
- Camera preview in the corner while reading
- Stop recording and review the take
- Record another take
- Browse all takes, see save status, delete bad ones

**This is where the Software Development subfield comes in.** The multi-take recorder handles media streams, blob storage, thumbnail generation, and auto-upload to the cloud — all seamlessly in the browser.

---

## Slide 10: Live Demo — Video Library & Sharing

> *Live walkthrough: Recordings page and Share page*

- Show the recordings grid with thumbnails
- Play back a recording
- Mark a take as "Final"
- Download a video
- Walk through the Share page's platform-specific upload guides (Instagram, TikTok, YouTube, Facebook)

---

## Slide 11: The Before & After

| Before | After |
|--------|-------|
| Stares at blank page, doesn't know what to say | Answers guided questions, gets a polished script in seconds |
| Records one take, hates it, gives up | Records multiple takes, picks the best one confidently |
| No teleprompter — loses train of thought on camera | Script scrolls on screen while recording |
| Pays $500+ for professional video help | Free tool accessible from any phone |
| Videos never get posted | Videos get downloaded and shared to social platforms |

---

## Slide 12: Architecture Overview

**Tech Stack:**
- **Frontend:** React + Vite (fast builds, modern tooling)
- **Backend/Database:** Supabase (Postgres + Auth + Storage)
- **AI:** Anthropic Claude API
- **Deployment:** Vercel

**This is where our Cloud Computing & DevOps and Database Management subfields come in.**

- Supabase gives us a full Postgres database, user authentication, and file storage in one platform
- Row Level Security (RLS) policies ensure users can only access their own scripts and recordings
- Videos and thumbnails are stored in Supabase Storage buckets with per-user isolation
- Vercel handles deployment with automatic builds on every push

---

## Slide 13: Key Decision 1 — Why Supabase

**The situation:** We needed a backend that handles authentication, a database, and video file storage — without a budget for infrastructure.

**Options considered:**
- **Firebase** — Popular, but Firestore's document model felt awkward for relational data (scripts linked to users linked to recordings)
- **Custom backend (Express + Postgres + S3)** — Maximum control, but significant setup and maintenance overhead for a capstone timeline
- **Supabase** — Full Postgres database, built-in auth, file storage, and a generous free tier

**Why we chose Supabase:**
- Free to run on the web — critical for a student project that needs to stay live
- Real Postgres with SQL — easy to create tables, define relationships, and write RLS policies
- RLS policies enforce security at the database level, so even if frontend code has a bug, one user can never see another user's data
- Built-in storage buckets for video files with the same RLS model

**What we gained:** A production-grade backend with zero infrastructure cost.
**What we gave up:** Less community documentation than Firebase, and some vendor lock-in.

---

## Slide 14: Key Decision 2 — Why Claude API

**The situation:** The script generator is the core feature. The AI's output quality directly determines whether users trust the app.

**Options considered:**
- **OpenAI GPT-4** — Industry standard, massive community, well-documented
- **Open-source models (Llama, Mistral)** — Free to run, but require hosting and fine-tuning infrastructure we didn't have
- **Anthropic Claude API** — Strong language quality, conversational tone

**Why we chose Claude:**
- Claude's responses read like a supportive coach, not a corporate chatbot. For an app about building confidence, tone matters enormously.
- We also built the entire app using Claude Code as our development tool, so we had firsthand experience with how well Claude understands context and intent.
- The API is straightforward to integrate and the response quality was consistently better for our specific use case — generating scripts that sound like a real person talking.

**What we gained:** Scripts that users actually want to read out loud.
**What we gave up:** Smaller ecosystem than OpenAI, fewer third-party integrations.

---

## Slide 15: Key Decision 3 — Mobile-First Design

**The situation:** Our target users — entrepreneurs and small business owners — are most likely to record videos on their phones. But we also need the app to work on a laptop.

**Options considered:**
- **Desktop-first, then responsive** — Traditional approach, but risks a clunky mobile experience bolted on after the fact
- **Native mobile app (React Native)** — Best mobile experience, but doubles the development scope and requires app store deployment
- **Mobile-first web app** — Design for the phone first, then scale up for desktop

**Why we chose mobile-first web:**
- No app store required — users just open a URL
- The recording experience (camera, teleprompter, multi-take) was designed for the phone form factor first, where most recording actually happens
- Desktop support comes naturally through responsive CSS — we recently added full desktop nav parity
- React + Vite + Vercel makes this stack fast to build and deploy

**What we gained:** One codebase that works everywhere, zero friction to start using the app.
**What we gave up:** Can't access native phone features like push notifications without additional work.

---

## Slide 16: Key Decision 4 ��� Guided Questions Over Open Prompts

**The situation:** We needed to decide how users interact with the AI script generator.

**Options considered:**
- **Single text box** — "Describe your business and we'll write a script." Simple, but users freeze on open-ended prompts just like they freeze on camera.
- **Template selection** — Pick a template, fill in blanks. Fast, but produces generic scripts that don't sound personal.
- **Guided questionnaire** — Walk users through 11 specific questions, then feed all answers to the AI.

**Why we chose the questionnaire:**
- It mirrors what a real coach would do — ask you about your business, your audience, your story, one question at a time.
- Users who can't write a script *can* answer "What does your business do in simple terms?" The questions break the wall.
- The AI gets rich, personal context from 11 answers instead of one vague paragraph, producing scripts that sound like the user, not like AI.

**What we gained:** Dramatically better script quality and a user experience that feels supportive, not intimidating.
**What we gave up:** Longer flow than a single-prompt approach. Users who want to move fast might find 11 questions too many.

---

## Slide 17: Reflection (1-2 min)

**What I Know Now That I Didn't Before**

"We assumed the AI script generation would be the hard part of this project. It wasn't. The hard part was the recording experience — getting the browser's camera and microphone APIs to work reliably across different devices, handling media streams that silently fail, dealing with blob storage quirks, and making the teleprompter overlay feel natural instead of distracting. The AI took a week. The recorder took most of the semester. If I started over, I'd prototype the recording flow on five different phones before writing a single line of AI code."

---

## Slide 18: Closing Slide

**Key Takeaways:**

1. **The gap between knowing your business and communicating it on video is a tooling problem, not a talent problem.** AI Presentation Coach closes that gap.

2. **Guided AI beats open-ended AI.** Asking the right questions produces better scripts than asking users to describe everything at once.

3. **Mobile-first isn't just a design preference — it's meeting users where they already are.** The best camera most people own is already in their pocket.

**Next Steps:**
- User testing with real small business owners to validate the workflow
- AI-powered feedback on recorded videos (pacing, filler words, eye contact)
- Expanded script templates for different use cases (job interviews, investor pitches, product demos)

**Try it now:** *[your-deployed-url]*
