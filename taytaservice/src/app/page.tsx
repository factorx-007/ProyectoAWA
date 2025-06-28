"use client";
import { useEffect, useState } from 'react';
import { ProductoService } from '@/features/productos/services/ProductoService';
import ProductoCard from '@/components/client/products/ProductoCard';
import api from '@/features/auth/api';
import { BasicUser } from '@/types';

export default function Home() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [productosData, categoriasDataRaw, usuariosData] = await Promise.all([
          ProductoService.getProductosCompletos(),
          ProductoService.getCategorias(),
          api.get<BasicUser[]>('/usuarios').then(res => res.data),
        ]);
        const categoriasData = categoriasDataRaw as any[];

        // Filtrar solo productos (es_servicio = false) y formatear
        const productosFormateados = productosData
          .filter((producto: any) => !producto.es_servicio)
          .map((producto: any) => ({
            ...producto,
            categoria: categoriasData.find((cat: any) => cat.id_categoria === producto.id_categoria)?.nombre || 'Sin categoría',
            stock: producto.stock ?? 0,
            vendedor: usuariosData.find((u: BasicUser) => u.id_usuario === producto.id_vendedor) || null,
          }));

        setProductos(productosFormateados);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Productos Destacados</h1>
      
      {productos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map(producto => (
            <ProductoCard 
              key={producto.id_producto} 
              producto={producto} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No hay productos disponibles
        </div>
      )}
    </div>
  );
}
