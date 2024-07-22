import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, min: 6, max: 255, required: true },
  email: { type: String, min: 6, max: 255, required: true, unique: true },
  password: { type: String, min: 6, max: 1000, required: true },
  status: { type: String, min: 6, max: 255, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: false },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
