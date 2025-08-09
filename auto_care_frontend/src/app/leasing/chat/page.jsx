'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Circle, 
  User, 
  Phone, 
  Video, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  ArrowLeft, 
  Clock,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Mic,
  MicOff,
  Calendar,
  Star,
  Info
} from 'lucide-react';
import { useRouter } from 'next/router';
import styles from './Chat.module.css';

export default function ChatPage() {
  const router = useRouter();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'agent',
      text: "Hello! I'm Sarah, your leasing agent. How can I help you find the perfect apartment today?",
      time: "10:30 AM",
      status: 'delivered',
      timestamp: new Date('2024-01-15T10:30:00')
    },
    {
      id: 2,
      type: 'user',
      text: "Hi Sarah! I'm looking for a 2-bedroom apartment with a balcony. What do you have available?",
      time: "10:32 AM",
      status: 'read',
      timestamp: new Date('2024-01-15T10:32:00')
    },
    {
      id: 3,
      type: 'agent',
      text: "Great choice! I have several 2-bedroom units with balconies available. Let me show you some options:",
      time: "10:33 AM",
      status: 'delivered',
      timestamp: new Date('2024-01-15T10:33:00')
    },
    {
      id: 4,
      type: 'agent',
      text: "Unit 304 - Premium 2BR\n950 sq ft • East-facing balcony • Available March 1st\n$2,400/mo",
      time: "10:33 AM",
      status: 'delivered',
      timestamp: new Date('2024-01-15T10:33:00'),
      isProperty: true
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAgentInfo, setShowAgentInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const agent = {
    name: "Sarah Johnson",
    title: "Senior Leasing Specialist",
    phone: "(555) 123-4567",
    email: "sarah.johnson@elite.com",
    isOnline: true,
    lastSeen: "Active now",
    rating: 4.9,
    experience: "8 years",
    specialties: ["Luxury Properties", "Corporate Housing", "Investment Properties"],
    responseTime: "Usually responds within 5 minutes"
  };

  const emojis = ['😊', '👍', '❤️', '😄', '🎉', '👏', '🙏', '💯'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
        const responses = [
          "I'd be happy to help you with that!",
          "Let me check the availability for you.",
          "Would you like to schedule a viewing?",
          "I can arrange a virtual tour if you prefer."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage('agent', randomResponse);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (type, text, extra = {}) => {
    const newMessage = {
      id: Date.now(),
      type,
      text,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      status: type === 'user' ? 'sending' : 'delivered',
      timestamp: new Date(),
      ...extra
    };

    setMessages(prev => [...prev, newMessage]);

    if (type === 'user') {
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'delivered' }
              : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        setIsTyping(true);
      }, 1500);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      addMessage('user', message.trim());
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.startsWith('image/') ? 'image' : 'file';
      addMessage('user', `Shared ${fileType}: ${file.name}`, { 
        fileType, 
        fileName: file.name
      });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        addMessage('user', "Voice message (0:05)", { isVoice: true, duration: "0:05" });
      }, 3000);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return messageTime.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
  };

  const MessageStatus = ({ status }) => {
    switch (status) {
      case 'sending':
        return <Clock size={12} className="text-gray-400" />;
      case 'delivered':
        return <Check size={12} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={12} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${styles.chatBackground}`}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className={`${styles.chatHeader} rounded-t-xl`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()} 
                className="lg:hidden text-[#1E201E] hover:bg-gray-100 p-2 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`${styles.agentAvatar} w-12 h-12 rounded-full flex items-center justify-center`}>
                    <User size={20} className="text-[#ECDFCC]" />
                  </div>
                  {agent.isOnline && (
                    <div className={`${styles.onlineIndicator}`}></div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-lg font-bold text-[#1E201E]">{agent.name}</h1>
                  <div className="flex items-center gap-2">
                    <Circle size={8} className={`${agent.isOnline ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} />
                    <span className="text-sm text-[#222725]">
                      {agent.isOnline ? 'Active now' : agent.lastSeen}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className={`${styles.headerButton}`}>
                <Phone size={20} />
              </button>
              <button className={`${styles.headerButton}`}>
                <Video size={20} />
              </button>
              <button 
                onClick={() => setShowAgentInfo(!showAgentInfo)}
                className={`${styles.headerButton}`}
              >
                <Info size={20} />
              </button>
              <button className={`${styles.headerButton}`}>
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex bg-white shadow-lg">
          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${showAgentInfo ? 'lg:border-r border-gray-200' : ''}`}>
            
            {/* Messages */}
            <div 
              className={`${styles.messagesContainer} flex-1 p-6 overflow-y-auto space-y-4`}
              style={{ height: '500px' }}
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {msg.type === 'agent' && (
                    <div className={`${styles.agentAvatar} w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                      <User size={16} className="text-[#ECDFCC]" />
                    </div>
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md ${styles.messageWrapper}`}>
                    {msg.isProperty ? (
                      // Property Card Message
                      <div className={`${styles.propertyCard} border border-gray-200 rounded-xl overflow-hidden`}>
                        <div className={`${styles.propertyImage} h-32 flex items-center justify-center`}>
                          <ImageIcon size={40} className="text-gray-400" />
                        </div>
                        <div className="p-4">
                          <div className="text-sm text-[#1E201E] whitespace-pre-line mb-2">{msg.text}</div>
                          <button className={`${styles.viewButton} w-full py-2 px-4 rounded-lg text-sm font-medium`}>
                            View Details
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`px-4 py-3 rounded-2xl shadow-sm ${styles.messageBubble} ${
                        msg.type === 'user' ? styles.userMessage : styles.agentMessage
                      }`}>
                        
                        {msg.isVoice ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#ECDFCC] rounded-full flex items-center justify-center">
                              <Mic size={16} className="text-[#1E201E]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex-1 h-1 bg-[#ECDFCC] rounded-full overflow-hidden">
                                  <div className="w-1/3 h-full bg-[#1E201E]"></div>
                                </div>
                                <span className="text-xs">{msg.duration}</span>
                              </div>
                            </div>
                          </div>
                        ) : msg.fileType ? (
                          <div className={`${styles.fileMessage} flex items-center gap-3`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              msg.fileType === 'image' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {msg.fileType === 'image' ? <ImageIcon size={20} /> : <FileText size={20} />}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{msg.fileName}</div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-line">{msg.text}</p>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${
                            msg.type === 'user' ? 'text-[#ECDFCC]/70' : 'text-[#222725]/70'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </span>
                          {msg.type === 'user' && (
                            <MessageStatus status={msg.status} />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`${styles.agentAvatar} w-8 h-8 rounded-full flex items-center justify-center mr-3`}>
                    <User size={16} className="text-[#ECDFCC]" />
                  </div>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className={`flex space-x-1 ${styles.typingIndicator}`}>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
              {/* Quick Actions */}
              <div className="flex gap-2 mb-3 overflow-x-auto">
                <button className={`${styles.quickAction} px-3 py-1 text-xs rounded-full`}>
                  Schedule Tour
                </button>
                <button className={`${styles.quickAction} px-3 py-1 text-xs rounded-full`}>
                  Check Availability
                </button>
                <button className={`${styles.quickAction} px-3 py-1 text-xs rounded-full`}>
                  Get Quote
                </button>
              </div>
              
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={`${styles.messageInput} w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl text-[#1E201E] placeholder-gray-500 resize-none`}
                    disabled={isRecording}
                  />
                  
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className={`${styles.emojiPicker} absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10`}>
                      <div className="grid grid-cols-4 gap-2">
                        {emojis.map((emoji, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleEmojiClick(emoji)}
                            className={`${styles.emojiButton} text-xl p-2 rounded`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`${styles.fileUpload} text-[#1E201E] p-2 rounded-lg`}
                  >
                    <Paperclip size={20} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`${styles.headerButton} text-[#1E201E] p-2 rounded-lg`}
                  >
                    <Smile size={20} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`p-2 rounded-lg transition-colors ${
                      isRecording ? styles.recording : ''
                    }`}
                  >
                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!message.trim() && !isRecording}
                    className={`${styles.sendButton} p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Agent Info Sidebar */}
          {showAgentInfo && (
            <div className={`${styles.agentSidebar} w-80 bg-white border-l border-gray-200 p-6 hidden lg:block`}>
              <div className="text-center mb-6">
                <div className={`${styles.agentAvatar} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <User size={32} className="text-[#ECDFCC]" />
                </div>
                <h3 className="text-xl font-bold text-[#1E201E]">{agent.name}</h3>
                <p className="text-sm text-[#222725] mb-2">{agent.title}</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.floor(agent.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
                    />
                  ))}
                  <span className="text-sm text-[#222725] ml-1">{agent.rating}</span>
                </div>
                <p className="text-xs text-[#222725]">{agent.experience} of experience</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#1E201E]" />
                  <span className="text-sm text-[#222725]">{agent.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#1E201E]" />
                  <span className="text-sm text-[#222725]">{agent.responseTime}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#1E201E] mb-3">Specialties</h4>
                <div className="space-y-2">
                  {agent.specialties.map((specialty, index) => (
                    <div key={index} className={`${styles.specialtyTag} text-xs px-3 py-1 rounded-full`}>
                      {specialty}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <button className={`${styles.actionButton} w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2`}>
                  <Calendar size={16} />
                  Schedule Meeting
                </button>
                <button className={`${styles.secondaryButton} w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2`}>
                  <Phone size={16} />
                  Call Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}