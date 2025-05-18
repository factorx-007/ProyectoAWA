// app/client/page.tsx
import { ProductGrid } from '@/components/client/products/ProductGrid';
import { ServiceCarousel } from '@/components/client/service/ServiceCarousel';
import { PromoBanner } from '@/components/client/products/PromoBanner';

const featuredProducts = [
  {
    id: 1,
    name: 'Producto Destacado 1',
    price: 99.99,
    image: '/images/product1.jpg',
    rating: 4.5,
  },
  // ... más productos
];

const featuredServices = [
  {
    id: 1,
    name: 'Servicio Premium',
    price: 149.99,
    image: '/images/service1.jpg',
    rating: 5,
    description: 'Un servicio premium diseñado para satisfacer todas tus necesidades.',
  },
  // ... más servicios
];

export default function ClientHomePage() {
  return (
    <div className="space-y-12">
      {/* Banner promocional */}
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
        <ProductGrid products={featuredProducts} />
        <div className="mt-6 text-center">
          <a 
            href="/products" 
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todos los productos
          </a>
        </div>
      </section>

      {/* Servicios destacados */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Servicios Destacados</h2>
        <ServiceCarousel services={featuredServices} />
        <div className="mt-6 text-center">
          <a 
            href="/services" 
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Explorar servicios
          </a>
        </div>
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