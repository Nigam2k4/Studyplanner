import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, RegisteredAccount, AuthResult, AuthContextType } from '../types/auth';

const REGISTRY_STORAGE_KEY = 'studyflow_registered_users_registry_v1';
const SESSION_STORAGE_KEY = 'studyflow_active_user_email_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Registry of all registered accounts on this device/app (keyed by email)
  const [registry, setRegistry] = useState<Record<string, RegisteredAccount>>(() => {
    try {
      const saved = localStorage.getItem(REGISTRY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse user registry:', e);
    }
    return {};
  });

  // Active logged-in user
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedEmail = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedEmail) {
        const rawRegistry = localStorage.getItem(REGISTRY_STORAGE_KEY);
        const parsedRegistry: Record<string, RegisteredAccount> = rawRegistry
          ? JSON.parse(rawRegistry)
          : {};
        const account = parsedRegistry[savedEmail.toLowerCase().trim()];
        if (account) {
          return {
            email: account.email,
            displayName: account.displayName,
            createdAt: account.createdAt,
          };
        }
      }
    } catch (e) {
      console.error('Failed to restore user session:', e);
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync registry changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registry));
    } catch (e) {
      console.error('Failed to save user registry:', e);
    }
  }, [registry]);

  // Sync active user session to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, user.email);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [user]);

  // 1. Sign In: Strictly verifies email is registered AND password matches!
  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const normalizedEmail = email.toLowerCase().trim();

      if (!normalizedEmail || !normalizedEmail.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!password) {
        return { success: false, error: 'Please enter your password.' };
      }

      const account = registry[normalizedEmail];

      // Bug Fix: Check if user exists in registry
      if (!account) {
        return {
          success: false,
          error: 'No account found with this email. Please register/create an account first.',
        };
      }

      // Bug Fix: Check password matches
      if (account.password !== password) {
        return {
          success: false,
          error: 'Incorrect password. Please verify and try again.',
        };
      }

      // Success: Log the user in
      const activeUser: User = {
        email: account.email,
        displayName: account.displayName,
        createdAt: account.createdAt,
      };
      setUser(activeUser);
      setIsAuthModalOpen(false);
      return { success: true };
    },
    [registry]
  );

  // 2. Sign Up (Create Account): Enforces unique email check!
  const signup = useCallback(
    (email: string, password: string, displayName: string): AuthResult => {
      const normalizedEmail = email.toLowerCase().trim();

      if (!normalizedEmail || !normalizedEmail.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      if (!displayName.trim()) {
        return { success: false, error: 'Please enter your name.' };
      }

      // Check if email already registered
      if (registry[normalizedEmail]) {
        return {
          success: false,
          error: 'An account with this email already exists. Please sign in instead.',
        };
      }

      // Create new registered account
      const newAccount: RegisteredAccount = {
        email: normalizedEmail,
        password,
        displayName: displayName.trim(),
        createdAt: new Date().toISOString(),
      };

      setRegistry((prev) => ({
        ...prev,
        [normalizedEmail]: newAccount,
      }));

      const activeUser: User = {
        email: newAccount.email,
        displayName: newAccount.displayName,
        createdAt: newAccount.createdAt,
      };
      setUser(activeUser);
      setIsAuthModalOpen(false);
      return { success: true };
    },
    [registry]
  );

  // 3. Google 1-Click Authentication
  const googleAuth = useCallback(
    (email: string, displayName: string): AuthResult => {
      const normalizedEmail = email.toLowerCase().trim();

      // If account doesn't exist, register them automatically
      if (!registry[normalizedEmail]) {
        const newAccount: RegisteredAccount = {
          email: normalizedEmail,
          password: 'google_authenticated_oauth',
          displayName: displayName.trim() || normalizedEmail.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        setRegistry((prev) => ({
          ...prev,
          [normalizedEmail]: newAccount,
        }));
      }

      const activeUser: User = {
        email: normalizedEmail,
        displayName: displayName.trim() || normalizedEmail.split('@')[0],
        createdAt: registry[normalizedEmail]?.createdAt || new Date().toISOString(),
      };
      setUser(activeUser);
      setIsAuthModalOpen(false);
      return { success: true };
    },
    [registry]
  );

  // 4. Log out: Clears active session
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        googleAuth,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
