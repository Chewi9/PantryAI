import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    // Creamos el producto con los datos que manda el usuario
    const nuevoProducto = await Product.create({
      nombre: body.nombre,
      cantidad: body.cantidad,
      unidad: body.unidad || "unidades",
    });

    return NextResponse.json({ mensaje: "Producto añadido", producto: nuevoProducto });
  } catch (error) {
    console.error("Error al añadir manualmente:", error);
    return NextResponse.json({ error: "Error al añadir el producto" }, { status: 500 });
  }
}