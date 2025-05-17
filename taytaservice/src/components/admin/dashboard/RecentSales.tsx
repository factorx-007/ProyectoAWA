// components/admin/dashboard/RecentSales.tsx
import { Table, Badge } from '@tremor/react';

export function RecentSales({ data }: { data: any[] }) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow">
      <h3 className="font-medium text-lg text-gray-900 mb-4">Ventas Recientes</h3>
      <Table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sale, idx) => (
            <tr key={idx}>
              <td>{sale.name}</td>
              <td>{sale.email}</td>
              <td>{sale.amount}</td>
              <td>
                <Badge color="emerald">Completado</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}