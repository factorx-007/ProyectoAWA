// app/client/orders/page.tsx
'use client';
import { OrderCard } from '@/components/client/orders/OrderCard';
import Link from 'next/link';

const orders = [
  {
    id: 'ORD-12345',
    date: '15 Oct 2023',
    status: 'Completado',
    items: [
      { name: 'Producto Premium', quantity: 1, price: 199.99 },
      { name: 'Servicio Básico', quantity: 2, price: 99.99 },
    ],
    total: 399.97,
    trackingNumber: 'TRK789456123',
  },
  // ... más órdenes
];

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Filtrar por estado</option>
            <option>Completados</option>
            <option>En proceso</option>
            <option>Cancelados</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderCard key={order.id} order={order as any} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">No tienes pedidos recientes</h3>
            <p className="mt-2 text-gray-500">Cuando hagas un pedido, aparecerá aquí</p>
            <Link
              href="/client/products"
              className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Comenzar a comprar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}