"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./plan.module.css";

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
        body: JSON.stringify({ dias: Number(dias), utensilios, comensales: Number(comensales) }),
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

  const descartarReceta = (diaIndex: number, comidaIndex: number) => {
    if (!plan) return;
    const nuevoPlan = JSON.parse(JSON.stringify(plan));
    nuevoPlan[diaIndex].comidas.splice(comidaIndex, 1);
    setPlan(nuevoPlan);
  };

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
    <main className={styles.mainContainer}>
      
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Remya</h1>
          <p className={styles.subtitle}>Tu cocinero personal</p>
        </div>
        <Link href="/cocina" className={styles.btnBack}>
          ⬅️ Pantry
        </Link>
      </header>

      <div className={styles.contentWrapper}>


        <div className={styles.welcomeCard}>
          <div className={styles.avatarWrapper}>
            <img src="/remya.svg" alt="Remya" className={styles.avatarImg} />
          </div>
          <div>
            <h2 className={styles.welcomeText}>¡Hola! Soy Remya</h2>
            <p className={styles.welcomeSubtext}>Dime cuántos somos y qué utensilios tienes. Yo me encargo de la magia.</p>
          </div>
        </div>


        <div className={styles.formCard}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Días</label>
              <input 
                type="number" min="1" max="7" 
                value={dias} onChange={(e) => setDias(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Personas</label>
              <input 
                type="number" min="1" max="5" 
                value={comensales} onChange={(e) => setComensales(e.target.value)}
                className={styles.inputField}
              />
            </div>
          </div>
          
          <div>
            <label className={styles.label}>¿Qué utensilios tienes? (Opcional)</label>
            <input 
              type="text" value={utensilios} onChange={(e) => setUtensilios(e.target.value)}
              placeholder="Ej: Microondas, sartén..."
              className={styles.inputField}
            />
          </div>

          <button onClick={generarPlan} disabled={cargando} className={styles.btnGenerate}>
            {cargando ? "Calculando raciones..." : "Generar Plan"}
          </button>
        </div>


        {error && <div className={styles.errorBox}>{error}</div>}


        {plan && (
          <>
            <div className={styles.planContainer}>
              {plan.map((diaInfo, diaIndex) => (
                <div key={diaIndex} className={styles.dayCard}>
                  
                  <div className={styles.dayHeader}>
                    Día {diaInfo.dia}
                  </div>
                  
                  <div className={styles.dayContent}>
                    {diaInfo.comidas.map((comida: any, comidaIndex: number) => {
                      const isReemplazando = reemplazando === `${diaIndex}-${comidaIndex}`;
                      
                      return (
                        <div key={comidaIndex} className={styles.mealCard}>
                          

                          {isReemplazando && (
                            <div className={styles.loadingOverlay}>
                              <span className={styles.loadingText}>Pensando otra opción... 🤔</span>
                            </div>
                          )}

                          <h3 className={styles.mealType}>{comida.tipo}</h3>
                          <p className={styles.mealName}>{comida.receta}</p>
                          

                          <div className={styles.ingredientsBox}>
                            <p className={styles.ingredientsTitle}>Ingredientes a usar:</p>
                            <ul className={styles.ingredientsList}>
                              {comida.ingredientes_usados?.map((ing: any, j: number) => (
                                <li key={j}>
                                  <span className={styles.ingredientQuantity}>{ing.cantidad} {ing.unidad}</span> de {ing.nombre}
                                </li>
                              ))}
                            </ul>
                          </div>


                          <div className={styles.actionsRow}>
                            <button 
                              onClick={() => cocinarReceta(comida, diaIndex, comidaIndex)}
                              className={styles.btnCook}
                            >
                              ✅ Cocinado
                            </button>
                            
                            <button 
                              onClick={() => cambiarReceta(comida.tipo, diaIndex, comidaIndex)}
                              className={styles.btnReplace}
                            >
                              🔄 Cambiar
                            </button>
                    
                            <button 
                              onClick={() => descartarReceta(diaIndex, comidaIndex)}
                              className={styles.btnDelete}
                              title="Eliminar del plan"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    

                    {diaInfo.comidas.length === 0 && (
                      <p className={styles.emptyDayMessage}>Has completado o descartado todas las comidas de este día.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={guardarMenuCompleto} className={styles.btnSaveMenu}>
              💾 Guardar Menú
            </button>
          </>
        )}
      </div>
    </main>
  );
}