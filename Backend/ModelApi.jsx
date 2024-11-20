import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [randomWords, setRandomWords] = useState([]);
  const [summary, setSummary] = useState('');
  const [serverStatus, setServerStatus] = useState('');
  const [bulkTexts, setBulkTexts] = useState(['', '']);
  const [bulkTranslatedTexts, setBulkTranslatedTexts] = useState([]);

  // Function to translate text
  const handleTranslate = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/translate', {
        text: text,
      });
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  // Function to generate random words
  const handleRandomWords = async (numWords = 5) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/random_words?num_words=${numWords}`);
      setRandomWords(response.data.random_words);
    } catch (error) {
      console.error('Error fetching random words:', error);
    }
  };

  // Function to get a summary of the text
  const handleSummarize = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/summarize', {
        text: text,
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  };

  // Function to check server status
  const handleCheckStatus = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/status');
      setServerStatus(response.data.status);
    } catch (error) {
      console.error('Error checking server status:', error);
    }
  };

  // Function to translate multiple texts
  const handleBulkTranslate = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/bulk_translate', {
        texts: bulkTexts,
      });
      setBulkTranslatedTexts(response.data.translated_texts);
    } catch (error) {
      console.error('Error translating bulk texts:', error);
    }
  };

  useEffect(() => {
    handleCheckStatus();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Translation and Utility API</h1>
      
      {/* Input Text for Translation */}
      <div className="mb-6">
        <label className="block text-xl font-semibold mb-2" htmlFor="text-input">Enter Text to Translate:</label>
        <textarea
          id="text-input"
          className="border rounded-md w-full p-2 mb-2"
          rows="4"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleTranslate}
        >
          Translate
        </button>
        {translatedText && (
          <div className="mt-4 p-4 border rounded-md bg-gray-100">
            <h2 className="text-2xl font-semibold">Translated Text:</h2>
            <p>{translatedText}</p>
          </div>
        )}
      </div>

      {/* Text Summarization */}
      <div className="mb-6">
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSummarize}
        >
          Summarize Text
        </button>
        {summary && (
          <div className="mt-4 p-4 border rounded-md bg-gray-100">
            <h2 className="text-2xl font-semibold">Summary:</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>

      {/* Random Words Generator */}
      <div className="mb-6">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleRandomWords()}
        >
          Generate Random Words
        </button>
        {randomWords.length > 0 && (
          <div className="mt-4 p-4 border rounded-md bg-gray-100">
            <h2 className="text-2xl font-semibold">Random Words:</h2>
            <ul className="list-disc pl-6">
              {randomWords.map((word, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bulk Translate */}
      <div className="mb-6">
        <label className="block text-xl font-semibold mb-2" htmlFor="bulk-translate-input">Enter Texts for Bulk Translation:</label>
        {bulkTexts.map((bulkText, index) => (
          <textarea
            key={index}
            id={`bulk-translate-input-${index}`}
            className="border rounded-md w-full p-2 mb-2"
            rows="2"
            value={bulkText}
            onChange={(e) => {
              const updatedBulkTexts = [...bulkTexts];
              updatedBulkTexts[index] = e.target.value;
              setBulkTexts(updatedBulkTexts);
            }}
          ></textarea>
        ))}
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBulkTranslate}
        >
          Bulk Translate
        </button>
        {bulkTranslatedTexts.length > 0 && (
          <div className="mt-4 p-4 border rounded-md bg-gray-100">
            <h2 className="text-2xl font-semibold">Bulk Translated Texts:</h2>
            <ul className="list-disc pl-6">
              {bulkTranslatedTexts.map((translatedText, index) => (
                <li key={index}>{translatedText}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Server Status */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Server Status:</h2>
        <p>{serverStatus}</p>
      </div>

      {/* Footer Section */}
      <footer className="mt-10 text-center">
        <p className="text-sm text-gray-600">© 2024 Translation & Utility API App. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;