'use client';

import axios, { AxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

// --- Constants ---
const TOKEN_KEY = 'deep_parse_x_token';


axios.defaults.baseURL = 'http://localhost:8001';


// 请求拦截器
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export function logout() {
  return axios.post('/api/v1/auth/logout');
}


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
  // const response = await axios.post('/api/v1/auth/login', data);
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
