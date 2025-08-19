import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  deliveryDate: { type: String }, // Farmer sets this when accepting
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paymentMethod: { type: String }, // e.g., 'card', 'upi', 'cod'
  paymentCardLast4: { type: String }, // last 4 digits of card
  paymentDetails: { type: String }, // extra info (e.g., GPay number, COD note)
  paymentConfirmed: { type: Boolean, default: false },
  processUpdates: [
    {
      status: { type: String }, // e.g., 'packed', 'shipped', 'delivered'
      message: { type: String },
      date: { type: Date, default: Date.now },
      address: { type: String }
    }
  ],
  notifications: [
    {
      message: { type: String },
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }
  ],
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
