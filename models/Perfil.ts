import mongoose, { Schema } from "mongoose";

const PerfilSchema = new Schema({
  // Aquí guardaremos las máquinas que tienes en tu gimnasio
  equipamiento: { type: String, default: "" }
});

// Como es una app personal, solo usaremos 1 perfil
export default mongoose.models.Perfil || mongoose.model("Perfil", PerfilSchema);