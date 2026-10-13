"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// 1. Importamos nuestros estilos
import styles from "./recetas.module.css";

export default function RecetasPage() {
  const [menus, setMenus] = useState<any[]>([]);

  const cargarMenus = async () => {
    const res = await fetch("/api/menus/leer"); 
    if (res.ok) {
      const data = await res.json();
      setMenus(data);
    }
  };

  useEffect(() => { cargarMenus(); }, []);

  const cocinarReceta = async (comida: any) => {
    try {
      const res = await fetch("/api/cocinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientesUsados: comida.ingredientes_usados }),
      });
      if (res.ok) alert("✅ ¡Ingredientes descontados de tu armario!");
    } catch (error) {
      alert("Error de conexión.");
    }
  };

  return (
    <main className={styles.mainContainer}>
      
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Menús 📖</h1>
          <p className={styles.subtitle}>Semanas planificadas</p>
        </div>
        <Link href="/cocina" className={styles.btnBack}>
          ⬅️ Pantry
        </Link>
      </header>

      <div className={styles.contentWrapper}>
        {menus.length === 0 ? (
          <p className={styles.emptyState}>No tienes menús guardados.</p>
        ) : (
          menus.map((menu: any) => (
            <div key={menu._id} className={styles.menuCard}>
              
              <div className={styles.menuHeader}>
                {menu.nombre}
              </div>
              
              <div className={styles.menuContent}>
                {menu.dias.map((diaInfo: any, dIndex: number) => (
                  <div key={dIndex}>
                    
                    <h4 className={styles.dayTitle}>Día {diaInfo.dia}</h4>
                    
                    <div className={styles.mealsContainer}>
                      {diaInfo.comidas.map((comida: any, cIndex: number) => (
                        <div key={cIndex} className={styles.mealCard}>
                          
                          <div>
                            <p className={styles.mealType}>{comida.tipo}</p>
                            <p className={styles.mealRecipe}>{comida.receta}</p>
                          </div>
                          
                          <button 
                            onClick={() => cocinarReceta(comida)}
                            className={styles.btnCook}
                          >
                            ✅ Cocinar
                          </button>

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