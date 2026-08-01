const express = require('express');
const router = express.Router();
const { bookEvent, updateBookingStatus, getMyBookings, cancelBooking, sendBookingOTP, submitPayment } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

router.post('/send-otp', protect, sendBookingOTP);
router.post('/', protect, bookEvent);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.get('/my', protect, getMyBookings);
router.delete('/:id', protect, cancelBooking);
router.put("/:id/payment", protect, submitPayment);

module.exports = router;