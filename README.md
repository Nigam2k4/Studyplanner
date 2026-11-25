# 🎯 StudyFlow — Modern 5-Task Daily Study Planner

A refreshing, distraction-free study productivity web application designed to help students, developers, and competitive exam aspirants focus on what matters most each day.

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✨ Features

- **5 Daily Study Task Slots:** Enforces intentional prioritization—no endless overwhelming to-do lists.
- **Compulsory Task Weights ($1\text{--}10$) with Normalization:** Each task has an importance weight ($1\text{--}10$) that automatically normalizes to a true $100\%$ scale:
  $$W_i = \frac{w_i}{\sum_{k} w_k} \times 100\%$$
- **Binary Scoring ($\checkmark$ / $\boldsymbol{\times}$):** No fuzzy progress bars. Tasks are either completed ($\checkmark$) earning full normalized weight, or missed ($\boldsymbol{\times}$).
- **Target Goal / Exam Countdown Timer:** Set any future exam or milestone date with 1-click presets (`+7d`, `+30d`, `+60d`, `+90d`). A live digital clock displays the exact remaining:
  $$\text{[ Days ]} \quad : \quad \text{[ Hours ]} \quad : \quad \text{[ Minutes ]} \quad : \quad \text{[ Seconds ]}$$
- **7-Day Productivity Graph:** Dynamic cubic Bézier curve plotting your last 7 days against completed weights with slope movement indicators ($\nearrow +\%$ / $\searrow -\%$).
- **Heatmap Calendar:** Compact square month calendar showing daily score color codes with click-to-view date history.
- **Personalized Greeter:** Greets you with your name and offers intelligent motivation tailored to yesterday's performance.
- **Study Notes & Unfinished Task Carry-over:** Collapsible daily notes scratchpad with automatic rollover of missed tasks.
- **1-Click Google Calendar Sync:** Instantly creates scheduled study blocks directly in Google Calendar with zero API setup required.
- **Individual Authentication & Privacy:** Secure per-user accounts scoped by email with local persistence and offline readiness.
- **Light / Dark Mode:** Refreshing modern color palette with instant theme toggling.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite 6, TypeScript 5, Tailwind CSS 3
- **Icons & Visuals:** Lucide React, Canvas Confetti
- **Clock & State Sync:** High-precision real-time clock with background NTP drift correction and midnight rollover detection
- **Database (Optional):** PostgreSQL / Supabase schema with Row Level Security (RLS) included in `supabase/schema.sql`

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/Nigam2k4/Studyplanner.git
cd Studyplanner

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 📦 Production Build & Testing

```bash
# Run unit test suite
node tests/unit_test.mjs

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment

Ready to deploy in seconds on:
- **Vercel:** Auto-detected Vite preset (pre-configured with `vercel.json`)
- **Netlify:** Drag & drop the `dist/` folder at [app.netlify.com/drop](https://app.netlify.com/drop) or connect your repository (configured with `netlify.toml`)
- **Cloudflare Pages / GitHub Pages**

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment instructions.

---

## 📄 License

MIT © [Nigam2k4](https://github.com/Nigam2k4)
