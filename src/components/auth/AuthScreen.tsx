import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User as UserIcon, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, signup, googleAuth } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      const res = signup(email, password, name);
      if (!res.success && res.error) {
        setError(res.error);
      }
    } else {
      const res = login(email, password);
      if (!res.success && res.error) {
        setError(res.error);
      }
    }
  };

  const handleGoogleLogin = () => {
    // Prompt or authenticate with Google email
    const promptEmail = window.prompt(
      'Enter your Google account email address to sign in:',
      'scholar@gmail.com'
    );
    if (promptEmail && promptEmail.includes('@')) {
      const res = googleAuth(promptEmail, promptEmail.split('@')[0]);
      if (!res.success && res.error) {
        setError(res.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-200">
      <div className="max-w-md w-full space-y-6">
        {/* Branding & App Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 items-center justify-center shadow-lg shadow-emerald-500/20 text-white mb-1">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            StudyFlow
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Quantitative 5-task weighted study companion
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                mode === 'signin'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                mode === 'signup'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Create Account (Register)
            </button>
          </div>

          {/* 1-Click Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
              <span className="bg-white dark:bg-slate-900 px-3">or with registered email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (User Identifier)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Create a password (min 6 characters)' : 'Enter your password'}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition mt-2 flex items-center justify-center gap-1.5"
            >
              <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration Helper Notice */}
          <div className="mt-4 text-center">
            {mode === 'signin' ? (
              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Create one here
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError('');
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Sign in to your account
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-slate-500 dark:text-slate-400 text-[11px] font-medium">
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>5 Normalized Aims</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>7-Day Slope Graph</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Square Heatmap</span>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Every todo and study record is strictly linked to your email ID</span>
        </div>
      </div>
    </div>
  );
};
