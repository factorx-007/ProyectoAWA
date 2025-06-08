'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ProductoService } from '@/features/productos/services/ProductoService';
import { Button } from '../../ui/Button';

interface ServiceCardProps {
  service: {
    id_item: number;
    nombre: string;
    precio: number;
    es_servicio: boolean;
    estado: string;
    id_categoria: number;
    id_vendedor: number;
    fecha_y_hora: string;
    image?: string;
    categoria?: string;
    vendedor?: string;
    description?: string;
    rating?: number;
  };
  onDelete: (id: number) => void;
}

const getToken = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth-token') || '';
  }
  return '';
};

const headers = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const ServiceCard = ({ service, onDelete }: ServiceCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const estadoTexto = service.estado === 'A' ? 'Activo' : 'Inactivo';

  return (
    <div className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Etiquetas de estado y tipo */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-md backdrop-blur-sm
          ${service.estado === 'A' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {estadoTexto}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm">
          SERVICIO
        </span>
      </div>
      {/* Imagen del servicio */}
      <div className="relative h-48 md:h-56 overflow-hidden flex items-center justify-center bg-gradient-to-t from-gray-200 to-white dark:from-gray-800 dark:to-gray-900">
        <img
          src={imageError || !service.image ? '/default-service.jpg' : service.image}
          alt={service.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
          onError={() => setImageError(true)}
        />
      </div>
      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate" title={service.nombre}>
          {service.nombre}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">
            ${service.precio.toFixed(2)}
          </span>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
            <span className="inline-block w-2 h-2 rounded-full mr-2 bg-green-500" />
            {service.categoria || 'Sin categoría'}
          </div>
        </div>
        <div className="mb-4 text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
          {service.description || 'Servicio profesional'}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Vendedor:</span>
            <span className="truncate">{service.vendedor || 'Vendedor desconocido'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Fecha:</span>
            <span>{new Date(service.fecha_y_hora).toLocaleDateString()}</span>
          </div>
        </div>
        {/* Acciones */}
        <div className="mt-auto flex gap-2">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 border-blue-500 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
          </Button>
          <Link href={`/client/services/editar/${service.id_item}`} className="flex-1">
            <Button variant="outline" className="w-full flex items-center gap-2 border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20">
              Editar
            </Button>
          </Link>
          <Button
            className="flex-1 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            Contratar
          </Button>
          <Button
            variant="destructive"
            className="flex-1 flex items-center gap-2"
            onClick={() => onDelete(service.id_item)}
          >
            Eliminar
          </Button>
        </div>
        {/* Detalles expandibles */}
        {showDetails && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-fadeIn text-xs text-gray-700 dark:text-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">ID Servicio:</span> <span className="ml-2 font-mono">{service.id_item}</span>
              </div>
              <div>
                <span className="font-medium">Registrado el:</span> <span className="ml-2">{new Date(service.fecha_y_hora).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};