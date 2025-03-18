import mongoose from "mongoose";

const SystemSchema = new mongoose.Schema({
  systemID: {
    type: String,
    required: true,
    unique: true, // Primary Key
  },
  systemName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  macAddress: {
    type: String,
    required: true,
    unique: true,
  },
  installationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const SystemAdmin =
  mongoose.models.SystemAdmin || mongoose.model("SystemAdmin", SystemSchema);
