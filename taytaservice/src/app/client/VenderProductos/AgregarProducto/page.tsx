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

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('auth-token');
      if (!token || !user?.id) {
        throw new Error('Usuario no autenticado');
      }

      // 1) Subir la imagen al servidor
      if (!formData.imagen || formData.imagen.length === 0) {
        throw new Error('Debes seleccionar una imagen.');
      }
      const uploadData = new FormData();
      uploadData.append('carpeta', 'item_imgs');
      uploadData.append('imagen', formData.imagen[0]);

      const uploadRes = await fetch('/api/upload-img', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.message || 'Error al subir la imagen');
      }

      const { nombreArchivo } = await uploadRes.json();

      // 2) Preparar datos del ítem incluyendo la URL de la imagen
      const itemData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion || 'Sin descripción',
        precio: parseFloat(formData.precio),
        id_categoria: parseInt(formData.id_categoria),
        id_vendedor: user.id,
        es_servicio: formData.es_servicio || false,
        estado: 'A',
        fecha_y_hora: new Date().toISOString(),
        url_img: nombreArchivo,      // <-- inyectamos aquí el nombre de archivo
      };

      // 3) Crear el ítem (producto o servicio)
      const itemResponse = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });

      if (!itemResponse.ok) {
        const errorData = await itemResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear el ítem');
      }

      const item = await itemResponse.json();

      // 4) Si es producto, registrar stock
      if (!formData.es_servicio) {
        const stock = parseInt(formData.stock) || 0;
        const productoData = {
          id_producto: item.id_item,
          stock: stock >= 0 ? stock : 0
        };

        const productoResponse = await fetch('/api/productos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productoData)
        });

        if (!productoResponse.ok) {
          const errorData = await productoResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Error al registrar el producto');
        }
      }

      // 5) Éxito
      toast.success(formData.es_servicio
        ? '¡Servicio creado exitosamente!'
        : '¡Producto creado exitosamente!'
      );
      router.push('/client/VenderProductos');

    } catch (error: any) {
      console.error('Error en el formulario:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar la solicitud');
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