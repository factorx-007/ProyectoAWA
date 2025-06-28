'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Package, Tag, Star, Eye, ShoppingBag } from 'lucide-react';
import { ImageWithAuth } from '@/components/ui/ImageWithAuth';


import { BasicUser } from '@/types';

interface Vendedor extends Omit<BasicUser, 'email' | 'telefono'> {
  email?: string;
  telefono?: string;
}

interface Categoria {
  id_categoria?: number;
  nombre?: string;
  descripcion?: string;
}

interface ProductoCardProps {
  producto: {
    id_item?: number;
    id_producto?: number;
    nombre?: string;
    descripcion?: string;
    precio?: number;
    estado?: 'A' | 'I' | string;
    stock?: number;
    image?: string;
    url_img?: string;
    categoria?: Categoria | string | null;
    rating?: number;
    id_vendedor?: number;
    vendedor?: Vendedor | string | null;
    fecha_creacion?: string;
    fecha_actualizacion?: string;
    es_servicio?: boolean;
  };
  onDelete?: (id: number) => void;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto, onDelete }) => {
  // Manejar caso cuando producto es undefined o tiene datos incompletos
  if (!producto) {
    return (
      <div className="border rounded-xl p-4 shadow-md bg-gray-100 animate-pulse h-72" />
    );
  }

  // Valores por defecto
  const {
    id_item = 0,
    id_producto = 0,
    nombre = 'Producto sin nombre',
    descripcion = 'Sin descripción disponible',
    precio = 0,
    categoria = { nombre: 'Sin categoría' },
    vendedor = null,
    estado = 'I',
    stock = 0,
    rating = 4.5,
    es_servicio = false
  } = producto;

  // Obtener nombre de categoría
  const getCategoriaNombre = () => {
    if (!categoria) return 'Sin categoría';
    if (typeof categoria === 'string') return categoria;
    return categoria.nombre || 'Sin categoría';
  };

  // Obtener nombre del vendedor
  const getVendedorNombre = () => {
    if (!vendedor) return 'Vendedor no disponible';
    if (typeof vendedor === 'string') return vendedor;
    return `${vendedor.nombres || ''} ${vendedor.apellidos || ''}`.trim() || 
           `Vendedor #${vendedor.id_usuario || 'N/A'}`;
  };

  // Obtener imagen del vendedor
  const getVendedorImagen = () => {
    if (!vendedor || typeof vendedor === 'string') return '/avatar.png';
    return vendedor.url_img || '/avatar.png';
  };

  const estadoTexto = estado === 'A' ? 
    (es_servicio ? 'Servicio disponible' : 'Disponible') : 
    (es_servicio ? 'Servicio no disponible' : 'Agotado');
  
  const stockStatus = stock !== undefined && stock >= 0 
    ? `${stock} ${stock === 1 ? 'unidad' : 'unidades'} disponible${stock !== 1 ? 's' : ''}` 
    : 'Stock no disponible';

  return (
    <div className={`group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border overflow-hidden flex flex-col 
      ${es_servicio 
        ? 'bg-gradient-to-br from-green-50 via-green-100 to-green-200 dark:from-green-900 dark:via-green-800 dark:to-green-900 border-green-200 dark:border-green-700' 
        : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700'}`}
    >
      {/* Etiquetas de estado y oferta */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-md backdrop-blur-sm
          ${estado === 'A' 
            ? (es_servicio 
              ? 'bg-green-200 text-green-900' 
              : 'bg-green-100 text-green-800') 
            : (es_servicio 
              ? 'bg-red-200 text-red-900' 
              : 'bg-red-100 text-red-800')}`}
        >
          {estadoTexto}
        </span>
        {precio > 100 && !es_servicio && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm">
            ¡Oferta!
          </span>
        )}
      </div>

      {/* Imagen del producto/servicio */}
      <div className="relative h-48 md:h-56 overflow-hidden flex items-center justify-center bg-gradient-to-t from-gray-200 to-white dark:from-gray-800 dark:to-gray-900">
        <ImageWithAuth
          imagePath={`item_imgs/${producto.url_img || producto.image}`}
          alt={producto.nombre || 'Producto'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
        />
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate" title={producto.nombre || 'Producto'}>
          {producto.nombre || 'Producto'}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">
            ${typeof precio === 'number' ? precio.toFixed(2) : '0.00'}
          </span>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            {typeof rating === 'number' ? rating : 4.5}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Tag className="w-5 h-5 text-gray-400 mr-1" />
            <span className="truncate" title={getCategoriaNombre()}>
              {getCategoriaNombre()}
            </span>
          </div>
          {!es_servicio && (
            <div className="flex items-center gap-1" title={`${stock || 0} unidades en stock`}>
              <Package className="w-5 h-5 text-gray-400 mr-1 flex-shrink-0" />
              <span className={`text-sm ${stock && stock > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {stockStatus}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 col-span-2">
            <div className="flex items-center gap-2">
              <ImageWithAuth
                imagePath={`user_imgs/${producto.vendedor.url_img}`}
                alt={producto.nombre || 'Producto'}
                className="w-5 h-5 rounded-full object-cover border border-gray-200"
              />

              <span className="truncate" title={getVendedorNombre()}>
                {getVendedorNombre()}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-auto flex gap-2">
          <Link href={`/client/${es_servicio ? 'services' : 'products'}/ver/${producto.id_item || producto.id_producto}`} passHref>
            <Button
              variant="blue"
              className="flex-1 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Ver
            </Button>
          </Link>
          <Button
            variant="green"
            className="flex items-center gap-2 px-3 py-2 text-sm"
            onClick={() => onDelete && onDelete(producto.id_item || producto.id_producto || 0)}
          >
            <ShoppingBag className="w-5 h-5 min-w-[20px]" />
            <span>{es_servicio ? 'Contratar' : 'Añadir al carrito'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;