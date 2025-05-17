import axios from 'axios';
import type { Producto } from '../../types';

export const ProductoService = {
  async createProducto(data: Producto) {
    try {
      const token = getToken();
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // 1. Crear el Item primero
      const itemResponse = await axios.post<{ id_item: number }>('/api/items', {
        id_categoria: data.id_categoria,
        id_vendedor: data.id_vendedor,
        nombre: data.nombre,
        precio: data.precio,
        es_servicio: data.es_servicio,
        estado: data.estado,
        fecha_y_hora: new Date().toISOString()
      }, config);

      // 2. Crear el Producto asociado
      const productoResponse = await axios.post('/api/productos', {
        id_producto: itemResponse.data.id_item, // Asociación correcta
        stock: data.stock,
        // Otros campos necesarios
      }, config);

      return {
        ...(typeof productoResponse.data === 'object' && productoResponse.data !== null ? productoResponse.data : {}),
        id_item: itemResponse.data.id_item
      };
      
    } catch (error: any) {
      console.error('Error detallado:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear el producto');
    }
  }
};

function getToken() {
  throw new Error('Function not implemented.');
}
