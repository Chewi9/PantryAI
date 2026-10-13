"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BotonEliminar({ id }: { id: string }) {
  const [borrando, setBorrando] = useState(false);
  const router = useRouter();

  const eliminarProducto = async () => {
    setBorrando(true);

    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    
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