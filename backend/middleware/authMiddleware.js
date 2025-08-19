// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  // Remove debug logs after confirming fix
  // console.log('DEBUG TOKEN RECEIVED:', token);
  // console.log('DEBUG JWT SECRET:', process.env.JWT_SECRET);
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('DEBUG DECODED:', decoded);
    req.user = await User.findById(decoded.userId).select('-password'); // updated key
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    // console.log('JWT VERIFY ERROR:', err);
    res.status(401).json({ message: 'Token failed or expired' });
  }
};

export const auth = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
