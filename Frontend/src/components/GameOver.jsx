// components/GameOver.js
import React from "react";

const GameOver = ({ message }) => {
    return (
        <div className="game-over">
            <h2>Game Over!</h2>
            <p>{message}</p>
        </div>
    );
};

export default GameOver;
