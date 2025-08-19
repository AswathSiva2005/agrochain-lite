import express from 'express';
import { protect, auth } from '../middleware/authMiddleware.js';
import LoanScheme from '../models/LoanScheme.js';
import multer from 'multer';

const router = express.Router();

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/loan-schemes/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
  }
});
const upload = multer({ storage });

// Service Provider/Admin: Add new loan scheme
router.post('/add', protect, auth(['serviceProvider', 'admin']), upload.single('brochure'), async (req, res) => {
  try {
    const {
      name, purpose, interestRate, minAmount, maxAmount, repaymentPeriod,
      processingFee, collateralRequired, collateralDetails, eligibility,
      govtSubsidy, subsidyPercent, requiredDocuments, applyLink, expiryDate
    } = req.body;

    const scheme = new LoanScheme({
      name,
      purpose,
      interestRate,
      minAmount,
      maxAmount,
      repaymentPeriod,
      processingFee,
      collateralRequired: collateralRequired === 'true' || collateralRequired === true,
      collateralDetails,
      eligibility,
      govtSubsidy: govtSubsidy === 'true' || govtSubsidy === true,
      subsidyPercent,
      requiredDocuments: Array.isArray(requiredDocuments) ? requiredDocuments : requiredDocuments?.split(',').map(s => s.trim()),
      applyLink,
      expiryDate,
      brochure: req.file ? req.file.path : undefined,
      createdBy: req.user._id
    });
    await scheme.save();
    res.status(201).json({ message: 'Loan scheme added', scheme });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Farmer, ServiceProvider, Admin: Get all active loan schemes
router.get('/all', protect, auth(['farmer', 'serviceProvider', 'admin']), async (req, res) => {
  try {
    const now = new Date();
    const schemes = await LoanScheme.find({
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: now } }
      ]
    }).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Anyone (for display): Get scheme by id
router.get('/:id', protect, async (req, res) => {
  try {
    const scheme = await LoanScheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
