import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(request: Request) {
  try {
    const { ingredientesUsados } = await request.json();
    await connectToDatabase();

    // Recorremos todos los ingredientes que manda la receta
    for (const ingrediente of ingredientesUsados) {
      // Si la receta es antigua o no tiene ID, nos la saltamos para no romper nada
      if (!ingrediente.id || ingrediente.id.includes("ID_BASE_DATOS")) continue;

      const productoOriginal = await Product.findById(ingrediente.id);
      
      if (productoOriginal) {
        let cantidadARestar = ingrediente.cantidad;
        const unidadOriginal = productoOriginal.unidad.toLowerCase();
        const unidadReceta = ingrediente.unidad.toLowerCase();

        // CONVERSOR DE UNIDADES INTELIGENTE
        if (unidadOriginal === "kg" && (unidadReceta === "g" || unidadReceta === "gramos")) {
          cantidadARestar = ingrediente.cantidad / 1000;
        } else if ((unidadOriginal === "g" || unidadOriginal === "gramos") && unidadReceta === "kg") {
          cantidadARestar = ingrediente.cantidad * 1000;
        } else if (unidadOriginal === "litros" && (unidadReceta === "ml" || unidadReceta === "mililitros")) {
          cantidadARestar = ingrediente.cantidad / 1000;
        } else if ((unidadOriginal === "ml" || unidadOriginal === "mililitros") && unidadReceta === "litros") {
          cantidadARestar = ingrediente.cantidad * 1000;
        }

        // Hacemos la resta con las unidades ya igualadas
        const nuevaCantidad = productoOriginal.cantidad - cantidadARestar;

        // Si queda 0 o negativo (con un margen de 0.01 por decimales), lo borramos
        if (nuevaCantidad <= 0.01) {
          await Product.findByIdAndDelete(ingrediente.id);
        } else {
          // Si sobra, actualizamos y redondeamos a 2 decimales (ej: 0.8 kg)
          await Product.findByIdAndUpdate(ingrediente.id, { 
            cantidad: parseFloat(nuevaCantidad.toFixed(2)) 
          });
        }
      }
    }

    return NextResponse.json({ mensaje: "¡Armario actualizado con éxito!" });
  } catch (error) {
    console.error("Error al descontar ingredientes:", error);
    return NextResponse.json({ error: "Error al actualizar el armario" }, { status: 500 });
  }
}