import React from 'react';
import { ButtonHTMLAttributes } from 'react';

export const Button = ({ ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    {...props}
  />
);