import mongoose from "mongoose";

const SystemSchema = new mongoose.Schema({
  systemID: { type: Number, required: true, unique: true }, // Primary Key
  CID: {
    type: String,
    required: true,
    unique: true,
    ref: "User", // Establishing CID as a foreign key reference
  },
  installationDate: { type: Date, required: true },
  camera: { type: String, enum: ["Enabled", "Disabled"] },
  gsm: { type: String, enum: ["On", "Off"] },
  raspberryPi: {
    type: String,
    required: true,
  },
});

// Ensure a single instance of the model
export default mongoose.models.System || mongoose.model("System", SystemSchema);
