// models/SystemDetails.js
const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema({
  systemID: {
    type: String,
    required: true,
    unique: true,
  },
  systemName: {
    type: String,
    required: false,
  },
  systemPassword: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

// ✅ Prevent OverwriteModelError
module.exports =
  mongoose.models.SystemDetails ||
  mongoose.model("SystemDetails", SystemSchema);
