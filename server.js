const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://elite-tickets-frontend.vercel.app",
  ],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EliteTickets Backend API is running",
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;