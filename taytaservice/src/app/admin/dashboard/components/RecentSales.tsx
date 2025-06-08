import React from "react";

export function RecentSales() {
  // Placeholder: muestra ventas recientes ficticias
  const sales = [
    { user: "Juan Pérez", item: "Laptop", amount: "$2,500" },
    { user: "Ana Ruiz", item: "Servicio técnico", amount: "$150" },
    { user: "Carlos Díaz", item: "Celular", amount: "$800" },
  ];
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-yellow-700/10">
      <h2 className="text-lg font-semibold mb-4 text-yellow-400">Ventas recientes</h2>
      <ul className="divide-y divide-gray-800">
        {sales.map((sale, i) => (
          <li key={i} className="py-2 flex justify-between text-gray-200">
            <span>{sale.user}</span>
            <span className="italic">{sale.item}</span>
            <span className="font-bold text-yellow-300">{sale.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
