"use client";
import TarjetaHub from "@/components/TarjetaHub";
import styles from "./estilos.module.css";

export default function HomePage() {
  return (
    <main className={styles.mainContainer}>
      
      <div className={styles.titleContainer}>
        <h1 className={styles.mainTitle}>VitaHub</h1>
        <p className={styles.subTitle}>¿Qué vamos a mejorar hoy?</p>
      </div>

      {/* Tarjetas */}
      <div className={styles.gridContainer}>
        
        <TarjetaHub 
          href="/cocina"
          icono="🍳"
          titulo="Pantry & Chef"
          descripcion="Controla tu despensa, descubre recetas y planifica tus menús semanales con Remya."
          colorConfig={{
            borderHover: "hover:border-emerald-500",
            shadowHover: "hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]",
            bgHover: "bg-emerald-500/5"
          }}
        />

        <TarjetaHub 
          href="/entrenamiento"
          icono="⚡"
          titulo="Iron Coach"
          descripcion="Genera rutinas inteligentes, guarda tus progresos y domina tu entrenamiento en el gimnasio."
          colorConfig={{
            borderHover: "hover:border-blue-500",
            shadowHover: "hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]",
            bgHover: "bg-blue-500/5"
          }}
        />

      </div>

      <div className={styles.footerText}>
        Powered by Remya AI
      </div>
    </main>
  );
}