// components/client/ProductCard.tsx
'use client';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    rating: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/client/products/${product.id}`}>
        <div className="relative aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.floor(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <button
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Lógica para añadir al carrito
              }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}