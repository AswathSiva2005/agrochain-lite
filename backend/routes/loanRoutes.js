import express from 'express';
import { protect, auth } from '../middleware/authMiddleware.js';
import { applyLoan, getAllLoans, rejectLoan, getLoanStats } from '../controllers/loanController.js';
import multer from 'multer';
import Loan from '../models/Loan.js';
import User from '../models/User.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/loans/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Multer setup for NGO geo-tag images
const geoTagStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/geotags/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-geotag-' + file.originalname);
  }
});
const geoTagUpload = multer({ storage: geoTagStorage });

// Farmer applies for loan (with document)
router.post('/apply', protect, auth(['farmer']), upload.single('document'), applyLoan);

// Admin and Service Provider views all loan requests
router.get('/all', protect, async (req, res) => {
  try {
    // Only show loans approved by NGO to Loan Officer
    if (req.user.role === 'serviceProvider') {
      // Find if user is Loan Officer
      if (req.user.designation === 'Loan Officer') {
        // Only show loans with status 'ngo_approved'
        const loans = await Loan.find({ status: 'ngo_approved' })
          .populate('farmer', 'name email')
          .populate('approvedBy', 'name email')
          .sort({ appliedAt: -1 });
        return res.json(loans);
      }
      // If NGO, show only loans assigned to them and status 'pending'
      if (req.user.designation === 'NGO Field Coordinator') {
        const loans = await Loan.find({ status: 'pending', ngoId: req.user._id })
          .populate('farmer', 'name email')
          .populate('approvedBy', 'name email')
          .sort({ appliedAt: -1 });
        return res.json(loans);
      }
    }
    // Admin sees all loans
    if (req.user.role === 'admin') {
      const loans = await Loan.find()
        .populate('farmer', 'name email')
        .populate('approvedBy', 'name email')
        .sort({ appliedAt: -1 });
      return res.json(loans);
    }
    res.status(403).json({ message: 'Forbidden' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NGO approves loan (sets status to 'ngo_approved') with geo-tag image and message
router.put('/ngo-approve/:id', protect, auth(['serviceProvider']), geoTagUpload.single('geoTagImage'), async (req, res) => {
  try {
    if (req.user.designation !== 'NGO Field Coordinator') {
      return res.status(403).json({ message: 'Only NGO can approve at this stage' });
    }
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    loan.status = 'ngo_approved';
    loan.approvedBy = req.user._id;
    loan.ngoApprovedAt = new Date();
    
    // Save NGO geo-tag image and message
    if (req.file) loan.ngoGeoTagImage = req.file.path;
    if (req.body.ngoMessage) loan.ngoMessage = req.body.ngoMessage;
    
    await loan.save();
    res.json({ message: 'Loan approved by NGO', loan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin and Loan Officer approve loan (after NGO approval)
router.put('/approve/:id', protect, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    // Only allow if status is 'ngo_approved'
    if (loan.status !== 'ngo_approved') {
      return res.status(400).json({ message: 'Loan must be approved by NGO first' });
    }

    // Only admin or loan officer can approve at this stage
    if (
      req.user.role === 'admin' ||
      (req.user.role === 'serviceProvider' && req.user.designation === 'Loan Officer')
    ) {
      loan.status = 'approved';
      loan.sanctionDate = req.body.sanctionDate || new Date();
      loan.amount = req.body.amount || loan.amount;
      loan.dueAmount = req.body.dueAmount || loan.dueAmount;
      loan.loanStart = req.body.loanStart || loan.loanStart;
      loan.loanEnd = req.body.loanEnd || loan.loanEnd;
      loan.approvedBy = req.user._id;
      await loan.save();
      return res.json({ message: 'Loan approved', loan });
    }
    res.status(403).json({ message: 'Forbidden' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NGO rejects loan with reason
router.put('/ngo-reject/:id', protect, auth(['serviceProvider']), async (req, res) => {
  try {
    if (req.user.designation !== 'NGO Field Coordinator') {
      return res.status(403).json({ message: 'Only NGO can reject at this stage' });
    }
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    loan.status = 'rejected';
    loan.ngoRejectionReason = req.body.rejectionReason;
    await loan.save();
    res.json({ message: 'Loan rejected by NGO', loan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin and Service Provider reject loan
router.put('/reject/:id', protect, auth(['admin', 'serviceProvider']), rejectLoan);

// Farmer views their own loan requests
router.get('/my', protect, auth(['farmer']), async (req, res) => {
  try {
    const loans = await Loan.find({ farmer: req.user._id })
      .populate('approvedBy', 'name email')
      .sort({ appliedAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save field visit details (NGO only, status remains 'pending')
router.put('/field-visit/:id', protect, auth(['serviceProvider']), async (req, res) => {
  try {
    if (req.user.designation !== 'NGO Field Coordinator') {
      return res.status(403).json({ message: 'Only NGO can add field visit' });
    }
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    loan.visitDetails = {
      visitDate: req.body.visitDate,
      officerName: req.body.officerName,
      officerPhone: req.body.officerPhone,
      visitMessage: req.body.visitMessage,
    };
    await loan.save();
    res.json({ message: 'Field visit details saved', loan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get loan statistics for service provider dashboard
router.get('/stats', protect, auth(['serviceProvider', 'admin']), getLoanStats);

export default router;


// Ensure this router is mounted in your main server file (app.js or server.js) at the path '/api/loans'
// Ensure this router is mounted in your main server file (app.js or server.js) at the path '/api/loans'
