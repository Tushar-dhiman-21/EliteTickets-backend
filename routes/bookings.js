const express = require('express');
const router = express.Router();
const { bookEvent, updateBookingStatus, getMyBookings, cancelBooking, sendBookingOTP } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

router.post('/send-otp', protect, sendBookingOTP);
router.post('/', protect, bookEvent);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.get('/my', protect, getMyBookings);
router.delete('/:id', protect, cancelBooking);

module.exports = router;