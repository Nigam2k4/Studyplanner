# StudyFlow: Daily Study Planner & Lifetime Analytics
## Technical Specification & Architecture Design

> **Document Type:** System Specification & Implementation Blueprint  
> **Target Audience:** 2-User Study Companion (You & Your Friend)  
> **Derived From:** `objective.md`  
> **Hosting & Infrastructure:** 100% Free Tier (Supabase + Vercel / PWA)

---

## 1. Executive Summary & Design Philosophy
This application is not just a standard to-do list; it is a **weighted, quantitative daily study planner and habit engine** built to measure real productivity, sustain consistency, and foster mutual accountability between two study partners.

### Core Pillars
1. **Aesthetic & Smooth UI:** Modern, clean, distraction-free interface (Dark/Light mode, subtle micro-interactions, responsive mobile-first PWA design).
2. **Weighted Accountability:** Tasks are not equal; weights (1–10) force prioritization and normalize to 100%.
3. **Binary Simplicity:** Completion is strictly binary (Green ✓ vs. Red ✗)—no ambiguous progress percentages or clutter.
4. **Data-Driven Insights:** Daily line charts, weekly/monthly averages, three-tier heatmaps, and lifetime milestones.
5. **Multi-User Sync:** Built for two study friends to track their individual progress while optionally comparing metrics or keeping each other motivated.

---

## 2. Core Functional Requirements & Logic Breakdown

### Module A: Daily Study Planner
* **Exact 5 Daily Tasks:** Every date has 5 structured task slots (Rows 1–5 numbered automatically).
* **Automatic Current Date:** Automatically selects today's date upon launch, with navigation to past or future dates.
* **Flexible Task Entry:**
  * Free text input for custom daily study goals.
  * Quick-select presets / customizable subject dropdown (e.g., Mathematics, Coding, Revision, Mock Test).
* **Compulsory Weightage (1–10):** Every entered task must have an assigned integer weight between 1 and 10.
* **Automatic Weight Normalisation Formula:**
  If $n$ tasks are entered ($1 \le n \le 5$) with raw weights $w_1, w_2, \dots, w_n$:
  $$\text{Normalized Weight } W_i = \left( \frac{w_i}{\sum_{k=1}^n w_k} \right) \times 100\%$$
* **Simple Completion System:**
  * Only two states: **✓ (Green)** or **✗ (Red)**.
  * No words like "In Progress", "50% Done", or "Pending".
* **Automatic Task Scoring & Daily Productivity:**
  $$\text{Task Score } S_i = \begin{cases} W_i & \text{if } \text{Status} = \checkmark \\ 0\% & \text{if } \text{Status} = \times \end{cases}$$
  $$\text{Daily Productivity } P_{\text{day}} = \sum_{i=1}^n S_i$$
  * Prominently displayed with an animated circular or badge progress metric.
* **Daily Study Notes:** One expandable, autosaving rich-text/markdown notes cell per date for summaries, reflections, or formulas.
* **Pending Task Management:**
  * Unfinished tasks (status ✗ or uncompleted at day's end) can be flagged and carried over to tomorrow or a selected future date with one click.

---

### Module B: Monthly Planner & Calendar
* **Monthly Worksheets & Dynamic Calendar:**
  * Generates correct days, weekdays, and leap years automatically.
  * Displays past, current, and upcoming dates.
* **Clickable Dates:** Clicking any date on the calendar immediately jumps to that date's daily planner.
* **Three-Level Productivity Heatmap:**
  Every day on the calendar is color-coded based on its final productivity $P_{\text{day}}$:
  * 🔴 **Low Productivity:** $0\% \le P_{\text{day}} < 50\%$ (Soft Red / Coral)
  * 🟡 **Moderate Productivity:** $50\% \le P_{\text{day}} < 80\%$ (Amber / Gold)
  * 🟢 **High Productivity:** $80\% \le P_{\text{day}} \le 100\%$ (Emerald / Mint Green)
  * ⚪ **No Tasks / Rest Day:** Neutral subtle tone (not counted as failure).

---

### Module C: Productivity Graphs & Analytics
* **Daily Productivity Line Graph:** Trajectory of scores (0–100%) across the selected month.
* **Weekly Productivity Bar Graph:** Compares average productivity by week (Monday to Sunday).
* **Monthly Productivity Bar Graph:** Month-over-month trend comparison across the academic year.
* **Overall Productivity Donut Chart:** Visual distribution of study time and high vs. low performance days.
* **Smart Average Calculation:**
  * Days with **zero tasks entered** (rest days) are automatically excluded from weekly/monthly averages to prevent skewing performance records artificially.

---

### Module D: Lifetime Dashboard & Exam Countdown
* **Exam Countdown Widget:**
  * User can set target exam dates (e.g., Final Exam, Certification, Milestone).
  * Real-time countdown timer in days, hours, and minutes.
* **Lifetime Metrics Board:**
  * **Overall Average Productivity:** Weighted average across all active study days.
  * **Best & Lowest Productive Days:** Historical records with dates.
  * **Consistency Metric:** Total count of days where at least 3 tasks were successfully completed (✓).
  * **Total Completed Tasks:** Lifetime counter of ✓ tasks.
  * **Total Active Study Days:** Count of days with logged activity.
  * **Perfect Days:** Total number of $100\%$ productivity days achieved.
  * **Yearly Productivity Trend & Historical Log:** Full searchable archive.

---

## 3. Recommended Free Tech Stack

| Layer | Technology | Why Chosen? | Free Tier Limits |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **React (Vite) + TypeScript** | Blazing fast, reactive state, strong typing | Unlimited (Local / Free) |
| **Styling & Icons** | **Tailwind CSS + Lucide Icons** | Ultra-smooth modern UI, dark mode support | Free |
| **Animations** | **Framer Motion** | Polished transitions, micro-interactions | Free |
| **Charts & Heatmap** | **Recharts** + SVG Heatmap | Beautiful responsive graphs and donut charts | Free |
| **Database & Auth** | **Supabase (PostgreSQL)** | Relational schema, real-time sync, auth for 2 users | 500 MB DB, 50,000 monthly active users (100% Free) |
| **Hosting** | **Vercel** | One-click auto-deploy from GitHub, SSL included | 100 GB bandwidth / mo (100% Free) |
| **Mobile App Experience**| **PWA (Progressive Web App)**| Install directly to iPhone/Android home screen | Free (No \$99/yr Apple or \$25 Google fees) |

---

## 4. Database Schema (PostgreSQL / Supabase)

```sql
-- 1. Profiles / Users Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Daily Records (Aggregates per day)
CREATE TABLE daily_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    productivity_percentage NUMERIC(5, 2) DEFAULT 0.00,
    notes TEXT DEFAULT '',
    completed_tasks_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 3. Daily Tasks (5 rows per day)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_record_id UUID REFERENCES daily_records(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    slot_number INT CHECK (slot_number BETWEEN 1 AND 5),
    title TEXT NOT NULL,
    raw_weight INT CHECK (raw_weight BETWEEN 1 AND 10),
    normalized_weight NUMERIC(5, 2),
    is_completed BOOLEAN DEFAULT NULL, -- NULL = unattempted, TRUE = ✓, FALSE = ✗
    carried_from_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date, slot_number)
);

-- 4. Exam Targets
CREATE TABLE exam_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. UI/UX Wireframe & Layout Architecture

```
+-------------------------------------------------------------------------+
| [Logo: StudyFlow]     📅 Today: Nov 24, 2026    🔥 Streak: 12   [Avatar]|
+-------------------------------------------------------------------------+
| [Exam Countdown: 🎯 Final Exam in 48 Days 14 Hours]                     |
+-------------------------------------------------------------------------+
|  DAILY PLANNER (5 Tasks)            |  MONTHLY CALENDAR & HEATMAP       |
|  Date: [<] Nov 24, 2026 [>]         |  November 2026                    |
|                                     |  Mo  Tu  We  Th  Fr  Sa  Su       |
|  #1 [Algorithms Revision   ] (W: 8) |  [🟢][🟢][🟡][🟢][🔴][⚪][🟢]     |
|     Norm: 33.3%   [ ✓ ] [ ✗ ]       |  (Click any date to open)         |
|  #2 [Database System Design] (W: 7) |-----------------------------------|
|     Norm: 29.2%   [ ✓ ] [ ✗ ]       |  TODAY'S PRODUCTIVITY SCORE       |
|  #3 [Math Chapter 4 Notes  ] (W: 5) |                                   |
|     Norm: 20.8%   [ ✓ ] [ ✗ ]       |         /-------------\           |
|  #4 [Physics Numerical Set ] (W: 4) |        |    83.3%    |          |
|     Norm: 16.7%   [ ✓ ] [ ✗ ]       |         \-------------/           |
|  #5 [Carry-over / Empty    ] (W: -) |        🟢 HIGH PRODUCTIVITY       |
|-------------------------------------+-----------------------------------|
|  DAILY STUDY NOTES (Expandable)     |  QUICK METRICS                    |
|  [ Markdown / Notes field ...     ] |  • Week Avg: 78.4%                |
|  [ Auto-saved                     ] |  • Month Avg: 81.2%               |
+-------------------------------------------------------------------------+
|  ANALYTICS & LIFETIME DASHBOARD (Tab)                                   |
|  [Daily Line Graph]   [Weekly Bars]   [Donut Chart]   [Lifetime Stats]  |
+-------------------------------------------------------------------------+
```

---

## 6. Implementation Stages & Roadmap

1. **Phase 1: Project Setup & Local Prototype**
   - Initialize Vite + React + TypeScript + Tailwind CSS.
   - Implement the complete Daily Planner UI with local state and calculation engine (5 task slots, weight normalization, ✓/✗ toggle, daily percentage).
2. **Phase 2: Calendar & Heatmap Integration**
   - Build the dynamic monthly calendar grid.
   - Implement the 3-level heatmap color mapping and date-click navigation.
3. **Phase 3: Analytics, Charts & Lifetime Dashboard**
   - Integrate Recharts (Daily line graph, weekly/monthly bars, donut chart).
   - Build the Lifetime stats cards and Exam Countdown widget.
4. **Phase 4: Cloud Database & Free Sync (Supabase)**
   - Connect Supabase for PostgreSQL storage.
   - Add user authentication for you and your friend.
   - Real-time updates so data is always backed up and synced.
5. **Phase 5: PWA & Free Cloud Deployment (Vercel)**
   - Configure manifest and service worker so it can be installed on iOS/Android home screens.
   - Deploy to Vercel with a custom free link.
