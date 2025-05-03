"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "../../../components/auth/AuthForm";
import { RegisterFormData } from "../../../features/types";
import { authService } from "../../../features/auth/services/AuthService";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await authService.register(data);
      router.push("/auth/login"); // Redirige al login tras registro exitoso
    } catch (error: any) {
      console.error("Error al registrar:", error?.message || error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Panel Informativo */}
        <div className="bg-gradient-to-br from-blue-600 to-violet-700 text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">¡Bienvenido a VendeFácil!</h2>
          <p className="text-sm mb-6">
            Crea tu cuenta y comienza a vender o contratar servicios de manera
            sencilla. Nuestra plataforma conecta a miles de usuarios en búsqueda
            de productos y servicios como el tuyo.
          </p>
          <img
            src="/logo.png"
            alt="Venta de productos y servicios"
            className="rounded-lg mt-auto"
          />
        </div>

        {/* Formulario de Registro */}
        <div className="p-10">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Crear cuenta
          </h3>
          <AuthForm type="register" onSubmit={handleRegister} />
        </div>
      </motion.div>
    </main>
  );
}
