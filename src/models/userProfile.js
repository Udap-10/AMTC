import mongoose from "mongoose";

const ProfilePictureSchema = new mongoose.Schema({
  contactNumber: {
    type: String,
    required: true,
    unique: true,
    ref: "User", // Reference to the User schema
  },
  myFile: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

// ✅ Fix: Prevent Mongoose from recompiling the model
const ProfileModel =
  mongoose.models.profiles || mongoose.model("profiles", ProfilePictureSchema);

export default ProfileModel;
