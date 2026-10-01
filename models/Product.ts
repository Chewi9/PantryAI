import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  nombre: string;
  cantidad: number;
  unidad: string; // ej: "kg", "unidades", "litros"
  fechaAgregado: Date;
}

const ProductSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true, default: 1 },
  unidad: { type: String, required: true, default: "unidades" },
  fechaAgregado: { type: Date, default: Date.now },
});

// Esto evita que Next.js intente compilar el modelo varias veces y dé error
export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);