// socket.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

let gameState = {
    players: {},
    currentRound: 0,
    totalRounds: 10,
    roundTime: 60000, // 1 minute in milliseconds
    wordData: null,
    roundActive: false,
    timer: null,
};

// Function to get a random word and its translation from Gemni API
async function getWordFromGemniAPI() {
    try {
        const response = await axios.get("https://ap-south-1.aws.data.mongodb-api.com/app/revtrance-hcgmauq/endpoint/hindi/randomword");
        const payload = {
            text: response.data.word,
            sourceLang: 'hi',
            targetLang: 'en',
        };
        const responsex = await fetch('http://localhost:8001/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!responsex.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const resultx = await responsex.json();
        console.log("Fetched word:", response.data.word);
        console.log("Translation:", resultx.translatedText);
        return {
            hindiWord: response.data.word,
            englishTranslation: resultx.translatedText,
        };
    } catch (error) {
        console.error("Error fetching word:", error.message);
        return { hindiWord: "नमस्ते", englishTranslation: "hello" };
    }
}

const x=getWordFromGemniAPI();
// Initialize a new round
async function startNewRound() {
    gameState.currentRound += 1;
    if (gameState.currentRound > gameState.totalRounds) {
        io.emit("gameOver", "Game over!");
        resetGame();
        return;
    }

    gameState.roundActive = true;
    gameState.wordData = await getWordFromGemniAPI();

    io.emit("newRound", {
        round: gameState.currentRound,
        hindiWord: gameState.wordData.hindiWord,
    });

    gameState.timer = setTimeout(() => {
        endRound("timeout");
    }, gameState.roundTime);
}

// End the current round
function endRound(reason) {
    gameState.roundActive = false;
    clearTimeout(gameState.timer);

    if (reason === "correctAnswer") {
        io.emit("roundEnd", { reason: "A player submitted the correct answer!" });
    } else if (reason === "timeout") {
        io.emit("roundEnd", { reason: "Time ran out!" });
    }

    setTimeout(() => {
        startNewRound();
    }, 3000);
}

// Reset the game state
function resetGame() {
    gameState = {
        players: {},
        currentRound: 0,
        totalRounds: 10,
        roundTime: 60000,
        wordData: null,
        roundActive: false,
        timer: null,
    };
}

// Socket.io connection
io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    if (Object.keys(gameState.players).length < 2) {
        gameState.players[socket.id] = { score: 0 };
        socket.emit("waitingForPlayers", "Waiting for another player to join...");

        if (Object.keys(gameState.players).length === 2) {
            io.emit("gameStart", "Game is starting!");
            startNewRound();
        }
    } else {
        socket.emit("gameFull", "Game is full. Please try again later.");
    }

    socket.on("submitAnswer", (answer) => {
        if (gameState.roundActive && answer === gameState.wordData.englishTranslation) {
            gameState.players[socket.id].score += 1;
            endRound("correctAnswer");
        }
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        delete gameState.players[socket.id];
        resetGame();
        io.emit("playerDisconnected", "A player disconnected. Game has been reset.");
    });
});

module.exports = { app, server };

