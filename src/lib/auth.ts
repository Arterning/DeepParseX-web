'use client';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';


// --- Constants ---
const TOKEN_KEY = 'deep_parse_x_token';

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

// console.log("ENV", BASE_API);

axios.defaults.baseURL = BASE_API;


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

export interface HttpError {
  msg: string;
  code: number;
}


// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回 Blob 类型的响应
    if (response.config.responseType === 'blob') {
      return response;
    }

    const { code, data }: HttpResponse = response.data;

    if (code === 401) {
      // TODO: 处理 token 过期，自动刷新 token 或跳转登录界面
    }

    return data;
  },
  (error: any) => {
    let res: HttpError = {
      msg: '服务器响应异常，请稍后重试',
      code: 500,
    };

    if (error.response) {
      res = error.response.data;
    }

    if (error.message === 'Network Error') {
      res.msg = '服务器连接异常，请稍后重试';
    }

    if (error.code === 'ECONNABORTED') {
      res.msg = '请求超时，请稍后重试';
    }

    // showError(res.msg);

    return Promise.reject(res);
  }
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
  captcha?: string;
}

export interface LoginRes {
  access_token: string;
}

export function dologin(data: LoginData): Promise<LoginRes> {
  return axios.post('/api/v1/auth/login', data);
}

export function mockLogin(data: LoginData): Promise<LoginRes> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockToken = `mock-token-for-${data.username}-${Date.now()}`;
      setToken(mockToken);
      resolve({ access_token: mockToken });
    }, 500);
  });
}

// --- Auth Service Functions ---
export const login = async (data: LoginData): Promise<LoginRes> => {
  let response;
  if (BASE_API) {
    response = await dologin(data);
  } else {
    response = await mockLogin(data);
  }
  setToken(response.access_token);
  return response;
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
