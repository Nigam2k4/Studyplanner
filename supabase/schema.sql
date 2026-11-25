-- ========================================================================
-- StudyFlow: Production Database Schema with Multi-User Isolation (RLS)
-- Target Database: PostgreSQL 15+ / Supabase (100% Free Tier)
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to auth.users)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 2. DAILY RECORDS TABLE (Linked to user_id)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    productivity_percentage NUMERIC(5, 2) DEFAULT 0.00,
    notes TEXT DEFAULT '',
    completed_tasks_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_date UNIQUE (user_id, date)
);

-- ------------------------------------------------------------------------
-- 3. DAILY TASKS TABLE (5 Rows per Day, Linked to user_id & daily_records)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    daily_record_id UUID REFERENCES public.daily_records(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    slot_number INT NOT NULL CHECK (slot_number BETWEEN 1 AND 5),
    title TEXT NOT NULL DEFAULT '',
    raw_weight INT NOT NULL DEFAULT 5 CHECK (raw_weight BETWEEN 1 AND 10),
    normalized_weight NUMERIC(5, 2) DEFAULT 0.00,
    is_completed BOOLEAN DEFAULT NULL, -- NULL = unattempted, TRUE = ✓, FALSE = ✗
    carried_from_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_date_slot UNIQUE (user_id, date, slot_number)
);

-- ------------------------------------------------------------------------
-- 4. EXAM GOALS & COUNTDOWNS (Linked to user_id)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exam_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures each user can ONLY view, insert, update, or delete their own data!
-- ------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_targets ENABLE ROW LEVEL SECURITY;

-- Profiles: users manage their own profile, can view friends' profiles
CREATE POLICY "Users can view all study profiles"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

-- Daily Records: user owns their records
CREATE POLICY "Users own daily records"
    ON public.daily_records FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Tasks: user owns their tasks
CREATE POLICY "Users own tasks"
    ON public.tasks FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Exam Targets: user owns their targets
CREATE POLICY "Users own exam targets"
    ON public.exam_targets FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------
-- 6. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
