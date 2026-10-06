import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    
    // Buscamos el producto por su ID y lo eliminamos
    await Product.findByIdAndDelete(resolvedParams.id);
    
    return NextResponse.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando:", error);
    return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const resolvedParams = await params;
    
    await Product.findByIdAndUpdate(resolvedParams.id, {
      nombre: body.nombre,
      cantidad: body.cantidad,
      unidad: body.unidad
    });
    
    return NextResponse.json({ mensaje: "Producto actualizado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}