"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RutinasGuardadasPage() {
  const [rutinas, setRutinas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarRutinas();
  }, []);

  const cargarRutinas = async () => {
    try {
      const res = await fetch("/api/rutinas");
      const data = await res.json();
      setRutinas(data);
    } catch (error) {
      toast.error("Error al cargar las rutinas");
    } finally {
      setCargando(false);
    }
  };

  const borrarRutina = async (id: string) => {
    if (!confirm("¿Seguro que quieres borrar esta rutina?")) return;
    try {
      await fetch(`/api/rutinas/${id}`, { method: "DELETE" });
      toast.success("Rutina borrada");
      cargarRutinas(); // Recargar la lista
    } catch (error) {
      toast.error("Error al borrar");
    }
  };

  if (cargando) return <p className="text-white text-center mt-10">Cargando tus rutinas...</p>;

  return (
    <main className="min-h-screen bg-gray-900 pb-12">
      <header className="bg-emerald-600 text-white p-6 rounded-b-3xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mis Rutinas 📁</h1>
          <p className="text-emerald-200 mt-1">Guardadas para entrenar</p>
        </div>
        <Link href="/entrenamiento" className="bg-emerald-700 p-2 rounded-lg hover:bg-emerald-800 transition">
          ⬅️ Volver
        </Link>
      </header>

      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-8">
        {rutinas.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-5xl mb-4">📭</p>
            <p>Aún no has guardado ninguna rutina.</p>
          </div>
        ) : (
          rutinas.map((rutina) => (
            <div key={rutina._id} className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 shadow-xl">
              
              {/* Cabecera de la Rutina */}
              <div className="bg-gray-700 p-4 flex justify-between items-center border-b border-gray-600">
                <div>
                  <h2 className="text-white font-bold text-xl capitalize">{rutina.nombre}</h2>
                  <p className="text-gray-400 text-sm">{new Date(rutina.fechaGuardado).toLocaleDateString()}</p>
                </div>
                <button onClick={() => borrarRutina(rutina._id)} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white p-2 rounded-lg transition">
                  🗑️ Borrar
                </button>
              </div>

              {/* Días de la rutina */}
              <div className="p-4 space-y-6">
                {rutina.dias.map((dia: any, i: number) => (
                  <div key={i} className="border border-gray-600 rounded-xl overflow-hidden">
                    <div className="bg-blue-900/50 px-4 py-2 font-bold text-blue-300 flex justify-between">
                      <span>Día {dia.dia}</span>
                      <span>{dia.grupoMuscular}</span>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      {dia.ejercicios.map((ej: any, j: number) => (
                        <div key={j} className="bg-gray-700 p-3 rounded-lg flex flex-col gap-2">
                          <h4 className="font-bold text-white text-lg capitalize">{ej.nombre}</h4>
                          <p className="text-blue-400 font-semibold text-sm">
                            🔄 {ej.series} series x {ej.repeticiones} reps
                          </p>
                          {ej.notas && <p className="text-gray-400 text-xs italic">💡 {ej.notas}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>
    </main>
  );
}