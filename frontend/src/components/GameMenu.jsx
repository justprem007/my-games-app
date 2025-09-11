import React from "react";
import { Link } from "react-router-dom";

export default function GameMenu() {
  return (
    <div className="container">
      <h1>🎮 Welcome to My Games</h1>
      <p>Select a game to play:</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/tictactoe">
          <button style={{ margin: "10px" }}>Play Tic Tac Toe</button>
        </Link>
        <Link to="/fourinarow">
          <button style={{ margin: "10px" }}>Play Four in a Row</button>
        </Link>
      </div>
    </div>
  );
}
