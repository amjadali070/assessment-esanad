import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  joinDate: { type: Date, required: true },
});

export default mongoose.model("Employee", employeeSchema);
