'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function FloatingChat() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi! I'm Auto Genie AI. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages from sessionStorage when popup opens
  useEffect(() => {
    if (isOpen) {
      const savedMessages = sessionStorage.getItem('autobot_messages');
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsed.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      }
      scrollToBottom();
    }
  }, [isOpen]);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 1) { // Only save if there are messages beyond the initial one
      sessionStorage.setItem('autobot_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await fetch('http://localhost:8080/api/autogenie/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: messageText,
          history: JSON.stringify(conversationHistory)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: data.output || 'No response received from the server.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // Show error message to user
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, I encountered an error connecting to the server. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpenFullChat = () => {
    // Save current messages to sessionStorage
    sessionStorage.setItem('autobot_messages', JSON.stringify(messages));
    // Navigate to full chat page
    router.push('/user/research/autoGenie');
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          className={styles.floatingButton}
          onClick={() => setIsOpen(true)}
          aria-label="Open AutoBot chat"
        >
          <img src="/chatbot.png" alt="AutoBot Logo" />
          {messages.length > 1 && (
            <span className={styles.badge}>{messages.length - 1}</span>
          )}
        </button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className={styles.chatPopup}>
          {/* Header */}
          <div className={styles.popupHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.botAvatarSmall}>
                <img src="/chatbot.png" alt="AutoBot" />
              </div>
              <div>
                <h3 className={styles.popupTitle}>Auto Genie AI</h3>
                <span className={styles.popupStatus}>
                  <span className={styles.statusDot}></span>
                  Online
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.iconButton}
                onClick={() => setIsOpen(false)}
                aria-label="Minimize chat"
              >
                <Minimize2 size={18} />
              </button>
              <button
                className={styles.iconButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.popupMessages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageWrapper} ${
                  message.type === 'user' ? styles.userMessage : styles.aiMessage
                }`}
              >
                <div className={styles.messageAvatar}>
                  {message.type === 'ai' ? (
                    <img src="/chatbot.png" alt="Bot" />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className={styles.messageBubble}>
                  <div className={styles.messageText}>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.messageWrapper} ${styles.aiMessage}`}>
                <div className={styles.messageAvatar}>
                  <img src="/chatbot.png" alt="Bot" />
                </div>
                <div className={styles.messageBubble}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={styles.popupInput}>
            <input
              type="text"
              className={styles.input}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <button
              className={styles.sendButton}
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Footer */}
          <div className={styles.popupFooter}>
            <button 
              onClick={handleOpenFullChat} 
              className={styles.expandLink}
            >
              Open full chat
            </button>
          </div>
        </div>
      )}
    </>
  );
}