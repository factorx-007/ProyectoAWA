// components/admin/dashboard/SalesChart.tsx
import { LineChart, Title, Card } from '@tremor/react';

const data = [
  { date: 'Ene', 'Productos': 1200, 'Servicios': 900 },
  { date: 'Feb', 'Productos': 1500, 'Servicios': 1000 },
  { date: 'Mar', 'Productos': 1800, 'Servicios': 1200 },
  { date: 'Abr', 'Productos': 2100, 'Servicios': 1400 },
  { date: 'May', 'Productos': 2400, 'Servicios': 1600 },
  { date: 'Jun', 'Productos': 2800, 'Servicios': 1900 },
];

export function SalesChart() {
  return (
    <Card>
      <Title>Ventas Mensuales</Title>
      <LineChart
        className="mt-6"
        data={data}
        index="date"
        categories={['Productos', 'Servicios']}
        colors={['blue', 'emerald']}
        yAxisWidth={40}
      />
    </Card>
  );
}