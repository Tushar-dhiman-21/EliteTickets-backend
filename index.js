    const cors = require("cors");
    const express = require("express");
    const dotenv = require("dotenv");
    const mongoose = require("mongoose");
    const authRoutes = require("./routes/auth.js");
    const eventRoutes = require("./routes/events.js");  
    const bookingRoutes = require("./routes/bookings.js");  


    dotenv.config();

    const app = express();

    app.use(cors( {
        origin: [
      "http://localhost:5173",
      "https://elite-tickets-frontend.vercel.app/api",
    ],
    // credentials: true,
    }));
    app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EliteTickets Backend API is running",
    version: "1.0.0",
  });
});

    
    //Routes
    app.use("/api/auth",authRoutes)  ; 
    app.use("/api/events",eventRoutes);
    app.use("/api/bookings",bookingRoutes);




    // Connect to MongoDB
    mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log(" Connected to MongoDB");
    })
    .catch((error) => {
        console.log(" MongoDB Connection Error:", error);
    });

    const PORT = process.env.PORT || 6900;

    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });