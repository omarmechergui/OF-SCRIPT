'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const { data: userResponse, isLoading, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const user = userResponse?.data || null;

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    queryClient.setQueryData(['auth', 'me'], null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isError, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
