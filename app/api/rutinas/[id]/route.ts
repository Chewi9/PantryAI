import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Rutina from "@/models/Rutina";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    await Rutina.findByIdAndDelete(id);
    return NextResponse.json({ mensaje: "Rutina eliminada" });
  } catch (error) {
    return NextResponse.json({ error: "Error al borrar" }, { status: 500 });
  }
}