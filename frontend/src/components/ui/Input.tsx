import React from 'react';
import { InputHTMLAttributes } from 'react';

export const Input = ({ ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);
