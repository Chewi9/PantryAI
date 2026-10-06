"use client"; // Lo hacemos de cliente para poder usar los botones de cocinado directamente

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecetasPage() {
  const [menus, setMenus] = useState<any[]>([]);

  // Cargamos los menús al entrar
  const cargarMenus = async () => {
    const res = await fetch("/api/menus/leer"); // Necesitaremos crear esta rutita rápida
    if (res.ok) {
      const data = await res.json();
      setMenus(data);
    }
  };

  useEffect(() => { cargarMenus(); }, []);

  // La misma función de cocinar que tienes en el plan
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
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-emerald-600 text-white p-6 rounded-b-3xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mis Menús 📖</h1>
          <p className="text-emerald-100 mt-1">Semanas planificadas</p>
        </div>
        <Link href="/" className="bg-emerald-700 p-2 rounded-lg hover:bg-emerald-800 transition">
          ⬅️ Armario
        </Link>
      </header>

      <div className="p-6 max-w-md mx-auto space-y-8">
        {menus.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No tienes menús guardados.</p>
        ) : (
          menus.map((menu: any) => (
            <div key={menu._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
              <div className="bg-blue-600 px-4 py-3 text-white font-bold text-lg">
                {menu.nombre}
              </div>
              
              <div className="p-4 space-y-6">
                {menu.dias.map((diaInfo: any, dIndex: number) => (
                  <div key={dIndex}>
                    <h4 className="font-bold text-emerald-600 mb-3 border-b pb-1">Día {diaInfo.dia}</h4>
                    <div className="space-y-4">
                      {diaInfo.comidas.map((comida: any, cIndex: number) => (
                        <div key={cIndex} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{comida.tipo}</p>
                            <p className="text-gray-600 text-sm">{comida.receta}</p>
                          </div>
                          <button 
                            onClick={() => cocinarReceta(comida)}
                            className="bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-bold active:scale-95"
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