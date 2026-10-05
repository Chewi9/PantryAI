"use client"; // Esta página necesita interactividad para el botón y los estados de carga

import { useState } from "react";
import Link from "next/link";

export default function PlanPage() {
  const [dias, setDias] = useState(3);
  const [utensilios, setUtensilios] = useState("");
  const [cargando, setCargando] = useState(false);
  const [plan, setPlan] = useState<any[] | null>(null);
  const [error, setError] = useState("");

  const generarPlan = async () => {
    setCargando(true);
    setError("");
    setPlan(null);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dias, utensilios }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Hubo un error al generar la dieta.");
      }

      setPlan(data.plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Cabecera */}
      <header className="bg-emerald-600 text-white p-6 rounded-b-3xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tu Menú 👨‍🍳</h1>
          <p className="text-emerald-100 mt-1">Recetas con lo que ya tienes</p>
        </div>
        <Link href="/" className="bg-emerald-700 p-2 rounded-lg hover:bg-emerald-800 transition">
          ⬅️ Armario
        </Link>
      </header>

      {/* Controles */}
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col gap-4">
          <div>
            <label className="text-gray-700 font-medium block mb-1">¿Para cuántos días cocinamos?</label>
            <input 
              type="number" 
              min="1" 
              max="7" 
              value={dias}
              onChange={(e) => setDias(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-3 text-lg w-full text-black"
            />
          </div>
          
          <div>
            <label className="text-gray-700 font-medium block mb-1">¿Qué utensilios tienes? (Opcional)</label>
            <input 
              type="text" 
              value={utensilios}
              onChange={(e) => setUtensilios(e.target.value)}
              placeholder="Ej: Microondas, sartén, freidora de aire..."
              className="border border-gray-300 rounded-lg p-3 text-lg w-full text-black"
            />
          </div>

          <button 
            onClick={generarPlan}
            disabled={cargando}
            className="bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition disabled:opacity-50 mt-2"
          >
            {cargando ? "✨ El Nutricionista está pensando..." : "Generar Plan"}
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        {/* Resultados del Plan */}
        {plan && (
          <div className="space-y-8">
            {plan.map((diaInfo, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-emerald-100 px-4 py-2 font-bold text-emerald-800">
                  Día {diaInfo.dia}
                </div>
                <div className="p-4 space-y-4">
                  {diaInfo.comidas.map((comida: any, i: number) => (
                    <div key={i} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                      <h3 className="font-bold text-gray-800">{comida.tipo}</h3>
                      <p className="text-emerald-600 font-medium">{comida.receta}</p>
                      <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                        {comida.ingredientes.map((ing: string, j: number) => (
                          <li key={j}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}