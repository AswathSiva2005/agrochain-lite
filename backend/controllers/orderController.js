import Crop from '../models/Crop.js';
import User from '../models/User.js';
import Order from '../models/Order.js'; // Use uppercase 'O'

export const placeOrder = async (req, res) => {
  try {
    const { cropName, quantity, farmerName } = req.body;
    const buyerId = req.user._id;

    // Step 1: Find the farmer by name
    const farmer = await User.findOne({ name: farmerName, role: 'farmer' });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Step 2: Find the crop by name and farmer ID
    const crop = await Crop.findOne({ cropName, farmer: farmer._id });
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found for this farmer' });
    }

    if (crop.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient crop quantity available' });
    }

    // Step 3: Calculate total price
    const totalPrice = crop.pricePerKg * quantity;

    // Step 4: Create the order
    const newOrder = new Order({
      buyerId,
      farmerId: farmer._id,
      cropId: crop._id,
      quantity,
      totalPrice
    });

    await newOrder.save();

    // Step 5: Reduce crop quantity
    crop.quantity -= quantity;
    await crop.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error placing order' });
  }
};
