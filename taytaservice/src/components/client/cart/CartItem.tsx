// components/client/CartItem.tsx
'use client';

import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import Image from 'next/image';
import { useState } from 'react';
import { ImageWithAuth } from '@/components/ui/ImageWithAuth';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    url_img?: string;
    es_servicio: boolean;
    id_carrito_producto: number;
  };
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}



export function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleIncrease = () => {
    const newQuantity = Math.min(quantity + 1, item.stock);
    setQuantity(newQuantity);
    onQuantityChange(item.id, newQuantity);
  };

  const handleDecrease = () => {
    const newQuantity = Math.max(quantity - 1, 1);
    setQuantity(newQuantity);
    onQuantityChange(item.id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(String(item.id_carrito_producto));
  };

  

  return (
    <li className="flex py-6 border-b border-gray-200">
      <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md border border-gray-200">
        {item.url_img ? (
          <ImageWithAuth
            imagePath={`item_imgs/${item.url_img}`}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>


      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>{item.name}</h3>
          <p className="ml-4">${(item.price * quantity).toFixed(2)}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} c/u</p>

        <div className="flex flex-1 items-end justify-between text-sm">
          {/* Solo mostrar control de cantidad si NO es servicio */}
          {!item.es_servicio ? (
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className={`px-2 py-1 ${quantity <= 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiMinus className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-gray-700">{quantity}</span>
              <button
                onClick={handleIncrease}
                disabled={quantity >= item.stock}
                className={`px-2 py-1 ${quantity >= item.stock ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiPlus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <span className="text-gray-500 italic">Servicio (cantidad única)</span>
          )}

          <div className="flex">
            <button
              type="button"
              onClick={handleRemove}
              className="font-medium text-red-600 hover:text-red-500 flex items-center"
            >
              <FiTrash2 className="mr-1" />
              Eliminar
            </button>
          </div>
        </div>

      </div>
    </li>
  );
}