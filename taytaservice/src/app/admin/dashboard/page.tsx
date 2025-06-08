import { StatsGrid } from "./components/StatsGrid";
import { RecentSales } from "./components/RecentSales";
import { Charts } from "./components/Charts";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-gray-950 min-h-screen">
      <StatsGrid />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RecentSales />
        <Charts />
      </div>
    </div>
  );
}