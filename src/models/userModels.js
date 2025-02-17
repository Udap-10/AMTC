import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  CID: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true, unique: true },
  Dzongkhag: { type: String, default: "" },
  Gewog: { type: String, default: "" },
  Village: { type: String, default: "" },
  animals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Animal" }],
  systemID: {
    type: Number, // Keep as Number
    ref: "System",
    unique: true,
    default: null, // Set default value to null if no systemID is assigned
  },
  isSystemLinked: { type: Boolean, default: false }, // New field
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
