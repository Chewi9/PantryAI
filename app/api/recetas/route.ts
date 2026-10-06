import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Receta from "@/models/Receta";

// Para leer todas las recetas guardadas (lo usaremos en el siguiente paso)
export async function GET() {
  try {
    await connectToDatabase();
    const recetas = await Receta.find({}).sort({ fechaGuardado: -1 }).lean();
    return NextResponse.json(recetas);
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar recetas" }, { status: 500 });
  }
}

// Para guardar una receta nueva
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const nuevaReceta = await Receta.create(body);
    return NextResponse.json({ mensaje: "¡Receta guardada!", receta: nuevaReceta });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar la receta" }, { status: 500 });
  }
}