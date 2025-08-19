import mongoose from 'mongoose';

const loanSchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String, required: true },
  interestRate: { type: Number, required: true },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  repaymentPeriod: { type: String, required: true }, // e.g., "12 months", "5 years"
  processingFee: { type: String },
  collateralRequired: { type: Boolean, default: false },
  collateralDetails: { type: String },
  eligibility: { type: String },
  govtSubsidy: { type: Boolean, default: false },
  subsidyPercent: { type: Number },
  requiredDocuments: [{ type: String }],
  applyLink: { type: String },
  brochure: { type: String }, // PDF file path
  expiryDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // serviceProvider/admin
}, { timestamps: true });

export default mongoose.model('LoanScheme', loanSchemeSchema);
