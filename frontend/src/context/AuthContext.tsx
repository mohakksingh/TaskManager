'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Try to refresh token on mount
    const initAuth = async () => {
      try {
        const { data } = await api.get('/auth/refresh');
        setAuthToken(data.accessToken);
        setUser(data.user);
      } catch (error) {
        // Not authenticated
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.user);
    setAuthToken(data.accessToken);
    router.push('/');
  };

  const register = async (credentials: any) => {
    const { data } = await api.post('/auth/register', credentials);
    setUser(data.user);
    setAuthToken(data.accessToken);
    router.push('/');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    setUser(null);
    setAuthToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
