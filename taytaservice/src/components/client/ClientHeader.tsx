// components/client/ClientHeader.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiShoppingCart, FiUser, FiSearch, FiMenu } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';

export function ClientHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '/client' },
    { name: 'Productos', href: '/client/products' },
    { name: 'Servicios', href: '/client/services' },
    { name: 'Contacto', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <Link href="/client" className="text-2xl font-bold text-blue-600">
            Tienda<span className="text-green-600">Plus</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar productos o servicios..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <nav className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium ${
                    pathname === link.href ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/client/cart" className="p-2 text-gray-600 hover:text-blue-600 relative">
              <FiShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <FiUser className="h-6 w-6" />
                  <span className="hidden md:inline">Mi cuenta</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link href="/client/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Perfil
                  </Link>
                  <Link href="/client/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mis pedidos
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Iniciar sesión
              </Link>
            )}

            <button 
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}