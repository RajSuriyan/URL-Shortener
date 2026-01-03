const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true }, // hashed
  refreshTokens: [String],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);