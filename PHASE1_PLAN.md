# Phase 1 Implementation Plan: Project Setup & Daily Planner Core

> **Goal:** Build a fully functional, beautiful, and reactive local prototype of the **Daily Study Planner** with the 5-task engine, automatic weight normalization, binary ✓/✗ scoring, expandable study notes, and localStorage persistence.

---

## 1. Scope & Deliverables for Phase 1

By the end of Phase 1, you will have a working local web application featuring:
1. **Modern, Smooth UI:** Dark & light mode ready, clean typography, responsive layout.
2. **Date Header & Navigation:** Automatically shows today's date with `[<] Yesterday` / `[>] Tomorrow` controls and quick jump.
3. **5 Structured Task Rows:**
   - Automatic slot numbering (`1` to `5`).
   - Flexible task entry (free text + quick-pick custom study presets).
   - Compulsory weightage selector (`1` to `10`).
   - Live normalized weight calculation badge (dynamically recalculated to total 100%).
   - Binary completion buttons: **Green ✓** and **Red ✗**.
4. **Live Productivity Gauge:** Animated score card prominently displaying daily productivity percentage ($0\% - 100\%$).
5. **Daily Study Notes:** Expandable, auto-saving notes section.
6. **Unfinished Task Carry-Over:** Quick action to carry uncompleted tasks to tomorrow or a selected date.
7. **Instant Local Persistence:** Auto-saves to `localStorage` so you never lose your inputs on refresh.

---

## 2. Architecture & File Structure

```text
Todo_app/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── planner.ts          # Type definitions for Task, DailyRecord, Weightage
    ├── utils/
    │   ├── dateUtils.ts        # Date formatting, jump to today, add/sub days
    │   └── calculations.ts     # Weight normalization & productivity scoring formulas
    ├── hooks/
    │   └── useDailyPlanner.ts  # State management & localStorage auto-save
    └── components/
        ├── layout/
        │   ├── Header.tsx      # App branding, today's date, date navigation
        │   └── ProductivityBadge.tsx # Large dynamic percentage card
        ├── planner/
        │   ├── TaskRow.tsx     # Single task row (1-5) with weight & ✓/✗ buttons
        │   ├── TaskList.tsx    # Container for the 5 task rows
        │   ├── DailyNotes.tsx  # Expandable daily study notes
        │   └── CarryOverModal.tsx # Carry unfinished tasks to another date
        └── common/
            └── Dropdown.tsx    # Smooth custom dropdown for weights & presets
```

---

## 3. Step-by-Step Execution Plan

### Step 1: Scaffolding the React + Vite + Tailwind Environment
* Initialize Vite with React and TypeScript:
  ```bash
  npm create vite@latest . -- --template react-ts
  ```
* Install core dependencies:
  * `lucide-react` (clean, modern icons for ✓, ✗, calendar, notes, arrows)
  * `clsx` & `tailwind-merge` (clean class management)
  * `canvas-confetti` (reward animation when 100% daily productivity is hit)
* Configure Tailwind CSS with modern study-focused color palette (slate dark theme, emerald green ✓, rose red ✗, amber warnings).

---

### Step 2: Core Data Types (`src/types/planner.ts`)
```typescript
export type TaskStatus = 'completed' | 'failed' | null;

export interface Task {
  id: string;
  slotNumber: number; // 1 to 5
  title: string;
  rawWeight: number; // 1 to 10
  normalizedWeight: number; // e.g. 25.0 (%)
  status: TaskStatus; // 'completed' = ✓, 'failed' = ✗, null = unattempted
  carriedFromDate?: string | null;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  tasks: Task[]; // Exactly 5 slots
  notes: string;
  productivityPercentage: number;
}
```

---

### Step 3: Pure Mathematical Engine (`src/utils/calculations.ts`)
* **Weight Normalization Logic:**
  - Filter active tasks where `title.trim() !== ''`.
  - Calculate raw sum: $S = \sum w_i$.
  - For each active task:
    $$W_i = \text{round}\left(\frac{w_i}{S} \times 100, 1\right)$$
  - Handle rounding drift so the sum of active tasks always equals exactly $100.0\%$.
* **Daily Productivity Calculation:**
  - Sum the normalized weights of all tasks where `status === 'completed'`.
  - Empty tasks contribute $0\%$; tasks marked `failed` contribute $0\%$.

---

### Step 4: Building the Components
1. **`Header.tsx` & Date Controls:**
   - Displays "StudyFlow", today's auto-detected date (e.g. `Tuesday, 24 Nov 2026`).
   - Prev/Next date arrows and a "Jump to Today" badge.
2. **`ProductivityBadge.tsx`:**
   - Large prominent score display ($0\%$ to $100\%$).
   - Color transitions:
     - 0%–49%: Subtle red badge
     - 50%–79%: Warm amber badge
     - 80%–100%: Vibrant emerald badge (triggers celebration confetti on hitting 100%).
3. **`TaskRow.tsx` (5 Slots):**
   - Slot Number: `1` to `5` in a rounded badge.
   - Input: Text input with quick suggestions (e.g., "Math Practice", "Revision", "Read Paper").
   - Weight Selector: Clean dropdown from `1` to `10` (default 5).
   - Normalized Weight Indicator: Subtle pill showing the auto-computed percentage (e.g., `20.0%`).
   - Status Buttons:
     - `✓` (Green): Toggles completed state.
     - `✗` (Red): Toggles failed state.
     - Pressing an active button again resets it to neutral/pending.
4. **`DailyNotes.tsx`:**
   - Expandable/collapsible accordion with placeholder: *"Key concepts learned today, blockers, or formulas..."*
   - Auto-saves on every keystroke.
5. **`CarryOverModal.tsx`:**
   - Automatically detects unfinished tasks (status `✗` or `null`) from past dates.
   - Allows selecting tasks and carrying them into an empty slot on tomorrow's date or a chosen future date.

---

### Step 5: State Management & Persistence (`useDailyPlanner.ts`)
* Uses a custom React hook managing:
  - `currentDate`: currently viewed date.
  - `records`: dictionary `{ [date: string]: DailyRecord }`.
* Automatically loads from `localStorage` on initial mount.
* Automatically syncs to `localStorage` on every change.
* Pre-populates 5 blank task slots whenever a new date is opened.

---

## 4. Acceptance & Verification Checklist

| # | Requirement | Acceptance Criteria |
|---|---|---|
| 1 | **5 Task Slots** | Every date opens with exactly 5 numbered task rows. |
| 2 | **Automatic Date** | App automatically initializes to today's local date. |
| 3 | **Weight Normalization** | If 3 tasks have weights 5, 5, 10: normalized weights show 25%, 25%, 50% (Total: 100%). |
| 4 | **Binary Scoring** | Only ✓ and ✗ buttons exist. ✓ grants the task's normalized weight; ✗ grants 0%. |
| 5 | **Prominent Score** | Total daily percentage updates instantly with smooth visual transitions. |
| 6 | **Daily Notes** | Text typed into the daily notes section persists when navigating dates. |
| 7 | **Carry-Over** | An unfinished task can be transferred to the next day's empty slot. |
| 8 | **Persistence** | Refreshing the browser preserves all entered tasks, weights, statuses, and notes. |

---

## 5. Next Action
Once you approve this plan, we will execute **Step 1 (Scaffolding)** and build the Phase 1 components.
