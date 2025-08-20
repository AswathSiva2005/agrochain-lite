import express from 'express';
import {
  getChatRooms,
  getChatRoom,
  createChatRoom,
  joinChatRoom,
  getMessages,
  sendMessage,
  updateLastSeen,
  getUserChatRooms,
  searchMessages
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Chat room routes
router.get('/rooms', getChatRooms);
router.get('/rooms/my', getUserChatRooms);
router.get('/rooms/:roomId', getChatRoom);
router.post('/rooms', createChatRoom);
router.post('/rooms/:roomId/join', joinChatRoom);
router.put('/rooms/:roomId/seen', updateLastSeen);

// Message routes
router.get('/rooms/:roomId/messages', getMessages);
router.post('/rooms/:roomId/messages', sendMessage);
router.get('/rooms/:roomId/messages/search', searchMessages);

export default router;
