"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PlanPage() {
  const [dias, setDias] = useState<number | string>(3);
  const [comensales, setComensales] = useState<number | string>(1);
  const [utensilios, setUtensilios] = useState("");
  const [cargando, setCargando] = useState(false);
  const [reemplazando, setReemplazando] = useState<string | null>(null);
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
        body: JSON.stringify({ dias: Number(dias), utensilios, comensales: Number(comensales) }), // Enviamos el numero de días, utensilios y comensales
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Remya está cansado, prueba otra vez.");

      setPlan(data.plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const cocinarReceta = async (comida: any, diaIndex: number, comidaIndex: number) => {
    try {
      const res = await fetch("/api/cocinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientesUsados: comida.ingredientes_usados }),
      });
      
      if (res.ok) {
        descartarReceta(diaIndex, comidaIndex);
        router.refresh();
      } else {
        alert("Hubo un problema al descontar los ingredientes.");
      }
    } catch (error) {
      alert("Error de conexión al intentar descontar.");
    }
  };

  // Pedir otra receta concreta
  const cambiarReceta = async (tipo: string, diaIndex: number, comidaIndex: number) => {
    const idReceta = `${diaIndex}-${comidaIndex}`;
    setReemplazando(idReceta);
    
    try {
      const res = await fetch("/api/reemplazar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, utensilios, comensales }),
      });
      
      const data = await res.json();
      
      if (res.ok && plan) {

        const nuevoPlan = JSON.parse(JSON.stringify(plan));
        nuevoPlan[diaIndex].comidas[comidaIndex] = data;
        setPlan(nuevoPlan);
      } else {
        alert("No se pudo generar otra alternativa.");
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setReemplazando(null);
    }
  };

  // Función para eliminar la receta
  const descartarReceta = (diaIndex: number, comidaIndex: number) => {
    if (!plan) return;
    const nuevoPlan = JSON.parse(JSON.stringify(plan));
    nuevoPlan[diaIndex].comidas.splice(comidaIndex, 1);
    setPlan(nuevoPlan);
  };

  // Guardamos el menú con todos los días completo
  const guardarMenuCompleto = async () => {
    try {
      const res = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nombre: `Menú de ${dias} días (${comensales} pers.)`, 
          dias: plan 
        }),
      });
      
      if (res.ok) alert("¡Menú guardado!");
      else alert("Hubo un problema al guardar.");
    } catch (error) {
      alert("Error de conexión al intentar guardar.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-emerald-600 text-white p-6 rounded-b-3xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Remya</h1>
          <p className="text-emerald-100 mt-1">Tu cocinero personal</p>
        </div>
        <Link href="/" className="bg-emerald-700 p-2 rounded-lg hover:bg-emerald-800 transition">
          ⬅️ Pantry
        </Link>
      </header>

      <div className="p-6 max-w-md mx-auto">

        <div className="bg-emerald-50 rounded-2xl p-4 shadow-sm border border-emerald-100 flex items-center gap-4 mb-6 relative overflow-hidden">
          
          {/* Avatar de Remya animado para simular que se mueve */}
          <div className="flex-shrink-0 animate-bounce">
            <img
            src="/remya.svg"
            alt="Remya"
            className="w-20 h-20 drop-shadow-md"
            />
          </div>
          
          <div className="relative">
            <h2 className="font-bold text-emerald-800 text-lg leading-tight">¡Hola! Soy Remya</h2>
            <p className="text-emerald-600 text-sm mt-1">Dime cuántos somos y qué utensilios tienes. Yo me encargo de la magia.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-gray-700 font-medium block mb-1">Días</label>
              <input 
                type="number" 
                min="1" max="7" 
                value={dias}
                onChange={(e) => setDias(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 text-lg w-full text-black outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-700 font-medium block mb-1">Personas</label>
              <input 
                type="number" 
                min="1" max="10" 
                value={comensales}
                onChange={(e) => setComensales(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 text-lg w-full text-black outline-none focus:border-emerald-500"
              />
            </div>
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
            {cargando ? "✨ Calculando raciones..." : "Generar Plan"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">{error}</div>
        )}

        {plan && (
          <>
            <div className="space-y-8">
              {plan.map((diaInfo, diaIndex) => (
                <div key={diaIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-emerald-100 px-4 py-2 font-bold text-emerald-800">
                    Día {diaInfo.dia}
                  </div>
                  
                  <div className="p-4 space-y-6">
                    {diaInfo.comidas.map((comida: any, comidaIndex: number) => {
                      const isReemplazando = reemplazando === `${diaIndex}-${comidaIndex}`;
                      
                      return (
                        <div key={comidaIndex} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0 relative">
                          {/* Pantalla de carga superpuesta cuando se está cambiando una receta */}
                          {isReemplazando && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                              <span className="font-bold text-emerald-600 animate-pulse">Pensando otra opción... 🤔</span>
                            </div>
                          )}

                          <h3 className="font-bold text-gray-800 text-lg">{comida.tipo}</h3>
                          <p className="text-emerald-600 font-medium mb-3">{comida.receta}</p>
                          
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

                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => cocinarReceta(comida, diaIndex, comidaIndex)}
                              className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-transform flex-1"
                            >
                              ✅ Cocinado
                            </button>
                            
                            <button 
                              onClick={() => cambiarReceta(comida.tipo, diaIndex, comidaIndex)}
                              className="bg-amber-100 text-amber-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-amber-200 active:scale-95 transition-transform flex-1"
                            >
                              🔄 Cambiar
                            </button>
                    

                            <button 
                              onClick={() => descartarReceta(diaIndex, comidaIndex)}
                              className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 active:scale-95 transition-transform"
                              title="Eliminar del plan"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {diaInfo.comidas.length === 0 && (
                      <p className="text-gray-400 text-sm italic text-center py-4">Has completado o descartado todas las comidas de este día.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={guardarMenuCompleto}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-lg shadow-md hover:bg-blue-700 transition-transform active:scale-95"
            >
              💾 Guardar Menú
            </button>
          </>
        )}
      </div>
    </main>
  );
}