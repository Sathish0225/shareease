import mongoose from "mongoose";

const { Schema } = mongoose;

const fileSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ownerEmail: { type: String, required: true },
  shared: [{ type: String, ref: "User" }],
  download: { type: String, required: true },
  size: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: false },
});

const File = mongoose.models.File || mongoose.model("File", fileSchema);

export default File;
