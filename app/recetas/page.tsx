import connectToDatabase from "@/lib/mongodb";
import Receta from "@/models/Receta";
import Link from "next/link";
import TarjetaReceta from "@/components/TarjetaReceta";

export const dynamic = "force-dynamic";

export default async function RecetasPage() {
  await connectToDatabase();
  const recetasMongoose = await Receta.find({}).sort({ fechaGuardado: -1 }).lean();
  
  // EL TRUCO: Convertimos todo a JSON plano para destruir los objetos de Mongoose
  const recetasPlanas = JSON.parse(JSON.stringify(recetasMongoose));
  
  const recetas = recetasPlanas.map((r: any) => ({
    id: r._id,
    tipo: r.tipo,
    nombre: r.nombre,
    ingredientes: r.ingredientes,
    fechaGuardado: r.fechaGuardado
  }));

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-emerald-600 text-white p-6 rounded-b-3xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mis Recetas 📖</h1>
          <p className="text-emerald-100 mt-1">Tu recetario personal</p>
        </div>
        <Link href="/" className="bg-emerald-700 p-2 rounded-lg hover:bg-emerald-800 transition">
          ⬅️ Armario
        </Link>
      </header>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {recetas.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-5xl mb-4">🍽️</p>
            <p>No tienes recetas guardadas.</p>
            <p className="mt-2 text-sm">Genera un menú y pulsa "Guardar" para que aparezcan aquí.</p>
          </div>
        ) : (
          recetas.map((receta: any) => (
            <TarjetaReceta key={receta.id} receta={receta} />
          ))
        )}
      </div>
    </main>
  );
}