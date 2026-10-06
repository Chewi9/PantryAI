import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { dias, utensilios } = await request.json();

    await connectToDatabase();
    const productosMongoose = await Product.find({}).lean();
    
    if (productosMongoose.length === 0) {
      return NextResponse.json(
        { error: "No tienes productos en el armario para generar un plan." }, 
        { status: 400 }
      );
    }

    // Le pasamos a la IA el ID exacto de la base de datos para que nos lo devuelva
    const listaIngredientes = productosMongoose
      .map((p: any) => `- ${p.nombre}: ${p.cantidad} ${p.unidad} (ID_BASE_DATOS: ${p._id.toString()})`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    const prompt = `Eres un nutricionista experto. Tengo estos ingredientes: 
    ${listaIngredientes}
    
    Dispongo de estos utensilios: ${utensilios || "sartén y olla básica"}.
    
    Crea un plan de comidas de ${dias} días usando PRINCIPALMENTE lo que tengo. Las cantidades que pongas en "ingredientes_usados" DEBEN SER EXACTAS (en gramos, kg, o unidades) y realistas para una ración.
    
    Devuelve ÚNICAMENTE un JSON estricto con esta estructura exacta:
    {
      "plan": [
        {
          "dia": 1,
          "comidas": [
            { 
              "tipo": "Comida", 
              "receta": "Pollo con patatas", 
              "ingredientes_usados": [
                { "id": "ID_BASE_DATOS_DEL_PRODUCTO", "nombre": "patatas", "cantidad": 200, "unidad": "g" }
              ] 
            }
          ]
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error generando el plan:", error);
    return NextResponse.json({ error: "Hubo un error al generar la dieta" }, { status: 500 });
  }
}