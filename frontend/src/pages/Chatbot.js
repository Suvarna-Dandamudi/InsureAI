import React, { useState, useRef, useEffect } from 'react';

import { motion } from 'framer-motion';

import { MessageCircle, Send, Bot, User, Sparkles } from 'lucide-react';

import { chatbotService } from '../services/api';

import toast from 'react-hot-toast';



const Chatbot = () => {

  const [messages, setMessages] = useState([

    {

      id: 1,

      type: 'bot',

      text: 'Hello! I\'m your AI insurance assistant. How can I help you today?',

      suggestions: [

        'Check my policy status',

        'File a new claim',

        'What does my policy cover?',

        'Premium payment options'

      ],

      timestamp: new Date(),

    },

  ]);

  const [inputMessage, setInputMessage] = useState('');

  const [isTyping, setIsTyping] = useState(false);

  const [customerId, setCustomerId] = useState('');

  const messagesEndRef = useRef(null);

  const inputRef = useRef(null);



  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  };



  useEffect(() => {

    scrollToBottom();

  }, [messages]);



  const handleSendMessage = async () => {

    if (!inputMessage.trim()) return;



    const userMessage = {

      id: Date.now(),

      type: 'user',

      text: inputMessage,

      timestamp: new Date(),

    };



    setMessages(prev => [...prev, userMessage]);

    setInputMessage('');

    setIsTyping(true);



    try {

      const response = await chatbotService.sendMessage({

        message: inputMessage,

        customerId: customerId || undefined,

      });



      const botMessage = {

        id: Date.now() + 1,

        type: 'bot',

        text: response.data.message,

        suggestions: response.data.suggestions || [],

        actions: response.data.actions || [],

        timestamp: new Date(),

      };



      setMessages(prev => [...prev, botMessage]);

    } catch (error) {

      console.error('Error sending message:', error);

      const errorMessage = {

        id: Date.now() + 1,

        type: 'bot',

        text: 'Sorry, I encountered an error. Please try again later.',

        timestamp: new Date(),

      };

      setMessages(prev => [...prev, errorMessage]);

      toast.error('Failed to send message');

    } finally {

      setIsTyping(false);

    }

  };



  const handleSuggestionClick = (suggestion) => {

    setInputMessage(suggestion);

    inputRef.current?.focus();

  };



  const handleActionClick = (action) => {

    switch (action.type) {

      case 'file_claim':

        toast.info('Redirecting to claims page...');

        // Navigate to claims page

        break;

      case 'get_quote':

        toast.info('Opening quote calculator...');

        // Open quote modal

        break;

      case 'contact_agent':

        toast.info('Connecting you with an agent...');

        // Initiate agent chat

        break;

      default:

        toast.info(`Action: ${action.label}`);

    }

  };



  const handleKeyPress = (e) => {

    if (e.key === 'Enter' && !e.shiftKey) {

      e.preventDefault();

      handleSendMessage();

    }

  };



  return (

    <div className="h-full flex flex-col">

      {/* Header */}

      <motion.div

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}

        className="bg-white dark:bg-gray-800 rounded-t-xl shadow-sm p-6 border-b border-gray-200 dark:border-gray-700"

      >

        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-3">

            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center">

              <Bot className="w-6 h-6 text-white" />

            </div>

            <div>

              <h1 className="text-xl font-bold text-gray-900 dark:text-white">

                AI Insurance Assistant

              </h1>

              <p className="text-sm text-gray-600 dark:text-gray-400">

                Powered by advanced AI technology

              </p>

            </div>

          </div>

          <div className="flex items-center space-x-2">

            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

            <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>

          </div>

        </div>

      </motion.div>



      {/* Customer ID Input */}

      <motion.div

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ delay: 0.1 }}

        className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-b border-gray-200 dark:border-gray-700"

      >

        <div className="flex items-center space-x-3">

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">

            Customer ID (optional):

          </label>

          <input

            type="text"

            value={customerId}

            onChange={(e) => setCustomerId(e.target.value)}

            placeholder="Enter customer ID for personalized assistance"

            className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"

          />

        </div>

      </motion.div>



      {/* Messages */}

      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">

        <div className="max-w-3xl mx-auto space-y-4">

          {messages.map((message) => (

            <motion.div

              key={message.id}

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.3 }}

              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}

            >

              <div className={`flex items-start space-x-3 max-w-lg ${

                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''

              }`}>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${

                  message.type === 'user'

                    ? 'bg-primary-600'

                    : 'bg-gradient-to-r from-primary-500 to-purple-600'

                }`}>

                  {message.type === 'user' ? (

                    <User className="w-4 h-4 text-white" />

                  ) : (

                    <Bot className="w-4 h-4 text-white" />

                  )}

                </div>

                

                <div className={`rounded-lg p-4 ${

                  message.type === 'user'

                    ? 'bg-primary-600 text-white'

                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'

                }`}>

                  <p className="text-sm">{message.text}</p>

                  

                  {/* Suggestions */}

                  {message.suggestions && message.suggestions.length > 0 && (

                    <div className="mt-3 space-y-2">

                      {message.suggestions.map((suggestion, index) => (

                        <motion.button

                          key={index}

                          whileHover={{ scale: 1.02 }}

                          whileTap={{ scale: 0.98 }}

                          onClick={() => handleSuggestionClick(suggestion)}

                          className="w-full text-left px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"

                        >

                          {suggestion}

                        </motion.button>

                      ))}

                    </div>

                  )}

                  

                  {/* Actions */}

                  {message.actions && message.actions.length > 0 && (

                    <div className="mt-3 flex flex-wrap gap-2">

                      {message.actions.map((action, index) => (

                        <motion.button

                          key={index}

                          whileHover={{ scale: 1.02 }}

                          whileTap={{ scale: 0.98 }}

                          onClick={() => handleActionClick(action)}

                          className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/30 transition-colors flex items-center space-x-1"

                        >

                          <Sparkles className="w-3 h-3" />

                          <span>{action.label}</span>

                        </motion.button>

                      ))}

                    </div>

                  )}

                  

                  <div className={`text-xs mt-2 ${

                    message.type === 'user' ? 'text-primary-200' : 'text-gray-500 dark:text-gray-400'

                  }`}>

                    {message.timestamp.toLocaleTimeString()}

                  </div>

                </div>

              </div>

            </motion.div>

          ))}

          

          {/* Typing Indicator */}

          {isTyping && (

            <motion.div

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              className="flex justify-start"

            >

              <div className="flex items-start space-x-3">

                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center">

                  <Bot className="w-4 h-4 text-white" />

                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">

                  <div className="flex space-x-1">

                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>

                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>

                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>

                  </div>

                </div>

              </div>

            </motion.div>

          )}

          

          <div ref={messagesEndRef} />

        </div>

      </div>



      {/* Input */}

      <motion.div

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ delay: 0.2 }}

        className="bg-white dark:bg-gray-800 rounded-b-xl shadow-sm p-6 border-t border-gray-200 dark:border-gray-700"

      >

        <div className="flex items-center space-x-3">

          <input

            ref={inputRef}

            type="text"

            value={inputMessage}

            onChange={(e) => setInputMessage(e.target.value)}

            onKeyPress={handleKeyPress}

            placeholder="Type your message..."

            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"

            disabled={isTyping}

          />

          <motion.button

            whileHover={{ scale: 1.05 }}

            whileTap={{ scale: 0.95 }}

            onClick={handleSendMessage}

            disabled={!inputMessage.trim() || isTyping}

            className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"

          >

            <Send className="w-5 h-5" />

          </motion.button>

        </div>

        

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">

          <div className="flex items-center space-x-1">

            <Sparkles className="w-3 h-3" />

            <span>AI-powered responses</span>

          </div>

          <div>

            Press Enter to send, Shift+Enter for new line

          </div>

        </div>

      </motion.div>

    </div>

  );

};



export default Chatbot;

