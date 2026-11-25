# StudyFlow — Deployment Guide

StudyFlow is a modern, high-performance Vite + React + TypeScript single-page application (PWA ready).
The application is pre-configured and fully built in the `dist/` directory.

---

## 🚀 Recommended Deployment Options

### Option 1: Vercel (1-Click & Recommended)

1. Push this project to GitHub (or GitLab / Bitbucket).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** and select your `Todo_app` repository.
4. Vercel automatically detects Vite settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**. Your live URL will be active in seconds!

*Note: The included `vercel.json` ensures all client routes redirect cleanly to `index.html`.*

---

### Option 2: Netlify (Drag & Drop or Git)

#### Method A: Instant Drag & Drop (Zero Setup)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `dist` folder located at:
   `c:\Users\hp\OneDrive\Desktop\Todo_app\dist`
3. Netlify will immediately publish your website with a free HTTPS `.netlify.app` domain.

#### Method B: Git Continuous Deployment
1. Connect your GitHub repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

*Note: The included `netlify.toml` automatically handles SPA routing.*

---

### Option 3: Cloudflare Pages

1. In the Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages**.
2. Connect to your Git repository.
3. Set build configuration:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**.

---

### Option 4: Local / Self-Hosted Production Server

To run the production build locally or on any VPS / Docker container:
```bash
# Build the production bundle
npm run build

# Preview / serve the production bundle
npm run preview
```
The server will run on port `4173` (or port specified with `--port`).

---

## 🗄️ Database & Cloud Sync (Optional)

StudyFlow is architected with a local-first design:
- All registered accounts, daily study tasks, 7-day analytics, notes, and countdown goals work offline and persist in the browser's storage scoped by email address.
- To connect to a remote PostgreSQL/Supabase database for multi-device sync, run the SQL script provided in [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL Editor.
