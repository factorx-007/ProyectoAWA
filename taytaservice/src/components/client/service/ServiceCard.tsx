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
  const [categoryName, setCategoryName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const estadoTexto = service.estado === 'A' ? 'Activo' : 'Inactivo';

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categorias = await ProductoService.getCategorias() as Array<{ id_categoria: number; nombre: string }>;
        const categoria = categorias.find(cat => cat.id_categoria === service.id_categoria);
        setCategoryName(categoria?.nombre || 'Categoría no encontrada');
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryName('Error al cargar categoría');
      }
    };

    const fetchVendor = async () => {
      if (!service.id_vendedor) {
        setVendorName('Vendedor no disponible');
        return;
      }
      
      try {
        const response = await axios.get(`/api/usuarios/${service.id_vendedor}`, headers());
        const data = response.data as { nombre?: string };
        setVendorName(data.nombre || 'Vendedor desconocido');
      } catch (error) {
        console.error('Error fetching vendor:', error);
        setVendorName('Error cargando vendedor');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
    fetchVendor();
  }, [service.id_categoria, service.id_vendedor]);

  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagen destacada */}
        <div className="w-full md:w-1/4 lg:w-1/5 relative aspect-square rounded-xl overflow-hidden">
          <img
            src={imageError || !service.image ? '/default-service.jpg' : service.image}
            alt={service.nombre}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-md text-xs font-semibold">
            {service.es_servicio ? 'SERVICIO' : 'PRODUCTO'}
          </div>
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold text-white ${
            service.estado === 'A' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {estadoTexto}
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl md:text-2xl text-gray-800 mb-1">{service.nombre}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-500">Categoría:</span>
                <span className="text-sm font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {loading ? '...' : categoryName}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">${service.precio.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Fecha: {new Date(service.fecha_y_hora).toLocaleDateString()}</div>
            </div>
          </div>
          
          {/* Detalles expandibles */}
          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Vendedor:</span> 
                  <span className="ml-2 font-medium">
                    {loading ? 'Cargando...' : vendorName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">ID Producto:</span> 
                  <span className="ml-2 font-mono">{service.id_item}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Registrado el:</span> 
                  <span className="ml-2">
                    {new Date(service.fecha_y_hora).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Acciones */}
          <div className="mt-auto pt-4 flex flex-wrap gap-3 justify-between items-center border-t border-gray-100">
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-600 hover:bg-gray-100"
              >
                {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
              </Button>
              
              <Link href={`/client/services/editar/${service.id_item}`}>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  Editar
                </Button>
              </Link>
            </div>
            
            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Contratar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => onDelete(service.id_item)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};