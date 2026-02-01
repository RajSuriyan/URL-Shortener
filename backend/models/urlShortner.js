const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  originalUrl: {type: String, unique: true, required: true},
  count:{type:Number}
}, { timestamps: true });

module.exports = mongoose.model("urlShortner", userSchema);