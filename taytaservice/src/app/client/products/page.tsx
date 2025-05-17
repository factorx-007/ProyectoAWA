// app/client/products/page.tsx
'use client';

import { ProductFilter } from '@/components/client/products/ProductFilter';
import { ProductGrid } from '@/components/client/products/ProductGrid';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Producto Premium',
    price: 199.99,
    image: '/images/product1.jpg',
    rating: 4.5,
    category: 'Electrónica',
    inStock: true,
  },
  // ... más productos
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOption, setSortOption] = useState('featured');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    return 0; // featured - no sort
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuestros Productos</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Ordenar por:</span>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="featured">Destacados</option>
            <option value="price-low">Precio: menor a mayor</option>
            <option value="price-high">Precio: mayor a menor</option>
            <option value="rating">Mejor valorados</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange} categories={[]}          />
        </div>
        <div className="lg:col-span-3">
          {sortedProducts.length > 0 ? (
            <ProductGrid products={sortedProducts} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No se encontraron productos</h3>
              <p className="mt-2 text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}   