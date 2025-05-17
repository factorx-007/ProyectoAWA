'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type ProductoFormProps = {
  onSubmit: (data: any) => void;
  initialData?: any;
  isSubmitting: boolean;
};

export const ProductoForm = ({ onSubmit, initialData, isSubmitting }: ProductoFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      nombre: '',
      precio: '',
      es_servicio: false,
      estado: 'A',
      id_categoria: '',
      id_vendedor: '',
      stock: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <Input {...register('nombre', { required: 'Nombre requerido' })} />
        {errors.nombre && <p className="text-red-500 text-sm">{String(errors.nombre.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Precio</label>
        <Input type="number" step="0.01" {...register('precio', { required: 'Precio requerido' })} />
        {errors.precio && <p className="text-red-500 text-sm">{String(errors.precio.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Es Servicio</label>
        <Input type="checkbox" {...register('es_servicio')} />
      </div>

      <div>
        <label className="block text-sm font-medium">Estado</label>
        <Input {...register('estado', { required: 'Estado requerido' })} />
        {errors.estado && <p className="text-red-500 text-sm">{String(errors.estado.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">ID Categoría</label>
        <Input type="number" {...register('id_categoria', { required: 'ID Categoría requerido' })} />
        {errors.id_categoria && <p className="text-red-500 text-sm">{String(errors.id_categoria.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">ID Vendedor</label>
        <Input type="number" {...register('id_vendedor', { required: 'ID Vendedor requerido' })} />
        {errors.id_vendedor?.message && <p className="text-red-500 text-sm">{String(errors.id_vendedor.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Stock</label>
        <Input type="number" {...register('stock', { required: 'Stock requerido', min: 0 })} />
        {errors.stock?.message && <p className="text-red-500 text-sm">{String(errors.stock.message)}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
      </Button>
    </form>
  );
};
