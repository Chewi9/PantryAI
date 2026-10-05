"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BotonAnadir() {
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [unidad, setUnidad] = useState("unidades");
  const [guardando, setGuardando] = useState(false);
  const router = useRouter();

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    if (!nombre.trim()) return;
    
    setGuardando(true);

    try {
      await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, cantidad, unidad }),
      });
      
      // Reseteamos el formulario y lo cerramos
      setNombre("");
      setCantidad(1);
      setUnidad("unidades");
      setAbierto(false);
      router.refresh(); // Recarga la lista del armario
    } catch (error) {
      alert("Hubo un error al guardar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      {/* Botón flotante "+" (Posicionado a la izquierda de la cámara) */}
      <button 
        onClick={() => setAbierto(true)}
        className="fixed bottom-8 right-28 bg-emerald-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-4xl pb-1 hover:bg-emerald-600 transition-transform hover:scale-105 active:scale-95"
      >
        +
      </button>

      {/* Ventana Flotante (Modal) */}
      {abierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">Añadir Producto</h2>
            
            <form onSubmit={guardarProducto} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">¿Qué has comprado?</label>
                <input 
                  type="text" 
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Ej: Tomate, Arroz..."
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cantidad</label>
                  <input 
                    type="number" 
                    min="0.1"
                    step="any"
                    required
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unidad</label>
                  <select 
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="unidades">Unidades</option>
                    <option value="kg">Kg</option>
                    <option value="g">g</option>
                    <option value="litros">Litros</option>
                    <option value="ml">ml</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setAbierto(false)}
                  className="px-5 py-3 font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-3 font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : "Añadir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}