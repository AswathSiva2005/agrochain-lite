import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import FarmerNavbar from "../../components/FarmerNavbar";
import { LanguageContext } from '../../App';
import { 
  FaComments, 
  FaUsers, 
  FaPaperPlane, 
  FaPlus, 
  FaSearch, 
  FaLeaf, 
  FaCloudSun, 
  FaBug, 
  FaSeedling,
  FaChevronLeft,
  FaEllipsisV,
  FaSmile
} from 'react-icons/fa';

const translations = {
  en: {
    community: "Farmer Community",
    selectRoom: "Select a chat room to start conversation",
    joinRoom: "Join Room",
    createRoom: "Create New Room",
    searchRooms: "Search rooms...",
    typeMessage: "Type your message...",
    send: "Send",
    online: "Online",
    members: "members",
    generalDiscussion: "General Discussion",
    farmingTips: "Farming Tips",
    marketPrices: "Market Prices",
    weatherUpdates: "Weather Updates",
    pestControl: "Pest Control",
    equipment: "Equipment",
    seeds: "Seeds & Varieties"
  },
  ta: {
    community: "விவசாயி சமூகம்",
    selectRoom: "உரையாடலைத் தொடங்க ஒரு அரட்டை அறையைத் தேர்ந்தெடுக்கவும்",
    joinRoom: "அறையில் சேரவும்",
    createRoom: "புதிய அறை உருவாக்கவும்",
    searchRooms: "அறைகளைத் தேடுங்கள்...",
    typeMessage: "உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...",
    send: "அனுப்பு",
    online: "ஆன்லைன்",
    members: "உறுப்பினர்கள்",
    generalDiscussion: "பொது விவாதம்",
    farmingTips: "விவசாய குறிப்புகள்",
    marketPrices: "சந்தை விலைகள்",
    weatherUpdates: "வானிலை புதுப்பிப்புகள்",
    pestControl: "பூச்சி கட்டுப்பாடு",
    equipment: "உபகரணங்கள்",
    seeds: "விதைகள் & வகைகள்"
  }
};

const categoryIcons = {
  'general-discussion': FaComments,
  'farming-tips': FaLeaf,
  'market-prices': FaSeedling,
  'weather': FaCloudSun,
  'pest-control': FaBug,
  'equipment': FaUsers,
  'seeds': FaSeedling
};

function Community() {
  const { language } = useContext(LanguageContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showRoomList, setShowRoomList] = useState(true);
  const messagesEndRef = useRef(null);

  const userName = localStorage.getItem('agrochain-user-name');
  const token = localStorage.getItem('agrochain-token');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom._id);
      if (isMobile) setShowRoomList(false);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chat/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatRooms(response.data);
      
      // Auto-join general discussion room if available
      const generalRoom = response.data.find(room => room.category === 'general-discussion');
      if (generalRoom && !selectedRoom) {
        setSelectedRoom(generalRoom);
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/rooms/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/chat/rooms/${selectedRoom._id}/messages`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const joinRoom = async (roomId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/chat/rooms/${roomId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchChatRooms();
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUserInRoom = (room) => {
    return room.participants?.some(p => p.user?.name === userName);
  };

  if (loading) {
    return (
      <>
        <FarmerNavbar />
        <div className="container mt-4 text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FarmerNavbar />
      <div className="container-fluid mt-4 px-3">
        <div className="row g-0" style={{ height: 'calc(100vh - 120px)' }}>
          {/* Chat Rooms Sidebar */}
          <div className={`col-12 col-md-4 col-lg-3 ${isMobile && !showRoomList ? 'd-none' : ''}`}>
            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '16px 0 0 16px' }}>
              <div className="card-header border-0 d-flex align-items-center justify-content-between" 
                   style={{ background: 'linear-gradient(135deg, #2C5F2D, #17633A)', color: '#fff', borderRadius: '16px 0 0 0' }}>
                <div className="d-flex align-items-center">
                  <FaComments className="me-2" />
                  <h5 className="mb-0 fw-bold">{translations[language].community}</h5>
                </div>
                <button className="btn btn-sm btn-outline-light" onClick={() => setShowCreateRoom(true)}>
                  <FaPlus size={14} />
                </button>
              </div>
              
              <div className="p-3">
                <div className="input-group mb-3">
                  <span className="input-group-text bg-light border-0">
                    <FaSearch className="text-muted" size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    placeholder={translations[language].searchRooms}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRadius: '0 20px 20px 0' }}
                  />
                </div>
              </div>

              <div className="flex-grow-1 overflow-auto">
                {filteredRooms.map((room) => {
                  const IconComponent = categoryIcons[room.category] || FaComments;
                  const isActive = selectedRoom?._id === room._id;
                  const isMember = isUserInRoom(room);
                  
                  return (
                    <div
                      key={room._id}
                      className={`p-3 border-bottom cursor-pointer position-relative ${isActive ? 'bg-light' : ''}`}
                      style={{ 
                        cursor: 'pointer',
                        borderLeft: isActive ? '4px solid #2C5F2D' : '4px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => {
                        if (isMember) {
                          setSelectedRoom(room);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div className="rounded-circle d-flex align-items-center justify-content-center"
                               style={{ width: 40, height: 40, backgroundColor: '#e8f5e8' }}>
                            <IconComponent size={18} color="#2C5F2D" />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-semibold">{room.name}</h6>
                          <small className="text-muted d-flex align-items-center">
                            <FaUsers size={12} className="me-1" />
                            {room.participants?.length || 0} {translations[language].members}
                          </small>
                        </div>
                        {!isMember && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={(e) => {
                              e.stopPropagation();
                              joinRoom(room._id);
                            }}
                            style={{ borderRadius: '20px', fontSize: '12px' }}
                          >
                            {translations[language].joinRoom}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className={`col-12 col-md-8 col-lg-9 ${isMobile && showRoomList ? 'd-none' : ''}`}>
            {selectedRoom ? (
              <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '0 16px 16px 0' }}>
                {/* Chat Header */}
                <div className="card-header border-0 d-flex align-items-center justify-content-between"
                     style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', borderRadius: '0 16px 0 0' }}>
                  <div className="d-flex align-items-center">
                    {isMobile && (
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => setShowRoomList(true)}
                      >
                        <FaChevronLeft />
                      </button>
                    )}
                    <div className="me-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: 40, height: 40, backgroundColor: '#e8f5e8' }}>
                        {React.createElement(categoryIcons[selectedRoom.category] || FaComments, { size: 18, color: '#2C5F2D' })}
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{selectedRoom.name}</h6>
                      <small className="text-muted">
                        <span className="text-success">●</span> {selectedRoom.participants?.length || 0} {translations[language].online}
                      </small>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary">
                    <FaEllipsisV />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="card-body flex-grow-1 overflow-auto p-0">
                  <div className="p-3" style={{ minHeight: '100%' }}>
                    {messages.length === 0 ? (
                      <div className="text-center text-muted mt-5">
                        <FaComments size={48} className="mb-3 opacity-50" />
                        <p>Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwnMessage = message.senderName === userName;
                        return (
                          <div
                            key={message._id}
                            className={`d-flex mb-3 ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}`}
                          >
                            <div
                              className={`p-3 rounded-3 shadow-sm ${
                                isOwnMessage
                                  ? 'bg-success text-white'
                                  : 'bg-light text-dark'
                              }`}
                              style={{
                                maxWidth: '70%',
                                borderRadius: isOwnMessage ? '20px 20px 5px 20px' : '20px 20px 20px 5px'
                              }}
                            >
                              {!isOwnMessage && (
                                <div className="fw-semibold mb-1" style={{ fontSize: '0.85rem', color: '#2C5F2D' }}>
                                  {message.senderName}
                                </div>
                              )}
                              <div className="mb-1">{message.content}</div>
                              <small className={`${isOwnMessage ? 'text-white-50' : 'text-muted'}`}>
                                {formatTime(message.createdAt)}
                              </small>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="card-footer border-0 bg-white" style={{ borderRadius: '0 0 16px 0' }}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control border-0 bg-light"
                      placeholder={translations[language].typeMessage}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      style={{ borderRadius: '25px 0 0 25px', padding: '12px 20px' }}
                    />
                    <button
                      className="btn btn-success d-flex align-items-center justify-content-center"
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      style={{ borderRadius: '0 25px 25px 0', width: '60px' }}
                    >
                      <FaPaperPlane size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card h-100 border-0 shadow-sm d-flex align-items-center justify-content-center"
                   style={{ borderRadius: '0 16px 16px 0' }}>
                <div className="text-center text-muted">
                  <FaComments size={64} className="mb-3 opacity-50" />
                  <h5>{translations[language].selectRoom}</h5>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Community;
