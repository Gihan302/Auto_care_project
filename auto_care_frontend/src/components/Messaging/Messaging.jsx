'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Phone, Video, MoreVertical, Search, Plus, Paperclip, Send, Bell, 
  FileText, Moon, Sun, X, User 
} from 'lucide-react';
import styles from './page.module.css';
import api from '@/utils/axios';

// --- UTILITY FUNCTION ---
const getAvatarLetter = (name) => name ? name.charAt(0).toUpperCase() : '?';

// --- CONFIGURATION ---
const config = {
  user: {
    apiBase: '/messages', 
    authStorageKey: 'user',
    title: 'Auto Care Connect',
    sidebarTitle: 'Messages',
    canStartNewChat: true,
    detailsType: 'company',
  },
  company: {
    apiBase: '/company/messages',
    authStorageKey: 'lcompany',
    title: 'Company Dashboard - Messages',
    sidebarTitle: 'User Messages',
    canStartNewChat: true,
    detailsType: 'user',
  },
  insurance: {
    apiBase: '/company/messages',
    authStorageKey: 'company',
    title: 'Insurance Dashboard - Messages',
    sidebarTitle: 'User Messages',
    canStartNewChat: true,
    detailsType: 'user',
  },
  agent: {
    apiBase: '/agent/messages',
    authStorageKey: 'agent',
    title: 'Agent Dashboard - Messages',
    sidebarTitle: 'Buyer Messages',
    canStartNewChat: false, // Agents reply to inquiries, don't start them
    detailsType: 'user',
  }
};

export default function Messaging({ role }) {
  // --- STATE ---
  const [isMounted, setIsMounted] = useState(false); // Fix for Hydration
  const [darkMode, setDarkMode] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [details, setDetails] = useState(null);
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
  const searchParams = useSearchParams();
  const roleConfig = config[role];

  // --- DERIVED STATE (Moved to top to fix "undefined" error) ---
  const selectedConversation = conversations.find(c => c.id === selectedChat);
  const participantName = selectedConversation 
    ? (selectedConversation.participantName || selectedConversation.companyName) 
    : '';

  // --- EFFECTS ---

  // 1. Handle Mounting (Fixes Hydration Error)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Initial Data Fetch & URL params
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      setAuthError(false);
      fetchConversations().then((convs) => {
        // Handle URL param selection after conversations load
        const conversationIdParam = searchParams.get('conversationId');
        if (conversationIdParam && convs && convs.length > 0) {
          const targetConv = convs.find(c => c.id === parseInt(conversationIdParam));
          if (targetConv) {
            const pName = targetConv.participantName || targetConv.companyName;
            handleSelectChat(targetConv.id, pName);
          }
        }
      });
      fetchUnreadCount();
      
      if (role === 'user') {
        fetchAvailableCompanies();
        setTimeout(loadDraftMessage, 1000);
      }
    } else {
      setAuthError(true);
      setLoading(false);
    }
  }, [role, searchParams]);

  // 3. Polling for new messages
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    const interval = setInterval(() => {
      if (selectedChat) {
        fetchMessages(selectedChat);
        const selectedConv = conversations.find(c => c.id === selectedChat);
        if (selectedConv) {
          const pName = selectedConv.participantName || selectedConv.companyName;
          fetchDetails(selectedChat, pName);
        }
      }
      fetchConversations();
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedChat, role, conversations]);

  // 4. Auto-scroll and Focus
  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { if (selectedChat) messageInputRef.current?.focus(); }, [selectedChat]);

  // --- API FUNCTIONS ---

  const getAuthData = () => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(roleConfig.authStorageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error parsing ${role} data:`, error);
      return null;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await api.get(`${roleConfig.apiBase}/conversations`);
      setConversations(response.data);
      setLoading(false);
      return response.data; // Return data for chaining
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (error.response?.status === 401) setAuthError(true);
      setLoading(false);
      return [];
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`${roleConfig.apiBase}/conversations/${conversationId}/messages`);
      setMessages(response.data);
      // Do not scroll to bottom on every poll, only on initial load or new message (handled by effect)
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchDetails = async (conversationId, pName) => {
    try {
      let response;
      if (role === 'agent') {
        response = await api.get(`/agent/messages/conversations/${conversationId}/user-details`);
      } else if (roleConfig.detailsType === 'company') {
        // User fetching Company Details
        response = await api.get(`/messages/companies/${encodeURIComponent(pName)}/details`);
      } else {
        // Company fetching User Details
        response = await api.get(`/company/messages/conversations/${conversationId}/user-details`);
      }
      setDetails(response.data);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get(`${roleConfig.apiBase}/unread-count`);
      setUnreadCount(response.data.count);
    } catch (error) {
      // Not critical
    }
  };

  const fetchAvailableCompanies = async () => {
    if (role !== 'user') return;
    try {
      const response = await api.get(`/messages/companies/all`);
      setAvailableCompanies(response.data);
    } catch (error) {
      console.error('Error fetching available companies:', error);
    }
  };

  const loadDraftMessage = () => {
    const draft = localStorage.getItem('draftMessage');
    if (draft) {
      setMessage(draft);
      setShowDraftNotification(true);
      localStorage.removeItem('draftMessage');
      setTimeout(() => setShowDraftNotification(false), 5000);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    if (!selectedChat) return;

    setSendingMessage(true);
    const endpoint = `${roleConfig.apiBase}/conversations/${selectedChat}/messages`;

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('messageText', message || 'Sent an attachment');
        formData.append('file', selectedFile);
        await api.post(`${endpoint}/attachment`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSelectedFile(null);
      } else {
        await api.post(endpoint, { messageText: message });
      }
      setMessage('');
      await fetchMessages(selectedChat);
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCreateConversation = async (companyName, companyType) => {
    if (role !== 'user') return;
    try {
      const response = await api.post(`/messages/conversations`, { companyName, companyType });
      const conversationId = response.data.conversationId;
      setShowNewChatModal(false);
      await fetchConversations();
      handleSelectChat(conversationId, companyName);
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to create conversation. Please try again.');
    }
  };

  const handleSelectChat = async (conversationId, pName) => {
    setSelectedChat(conversationId);
    await fetchMessages(conversationId);
    await fetchDetails(conversationId, pName);
    await fetchUnreadCount();
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      setSelectedFile(file);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMyAvatar = () => {
    const data = getAuthData();
    if (role === 'user') return data?.email ? getAvatarLetter(data.email) : 'U';
    return data?.cName ? getAvatarLetter(data.cName) : 'C';
  };

  const filteredConversations = conversations.filter(conv => {
    const pName = conv.participantName || conv.companyName || '';
    return pName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // --- RENDER ---

  if (authError) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
          <h2>Authentication Required</h2>
          <p>Please log in to access the messaging system.</p>
          <button onClick={() => window.location.href = role === 'user' ? '/signin' : '/company/signin'}
            style={{ padding: '12px 24px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? styles.dark : ''}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>{role === 'user' ? '🚗' : '🏢'}</div>
            <h1 className={styles.title}>{roleConfig.title}</h1>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.iconButton}>
              <Bell size={20} />
              {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>
            <button className={styles.iconButton} onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className={styles.avatar}>
              {/* Hydration safe avatar */}
              {isMounted ? getMyAvatar() : (role === 'user' ? 'U' : 'C')}
            </div>
          </div>
        </header>

        {showDraftNotification && (
          <div style={{ position: 'fixed', top: '80px', right: '20px', background: '#4CAF50', color: 'white', padding: '15px 20px', borderRadius: '8px', zIndex: 1000 }}>
            <FileText size={20} style={{ display: 'inline', marginRight: '10px' }} />
            <span>Draft message loaded from vehicle inquiry</span>
          </div>
        )}

        <div className={styles.mainContent}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>{roleConfig.sidebarTitle}</h2>
              {roleConfig.canStartNewChat && (
                <button className={styles.addButton} onClick={() => setShowNewChatModal(true)}>
                  <Plus size={18} />
                </button>
              )}
            </div>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input type="text" placeholder="Search conversations..." className={styles.searchInput} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className={styles.conversationList}>
              {loading ? <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div> :
                filteredConversations.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No conversations yet.</div> :
                  filteredConversations.map((conv) => {
                    const pName = conv.participantName || conv.companyName;
                    return (
                      <div key={conv.id} className={`${styles.conversationItem} ${selectedChat === conv.id ? styles.conversationItemActive : ''}`}
                        onClick={() => handleSelectChat(conv.id, pName)}>
                        <div className={styles.convAvatar}>{getAvatarLetter(pName)}</div>
                        <div className={styles.convContent}>
                          <div className={styles.convHeader}>
                            <h3 className={styles.convName}>{pName}</h3>
                            <span className={styles.convTime}>{formatTime(conv.lastMessageTime)}</span>
                          </div>
                          <p className={styles.convMessage}>{conv.lastMessage?.substring(0, 50) || 'No messages yet'}</p>
                          <span className={styles.statusBadge}>{conv.companyType}</span>
                          {conv.unreadCount > 0 && <span className={styles.unreadBadge}>{conv.unreadCount}</span>}
                        </div>
                      </div>
                    );
                  })}
            </div>
          </aside>

          {/* Chat Window */}
          <main className={styles.chatWindow}>
            {selectedConversation ? (
              <>
                <div className={styles.chatHeader}>
                  <div className={styles.chatHeaderLeft}>
                    <div className={styles.companyAvatarLarge}>{getAvatarLetter(participantName)}</div>
                    <div>
                      <h2 className={styles.companyName}>{participantName}</h2>
                      <span className={styles.onlineStatus}>● {selectedConversation.status || 'Online'}</span>
                    </div>
                  </div>
                  <div className={styles.chatHeaderRight}>
                    <button className={styles.iconButton}><Phone size={20} /></button>
                    <button className={styles.iconButton}><Video size={20} /></button>
                    <button className={styles.iconButton}><MoreVertical size={20} /></button>
                  </div>
                </div>
                <div className={styles.messagesContainer}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`${styles.messageWrapper} ${msg.senderType === role ? styles.messageWrapperUser : ''}`}>
                      {msg.senderType !== role && <div className={styles.messageAvatar}>{getAvatarLetter(participantName)}</div>}
                      <div className={`${styles.messageBubble} ${msg.senderType === role ? styles.messageBubbleUser : styles.messageBubbleCompany}`}>
                        <p className={styles.messageText}>{msg.messageText}</p>
                        {msg.attachmentUrl && (
                          <div className={styles.attachment}>
                            <FileText size={16} />
                            <span>{msg.attachmentName}</span>
                            <a href={msg.attachmentUrl} download className={styles.downloadBtn}>↓</a>
                          </div>
                        )}
                        <span className={styles.messageTime}>{formatMessageTime(msg.createdAt)}</span>
                      </div>
                      {msg.senderType === role && (
                        <div className={styles.messageAvatarUser}>
                          {isMounted ? getMyAvatar() : (role === 'user' ? 'U' : 'C')}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className={styles.inputContainer}>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                  <button className={styles.attachButton} onClick={() => fileInputRef.current?.click()}><Paperclip size={20} /></button>
                  {selectedFile && (
                    <div className={styles.filePreview}>
                      <FileText size={16} />
                      <span>{selectedFile.name}</span>
                      <button onClick={() => setSelectedFile(null)}><X size={16} /></button>
                    </div>
                  )}
                  <input ref={messageInputRef} type="text" placeholder="Type your message..." value={message} onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()} className={styles.messageInput} disabled={sendingMessage} />
                  <button className={styles.emojiButton}>😊</button>
                  <button className={styles.sendButton} onClick={handleSendMessage} disabled={sendingMessage || (!message.trim() && !selectedFile)}><Send size={20} /></button>
                </div>
              </>
            ) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Select a conversation</div>}
          </main>

          {/* Right Panel */}
          <aside className={styles.rightPanel}>
            {details ? (
              roleConfig.detailsType === 'company' ? (
                <CompanyDetailsPanel details={details} />
              ) : (
                <UserDetailsPanel details={details} />
              )
            ) : <div style={{ padding: '20px', textAlign: 'center' }}>Select a conversation to view details</div>}
          </aside>
        </div>

        {role === 'user' && showNewChatModal && (
          <NewChatModal
            availableCompanies={availableCompanies}
            onClose={() => setShowNewChatModal(false)}
            onCreateConversation={handleCreateConversation}
          />
        )}
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function CompanyDetailsPanel({ details }) {
  return (
    <div className={styles.companyCard}>
      <div className={styles.companyCardHeader}><div className={styles.companyLogoLarge}>{getAvatarLetter(details.companyName)}</div></div>
      <h2 className={styles.companyCardName}>{details.companyName}</h2>
      <p className={styles.companyCardType}>{details.companyType === 'insurance' ? 'Insurance Provider' : details.companyType === 'agent' ? 'Agent' : 'Leasing Company'}</p>
      <div className={styles.actionButtons}>
        <button className={styles.callButton}><Phone size={16} /> Call</button>
        <button className={styles.visitButton}>🌐 Visit</button>
      </div>
    </div>
  );
}

function UserDetailsPanel({ details }) {
  const agentName = [details.fname, details.lname].filter(Boolean).join(' ');
  const displayName = agentName.trim() ? agentName : "User";

  return (
    <div className={styles.companyCard}>
      <div className={styles.companyCardHeader}>
        <div className={styles.companyLogoLarge}>{getAvatarLetter(displayName)}</div>
      </div>
      <h2 className={styles.companyCardName}>{displayName}</h2>
      <p className={styles.companyCardType}>{details.username}</p>
      <p style={{fontSize: '14px', color: '#666', marginTop: '5px'}}>{details.email}</p>
      <p style={{fontSize: '14px', color: '#666', marginTop: '5px'}}>{details.tnumber}</p>
      <div className={styles.actionButtons}>
        <button className={styles.callButton}><Phone size={16} /> Call</button>
        <button className={styles.visitButton}>📧 Email</button>
      </div>
    </div>
  );
}

function NewChatModal({ availableCompanies, onClose, onCreateConversation }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Start New Conversation</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <div className={styles.modalContent}>
          {availableCompanies.insuranceCompanies?.length > 0 && (
            <div className={styles.companySection}>
              <h3>Insurance Companies</h3>
              {Array.from(availableCompanies.insuranceCompanies).map((company, index) => (
                <button key={index} className={styles.companyButton} onClick={() => onCreateConversation(company, 'insurance')}>
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
                <button key={index} className={styles.companyButton} onClick={() => onCreateConversation(company, 'leasing')}>
                  <div className={styles.companyAvatar}>{getAvatarLetter(company)}</div>
                  <span>{company}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}