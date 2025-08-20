import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['general', 'crop-specific', 'regional', 'help'],
    default: 'general'
  },
  category: {
    type: String,
    enum: ['farming-tips', 'market-prices', 'weather', 'pest-control', 'general-discussion', 'equipment', 'seeds'],
    default: 'general-discussion'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  settings: {
    isPublic: {
      type: Boolean,
      default: true
    },
    allowFileSharing: {
      type: Boolean,
      default: true
    },
    maxParticipants: {
      type: Number,
      default: 500
    }
  }
}, { 
  timestamps: true 
});

// Index for efficient querying
chatRoomSchema.index({ type: 1, category: 1 });
chatRoomSchema.index({ 'participants.user': 1 });
chatRoomSchema.index({ lastActivity: -1 });

export default mongoose.model('ChatRoom', chatRoomSchema);
