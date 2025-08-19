import express from 'express';
import Order from '../models/Order.js';
import Crop from '../models/Crop.js';

const router = express.Router();

// GET /api/survey/top-crops
router.get('/top-crops', async (req, res) => {
  try {
    // Aggregate orders to count most bought crops
    const top = await Order.aggregate([
      {
        $group: {
          _id: '$cropId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    // Get crop names
    const cropIds = top.map(t => t._id);
    const crops = await Crop.find({ _id: { $in: cropIds } });
    const result = top.map(t => ({
      cropName: crops.find(c => c._id.toString() === t._id.toString())?.cropName || 'Unknown',
      count: t.count
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
