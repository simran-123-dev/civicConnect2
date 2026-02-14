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

// 🔹 Auto ID Generator
const generateId = async (role) => {
  const prefix = role === "admin" ? "ADM" : "EMP";
  const count = await User.countDocuments({ role });
  return `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
};

// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role, adminKey, town, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(409).json({ message: "Phone already in use" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const allowedRoles = ["user", "admin", "employee"];
    const finalRole = allowedRoles.includes(role) ? role : "user";

    const userData = {
      name,
      email,
      phone,
      passwordHash,
      role: finalRole,
    };

    // 🔹 Admin logic
    if (finalRole === "admin") {
      if (!adminKey || adminKey !== process.env.ADMIN_SIGNUP_KEY) {
        return res.status(403).json({ message: "Invalid admin key" });
      }
      if (!town) {
        return res.status(400).json({ message: "Town required for admin" });
      }
      userData.town = town;
      userData.empId = await generateId("admin");
    }

    // 🔹 Employee logic
    if (finalRole === "employee") {
      if (!department) {
        return res.status(400).json({ message: "Department required" });
      }
      userData.department = department;
      userData.empId = await generateId("employee");
    }

    const user = await User.create(userData);
    const token = signToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
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

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 🔹 Login using email OR phone OR empId
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
        { empId: identifier },
      ],
    });

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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
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

module.exports = router;
