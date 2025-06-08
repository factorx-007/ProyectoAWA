
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2 } from "lucide-react";
import { authFetch } from "@/utils/authFetch";  
// Define la interfaz para un producto según tu modelo
export interface Producto {
  id_item: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: string;
  fecha_y_hora: string;
  id_categoria: number;
  id_vendedor: number;
  categoria_nombre?: string;
  vendedor_nombre?: string;
}

interface ProductsTableProps {
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ onEdit, onDelete }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/items?es_servicio=false");
      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudieron cargar los productos`);
      }
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No se pudieron cargar los productos. Intenta recargar la página.");
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading) return <div className="text-gray-400 p-4">Cargando productos...</div>;
  if (error) return <div className="text-red-400 p-4">{error}</div>;
  if (!productos.length) return <div className="text-gray-400 p-4">No hay productos registrados.</div>;

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-yellow-700/10">
      <h2 className="text-lg font-semibold mb-4 text-yellow-400">Productos</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="pb-2">ID</th>
            <th className="pb-2">Nombre</th>
            <th className="pb-2">Descripción</th>
            <th className="pb-2">Precio</th>
            <th className="pb-2">Stock</th>
            <th className="pb-2">Estado</th>
            <th className="pb-2">Categoría</th>
            <th className="pb-2">Vendedor</th>
            <th className="pb-2">Fecha</th>
            <th className="pb-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id_item} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
              <td className="py-2">{prod.id_item}</td>
              <td>{prod.nombre}</td>
              <td>{prod.descripcion}</td>
              <td>{prod.precio}</td>
              <td>{prod.stock}</td>
              <td>{prod.estado}</td>
              <td>{prod.categoria_nombre || prod.id_categoria}</td>
              <td>{prod.vendedor_nombre || prod.id_vendedor}</td>
              <td>{prod.fecha_y_hora ? new Date(prod.fecha_y_hora).toLocaleString() : ""}</td>
              <td>
                <Button variant="outline" onClick={() => onEdit(prod)} className="mr-2">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" onClick={() => onDelete(prod.id_item)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
