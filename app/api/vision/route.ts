import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("imagen") as File;
    if (!file) return NextResponse.json({ error: "No hay imagen" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Usamos el modelo nuevo que te funcionó en el planificador
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    const prompt = `Analiza esta foto de ingredientes o ticket. Devuelve ÚNICAMENTE un JSON con esta estructura exacta: {"productos": [{"nombre": "manzanas", "cantidad": 3, "unidad": "unidades"}]}. Deduce la unidad (kg, unidades, litros). NO uses markdown ni bloques de código, solo texto JSON puro.`;

    const imagePart = {
      inlineData: { data: buffer.toString("base64"), mimeType: file.type }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();

    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    await connectToDatabase();
    if (data.productos && data.productos.length > 0) {
      await Product.insertMany(data.productos);
    }

    return NextResponse.json({ mensaje: "OK" });
  } catch (error) {
    console.error("Error en visión:", error);
    return NextResponse.json({ error: "Fallo al procesar imagen" }, { status: 500 });
  }
}