import mongoose, { Schema, Document } from "mongoose";

const MenuSchema: Schema = new Schema({
  nombre: { type: String, default: "Menú Guardado" },
  fechaGuardado: { type: Date, default: Date.now },
  dias: [{
    dia: Number,
    comidas: [{
      tipo: String,
      receta: String,
      ingredientes_usados: [{
        id: String,
        nombre: String,
        cantidad: Number,
        unidad: String
      }]
    }]
  }]
});

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);