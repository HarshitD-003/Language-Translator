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

const hindiWords = [
    { hindi: "पुस्तक", english: "Book" },
    { hindi: "मेज़", english: "Table" },
    { hindi: "कुर्सी", english: "Chair" },
    { hindi: "पानी", english: "Water" },
    { hindi: "सूरज", english: "Sun" },
    { hindi: "चाँद", english: "Moon" },
    { hindi: "पेड़", english: "Tree" },
    { hindi: "आसमान", english: "Sky" },
    { hindi: "समुद्र", english: "Ocean" },
    { hindi: "घड़ी", english: "Clock" },
    { hindi: "खिड़की", english: "Window" },
    { hindi: "दरवाज़ा", english: "Door" },
    { hindi: "गाड़ी", english: "Car" },
    { hindi: "पक्षी", english: "Bird" },
    { hindi: "बिल्ली", english: "Cat" },
    { hindi: "कुत्ता", english: "Dog" },
    { hindi: "गुलाब", english: "Rose" },
    { hindi: "फूल", english: "Flower" },
    { hindi: "झील", english: "Lake" },
    { hindi: "पहाड़", english: "Mountain" },
    { hindi: "सड़क", english: "Road" },
    { hindi: "घर", english: "House" },
    { hindi: "किताब", english: "Book" },
    { hindi: "आम", english: "Mango" },
    { hindi: "सपना", english: "Dream" },
    { hindi: "खुशी", english: "Happiness" },
    { hindi: "दुख", english: "Sadness" },
    { hindi: "शांत", english: "Calm" },
    { hindi: "प्रेम", english: "Love" },
    { hindi: "दोस्त", english: "Friend" },
  ];

// Function to get a random word and its translation
function getWord() {
    try {
        const response = hindiWords[Math.floor(Math.random() * hindiWords.length)];
        console.log("Fetched word:", response);
        return {
            hindiWord: response.hindi,
            englishTranslation: response.english,
        };
    } catch (error) {
        console.error("Error fetching word:", error.message);
        return { hindiWord: "नमस्ते", englishTranslation: "hello" };
    }
}

// Initialize a new round
async function startNewRound() {
    gameState.currentRound += 1;
    if (gameState.currentRound > gameState.totalRounds) {
        io.emit("gameOver", "Game over!");
        resetGame();
        return;
    }

    gameState.roundActive = true;
    gameState.wordData = getWord();

    io.emit("newRound", {
        round: gameState.currentRound,
        hindiWord: gameState.wordData.hindiWord,
        englishTranslation: gameState.wordData.englishTranslation,
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

