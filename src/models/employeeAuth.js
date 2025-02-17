import mongoose from "mongoose";

const signupSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  passwordResetToken: { type: String, default: null }, // To store the reset token
  passwordResetExpires: { type: Date, default: null }, // To store the expiration time of the reset token
});

// Check if the model already exists before defining it
const employeeAuth =
  mongoose.models.employeeAuth || mongoose.model("employeeAuth", signupSchema);

export default employeeAuth;
