const mongoose = require("mongoose");
const { Schema } = mongoose;


const RefreshTokenSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  token: { type: String, unique: true, index: true },
  expiresAt: { type: Date, index: { expireAfterSeconds: 0 } }, // TTL
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);