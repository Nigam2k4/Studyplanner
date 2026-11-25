export interface User {
  email: string; // Email ID is the primary user identifier
  displayName: string;
  createdAt: string;
}

export interface RegisteredAccount {
  email: string;
  password: string;
  displayName: string;
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => AuthResult;
  signup: (email: string, password: string, displayName: string) => AuthResult;
  googleAuth: (email: string, displayName: string) => AuthResult;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}
