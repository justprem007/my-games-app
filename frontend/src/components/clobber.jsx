import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Clobber.css";

export default function Clobber() {
    const location = useLocation();
    const { mode } = location.state || { mode: "normal" };

    const [colSize, setColSize] = useState(5);
    const [rowSize, setRowSize] = useState(6);
    const [board, setBoard] = useState([]);
    const [turn, setTurn] = useState(1); // 1 (White) | 2 (Black)
    const [winner, setWinner] = useState(null);
    const [selected, setSelected] = useState(null); // [r, c] of selected piece

    // Initialize Game
    const startGame = useCallback(() => {
        const newBoard = [];
        for (let r = 0; r < rowSize; r++) {
            const row = [];
            for (let c = 0; c < colSize; c++) {
                // Checkerboard setup:
                // (r+c) even -> Player 1 (White - typically)
                // (r+c) odd  -> Player 2 (Black)
                row.push((r + c) % 2 === 0 ? 1 : 2);
            }
            newBoard.push(row);
        }
        setBoard(newBoard);
        setTurn(1);
        setWinner(null);
        setSelected(null);
    }, [rowSize, colSize]);

    // Initial stats
    useEffect(() => {
        startGame();
    }, [startGame]);

    // Check for legal moves for a specific player
    const hasLegalMoves = (player, currentBoard) => {
        const opponent = player === 1 ? 2 : 1;
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // Orthogonal

        for (let r = 0; r < currentBoard.length; r++) {
            for (let c = 0; c < currentBoard[0].length; c++) {
                if (currentBoard[r][c] === player) {
                    // Check neighbors
                    for (let [dr, dc] of dirs) {
                        const nr = r + dr, nc = c + dc;
                        if (
                            nr >= 0 && nr < currentBoard.length &&
                            nc >= 0 && nc < currentBoard[0].length &&
                            currentBoard[nr][nc] === opponent
                        ) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    // Handle Cell Click
    const handleCellClick = (r, c) => {
        if (winner) return;

        const cell = board[r][c];

        // 1. Select own piece
        if (cell === turn) {
            // Toggle selection or select new
            if (selected && selected[0] === r && selected[1] === c) {
                setSelected(null);
            } else {
                // Check if this piece has captures available
                // (Optional strictness: only let select if move possible? 
                // For UI feedback, let's allow select, but only move if valid)
                setSelected([r, c]);
            }
            return;
        }

        // 2. Try to capture
        if (selected) {
            const [sr, sc] = selected;
            // Must be opponent
            const opponent = turn === 1 ? 2 : 1;
            if (cell === opponent) {
                // Must be adjacent orthogonal
                const dist = Math.abs(sr - r) + Math.abs(sc - c);
                if (dist === 1) {
                    // Valid Move!
                    makeMove(sr, sc, r, c);
                }
            }
        }
    };

    const makeMove = (fromR, fromC, toR, toC) => {
        const newBoard = board.map(row => [...row]);
        newBoard[toR][toC] = turn; // Clobber matches piece moving
        newBoard[fromR][fromC] = null; // Leave empty spot
        setBoard(newBoard);
        setSelected(null);

        // Check Win Condition for NEXT player
        const nextPlayer = turn === 1 ? 2 : 1;
        if (!hasLegalMoves(nextPlayer, newBoard)) {
            setWinner(turn); // Current player wins because next has no moves
        } else {
            setTurn(nextPlayer);
        }
    };

    // Helper to check if a cell is a valid capture target for the selected piece
    const isValidTarget = (r, c) => {
        if (!selected) return false;
        const [sr, sc] = selected;
        if (board[r][c] !== (turn === 1 ? 2 : 1)) return false; // Must be enemy
        return (Math.abs(sr - r) + Math.abs(sc - c) === 1);
    };

    return (
        <div className="clobber-container">
            <div className="clobber-layout">

                {/* SIDE PANEL */}
                <div className="clobber-sidebar">
                    <Link to="/" className="back-link">← Back</Link>

                    <h2>Clobber</h2>

                    <div className="status-card">
                        {winner ? (
                            <div className="winner-banner">
                                Winner: Player {winner} {winner === 1 ? "🔵" : "🟠"}
                            </div>
                        ) : (
                            <div className="turn-banner">
                                Turn: Player {turn} {turn === 1 ? "🔵" : "🟠"}
                            </div>
                        )}

                        <div className="info-text">
                            {selected
                                ? "Select an adjacent opponent stone to capture."
                                : "Select one of your stones to move."}
                        </div>
                    </div>

                    <div className="settings-card">
                        <label>Rows: <input type="number" value={rowSize} onChange={(e) => setRowSize(Number(e.target.value))} min="2" max="10" /></label>
                        <label>Cols: <input type="number" value={colSize} onChange={(e) => setColSize(Number(e.target.value))} min="2" max="10" /></label>
                        <button onClick={startGame} className="restart-btn">Restart Game</button>
                    </div>

                    <div className="rules-card">
                        <h4>Rules</h4>
                        <ul>
                            <li>Board starts full (Checkerboard).</li>
                            <li><strong>Move:</strong> Pick your stone and "clobber" (move onto) an adjacent opponent stone to remove it.</li>
                            <li><strong>Win:</strong> If you cannot move, you lose. (Last player to move wins).</li>
                        </ul>
                    </div>
                </div>

                {/* BOARD AREA */}
                <div className="clobber-main">
                    <div
                        className="clobber-board"
                        style={{
                            gridTemplateColumns: `repeat(${colSize}, 60px)`
                        }}
                    >
                        {board.map((row, r) => (
                            row.map((cell, c) => {
                                const isSelected = selected && selected[0] === r && selected[1] === c;
                                const isTarget = isValidTarget(r, c);

                                let cellClass = "cl-cell";
                                if (cell === null) cellClass += " empty";

                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={cellClass}
                                        onClick={() => handleCellClick(r, c)}
                                    >
                                        {/* Render Stone if exists */}
                                        {cell !== null && (
                                            <div className={`stone p${cell} ${isSelected ? "selected" : ""} ${isTarget ? "target" : ""}`}>
                                                {/* Optional icon or just color */}
                                            </div>
                                        )}
                                        {/* Show target marker if valid move */}
                                        {isTarget && <div className="target-marker">⚔️</div>}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

