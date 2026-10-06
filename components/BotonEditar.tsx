"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BotonEditar({ id, nombreActual, cantidadActual, unidadActual }: any) {
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState(nombreActual);
  const [cantidad, setCantidad] = useState(cantidadActual);
  const [unidad, setUnidad] = useState(unidadActual);
  const [guardando, setGuardando] = useState(false);
  const router = useRouter();

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      await fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, cantidad, unidad }),
      });
      
      setAbierto(false);
      router.refresh(); // Recarga los datos
    } catch (error) {
      alert("Error al actualizar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setAbierto(true)}
        className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-lg active:scale-95 transition-transform"
        title="Editar producto"
      >
        ✏️
      </button>

      {abierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">Editar Producto</h2>
            
            <form onSubmit={guardarCambios} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cantidad</label>
                  <input 
                    type="number" 
                    step="any"
                    required
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unidad</label>
                  <select 
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="px-5 py-3 font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}