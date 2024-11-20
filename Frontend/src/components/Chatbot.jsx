import React, { useState, useEffect } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Chatbot = ({ initialMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: initialMessage || 'Hi there! Welcome to LangBit. How can I assist you today?',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState([
    { text: 'Go to Home', link: '/' },
    { text: 'Translate Text', link: '/translate' },
    { text: 'View History', link: '/history' },
    { text: 'Check Stats', link: '/stats' },
    { text: 'Who are the Developers?', link: null },
    { text: 'Resources', link: '/resources' },
  ]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      setSpeechRecognition(recognition);
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && voiceEnabled && speechRecognition) {
      speechRecognition.start();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setIsSuggestionsVisible(false);
    handleUserMessage(suggestion.text, suggestion.link);
  };

  const handleUserMessage = (message, link = null) => {
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: message }]);
    if (link) {
      navigate(link);
    }
    processMessage(message);
  };

  const processMessage = (message) => {
    setIsTyping(true);
    setTimeout(() => {
      let botResponse;

      if (message.toLowerCase().includes('translate')) {
        botResponse = (
          <div>
            I can help you translate text. Click the button below to go to the Translate page:
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
              onClick={() => navigate('/translate')}
            >
              Go to Translate Page
            </motion.button>
          </div>
        );
      } else if (message.toLowerCase().includes('developers') || message.toLowerCase().includes('who made this')) {
        botResponse = (
          <div>
            LangBit was developed by a team of students: <strong>Swaraj</strong>, <strong>Harshit</strong>, <strong>Krishna</strong>, and <strong>Dhruv</strong>. This project was part of their ISDL coursework under the guidance of <strong>Dr. Ashish Kumar Dwivedi</strong>.
          </div>
        );
      } else if (message.toLowerCase().includes('navigate to the homepage')) {
        navigate('/');
        botResponse = "Navigating to the homepage...";
      } else if (message.toLowerCase().includes('bot-avatar')) {
        botResponse = (
          <div>
            Here's the bot avatar you were asking about:
            <img src="https://via.placeholder.com/40/007bff/ffffff?text=B" alt="Bot Avatar" className="w-10 h-10 rounded-full mt-2" />
          </div>
        );
      } else if (message.toLowerCase().includes('check stats')) {
        botResponse = (
          <div>
            You can view your statistics by clicking the button below:
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded"
              onClick={() => navigate('/stats')}
            >
              Go to Stats Page
            </motion.button>
          </div>
        );
      } else if (message.toLowerCase().includes('view history')) {
        botResponse = (
          <div>
            You can check your history by clicking below:
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
              onClick={() => navigate('/history')}
            >
              Go to History Page
            </motion.button>
          </div>
        );
      } else if (message.toLowerCase().includes('enable voice control')) {
        setVoiceEnabled(true);
        botResponse = "Voice control has been enabled. You can now interact with me using voice commands.";
      } else if (message.toLowerCase().includes('disable voice control')) {
        setVoiceEnabled(false);
        if (speechRecognition) {
          speechRecognition.stop();
        }
        botResponse = "Voice control has been disabled.";
      } else {
        botResponse = "I'm here to help! Let me know if there's something specific you need assistance with.";
      }

      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
      setTimeout(() => {
        setIsSuggestionsVisible(true);
      }, 1000);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      handleUserMessage(userInput.trim());
      setUserInput('');
    }
  };

  const handleVoiceInput = () => {
    if (speechRecognition) {
      speechRecognition.start();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="w-96 h-[600px] bg-[rgba(0,0,0,0.6)] backdrop-blur-md shadow-lg rounded-2xl flex flex-col overflow-hidden border border-gray-200"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 flex justify-between items-center rounded-t-2xl shadow-md">
            <span className="font-bold text-lg">LangBit Assistant</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 90 }}
              onClick={toggleChat}
              className="text-white font-semibold text-lg"
            >
              ×
            </motion.button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ x: message.sender === 'bot' ? -200 : 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring', damping: 15 }}
                className={`flex items-start mb-4 ${message.sender === 'bot' ? '' : 'justify-end'}`}
              >
                {message.sender === 'bot' && (
                  <motion.img
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src="https://via.placeholder.com/40/007bff/ffffff?text=B"
                    alt="bot-avatar"
                    className="w-10 h-10 rounded-full mr-3 shadow-md"
                  />
                )}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className={`p-4 rounded-xl ${message.sender === 'bot' ? 'bg-gray-800 text-white' : 'bg-blue-500 text-white'} shadow-lg`}
                >
                  {message.text}
                </motion.div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-start mb-4"
              >
                <div className="w-10 h-10 rounded-full mr-3 bg-blue-500 flex items-center justify-center text-white">
                  B
                </div>
                <div className="p-4 rounded-xl bg-gray-800 text-white shadow-lg">
                  ...
                </div>
              </motion.div>
            )}
          </div>
          {isSuggestionsVisible && (
            <div className="p-4 border-t border-gray-600">
              <h4 className="text-white mb-2">Suggestions:</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-teal-500 text-white px-4 py-2 rounded"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.text}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          <div className="flex border-t border-gray-600">
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-4 bg-[rgba(255, 255, 255, 0.8)] text-black outline-none rounded-bl-2xl"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-br-2xl shadow-lg"
            >
              Send
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleVoiceInput}
              className="bg-teal-600 text-white px-4 py-4 rounded-br-2xl shadow-lg ml-2"
            >
              🎤
            </motion.button>
          </div>
        </motion.div>
      )}
      <motion.button
        className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-5 rounded-full shadow-2xl"
        onClick={toggleChat}
        whileHover={{ scale: 1.3, rotate: 15, boxShadow: '0 0 25px rgba(0, 255, 255, 0.6)' }}
        whileTap={{ scale: 0.9 }}
      >
        <FaRegCommentDots size={32} />
      </motion.button>
    </div>
  );
};

export default Chatbot;
