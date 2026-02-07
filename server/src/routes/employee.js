const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

// 🔥 Get All Employees (for admin to assign tasks)
router.get("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("_id name email empId department isOnDuty");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 Find employee by empId (or email) - helpful for mapping human empId -> DB _id
router.get("/by-empid/:empId", auth, requireRole("admin"), async (req, res) => {
  try {
    const { empId } = req.params;
    const user = await User.findOne({ $or: [{ empId }, { email: empId }] }).select("_id name empId email");
    if (!user) return res.status(404).json({ message: "Employee not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// 🔥 Get Employee Tasks
router.get("/tasks", auth, requireRole("employee"), async (req, res) => {
  try {
    const tasks = await Complaint.find({ assignedTo: req.user.id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 Get Single Task
router.get("/tasks/:id", auth, requireRole("employee"), async (req, res) => {
  try {
    const task = await Complaint.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    }).populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 Update Task Status
router.put("/tasks/:id/status", auth, requireRole("employee"), async (req, res) => {
  try {
    const { status, notes } = req.body;

    const task = await Complaint.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    task.remarks = notes || "";

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 Toggle Duty
router.put("/duty", auth, requireRole("employee"), async (req, res) => {
  try {
    const { isOnDuty } = req.body;

    const user = await User.findById(req.user.id);
    user.isOnDuty = isOnDuty;
    await user.save();

    res.json({ isOnDuty: user.isOnDuty });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 Update Location
router.put("/location", auth, requireRole("employee"), async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const user = await User.findById(req.user.id);
    user.currentLocation = {
      lat,
      lng,
      updatedAt: new Date(),
    };

    await user.save();

    res.json({ message: "Location updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
