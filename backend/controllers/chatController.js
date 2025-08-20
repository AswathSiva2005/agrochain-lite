import ChatRoom from '../models/ChatRoom.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// Get all chat rooms
export const getChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find({ isActive: true })
      .populate('lastMessage')
      .populate('participants.user', 'name')
      .sort({ lastActivity: -1 });
    
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat rooms', error: error.message });
  }
};

// Get chat room by ID
export const getChatRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const chatRoom = await ChatRoom.findById(roomId)
      .populate('participants.user', 'name email')
      .populate('admins', 'name email');
    
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat room', error: error.message });
  }
};

// Create new chat room
export const createChatRoom = async (req, res) => {
  try {
    const { name, description, type, category } = req.body;
    const userId = req.user.id;
    
    const chatRoom = new ChatRoom({
      name,
      description,
      type,
      category,
      participants: [{
        user: userId,
        joinedAt: new Date()
      }],
      admins: [userId]
    });
    
    await chatRoom.save();
    await chatRoom.populate('participants.user', 'name');
    
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat room', error: error.message });
  }
};

// Join chat room
export const joinChatRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    // Check if user is already a participant
    const isParticipant = chatRoom.participants.some(p => p.user.toString() === userId);
    if (isParticipant) {
      return res.status(400).json({ message: 'Already a member of this chat room' });
    }
    
    // Check participant limit
    if (chatRoom.participants.length >= chatRoom.settings.maxParticipants) {
      return res.status(400).json({ message: 'Chat room is full' });
    }
    
    chatRoom.participants.push({
      user: userId,
      joinedAt: new Date()
    });
    
    await chatRoom.save();
    await chatRoom.populate('participants.user', 'name');
    
    res.json({ message: 'Successfully joined chat room', chatRoom });
  } catch (error) {
    res.status(500).json({ message: 'Error joining chat room', error: error.message });
  }
};

// Get messages for a chat room
export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({ chatRoom: roomId })
      .populate('sender', 'name')
      .populate('replyTo', 'content senderName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.json(messages.reverse()); // Reverse to show oldest first
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, messageType = 'text', replyTo } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    
    // Verify user is participant of the chat room
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    const isParticipant = chatRoom.participants.some(p => p.user.toString() === userId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a member of this chat room' });
    }
    
    const message = new Message({
      sender: userId,
      senderName: userName,
      content,
      messageType,
      chatRoom: roomId,
      replyTo
    });
    
    await message.save();
    await message.populate('sender', 'name');
    if (replyTo) {
      await message.populate('replyTo', 'content senderName');
    }
    
    // Update chat room's last message and activity
    chatRoom.lastMessage = message._id;
    chatRoom.lastActivity = new Date();
    await chatRoom.save();
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Update user's last seen in chat room
export const updateLastSeen = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    
    await ChatRoom.updateOne(
      { _id: roomId, 'participants.user': userId },
      { $set: { 'participants.$.lastSeen': new Date() } }
    );
    
    res.json({ message: 'Last seen updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating last seen', error: error.message });
  }
};

// Get user's chat rooms
export const getUserChatRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chatRooms = await ChatRoom.find({ 
      'participants.user': userId,
      isActive: true 
    })
      .populate('lastMessage')
      .populate('participants.user', 'name')
      .sort({ lastActivity: -1 });
    
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user chat rooms', error: error.message });
  }
};

// Search messages
export const searchMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const messages = await Message.find({
      chatRoom: roomId,
      content: { $regex: query, $options: 'i' }
    })
      .populate('sender', 'name')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error searching messages', error: error.message });
  }
};
