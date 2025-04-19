const express = require('express');
const router = express.Router();
const { register, login, updateProfile, sendOtp, verifyOtp, updatePassword, reSentOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/update-password', updatePassword);
router.post('/resend-otp', reSentOtp);
router.put('/profile', protect, updateProfile);

module.exports = router;