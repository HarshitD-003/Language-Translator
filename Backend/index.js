const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors({
    credentials: true,
    origin: "", 
    methods: ["GET", "POST"],
}));

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

const PORT = 8000;

// Game state variables
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
        const response = await axios.get("https://api.gemni.com/randomWord");
        // Assuming response contains `hindiWord` and `englishTranslation`
        return {
            hindiWord: response.data.hindiWord,
            englishTranslation: response.data.englishTranslation,
        };
    } catch (error) {
        console.error("Error fetching word:", error);
        return { hindiWord: "नमस्ते", englishTranslation: "hello" }; // Fallback example
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
    gameState.wordData = await getWordFromGemniAPI();

    // Emit new round data to both players
    io.emit("newRound", {
        round: gameState.currentRound,
        hindiWord: gameState.wordData.hindiWord,
    });

    // Start the round timer
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

    // Start the next round after a delay
    setTimeout(() => {
        startNewRound();
    }, 3000); // 3-second delay between rounds
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

    // Handle player joining
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

    // Handle player submitting an answer
    socket.on("submitAnswer", (answer) => {
        if (gameState.roundActive && answer === gameState.wordData.englishTranslation) {
            gameState.players[socket.id].score += 1;
            endRound("correctAnswer");
        }
    });

    // Handle player disconnection
    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        delete gameState.players[socket.id];
        resetGame();
        io.emit("playerDisconnected", "A player disconnected. Game has been reset.");
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
