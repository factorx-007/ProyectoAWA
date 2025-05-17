// components/client/ProductGrid.tsx
import { ProductCard } from './ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}