const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      // unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 180 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Otp", otpSchema);
