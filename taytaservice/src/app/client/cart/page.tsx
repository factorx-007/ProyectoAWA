'use client';

import { useState } from 'react';
import { CartItem } from '@/components/client/cart/CartItem';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartProduct[]>([
    {
      id: 1,
      name: 'Producto Premium',
      price: 199.99,
      image: '/images/product1.jpg',
      quantity: 2,
    },
    {
      id: 2,
      name: 'Servicio de Diseño',
      price: 499,
      image: '/images/service1.jpg',
      quantity: 1,
    },
  ]);

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 49.99;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link href="/client" className="flex items-center text-blue-600 hover:text-blue-800">
          <FiArrowLeft className="mr-1" />
          Continuar comprando
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tu Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Tu carrito está vacío</h3>
              <p className="mt-2 text-gray-500">Agrega productos o servicios para comenzar</p>
              <Link
                href="/client/products"
                className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Explorar productos
              </Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen del Pedido</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Proceder al pago
              </button>
            </div>

            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">¿Tienes un código de descuento?</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Ingresa código"
                  className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button className="bg-gray-200 px-4 py-2 rounded-r-md hover:bg-gray-300">Aplicar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
