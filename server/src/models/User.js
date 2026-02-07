const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },

    // ✅ Added employee role
    role: { 
      type: String, 
      enum: ["user", "admin", "employee"], 
      default: "user" 
    },

    town: { type: String, default: "" },

    // Optional employee fields
    empId: { type: String, default: "" },
    department: { type: String, default: "" },
    isOnDuty: { type: Boolean, default: false },
    currentLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
