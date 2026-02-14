require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDb } = require("./config/db");

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const analyticsRoutes = require("./routes/analytics");
const employeeRoutes = require("./routes/employee");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Server is live");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/employee", employeeRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port:", PORT);
});

// Connect DB AFTER server starts
connectDb()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));
