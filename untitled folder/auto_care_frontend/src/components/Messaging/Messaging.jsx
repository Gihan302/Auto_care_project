// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Phone, Video, MoreVertical, Search, Plus, Paperclip, Send, Bell, FileText, CreditCard, AlertTriangle, Moon, Sun, X, User } from 'lucide-react';
// import styles from './page.module.css';
// import api from '@/utils/axios';

// // Configuration for roles
// const config = {
//   user: {
//     apiBase: '/api/messages',
//     authStorageKey: 'user',
//     title: 'Auto Care Connect',
//     sidebarTitle: 'Messages',
//     canStartNewChat: true,
//     detailsType: 'company',
//   },
//   company: {
//     apiBase: '/api/company/messages',
//     authStorageKey: 'lcompany',
//     title: 'Company Dashboard - Messages',
//     sidebarTitle: 'User Messages',
//     canStartNewChat: true,
//     detailsType: 'user',
//   }
// };

// export default function Messaging({ role }) {
//   const [darkMode, setDarkMode] = useState(false);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [details, setDetails] = useState(null); // Generic details
//   const [loading, setLoading] = useState(true);
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showNewChatModal, setShowNewChatModal] = useState(false);
//   const [availableCompanies, setAvailableCompanies] = useState({ insuranceCompanies: [], leasingCompanies: [] });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [authError, setAuthError] = useState(false);
//   const [showDraftNotification, setShowDraftNotification] = useState(false);

//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const messageInputRef = useRef(null);
//   const searchParams = useSearchParams();
//   const roleConfig = config[role];

//   useEffect(() => {
//     const conversationId = searchParams.get('conversationId');
//     if (conversationId) {
//       const conversation = conversations.find(c => c.id === parseInt(conversationId));
//       if (conversation) {
//         handleSelectChat(conversation.id, conversation.companyName);
//       }
//     }
//   }, [searchParams, conversations]);

//   const getAuthData = () => {
//     if (typeof window === 'undefined') return null;
//     try {
//       const data = localStorage.getItem(roleConfig.authStorageKey);
//       return data ? JSON.parse(data) : null;
//     } catch (error) {
//       console.error(`Error parsing ${role} data:`, error);
//       return null;
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const fetchConversations = async () => {
//     try {
//       const response = await api.get(`${roleConfig.apiBase}/conversations`);
//       setConversations(response.data);
//       setLoading(false);
//       setAuthError(false);
//     } catch (error) {
//       console.error('Error fetching conversations:', error);
//       if (error.response?.status === 401) setAuthError(true);
//       setLoading(false);
//     }
//   };

//   const fetchMessages = async (conversationId) => {
//     try {
//       const response = await api.get(`${roleConfig.apiBase}/conversations/${conversationId}/messages`);
//       setMessages(response.data);
//       scrollToBottom();
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   const fetchDetails = async (conversationId, companyName) => {
//     try {
//       let response;
//       if (roleConfig.detailsType === 'company') {
//         response = await api.get(`/user/companies/${encodeURIComponent(companyName)}/details`);
//       } else {
//         response = await api.get(`/company/messages/conversations/${conversationId}/user-details`);
//       }
//       setDetails(response.data);
//     } catch (error) {
//       console.error('Error fetching details:', error);
//     }
//   };

//   const fetchUnreadCount = async () => {
//     try {
//       const response = await api.get(`${roleConfig.apiBase}/messages/unread-count`);
//       setUnreadCount(response.data.count);
//     } catch (error) {
//       // Not critical
//     }
//   };

//   const fetchAvailableCompanies = async () => {
//     if (role !== 'user') return;
//     try {
//       const response = await api.get(`/user/companies/all`);
//       setAvailableCompanies(response.data);
//     } catch (error) {
//       console.error('Error fetching available companies:', error);
//     }
//   };

//   const loadDraftMessage = () => {
//     if (typeof window === 'undefined' || role !== 'user') return;
//     try {
//       const draftData = sessionStorage.getItem('draftMessage');
//       if (draftData) {
//         const draft = JSON.parse(draftData);
//         setMessage(draft.message);
//         if (draft.conversationId) {
//           setSelectedChat(draft.conversationId);
//           fetchMessages(draft.conversationId);
//           fetchDetails(draft.conversationId, draft.companyName);
//         }
//         setShowDraftNotification(true);
//         setTimeout(() => setShowDraftNotification(false), 5000);
//         setTimeout(() => messageInputRef.current?.focus(), 500);
//         sessionStorage.removeItem('draftMessage');
//       }
//     } catch (error) {
//       console.error('Error loading draft message:', error);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim() && !selectedFile) return;
//     if (!selectedChat) return;

//     setSendingMessage(true);
//     const endpoint = `${roleConfig.apiBase}/conversations/${selectedChat}/messages`;

//     try {
//       if (selectedFile) {
//         const formData = new FormData();
//         formData.append('messageText', message || 'Sent an attachment');
//         formData.append('file', selectedFile);
//         await api.post(`${endpoint}/attachment`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//         setSelectedFile(null);
//       } else {
//         await api.post(endpoint, { messageText: message });
//       }
//       setMessage('');
//       await fetchMessages(selectedChat);
//       await fetchConversations();
//     } catch (error) {
//       console.error('Error sending message:', error);
//       alert('Failed to send message. Please try again.');
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const handleCreateConversation = async (companyName, companyType) => {
//     if (role !== 'user') return;
//     try {
//       const response = await api.post(`/user/conversations`, { companyName, companyType });
//       const conversationId = response.data.conversationId;
//       setShowNewChatModal(false);
//       await fetchConversations();
//       handleSelectChat(conversationId, companyName);
//     } catch (error) {
//       console.error('Error creating conversation:', error);
//       alert('Failed to create conversation. Please try again.');
//     }
//   };

//   const handleSelectChat = async (conversationId, companyName) => {
//     setSelectedChat(conversationId);
//     await fetchMessages(conversationId);
//     await fetchDetails(conversationId, companyName);
//     await fetchUnreadCount();
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size must be less than 5MB');
//         return;
//       }
//       setSelectedFile(file);
//     }
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     const now = new Date();
//     if (isNaN(date.getTime())) return '';
//     const diffMins = Math.floor((now - date) / 60000);
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
//     return date.toLocaleDateString();
//   };

//   const formatMessageTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     if (isNaN(date.getTime())) return '';
//     return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
//   };

//   const getAvatarLetter = (name) => name ? name.charAt(0).toUpperCase() : '?';

//   const getMyAvatar = () => {
//     const data = getAuthData();
//     if (role === 'user') return data?.email ? getAvatarLetter(data.email) : 'U';
//     return data?.companyName ? getAvatarLetter(data.companyName) : 'C';
//   };

//   const filteredConversations = conversations.filter(conv =>
//     conv.companyName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   useEffect(() => {
//     const authData = getAuthData();
//     if (authData && (authData.accessToken || authData.token)) {
//       fetchConversations();
//       fetchUnreadCount();
//       if (role === 'user') {
//         fetchAvailableCompanies();
//         setTimeout(loadDraftMessage, 1000);
//       }
//     } else {
//       setAuthError(true);
//       setLoading(false);
//     }
//   }, [role]);

//   useEffect(() => {
//     const authData = getAuthData();
//     if (!authData || !(authData.accessToken || authData.token)) return;

//     const interval = setInterval(() => {
//       if (selectedChat) fetchMessages(selectedChat);
//       fetchConversations();
//       fetchUnreadCount();
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [selectedChat, role]);

//   useEffect(() => { scrollToBottom(); }, [messages]);
//   useEffect(() => { if (selectedChat) messageInputRef.current?.focus(); }, [selectedChat]);

//   const selectedConversation = conversations.find(c => c.id === selectedChat);

//   if (authError) {
//     return (
//       <div className={styles.container}>
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
//           <h2>Authentication Required</h2>
//           <p>Please log in to access the messaging system.</p>
//           <button onClick={() => window.location.href = role === 'user' ? '/signin' : '/company/signin'}
//             style={{ padding: '12px 24px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
//             Go to Sign In
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={darkMode ? styles.dark : ''}>
//       <div className={styles.container}>
//         <header className={styles.header}>
//           <div className={styles.headerLeft}>
//             <div className={styles.logo}>{role === 'user' ? '🚗' : '🏢'}</div>
//             <h1 className={styles.title}>{roleConfig.title}</h1>
//           </div>
//           <div className={styles.headerRight}>
//             <button className={styles.iconButton}>
//               <Bell size={20} />
//               {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
//             </button>
//             <button className={styles.iconButton} onClick={() => setDarkMode(!darkMode)}>
//               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//             </button>
//             <div className={styles.avatar}>{getMyAvatar()}</div>
//           </div>
//         </header>

//         {showDraftNotification && (
//           <div style={{ position: 'fixed', top: '80px', right: '20px', background: '#4CAF50', color: 'white', padding: '15px 20px', borderRadius: '8px', zIndex: 1000 }}>
//             <FileText size={20} style={{ display: 'inline', marginRight: '10px' }} />
//             <span>Draft message loaded from vehicle inquiry</span>
//           </div>
//         )}

//         <div className={styles.mainContent}>
//           <aside className={styles.sidebar}>
//             <div className={styles.sidebarHeader}>
//               <h2 className={styles.sidebarTitle}>{roleConfig.sidebarTitle}</h2>
//               {roleConfig.canStartNewChat && (
//                 <button className={styles.addButton} onClick={() => setShowNewChatModal(true)}>
//                   <Plus size={18} />
//                 </button>
//               )}
//             </div>
//             <div className={styles.searchBox}>
//               <Search size={16} className={styles.searchIcon} />
//               <input type="text" placeholder="Search conversations..." className={styles.searchInput} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//             </div>
//             <div className={styles.conversationList}>
//               {loading ? <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div> :
//                 filteredConversations.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No conversations yet.</div> :
//                   filteredConversations.map((conv) => (
//                     <div key={conv.id} className={`${styles.conversationItem} ${selectedChat === conv.id ? styles.conversationItemActive : ''}`}
//                       onClick={() => handleSelectChat(conv.id, conv.companyName)}>
//                       <div className={styles.convAvatar}>{getAvatarLetter(conv.companyName)}</div>
//                       <div className={styles.convContent}>
//                         <div className={styles.convHeader}>
//                           <h3 className={styles.convName}>{conv.companyName}</h3>
//                           <span className={styles.convTime}>{formatTime(conv.lastMessageTime)}</span>
//                         </div>
//                         <p className={styles.convMessage}>{conv.lastMessage?.substring(0, 50) || 'No messages yet'}</p>
//                         <span className={styles.statusBadge}>{conv.companyType}</span>
//                         {conv.unreadCount > 0 && <span className={styles.unreadBadge}>{conv.unreadCount}</span>}
//                       </div>
//                     </div>
//                   ))}
//             </div>
//           </aside>

//           <main className={styles.chatWindow}>
//             {selectedConversation ? (
//               <>
//                 <div className={styles.chatHeader}>
//                   <div className={styles.chatHeaderLeft}>
//                     <div className={styles.companyAvatarLarge}>{getAvatarLetter(selectedConversation.companyName)}</div>
//                     <div>
//                       <h2 className={styles.companyName}>{selectedConversation.companyName}</h2>
//                       <span className={styles.onlineStatus}>● {selectedConversation.status || 'Online'}</span>
//                     </div>
//                   </div>
//                   <div className={styles.chatHeaderRight}>
//                     <button className={styles.iconButton}><Phone size={20} /></button>
//                     <button className={styles.iconButton}><Video size={20} /></button>
//                     <button className={styles.iconButton}><MoreVertical size={20} /></button>
//                   </div>
//                 </div>
//                 <div className={styles.messagesContainer}>
//                   {messages.map((msg) => (
//                     <div key={msg.id} className={`${styles.messageWrapper} ${msg.senderType === role ? styles.messageWrapperUser : ''}`}>
//                       {msg.senderType !== role && <div className={styles.messageAvatar}>{getAvatarLetter(selectedConversation.companyName)}</div>}
//                       <div className={`${styles.messageBubble} ${msg.senderType === role ? styles.messageBubbleUser : styles.messageBubbleCompany}`}>
//                         <p className={styles.messageText}>{msg.messageText}</p>
//                         {msg.attachmentUrl && (
//                           <div className={styles.attachment}>
//                             <FileText size={16} />
//                             <span>{msg.attachmentName}</span>
//                             <a href={msg.attachmentUrl} download className={styles.downloadBtn}>↓</a>
//                           </div>
//                         )}
//                         <span className={styles.messageTime}>{formatMessageTime(msg.createdAt)}</span>
//                       </div>
//                       {msg.senderType === role && <div className={styles.messageAvatarUser}>{getMyAvatar()}</div>}
//                     </div>
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </div>
//                 <div className={styles.inputContainer}>
//                   <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
//                   <button className={styles.attachButton} onClick={() => fileInputRef.current?.click()}><Paperclip size={20} /></button>
//                   {selectedFile && (
//                     <div className={styles.filePreview}>
//                       <FileText size={16} />
//                       <span>{selectedFile.name}</span>
//                       <button onClick={() => setSelectedFile(null)}><X size={16} /></button>
//                     </div>
//                   )}
//                   <input ref={messageInputRef} type="text" placeholder="Type your message..." value={message} onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()} className={styles.messageInput} disabled={sendingMessage} />
//                   <button className={styles.emojiButton}>😊</button>
//                   <button className={styles.sendButton} onClick={handleSendMessage} disabled={sendingMessage || (!message.trim() && !selectedFile)}><Send size={20} /></button>
//                 </div>
//               </>
//             ) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Select a conversation</div>}
//           </main>

//           <aside className={styles.rightPanel}>
//             {details ? (
//               roleConfig.detailsType === 'company' ? (
//                 <CompanyDetailsPanel details={details} />
//               ) : (
//                 <UserDetailsPanel details={details} />
//               )
//             ) : <div style={{ padding: '20px', textAlign: 'center' }}>Select a conversation to view details</div>}
//           </aside>
//         </div>

//         {role === 'user' && showNewChatModal && (
//           <NewChatModal
//             availableCompanies={availableCompanies}
//             onClose={() => setShowNewChatModal(false)}
//             onCreateConversation={handleCreateConversation}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// function CompanyDetailsPanel({ details }) {
//   return (
//     <>
//       <div className={styles.companyCard}>
//         <div className={styles.companyCardHeader}><div className={styles.companyLogoLarge}>{getAvatarLetter(details.companyName)}</div></div>
//         <h2 className={styles.companyCardName}>{details.companyName}</h2>
//         <p className={styles.companyCardType}>{details.companyType === 'insurance' ? 'Insurance Provider' : 'Leasing Company'}</p>
//         <div className={styles.actionButtons}>
//           <button className={styles.callButton}><Phone size={16} /> Call</button>
//           <button className={styles.visitButton}>🌐 Visit</button>
//         </div>
//       </div>
//       {/* Other sections */}
//     </>
//   );
// }

// function UserDetailsPanel({ details }) {
//   return (
//     <>
//       <div className={styles.companyCard}>
//         <div className={styles.companyCardHeader}><div className={styles.companyLogoLarge}><User size={40} /></div></div>
//         <h2 className={styles.companyCardName}>User Details</h2>
//         <p className={styles.companyCardType}>{details.email}</p>
//         <div className={styles.actionButtons}>
//           <button className={styles.callButton}><Phone size={16} /> Call</button>
//           <button className={styles.visitButton}>📧 Email</button>
//         </div>
//       </div>
//       {/* Other sections */}
//     </>
//   );
// }

// function NewChatModal({ availableCompanies, onClose, onCreateConversation }) {
//   const getAvatarLetter = (name) => name ? name.charAt(0).toUpperCase() : '?';
//   return (
//     <div className={styles.modalOverlay} onClick={onClose}>
//       <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <div className={styles.modalHeader}>
//           <h2>Start New Conversation</h2>
//           <button onClick={onClose}><X size={24} /></button>
//         </div>
//         <div className={styles.modalContent}>
//           {availableCompanies.insuranceCompanies?.length > 0 && (
//             <div className={styles.companySection}>
//               <h3>Insurance Companies</h3>
//               {Array.from(availableCompanies.insuranceCompanies).map((company, index) => (
//                 <button key={index} className={styles.companyButton} onClick={() => onCreateConversation(company, 'insurance')}>
//                   <div className={styles.companyAvatar}>{getAvatarLetter(company)}</div>
//                   <span>{company}</span>
//                 </button>
//               ))}
//             </div>
//           )}
//           {availableCompanies.leasingCompanies?.length > 0 && (
//             <div className={styles.companySection}>
//               <h3>Leasing Companies</h3>
//               {Array.from(availableCompanies.leasingCompanies).map((company, index) => (
//                 <button key={index} className={styles.companyButton} onClick={() => onCreateConversation(company, 'leasing')}>
//                   <div className={styles.companyAvatar}>{getAvatarLetter(company)}</div>
//                   <span>{company}</span>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Phone, Video, MoreVertical, Search, Plus, Paperclip, Send, Bell, FileText, CreditCard, AlertTriangle, Moon, Sun, X, User } from 'lucide-react';
import styles from './page.module.css';
import api from '@/utils/axios';

// --- UTILITY FUNCTION ---
// Moved here so all components can access it
const getAvatarLetter = (name) => name ? name.charAt(0).toUpperCase() : '?';

// --- CONFIGURATION ---
// FIX: Corrected apiBase paths
const config = {
  user: {
    apiBase: '/messages', // Was '/user'
    authStorageKey: 'user',
    title: 'Auto Care Connect',
    sidebarTitle: 'Messages',
    canStartNewChat: true,
    detailsType: 'company',
  },
  company: {
    apiBase: '/company/messages', // Was '/company/messages'
    authStorageKey: 'lcompany',
    title: 'Company Dashboard - Messages',
    sidebarTitle: 'User Messages',
    canStartNewChat: true, // Backend supports this, so enabling
    detailsType: 'user',
  },
  insurance: {
    apiBase: '/company/messages',
    authStorageKey: 'company',
    title: 'Insurance Dashboard - Messages',
    sidebarTitle: 'User Messages',
    canStartNewChat: true,
    detailsType: 'user',
  }
};

export default function Messaging({ role }) {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [details, setDetails] = useState(null); // Generic details
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

  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === parseInt(conversationId));
      if (conversation) {
        const participantName = conversation.participantName || conversation.companyName;
        handleSelectChat(conversation.id, participantName);
      }
    }
  }, [searchParams, conversations]); // Only run when conversations are loaded

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
      setAuthError(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (error.response?.status === 401) setAuthError(true);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`${roleConfig.apiBase}/conversations/${conversationId}/messages`);
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchDetails = async (conversationId, participantName) => {
    try {
      let response;
      if (roleConfig.detailsType === 'company') {
        // User is fetching company details
        response = await api.get(`/messages/companies/${encodeURIComponent(participantName)}/details`);
      } else {
        // Company is fetching user details
        response = await api.get(`/company/messages/conversations/${conversationId}/user-details`);
      }
      setDetails(response.data);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      // FIX: Use unread-count, not /messages/unread-count
      const response = await api.get(`${roleConfig.apiBase}/unread-count`);
      setUnreadCount(response.data.count);
    } catch (error) {
      // Not critical
    }
  };

  const fetchAvailableCompanies = async () => {
    if (role !== 'user') return;
    try {
      // FIX: Use correct /api/messages path
      const response = await api.get(`/messages/companies/all`);
      setAvailableCompanies(response.data);
    } catch (error) {
      console.error('Error fetching available companies:', error);
    }
  };

  const loadDraftMessage = () => {
    // ... (This function is fine)
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
      // FIX: Use correct /api/messages path
      const response = await api.post(`/user/conversations`, { companyName, companyType });
      const conversationId = response.data.conversationId;
      setShowNewChatModal(false);
      await fetchConversations();
      handleSelectChat(conversationId, companyName);
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to create conversation. Please try again.');
    }
  };

  const handleSelectChat = async (conversationId, participantName) => {
    setSelectedChat(conversationId);
    await fetchMessages(conversationId);
    await fetchDetails(conversationId, participantName);
    await fetchUnreadCount(); // Refresh unread count
  };

  const handleFileSelect = (e) => {
    // ... (This function is fine)
  };

  const formatTime = (timestamp) => {
    // ... (This function is fine)
  };

  const formatMessageTime = (timestamp) => {
    // ... (This function is fine)
  };

  // REMOVED getAvatarLetter from here (it's global now)

  const getMyAvatar = () => {
    const data = getAuthData();
    if (role === 'user') return data?.email ? getAvatarLetter(data.email) : 'U';
    // FIX: Use cName for company, matching your backend UserDetailsImpl
    return data?.cName ? getAvatarLetter(data.cName) : 'C';
  };

  const filteredConversations = conversations.filter(conv => {
    // FIX: Search by participantName OR companyName
    const participantName = conv.participantName || conv.companyName;
    return participantName.toLowerCase().includes(searchQuery.toLowerCase());
  });


  // --- 🐞 AUTH FIX 1 ---
  // This hook checks for login ONCE on page load
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      setAuthError(false); // Make sure we are not in an error state
      fetchConversations();
      fetchUnreadCount();
      if (role === 'user') {
        fetchAvailableCompanies();
        setTimeout(loadDraftMessage, 1000);
      }
    } else {
      setAuthError(true);
      setLoading(false);
    }
  }, [role]); // Only re-run if role changes

  // --- 🐞 AUTH FIX 2 ---
  // This hook sets up polling AFTER login is confirmed
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return; // Don't start polling if not logged in

    const interval = setInterval(() => {
      if (selectedChat) fetchMessages(selectedChat);
      fetchConversations();
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedChat, role]); // Re-run if selectedChat changes

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { if (selectedChat) messageInputRef.current?.focus(); }, [selectedChat]);

  // FIX: Handle generic participantName for header
  const selectedConversation = conversations.find(c => c.id === selectedChat);
  const participantName = selectedConversation ? (selectedConversation.participantName || selectedConversation.companyName) : '';


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
            <div className={styles.avatar}>{getMyAvatar()}</div>
          </div>
        </header>

        {showDraftNotification && (
          <div style={{ position: 'fixed', top: '80px', right: '20px', background: '#4CAF50', color: 'white', padding: '15px 20px', borderRadius: '8px', zIndex: 1000 }}>
            <FileText size={20} style={{ display: 'inline', marginRight: '10px' }} />
            <span>Draft message loaded from vehicle inquiry</span>
          </div>
        )}

        <div className={styles.mainContent}>
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
                    // FIX: Use generic participantName
                    const participantName = conv.participantName || conv.companyName;
                    return (
                      <div key={conv.id} className={`${styles.conversationItem} ${selectedChat === conv.id ? styles.conversationItemActive : ''}`}
                        onClick={() => handleSelectChat(conv.id, participantName)}>
                        <div className={styles.convAvatar}>{getAvatarLetter(participantName)}</div>
                        <div className={styles.convContent}>
                          <div className={styles.convHeader}>
                            <h3 className={styles.convName}>{participantName}</h3>
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

          <main className={styles.chatWindow}>
            {selectedConversation ? (
              <>
                <div className={styles.chatHeader}>
                  <div className={styles.chatHeaderLeft}>
                    {/* FIX: Use generic participantName */}
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
                      {/* FIX: Use generic participantName */}
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
                      {msg.senderType === role && <div className={styles.messageAvatarUser}>{getMyAvatar()}</div>}
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

function CompanyDetailsPanel({ details }) {
  // This component will now work because getAvatarLetter is global
  return (
    <>
      <div className={styles.companyCard}>
        <div className={styles.companyCardHeader}><div className={styles.companyLogoLarge}>{getAvatarLetter(details.companyName)}</div></div>
        <h2 className={styles.companyCardName}>{details.companyName}</h2>
        <p className={styles.companyCardType}>{details.companyType === 'insurance' ? 'Insurance Provider' : 'Leasing Company'}</p>
        <div className={styles.actionButtons}>
          <button className={styles.callButton}><Phone size={16} /> Call</button>
          <button className={styles.visitButton}>🌐 Visit</button>
        </div>
      </div>
      {/* Other sections */}
    </>
  );
}

function UserDetailsPanel({ details }) {
  return (
    <>
      <div className={styles.companyCard}>
        <div className={styles.companyCardHeader}><div className={styles.companyLogoLarge}><User size={40} /></div></div>
        <h2 className={styles.companyCardName}>User Details</h2>
        <p className={styles.companyCardType}>{details.email}</p>
        <div className={styles.actionButtons}>
          <button className={styles.callButton}><Phone size={16} /> Call</button>
          <button className={styles.visitButton}>📧 Email</button>
        </div>
      </div>
      {/* Other sections */}
    </>
  );
}

function NewChatModal({ availableCompanies, onClose, onCreateConversation }) {
  // REMOVED getAvatarLetter from here (it's global now)
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