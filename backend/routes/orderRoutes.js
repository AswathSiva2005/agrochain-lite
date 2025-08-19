import express from 'express';
import { protect, auth } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
import Crop from '../models/Crop.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// 👉 Place Order with cropName, quantity, and farmerName
router.post('/place', protect, auth(['buyer']), async (req, res) => {
  try {
    const { cropName, quantity, farmerName, address, pincode, phone } = req.body;

    if (!cropName || !quantity || !farmerName || !address || !pincode || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ message: 'Quantity must be a valid number greater than 0' });
    }

    // 🔍 Find farmer by name
    const farmer = await User.findOne({ name: farmerName, role: 'farmer' });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    // 🔍 Find crop with cropName + farmer
    const crop = await Crop.findOne({ cropName: cropName, farmer: farmer._id });
    if (!crop) return res.status(404).json({ message: 'Crop not found for this farmer' });

    if (quantityNum > crop.quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const totalPrice = quantityNum * crop.pricePerKg;
    if (isNaN(totalPrice)) {
      return res.status(500).json({ message: 'Invalid price. Check crop data.' });
    }

    const newOrder = new Order({
      buyerId: req.user._id,
      farmerId: farmer._id,
      cropId: crop._id,
      quantity: quantityNum,
      totalPrice,
      address,
      pincode,
      phone,
    });

    await newOrder.save();

    crop.quantity -= quantityNum;
    await crop.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🛒 Buyer - View My Orders
router.get('/buyer', protect, auth(['buyer']), async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate('cropId')
      .populate('farmerId', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚚 Farmer - View Orders Received
router.get('/farmer', protect, auth(['farmer']), async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.user._id })
      .populate('cropId')
      .populate('buyerId', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📦 Farmer - Update Order Status
router.put('/status/:id', protect, auth(['farmer']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    order.status = req.body.status || order.status;
    if (req.body.status === 'accepted' && req.body.deliveryDate) {
      order.deliveryDate = req.body.deliveryDate;
      order.paymentStatus = 'pending';
    }
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ Buyer - Cancel Order (only when pending)
router.put('/cancel/:id', protect, auth(['buyer']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('cropId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    // Restore quantity back to crop stock
    if (order.cropId) {
      order.cropId.quantity += order.quantity;
      await order.cropId.save();
    }

    // Mark as rejected to surface in farmer view
    order.status = 'rejected';

    // Notify farmer
    order.notifications = order.notifications || [];
    order.notifications.push({
      message: `Order #${order._id} was cancelled by buyer`,
      date: new Date(),
      read: false,
    });

    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 💳 Buyer - Pay for Order
router.post('/pay/:id', protect, auth(['buyer']), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Order not found (invalid ID format)' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    if (order.status !== 'accepted') {
      return res.status(400).json({ message: 'Order must be accepted before payment' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    const { paymentMethod, cardNumber, cardName, expiry, cvv, gpayNumber } = req.body;
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method required' });
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        return res.status(400).json({ message: 'Card details required' });
      }
      order.paymentCardLast4 = cardNumber.slice(-4);
      order.paymentDetails = `Card ending ${order.paymentCardLast4}`;
    } else if (paymentMethod === 'gpay') {
      if (!gpayNumber) {
        return res.status(400).json({ message: 'GPay number required' });
      }
      order.paymentDetails = `GPay: ${gpayNumber}`;
    } else if (paymentMethod === 'cod') {
      order.paymentDetails = 'Cash on Delivery';
    } else {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    order.paymentMethod = paymentMethod;
    order.paymentStatus = 'paid';
    order.paymentConfirmed = true;

    // Add notification for farmer
    order.notifications = order.notifications || [];
    order.notifications.push({
      message: `Payment received from buyer for order #${order._id}`,
      date: new Date(),
      read: false
    });

    await order.save();
    res.json({ message: 'Payment successful', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📝 Buyer - Edit Order Quantity
router.put('/:id', protect, auth(['buyer']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('cropId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    const newQty = Number(req.body.quantity);
    if (isNaN(newQty) || newQty <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    // Restore previous quantity to crop
    order.cropId.quantity += order.quantity;
    // Check if enough stock for new quantity
    if (newQty > order.cropId.quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    order.cropId.quantity -= newQty;
    await order.cropId.save();
    order.quantity = newQty;
    order.totalPrice = newQty * order.cropId.pricePerKg;
    await order.save();
    res.json({ message: 'Order quantity updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ Buyer - Delete Order
router.delete('/:id', protect, auth(['buyer']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('cropId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    // Restore quantity to crop
    order.cropId.quantity += order.quantity;
    await order.cropId.save();
    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Farmer - Add process update (e.g., packed, shipped, etc.)
router.post('/process-update/:id', protect, auth(['farmer']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    const { status, message, address } = req.body;
    order.processUpdates.push({
      status,
      message,
      address,
      date: new Date()
    });
    await order.save();
    res.json({ message: 'Process update added', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark all notifications as read for a farmer's orders
router.post('/notifications/mark-read', protect, auth(['farmer']), async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.user._id });
    for (const order of orders) {
      if (order.notifications && order.notifications.length > 0) {
        order.notifications.forEach(n => { n.read = true; });
        await order.save();
      }
    }
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
