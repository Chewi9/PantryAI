import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Receta from "@/models/Receta";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    await Receta.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ mensaje: "Receta eliminada correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar la receta" }, { status: 500 });
  }
}