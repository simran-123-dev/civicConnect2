const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, adminKey, town, empId, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Admin signup protection
    if (role === "admin") {
      if (!adminKey || adminKey !== process.env.ADMIN_SIGNUP_KEY) {
        return res.status(403).json({ message: "Invalid admin key" });
      }
      if (!town) {
        return res.status(400).json({ message: "Town is required for admin signup" });
      }
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Proper role handling
    const allowedRoles = ["user", "admin", "employee"];
    const finalRole = allowedRoles.includes(role) ? role : "user";

    const userData = {
      name,
      email,
      passwordHash,
      role: finalRole,
      town: finalRole === "admin" ? town : "",
    };

    if (finalRole === "employee") {
      userData.empId = empId || "";
      userData.department = department || "";
    }

    const user = await User.create(userData);

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        town: user.town,
        empId: user.empId || "",
        department: user.department || "",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, town: user.town, empId: user.empId || "", department: user.department || "" },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
