"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import styles from "./guardadas.module.css";

export default function RutinasGuardadasPage() {
  const [rutinas, setRutinas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [diccionarioFotos, setDiccionarioFotos] = useState<Record<string, string>>({});

  useEffect(() => {
    cargarRutinas();

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
      .catch(() => console.log("No se pudo cargar el diccionario"));
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
    <main className={styles.mainContainer}>
      
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Rutinas</h1>
        </div>
        <Link href="/entrenamiento" className={styles.btnVolver}>
          ⬅️ Volver
        </Link>
      </header>

      <div className={styles.contentWrapper}>
        {rutinas.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay rutina guardada.</p>
          </div>
        ) : (
          rutinas.map((rutina) => (
            <div key={rutina._id} className={styles.routineCard}>
              

              <div className={styles.routineHeader}>
                <div>
                  <h2 className={styles.routineTitle}>{rutina.nombre}</h2>
                  <p className={styles.routineDate}>{new Date(rutina.fechaGuardado).toLocaleDateString()}</p>
                </div>
                <button onClick={() => borrarRutina(rutina._id)} className={styles.btnDelete}>
                  🗑️ Borrar
                </button>
              </div>


              <div className={styles.daysContainer}>
                {rutina.dias.map((dia: any, i: number) => (
                  <div key={i} className={styles.dayCard}>
                    
                    <div className={styles.dayHeader}>
                      <span>Día {dia.dia}</span>
                      <span>{dia.grupoMuscular}</span>
                    </div>
                    
                    <div className={styles.exerciseList}>
                      {dia.ejercicios.map((ej: any, j: number) => {
                        
                        const nombreLimpio = (ej.nombre_pt || ej.nombre || "")
                          .toLowerCase()
                          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                          .trim(); 

                        let codigoFoto = diccionarioFotos[nombreLimpio];

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
                          <div key={j} className={styles.exerciseCard}>
                            
                            <div className={styles.exerciseTop}>
                              
                              <div className={styles.mediaWrapper}>

                                <div className={styles.mediaBox}>
                                  {codigoFoto ? (
                                    <img 
                                      src={`/img/${codigoFoto}.jpg`} 
                                      alt={`Portada de ${ej.nombre}`}
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
                                      alt={`Animación de ${ej.nombre}`}
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
              </div>

            </div>
          ))
        )}
      </div>
    </main>
  );
}