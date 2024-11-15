const { app, server } = require('./socket.js');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');

const PORT = 8001;

app.use(
    cors({
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
    })
);

const upload = multer({ dest: 'uploads/' });
console.log(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file || !req.body.sourceLang || !req.body.targetLang) {
            return res
                .status(400)
                .json({ error: 'Missing file or language data' });
        }

        const imagePath = path.resolve(req.file.path);
        const sourceLang = req.body.sourceLang;
        const targetLang = req.body.targetLang;

        // Upload image to Gemini
        const uploadResult = await fileManager.uploadFile(imagePath, {
            mimeType: req.file.mimetype,
            displayName: req.file.originalname,
        });

        // Extract text using Gemini
        const extractionResult = await model.generateContent([
            `Extract text from this image:`,
            {
                fileData: {
                    fileUri: uploadResult.file.uri,
                    mimeType: uploadResult.file.mimeType,
                },
            },
        ]);
        const extractedText = extractionResult.response.text();

        // Translate the extracted text to the target language
        const translationResult = await model.generateContent([
            `Translate this text from ${sourceLang} to ${targetLang}: "${extractedText} and Dont bold anything"`,
        ]);
        const translatedText = translationResult.response.text();

        // Optionally delete the uploaded file after processing
        fs.unlinkSync(imagePath);

        // Send both extracted and translated text back to the frontend
        res.json({ extractedText, translatedText });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process the image' });
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
