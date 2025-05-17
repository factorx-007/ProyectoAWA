// components/Producto/ProductoCard.tsx
'use client';
import Link from 'next/link';
import { Button } from '../../ui/Button';

type ProductoCardProps = {
  producto: any;
  onDelete: (id: number) => void;
};

export const ProductoCard = ({ producto, onDelete }: ProductoCardProps) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-lg">Producto #{producto.id_producto}</h3>
      <p className="text-gray-600">Stock: {producto.stock}</p>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Link href={`/VenderProductos/EditarProducto/${producto.id_producto}`}>
          <Button variant="outline">Editar</Button>
        </Link>
        <Button 
          variant="destructive" 
          onClick={() => onDelete(producto.id_producto)}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};