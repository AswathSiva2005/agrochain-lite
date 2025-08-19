// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'admin', 'serviceProvider'], // <-- add 'serviceProvider' here
    required: true
  },
  // Farmer-specific fields
  phone: { type: String },
  aadhar: { type: String },
  farmerId: { type: String },
  address: { type: String },
  state: { type: String },
  district: { type: String },
  pincode: { type: String },
  // Buyer-specific fields
  businessType: { type: String, enum: ['retailer', 'wholesaler', 'exporter'] },
  groceryStore: { type: String },
  // Service Provider-specific fields
  designation: { type: String },
  organisationName: { type: String },
  branch: { type: String },
  location: { type: String },
  branchCode: { type: String },
  // NGO-specific fields (for NGO Field Coordinator)
  ngoOrgName: { type: String },
  ngoRegNo: { type: String },
  ngoContact: { type: String },
  ngoAddress: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
