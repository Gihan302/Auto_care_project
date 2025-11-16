'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, Video, MoreVertical, Search, Paperclip, Send, Bell, FileText, X, Moon, Sun, User } from 'lucide-react';
import styles from './page.module.css';

const API_BASE_URL = 'http://localhost:8080/api/company';

export default function CompanyMessaging() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [authError, setAuthError] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);

  // Get auth token for company
  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    
    let token = localStorage.getItem('companyToken');
    
    if (!token) {
      try {
        const companyData = localStorage.getItem('company');
        if (companyData) {
          const company = JSON.parse(companyData);
          token = company.accessToken || company.token;
          
          if (token) {
            localStorage.setItem('companyToken', token);
          }
        }
      } catch (error) {
        console.error('Error parsing company data:', error);
      }
    }
    
    return token;
  };

  // API call helper
  const apiCall = async (url, options = {}) => {
    const token = getAuthToken();
    
    console.log('📡 API Call:', url);
    
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('⚠️ No token available for request');
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📥 Response status:', response.status);

    if (response.status === 401) {
      console.error('🚫 401 Unauthorized');
      setAuthError(true);
      localStorage.removeItem('companyToken');
      localStorage.removeItem('company');
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Check authentication
  const checkAuth = () => {
    if (typeof window === 'undefined') return false;
    const token = getAuthToken();
    if (!token) {
      console.log('❌ No company token found');
      return false;
    }
    console.log('✅ Company token found');
    return true;
  };

  // Get company data
  const getCompanyData = () => {
    if (typeof window === 'undefined') return null;
    try {
      const companyData = localStorage.getItem('company');
      return companyData ? JSON.parse(companyData) : null;
    } catch (error) {
      console.error('Error parsing company data:', error);
      return null;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      console.log('📡 Fetching conversations...');
      const data = await apiCall(`${API_BASE_URL}/conversations`);
      console.log('✅ Conversations fetched:', data.length);
      setConversations(data);
      setLoading(false);
      setAuthError(false);
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      console.log('📡 Fetching messages for conversation:', conversationId);
      const data = await apiCall(`${API_BASE_URL}/conversations/${conversationId}/messages`);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
    }
  };

  const fetchUserDetails = async (conversationId) => {
    try {
      const data = await apiCall(`${API_BASE_URL}/conversations/${conversationId}/user-details`);
      setUserDetails(data);
    } catch (error) {
      console.error('❌ Error fetching user details:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      console.log('📡 Fetching unread count...');
      const data = await apiCall(`${API_BASE_URL}/messages/unread-count`);
      console.log('✅ Unread count:', data.count);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    if (!selectedChat) return;

    setSendingMessage(true);
    
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('messageText', message || 'Sent an attachment');
        formData.append('file', selectedFile);

        await apiCall(`${API_BASE_URL}/conversations/${selectedChat}/messages/attachment`, {
          method: 'POST',
          body: formData
        });
        
        setSelectedFile(null);
      } else {
        await apiCall(`${API_BASE_URL}/conversations/${selectedChat}/messages`, {
          method: 'POST',
          body: JSON.stringify({ messageText: message })
        });
      }

      setMessage('');
      await fetchMessages(selectedChat);
      await fetchConversations();
    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSelectChat = async (conversationId) => {
    setSelectedChat(conversationId);
    await fetchMessages(conversationId);
    await fetchUserDetails(conversationId);
    await fetchUnreadCount();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getAvatarLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getCompanyAvatar = () => {
    const company = getCompanyData();
    if (company && company.companyName) {
      return company.companyName.charAt(0).toUpperCase();
    }
    if (company && company.email) {
      return company.email.charAt(0).toUpperCase();
    }
    return 'C';
  };

  const filteredConversations = conversations.filter(conv =>
    conv.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    console.log('🚀 Company Messaging component mounted');
    
    if (checkAuth()) {
      const company = getCompanyData();
      console.log('🏢 Company:', company?.companyName || company?.email || 'Unknown');
      
      fetchConversations();
      fetchUnreadCount();
    } else {
      console.log('🔒 Not authenticated');
      setAuthError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!checkAuth()) return;

    const interval = setInterval(() => {
      if (selectedChat) {
        fetchMessages(selectedChat);
      }
      fetchConversations();
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  if (authError) {
    return (
      <div className={styles.container}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h2>Authentication Required</h2>
          <p>Please log in to access the company messaging system.</p>
          <button 
            onClick={() => window.location.href = '/signin'}
            style={{
              padding: '12px 24px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Company Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? styles.dark : ''}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>🏢</div>
            <h1 className={styles.title}>Company Portal - Messages</h1>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.iconButton}>
              <Bell size={20} />
              {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>
            <button 
              className={styles.iconButton}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className={styles.avatar}>{getCompanyAvatar()}</div>
          </div>
        </header>

        <div className={styles.mainContent}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>User Messages</h2>
            </div>
            
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search conversations..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.conversationList}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
              ) : filteredConversations.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  {searchQuery ? 'No conversations found' : 'No user messages yet'}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`${styles.conversationItem} ${selectedChat === conv.id ? styles.conversationItemActive : ''}`}
                    onClick={() => handleSelectChat(conv.id)}
                  >
                    <div className={styles.convAvatar}>{getAvatarLetter(conv.companyName)}</div>
                    <div className={styles.convContent}>
                      <div className={styles.convHeader}>
                        <h3 className={styles.convName}>{conv.companyName}</h3>
                        <span className={styles.convTime}>{formatTime(conv.lastMessageTime)}</span>
                      </div>
                      <p className={styles.convMessage}>
                        {conv.lastMessage && conv.lastMessage.length > 50 
                          ? conv.lastMessage.substring(0, 50) + '...' 
                          : conv.lastMessage || 'No messages yet'}
                      </p>
                      <span className={styles.statusBadge}>{conv.companyType}</span>
                      {conv.unreadCount > 0 && (
                        <span className={styles.unreadBadge}>{conv.unreadCount}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          <main className={styles.chatWindow}>
            {selectedConversation ? (
              <>
                <div className={styles.chatHeader}>
                  <div className={styles.chatHeaderLeft}>
                    <div className={styles.companyAvatarLarge}>
                      {getAvatarLetter(selectedConversation.companyName)}
                    </div>
                    <div>
                      <h2 className={styles.companyName}>{selectedConversation.companyName}</h2>
                      <span className={styles.onlineStatus}>● User Conversation</span>
                    </div>
                  </div>
                  <div className={styles.chatHeaderRight}>
                    <button className={styles.iconButton}>
                      <Phone size={20} />
                    </button>
                    <button className={styles.iconButton}>
                      <Video size={20} />
                    </button>
                    <button className={styles.iconButton}>
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                <div className={styles.messagesContainer}>
                  {messages.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${styles.messageWrapper} ${msg.senderType === 'company' ? styles.messageWrapperUser : ''}`}
                      >
                        {msg.senderType === 'user' && (
                          <div className={styles.messageAvatar}>
                            {getAvatarLetter(selectedConversation.companyName)}
                          </div>
                        )}
                        <div className={`${styles.messageBubble} ${msg.senderType === 'company' ? styles.messageBubbleUser : styles.messageBubbleCompany}`}>
                          <p className={styles.messageText}>{msg.messageText}</p>
                          {msg.attachmentUrl && (
                            <div className={styles.attachment}>
                              <FileText size={16} />
                              <span>{msg.attachmentName}</span>
                              <a 
                                href={`http://localhost:8080${msg.attachmentUrl}`} 
                                download
                                className={styles.downloadBtn}
                              >
                                ↓
                              </a>
                            </div>
                          )}
                          <span className={styles.messageTime}>{formatMessageTime(msg.createdAt)}</span>
                        </div>
                        {msg.senderType === 'company' && (
                          <div className={styles.messageAvatarUser}>{getCompanyAvatar()}</div>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className={styles.inputContainer}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <button 
                    className={styles.attachButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip size={20} />
                  </button>
                  
                  {selectedFile && (
                    <div className={styles.filePreview}>
                      <FileText size={16} />
                      <span>{selectedFile.name}</span>
                      <button onClick={() => setSelectedFile(null)}>
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  <input
                    ref={messageInputRef}
                    type="text"
                    placeholder="Type your reply..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
                    className={styles.messageInput}
                    disabled={sendingMessage}
                  />
                  <button className={styles.emojiButton}>😊</button>
                  <button 
                    className={styles.sendButton}
                    onClick={handleSendMessage}
                    disabled={sendingMessage || (!message.trim() && !selectedFile)}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#666',
                fontSize: '18px'
              }}>
                Select a conversation to view and reply to messages
              </div>
            )}
          </main>

          <aside className={styles.rightPanel}>
            {userDetails ? (
              <>
                <div className={styles.companyCard}>
                  <div className={styles.companyCardHeader}>
                    <div className={styles.companyLogoLarge}>
                      <User size={40} />
                    </div>
                  </div>
                  <h2 className={styles.companyCardName}>User Details</h2>
                  <p className={styles.companyCardType}>
                    {userDetails.email}
                  </p>
                  
                  <div className={styles.actionButtons}>
                    <button className={styles.callButton}>
                      <Phone size={16} />
                      Call
                    </button>
                    <button className={styles.visitButton}>
                      📧 Email
                    </button>
                  </div>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Quick Actions</h3>
                  <button className={styles.quickActionButton}>
                    <FileText size={18} />
                    View User History
                  </button>
                  <button className={styles.quickActionButton}>
                    <FileText size={18} />
                    Send Documents
                  </button>
                  <button className={styles.quickActionButton}>
                    <FileText size={18} />
                    Create Support Ticket
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Select a conversation to view user details
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}