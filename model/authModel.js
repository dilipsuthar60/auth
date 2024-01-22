const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    maxLength: 20,
  },
  email: {
    type: String,
    maxLength: 50,
  },
  password: {
    type: String,
    maxLength: 100,
  },
  service: {
    chatBot: { type: Boolean, default: true },
    imaganary: { type: Boolean, default: true },
    aiDashboard: { type: Boolean, default: true }
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const auth = mongoose.model("auth", authSchema);

module.exports = auth;