import mongoose, { Schema, Document } from "mongoose";

export interface IReceta extends Document {
  tipo: string;
  nombre: string;
  ingredientes: { id: string; nombre: string; cantidad: number; unidad: string }[];
  fechaGuardado: Date;
}

const RecetaSchema: Schema = new Schema({
  tipo: { type: String, required: true },
  nombre: { type: String, required: true },
  ingredientes: [{
    id: String, // Añadimos el ID para poder descontarlo del armario
    nombre: String,
    cantidad: Number,
    unidad: String
  }],
  fechaGuardado: { type: Date, default: Date.now },
});

export default mongoose.models.Receta || mongoose.model<IReceta>("Receta", RecetaSchema);