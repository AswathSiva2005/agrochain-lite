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
