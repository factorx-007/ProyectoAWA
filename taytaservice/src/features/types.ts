import { string, z } from 'zod';

// features/types.ts

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  contrasena: z.string().min(6, 'Mínimo 6 caracteres'),
});


// En tus schemas (features/types.ts)
export const registerSchema = z.object({
  nombres: z.string().min(3, 'Mínimo 3 caracteres'),
  apellidos: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  dni: z.string().min(8, 'DNI inválido'),
  contrasena: z.string().min(6, 'Mínimo 6 caracteres'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  url_img: z.string().url('URL inválida').optional()
});


export interface Producto {
  id_categoria: number;
  id_vendedor: number;
  nombre: string;
  precio: number;
  es_servicio: boolean;
  estado: string;
  fecha_y_hora?: Date;
  stock: number;
}


export type LoginFormData = z.infer<typeof loginSchema>;{
  email: string;
  contrasena: string;
}
export type RegisterFormData = z.infer<typeof registerSchema>;{
  nombres: string;
  apellidos: string;
  email: string;
  dni: string;
  contrasena: string;
  telefono: string;
  url_img: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin'; // Opcional: para manejar roles
};

export type AuthContextType = {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};