import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employeeAuth",
    required: true,
    unique: true,
  }, // Link to auth schema
  username: {
    type: String,
    unique: true,
    sparse: true, // ✅ Allows multiple `null` values without uniqueness conflicts
  },
  address: { type: String, required: false }, // Not required initially
  dob: { type: Date, required: false }, // Not required initially
  phoneNumber: { type: String, required: false, unique: true },
  profilePhoto: { type: String, required: false }, // Stores image URL or base64
});
const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
