import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ChatRoom from '../models/ChatRoom.js';

dotenv.config();

const defaultChatRooms = [
  {
    name: 'General Discussion',
    description: 'A place for farmers to discuss general farming topics and connect with each other',
    type: 'general',
    category: 'general-discussion',
    settings: {
      isPublic: true,
      allowFileSharing: true,
      maxParticipants: 500
    }
  },
  {
    name: 'Farming Tips & Techniques',
    description: 'Share and learn modern farming techniques, best practices, and innovative methods',
    type: 'crop-specific',
    category: 'farming-tips',
    settings: {
      isPublic: true,
      allowFileSharing: true,
      maxParticipants: 300
    }
  },
  {
    name: 'Market Prices & Trading',
    description: 'Discuss current market prices, trading opportunities, and market trends',
    type: 'general',
    category: 'market-prices',
    settings: {
      isPublic: true,
      allowFileSharing: true,
      maxParticipants: 400
    }
  },
  {
    name: 'Weather Updates',
    description: 'Share weather information, seasonal updates, and climate-related discussions',
    type: 'regional',
    category: 'weather',
    settings: {
      isPublic: true,
      allowFileSharing: true,
      maxParticipants: 250
    }
  },
  {
    name: 'Pest Control Solutions',
    description: 'Get help with pest identification, organic solutions, and disease management',
    type: 'help',
    category: 'pest-control',
    settings: {
      isPublic: true,
      allowFileSharing: true,
      maxParticipants: 200
    }
  },
  {
    name: 'Equipment & Tools',
    description: 'Discuss farming equipment, tools, maintenance tips, and recommendations',
    type: 'general',
    category: 'equipment',
    settings: {
      isPublic: true,
      allowFileSharing: true,
      maxParticipants: 150
    }
  },
  {
    name: 'Seeds & Varieties',
    description: 'Share information about seed varieties, quality, and where to source them',
    type: 'crop-specific',
    category: 'seeds',
    settings: {
      isPublic: true,
      allowFileSharing: true,
      maxParticipants: 200
    }
  }
];

async function seedChatRooms() {
  try {
    // Check if chat rooms already exist
    const existingRooms = await ChatRoom.find();
    if (existingRooms.length > 0) {
      console.log('📋 Chat rooms already exist, skipping seed...');
      return;
    }

    // Create default chat rooms
    const createdRooms = await ChatRoom.insertMany(defaultChatRooms);
    console.log(`✅ Created ${createdRooms.length} default chat rooms:`);
    
    createdRooms.forEach(room => {
      console.log(`   - ${room.name} (${room.category})`);
    });

  } catch (error) {
    console.error('❌ Error seeding chat rooms:', error);
  }
}

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedChatRooms();
}

export default seedChatRooms;
