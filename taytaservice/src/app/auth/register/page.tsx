"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "../../../components/auth/AuthForm";
import { RegisterFormData } from "../../../features/types";
import { AuthService } from "@/features/auth/services/AuthService";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await AuthService.register(data);
      router.push("/auth/login");
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
          <h2 className="text-3xl font-bold mb-4">¡Bienvenido a TaytaService!</h2>
          <p className="text-sm mb-6">
            Crea tu cuenta y comienza a vender o contratar servicios fácilmente. 
            Conecta con miles de usuarios interesados en lo que ofreces.
          </p>
          <img
            src="/logo.png"
            alt="Venta de productos y servicios"
            className="rounded-lg mt-auto"
          />
        </div>

        {/* Formulario de Registro */}
        <div className="p-10 flex flex-col justify-center">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Crear cuenta
          </h3>
          <AuthForm type="register" onSubmit={handleRegister} />
          <p className="text-sm text-center mt-6 text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-indigo-600 hover:underline font-medium"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
