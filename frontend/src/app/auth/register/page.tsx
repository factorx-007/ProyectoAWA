'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '../../../components/auth/AuthForm';
import { RegisterFormData } from '../../../features/types';
import { authService } from '../../../features/auth/services/AuthService';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await authService.register(data);
      router.push('/auth/login'); // Redirige al login tras registro exitoso
    } catch (error: any) {
      console.error('Error al registrar:', error?.message || error);
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}
