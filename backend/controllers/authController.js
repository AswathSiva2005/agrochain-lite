import 'dotenv/config'; // Ensure .env is loaded
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { otpStore } from './farmerAuthController.js'; // Import the same store

// Always use the env variable, no fallback!
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const {
      name, email, password, role,
      phone, aadhar, farmerId, address, state, district, pincode,
      businessType, groceryStore,
      designation, organisationName, branch, location, branchCode,
      ngoOrgName, ngoRegNo, ngoContact, ngoAddress,
      otp // <-- add otp field
    } = req.body;

    // Validate required fields for each role
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }
    if (role === 'farmer' && (!phone || !aadhar || !farmerId || !address || !state || !district || !pincode)) {
      return res.status(400).json({ message: 'All farmer fields are required' });
    }
    if (role === 'buyer' && (!phone || !aadhar || !businessType || !address || !state || !district || !pincode || !groceryStore)) {
      return res.status(400).json({ message: 'All buyer fields are required' });
    }
    if (role === 'serviceProvider') {
      if (!designation || !phone || !email || !password || !aadhar || !state) {
        return res.status(400).json({ message: 'All service provider personal fields are required' });
      }
      if (
        (designation === 'Bank Manager' || designation === 'Loan Officer') &&
        (!organisationName || !branch || !location || !branchCode)
      ) {
        return res.status(400).json({ message: 'All organisation fields are required for Bank/Loan Officer' });
      }
      if (
        designation === 'NGO Field Coordinator' &&
        (!ngoOrgName || !ngoRegNo || !ngoContact || !ngoAddress)
      ) {
        return res.status(400).json({ message: 'All NGO organisation fields are required for NGO Field Coordinator' });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // OTP check for buyer and serviceProvider
    if (role === 'buyer' || role === 'serviceProvider') {
      const record = otpStore[email];
      if (!record || Date.now() > record.expires || otp !== record.otp) {
        return res.status(400).json({ message: 'OTP not verified or expired' });
      }
    }

    // Build user object based on role
    const userObj = { name, email, password, role };
    if (role === 'farmer') {
      Object.assign(userObj, { phone, aadhar, farmerId, address, state, district, pincode });
    }
    if (role === 'buyer') {
      Object.assign(userObj, { phone, aadhar, businessType, address, state, district, pincode, groceryStore });
    }
    if (role === 'serviceProvider') {
      Object.assign(userObj, {
        name, designation, phone, email, password, aadhar, organisationName, branch, location, branchCode, state,
        ngoOrgName, ngoRegNo, ngoContact, ngoAddress
      });
    }

    const newUser = new User(userObj);
    await newUser.save();

    if (role === 'buyer' || role === 'serviceProvider') {
      delete otpStore[email];
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
