// pages/VenderProductos/EditarProducto/[id].tsx
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProductoService } from '@/features/productos/services/ProductoService';
import { ProductoForm } from '@/components/client/products/ProductoForm';
import { toast } from 'react-hot-toast';

export default function EditarProducto() {
  const { id } = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await ProductoService.getProductos() as { id_producto: number }[];
        const productoEncontrado = data.find((p) => p.id_producto === Number(id));
        setProducto(productoEncontrado);
      } catch (error) {
        console.error('Error fetching producto:', error);
      }
    };

    fetchProducto();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await ProductoService.updateProducto(Number(id), data);
      toast.success('Producto actualizado exitosamente');
      router.push('/VenderProductos');
    } catch (error) {
      toast.error('Error al actualizar el producto');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!producto) return <div>Cargando producto...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>
      <ProductoForm 
        onSubmit={handleSubmit} 
        initialData={producto} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}