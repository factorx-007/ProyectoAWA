// src/components/client/products/ProductGrid.tsx
import ProductoCard from './ProductoCard';
import { BasicUser } from '@/types';

interface ProductGridProps {
  products: Array<{
    id: number;
    name: string;
    price: number;
    image?: string;
    estado?: string;
    stock?: number;
    categoria?: string;
    vendedor?: BasicUser | null;
  }>;
  onDelete?: (id: number) => void;
}

export const ProductGrid = ({ products, onDelete }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductoCard
          key={product.id}
          producto={{
            id_producto: product.id,
            nombre: product.name,
            precio: product.price,
            image: product.image,
            estado: product.estado,
            stock: product.stock,
            categoria: product.categoria,
            vendedor: product.vendedor
          }}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};