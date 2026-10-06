import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Menu from "@/models/Menu";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    await Menu.create(body);
    return NextResponse.json({ mensaje: "¡Menú guardado!" });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar el menú" }, { status: 500 });
  }
}