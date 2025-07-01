'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

// --- Constants ---
const TOKEN_KEY = 'deep_parse_x_token';

// --- Token Management (client-side) ---
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// --- Auth Interfaces ---
export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
}

// --- Auth Service Functions ---
export const login = async (data: LoginData): Promise<LoginRes> => {
  // MOCK IMPLEMENTATION
  // In a real app, this would be:
  // import api from './api';
  // const response = await api.post<LoginRes>('/auth/login', data);
  // setToken(response.data.access_token);
  // return response.data;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockToken = `mock-token-for-${data.username}-${Date.now()}`;
      setToken(mockToken);
      resolve({ access_token: mockToken });
    }, 500);
  });
};

// --- Hooks ---
export const useAuth = () => {
  const router = useRouter();
  // Using a state that updates on mount to avoid server/client mismatch
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check token on mount
    if (getToken()) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    // MOCK IMPLEMENTATION for POST /api/v1/auth/logout
    removeToken();
    setIsAuthenticated(false);
    // Refresh the page to ensure all state is cleared
    router.push('/login');
  }, [router]);

  return { isAuthenticated, isLoading, logout };
};
