import { authFetch } from '@/utils/authFetch';

type Report = {
  id_denuncia: number;
  id_motivo: number;
  motivo: string;
  texto: string;
  estado: 'P' | 'R' | 'C'; // Pendiente, Revisión, Cerrado
  fecha_creacion: string;
  usuario: {
    id_usuario: number;
    nombres: string;
    apellidos: string;
    email: string;
  };
};

type ReportFilters = {
  estado?: 'P' | 'R' | 'C';
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
  page?: number;
  limit?: number;
};

type ReportStats = {
  total: number;
  pendientes: number;
  en_revision: number;
  cerrados: number;
  por_motivo: Array<{ motivo: string; cantidad: number }>;
};

export const reportService = {
  async getReports(filters: ReportFilters = {}) {
    const params = new URLSearchParams();
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde);
    if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await authFetch(`/api/denuncias?${params.toString()}`);
    if (!response.ok) throw new Error('Error al obtener los reportes');
    return response.json();
  },

  async getReportById(id: number) {
    const response = await authFetch(`/api/denuncias/${id}`);
    if (!response.ok) throw new Error('Error al obtener el reporte');
    return response.json();
  },

  async updateReportStatus(id: number, estado: 'P' | 'R' | 'C', comentario?: string) {
    const response = await authFetch(`/api/denuncias/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado, comentario }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar el reporte');
    }
    return response.json();
  },

  async getReportStats(): Promise<ReportStats> {
    const response = await authFetch('/api/denuncias/estadisticas');
    if (!response.ok) throw new Error('Error al obtener las estadísticas');
    return response.json();
  },

  async getMotivosDenuncia() {
    const response = await authFetch('/api/motivos-denuncia');
    if (!response.ok) throw new Error('Error al obtener los motivos de denuncia');
    return response.json();
  },
};
