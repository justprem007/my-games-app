import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./KingDirt.css";

export default function KingDirt() {
  const [size, setSize] = useState(5);           // board size n
  const [board, setBoard] = useState([]);        // n x n, stores "B" (blocked), 1, or 2
  const [phase, setPhase] = useState("setup");   // "setup" -> placement -> play -> end
  const [turn, setTurn] = useState(1);           // 1 or 2
  const [positions, setPositions] = useState({ 1: null, 2: null });
  const [winner, setWinner] = useState(null);

  // start button: build empty board
  const startGame = () => {
    setBoard(Array.from({ length: size }, () => Array(size).fill(null)));
    setPhase("placement"); // placement of the two kings
    setTurn(1);
    setPositions({ 1: null, 2: null });
    setWinner(null);
  };

  // helper to see if a move is legal (king move)
  const isLegalMove = (from, to) => {
    if (!from) return false;
    const [fr, fc] = from;
    const [tr, tc] = to;
    return Math.max(Math.abs(fr - tr), Math.abs(fc - tc)) === 1;
  };

  const legalMoves = (playerPos) => {
    if (!playerPos) return [];
    const [r, c] = playerPos;
    const moves = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 &&
          nr < size &&
          nc >= 0 &&
          nc < size &&
          !board[nr][nc]
        ) {
          moves.push([nr, nc]);
        }
      }
    }
    return moves;
  };

  const handleCellClick = (r, c) => {
    // during placement
    if (phase === "placement") {
      if (board[r][c]) return;
      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = turn;
      setBoard(newBoard);
      setPositions((p) => ({ ...p, [turn]: [r, c] }));
      if (turn === 1) {
        setTurn(2);
      } else {
        setTurn(1);
        setPhase("play");
      }
      return;
    }

    // during play
    if (phase === "play") {
      const from = positions[turn];
      if (!isLegalMove(from, [r, c]) || board[r][c]) return;

      const newBoard = board.map((row) => [...row]);
      // mark old square as blocked
      newBoard[from[0]][from[1]] = "B";
      // place king
      newBoard[r][c] = turn;

      setBoard(newBoard);
      setPositions((p) => ({ ...p, [turn]: [r, c] }));

      // check if opponent can move
      const next = turn === 1 ? 2 : 1;
      if (legalMoves(positions[next]).length === 0) {
        setWinner(turn);
        setPhase("end");
      } else {
        setTurn(next);
      }
    }
  };

  return (
    <div className="kingdirt">
      <Link to="/">← Back to Main Menu</Link>

      {phase === "setup" && (
        <div className="setup">
          <label>
            Board size (n ≥ 1):{" "}
            <input
              type="number"
              min="1"
              value={size}
              onChange={(e) =>
                setSize(Math.max(1, Number(e.target.value)))
              }
            />
          </label>
          <button onClick={startGame}>Start Game</button>
        </div>
      )}

      {phase !== "setup" && (
        <>
          <h2>
            {winner
              ? `Winner: Player ${winner}`
              : phase === "placement"
              ? `Player ${turn}: place your king`
              : `Player ${turn}'s turn`}
          </h2>

          <div className="board">
            {board.map((row, ri) => (
              <div key={ri} className="row">
                {row.map((cell, ci) => {
                  let className = "cell";
                  if (cell === "B") className += " blocked";
                  if (cell === 1) className += " p1";
                  if (cell === 2) className += " p2";
                  return (
                    <div
                      key={ci}
                      className={className}
                      onClick={() => handleCellClick(ri, ci)}
                    >
                      {cell === 1 ? "♚" : cell === 2 ? "♔" : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
