// backend/routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import { registerFarmer, sendOtp, verifyOtp } from '../controllers/farmerAuthController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp); // New: send OTP to email
router.post('/verify-otp', verifyOtp); // New: verify OTP
router.post('/register-farmer', registerFarmer);

export default router;