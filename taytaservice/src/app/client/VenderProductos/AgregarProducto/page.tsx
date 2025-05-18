'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ProductoForm } from '@/components/client/products/ProductoForm';

export default function AgregarProducto() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Crear el Item
      const itemResponse = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: data.nombre,
          precio: parseFloat(data.precio),
          es_servicio: data.es_servicio,
          estado: data.estado,
          id_categoria: parseInt(data.id_categoria),
          id_vendedor: parseInt(data.id_vendedor),
        })
      });

      if (!itemResponse.ok) throw new Error('Error al crear el item');

      const item = await itemResponse.json();

      // Crear el Producto con el id del Item creado
      const productoResponse = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_producto: item.id_item,
          stock: parseInt(data.stock)
        })
      });

      if (!productoResponse.ok) throw new Error('Error al crear el producto');

      toast.success('Producto creado exitosamente');
      router.push('/VenderProductos');
    } catch (error) {
      toast.error('Ocurrió un error al crear el producto');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Producto</h1>
      <ProductoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
