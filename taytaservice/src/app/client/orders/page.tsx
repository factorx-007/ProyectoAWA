'use client';
import { useEffect, useState } from 'react';
import { OrderCard } from '@/components/client/orders/OrderCard';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('auth-token');
        // 1. Obtener carritos con estado 'V'
        const res = await fetch(`${API_BASE_URL}/api/carritos/buscar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            campo: 'id_usuario',
            valor: user.id.toString()
          })
        });
        const carritos = await res.json();
        const ordenes = Array.isArray(carritos)
          ? carritos.filter((c: any) => c.estado === 'V')
          : [];

        // 2. Para cada carrito, obtener productos y detalles
        const ordersData = await Promise.all(
          ordenes.map(async (carrito: any) => {
            // Productos del carrito
            const productosRes = await fetch(`${API_BASE_URL}/api/carritos-productos/buscar`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                campo: 'id_carrito',
                valor: carrito.id_carrito.toString()
              })
            });
            const productos = await productosRes.json();

            // Detalles de cada producto
            const items = await Promise.all(
              productos.map(async (prod: any) => {
                const itemRes = await fetch(`${API_BASE_URL}/api/items/buscar`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    campo: 'id_item',
                    valor: prod.id_item.toString()
                  })
                });
                const [item] = await itemRes.json();
                return {
                  name: item.nombre,
                  quantity: prod.cantidad,
                  price: item.precio
                };
              })
            );

            // Calcular total
            const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

            return {
              id: `ORD-${carrito.id_carrito}`,
              date: carrito.fecha_compra
                ? new Date(carrito.fecha_compra).toLocaleDateString()
                : '',
              status: 'Completado',
              items,
              total,
              trackingNumber: carrito.id_carrito // o algún campo de tracking si tienes
            };
          })
        );

        setOrders(ordersData);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">Cargando pedidos...</div>
        ) : orders.length > 0 ? (
          orders.map(order => (
            <OrderCard key={order.id} order={order} />
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