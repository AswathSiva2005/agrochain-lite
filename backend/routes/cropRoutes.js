// backend/routes/cropRoutes.js
import express from 'express';
import { addCrop, getMyCrops, getAllCrops } from '../controllers/cropController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads/crop-images directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'crop-images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
  }
});
const upload = multer({ storage });

const router = express.Router();

router.post('/add', protect, upload.single('image'), addCrop);
router.get('/my-crops', protect, getMyCrops);
router.get('/all', getAllCrops); // This should be present

// GET /api/crops/all?search=term will now work due to controller change

export default router;
