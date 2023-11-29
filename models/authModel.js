const mongoose = require("mongoose");

const authSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Please add email"],
    },
    password: {
      type: String,
      required: [true, "Please add password"],
    },
    role: {
      type: String,
      enum: ['user', 'admin']
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("auth", authSchema);
