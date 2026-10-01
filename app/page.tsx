import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import BotonEliminar from "@/components/BotonEliminar";

// Esta función obliga a Next.js a actualizar la página cada vez que entramos
export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Conectamos a la base de datos y buscamos todos los productos
  await connectToDatabase();
  
  // lean() convierte los documentos de MongoDB a objetos de JavaScript normales
  const productos = await Product.find({}).sort({ fechaAgregado: -1 }).lean();

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Cabecera de la App */}
      <header className="bg-emerald-500 text-white p-6 rounded-b-3xl shadow-md">
        <h1 className="text-3xl font-bold">Mi Armario 🍎</h1>
        <p className="text-emerald-100 mt-2">Lo que tienes en la cocina</p>
      </header>

      {/* Lista de productos */}
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
                key={producto._id.toString()} 
                className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100"
              >
                <span className="font-medium text-gray-800 capitalize">
                  {producto.nombre}
                </span>
                <span className="bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full text-sm font-semibold">
                  {producto.cantidad} {producto.unidad}
                </span>
                <BotonEliminar id={producto._id.toString()} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón flotante para escanear/cámara */}
      <button className="fixed bottom-8 right-8 bg-emerald-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-emerald-700 transition-transform hover:scale-105 active:scale-95">
        📷
      </button>
    </main>
  );
}