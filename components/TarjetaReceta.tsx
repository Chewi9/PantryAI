"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TarjetaReceta({ receta }: { receta: any }) {
  const router = useRouter();
  const [procesando, setProcesando] = useState(false);

  const cocinar = async () => {
    setProcesando(true);
    try {
      // Llamamos a la API que ya creaste para descontar ingredientes
      const res = await fetch("/api/cocinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientesUsados: receta.ingredientes }),
      });
      
      if (res.ok) {
        alert("✅ ¡Ingredientes descontados de tu armario!");
      } else {
        alert("Hubo un problema al descontar.");
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setProcesando(false);
    }
  };

  const eliminar = async () => {
    setProcesando(true);
    await fetch(`/api/recetas/${receta.id}`, { method: "DELETE" });
    router.refresh(); // Recarga la lista
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-emerald-100 px-4 py-2 font-bold text-emerald-800 flex justify-between items-center">
        <span>{receta.tipo}</span>
        <span className="text-xs font-normal text-emerald-600">
          {new Date(receta.fechaGuardado).toLocaleDateString()}
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-3">{receta.nombre}</h3>
        
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {receta.ingredientes.map((ing: any, i: number) => (
              <li key={i}>
                <span className="font-semibold">{ing.cantidad} {ing.unidad}</span> de {ing.nombre}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={cocinar}
            disabled={procesando}
            className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-transform flex-1 disabled:opacity-50"
          >
            ✅ Cocinar esto
          </button>
          <button 
            onClick={eliminar}
            disabled={procesando}
            className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 active:scale-95 transition-transform disabled:opacity-50"
            title="Eliminar receta"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}