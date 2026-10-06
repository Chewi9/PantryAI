"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PlanPage() {
  const [dias, setDias] = useState(3);
  const [utensilios, setUtensilios] = useState("");
  const [cargando, setCargando] = useState(false);
  const [plan, setPlan] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

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
      if (!res.ok) throw new Error(data.error || "Hubo un error al generar la dieta.");

      setPlan(data.plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Función 1: Descontar los ingredientes de la base de datos
  const cocinarReceta = async (comida: any, diaIndex: number, comidaIndex: number) => {
    try {
      const res = await fetch("/api/cocinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientesUsados: comida.ingredientes_usados }),
      });
      
      if (res.ok) {
        alert("✅ ¡Ingredientes descontados de tu armario!");
        descartarReceta(diaIndex, comidaIndex); // La quitamos de la pantalla
        router.refresh(); // Actualizamos los datos del servidor invisiblemente
      } else {
        alert("Hubo un problema al descontar los ingredientes.");
      }
    } catch (error) {
      alert("Error de conexión al intentar descontar.");
    }
  };

  // Función 2: Eliminar la receta de la pantalla si no te gusta
  const descartarReceta = (diaIndex: number, comidaIndex: number) => {
    if (!plan) return;
    const nuevoPlan = [...plan];
    nuevoPlan[diaIndex].comidas.splice(comidaIndex, 1);
    setPlan(nuevoPlan);
  };

  // Función 3: Guardar la receta en la base de datos
  const guardarReceta = async (comida: any) => {
    try {
      const res = await fetch("/api/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: comida.tipo,
          nombre: comida.receta,
          ingredientes: comida.ingredientes_usados
        }),
      });
      
      if (res.ok) {
        alert("💾 ¡Receta guardada en tu libro!");
      } else {
        alert("Hubo un problema al guardar la receta.");
      }
    } catch (error) {
      alert("Error de conexión al intentar guardar.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Cabecera */}
      <header className="bg-emerald-600 text-white p-6 rounded-b-3xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tu Menú 👨‍🍳</h1>
          <p className="text-emerald-100 mt-1">Cantidades exactas</p>
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
              className="border border-gray-300 rounded-lg p-3 text-lg w-full text-black outline-none focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label className="text-gray-700 font-medium block mb-1">¿Qué utensilios tienes? (Opcional)</label>
            <input 
              type="text" 
              value={utensilios}
              onChange={(e) => setUtensilios(e.target.value)}
              placeholder="Ej: Microondas, sartén..."
              className="border border-gray-300 rounded-lg p-3 text-lg w-full text-black outline-none focus:border-emerald-500"
            />
          </div>

          <button 
            onClick={generarPlan}
            disabled={cargando}
            className="bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition disabled:opacity-50 mt-2"
          >
            {cargando ? "✨ Pensando las cantidades..." : "Generar Plan"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        {/* Resultados del Plan */}
        {plan && (
          <div className="space-y-8">
            {plan.map((diaInfo, diaIndex) => (
              <div key={diaIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-emerald-100 px-4 py-2 font-bold text-emerald-800">
                  Día {diaInfo.dia}
                </div>
                
                <div className="p-4 space-y-6">
                  {diaInfo.comidas.map((comida: any, comidaIndex: number) => (
                    <div key={comidaIndex} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <h3 className="font-bold text-gray-800 text-lg">{comida.tipo}</h3>
                      <p className="text-emerald-600 font-medium mb-3">{comida.receta}</p>
                      
                      {/* Aquí mostramos los gramos exactos calculados por la IA */}
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Ingredientes a usar:</p>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                          {comida.ingredientes_usados?.map((ing: any, j: number) => (
                            <li key={j}>
                              <span className="font-semibold">{ing.cantidad} {ing.unidad}</span> de {ing.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => cocinarReceta(comida, diaIndex, comidaIndex)}
                          className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-transform flex-1"
                        >
                          ✅ Cocinado
                        </button>
                        <button 
                          onClick={() => guardarReceta(comida)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-transform flex-1"
                        >
                          💾 Guardar
                        </button>
                        <button 
                          onClick={() => descartarReceta(diaIndex, comidaIndex)}
                          className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 active:scale-95 transition-transform"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Si has completado/eliminado todas las comidas del día */}
                  {diaInfo.comidas.length === 0 && (
                    <p className="text-gray-400 text-sm italic text-center py-4">Has completado o descartado todas las comidas de este día.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}