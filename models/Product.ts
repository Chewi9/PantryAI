import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  nombre: string;
  cantidad: number;
  unidad: string;
  fechaAgregado: Date;
}

const ProductSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true, default: 1 },
  unidad: { type: String, required: true, default: "unidades" },
  fechaAgregado: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);