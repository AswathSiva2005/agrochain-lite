import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'ngo_approved', 'approved', 'rejected', 'ngo_rejected'], default: 'pending' },
  document: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sanctionDate: { type: Date },
  visitDetails: {
    visitDate: { type: Date },
    visitMessage: { type: String },
    officerName: { type: String },
    officerPhone: { type: String },
  },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // assigned NGO
  ngoApprovedAt: { type: Date },
  ngoGeoTagImage: { type: String }, // NGO geo-tag image path
  ngoMessage: { type: String }, // NGO approval message
  ngoRejectionReason: { type: String }, // NGO rejection reason
  dueAmount: { type: Number },
  loanStart: { type: Date },
  loanEnd: { type: Date },
}, { timestamps: true });

export default mongoose.model('Loan', loanSchema);
