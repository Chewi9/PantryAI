import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import BotonEliminar from "@/components/BotonEliminar";
import BotonCamara from "@/components/BotonCamera";
import BotonAnadir from "@/components/BotonAnadir";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectToDatabase();
  
  const productosMongoose = await Product.find({}).sort({ fechaAgregado: -1 }).lean();
  
  const productos = productosMongoose.map((producto: any) => ({
    id: producto._id.toString(),
    nombre: producto.nombre,
    cantidad: producto.cantidad,
    unidad: producto.unidad,
  }));

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-emerald-500 text-white p-6 rounded-b-3xl shadow-md">
        <h1 className="text-3xl font-bold">Mi Armario</h1>
        <p className="text-emerald-100 mt-2">Lo que tienes en la cocina</p>
      </header>

      <div className="p-6">
        {productos.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>Tu armario está vacío.</p>
            <p>¡Toca el botón de la cámara para añadir tu compra!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {productos.map((producto: any) => (
              <li 
                key={producto.id} 
                className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100"
              >
                <span className="font-medium text-gray-800 capitalize flex-1">
                  {producto.nombre}
                </span>
                <span className="bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full text-sm font-semibold">
                  {producto.cantidad} {producto.unidad}
                </span>
                <BotonEliminar id={producto.id} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón flotante para ir al Nutricionista */}
      <Link 
        href="/plan"
        className="fixed bottom-8 left-8 bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center font-bold hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95"
      >
        Crear Menú
      </Link>

      <BotonAnadir />
      <BotonCamara />
    </main>
  );
}