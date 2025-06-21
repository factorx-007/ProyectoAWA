'use client';

import React, { useEffect, useState } from 'react';

interface ImageWithAuthProps {
  imagePath: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export const ImageWithAuth: React.FC<ImageWithAuthProps> = ({ imagePath, alt = '', className = '' }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        
        const token = localStorage.getItem('auth-token');
        if (!token) throw new Error('Token no encontrado');

        const response = await fetch(`${API_BASE_URL}/api/uploads/${imagePath}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener imagen');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImgSrc(url);
      } catch (error) {
        console.error('No se pudo cargar la imagen:', error);
      }
    };

    fetchImage();

    // Limpieza
    return () => {
      if (imgSrc) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [imagePath]);

  if (!imgSrc) {
    return <div className="w-full h-full bg-gray-200 animate-pulse rounded-t-2xl" />;
  }

  return <img src={imgSrc} alt={alt} className={className} />;
};
