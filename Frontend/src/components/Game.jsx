import React, { useState } from "react";
import useGame from "../hooks/useGame";
import { useAuthContext } from "../context/AuthContext";
import GLogo from "../assets/unnamed.png";
import { ToastContainer } from "react-toastify";

const Game = () => {
  const { startGame } = useAuthContext();
  const { setStartGame } = useAuthContext();
  const {
    statusMessage,
    roundNumber,
    hindiWord,
    gameStarted,
    gameOverMessage,
    timer,
    points,
    submitAnswer,
  } = useGame();
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    submitAnswer(answer);
    setAnswer("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-800">
      <ToastContainer position="top-center" autoClose={2000} />
      <img src={GLogo} alt="Langify Logo" className="w-32 mb-4" />
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-10 text-center p-4">
        Langify: The Translation Game
      </h1>

      {startGame ? (
        <div className="w-full max-w-md shadow-lg rounded-lg p-6 text-center">
          {gameStarted ? (
            <div>
              <h2 className="text-2xl font-semibold text-blue-500 mb-4">
                Round {roundNumber}
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                Translate the Hindi word:
              </p>
              <p className="text-3xl font-bold text-orange-500 mb-6">
                {hindiWord}
              </p>
              <p className="text-xl font-semibold text-gray-700 mb-6">
                Time Remaining: {timer}s
              </p>
              <p className="text-lg font-semibold text-green-500 mb-6">
                Points: {points}
              </p>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type the English translation..."
                className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-600 transition duration-300"
              >
                Submit Answer
              </button>
            </div>
          ) : gameOverMessage ? (
            <div>
              <h2 className="text-3xl font-bold text-blue-500 mb-4">
                You scored {points} points!
                <br />
                {points > 69 ? "You are rocking it! Way to go!🎉" :points>39? "You are good. You just need a little more practice!":"You have a long way to go! Better luck next time😢"}
              </h2>
              <p className="text-lg text-gray-700">{gameOverMessage}</p>
            </div>
          ) : (
            <p className="text-lg text-gray-700">{statusMessage}</p>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setStartGame(true)}
            className="mt-24 px-10 py-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
          >
            Start the Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
