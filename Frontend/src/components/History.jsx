import { useEffect, useState } from 'react';

const History = () => {
    // Initialize historyData with sample dummy data
    const [historyData, setHistoryData] = useState([
        {
            sourceLang: 'English',
            targetLang: 'Spanish',
            sourceContent: 'Hello, how are you?',
            outputContent: 'Hola, ¿cómo estás?',
            timestamp: '14/11 12:30 PM',
        },
        {
            sourceLang: 'French',
            targetLang: 'English',
            sourceContent: 'Bonjour tout le monde',
            outputContent: 'Hello everyone',
            timestamp: '14/11 11:15 AM',
        },
        {
            sourceLang: 'German',
            targetLang: 'Italian',
            sourceContent: 'Guten Morgen',
            outputContent: 'Buongiorno',
            timestamp: '13/11 5:45 PM',
        },
        {
            sourceLang: 'Japanese',
            targetLang: 'Korean',
            sourceContent: 'こんにちは',
            outputContent: '안녕하세요',
            timestamp: '13/11 3:20 PM',
        },
        {
            sourceLang: 'Chinese',
            targetLang: 'English',
            sourceContent: '你好',
            outputContent: 'Hello',
            timestamp: '12/11 10:00 AM',
        },
        {
            sourceLang: 'Russian',
            targetLang: 'Arabic',
            sourceContent: 'Привет',
            outputContent: 'مرحبا',
            timestamp: '12/11 9:45 AM',
        },
        {
            sourceLang: 'Hindi',
            targetLang: 'Bengali',
            sourceContent: 'नमस्ते',
            outputContent: 'নমস্কার',
            timestamp: '11/11 8:30 PM',
        },
        {
            sourceLang: 'Korean',
            targetLang: 'Vietnamese',
            sourceContent: '안녕하세요',
            outputContent: 'Xin chào',
            timestamp: '11/11 7:20 PM',
        },
        {
            sourceLang: 'Italian',
            targetLang: 'Portuguese',
            sourceContent: 'Ciao',
            outputContent: 'Olá',
            timestamp: '10/11 6:10 PM',
        },
    ]);
    const languageMap = {
        en: 'English',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        it: 'Italian',
        pt: 'Portuguese',
        zh: 'Chinese',
        ja: 'Japanese',
        ko: 'Korean',
        ru: 'Russian',
        ar: 'Arabic',
        hi: 'Hindi',
        bn: 'Bengali',
        tr: 'Turkish',
        vi: 'Vietnamese',
    };

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        const updatedHistory = history.map((entry) => ({
            ...entry,
            sourceLang: languageMap[entry.sourceLang] || entry.sourceLang,
            targetLang: languageMap[entry.targetLang] || entry.targetLang,
        }));
        setHistoryData((prevData) => [...prevData, ...updatedHistory]);
    }, []);

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white mt-64">
            <h1 className="text-3xl font-bold text-center mb-8">
                Translation History
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyData.map((entry, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition duration-200"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-lg">
                                {entry.sourceLang}
                            </span>
                            <span className="text-xl">→</span>
                            <span className="font-semibold text-lg text-right">
                                {entry.targetLang}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <div className="w-1/2 pr-2">
                                <p className="text-gray-300">
                                    {entry.sourceContent}
                                </p>
                            </div>
                            <div className="w-1/2 pl-2">
                                <p className="text-gray-300 text-right">
                                    {entry.outputContent}
                                </p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-400 text-left mt-4">
                            {entry.timestamp}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
