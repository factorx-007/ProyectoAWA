// components/AuthProvider.tsx
'use client';

import { User } from "@/features/types";
import router from "next/router";
import { ReactNode } from "react";

// ... imports ...

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ... estados ...

  const login = (token: string, userData: User) => {
    try {
      // Validación robusta
      if (!token || !userData?.id) {
        throw new Error('Datos de autenticación inválidos');
      }

      // Guardar en localStorage (con verificación SSR)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Verificación inmediata
        const storedToken = localStorage.getItem('auth-token');
        if (storedToken !== token) {
          throw new Error('Error al guardar el token');
        }
      }

      setUser(userData);
      router.push('/');
      
    } catch (error) {
      console.error('Error en login:', error);
      // Limpiar en caso de error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
      }
      setUser(null);
      throw error; // Re-lanzar para manejo en UI
    }
  };

};

function setUser(userData: User | null) {
    throw new Error("Function not implemented.");
}
