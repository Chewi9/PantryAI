import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Rutina from "@/models/Rutina";

export async function GET() {
  await connectToDatabase();
  const rutinas = await Rutina.find().sort({ fechaGuardado: -1 }); // Las más nuevas primero
  return NextResponse.json(rutinas);
}

export async function POST(request: Request) {
  const body = await request.json();
  await connectToDatabase();
  const nuevaRutina = await Rutina.create(body);
  return NextResponse.json({ mensaje: "Rutina guardada", id: nuevaRutina._id });
}