"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function BotonCamara() {
  const [analizando, setAnalizando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const manejarSubida = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalizando(true);
    const formData = new FormData();
    formData.append("imagen", file);

    try {
      await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });
      // Recargamos la página para ver los nuevos productos
      router.refresh();
    } catch (error) {
      alert("Hubo un error al analizar la imagen.");
    } finally {
      setAnalizando(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        capture="environment" // Esto fuerza a abrir la cámara trasera en el móvil
        ref={fileInputRef}
        onChange={manejarSubida}
        className="hidden"
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={analizando}
        className="fixed bottom-8 right-8 bg-emerald-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-emerald-700 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
      >
        {analizando ? "⏳" : "📷"}
      </button>
    </>
  );
}