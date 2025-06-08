"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";

type ReportStatus = 'P' | 'R' | 'C';

type Report = {
  id_denuncia: number;
  id_motivo: number;
  motivo: string;
  texto: string;
  estado: ReportStatus;
  fecha_creacion: string;
  usuario: {
    id_usuario: number;
    nombres: string;
    apellidos: string;
    email: string;
  };
};

type ReportsResponse = {
  data: Report[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const ESTADOS = [
  { value: 'P' as const, label: 'Pendiente' },
  { value: 'R' as const, label: 'En revisión' },
  { value: 'C' as const, label: 'Cerrado' },
];

export function ReportsTable() {
  const [filters, setFilters] = useState<{
    estado: ReportStatus | 'all';
    search: string;
    page: number;
    limit: number;
  }>({
    estado: 'all',
    search: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error, refetch } = useQuery<ReportsResponse>({
    queryKey: ["reports", filters],
    queryFn: () => reportService.getReports({
      estado: filters.estado === 'all' ? undefined : filters.estado,
      search: filters.search || undefined,
      page: filters.page,
      limit: filters.limit,
    }) as Promise<ReportsResponse>,
  });

  const handleStatusChange = async (id: number, newStatus: ReportStatus) => {
    try {
      await reportService.updateReportStatus(id, newStatus);
      await refetch();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPp", { locale: es });
  };

  const getStatusBadge = (estado: ReportStatus) => {
    const status = ESTADOS.find((e) => e.value === estado);
    if (!status) return null;

    const statusClasses: Record<ReportStatus, string> = {
      P: "bg-yellow-900 text-yellow-400",
      R: "bg-blue-900 text-blue-400",
      C: "bg-green-900 text-green-400",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${statusClasses[estado]}`}>
        {status.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full bg-gray-800 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-900/20 rounded-lg">
        Error al cargar los reportes. Intente nuevamente.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-yellow-700/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-yellow-400">Reportes</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Buscar..."
            className="bg-gray-800 border-gray-700 text-white w-64"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
          <Select
            value={filters.estado}
            onValueChange={(value) => setFilters({ ...filters, estado: value as ReportStatus | 'all', page: 1 })}
          >
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">Todos los estados</SelectItem>
              {ESTADOS.map((estado) => (
                <SelectItem key={estado.value} value={estado.value}>
                  {estado.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-800">
              <th className="pb-3 px-2">Usuario</th>
              <th className="pb-3 px-2">Motivo</th>
              <th className="pb-3 px-2">Fecha</th>
              <th className="pb-3 px-2">Estado</th>
              <th className="pb-3 px-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((report: any) => (
              <tr key={report.id_denuncia} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="py-3 px-2">
                  <div className="font-medium">
                    {report.usuario?.nombres} {report.usuario?.apellidos}
                  </div>
                  <div className="text-sm text-gray-400">{report.usuario?.email}</div>
                </td>
                <td className="px-2">
                  <div className="font-medium">{report.motivo}</div>
                  <div className="text-sm text-gray-400 line-clamp-2">{report.texto}</div>
                </td>
                <td className="px-2 text-sm text-gray-400">
                  {formatDate(report.fecha_creacion)}
                </td>
                <td className="px-2">{getStatusBadge(report.estado)}</td>
                <td className="px-2 text-right space-x-2">
                  {report.estado !== 'R' && (
                    <Button
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => handleStatusChange(report.id_denuncia, 'R')}
                    >
                      Revisar
                    </Button>
                  )}
                  {report.estado !== 'C' && (
                    <Button
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => handleStatusChange(report.id_denuncia, 'C')}
                    >
                      Cerrar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.pagination && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            Mostrando {data.data.length} de {data.pagination.total} reportes
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={filters.page <= 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              disabled={filters.page * filters.limit >= (data.pagination?.total || 0)}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
