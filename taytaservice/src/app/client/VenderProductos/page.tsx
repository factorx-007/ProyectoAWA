'use client';
import { useEffect, useState } from 'react';
import { ProductoService } from '@/features/productos/services/ProductoService';
import ProductoCard from '@/components/client/products/ProductoCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus } from 'lucide-react';

export default function VenderProductos() {
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOption, setSortOption] = useState('featured');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [productosData, categoriasDataRaw] = await Promise.all([
          ProductoService.getProductosCompletos(),
          ProductoService.getCategorias()
        ]);
        const categoriasData = categoriasDataRaw as any[];
        
        const productosConCategoria = productosData.map((producto: any) => ({
          ...producto,
          categoryName: categoriasData.find((cat: any) => 
            cat.id_categoria === producto.id_categoria
          )?.nombre || 'Sin categoría'
        }));

        setProductos(productosConCategoria);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const filteredProducts = productos
    .filter(producto => 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || producto.id_categoria.toString() === selectedCategory) &&
      (producto.precio >= priceRange[0] && producto.precio <= priceRange[1])
    )
    .sort((a, b) => {
      if (sortOption === 'price-low') return a.precio - b.precio;
      if (sortOption === 'price-high') return b.precio - a.precio;
      return 0;
    });

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await ProductoService.deleteProducto(id);
        setProductos(productos.filter(p => p.id_producto !== id));
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Productos</h1>
          <p className="text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} registrados
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              className="pl-10 pr-4 py-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="featured">Destacados</option>
            <option value="price-low">Precio: Menor a Mayor</option>
            <option value="price-high">Precio: Mayor a Menor</option>
          </select>

          <Link href="/client/VenderProductos/AgregarProducto" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Categorías</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="all">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rango de precios</label>
            <div className="mt-1 flex gap-2">
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-1/2"
              />
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-1/2"
              />
            </div>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(producto => (
            <ProductoCard 
              key={producto.id_producto} 
              producto={{
                ...producto,
                categoria: producto.categoryName
              }} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
          <div className="text-center max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron resultados' : 'No tienes productos registrados'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Intenta con otro término de búsqueda' 
                : 'Comienza agregando tu primer producto'}
            </p>
            <Link href="/client/VenderProductos/AgregarProducto">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}