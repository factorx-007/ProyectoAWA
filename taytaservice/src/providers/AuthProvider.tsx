'use client';
import React from 'react';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              // Verificar si los datos del usuario son válidos
              if (userData && userData.id && userData.name && userData.email) {
                setUser(userData);
              } else {
                console.error("Datos de usuario inválidos.");
                localStorage.removeItem('user'); // Limpiar datos corruptos
              }
            } catch (parseError) {
              console.error('Error al parsear el usuario desde localStorage:', parseError);
              localStorage.removeItem('user'); // Limpiar datos corruptos
            }
          }
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    // Verificar que los datos sean válidos antes de almacenarlos
    if (userData && userData.id && userData.name && userData.email) {
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push('/');
    } else {
      console.error("Datos de usuario inválidos al intentar hacer login.");
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
