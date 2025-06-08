'use client';

import { useState, useEffect } from 'react';
import { ServiceCard } from './ServiceCard';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: number;
  image: string;
  rating?: number;
  description: string;
  estado?: string;
  id_categoria?: number;
  id_vendedor?: number;
  fecha_y_hora?: string;
  categoria?: string;
  vendedor?: string;
}

interface ServiceCarouselProps {
  services: Service[];
  itemsPerView?: number;
  autoPlay?: boolean;
  interval?: number;
}

export function ServiceCarousel({ 
  services = [], 
  itemsPerView = 3, 
  autoPlay = false, 
  interval = 5000 
}: ServiceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (autoPlay && !isHovered && services.length > itemsPerView) {
      intervalId = setInterval(() => {
        nextSlide();
      }, interval);
    }
    
    return () => clearInterval(intervalId);
  }, [autoPlay, isHovered, services.length, interval, itemsPerView]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + services.length) % services.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getVisibleServices = () => {
    const visible = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % services.length;
      visible.push(services[index]);
    }
    return visible;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(itemsPerView)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay servicios disponibles</p>
      </div>
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getVisibleServices().map((service) => (
          <ServiceCard
            key={`${service.id}-${currentIndex}`}
            service={{
              id_item: service.id,
              nombre: service.name,
              precio: service.price,
              es_servicio: true,
              estado: service.estado || 'A',
              id_categoria: service.id_categoria || 1,
              id_vendedor: service.id_vendedor || 1,
              fecha_y_hora: service.fecha_y_hora || new Date().toISOString(),
              image: service.image,
              categoria: service.categoria,
              vendedor: service.vendedor,
              description: service.description,
              rating: service.rating
            }}
            onDelete={() => {}}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {services.length > itemsPerView && (
        <>
          <Button
            variant="outline"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md bg-white hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </Button>
          <Button
            variant="outline"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md bg-white hover:bg-gray-100"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </Button>
        </>
      )}

      {/* Pagination indicators */}
      {services.length > itemsPerView && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(services.length / itemsPerView) }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i * itemsPerView)}
              className={`h-2 w-2 rounded-full transition-all ${currentIndex >= i * itemsPerView && currentIndex < (i + 1) * itemsPerView ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}