import React from 'react';
import { ButtonHTMLAttributes } from 'react';

// components/ui/Button.tsx
export const Button = ({ className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => (
  <button
    className={`w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);
