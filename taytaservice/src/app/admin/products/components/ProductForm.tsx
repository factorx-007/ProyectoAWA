"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Producto } from "./ProductsTable";
import { authFetch } from "@/utils/authFetch";
  
interface Categoria {
  id_categoria: number;
  nombre: string;
}
interface Vendedor {
  id_usuario: number;
  nombres: string;
}   

interface ProductFormProps {
  initialData?: Producto | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Partial<Producto>>({
    defaultValues: initialData || { estado: "A" }
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  useEffect(() => {
    reset(initialData || { estado: "A" });
  }, [initialData, reset]);

  const fetchData = async () => {
    try {
      // Obtener categorías
      const catRes = await authFetch("/api/categorias");
      if (!catRes.ok) throw new Error("Error al cargar categorías");
      const catData = await catRes.json();
      setCategorias(Array.isArray(catData) ? catData : catData.data || []);

      // Obtener vendedores
      const vendRes = await authFetch("/api/usuarios");
      if (!vendRes.ok) throw new Error("Error al cargar vendedores");
      const vendData = await vendRes.json();
      setVendedores(Array.isArray(vendData) ? vendData : vendData.data || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      // Mostrar mensaje de error al usuario
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (values: Partial<Producto>) => {
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/items/${initialData.id_item}` : "/api/items";
    // Siempre enviar es_servicio = false para productos
    const body = { ...values, es_servicio: false };

const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      onSuccess();
      reset();
    } else {
      alert("Error al guardar el producto");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-900 rounded-xl p-6 shadow-lg border border-yellow-700/10 grid grid-cols-1 gap-4">
      <h2 className="text-lg font-semibold text-yellow-400 mb-2">{initialData ? "Editar" : "Crear"} Producto</h2>
      <input className="p-2 rounded bg-gray-800 text-gray-200" placeholder="Nombre" {...register("nombre", { required: true })} />
      <textarea className="p-2 rounded bg-gray-800 text-gray-200" placeholder="Descripción" {...register("descripcion", { required: true })} />
      <input className="p-2 rounded bg-gray-800 text-gray-200" type="number" placeholder="Precio" {...register("precio", { required: true, valueAsNumber: true })} />
      <input className="p-2 rounded bg-gray-800 text-gray-200" type="number" placeholder="Stock" {...register("stock", { required: true, valueAsNumber: true })} />
      <select className="p-2 rounded bg-gray-800 text-gray-200" {...register("id_categoria", { required: true })}>
        <option value="">Selecciona categoría</option>
        {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
      </select>
      <select className="p-2 rounded bg-gray-800 text-gray-200" {...register("id_vendedor", { required: true })}>
        <option value="">Selecciona vendedor</option>
        {vendedores.map(u => <option key={u.id_usuario} value={u.id_usuario}>{u.nombres}</option>)}
      </select>
      <select className="p-2 rounded bg-gray-800 text-gray-200" {...register("estado", { required: true })}>
        <option value="A">Activo</option>
        <option value="I">Inactivo</option>
      </select>
      <div className="flex gap-2 mt-2">
        <Button type="submit" disabled={isSubmitting}>{initialData ? "Guardar Cambios" : "Crear Producto"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
      {errors.nombre && <span className="text-red-400">El nombre es obligatorio</span>}
      {errors.precio && <span className="text-red-400">El precio es obligatorio</span>}
      {errors.stock && <span className="text-red-400">El stock es obligatorio</span>}
      {errors.id_categoria && <span className="text-red-400">La categoría es obligatoria</span>}
      {errors.id_vendedor && <span className="text-red-400">El vendedor es obligatorio</span>}
    </form>
  );
};
