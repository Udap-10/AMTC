import mongoose from "mongoose";

const animalCategorySchema = new mongoose.Schema({
  slNo: {
    type: Number,
    required: true,
    unique: true,
  },
  animal: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

const AnimalCategory =
  mongoose.models.AnimalCategory ||
  mongoose.model("AnimalCategory", animalCategorySchema);

export default AnimalCategory;
