const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("User", userSchema);
