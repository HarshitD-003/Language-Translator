// hooks/useGame.js
import { useState, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useGame = () => {
  const { socket } = useSocketContext();
  const [statusMessage, setStatusMessage] = useState(
    "Connecting to the game..."
  );
  const [roundNumber, setRoundNumber] = useState(0);
  const [hindiWord, setHindiWord] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [timer, setTimer] = useState(10);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    let timerInterval;

    if (gameStarted) {
      setTimer(10); // Reset timer to 60 seconds for each round
      timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 1) return prev - 1;
          clearInterval(timerInterval);
          socket.emit("timeUp"); // Emit event when time runs out
          toast.warning("Time's up! Moving to the next round.");
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [gameStarted, roundNumber, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setStatusMessage("Connected! Waiting for other players...");
      });

      socket.on("waitingForPlayers", (message) => {
        setStatusMessage(message);
      });

      socket.on("gameStart", () => {
        setStatusMessage("");
        setGameStarted(true);
      });

      socket.on("newRound", (data) => {
        setRoundNumber(data.round);
        setHindiWord(data.hindiWord);
        localStorage.setItem("hindiWord", data.hindiWord);
        localStorage.setItem("englishTranslation", data.englishTranslation);
        //toast.info("New round started!");
      });

      socket.on("roundEnd", (data) => {
        toast.error(data.reason); // Notify why the round ended
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
      toast.success("Correct Answer!");
      setPoints((prevPoints) => prevPoints + 10);
      socket.emit("submitAnswer", answer);
    } else {
      toast.error(`Incorrect! Correct answer: ${correctTranslation}`);
    }
  };

  return {
    statusMessage,
    roundNumber,
    hindiWord,
    gameStarted,
    gameOverMessage,
    timer,
    points,
    submitAnswer,
  };
};

export default useGame;
