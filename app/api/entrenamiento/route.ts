import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { dias, objetivo, equipamiento } = await request.json();
    
    // 1. LEER TUS EJERCICIOS DISPONIBLES DESDE EL SERVIDOR
    const filePath = path.join(process.cwd(), "public", "pt-BR.json");
    let listaEjercicios = "";
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const diccionario = JSON.parse(fileContent);
      listaEjercicios = Object.values(diccionario).join(", ");
    } catch (error) {
      console.log("No se pudo leer pt-BR.json en el servidor.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    // 2. EL NUEVO PROMPT BLINDADO (DOBLE REGLA)
    const prompt = `Eres un entrenador personal de élite. Crea una rutina de gimnasio estructurada de ${dias} días.
    Objetivo: ${objetivo}.
    Equipamiento EXACTO disponible del usuario: ${equipamiento || "Solo peso corporal y mancuernas"}.

    REGLAS DE ORO ESTRICTAS (SI INCUMPLES UNA, EL SISTEMA FALLARÁ):
    1. FILTRO DE EQUIPAMIENTO (PRIORIDAD 1): Es ABSOLUTAMENTE OBLIGATORIO que todos los ejercicios se puedan hacer con el equipamiento disponible. Si el usuario no tiene un equipo (ej: barra olímpica libre), busca una alternativa lógica con lo que SÍ tiene (ej: máquina Smith o mancuernas).
    2. FILTRO DE BASE DE DATOS (PRIORIDAD 2): Los ejercicios seleccionados DEBEN existir exactamente en esta lista:
    [${listaEjercicios}]

    ¡CRÍTICO! El ejercicio que elijas tiene que cumplir AMBAS reglas. No asumas que tiene equipamiento extra ni inventes nombres fuera de la lista.

    REGLAS DE IDIOMA PARA EL JSON:
    1. "nombre_pt": DEBE ser el nombre exacto extraído de la lista anterior (copiado tal cual en portugués).
    2. "nombre": DEBE ser tu traducción al Español (ej: "Press de banca con mancuernas").
    3. "instrucciones": Array de textos explicando paso a paso en Español cómo se hace.
    4. "notas": Breve consejo de técnica en Español.

    Devuelve ÚNICAMENTE un JSON estricto con esta estructura exacta:
    {
      "rutina": [
        {
          "dia": 1,
          "grupoMuscular": "Pecho y Tríceps",
          "ejercicios": [
            { 
              "nombre": "Press de banca con mancuernas",
              "nombre_pt": "supino reto com halteres", 
              "series": 4, 
              "repeticiones": "10-12", 
              "notas": "Controlar la fase excéntrica (bajada)",
              "instrucciones": [
                "Acuéstate en el banco con una mancuerna en cada mano.",
                "Empuja las mancuernas hacia arriba hasta extender los brazos.",
                "Baja lentamente hasta que las mancuernas toquen el pecho."
              ]
            }
          ]
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fallo al generar la rutina" }, { status: 500 });
  }
}