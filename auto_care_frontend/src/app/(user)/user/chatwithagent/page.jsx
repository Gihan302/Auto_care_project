'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Phone, Video, MoreVertical, ArrowLeft, User, Bot, CheckCheck, Check } from 'lucide-react';
import styles from './ChatInterface.module.css';

const ChatInterface = ({ planId = 1, companyName = "AutoLease Pro" }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [agentInfo, setAgentInfo] = useState(null);
  const messagesEndRef = useRef(null);

  // Mock agent info
  useEffect(() => {
    setAgentInfo({
      name: "Sarah Johnson",
      title: "Senior Leasing Specialist",
      avatar: "https://via.placeholder.com/40x40",
      isOnline: true,
      responseTime: "Usually responds within 5 minutes"
    });

    // Mock initial messages
    const initialMessages = [
      {
        id: 1,
        sender: 'agent',
        content: 'Hello! I\'m Sarah, your leasing specialist. I see you\'re interested in our Premium Sedan Lease plan. How can I help you today?',
        timestamp: new Date(Date.now() - 300000),
        status: 'delivered'
      },
      {
        id: 2,
        sender: 'user',
        content: 'Hi Sarah! I\'d like to know more about the monthly payment structure and what\'s included.',
        timestamp: new Date(Date.now() - 240000),
        status: 'read'
      },
      {
        id: 3,
        sender: 'agent',
        content: 'Great question! The $299 monthly payment includes comprehensive insurance, all scheduled maintenance, and 24/7 roadside assistance. The payment is calculated based on a 36-month term with 15,000 miles per year. Would you like me to break down any specific costs?',
        timestamp: new Date(Date.now() - 180000),
        status: 'delivered'
      }
    ];

    setMessages(initialMessages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      const agentResponse = {
        id: Date.now() + 1,
        sender: 'agent',
        content: 'Thank you for your question! Let me get that information for you. I\'ll have a detailed response shortly.',
        timestamp: new Date(),
        status: 'delivered'
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <Check className="status-icon status-icon--sent" />;
      case 'delivered': return <CheckCheck className="status-icon status-icon--delivered" />;
      case 'read': return <CheckCheck className="status-icon status-icon--read" />;
      default: return null;
    }
  };

  return (
    <div className={styles["chat-container"]}>
      {/* Chat Header */}
      <div className={styles["chat-header"]}>
        <div className={styles["chat-header__content"]}>
          <div className={styles["chat-header__left"]}>
            <button className={styles["back-button"]}>
              <ArrowLeft className={styles["back-button__icon"]} />
            </button>
            
            <div className={styles["agent-info"]}>
              <div className={styles["agent-info__avatar-wrapper"]}>
                <img
                  src={agentInfo?.avatar}
                  alt={agentInfo?.name}
                  className={styles["agent-info__avatar"]}          
                />
                <div className={`${styles["agent-info__status"]} ${isOnline ? styles["agent-info__status--online"] : styles["agent-info__status--offline"]}`}></div>
              </div>

              <div className={styles["agent-info__details"]}>
                <h3 className={styles["agent-info__name"]}>{agentInfo?.name}</h3>
                <p className={styles["agent-info__title"]}>{agentInfo?.title} • {companyName}</p>
              </div>
            </div>
          </div>

          <div className={styles["chat-actions"]}>
            <button className={styles["chat-action-button"]}>
              <Phone className={styles["chat-action-button__icon"]} />
            </button>
            <button className={styles["chat-action-button"]}>
              <Video className={styles["chat-action-button__icon"]} />
            </button>
            <button className={styles["chat-action-button"]}>
              <MoreVertical className={styles["chat-action-button__icon"]} />
            </button>
          </div>
        </div>

        {isOnline && (
          <div className={styles["response-time"]}>
            <div className={styles["response-time__indicator"]}></div>
            {agentInfo?.responseTime}
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className={styles["messages-container"]}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles["message"]} ${message.sender === 'user' ? styles["message--user"] : styles["message--agent"]}`}
          >
            <div className={`${styles["message__wrapper"]} ${message.sender === 'user' ? styles["message__wrapper--user"] : styles["message__wrapper--agent"]}`}>
              {message.sender === 'agent' && (
                <img
                  src={agentInfo?.avatar}
                  alt={agentInfo?.name}
                  className={styles["message__avatar"]}
                />
              )}

              <div className={`${styles["message__bubble"]} ${message.sender === 'user' ? styles["message__bubble--user"] : styles["message__bubble--agent"]}`}>
                <p className={styles["message__content"]}>{message.content}</p>

                <div className={`${styles["message__meta"]} ${message.sender === 'user' ? styles["message__meta--user"] : styles["message__meta--agent"]}`}>
                  <span className={styles["message__time"]}>{formatTime(message.timestamp)}</span>
                  {message.sender === 'user' && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className={`${styles["message"]} ${styles["message--agent"]}`}>
            <div className={`${styles["message__wrapper"]} ${styles["message__wrapper--agent"]}`}>
              <img
                src={agentInfo?.avatar}
                alt={agentInfo?.name}
                className={styles["message__avatar"]}
              />
              <div className={styles["message__bubble"]}>
                <div className={styles["typing-indicator"]}>
                  <div className={styles["typing-indicator__dot"]}></div>
                  <div className={`${styles["typing-indicator__dot"]} ${styles["typing-indicator__dot--delay-1"]}`}></div>
                  <div className={`${styles["typing-indicator__dot"]} ${styles["typing-indicator__dot--delay-2"]}`}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className={styles["quick-replies"]}>
        <div className={styles["quick-replies__container"]}>
          {['Schedule Test Drive', 'Credit Requirements?', 'Available Colors?', 'Payment Options'].map((reply, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(reply)}
              className={styles["quick-reply-button"]}
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className={styles["message-input"]}>
        <div className={styles["message-input__wrapper"]}>
          <button className={styles["attachment-button"]}>
            <Paperclip className={styles["attachment-button__icon"]} />
          </button>

          <div className={styles["text-input-wrapper"]}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="text-input"
              rows={1}
              style={{
                minHeight: '44px',
                height: inputMessage ? Math.min(Math.max(44, inputMessage.split('\n').length * 20 + 24), 128) : 44
              }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`send-button ${inputMessage.trim() ? 'send-button--active' : 'send-button--disabled'}`}
          >
            <Send className="send-button__icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;