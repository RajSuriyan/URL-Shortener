const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true }, // hashed
  userName:{ type: String, required: true },
  ShortUrls:[String],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);