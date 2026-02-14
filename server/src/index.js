require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDb } = require("./config/db");

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const analyticsRoutes = require("./routes/analytics");
const employeeRoutes = require("./routes/employee"); // ✅ ADDED

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/employee", employeeRoutes); // ✅ THIS WAS MISSING

/* ================= SERVER START ================= */

const start = async () => {
  try {
    await connectDb();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
