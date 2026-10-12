import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Perfil from "@/models/Perfil";

export async function GET() {
  await connectToDatabase();
  let perfil = await Perfil.findOne();
  if (!perfil) perfil = await Perfil.create({ equipamiento: "" }); // Lo crea si es la primera vez
  return NextResponse.json(perfil);
}

export async function POST(request: Request) {
  const { equipamiento } = await request.json();
  await connectToDatabase();
  let perfil = await Perfil.findOne();
  
  if (perfil) {
    perfil.equipamiento = equipamiento;
    await perfil.save();
  } else {
    await Perfil.create({ equipamiento });
  }
  return NextResponse.json({ mensaje: "Equipamiento guardado" });
}