"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import styles from "./entrenamiento.module.css";

export default function EntrenamientoPage() {
  const [dias, setDias] = useState<number | string>(5);
  const [objetivo, setObjetivo] = useState("Todo el cuerpo");
  const [equipamiento, setEquipamiento] = useState("");
  const [cargando, setCargando] = useState(false);
  const [rutina, setRutina] = useState<any[] | null>(null);
  
  const [diccionarioFotos, setDiccionarioFotos] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/perfil")
      .then(res => res.json())
      .then(data => {
        if (data && data.equipamiento) setEquipamiento(data.equipamiento);
      });

    fetch("/pt-BR.json")
      .then(res => res.json())
      .then(data => {
        const diccionarioInvertido: Record<string, string> = {};
        for (const codigo in data) {
          const nombreLimpio = data[codigo].toLowerCase().trim();
          diccionarioInvertido[nombreLimpio] = codigo;
        }
        setDiccionarioFotos(diccionarioInvertido);
      })
      .catch(() => console.log("No se pudo cargar el diccionario"));
  }, []);

  const generarRutina = async () => {
    if (!objetivo) return toast.error("Qué entrenamos hoy");
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
      toast.success("¡Rutina guardada en tus favoritos!");
    } catch (error) {
      toast.error("No se pudo guardar la rutina");
    }
  };

  return (
    <main className={styles.mainContainer}>
      
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Entrenamiento</h1>
        </div>
        <div className={styles.navGroup}>
          <Link href="/" className={styles.navLink}>
            ⬅️ Volver
          </Link>
          <Link href="/entrenamiento/guardadas" className={styles.navLink}>
            📁 Mis Rutinas
          </Link>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        
        <div className={styles.formCard}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Días a la semana</label>
            <input 
              type="number" min="1" max="7" 
              value={dias} onChange={(e) => setDias(e.target.value)}
              className={styles.inputField}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>¿Qué quieres trabajar?</label>
            <input 
              type="text" 
              value={objetivo} onChange={(e) => setObjetivo(e.target.value)}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Tus Máquinas</label>
            <textarea 
              value={equipamiento} onChange={(e) => setEquipamiento(e.target.value)}
              className={styles.textAreaField}
            />
          </div>

          <button 
            onClick={generarRutina} disabled={cargando}
            className={styles.btnPrimary}
          >
            {cargando ? "Diseñando la rutina" : "Crear Entrenamiento"}
          </button>
        </div>

        {rutina && (
          <div className={styles.routineList}>
            {rutina.map((diaInfo, i) => (
              <div key={i} className={styles.dayCard}>
                
                <div className={styles.dayHeader}>
                  <span>Día {diaInfo.dia}</span>
                  <span className={styles.daySubtitle}>{diaInfo.grupoMuscular}</span>
                </div>
                
                <div className={styles.exerciseList}>
                  {diaInfo.ejercicios.map((ej: any, j: number) => {
                    

                    const nombreLimpio = (ej.nombre_pt || ej.nombre).toLowerCase().trim(); 
                    let codigoFoto = diccionarioFotos[nombreLimpio];

                    if (!codigoFoto) {
                      const palabrasIA = nombreLimpio.split(" ").filter((p: string) => p.length > 3);
                      let maxCoincidencias = 0;
                      
                      for (const nombreDict in diccionarioFotos) {
                        let coincidencias = 0;
                        for (const palabra of palabrasIA) {
                          if (nombreDict.includes(palabra)) coincidencias++;
                        }
                        if (coincidencias > maxCoincidencias && coincidencias > 0) {
                          maxCoincidencias = coincidencias;
                          codigoFoto = diccionarioFotos[nombreDict];
                        }
                      }
                    }

                    return (
                      <div key={j} className={styles.exerciseCard}>
                        
                        <div className={styles.exerciseTop}>
                          
                          <div className={styles.mediaWrapper}>

                            <div className={styles.mediaBox}>
                              {codigoFoto ? (
                                <img 
                                  src={`/img/${codigoFoto}.jpg`} 
                                  alt={`Portada`}
                                  className={styles.mediaImg}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span class="text-3xl text-gray-400">🖼️</span>';
                                  }}
                                />
                              ) : (
                                <span className={styles.mediaFallback}>Error</span>
                              )}
                            </div>


                            <div className={styles.mediaBox}>
                              {codigoFoto ? (
                                <img 
                                  src={`/gif/${codigoFoto}.gif`} 
                                  alt={`Animación`}
                                  className={styles.mediaImg}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span class="text-3xl text-gray-400">▶️</span>';
                                  }}
                                />
                              ) : (
                                <span className={styles.mediaFallback}>Error</span>
                              )}
                            </div>
                          </div>
                          

                          <div className={styles.textWrapper}>
                            <h4 className={styles.exerciseName}>{ej.nombre}</h4>
                            <p className={styles.exerciseStats}>
                              🔄 {ej.series} series x {ej.repeticiones} reps
                            </p>
                            {ej.notas && (
                              <p className={styles.exerciseNotes}>
                                💡 {ej.notas}
                              </p>
                            )}
                          </div>
                        </div>


                        {ej.instrucciones && ej.instrucciones.length > 0 && (
                          <div className={styles.instructionsSection}>
                            <h5 className={styles.instructionsHeading}>Cómo realizarlo:</h5>
                            <ol className={styles.instructionsList}>
                              {ej.instrucciones.map((paso: string, index: number) => (
                                <li key={index} className={styles.instructionItem}>{paso}</li>
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
              className={styles.btnSave}
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </main>
  );
}