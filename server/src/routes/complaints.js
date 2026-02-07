const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

const pick = (source, fields) => {
  return fields.reduce((acc, field) => {
    if (source[field] !== undefined) {
      acc[field] = source[field];
    }
    return acc;
  }, {});
};

// GET ALL COMPLAINTS
router.get("/", auth, async (req, res) => {
  try {
    let filter;

    if (req.user.role === "admin") {
      filter = { town: req.user.town };
    } else {
      filter = {}; // 🔥 Users can now see all complaints
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    return res.json(complaints);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE
router.get("/:id", auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json(complaint);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const data = pick(req.body, [
      "title",
      "description",
      "locationText",
      "town",
      "coords",
      "category",
    ]);

    if (!data.title || !data.description || !data.locationText || !data.town) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const complaint = await Complaint.create({
      ...data,
      createdBy: req.user.id,
    });

    return res.status(201).json(complaint);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// UPDATE
router.patch("/:id", auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    const isOwner = String(complaint.createdBy) === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allowedUserFields = [
      "title",
      "description",
      "locationText",
      "coords",
      "category",
    ];
    const allowedAdminFields = ["status", "remarks", "proofName", "assignedTo"];

    const updates = isAdmin
      ? { ...pick(req.body, allowedUserFields), ...pick(req.body, allowedAdminFields) }
      : pick(req.body, allowedUserFields);

    // If admin provided an `assignedTo` that looks like an employee identifier (empId)
    // convert it to the corresponding user's _id so the DB stores the ObjectId.
    if (isAdmin && updates.assignedTo) {
      const assigned = updates.assignedTo;
      const isObjectIdLike = String(assigned).match(/^[0-9a-fA-F]{24}$/);

      if (!isObjectIdLike) {
        // Try finding by empId or by email as a fallback
        const found = await User.findOne({ $or: [{ empId: assigned }, { email: assigned }] }).select("_id");
        if (found) {
          updates.assignedTo = found._id;
        } else {
          // If no matching user, leave assignedTo as-is (this will likely be ignored by consumer)
          // but avoid storing non-objectid strings; remove the field instead.
          delete updates.assignedTo;
        }
      }
    }

    Object.assign(complaint, updates);
    await complaint.save();

    return res.json(complaint);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// 🔥 UPVOTE ROUTE
router.put("/:id/upvote", auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    if (complaint.upvotedBy.includes(req.user.id)) {
      return res.status(400).json({ message: "Already upvoted" });
    }

    complaint.upvotes += 1;
    complaint.upvotedBy.push(req.user.id);

    await complaint.save();

    return res.json({ upvotes: complaint.upvotes });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// 🔥 CATEGORY COUNT ROUTE
router.get("/category/count", auth, async (req, res) => {
  try {
    const result = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
