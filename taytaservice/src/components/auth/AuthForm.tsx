'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { registerSchema, loginSchema } from '../../features/types';
import { RegisterFormData, LoginFormData } from '../../features/types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: RegisterFormData | LoginFormData) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const schema = type === 'register' ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData | LoginFormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {type === 'register' && (
        <>
          <div>
            <Input placeholder="Nombres" {...register('nombres')} />
            {errors.nombres && <p className="text-red-500 text-sm">{String(errors.nombres.message)}</p>}
          </div>
          <div>
            <Input placeholder="Apellidos" {...register('apellidos')} />
            {errors.apellidos && <p className="text-red-500 text-sm">{String(errors.apellidos.message)}</p>}
          </div>
          <div>
            <Input placeholder="DNI" {...register('dni')} />
            {errors.dni && <p className="text-red-500 text-sm">{String(errors.dni.message)}</p>}
          </div>
          <div>
            <Input placeholder="Teléfono" {...register('telefono')} />
            {errors.telefono && <p className="text-red-500 text-sm">{String(errors.telefono.message)}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Foto de perfil</label>
            <input
              type="file"
              accept="image/*"
              {...register('imagen' as const)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.imagen && <p className="text-red-500 text-sm">{String(errors.imagen.message)}</p>}
          </div>

        </>
      )}

      {/* Campos comunes */}
      <div>
        <Input placeholder="Email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
      </div>

      <div>
        <Input type="password" placeholder="Contraseña" {...register('contrasena')} />
        {errors.contrasena && <p className="text-red-500 text-sm">{String(errors.contrasena.message)}</p>}
      </div>

      <Button type="submit">
        {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
      </Button>
    </form>
  );
};
