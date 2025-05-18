"use client";

import { AuthForm } from "../../../components/auth/AuthForm";
import { toast } from "react-hot-toast";
import React from "react";
import { useRouter } from "next/navigation";
import { LoginFormData, User } from "@/features/types";
import { AuthService } from "@/features/auth/services/AuthService";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      const { token, user } = await AuthService.login(data);
      
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Fuerza recarga para asegurar que AuthGuard detecte los cambios
      window.location.href = '/client';
    } catch (error) {
      toast.error('Error al iniciar sesión');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Panel Informativo */}
        <div className="bg-gradient-to-br from-blue-600 to-violet-700 text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">¡Bienvenido (●'◡'●) !</h2>
          <p className="text-sm mb-6">
            Ingresa tus credenciales para acceder a tu cuenta y gestionar tus
            servicios o productos.
          </p>
          <img
            src="/logo.png"
            alt="Accede a tu cuenta"
            className="rounded-lg mt-auto"
          />
        </div>

        {/* Formulario de Login */}
        <div className="p-10 flex flex-col justify-center">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Iniciar Sesión
          </h3>
          <AuthForm type="login" onSubmit={handleSubmit} />
          <p className="text-sm text-center mt-6 text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              onClick={() => router.push("/auth/register")}
              className="text-indigo-600 hover:underline font-medium"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
function login(token: string, user: User) {
  throw new Error("Function not implemented.");
}

