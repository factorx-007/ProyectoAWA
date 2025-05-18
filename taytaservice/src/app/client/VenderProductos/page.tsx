// pages/VenderProductos/index.tsx
'use client';
import { useEffect, useState } from 'react';
import { ProductoService } from '@/features/productos/services/ProductoService';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductoCard } from '@/components/client/products/ProductoCard';

export default function VenderProductos() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await ProductoService.getProductos() as any[];
        setProductos(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await ProductoService.deleteProducto(id);
        setProductos(productos.filter(p => p.id_producto !== id));
      } catch (error) {
        console.error('Error deleting producto:', error);
      }
    }
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Productos</h1>
        <Link href="/client/VenderProductos/AgregarProducto">
          <Button>Agregar Producto</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.length > 0 ? (
          productos.map(producto => (
            <ProductoCard 
              key={producto.id_producto} 
              producto={producto} 
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>No tienes productos registrados</p>
        )}
      </div>
    </div>
  );
}