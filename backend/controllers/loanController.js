import Loan from '../models/Loan.js';
import User from '../models/User.js';

export const applyLoan = async (req, res) => {
  try {
    const { amount, reason, ngoId, district } = req.body;
    if (!amount || !req.file || !ngoId) {
      return res.status(400).json({ message: 'Amount, document, and NGO required' });
    }
    const loan = new Loan({
      farmer: req.user._id,
      amount,
      reason,
      document: req.file.path,
      ngoId,
      district,
      status: 'pending'
    });
    await loan.save();
    res.status(201).json({ message: 'Loan request submitted', loan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('farmer', 'name email')
      .populate('approvedBy', 'name email') // <-- populate admin name
      .sort({ appliedAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLoanStats = async (req, res) => {
  try {
    const userDesignation = req.user.designation;
    console.log('User designation:', userDesignation); // Debug log
    
    // Get total count of all farmer loan applications
    const totalApplications = await Loan.countDocuments();
    
    if (userDesignation === 'NGO Field Coordinator') {
      // NGO sees: pending (for NGO approval), ngo_approved, ngo_rejected
      const [pending, ngoApproved, ngoRejected] = await Promise.all([
        Loan.countDocuments({ status: 'pending' }),
        Loan.countDocuments({ status: 'ngo_approved' }),
        Loan.countDocuments({ status: 'ngo_rejected' })
      ]);
      
      console.log('NGO stats:', { pending, ngoApproved, ngoRejected, totalApplications }); // Debug log
      
      res.json({
        accepted: ngoApproved, // NGO approved loans
        rejected: ngoRejected, // NGO rejected loans
        pending: pending, // Pending NGO approval
        total: totalApplications, // Total farmer applications
        role: 'NGO Field Coordinator' // Debug info
      });
    } else if (userDesignation === 'Loan Officer') {
      // Loan Officer sees: ngo_approved (for final approval), approved, rejected
      const [ngoApproved, approved, rejected] = await Promise.all([
        Loan.countDocuments({ status: 'ngo_approved' }),
        Loan.countDocuments({ status: 'approved' }),
        Loan.countDocuments({ status: 'rejected' })
      ]);
      
      console.log('Loan Officer stats:', { ngoApproved, approved, rejected, totalApplications }); // Debug log
      
      res.json({
        accepted: approved, // Finally approved loans
        rejected: rejected, // Finally rejected loans
        pending: ngoApproved, // Pending final approval (NGO approved)
        total: totalApplications, // Total farmer applications
        role: 'Loan Officer' // Debug info
      });
    } else {
      // Default: show all loan stats
      const [accepted, rejected, pending] = await Promise.all([
        Loan.countDocuments({ status: 'approved' }),
        Loan.countDocuments({ status: 'rejected' }),
        Loan.countDocuments({ status: 'pending' })
      ]);
      
      console.log('Default stats:', { accepted, rejected, pending, totalApplications }); // Debug log
      
      res.json({
        accepted,
        rejected,
        pending,
        total: totalApplications, // Total farmer applications
        role: userDesignation || 'Unknown' // Debug info
      });
    }
  } catch (err) {
    console.error('Error in getLoanStats:', err);
    res.status(500).json({ message: err.message });
  }
};

export const approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    loan.status = 'approved';
    loan.approvedBy = req.user._id;
    loan.sanctionDate = req.body.sanctionDate || new Date(); // <-- set sanction date
    await loan.save();
    res.json({ message: 'Loan approved', loan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    loan.status = 'rejected';
    await loan.save();
    res.json({ message: 'Loan rejected', loan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
