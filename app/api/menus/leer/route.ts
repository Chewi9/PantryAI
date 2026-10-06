import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Menu from "@/models/Menu";

export async function GET() {
  await connectToDatabase();
  const menus = await Menu.find({}).sort({ fechaGuardado: -1 });
  return NextResponse.json(menus);
}