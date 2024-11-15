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
            formData.append('sourceLang', sourceLang); // Source language
            formData.append('targetLang', targetLang); // Target language

            // Send a single request to the backend
            const response = await fetch('http://localhost:8001/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process the image');
            }

            const data = await response.json();

            // Set both extracted text and translated text
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

        const myHeaders = new Headers();
        myHeaders.append('apikey', apiKey);

        // const raw = `body=${text}&target=${targetLang}&source=${sourceLang}`;
        const raw = text;
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };

        try {
            const response = await fetch(
                `https://api.apilayer.com/language_translation/translate?target=${targetLang} `,
                requestOptions
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setTranslatedText(result.translations[0]?.translation || '');
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
        <div className="flex flex-col items-center p-6 h-screen">
            <div className="w-full bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">
                    Language Translator
                </h1>

                <div className="flex flex-row items-center justify-center my-8 space-x-4">
                    <div className="flex flex-col">
                        <select
                            value={sourceLang}
                            onChange={(e) => setSourceLang(e.target.value)}
                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    </div>

                    <button
                        onClick={handleSwapLanguages}
                        className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 flex my-auto"
                        aria-label="Swap Languages"
                    >
                        <ArrowLeftRight />
                    </button>

                    <div className="flex flex-col">
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleDetectLanguage}
                    placeholder="Enter text or use voice input"
                    rows="4"
                    className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={handleVoiceInput}
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
                    >
                        Use Microphone
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
                        className="w-full bg-blue-600 text-white text-center font-semibold py-2 rounded hover:bg-blue-700 transition"
                    >
                        Upload Image
                    </label>
                </div>

                <button
                    onClick={handleTranslate}
                    className="w-full bg-green-600 text-white font-semibold py-2 rounded mb-4 hover:bg-green-700 transition"
                >
                    Translate
                </button>

                {error && (
                    <div className="text-red-500 text-center mb-4">{error}</div>
                )}

                <div className="relative mb-4">
                    <textarea
                        value={translatedText}
                        readOnly
                        placeholder="Translation"
                        rows="4"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button
                        onClick={handleCopyToClipboard}
                        className="absolute right-2 top-2 p-2 bg-gray-600 text-white rounded-full hover:bg-gray-500"
                        aria-label="Copy to Clipboard"
                    >
                        <Clipboard />
                    </button>
                </div>

                <button
                    onClick={handleTextToSpeech}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition text-center"
                >
                    Listen to Translation
                </button>
            </div>
        </div>
    );
};

export default Translate;
