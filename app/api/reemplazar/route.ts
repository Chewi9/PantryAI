import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { tipo, utensilios, comensales } = await request.json();
    await connectToDatabase();
    const productosMongoose = await Product.find({}).lean();

    const listaIngredientes = productosMongoose
      .map((p: any) => `- ${p.nombre}: ${p.cantidad} ${p.unidad} (ID_BASE_DATOS: ${p._id.toString()})`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    
    // Le pedimos UNA sola receta alternativa
    const prompt = `Eres un nutricionista experto. Tengo estos ingredientes:
    ${listaIngredientes}

    Dispongo de estos utensilios: ${utensilios || "sartén y olla básica"}.

    Genera UNA sola receta alternativa y diferente para un(a) ${tipo} (Desayuno, Comida o Cena) para ${comensales || 1} personas usando lo que tengo.

    Devuelve ÚNICAMENTE un JSON estricto con esta estructura exacta:
    {
      "tipo": "${tipo}",
      "receta": "Nombre del plato nuevo",
      "ingredientes_usados": [
        { "id": "ID_BASE_DATOS_DEL_PRODUCTO", "nombre": "patatas", "cantidad": 200, "unidad": "g" }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al reemplazar:", error);
    return NextResponse.json({ error: "Error al generar alternativa" }, { status: 500 });
  }
}