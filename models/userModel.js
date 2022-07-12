const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
