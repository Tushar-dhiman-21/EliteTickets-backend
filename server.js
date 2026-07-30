const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EliteTickets Backend API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 6900;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});