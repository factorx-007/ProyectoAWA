// app/client/services/page.tsx
'use client';
import { ServiceCard } from "@/components/client/service/ServiceCard";
import { ServiceCategoryFilter } from "@/components/client/service/ServiceCategoryFilter";
import { useState } from "react";

const services = [
  {
    id: 1,
    name: "Diseño Web Profesional",
    description: "Creación de sitios web a medida para tu negocio",
    price: 499,
    rating: 4.8,
    category: "Diseño",
    provider: "Creative Designs",
    deliveryTime: "7 días",
    image: "/path/to/image.jpg", // Add a valid image path
  },
  // ... más servicios
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Encuentra el Servicio Perfecto
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Contrata profesionales calificados para hacer crecer tu negocio
        </p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar servicios..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ServiceCategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No se encontraron servicios
          </h3>
          <p className="mt-2 text-gray-500">
            Intenta con otra categoría o término de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
