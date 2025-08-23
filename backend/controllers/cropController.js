import Crop from '../models/Crop.js';
import User from '../models/User.js';

export const addCrop = async (req, res) => {
  const { cropName, quantity, pricePerKg, description, farmerName, address, phone, cultivationDate } = req.body;
  // Store image path as 'uploads/crop-images/filename.jpg'
  let imagePath = req.file ? `uploads/crop-images/${req.file.filename}` : undefined;

  try {
    const farmer = await User.findOne({ name: farmerName, role: 'farmer' });

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const newCrop = await Crop.create({
      cropName,
      quantity,
      pricePerKg,
      description,
      farmer: farmer._id,
      address,
      phone, // <-- save phone
      cultivationDate,
      image: imagePath,
    });

    res.status(201).json(newCrop);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add crop', error: err.message });
  }
};

export const getMyCrops = async (req, res) => {
  const { farmerName } = req.query;

  try {
    const farmer = await User.findOne({ name: farmerName, role: 'farmer' });

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const crops = await Crop.find({ farmer: farmer._id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch crops', error: err.message });
  }
};

export const getAllCrops = async (req, res) => {
  try {
    const { search, farmer } = req.query;
    let query = {};

    if (search) {
      query.cropName = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    // If farmer name is provided, find farmer's _id and filter
    if (farmer) {
      const farmerUser = await User.findOne({ name: { $regex: farmer, $options: 'i' }, role: 'farmer' });
      if (farmerUser) {
        query.farmer = farmerUser._id;
      } else {
        // No such farmer, return empty result
        return res.json([]);
      }
    }

    const crops = await Crop.find(query).populate('farmer', 'name').sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch crops', error: err.message });
  }
};

export const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, pricePerKg, description } = req.body;

    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Update fields if provided
    if (quantity !== undefined) crop.quantity = quantity;
    if (pricePerKg !== undefined) crop.pricePerKg = pricePerKg;
    if (description !== undefined) crop.description = description;

    // Delete crop if quantity is zero or negative
    if (crop.quantity <= 0) {
      await Crop.findByIdAndDelete(id);
      return res.json({ message: 'Crop deleted due to zero quantity' });
    }

    await crop.save();
    res.json({ message: 'Crop updated successfully', crop });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update crop', error: err.message });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    
    const crop = await Crop.findByIdAndDelete(id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json({ message: 'Crop deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete crop', error: err.message });
  }
};
