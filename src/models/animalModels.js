import mongoose from "mongoose";

const AnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  Time: {
    type: String,
    required: false,
  },
  Longitude: {
    type: Number,
    required: false,
    default: null,
  },
  Latitude: {
    type: Number,
    required: false,
    default: null,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// ✅ Prevent OverwriteModelError
const Animal = mongoose.models.Animal || mongoose.model("Animal", AnimalSchema);

export default Animal;
