/**
 * Custom hook: useLocalStorage
 * Provides persistent state that syncs with localStorage
 * Different from class examples - handles JSON serialization and SSR safety
 */
import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: SetValue<T>;
  removeValue: () => void;
  isLoading: boolean;
}

/**
 * Custom hook for persisting state in localStorage
 * Features:
 * - SSR-safe (handles server-side rendering)
 * - Type-safe with generics
 * - Automatic JSON serialization/deserialization
 * - Sync across browser tabs (storage event listener)
 * - Loading state for hydration
 * 
 * @param key - The localStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns Object with value, setValue, removeValue, and isLoading
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // State to track if we've loaded from storage
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize with a function to avoid running on every render
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Return initial value on server-side
    if (typeof window === 'undefined') {
      return initialValue;
    }
    return initialValue;
  });

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsLoading(false);
  }, [key]);

  // Listen for changes in other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // Ignore parsing errors
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  // Setter function that updates both state and localStorage
  const setValue: SetValue<T> = useCallback((value) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
      }
      
      return valueToStore;
    });
  }, [key]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Error removing localStorage key "${key}":`, error);
      }
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
  };
}

/**
 * Custom hook: useSessionStorage  
 * Same as useLocalStorage but uses sessionStorage instead
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [isLoading, setIsLoading] = useState(true);
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const item = window.sessionStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
    }
    setIsLoading(false);
  }, [key]);

  const setValue: SetValue<T> = useCallback((value) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      
      if (typeof window !== 'undefined') {
        try {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.warn(`Error setting sessionStorage key "${key}":`, error);
        }
      }
      
      return valueToStore;
    });
  }, [key]);

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {
        console.warn(`Error removing sessionStorage key "${key}":`, error);
      }
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
  };
}
