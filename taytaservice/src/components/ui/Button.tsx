import React from 'react';
import { ButtonHTMLAttributes } from 'react';

// components/ui/Button.tsx
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'outline' | 'destructive';
};

export const Button = ({ children, variant, ...props }: ButtonProps) => {
  const variantClass =
    variant === 'outline'
      ? 'border border-gray-500 text-gray-500'
      : variant === 'destructive'
      ? 'bg-red-500 text-white'
      : '';

  return <button className={`px-4 py-2 rounded ${variantClass}`} {...props}>{children}</button>;
};