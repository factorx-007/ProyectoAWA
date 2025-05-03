import React from 'react';
import { InputHTMLAttributes } from 'react';

// components/ui/Input.tsx
export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
  <input
    className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);
