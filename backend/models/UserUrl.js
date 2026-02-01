const mongoose = require("mongoose");
const { Schema } = mongoose;

const userUrlSchema = new Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true }, // hashed
  refreshTokens: [String],
  ShortUrls:[String],
}, { timestamps: true });

module.exports = mongoose.model("UserUrl", userUrlSchema);