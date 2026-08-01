const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "pending",
  },

paymentStatus: {
  type: String,
  enum: ["not_paid", "verification_pending", "paid"],
  default: "not_paid",
},  

  amount: {
    type: Number,
    required: true,
  },

    ticketSent: {
    type: Boolean,
    default: false
},
  
  transactionId: {
    type: String,
    default: "",
  },

  bookedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);