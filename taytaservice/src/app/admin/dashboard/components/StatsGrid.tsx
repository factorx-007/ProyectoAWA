import React from "react";

export function StatsGrid() {
  // Placeholder: muestra tarjetas con métricas falsas
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {["Usuarios", "Productos", "Ventas", "Denuncias"].map((label, i) => (
        <div key={label} className="bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 shadow-xl rounded-xl p-6 flex flex-col justify-between border border-yellow-700/30">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{label}</span>
          <span className="text-3xl font-bold text-yellow-400">{[123, 56, 12000, 2][i]}</span>
        </div>
      ))}
    </div>
  );
}
