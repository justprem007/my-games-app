import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./KingDirt.css";

export default function KingDirt() {
  const [n, setN] = useState(5);           // default board size
  const [started, setStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [player, setPlayer] = useState(1);
  const [positions, setPositions] = useState({1:null, 2:null});
  const [winner, setWinner] = useState(null);

  const startGame = () => {
    setBoard(Array.from({length: n}, () => Array(n).fill(null)));
    setStarted(true);
  };

  // add click handlers, king-move logic, and win check here...

  return (
    <div className="kingdirt">
      <Link to="/">← Back to Main Menu</Link>
      {!started ? (
        <div>
          <label>
            Board size (n ≥ 1):{" "}
            <input type="number" min="1" value={n}
                   onChange={e => setN(Math.max(1, Number(e.target.value)))} />
          </label>
          <button onClick={startGame}>Start</button>
        </div>
      ) : (
        <div className="board">
          {board.map((row, r) => (
            <div key={r} className="row">
              {row.map((cell, c) => (
                <div key={c} className="cell">{/* draw pieces */}</div>
              ))}
            </div>
          ))}
        </div>
      )}
      {winner && <h2>Winner: Player {winner}</h2>}
    </div>
  );
}
