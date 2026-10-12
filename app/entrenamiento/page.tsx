"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EntrenamientoPage() {
  const [dias, setDias] = useState<number | string>(3);
  const [objetivo, setObjetivo] = useState("");
  const [equipamiento, setEquipamiento] = useState("");
  const [cargando, setCargando] = useState(false);
  const [rutina, setRutina] = useState<any[] | null>(null);
  
  const [diccionarioFotos, setDiccionarioFotos] = useState<Record<string, string>>({});

  useEffect(() => {
    // 1. Cargar máquinas
    fetch("/api/perfil")
      .then(res => res.json())
      .then(data => {
        if (data && data.equipamiento) setEquipamiento(data.equipamiento);
      });

    // 2. Cargar diccionario de fotos (solo necesitamos el pt-BR.json original para emparejar imágenes)
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

  const generarRutina = async () => {
    if (!objetivo) return toast.error("Dime qué quieres entrenar hoy");
    setCargando(true);
    setRutina(null);

    try {
      await fetch("/api/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipamiento }),
      });

      const res = await fetch("/api/entrenamiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dias: Number(dias), objetivo, equipamiento }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Fallo en la IA");
      
      setRutina(data.rutina);
      toast.success("¡Rutina generada!");
    } catch (error) {
      toast.error("Error al generar tu entrenamiento");
    } finally {
      setCargando(false);
    }
  };

  const guardarRutina = async () => {
  try {
    const res = await fetch("/api/rutinas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        nombre: `Rutina: ${objetivo}`, 
        dias: rutina 
      }),
    });
    if (!res.ok) throw new Error("Error al guardar");
    toast.success("💾 ¡Rutina guardada en tus favoritos!");
  } catch (error) {
    toast.error("No se pudo guardar la rutina");
  }
  };

  return (
    <main className="min-h-screen bg-gray-900 pb-12">
      <header className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Entrenamiento 🏋️‍♂️</h1>
          <p className="text-blue-200 mt-1">Tu Personal Trainer</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/" className="bg-blue-700 text-center p-2 rounded-lg hover:bg-blue-800 transition text-sm">
            ⬅️ Volver
          </Link>
          <Link href="/entrenamiento/guardadas" className="bg-emerald-600 text-center p-2 rounded-lg hover:bg-emerald-700 transition font-bold text-sm">
            📁 Mis Rutinas
          </Link>
        </div>
      </header>

      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-sm mb-8 flex flex-col gap-4 border border-gray-700">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-gray-300 font-medium block mb-1">Días a la semana</label>
              <input 
                type="number" min="1" max="7" 
                value={dias} onChange={(e) => setDias(e.target.value)}
                className="bg-gray-700 text-white rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="text-gray-300 font-medium block mb-1">¿Qué quieres trabajar?</label>
            <input 
              type="text" 
              value={objetivo} onChange={(e) => setObjetivo(e.target.value)}
              className="bg-gray-700 text-white rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Hipertrofia de espalda..."
            />
          </div>

          <div>
            <label className="text-gray-300 font-medium block mb-1">Tus Máquinas</label>
            <textarea 
              value={equipamiento} onChange={(e) => setEquipamiento(e.target.value)}
              className="bg-gray-700 text-white rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Ej: Poleas, prensa de piernas..."
            />
          </div>

          <button 
            onClick={generarRutina} disabled={cargando}
            className="bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition disabled:opacity-50 mt-2"
          >
            {cargando ? "💪 Diseñando rutina..." : "Crear Entrenamiento"}
          </button>
        </div>

        {rutina && (
          <div className="space-y-6">
            {rutina.map((diaInfo, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                <div className="bg-blue-600 px-4 py-2 font-bold text-white flex justify-between">
                  <span>Día {diaInfo.dia}</span>
                  <span className="text-blue-200">{diaInfo.grupoMuscular}</span>
                </div>
                <div className="p-4 space-y-4">
                  
                  {diaInfo.ejercicios.map((ej: any, j: number) => {
                    
                    // Buscamos el código de la foto usando el nombre Oculto en portugués
                    // 1. Limpiamos el nombre de la IA
                    const nombreLimpio = (ej.nombre_pt || ej.nombre)
                      .toLowerCase()
                      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                      .trim(); 

                    // 2. Buscamos coincidencia exacta
                    let codigoFoto = diccionarioFotos[nombreLimpio];

                    // 3. BUSCADOR INTELIGENTE (Fuzzy Search)
                    // Si no hay una coincidencia exacta, busca la que más se parezca
                    if (!codigoFoto) {
                      // Sacamos las palabras clave (de más de 3 letras)
                      const palabrasIA = nombreLimpio.split(" ").filter((p: string) => p.length > 3);
                      let maxCoincidencias = 0;
                      
                      for (const nombreDict in diccionarioFotos) {
                        let coincidencias = 0;
                        for (const palabra of palabrasIA) {
                          if (nombreDict.includes(palabra)) coincidencias++;
                        }
                        
                        // Si esta frase comparte más palabras que las anteriores, nos la quedamos
                        if (coincidencias > maxCoincidencias && coincidencias > 0) {
                          maxCoincidencias = coincidencias;
                          codigoFoto = diccionarioFotos[nombreDict];
                        }
                      }
                    }
                    return (
                      <div key={j} className="bg-gray-700 p-4 rounded-xl flex flex-col gap-4">
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          
                          <div className="flex gap-2 flex-shrink-0 mx-auto sm:mx-0">
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
                          
                          <div className="flex-1 w-full text-center sm:text-left mt-2 sm:mt-0">
                            {/* Ahora muestra el nombre principal, que viene en perfecto español */}
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

                        {/* La IA nos da las instrucciones directamente en español */}
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

            <button 
            onClick={guardarRutina}
            className="w-full bg-emerald-600 text-white font-bold text-xl py-4 rounded-2xl hover:bg-emerald-500 shadow-lg transition transform active:scale-95"
            >
              💾 Guardar esta Rutina
            </button>
          </div>
        )}
      </div>
    </main>
  );
}