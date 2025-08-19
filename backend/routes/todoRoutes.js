import express from 'express';
import { protect, auth } from '../middleware/authMiddleware.js';
import ToDo from '../models/ToDo.js';

const router = express.Router();

// Get my 7-day to-do plan
router.get('/my', protect, auth(['farmer']), async (req, res) => {
  let todo = await ToDo.findOne({ farmer: req.user._id });
  if (!todo) {
    todo = await ToDo.create({ farmer: req.user._id });
  }
  res.json(todo);
});

// Add a task to a specific day (0-6)
router.post('/add', protect, auth(['farmer']), async (req, res) => {
  const { day, text, time } = req.body;
  const dayNum = Number(day);
  if (isNaN(dayNum) || dayNum < 0 || dayNum > 6 || !text) {
    return res.status(400).json({ message: 'Invalid day or text' });
  }
  let todo = await ToDo.findOne({ farmer: req.user._id });
  if (!todo) {
    todo = await ToDo.create({ farmer: req.user._id });
  }
  todo.tasks[dayNum].push({ text, completed: false, time });
  await todo.save();
  res.json({ message: 'Task added', tasks: todo.tasks });
});

// Mark a task as completed
router.put('/complete', protect, auth(['farmer']), async (req, res) => {
  const { day, taskIdx } = req.body;
  const dayNum = Number(day);
  let todo = await ToDo.findOne({ farmer: req.user._id });
  if (!todo || isNaN(dayNum) || dayNum < 0 || dayNum > 6 || typeof taskIdx !== 'number') {
    return res.status(400).json({ message: 'Invalid request' });
  }
  if (todo.tasks[dayNum] && todo.tasks[dayNum][taskIdx]) {
    todo.tasks[dayNum][taskIdx].completed = true;
    await todo.save();
    return res.json({ message: 'Task marked as completed', tasks: todo.tasks });
  }
  res.status(404).json({ message: 'Task not found' });
});


export default router;
