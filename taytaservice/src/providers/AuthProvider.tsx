"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

// providers/AuthProvider.tsx
import api, { registerLogoutHandler } from "@/features/auth/api";
interface User {
  token: any;
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  const validateUserData = (data: any): data is User => {
    return data?.id && data?.name && data?.email;
  };

  const clearAuth = async () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const logout = async () => {
    await clearAuth();
    router.push("/auth/login");
  };

  // Registrar el manejador de logout en axios
  useEffect(() => {
    registerLogoutHandler(logout);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          if (validateUserData(parsedUser)) {
            setUser(parsedUser);
          } else {
            console.warn("Datos de usuario inválidos, limpiando autenticación");
            await clearAuth();
          }
        }
      } catch (error) {
        console.error("Error inicializando autenticación:", error);
        await clearAuth();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token: string, userData: User) => {
    try {
      // 1. Guarda en almacenamiento local
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // 2. Actualiza el estado
      setUser(userData);
      
      // 3. Espera un ciclo de renderizado
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // 4. Redirige
      router.push('/client');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };
  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
