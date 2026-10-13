import mongoose, { Schema } from "mongoose";

const RutinaSchema = new Schema({
  nombre: { type: String, default: "Mi Rutina" },
  fechaGuardado: { type: Date, default: Date.now },
  dias: [{
    dia: Number,
    grupoMuscular: String,
    ejercicios: [{
      nombre: String,
      nombre_pt: String, 
      series: Number,
      repeticiones: String,
      notas: String,
      instrucciones: [String]
    }]
  }]
});

export default mongoose.models.Rutina || mongoose.model("Rutina", RutinaSchema);