import mongoose, { Schema } from "mongoose";

const RutinaSchema = new Schema({
  nombre: { type: String, default: "Mi Rutina" },
  fechaGuardado: { type: Date, default: Date.now },
  dias: [{
    dia: Number,
    grupoMuscular: String,
    ejercicios: [{
      nombre: String,
      nombre_pt: String, // ¡Este es clave para las fotos!
      series: Number,
      repeticiones: String,
      notas: String,
      instrucciones: [String] // ¡Este es clave para el paso a paso!
    }]
  }]
});

export default mongoose.models.Rutina || mongoose.model("Rutina", RutinaSchema);