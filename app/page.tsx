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

      <div className={styles.gridContainer}>
        

        <TarjetaHub 
          href="/cocina"
          titulo="Pantry & Chef"
          colorConfig={{
            borderHover: "hover:border-emerald-500",
            shadowHover: "hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]",
            bgHover: "bg-emerald-500/5"
          }}
          icono={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="80"
              width="80"
              viewBox="0 -960 960 960"
              aria-hidden="true"
              style={{ filter: "drop-shadow(0 0 12px rgba(16,185,129,0.35))" }}
            >
              <defs>
                <linearGradient id="pantryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6EE7B7" />
                  <stop offset="50%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
              </defs>
              <path
                fill="url(#pantryGradient)"
                d="m200-120-80-480h720l-80 480H200Zm67-80h426l51-320H216l51 320Zm133-160h160q17 0 28.5-11.5T600-400q0-17-11.5-28.5T560-440H400q-17 0-28.5 11.5T360-400q0 17 11.5 28.5T400-360ZM240-640q-17 0-28.5-11.5T200-680q0-17 11.5-28.5T240-720h480q17 0 28.5 11.5T760-680q0 17-11.5 28.5T720-640H240Zm80-120q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760H320Zm-53 560h426-426Z"
              />
            </svg>
          }
        />


        <TarjetaHub 
          href="/entrenamiento"
          titulo="Coach"
          colorConfig={{
            borderHover: "hover:border-blue-500",
            shadowHover: "hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]",
            bgHover: "bg-blue-500/5"
          }}
          icono={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 120 120"
              fill="none"
              aria-hidden="true"
              style={{ filter: "drop-shadow(0 0 12px rgba(59,130,246,0.3))" }}
            >
              <defs>
                <linearGradient id="gymBlue" x1="15" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60A5FA" />
                  <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="gymOrange" x1="70" y1="20" x2="110" y2="75" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FDE047" />
                  <stop offset="1" stopColor="#F97316" />
                </linearGradient>
              </defs>
              
              {/* Cabeza y pelo */}
              <path d="M39 32C35 19 44 9 58 10C70 10 78 18 76 30L71 39H43Z" fill="#1E3A8A" />
              <path d="M40 29C40 17 48 13 58 14C68 14 73 21 72 31L69 43C67 52 60 57 54 54C46 52 42 44 40 29Z" fill="#FDBA74" />
              
              {/* Pelo */}
              <path d="M39 31C36 19 45 9 58 10C68 10 76 17 76 27L67 23L61 27L54 22L46 30Z" fill="#172554" />
              
              {/* Cara */}
              <path d="M48 35L53 35" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M62 35L67 35" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M51 43Q58 50 65 42" stroke="#9A3412" strokeWidth="2.8" strokeLinecap="round" />
              
              {/* Cuello */}
              <path d="M49 52L49 61L64 61L63 51Z" fill="#FDBA74" />
              
              {/* Torso musculoso */}
              <path d="M43 57L30 62L20 79L30 89L39 76L36 108H80L76 76L86 89L96 78L82 62L67 56L58 63Z" fill="url(#gymBlue)" stroke="#93C5FD" strokeWidth="1.5" strokeLinejoin="round" />
              
              {/* Camiseta sin mangas */}
              <path d="M45 59L58 68L68 58L74 75L69 81L72 105H43L46 81L40 75Z" fill="#0F172A" />
              <path d="M49 61L58 69L65 61" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
              
              {/* Brazo izquierdo flexionado */}
              <path d="M34 66L24 75L15 65L19 54L26 47L29 36" stroke="#FDBA74" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M34 66L24 75L15 65" stroke="url(#gymBlue)" strokeWidth="5" strokeLinecap="round" />
              
              {/* Brazo derecho levantado */}
              <path d="M79 66L89 56L91 42" stroke="#FDBA74" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Mano con pulgar arriba */}
              <path d="M83 39L83 29Q83 24 87 24Q91 24 91 29L91 35L98 35Q103 35 103 40L101 55Q100 60 95 60L87 59Q82 58 82 53Z" fill="url(#gymOrange)" stroke="#FDBA74" strokeWidth="1.5" strokeLinejoin="round" />
              
              {/* Detalles de fuerza */}
              <path d="M14 35L18 31M11 43L16 42" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
              <path d="M99 19L103 15M105 26L110 25" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
              
              {/* Base */}
              <path d="M35 111H82" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
            </svg>
          }
        />

      </div>
    </main>
  );
}