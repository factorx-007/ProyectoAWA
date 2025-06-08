import { Producto } from '@/features/types';
import axios from 'axios';

const getToken = (): string => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    if (!token) throw new Error('No se encontró token de autenticación');
    return token;
  }
  throw new Error('localStorage no disponible en servidor');
};

const headers = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const ProductoService = {
  async getProductoCompleto(id: number): Promise<any> {
    try {
      // Obtener el ítem primero
      const itemResponse = await axios.get(`/api/items/${id}`, headers());
      const item = itemResponse.data as {
        id_categoria: number | string;
        precio: number | string;
        es_servicio: boolean;
        [key: string]: any;
      };
      
      // Intentar obtener el producto solo si no es servicio
      let productoData: { stock: number; [key: string]: any } = { stock: 0 };
      if (!item.es_servicio) {
        const productoResponse = await axios.get(`/api/productos/${id}`, headers());
        productoData = productoResponse.data as { stock: number; [key: string]: any };
      }

      return {
        ...item,
        ...productoData,
        id_producto: id,
        id_categoria: item.id_categoria.toString(),
        precio: item.precio.toString()
      };
    } catch (error) {
      console.error('Error obteniendo producto completo:', error);
      throw error;
    }
  },

  async getProductosCompletos(): Promise<any[]> {
    try {
      const [itemsResponse, productosResponse, usuariosResponse] = await Promise.all([
        axios.get<any[]>('/api/items', headers()),
        axios.get<any[]>('/api/productos', headers()),
        axios.get<any[]>('/api/usuarios', headers())
      ]);

      return itemsResponse.data.map((item: any) => {
        const producto = productosResponse.data.find((p: any) => p.id_producto === item.id_item) || {};
        const vendedor = usuariosResponse.data.find((u: any) => u.id_usuario === item.id_vendedor);
        
        return {
          ...item,
          ...producto,
          id_producto: item.id_item,
          vendedor: vendedor || null
        };
      });
    } catch (error) {
      console.error('Error obteniendo productos completos:', error);
      throw error;
    }
  },

  async createProducto(data: Omit<Producto, 'id_producto'>) {
    try {
      const itemResponse = await axios.post('/api/items', {
        id_categoria: data.id_categoria,
        id_vendedor: data.id_vendedor,
        nombre: data.nombre,
        precio: data.precio,
        es_servicio: data.es_servicio,
        estado: data.estado
      }, headers());

      // Assert the type of itemResponse.data
      const itemData = itemResponse.data as { id_item: number; [key: string]: any };

      if (!data.es_servicio) {
        await axios.post('/api/productos', {
          id_producto: itemData.id_item,
          stock: data.stock
        }, headers());
      }

      return {
        ...itemData,
        stock: data.stock,
        id_producto: itemData.id_item
      };
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  },

  async deleteProducto(id: number) {
    try {
      await axios.delete(`/api/productos/${id}`, headers());
      await axios.delete(`/api/items/${id}`, headers());
      return true;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  },

  async updateItem(id: number, data: any) {
    try {
      const response = await axios.put(`/api/items/${id}`, data, headers());
      return response.data;
    } catch (error) {
      console.error('Error actualizando ítem:', error);
      throw error;
    }
  },

  async updateProducto(id: number, data: any) {
    try {
      const response = await axios.put(`/api/productos/${id}`, data, headers());
      return response.data;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  },

  async getCategorias() {
    try {
      const response = await axios.get('/api/categorias', headers());
      return response.data;
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  }
};