'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// ============================
// Types
// ============================

export type UserRole = 'USER' | 'ADMIN' | 'ORGANIZER';

export interface AuthUser {
  userId: number;
  name: string;
  role: UserRole;
  token: string;
  preferredCityId?: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, password: string, role?: 'USER' | 'ORGANIZER') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  setPreferredCity: (cityId: number | null) => void;
}

// ============================
// Context
// ============================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'eventify_auth';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eventify-back-end.onrender.com/api';

// ============================
// Provider
// ============================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to set cookie
  const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  };

  // Helper function to remove cookie
  const removeCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  };

  // Load user from browser storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored) as AuthUser;
        setUser(parsedUser);
        // Also set cookie for SSR
        setCookie(AUTH_STORAGE_KEY, stored);
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        removeCookie(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to browser storage and cookie when it changes
  useEffect(() => {
    if (user) {
      const userJson = JSON.stringify(user);
      localStorage.setItem(AUTH_STORAGE_KEY, userJson);
      setCookie(AUTH_STORAGE_KEY, userJson);
    }
  }, [user]);

  const login = useCallback(async (name: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Invalid username or password' };
        }
        return { success: false, error: 'Login failed. Please try again.' };
      }

      const data = await response.json();
      
      const authUser: AuthUser = {
        userId: data.userId,
        name: data.name,
        role: data.role as UserRole,
        token: data.token,
      };

      setUser(authUser);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  }, []);

  const register = useCallback(async (name: string, password: string, role: 'USER' | 'ORGANIZER' = 'USER'): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password, role, cityId: 1 }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          return { success: false, error: 'Username already exists. Please choose a different username.' };
        }
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.message || 'Registration failed. Please try again.' };
      }

      const data = await response.json();
      
      const authUser: AuthUser = {
        userId: data.userId,
        name: data.name,
        role: data.role as UserRole,
        token: data.token,
      };

      setUser(authUser);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  }, []);

  const logout = useCallback(async () => {
    // Call backend to properly terminate the session
    try {
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Clear client-side state
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Remove auth cookie
    document.cookie = `${AUTH_STORAGE_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }, [user?.token]);

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user]);

  const setPreferredCity = useCallback((cityId: number | null) => {
    if (user) {
      setUser({ ...user, preferredCityId: cityId });
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasRole,
    setPreferredCity,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================
// Hook
// ============================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
