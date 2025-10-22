'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, Video, MoreVertical, Search, Plus, Paperclip, Send, Bell, FileText, CreditCard, AlertTriangle, Moon, Sun, X } from 'lucide-react';
import styles from './page.module.css';

const API_BASE_URL = 'http://localhost:8080/user';

export default function AutoCareMessaging() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState({ insuranceCompanies: [], leasingCompanies: [] });
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showDraftNotification, setShowDraftNotification] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);

  // Get auth token - works with your existing login
  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    
    // First, try direct token from localStorage
    let token = localStorage.getItem('token');
    
    // If no direct token, get it from user object (your login stores it there)
    if (!token) {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          token = user.accessToken || user.token;
          
          if (token) {
            console.log('🔑 Token extracted from user object');
            // Store it directly for faster access next time
            localStorage.setItem('token', token);
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    if (token) {
      console.log('✅ Token found, length:', token.length);
    } else {
      console.log('❌ No token available');
    }
    
    return token;
  };

  // Create API client helper
  const apiCall = async (url, options = {}) => {
    const token = getAuthToken();
    
    console.log('📡 API Call:', url);
    console.log('🔐 Using token:', token ? 'Yes' : 'No');
    
    const headers = {
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.log('⚠️ No token available for request');
    }

    // Handle FormData vs JSON
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    console.log('📤 Request headers:', headers);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📥 Response status:', response.status);

    if (response.status === 401) {
      console.error('🚫 401 Unauthorized - Token may be invalid or expired');
      setAuthError(true);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Check if user is authenticated
  const checkAuth = () => {
    if (typeof window === 'undefined') return false;
    const token = getAuthToken();
    if (!token) {
      console.log('❌ No token found in localStorage');
      return false;
    }
    console.log('✅ Token found');
    return true;
  };

  // Get user data
  const getUserData = () => {
    if (typeof window === 'undefined') return null;
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
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

  const fetchCompanyDetails = async (companyName) => {
    try {
      const data = await apiCall(`${API_BASE_URL}/companies/${encodeURIComponent(companyName)}/details`);
      setCompanyDetails(data);
    } catch (error) {
      console.error('❌ Error fetching company details:', error);
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
      // Don't show error for unread count - it's not critical
    }
  };

  const fetchAvailableCompanies = async () => {
    try {
      const data = await apiCall(`${API_BASE_URL}/companies/all`);
      setAvailableCompanies(data);
    } catch (error) {
      console.error('❌ Error fetching available companies:', error);
    }
  };

  // Load draft message from sessionStorage
  const loadDraftMessage = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const draftData = sessionStorage.getItem('draftMessage');
      if (draftData) {
        const draft = JSON.parse(draftData);
        console.log('📝 Draft message found:', draft);
        
        setMessage(draft.message);
        
        if (draft.conversationId) {
          setSelectedChat(draft.conversationId);
          fetchMessages(draft.conversationId);
          fetchCompanyDetails(draft.companyName);
        }
        
        setShowDraftNotification(true);
        setTimeout(() => setShowDraftNotification(false), 5000);
        
        setTimeout(() => {
          messageInputRef.current?.focus();
        }, 500);
        
        sessionStorage.removeItem('draftMessage');
      }
    } catch (error) {
      console.error('Error loading draft message:', error);
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

  const handleCreateConversation = async (companyName, companyType) => {
    try {
      const data = await apiCall(`${API_BASE_URL}/conversations`, {
        method: 'POST',
        body: JSON.stringify({ companyName, companyType })
      });
      
      const conversationId = data.conversationId;
      setShowNewChatModal(false);
      
      await fetchConversations();
      handleSelectChat(conversationId, companyName);
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      alert('Failed to create conversation. Please try again.');
    }
  };

  const handleSelectChat = async (conversationId, companyName) => {
    setSelectedChat(conversationId);
    await fetchMessages(conversationId);
    await fetchCompanyDetails(companyName);
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
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getUserAvatar = () => {
    const user = getUserData();
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const filteredConversations = conversations.filter(conv =>
    conv.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    console.log('🚀 Messaging component mounted');
    
    if (checkAuth()) {
      const user = getUserData();
      console.log('👤 User:', user?.email || 'Unknown');
      
      fetchConversations();
      fetchUnreadCount();
      fetchAvailableCompanies();
      
      setTimeout(() => {
        loadDraftMessage();
      }, 1000);
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
          <p>Please log in to access the messaging system.</p>
          <button 
            onClick={() => window.location.href = '/signin'}
            style={{
              padding: '12px 24px',
              background: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Sign In
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
            <div className={styles.logo}>🚗</div>
            <h1 className={styles.title}>Auto Care Connect</h1>
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
            <div className={styles.avatar}>{getUserAvatar()}</div>
          </div>
        </header>

        {showDraftNotification && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: '#4CAF50',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}>
            <FileText size={20} style={{ display: 'inline', marginRight: '10px' }} />
            <span>Draft message loaded from vehicle inquiry</span>
          </div>
        )}

        <div className={styles.mainContent}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Messages</h2>
              <button 
                className={styles.addButton}
                onClick={() => setShowNewChatModal(true)}
              >
                <Plus size={18} />
              </button>
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
                  {searchQuery ? 'No conversations found' : 'No conversations yet. Click + to start chatting!'}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`${styles.conversationItem} ${selectedChat === conv.id ? styles.conversationItemActive : ''}`}
                    onClick={() => handleSelectChat(conv.id, conv.companyName)}
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
                      <span className={styles.onlineStatus}>● {selectedConversation.status}</span>
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
                        className={`${styles.messageWrapper} ${msg.senderType === 'user' ? styles.messageWrapperUser : ''}`}
                      >
                        {msg.senderType === 'company' && (
                          <div className={styles.messageAvatar}>
                            {getAvatarLetter(selectedConversation.companyName)}
                          </div>
                        )}
                        <div className={`${styles.messageBubble} ${msg.senderType === 'user' ? styles.messageBubbleUser : styles.messageBubbleCompany}`}>
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
                        {msg.senderType === 'user' && (
                          <div className={styles.messageAvatarUser}>{getUserAvatar()}</div>
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
                    placeholder="Type your message..."
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
                Select a conversation to start messaging
              </div>
            )}
          </main>

          <aside className={styles.rightPanel}>
            {companyDetails ? (
              <>
                <div className={styles.companyCard}>
                  <div className={styles.companyCardHeader}>
                    <div className={styles.companyLogoLarge}>
                      {getAvatarLetter(companyDetails.companyName)}
                    </div>
                  </div>
                  <h2 className={styles.companyCardName}>{companyDetails.companyName}</h2>
                  <p className={styles.companyCardType}>
                    {companyDetails.companyType === 'insurance' ? 'Insurance Provider' : 'Leasing Company'}
                  </p>
                  
                  <div className={styles.actionButtons}>
                    <button className={styles.callButton}>
                      <Phone size={16} />
                      Call
                    </button>
                    <button className={styles.visitButton}>
                      🌐 Visit
                    </button>
                  </div>
                </div>

                {companyDetails.insurancePlans?.length > 0 && (
                  <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Active Insurance Plans</h3>
                    {companyDetails.insurancePlans.map((plan, index) => (
                      <div key={index} className={styles.planCard}>
                        <div className={styles.planHeader}>
                          <span className={styles.planName}>{plan.planType}</span>
                          <span className={styles.planStatus}>{plan.planStatus}</span>
                        </div>
                        <p className={styles.planDetail}>
                          Expires: {new Date(plan.expiresAt).toLocaleDateString()}
                        </p>
                        <p className={styles.planPrice}>${plan.monthlyPrice}/month</p>
                      </div>
                    ))}
                  </div>
                )}

                {companyDetails.leasingPlans?.length > 0 && (
                  <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Active Leases</h3>
                    {companyDetails.leasingPlans.map((plan, index) => (
                      <div key={index} className={styles.planCard}>
                        <div className={styles.planHeader}>
                          <span className={styles.planName}>{plan.vehicleInfo}</span>
                          <span className={styles.planStatus}>{plan.leaseStatus}</span>
                        </div>
                        <p className={styles.planDetail}>
                          Ends: {new Date(plan.leaseEndDate).toLocaleDateString()}
                        </p>
                        <p className={styles.planPrice}>${plan.monthlyPayment}/month</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Quick Actions</h3>
                  <button className={styles.quickActionButton}>
                    <FileText size={18} />
                    View Policy Documents
                  </button>
                  <button className={styles.quickActionButton}>
                    <CreditCard size={18} />
                    Payment History
                  </button>
                  <button className={styles.quickActionButton}>
                    <AlertTriangle size={18} />
                    File a Claim
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Select a conversation to view details
              </div>
            )}
          </aside>
        </div>

        {showNewChatModal && (
          <div className={styles.modalOverlay} onClick={() => setShowNewChatModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Start New Conversation</h2>
                <button onClick={() => setShowNewChatModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className={styles.modalContent}>
                {availableCompanies.insuranceCompanies?.length > 0 && (
                  <div className={styles.companySection}>
                    <h3>Insurance Companies</h3>
                    {Array.from(availableCompanies.insuranceCompanies).map((company, index) => (
                      <button
                        key={index}
                        className={styles.companyButton}
                        onClick={() => handleCreateConversation(company, 'insurance')}
                      >
                        <div className={styles.companyAvatar}>{getAvatarLetter(company)}</div>
                        <span>{company}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {availableCompanies.leasingCompanies?.length > 0 && (
                  <div className={styles.companySection}>
                    <h3>Leasing Companies</h3>
                    {Array.from(availableCompanies.leasingCompanies).map((company, index) => (
                      <button
                        key={index}
                        className={styles.companyButton}
                        onClick={() => handleCreateConversation(company, 'leasing')}
                      >
                        <div className={styles.companyAvatar}>{getAvatarLetter(company)}</div>
                        <span>{company}</span>
                      </button>
                    ))}
                  </div>
                )}

                {availableCompanies.insuranceCompanies?.length === 0 && 
                 availableCompanies.leasingCompanies?.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                    No companies available. Please purchase a plan or lease first.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}