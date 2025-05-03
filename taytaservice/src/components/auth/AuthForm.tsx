'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import React from 'react';
import { loginSchema, registerSchema } from '../../features/types';
import { LoginFormData, RegisterFormData } from '../../features/types';

type AuthFormProps = {
  type: 'login' | 'register';
  onSubmit: (data: RegisterFormData) => void;
};

export const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
  const schema = type === 'login' ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const renderFormFields = () => {
    if (type === 'register') {
      return (
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
            <Input placeholder="URL de imagen (opcional)" {...register('url_img')} />
            {errors.url_img && <p className="text-red-500 text-sm">{String(errors.url_img.message)}</p>}
          </div>
        </>
      );
    }

    // Aquí podrías agregar campos para login en el futuro
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {renderFormFields()}
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