import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  time: { type: String }
}, { _id: false });

const toDoSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  tasks: {
    type: [[taskSchema]],
    default: () => [[], [], [], [], [], [], []]
  }
}, { timestamps: true });

export default mongoose.model('ToDo', toDoSchema);
