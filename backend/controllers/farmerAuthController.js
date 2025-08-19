import dotenv from 'dotenv';
dotenv.config(); // Ensure .env is loaded before using process.env

import User from '../models/User.js';
import nodemailer from 'nodemailer';

// In-memory OTP store (for demo; use Redis/db for production)
export const otpStore = {};

// Send OTP to email (from aswathsiva0420@gmail.com, pass: dsqr ifep xidh idur, to: user given mail)
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

  // Send email using nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aswathsiva0420@gmail.com',
      pass: 'dsqr ifep xidh idur'
    }
  });

  const mailOptions = {
    from: 'aswathsiva0420@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your One-Time Password (OTP) is: ${otp}\nThis code will expire in 5 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

// Verify OTP
export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });
  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: 'No OTP sent to this email' });
  if (Date.now() > record.expires) return res.status(400).json({ message: 'OTP expired' });
  if (otp !== record.otp) return res.status(400).json({ message: 'Invalid OTP' });
  // Do NOT delete otp here, just mark as verified
  record.verified = true;
  res.json({ message: 'OTP verified' });
};

export const registerFarmer = async (req, res) => {
  const { name, email, phone, aadhar, farmerId, password, address, state, district, pincode, otp } = req.body;
  // Validate required fields
  if (!name || !email || !phone || !aadhar || !farmerId || !password || !address || !state || !district || !pincode)
    return res.status(400).json({ message: 'All fields required' });

  // Check OTP
  const record = otpStore[email];
  if (!record || Date.now() > record.expires || otp !== record.otp || !record.verified) {
    return res.status(400).json({ message: 'OTP not verified or expired' });
  }

  // Check if user exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  // No OTP check, only captcha (frontend checks before submit)
  const user = new User({
    name, email, phone, aadhar, farmerId, password, address, state, district, pincode, role: 'farmer'
  });
  await user.save();
  delete otpStore[email];
  res.json({ message: 'Farmer registered successfully' });
};