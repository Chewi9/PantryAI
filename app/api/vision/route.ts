import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

// Inicializamos Gemini con tu clave
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("imagen") as File;
    
    if (!file) return NextResponse.json({ error: "No hay imagen" }, { status: 400 });

    // Convertimos la imagen al formato que entiende Gemini
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageParts = [{
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: file.type
      }
    }];

    // Le damos las instrucciones (Prompt) a la IA
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analiza esta foto de productos de cocina o ticket de compra. 
    Devuelve ÚNICAMENTE un objeto JSON válido con una lista de los productos que veas. 
    Usa exactamente esta estructura: {"productos": [{"nombre": "manzanas", "cantidad": 3, "unidad": "unidades"}]}. 
    Intenta deducir la unidad ("kg", "unidades", "litros"). No uses markdown, solo texto JSON puro.`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const text = result.response.text();
    
    // Limpiamos la respuesta por si la IA añade backticks (```json ...)
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    // Guardamos los productos detectados en MongoDB
    await connectToDatabase();
    if (data.productos && data.productos.length > 0) {
      await Product.insertMany(data.productos);
    }

    return NextResponse.json({ mensaje: "¡Productos analizados y guardados!", productos: data.productos });
  } catch (error) {
    console.error("Error en visión:", error);
    return NextResponse.json({ error: "Error procesando la imagen" }, { status: 500 });
  }
}