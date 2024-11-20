import React, { useState, useEffect } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Chatbot = ({ initialMessage, sections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: initialMessage || 'Are you looking to rent or lease or buy Commercial Property for your business? I will help you with that.',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    // When the page loads, automatically open the chatbot and introduce the first section
    if (sections && sections.length > 0) {
      setIsOpen(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'bot',
          text: `Welcome to the ${sections[currentSectionIndex].title} section! ${sections[currentSectionIndex].description}`,
        },
      ]);
    }
  }, [sections, currentSectionIndex]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages([...messages, { sender: 'user', text: userInput }]);
      setUserInput('');

      // Simulated response from the chatbot based on user input
      setTimeout(() => {
        let botResponse = "Thank you for your message. I'm here to guide you through the website.";
        
        if (userInput.toLowerCase().includes('translate')) {
          botResponse = "I can help you translate text. Please go to the 'Translate' page.";
        } else if (userInput.toLowerCase().includes('history')) {
          botResponse = "To see your past translations, navigate to the 'History' section.";
        } else if (userInput.toLowerCase().includes('stats')) {
          botResponse = "If you'd like to see your usage statistics, visit the 'Stats' page.";
        } else if (userInput.toLowerCase().includes('next')) {
          // Move to the next section if available
          if (currentSectionIndex < sections.length - 1) {
            setCurrentSectionIndex((prevIndex) => prevIndex + 1);
            botResponse = `Let's move on to the next section: ${sections[currentSectionIndex + 1].title}. ${sections[currentSectionIndex + 1].description}`;
          } else {
            botResponse = "You have reached the end of the sections. Let me know if you need more information.";
          }
        } else {
          botResponse = "Thank you for your message. Let me know if you need navigation help.";
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: botResponse },
        ]);
      }, 1000);
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
          className="w-96 h-[550px] bg-[rgba(0,0,0,0.6)] backdrop-blur-md border border-gray-300 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 flex justify-between items-center rounded-t-3xl shadow-md">
            <span className="font-extrabold text-xl">LANGBIT</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 90 }}
              onClick={toggleChat}
              className="text-white"
            >
              X
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
                    className="w-12 h-12 rounded-full mr-3 shadow-md"
                  />
                )}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className={`p-4 rounded-xl ${message.sender === 'bot' ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'} shadow-lg`}
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}
                >
                  {message.text}
                </motion.div>
              </motion.div>
            ))}
          </div>
          <div className="flex border-t border-gray-600">
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message... (e.g., 'next' to go to the next section)"
              className="flex-1 p-4 bg-gray-800 text-white outline-none rounded-bl-3xl"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-br-3xl shadow-lg"
              style={{ boxShadow: '0 0 10px rgba(255, 0, 255, 0.5)' }}
            >
              Send
            </motion.button>
          </div>
          <div className="flex justify-around p-4 border-t border-gray-600 bg-gray-900 rounded-b-3xl">
            <motion.button
              whileHover={{ scale: 1.15, backgroundColor: '#4ade80', boxShadow: '0 0 15px rgba(0, 255, 0, 0.4)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.location.href = '/translate'}
              className="bg-teal-500 text-white py-3 px-6 rounded-full hover:bg-teal-400 shadow-xl transition"
            >
              Go to Translate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, backgroundColor: '#facc15', boxShadow: '0 0 15px rgba(255, 223, 0, 0.4)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.location.href = '/history'}
              className="bg-teal-500 text-white py-3 px-6 rounded-full hover:bg-teal-400 shadow-xl transition"
            >
              View History
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, backgroundColor: '#f87171', boxShadow: '0 0 15px rgba(255, 0, 0, 0.4)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.location.href = '/stats'}
              className="bg-teal-500 text-white py-3 px-6 rounded-full hover:bg-teal-400 shadow-xl transition"
            >
              Check Stats
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