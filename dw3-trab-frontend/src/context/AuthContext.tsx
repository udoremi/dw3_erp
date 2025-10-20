'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

interface User { isAuthenticated: boolean; token: string; }

interface AuthContextType {
  user: User | null; loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void; isAuthenticated: boolean; token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);
interface AuthProviderProps { children: ReactNode; }

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      try { const token = localStorage.getItem('authToken'); if (token) setUser({ isAuthenticated: true, token });
      } catch (error) { console.error("Falha ao carregar usuário", error); localStorage.removeItem('authToken'); setUser(null);
      } finally { setLoading(false); }
    };
    loadUserFromLocalStorage();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
        const response = await api.post('/login', {
            username: username,
            password: password,
        });

        const token = response.data.token;
        if (!token) throw new Error("Token não recebido do backend");

        localStorage.setItem('authToken', token);
        setUser({ isAuthenticated: true, token });
        router.push('/dashboard');
        return { success: true };
    } catch (error: any) {
        console.error("Falha no login", error);
        setUser(null);
        return { success: false, message: error.response?.data?.message || "Credenciais inválidas." };
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken'); setUser(null); router.push('/login');
  };

  const contextValue: AuthContextType = { user, loading, login, logout, isAuthenticated: !!user?.isAuthenticated, token: user?.token ?? null, };
  return (<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}