'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Package, Tag, User, Star, Trash2, Edit } from 'lucide-react';
interface ProductoCardProps {
  producto?: {
    id_producto: number;
    nombre: string;
    precio: number;
    estado?: string; // Hacer opcional
    stock?: number; // Hacer opcional
    image?: string;
    categoria?: string;
    imagen_url?: string;
    rating?: number;
    id_vendedor?: number;
  };
  onDelete?: (id: number) => void;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto, onDelete }) => {
  // Manejar caso cuando producto es undefined
  if (!producto) {
    return (
      <div className="border rounded-lg p-4 shadow-sm bg-gray-100 animate-pulse h-64">
        {/* Placeholder mientras carga */}
      </div>
    );
  }

  const estadoTexto = producto.estado === 'A' ? 'Disponible' : 'Agotado';
  const stockStatus = producto.stock && producto.stock > 0 ? 'En stock' : 'Sin stock';

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          producto.estado === 'A' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {estadoTexto}
        </span>
        {producto.precio > 100 && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            ¡Oferta!
          </span>
        )}
      </div>

      <div className="flex flex-col h-full">
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img
            src={producto.imagen_url || '/default-product.jpg'}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {producto.nombre}
          </h3>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ${producto.precio.toFixed(2)}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              {producto.rating || 4.5}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div className="flex items-center">
              <Tag className="w-5 h-5 text-gray-500 mr-2" />
              <span>{producto.categoria}</span>
            </div>
            <div className="flex items-center">
              <Package className="w-5 h-5 text-gray-500 mr-2" />
              <span className={producto.stock && producto.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {stockStatus}
              </span>
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-500 mr-2" />
              <span>Vendedor #{producto.id_vendedor}</span>
            </div>
          </div>

          <div className="mt-auto flex gap-2">
            <Link
              href={`/client/VenderProductos/EditarProducto/${producto.id_producto}`}
              className="flex-1"
            >
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="flex-1 flex items-center gap-2"
              onClick={() => onDelete && onDelete(producto.id_producto)}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;