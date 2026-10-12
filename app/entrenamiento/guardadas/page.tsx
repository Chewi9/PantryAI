"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RutinasGuardadasPage() {
  const [rutinas, setRutinas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Añadimos el estado para el diccionario de fotos igual que en la pantalla principal
  const [diccionarioFotos, setDiccionarioFotos] = useState<Record<string, string>>({});

  useEffect(() => {
    cargarRutinas();

    // Cargamos el diccionario para saber qué número de foto va con cada ejercicio guardado
    fetch("/pt-BR.json")
      .then(res => res.json())
      .then(data => {
        const diccionarioInvertido: Record<string, string> = {};
        for (const codigo in data) {
          const nombreLimpio = data[codigo]
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .trim();
          diccionarioInvertido[nombreLimpio] = codigo;
        }
        setDiccionarioFotos(diccionarioInvertido);
      })
      .catch(() => console.log("No se pudo cargar el diccionario pt-BR.json"));
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
      cargarRutinas(); 
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
                      {dia.ejercicios.map((ej: any, j: number) => {
                        
                        // 1. Buscamos el código de la foto usando el nombre en portugués guardado
                        const nombreLimpio = (ej.nombre_pt || ej.nombre || "")
                          .toLowerCase()
                          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                          .trim(); 

                        let codigoFoto = diccionarioFotos[nombreLimpio];

                        // Buscador inteligente por si acaso
                        if (!codigoFoto && Object.keys(diccionarioFotos).length > 0) {
                          const palabras = nombreLimpio.split(" ").filter((p: string) => p.length > 3);
                          let maxCoincidencias = 0;
                          for (const nombreDict in diccionarioFotos) {
                            let coincidencias = 0;
                            for (const palabra of palabras) {
                              if (nombreDict.includes(palabra)) coincidencias++;
                            }
                            if (coincidencias > maxCoincidencias && coincidencias > 0) {
                              maxCoincidencias = coincidencias;
                              codigoFoto = diccionarioFotos[nombreDict];
                            }
                          }
                        }

                        return (
                          <div key={j} className="bg-gray-700 p-4 rounded-xl flex flex-col gap-4">
                            
                            {/* PARTE SUPERIOR: IMÁGENES + TEXTOS */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              
                              {/* --- ZONA VISUAL: PORTADA Y GIF --- */}
                              <div className="flex gap-2 flex-shrink-0 mx-auto sm:mx-0">
                                {/* Portada (JPG) */}
                                <div className="w-24 h-24 bg-white rounded-lg overflow-hidden flex items-center justify-center border border-gray-500 shadow-inner">
                                  {codigoFoto ? (
                                    <img 
                                      src={`/img/${codigoFoto}.jpg`} 
                                      alt={`Portada de ${ej.nombre}`}
                                      className="w-full h-full object-contain p-1"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span class="text-3xl text-gray-400">🖼️</span>';
                                      }}
                                    />
                                  ) : (
                                    <span className="text-3xl text-gray-400">🖼️</span>
                                  )}
                                </div>

                                {/* Animación (GIF) */}
                                <div className="w-24 h-24 bg-white rounded-lg overflow-hidden flex items-center justify-center border border-gray-500 shadow-inner">
                                  {codigoFoto ? (
                                    <img 
                                      src={`/gif/${codigoFoto}.gif`} 
                                      alt={`Animación de ${ej.nombre}`}
                                      className="w-full h-full object-contain p-1"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span class="text-3xl text-gray-400">▶️</span>';
                                      }}
                                    />
                                  ) : (
                                    <span className="text-3xl text-gray-400">▶️</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* TEXTOS BÁSICOS */}
                              <div className="flex-1 w-full text-center sm:text-left mt-2 sm:mt-0">
                                <h4 className="font-bold text-white text-xl leading-tight mb-2 capitalize">{ej.nombre}</h4>
                                <p className="text-blue-400 font-bold mb-2 text-sm bg-blue-900/30 inline-block px-3 py-1 rounded-full">
                                  🔄 {ej.series} series x {ej.repeticiones} reps
                                </p>
                                {ej.notas && (
                                  <p className="text-gray-300 text-sm italic leading-relaxed bg-gray-800 p-2 rounded-lg border border-gray-600">
                                    💡 {ej.notas}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* PARTE INFERIOR: INSTRUCCIONES PASO A PASO */}
                            {ej.instrucciones && ej.instrucciones.length > 0 && (
                              <div className="mt-2 pt-3 border-t border-gray-600">
                                <h5 className="text-gray-300 font-semibold mb-2 text-sm">Cómo realizarlo:</h5>
                                <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-400">
                                  {ej.instrucciones.map((paso: string, index: number) => (
                                    <li key={index} className="leading-relaxed">{paso}</li>
                                  ))}
                                </ol>
                              </div>
                            )}
                            
                          </div>
                        );
                      })}
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