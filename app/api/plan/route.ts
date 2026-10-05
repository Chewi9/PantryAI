import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    // Ahora también recibimos los utensilios
    const { dias, utensilios } = await request.json();

    await connectToDatabase();
    const productosMongoose = await Product.find({}).lean();
    
    if (productosMongoose.length === 0) {
      return NextResponse.json(
        { error: "No tienes productos en el armario para generar un plan." }, 
        { status: 400 }
      );
    }

    const listaIngredientes = productosMongoose
      .map((p: any) => `${p.cantidad} ${p.unidad} de${p.nombre}`)
      .join(", ");

    // Añadimos la restricción de los utensilios al prompt
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    const prompt = `Eres un nutricionista experto. Tengo estos ingredientes en mi cocina: ${listaIngredientes}. 
    Además, dispongo ÚNICAMENTE de estos utensilios de cocina: ${utensilios || "sartén y olla básica"}.
    
    Crea un plan de comidas muy saludable de ${dias} días usando principalmente estos ingredientes (puedes añadir básicos como sal, aceite o agua).
    Asegúrate de que TODAS las recetas se puedan cocinar con los utensilios indicados. Si no tengo horno, no pongas cosas al horno.
    Para cada día, incluye Desayuno, Comida y Cena. Prioriza el alto valor nutricional.
    
    Devuelve el resultado ÚNICAMENTE en formato JSON estricto con esta estructura exacta:
    {
      "plan": [
        {
          "dia": 1,
          "comidas": [
            { "tipo": "Desayuno", "receta": "Nombre del plato", "ingredientes": ["2 huevos", "1 tomate"] },
            { "tipo": "Comida", "receta": "Nombre del plato", "ingredientes": ["100g de arroz", "pollo"] },
            { "tipo": "Cena", "receta": "Nombre del plato", "ingredientes": ["ensalada"] }
          ]
        }
      ]
    }
    No uses markdown, no escribas \`\`\`json, solo devuelve el texto JSON puro.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error generando el plan:", error);
    return NextResponse.json(
      { error: "Hubo un error al generar la dieta" }, 
      { status: 500 }
    );
  }
}