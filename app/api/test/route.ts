import { NextResponse } from "next/server";
// Usamos @/ para ir directo a la raíz del proyecto, mucho más limpio
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    // 1. Conectamos a la base de datos
    await connectToDatabase();

    // 2. Creamos un producto de prueba
    const testProduct = await Product.create({
      nombre: "Tomate de prueba",
      cantidad: 3,
      unidad: "unidades"
    });

    // 3. Devolvemos un mensaje de éxito
    return NextResponse.json({ 
      mensaje: "¡Conexión exitosa! Producto guardado en MongoDB.", 
      producto: testProduct 
    });

  } catch (error) {
    console.error("Error en la conexión:", error);
    return NextResponse.json(
      { error: "Error conectando a la base de datos" }, 
      { status: 500 }
    );
  }
}