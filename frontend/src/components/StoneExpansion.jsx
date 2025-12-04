import React, { useState } from "react";
import "./StoneExpansion.css";

export default function StoneExpansion() {
  const [boardSize, setBoardSize] = useState(6);
  const [setupMode, setSetupMode] = useState(true); // step 1: size select → step 2: initial placement
  const [placingColor, setPlacingColor] = useState("B"); // B or W
  const [initialBoard, setInitialBoard] = useState([]);

  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("B");
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  /** --------------------------
   * STEP 1: BOARD SIZE SELECTION
   * -------------------------- */
  const createEmptyBoard = (size) =>
    Array.from({ length: size }, () => Array(size).fill(null));

  const startPlacement = () => {
    if (boardSize < 3 || boardSize > 20) {
      alert("Board size must be between 3 and 20.");
      return;
    }

    setInitialBoard(createEmptyBoard(boardSize));
    setSetupMode("placing"); // go to placement screen
  };

  /** --------------------------
   * STEP 2: INITIAL STONE PLACEMENT
   * -------------------------- */
  const handleSetupClick = (r, c) => {
    const newBoard = initialBoard.map((row) => row.slice());
    newBoard[r][c] = placingColor;
    setInitialBoard(newBoard);
  };

  const finishSetup = () => {
    let hasBlack = false;
    let hasWhite = false;

    initialBoard.forEach((row) =>
      row.forEach((cell) => {
        if (cell === "B") hasBlack = true;
        if (cell === "W") hasWhite = true;
      })
    );

    if (!hasBlack || !hasWhite) {
      alert("You must place at least one Black and one White stone.");
      return;
    }

    setBoard(initialBoard.map((r) => r.slice()));
    setSetupMode(false); // start game
  };

  /** --------------------------
   * GAME LOGIC
   * -------------------------- */
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const canExpandFrom = (r, c, grid) =>
    dirs.every(([dr, dc]) => {
      const nr = r + dr,
        nc = c + dc;
      return (
        nr >= 0 &&
        nr < boardSize &&
        nc >= 0 &&
        nc < boardSize &&
        grid[nr][nc] === null
      );
    });

  const hasAnyMove = (player, grid) => {
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (grid[r][c] === player && canExpandFrom(r, c, grid)) {
          return true;
        }
      }
    }
    return false;
  };

  const handleCellClick = (r, c) => {
    if (gameOver) return;

    // Step A: select stone
    if (board[r][c] === currentPlayer) {
      setSelected({ r, c });
      return;
    }

    // Step B: click empty cell while something is selected = perform move
    if (selected && board[r][c] === null) {
      const { r: sr, c: sc } = selected;

      if (!canExpandFrom(sr, sc, board)) {
        alert("That stone cannot expand — an orthogonal neighbour is occupied.");
        return;
      }

      const newBoard = board.map((row) => row.slice());
      newBoard[sr][sc] = null; // remove selected stone

      dirs.forEach(([dr, dc]) => {
        const nr = sr + dr,
          nc = sc + dc;
        if (
          nr >= 0 &&
          nr < boardSize &&
          nc >= 0 &&
          nc < boardSize &&
          newBoard[nr][nc] === null
        ) {
          newBoard[nr][nc] = currentPlayer;
        }
      });

      setBoard(newBoard);
      setSelected(null);

      const next = currentPlayer === "B" ? "W" : "B";

      if (!hasAnyMove(next, newBoard)) {
        setGameOver(true);
      } else {
        setCurrentPlayer(next);
      }
    }
  };

  /** --------------------------
   * RENDER
   * -------------------------- */

  /* --- STEP 1: BOARD SIZE SELECTION --- */
  if (setupMode === true) {
    return (
      <div className="stone-expansion-container">
        <h2>Stone Expansion — Setup</h2>

        <label>Board Size:</label>
        <input
          type="number"
          value={boardSize}
          min={3}
          max={20}
          onChange={(e) => setBoardSize(Number(e.target.value))}
        />

        <button onClick={startPlacement}>Next</button>
      </div>
    );
  }

  /* --- STEP 2: STONE PLACEMENT SCREEN --- */
  if (setupMode === "placing") {
    return (
      <div className="stone-expansion-container">
        <h2>Place Initial Stones</h2>

        <p>Click cells to place stones. Switch color as needed.</p>

        <label>Current placing color:</label>
        <select
          value={placingColor}
          onChange={(e) => setPlacingColor(e.target.value)}
        >
          <option value="B">Black</option>
          <option value="W">White</option>
        </select>

        <div className="board">
          {initialBoard.map((row, r) => (
            <div key={r} className="row">
              {row.map((cell, c) => (
                <div key={c} className="cell" onClick={() => handleSetupClick(r, c)}>
                  {cell === "B" && <div className="stone black" />}
                  {cell === "W" && <div className="stone white" />}
                </div>
              ))}
            </div>
          ))}
        </div>

        <button onClick={finishSetup}>Start Game</button>
      </div>
    );
  }

  /* --- GAME SCREEN --- */
  return (
    <div className="stone-expansion-container">
      <h2>Stone Expansion</h2>

      <div className="status">
        {gameOver ? (
          <h3>Game Over! Winner: {currentPlayer === "B" ? "White" : "Black"}</h3>
        ) : (
          <h3>Turn: {currentPlayer === "B" ? "Black" : "White"}</h3>
        )}
      </div>

      <div className="board">
        {board.map((row, r) => (
          <div key={r} className="row">
            {row.map((cell, c) => (
              <div
                key={c}
                className={`cell ${
                  selected && selected.r === r && selected.c === c ? "selected" : ""
                }`}
                onClick={() => handleCellClick(r, c)}
              >
                {cell === "B" && <div className="stone black" />}
                {cell === "W" && <div className="stone white" />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
