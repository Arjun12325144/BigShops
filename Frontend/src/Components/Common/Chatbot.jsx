import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { BiBot, BiUser } from 'react-icons/bi';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chatbot session
  const initializeChatbot = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Get user ID if logged in
      const response = await axios.post(`${API_BASE_URL}/chatbot/start`, {
        userId: userId || null
      });
      
      if (response.data.success) {
        setSessionId(response.data.sessionId);
        setMessages([{
          id: Date.now(),
          content: response.data.message,
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error initializing chatbot:', error);
      setMessages([{
        id: Date.now(),
        content: "Hello! I'm here to help you with your shopping needs. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  };

  // Open chatbot
  const openChatbot = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (!sessionId) {
      initializeChatbot();
    }
    // Focus input after opening
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Close chatbot
  const closeChatbot = async () => {
    if (sessionId) {
      try {
        await axios.post(`${API_BASE_URL}/chatbot/end`, { sessionId });
      } catch (error) {
        console.error('Error ending conversation:', error);
      }
    }
    setIsOpen(false);
    setIsMinimized(false);
    setMessages([]);
    setSessionId(null);
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`${API_BASE_URL}/chatbot/message`, {
        sessionId,
        message: userMessage.content,
        userId: userId || null
      });

      if (response.data.success) {
        // Simulate typing delay
        setTimeout(() => {
          const botMessage = {
            id: Date.now() + 1,
            content: response.data.response,
            sender: 'bot',
            timestamp: new Date(),
            category: response.data.category
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format message content with line breaks
  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 p-3">
      <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
        <BiBot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gray-100 rounded-lg px-3 py-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        // Chat button
        <button
          onClick={openChatbot}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Open chat"
        >
          <FiMessageCircle className="w-6 h-6" />
        </button>
      ) : (
        // Chat window
        <div className={`bg-white rounded-lg shadow-2xl transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-96 md:h-[500px]'
        } w-80 md:w-96 flex flex-col overflow-hidden border border-gray-200`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <BiBot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Shopping Assistant</h3>
                <p className="text-xs opacity-90">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                <FiMinimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={closeChatbot}
                className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                aria-label="Close chat"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.sender === 'user' ? (
                          <BiUser className="w-4 h-4" />
                        ) : (
                          <BiBot className="w-4 h-4" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}>
                        <p className="text-sm leading-relaxed">
                          {formatMessage(message.content)}
                        </p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' 
                            ? 'text-blue-100' 
                            : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className={`p-2 rounded-lg transition-colors ${
                      isLoading || !inputMessage.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    aria-label="Send message"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send • Powered by AI
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;