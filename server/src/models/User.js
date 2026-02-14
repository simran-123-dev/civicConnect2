const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "admin", "employee"],
      default: "user",
    },

    town: { type: String, default: "" },

    empId: { type: String, unique: true, sparse: true },
    department: { type: String, default: "" },

    // Future OTP fields
    otp: { type: String, default: "" },
    otpExpiry: { type: Date },

    isOnDuty: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
