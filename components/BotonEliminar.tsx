"use client"; // Esto le dice a Next.js que este componente usa interactividad

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BotonEliminar({ id }: { id: string }) {
  const [borrando, setBorrando] = useState(false);
  const router = useRouter();

  const eliminarProducto = async () => {
    setBorrando(true);
    // Llamamos a la API que creamos en el Paso 1
    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    
    // Recargamos los datos de la página silenciosamente
    router.refresh();
  };

  return (
    <button
      onClick={eliminarProducto}
      disabled={borrando}
      className="ml-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg active:scale-95 transition-transform"
      title="Eliminar producto"
    >
      {borrando ? "⏳" : "🗑️"}
    </button>
  );
}