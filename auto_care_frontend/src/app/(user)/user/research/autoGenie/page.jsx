'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Bot, User, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import styles from './page.module.css';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm AutoBot, your Auto Care assistant. How can I help you with your vehicle today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages from sessionStorage on mount
  useEffect(() => {
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
  }, []);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('autobot_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Call N8N webhook with form-data format and conversation history
      const formData = new FormData();
      formData.append('query', messageText);
      
      // Optional: Send conversation history for context
      const conversationHistory = messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
      formData.append('history', JSON.stringify(conversationHistory));

      const response = await fetch('http://localhost:5678/webhook/test', {
        method: 'POST',
        body: formData
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
    } catch (error) {
      console.error('Error calling N8N webhook:', error);
      
      // Fallback error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, I encountered an error connecting to the server. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      const initialMessage = {
        id: Date.now(),
        type: 'ai',
        text: "Hello! I'm AutoBot, your Auto Care assistant. How can I help you with your vehicle today?",
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      sessionStorage.setItem('autobot_messages', JSON.stringify([initialMessage]));
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.pageContainer}>
      {/* Main Chat Container */}
      <main className={styles.mainContent}>
        <div className={styles.backgroundPattern}></div>
        
        <div className={styles.chatContainer}>
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <button 
              className={styles.backButton}
              onClick={handleGoBack}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className={styles.botInfo}>
              <div className={styles.botAvatar}>
                <Bot size={24} />
              </div>
              <div className={styles.botDetails}>
                <h2 className={styles.botName}>AutoBot</h2>
                <span className={styles.botStatus}>
                  <span className={styles.statusDot}></span>
                  Online
                </span>
              </div>
            </div>
            <button 
              className={styles.clearButton}
              onClick={handleClearChat}
              aria-label="Clear chat"
              title="Clear conversation"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageWrapper} ${
                  message.type === 'user' ? styles.userMessage : styles.aiMessage
                }`}
              >
                <div className={styles.messageAvatar}>
                  {message.type === 'ai' ? (
                    <Bot size={20} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className={styles.messageBubble}>
                  <div className={styles.messageText}>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                  <span className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className={`${styles.messageWrapper} ${styles.aiMessage}`}>
                <div className={styles.messageAvatar}>
                  <Bot size={20} />
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

          {/* Input Area */}
          <div className={styles.inputContainer}>
            <button className={styles.attachButton} aria-label="Attach file">
              <Paperclip size={20} />
            </button>
            <input
              ref={inputRef}
              type="text"
              className={styles.messageInput}
              placeholder="Ask AutoBot anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <button className={styles.micButton} aria-label="Voice input">
              <Mic size={20} />
            </button>
            <button
              className={styles.sendButton}
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            © 2024 Auto Care. Your trusted vehicle marketplace and service partner.
          </p>
          <div className={styles.footerLinks}>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}