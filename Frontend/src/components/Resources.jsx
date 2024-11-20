import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Chatbot from './Chatbot';

const languages = [
  {
    name: 'Mandarin Chinese',
    description: 'Spoken by over a billion people worldwide, Mandarin is the most spoken language. It is known for its rich history and complex characters.',
    videoLink: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
  },
  {
    name: 'Spanish',
    description: 'Spanish is spoken in over 20 countries and is known for its melodic tone. It is the second most spoken language by native speakers.',
    videoLink: 'https://www.youtube.com/watch?v=oK6GQ_CGmH0',
  },
  {
    name: 'English',
    description: 'As the most commonly studied language, English is a global lingua franca, spoken widely across the world.',
    videoLink: 'https://www.youtube.com/watch?v=8Ox5LhIJSBE',
  },
  {
    name: 'Hindi',
    description: 'Hindi, one of India’s official languages, connects millions and has a deep cultural and historical significance.',
    videoLink: 'https://www.youtube.com/watch?v=C0DPdy98e4c',
  },
  {
    name: 'Arabic',
    description: 'Arabic is the liturgical language of Islam, spoken across the Middle East and North Africa. It has many dialects and a beautiful script.',
    videoLink: 'https://www.youtube.com/watch?v=9EKX9sQpQog',
  },
  {
    name: 'Bengali',
    description: 'Bengali is spoken primarily in Bangladesh and the Indian state of West Bengal, known for its rich literary tradition.',
    videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    name: 'Portuguese',
    description: 'Portuguese is the official language of Portugal and Brazil, known for its expressive vocabulary and melodic sound.',
    videoLink: 'https://www.youtube.com/watch?v=DLzxrzFCyOs',
  },
  {
    name: 'Russian',
    description: 'Russian, spoken across Russia and former Soviet states, is known for its complexity and beautiful Cyrillic script.',
    videoLink: 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y',
  },
  {
    name: 'Japanese',
    description: 'Japanese is spoken in Japan, known for its unique writing systems (Kanji, Hiragana, and Katakana) and its politeness-oriented language structure.',
    videoLink: 'https://www.youtube.com/watch?v=6_b7RDuLwcI',
  },
  {
    name: 'French',
    description: 'French, the language of love, is spoken in many countries and is known for its elegance and historical impact on culture and diplomacy.',
    videoLink: 'https://www.youtube.com/watch?v=3GwjfUFyY6M',
  },
];

const Resources = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
      <Navbar />
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-cyan-300 tracking-wider drop-shadow-lg">
          Top 10 Languages Resources
        </h1>
        <table className="w-full table-auto border-collapse mb-12">
          <thead>
            <tr className="bg-cyan-600">
              <th className="border border-cyan-500 px-4 py-2 text-left">Language</th>
              <th className="border border-cyan-500 px-4 py-2 text-left">Description</th>
              <th className="border border-cyan-500 px-4 py-2 text-left">Video Link</th>
            </tr>
          </thead>
          <tbody>
            {languages.map((language, index) => (
              <tr key={index} className="bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.9)] transition-colors duration-300">
                <td className="border border-cyan-500 px-4 py-2 font-bold text-purple-400">{language.name}</td>
                <td className="border border-cyan-500 px-4 py-2 text-gray-300">{language.description}</td>
                <td className="border border-cyan-500 px-4 py-2 text-blue-400">
                  <a href={language.videoLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
                    Watch Video
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Chatbot Component */}
      <Chatbot initialMessage="Welcome to the Resources page! Here you can find detailed information about the top 10 languages, including useful video resources." />
    </div>
  );
};

export default Resources;
