import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropName: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  cultivationDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model('Crop', cropSchema);
