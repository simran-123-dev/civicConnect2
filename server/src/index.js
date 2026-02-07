require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDb } = require("./config/db");
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const analyticsRoutes = require("./routes/analytics");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use('/api/analytics', analyticsRoutes);

const start = async () => {
  try {
    await connectDb();

    const basePort = parseInt(process.env.PORT, 10) || 5000;

    const tryListen = (port, attemptsLeft) =>
      new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
          console.log(`Server running on port ${port}`);
          resolve(server);
        });

        server.on("error", (err) => {
          if (err && err.code === "EADDRINUSE" && attemptsLeft > 0) {
            console.warn(`Port ${port} in use, trying ${port + 1}...`);
            // give a small delay before retrying
            setTimeout(() => resolve(tryListen(port + 1, attemptsLeft - 1)), 200);
          } else {
            reject(err);
          }
        });
      });

    // try basePort and up to 4 more ports
    const server = await tryListen(basePort, 4);

    // In development, run the seed script in a separate process so it doesn't interfere
    if (process.env.NODE_ENV === "development") {
      const { spawn } = require("child_process");
      const path = require("path");
      const seedPath = path.join(__dirname, "seed.js");
      const seedProc = spawn(process.execPath, [seedPath], {
        stdio: "inherit",
      });

      seedProc.on("close", (code) => {
        if (code === 0) console.log("Dev seed completed");
        else console.warn(`Dev seed exited with code ${code}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
