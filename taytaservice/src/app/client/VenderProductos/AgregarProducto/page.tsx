'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ProductoForm } from '@/components/client/products/ProductoForm';
import { useAuth } from '@/providers/AuthProvider';

type Categoria = {
  id_categoria: number;
  nombre: string;
};

export default function AgregarProducto() {
  const router = useRouter();
  const { isAuthenticated, initialized, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Verificación de autenticación
  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated || !user?.id) {
      toast.error('Debes iniciar sesión primero');
      router.push('/auth/login');
    } else {
      fetchCategorias();
    }
  }, [isAuthenticated, initialized, user?.id]);

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      
      const response = await fetch('/api/categorias', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      toast.error('Error al cargar categorías');
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('auth-token');
      if (!token || !user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const payload = {
        ...data,
        precio: parseFloat(data.precio),
        id_categoria: parseInt(data.id_categoria),
        id_vendedor: user.id // Usamos el ID del contexto de autenticación
      };

      const itemResponse = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!itemResponse.ok) throw new Error(await itemResponse.text());

      const item = await itemResponse.json();

      if (!data.es_servicio) {
        const productoResponse = await fetch('/api/productos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            id_producto: item.id_item,
            stock: parseInt(data.stock)
          })
        });

        if (!productoResponse.ok) throw new Error(await productoResponse.text());
      }

      toast.success(data.es_servicio ? '¡Servicio creado!' : '¡Producto creado!');
      router.push('/client/VenderProductos');
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialized || !user?.id) {
    return <div className="text-center p-8">Verificando autenticación...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Agregar Nuevo Producto/Servicio</h1>
        <div className="border-t border-gray-200 pt-4">
          <ProductoForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            categorias={categorias} 
          />
        </div>
      </div>
    </div>
  );
}