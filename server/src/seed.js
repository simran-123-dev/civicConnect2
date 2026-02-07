require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const { connectDb } = require("./config/db");

const seedDatabase = async () => {
  try {
    await connectDb();
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    console.log("Cleared existing users");

    const hashedUserPass = await bcrypt.hash("user123", 10);
    const hashedAdminPass = await bcrypt.hash("admin123", 10);

    const users = [
      {
        name: "John User",
        email: "user@example.com",
        passwordHash: hashedUserPass,
        role: "user",
      },
      {
        name: "Jane User",
        email: "jane@example.com",
        passwordHash: hashedUserPass,
        role: "user",
      },
      {
        name: "Field Officer",
        email: "employee@example.com",
        passwordHash: hashedAdminPass,
        role: "employee",
        empId: "EMP-1001",
        department: "Roads",
      },
      {
        name: "Admin Officer",
        email: "admin@example.com",
        passwordHash: hashedAdminPass,
        role: "admin",
      },
      {
        name: "Super Admin",
        email: "superadmin@example.com",
        passwordHash: hashedAdminPass,
        role: "admin",
      },
    ];

    const inserted = await User.insertMany(users);
    console.log("✓ Added sample users:");
    console.log("  Users:");
    console.log("    - user@example.com / user123");
    console.log("    - jane@example.com / user123");
    console.log("  Employee:");
    console.log("    - employee@example.com / admin123");
    console.log("  Admins:");
    console.log("    - admin@example.com / admin123");
    console.log("    - superadmin@example.com / admin123");

    // seed some complaints and assign to the employee user for demo
    const Complaint = require("./models/Complaint");
    await Complaint.deleteMany({});

    const employee = inserted.find((u) => u.email === "employee@example.com");
    const user = inserted.find((u) => u.email === "user@example.com");

    if (employee && user) {
      const complaints = [
        {
          title: "Pothole near Central Park",
          description: "Large pothole causing traffic issues",
          locationText: "Central Park Ave",
          town: "Downtown",
          category: "Roads",
          status: "Assigned",
          createdBy: user._id,
          assignedTo: employee._id,
          priority: "High",
          dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000),
          estimatedHours: 2,
          targetLocation: { address: "Central Park Ave" },
        },
        {
          title: "Streetlight flickering",
          description: "Light on 3rd street flickers at night",
          locationText: "3rd Street",
          town: "Downtown",
          category: "Lighting",
          status: "Assigned",
          createdBy: user._id,
          assignedTo: employee._id,
          priority: "Medium",
          dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000),
          estimatedHours: 1,
          targetLocation: { address: "3rd Street" },
        },
      ];

      await Complaint.insertMany(complaints);
      console.log("✓ Seeded complaints assigned to employee");
    }

    await mongoose.connection.close();
    console.log("✓ Database seeded successfully");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

module.exports = { seedDatabase };

// If run directly, execute the seed
if (require.main === module) {
  seedDatabase();
}
