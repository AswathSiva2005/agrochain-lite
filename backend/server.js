// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// Routes
import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import userRoutes from './routes/users.js';
import surveyRoutes from './routes/surveyRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import loanSchemeRoutes from './routes/loanSchemeRoutes.js';

dotenv.config();
const app = express();

// Ensure uploads/loans directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'loans');
fs.mkdirSync(uploadsDir, { recursive: true });

// Ensure uploads/loan-schemes directory exists
const loanSchemesDir = path.join(process.cwd(), 'uploads', 'loan-schemes');
fs.mkdirSync(loanSchemesDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/loans', loanRoutes); // Mount the loan routes
app.use('/api/users', userRoutes); // Mount the user routes
app.use('/api/survey', surveyRoutes); // Mount the survey routes
app.use('/api/todo', todoRoutes); // Mount the todo routes
app.use('/api/loan-schemes', loanSchemeRoutes); // Mount the loan scheme routes

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
