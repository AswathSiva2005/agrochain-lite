import dotenv from 'dotenv';
dotenv.config(); // Ensure .env is loaded before using process.env

import User from '../models/User.js';
import nodemailer from 'nodemailer';

// In-memory OTP store (for demo; use Redis/db for production)
export const otpStore = {};

// Rate limiting store
const rateLimitStore = {};

// Send OTP to email
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  // Rate limiting: max 3 OTPs per email per 10 minutes
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;
  
  if (!rateLimitStore[email]) {
    rateLimitStore[email] = [];
  }
  
  // Clean old requests
  rateLimitStore[email] = rateLimitStore[email].filter(time => now - time < tenMinutes);
  
  if (rateLimitStore[email].length >= 3) {
    return res.status(429).json({ 
      message: 'Too many OTP requests. Please wait 10 minutes before trying again.' 
    });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

  // Use environment variables for email config
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER || 'aswathsiva0420@gmail.com',
      pass: process.env.MAIL_PASS?.replace(/\s+/g, '') || 'dsqrifepxidhidur' // Remove any spaces
    },
    pool: true,
    maxConnections: 1,
    rateDelta: 20000, // 20 seconds between emails
    rateLimit: 3 // max 3 emails per rateDelta
  });

  const mailOptions = {
    from: process.env.MAIL_USER || 'aswathsiva0420@gmail.com',
    to: email,
    subject: 'AgroChain - Your OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2C5F2D;">AgroChain Verification</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #2C5F2D; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666;">This code will expire in 5 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    rateLimitStore[email].push(now);
    
    console.log(`OTP sent successfully to ${email}: ${otp}`); // For debugging
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Email sending error:', err);
    
    // More specific error messages
    if (err.code === 'EAUTH') {
      res.status(500).json({ 
        message: 'Email authentication failed. Please check email configuration.' 
      });
    } else if (err.code === 'ECONNECTION') {
      res.status(500).json({ 
        message: 'Unable to connect to email service. Please try again later.' 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send OTP. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
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