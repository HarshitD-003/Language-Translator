// components/Game.js
import React, { useState } from "react";
import useGame from "../hooks/useGame";
import { useAuthContext } from "../context/AuthContext";

const Game = () => {
  // console.log("game+");
  const { startGame } = useAuthContext();
  const { setStartGame } = useAuthContext();
  const {
    statusMessage,
    roundNumber,
    hindiWord,
    gameStarted,
    gameOverMessage,
    submitAnswer,
  } = useGame();
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    submitAnswer(answer);
    setAnswer("");
  };

  return (
    <div className="game">
      <h1>Translation Game</h1>

      {startGame ? (
        gameStarted ? (
          <div>
            <h2>Round {roundNumber}</h2>
            <p>Translate the Hindi word:</p>
            <p>
              <strong>{hindiWord}</strong>
            </p>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type the English translation..."
            />
            <button onClick={handleSubmit}>Submit Answer</button>
          </div>
        ) : gameOverMessage ? (
          <div>
            <h2>Game Over!</h2>
            <p>{gameOverMessage}</p>
          </div>
        ) : (
          <p>{statusMessage}</p>
        )
      ) : (
        <div>
          <button onClick={() => setStartGame(true)}>Start the Game</button>
        </div>
      )}
    </div>
  );
};

export default Game;
