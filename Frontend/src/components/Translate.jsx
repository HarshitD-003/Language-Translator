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
        <div className="flex flex-col items-center justify-center h-screen p-4  text-white mt-32">
            <div className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl border border-cyan-500 transform hover:scale-105 transition-all duration-700">
                <h1 className="text-5xl font-extrabold mb-10 text-center tracking-wide text-cyan-300 drop-shadow-lg">
                    Futuristic Translator
                </h1>
                <div className="flex items-center justify-center space-x-4 mb-6">
                    <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="p-4 border border-cyan-500 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-4 focus:ring-cyan-400 shadow-xl transform hover:scale-105 transition-all duration-500"
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
                    <button
                        onClick={handleSwapLanguages}
                        className="bg-cyan-600 text-white p-4 rounded-full hover:bg-cyan-500 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-cyan-400 shadow-xl transform hover:rotate-180 hover:scale-125"
                        aria-label="Swap Languages"
                    >
                        <ArrowLeftRight />
                    </button>
                    <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="p-4 border border-cyan-500 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-4 focus:ring-cyan-400 shadow-xl transform hover:scale-105 transition-all duration-500"
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
                <textarea
                    value={text}
                    onBlur={handleDetectLanguage}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text or use voice input"
                    rows="4"
                    className="w-full p-4 border border-cyan-500 rounded-lg bg-gray-800 text-white placeholder-cyan-400 mb-6 focus:outline-none focus:ring-4 focus:ring-cyan-400 shadow-xl transform hover:scale-105 transition-all duration-500"
                />
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={handleVoiceInput}
                        className="flex-1 bg-cyan-600 text-white font-semibold py-4 rounded-lg hover:bg-cyan-500 transition-all duration-500 shadow-xl transform hover:scale-110"
                    >
                        Voice Input
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className="flex-1 bg-cyan-600 text-white text-center font-semibold py-4 rounded-lg hover:bg-cyan-500 transition-all duration-500 shadow-xl cursor-pointer transform hover:scale-110"
                    >
                        Upload Image
                    </label>
                </div>
                <button
                    onClick={handleTranslate}
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-lg mb-6 hover:bg-green-500 transition-all duration-500 shadow-xl transform hover:scale-110"
                >
                    Translate
                </button>
                {error && (
                    <div className="text-red-500 text-center mb-6 font-semibold text-lg">
                        {error}
                    </div>
                )}
                <div className="relative mb-6">
                    <textarea
                        value={translatedText}
                        readOnly
                        placeholder="Translation"
                        rows="4"
                        className="w-full p-4 border border-cyan-500 rounded-lg bg-gray-800 text-white placeholder-cyan-400 focus:outline-none shadow-xl transform hover:scale-105 transition-all duration-500"
                    />
                    <button
                        onClick={handleCopyToClipboard}
                        className="absolute right-4 top-4 p-4 bg-cyan-700 text-white rounded-full hover:bg-cyan-600 shadow-xl transform hover:scale-125 transition-all duration-500"
                        aria-label="Copy to Clipboard"
                    >
                        <Clipboard />
                    </button>
                </div>
                <button
                    onClick={handleTextToSpeech}
                    className="w-full bg-cyan-600 text-white font-bold py-4 rounded-lg hover:bg-cyan-500 transition-all duration-500 shadow-xl transform hover:scale-110"
                >
                    Listen
                </button>
            </div>
        </div>
    );
};

export default Translate;
