const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(
  cors({
    origin: [
       "https://elite-tickets-frontend.vercel.app",
      "http://localhost:5173"
     
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

let dbConnectionPromise;

const connectDB = () => {
  if (!process.env.MONGO_URL) {
    return Promise.reject(new Error("MONGO_URL is not configured"));
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  dbConnectionPromise ??= mongoose.connect(process.env.MONGO_URL);
  return dbConnectionPromise;
};

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EliteTickets Backend API is running",
    version: "1.0.0",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;