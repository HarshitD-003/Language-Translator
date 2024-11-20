import { useState } from 'react';
import { ArrowLeftRight, Clipboard } from 'lucide-react';

const Translate = () => {
    const [sourceLang, setSourceLang] = useState('auto');
    const [targetLang, setTargetLang] = useState('en');
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [error, setError] = useState('');
    var apiKey = import.meta.env.VITE_API_KEY;

    const handleSwapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setTranslatedText(text);
        setText(translatedText);
    };

    const handleDetectLanguage = async () => {
        setError('');

        if (!text.trim()) return;

        const myHeaders = new Headers();
        myHeaders.append('apikey', apiKey);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: text,
            redirect: 'follow',
        };

        try {
            const response = await fetch(
                'https://api.apilayer.com/language_translation/identify',
                requestOptions
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            const detectedLanguage = result.languages[0]?.language;
            if (detectedLanguage) {
                setSourceLang(detectedLanguage);
            } else {
                setError('Could not detect language.');
            }
        } catch (error) {
            console.error('Error during language detection:', error);
            setError('Failed to detect language. Please try again.');
        }
    };

    const handleVoiceInput = () => {
        const recognition = new (window.webkitSpeechRecognition ||
            window.SpeechRecognition)();
        recognition.lang = sourceLang;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const speechText = event.results[0][0].transcript;
            setText(speechText);
        };

        recognition.onerror = (event) => {
            console.error('Error in speech recognition:', event.error);
        };

        recognition.start();
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError('');
        setText('');
        setTranslatedText('');

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('sourceLang', sourceLang);
            formData.append('targetLang', targetLang);

            const response = await fetch('http://localhost:8001/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process the image');
            }

            const data = await response.json();

            setText(data.extractedText);
            setTranslatedText(data.translatedText);
        } catch (error) {
            console.error('Error during image upload and processing:', error);
            setError('Failed to process the image. Please try again.');
        }
    };

    const handleTranslate = async () => {
        setError('');
        setTranslatedText('');

        const payload = {
            text,
            sourceLang,
            targetLang,
        };

        try {
            const response = await fetch('http://localhost:8001/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.translatedText) {
                setTranslatedText(result.translatedText);
                const history =
                    JSON.parse(localStorage.getItem('history')) || [];
                const currentTime = new Date();
                const formattedTimestamp = `${currentTime.getDate()}/${
                    currentTime.getMonth() + 1
                } ${currentTime.getHours()}:${currentTime.getMinutes()} ${
                    currentTime.getHours() >= 12 ? 'PM' : 'AM'
                }`;

                history.push({
                    sourceLang: sourceLang,
                    targetLang: targetLang,
                    sourceContent: text,
                    outputContent: result.translatedText,
                    timestamp: formattedTimestamp,
                });

                localStorage.setItem('history', JSON.stringify(history));
            } else {
                throw new Error('Translation result is missing.');
            }
        } catch (error) {
            console.error('Error during translation:', error);
            setError('Failed to translate text. Please try again.');
        }
    };

    const handleTextToSpeech = () => {
        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = targetLang;
        speechSynthesis.speak(utterance);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard
            .writeText(translatedText)
            .then(() => {
                alert('Text copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy text: ', err);
            });
    };

    return (
        <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="h-full w-full bg-black bg-stars animate-starsMove"></div>
            </div>

            {/* Split Container */}
            <div className="w-11/12 h-5/6 flex shadow-2xl rounded-3xl bg-gray-800 bg-opacity-40 backdrop-blur-md p-12 space-x-10 border border-cyan-500 transform hover:scale-105 transition-all duration-700">
                {/* Left Section - Language Selection and Actions */}
                <div className="w-1/3 flex flex-col items-start space-y-10">
                    <h1 className="text-5xl font-extrabold text-cyan-300 tracking-wide drop-shadow-lg">
                        Futuristic Translator
                    </h1>

                    {/* Language Selection Section */}
                    <div className="w-full p-6 bg-gray-700 rounded-lg shadow-xl border border-cyan-500 transform hover:scale-105 transition-all duration-500">
                        <div className="flex items-center justify-center space-x-2">
                            {/* Source Language Dropdown */}
                            <select
                                value={sourceLang}
                                onChange={(e) => setSourceLang(e.target.value)}
                                className="flex-1 p-2 rounded-md bg-gray-600 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                <option value="auto">Detect Language</option>
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="it">Italian</option>
                                <option value="pt">Portuguese</option>
                                <option value="zh">Chinese</option>
                                <option value="ja">Japanese</option>
                                <option value="ko">Korean</option>
                                <option value="ru">Russian</option>
                                <option value="ar">Arabic</option>
                                <option value="hi">Hindi</option>
                                <option value="bn">Bengali</option>
                                <option value="tr">Turkish</option>
                                <option value="vi">Vietnamese</option>
                            </select>

                            {/* Swap Languages Button */}
                            <button
                                onClick={handleSwapLanguages}
                                className="bg-cyan-600 text-white p-3 rounded-full hover:bg-cyan-500 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-cyan-400 shadow-xl transform hover:rotate-180 hover:scale-125"
                                aria-label="Swap Languages"
                            >
                                <ArrowLeftRight />
                            </button>

                            {/* Target Language Dropdown */}
                            <select
                                value={targetLang}
                                onChange={(e) => setTargetLang(e.target.value)}
                                className="flex-1 p-2 rounded-md bg-gray-600 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="it">Italian</option>
                                <option value="pt">Portuguese</option>
                                <option value="zh">Chinese</option>
                                <option value="ja">Japanese</option>
                                <option value="ko">Korean</option>
                                <option value="ru">Russian</option>
                                <option value="ar">Arabic</option>
                                <option value="hi">Hindi</option>
                                <option value="bn">Bengali</option>
                                <option value="tr">Turkish</option>
                                <option value="vi">Vietnamese</option>
                            </select>
                        </div>
                    </div>

                    {/* Tools Section */}
                    <div className="w-full flex flex-col space-y-4">
                        <button
                            onClick={handleVoiceInput}
                            className="w-full bg-cyan-600 text-white font-semibold py-4 rounded-lg hover:bg-cyan-500 transition-all duration-500 shadow-lg transform hover:scale-110"
                        >
                            Voice Input
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="image-upload"
                            onChange={handleImageUpload}
                        />
                        <label
                            htmlFor="image-upload"
                            className="w-full bg-cyan-600 text-white text-center font-semibold py-4 rounded-lg hover:bg-cyan-500 transition-all duration-500 shadow-lg cursor-pointer transform hover:scale-110"
                        >
                            Upload Image
                        </label>
                    </div>
                </div>

                {/* Right Section - Input and Translation Output */}
                <div className="w-2/3 flex flex-col space-y-6">
                    {/* Text Input Area */}
                    <textarea
                        value={text}
                        onBlur={handleDetectLanguage}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text or use voice input"
                        rows="6"
                        className="w-full p-6 border border-cyan-500 rounded-lg bg-gray-900 text-white placeholder-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400 shadow-md transform hover:scale-105 transition-all duration-500"
                    />

                    {/* Translate Button */}
                    <button
                        onClick={handleTranslate}
                        className="w-full bg-green-600 text-white font-bold py-6 rounded-lg hover:bg-green-500 transition-all duration-500 shadow-xl transform hover:scale-110"
                    >
                        Translate
                    </button>

                    {/* Translation Output */}
                    <textarea
                        value={translatedText}
                        readOnly
                        placeholder="Translation will appear here"
                        rows="6"
                        className="w-full p-6 border border-cyan-500 rounded-lg bg-gray-800 text-white placeholder-cyan-400 text-lg focus:outline-none shadow-md transform hover:scale-105 transition-all duration-500"
                    />

                    {/* Output Actions */}
                    <div className="flex space-x-6">
                        <button
                            onClick={handleTextToSpeech}
                            className="flex-1 bg-cyan-600 text-white font-bold py-6 rounded-lg hover:bg-cyan-500 transition-all duration-500 shadow-md transform hover:scale-110"
                        >
                            Listen
                        </button>
                        <button
                            onClick={handleCopyToClipboard}
                            className="flex-1 bg-cyan-600 text-white font-bold py-6 rounded-lg hover:bg-cyan-500 transition-all duration-500 shadow-md transform hover:scale-110"
                        >
                            Copy to Clipboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Translate;