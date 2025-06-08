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
    vendedor?: string;
  };
  onDelete?: (id: number) => void;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto, onDelete }) => {
  // Manejar caso cuando producto es undefined
  if (!producto) {
    return (
      <div className="border rounded-xl p-4 shadow-md bg-gray-100 animate-pulse h-72" />
    );
  }

  const estadoTexto = producto.estado === 'A' ? 'Disponible' : 'Agotado';
  const stockStatus = producto.stock && producto.stock > 0 ? 'En stock' : 'Sin stock';

  return (
    <div className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Etiquetas de estado y oferta */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-md backdrop-blur-sm
          ${producto.estado === 'A' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {estadoTexto}
        </span>
        {producto.precio > 100 && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm">
            ¡Oferta!
          </span>
        )}
      </div>

      {/* Imagen del producto */}
      <div className="relative h-48 md:h-56 overflow-hidden flex items-center justify-center bg-gradient-to-t from-gray-200 to-white dark:from-gray-800 dark:to-gray-900">
        <img
          src={producto.imagen_url || producto.image || '/default-product.jpg'}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
        />
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate" title={producto.nombre}>
          {producto.nombre}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">
            ${producto.precio.toFixed(2)}
          </span>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            {producto.rating || 4.5}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Tag className="w-5 h-5 text-gray-400 mr-1" />
            <span className="truncate">{producto.categoria}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-5 h-5 text-gray-400 mr-1" />
            <span className={producto.stock && producto.stock > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
              {stockStatus}
            </span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <User className="w-5 h-5 text-gray-400 mr-1" />
            <span className="truncate">{producto.vendedor || `Vendedor #${producto.id_vendedor}`}</span>
          </div>
        </div>
        <div className="mt-auto flex gap-2">
          <Link
            href={`/client/VenderProductos/EditarProducto/${producto.id_producto}`}
            className="flex-1"
          >
            <Button variant="outline" className="w-full flex items-center gap-2 border-blue-500 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
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
  );
};

export default ProductoCard;