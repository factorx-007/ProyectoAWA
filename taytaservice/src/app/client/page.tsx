// app/client/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { ProductoService } from '@/features/productos/services/ProductoService';
import { ProductGrid } from '@/components/client/products/ProductGrid';
import { ServiceCarousel } from '@/components/client/service/ServiceCarousel';
import { PromoBanner } from '@/components/client/products/PromoBanner';
import axios from 'axios';
import { BasicUser } from '@/types';

const getToken = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth-token') || '';
  }
  return '';
};

const headers = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export default function ClientHomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items, categoriasData] = await Promise.all([
          ProductoService.getProductosCompletos(),
          ProductoService.getCategorias()
        ]);

        setCategorias(categoriasData as any[]);

        // Obtener información de vendedores
        const vendedoresIds = [...new Set(items.map(item => item.id_vendedor))];
        const vendedoresPromises = vendedoresIds.map(id => 
          axios.get<BasicUser>(`/api/usuarios/${id}`, headers()).then(res => res.data)
        );
        const vendedores = await Promise.all(vendedoresPromises);

        // Función para obtener información del vendedor
        const getVendedorInfo = (idVendedor: number) => {
          const vendedor = vendedores.find(v => v.id_usuario === idVendedor);
          return vendedor ? {
            id_usuario: vendedor.id_usuario,
            nombres: vendedor.nombres,
            apellidos: vendedor.apellidos,
            url_img: vendedor.url_img
          } : null;
        };

        // Separar y formatear productos
        const productos = items
          .filter(item => !item.es_servicio)
          .slice(0, 6)
          .map(producto => ({
            id: producto.id_item,
            name: producto.nombre,
            price: producto.precio,
            image: producto.image || '/images/default-product.jpg',
            rating: producto.rating || 4,
            stock: producto.stock || 0,
            estado: producto.estado || 'A',
            categoria: (categoriasData as { id_categoria: number; nombre: string }[])
              .find(cat => cat.id_categoria === producto.id_categoria)?.nombre || 'Sin categoría',
            vendedor: getVendedorInfo(producto.id_vendedor),
            fecha: new Date(producto.fecha_y_hora).toLocaleDateString()
          }));

        // Separar y formatear servicios
        const servicios = items
          .filter(item => item.es_servicio)
          .slice(0, 4)
          .map(servicio => ({
            id: servicio.id_item,
            name: servicio.nombre,
            price: servicio.precio,
            image: servicio.image || '/images/default-service.jpg',
            rating: servicio.rating || 5,
            description: servicio.descripcion || 'Servicio profesional',
            estado: servicio.estado || 'A',
            categoria: (categoriasData as { id_categoria: number; nombre: string }[])
              .find(cat => cat.id_categoria === servicio.id_categoria)?.nombre || 'Sin categoría',
            vendedor: getVendedorInfo(servicio.id_vendedor),
            fecha: new Date(servicio.fecha_y_hora).toLocaleDateString()
          }));

        setFeaturedProducts(productos);
        setFeaturedServices(servicios);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <PromoBanner 
        title="Ofertas Especiales"
        subtitle="Hasta 50% de descuento"
        image="/images/banner1.jpg"
        ctaText="Comprar ahora"
        ctaLink="/products"
      />

      {/* Productos destacados */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Productos Populares</h2>
        {featuredProducts.length > 0 ? (
          <>
            <ProductGrid products={featuredProducts.map(p => ({
              ...p,
              categoria: p.categoria,
              vendedor: p.vendedor,
              estado: p.estado === 'A' ? 'Disponible' : 'Agotado'
            }))} />
            <div className="mt-6 text-center">
              <a 
                href="/products" 
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todos los productos
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay productos destacados disponibles
          </div>
        )}
      </section>

      {/* Servicios destacados */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Servicios Destacados</h2>
        {featuredServices.length > 0 ? (
          <>
            <ServiceCarousel services={featuredServices.map(s => ({
              ...s,
              estado: s.estado === 'A' ? 'Disponible' : 'No disponible',
              categoria: s.categoria,
              vendedor: s.vendedor
            }))} />
            <div className="mt-6 text-center">
              <a 
                href="/services" 
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Explorar servicios
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay servicios destacados disponibles
          </div>
        )}
      </section>

      {/* Testimonios */}
      <section className="bg-gray-50 py-12 rounded-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Excelente plataforma, encontré exactamente lo que necesitaba para mi negocio a un precio increíble."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <p className="font-medium">Ana Martínez</p>
                  <p className="text-sm text-gray-500">Dueña de negocio</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}