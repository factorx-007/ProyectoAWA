'use client';

import { AuthForm } from '../../../components/auth/AuthForm';
import { toast } from 'react-hot-toast';
import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginFormData } from '../../../features/types';
import { authService } from '../../../features/auth/services/AuthService';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      const { token, user } = await authService.login(data);

      // Guardar el token (puedes usar cookies o localStorage)
      document.cookie = `token=${token}; path=/; Secure; SameSite=Lax`;
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('¡Bienvenido!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center">Iniciar Sesión</h2>
        <AuthForm type="login" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
