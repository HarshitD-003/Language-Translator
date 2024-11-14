// hooks/useGame.js
import { useState, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";

const useGame = () => {
  const { socket } = useSocketContext();
  const [statusMessage, setStatusMessage] = useState(
    "Connecting to the game..."
  );
  const [roundNumber, setRoundNumber] = useState(0);
  const [hindiWord, setHindiWord] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setStatusMessage("Connected! Waiting for other players...");
      });

      socket.on("waitingForPlayers", (message) => {
        setStatusMessage(message);
      });

      socket.on("gameStart", () => {
        console.log("inside");
        setStatusMessage("");
        setGameStarted(true);
      });

      socket.on("newRound", (data) => {
        setRoundNumber(data.round);
        setHindiWord(data.hindiWord);
        // Store both Hindi and English words in local storage
        localStorage.setItem("hindiWord", data.hindiWord);
        localStorage.setItem("englishTranslation", data.englishTranslation);
      });

      socket.on("roundEnd", (data) => {
        alert(data.reason); // Notify why the round ended
      });

      socket.on("gameOver", (message) => {
        setGameOverMessage(message);
        setGameStarted(false);
      });

      return () => {
        socket.off();
      };
    }
  }, [socket]);

  const submitAnswer = (answer) => {
    const correctTranslation = localStorage
      .getItem("englishTranslation")
      .toLowerCase();
    if (answer.trim().toLowerCase() === correctTranslation) {
      socket.emit("submitAnswer", answer);
    } else {
      alert("Incorrect! Try again.");
    }
  };

  return {
    statusMessage,
    roundNumber,
    hindiWord,
    gameStarted,
    gameOverMessage,
    submitAnswer,
  };
};

export default useGame;
