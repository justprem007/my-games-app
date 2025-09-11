import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // 👈 import router hook
import "./TicTacToe.css";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const navigate = useNavigate(); // 👈 create navigate function

  function handleClick(i) {
    if (board[i] || calculateWinner(board)) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  const winner = calculateWinner(board);

  return (
    <div className="ttt-container">
      <h2>Tic Tac Toe</h2>
      <div className="ttt-board">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="ttt-cell"
          >
            {cell}
          </button>
        ))}
      </div>
      <p>
        {winner
          ? `Winner: ${winner}`
          : `Next Player: ${xIsNext ? "X" : "O"}`}
      </p>
      <button onClick={resetGame} className="ttt-button">
        Restart
      </button>

      {/* 👇 New button */}
      <button
        onClick={() => navigate("/")}
        className="ttt-button"
        style={{ marginLeft: "10px", background: "#6b7280" }}
      >
        Back to Main Menu
      </button>
    </div>
  );
}

// Helper function
function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
