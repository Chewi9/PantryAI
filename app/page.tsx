import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import BotonEliminar from "@/components/BotonEliminar";
import BotonCamara from "@/components/BotonCamera";
import BotonAnadir from "@/components/BotonAnadir";
import BotonEditar from "@/components/BotonEditar";


export const dynamic = "force-dynamic";

export default async function Home() {
  await connectToDatabase();
  
  const productosMongoose = await Product.find({}).sort({ fechaAgregado: -1 }).lean();
  
  const productosPlanos = JSON.parse(JSON.stringify(productosMongoose));

  const productos = productosPlanos.map((producto: any) => ({
    id: producto._id.toString(),
    nombre: producto.nombre,
    cantidad: producto.cantidad,
    unidad: producto.unidad,
  }));

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-emerald-500 text-white p-6 rounded-b-3xl shadow-md">
        <h1 className="text-3xl font-bold">PantryAI</h1>
        <p className="text-emerald-100 mt-2">Lo que tienes en la estantería</p>
      </header>

      <div className="p-6">
        {productos.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>Tu estante está vacío.</p>
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

                <div className="flex gap-1">

                  <BotonEditar id={producto.id} nombreActual={producto.nombre} cantidadActual={producto.cantidad} unidadActual={producto.unidad} />
                
                  <BotonEliminar id={producto.id} />

                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link 
        href="/recetas"
        className="fixed bottom-24 left-8 bg-amber-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center font-bold hover:bg-amber-600 transition-transform hover:scale-105 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-80q-33 0-56.5-23.5T160-160v-80h-40v-80h40v-120h-40v-80h40v-120h-40v-80h40v-80q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640H240v80h40v80h-40v120h40v80h-40v120h40v80h-40v80Zm0 0v-640 640Zm140-120h60v-160q26-7 43-28.5t17-48.5v-163h-40v151h-30v-151h-40v151h-30v-151h-40v163q0 27 17 48.5t43 28.5v160Zm220 0h60v-400q-50 0-85 35t-35 85v120h60v160Z"/></svg> 
        Mis Menús
      </Link>

      <Link 
        href="/plan"
        className="fixed bottom-8 left-8 bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center font-bold hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 45 C12 39 13 27 22 24 C30 21 36 30 36 38"/><path d="M78 45 C88 39 87 27 78 24 C70 21 64 30 64 38"/><path d="M25 48 C25 37 35 34 50 34 C65 34 75 37 75 48 L78 62 C78 76 65 83 50 83 C35 83 22 76 22 62 Z"/><path d="M31 34 C26 27 30 19 38 19 C39 8 51 7 56 17 C64 12 73 19 69 29 L66 35"/><path d="M31 34 Q50 39 69 34"/><path d="M34 49 Q39 45 44 49 M56 49 Q61 45 66 49"/><circle cx="39" cy="51" r="1.5" fill="currentColor" stroke="none"/><circle cx="61" cy="51" r="1.5" fill="currentColor" stroke="none"/><ellipse cx="50" cy="63" rx="12" ry="8"/><path d="M45 61 Q50 56 55 61 Q50 67 45 61 Z" fill="currentColor" stroke="none"/><path d="M38 67 Q50 74 62 67"/><path d="M28 59 L13 55 M28 64 L12 65 M72 59 L87 55 M72 64 L88 65"/><path d="M30 78 Q23 84 17 80 M70 78 Q77 84 83 80"/><path d="M39 83 L37 89 M61 83 L63 89"/><path d="M29 91 Q37 85 45 91 M55 91 Q63 85 71 91"/></svg>        
        
        Acceder a Remya
      </Link>

      <BotonAnadir />
      <BotonCamara />
    </main>
  );
}