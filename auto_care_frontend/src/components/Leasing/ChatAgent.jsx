'use client';

import React, { useState } from 'react';
import { Send, Circle, User } from 'lucide-react';

const ChatAgent = () => {
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: 1,
      type: 'agent',
      text: "Hello! I'm here to help you with your leasing questions. How can I assist you today?",
      time: "2:30 PM"
    },
    {
      id: 2,
      type: 'user',
      text: "I'm interested in the Premium Plan. Can you tell me more about the maintenance coverage?",
      time: "2:30 PM"
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  return (
    <div className="bg-white py-8 px-6 rounded-xl shadow-lg border border-[#222725]/20 h-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <h2 className="text-2xl font-bold text-[#1E201E]">
            Chat with Agent
          </h2>
          <div className="flex items-center gap-2">
            <Circle size={10} className="text-green-500 fill-green-500" />
            <span className="text-sm text-green-600 font-bold">Online</span>
          </div>
        </div>
        
        <div className="border-2 border-[#222725]/20 rounded-xl h-80 flex flex-col bg-white shadow-inner">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'agent' && (
                  <div className="w-8 h-8 bg-[#eae3da] rounded-full flex items-center justify-center mr-2 shadow-md">
                    <User size={16} className="text-[#1E201E]" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md ${
                    msg.type === 'user'
                      ? 'bg-[#1E201E] text-[#ECDFCC]'
                      : 'bg-[#eae3da] text-[#1E201E]'
                  }`}
                >
                  <p className="text-sm font-medium">{msg.text}</p>
                  <p className={`text-xs mt-2 font-medium ${
                    msg.type === 'user' ? 'text-[#d4c9b8]' : 'text-[#222725]'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input */}
          <div className="border-t-2 border-[#222725]/20 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border-2 border-[#222725]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E201E]/20 focus:border-[#1E201E] text-[#1E201E] placeholder-[#222725]/60"
              />
              <button
                type="submit"
                className="bg-[#1E201E] text-[#ECDFCC] p-3 rounded-lg hover:bg-[#222725] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent; 