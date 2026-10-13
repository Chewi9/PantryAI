import mongoose, { Schema } from "mongoose";

const PerfilSchema = new Schema({
  equipamiento: { type: String, default: "" }
});

// Como es una app personal, solo usaremos 1 perfil
export default mongoose.models.Perfil || mongoose.model("Perfil", PerfilSchema);