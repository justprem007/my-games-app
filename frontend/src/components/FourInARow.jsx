import React, { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./KingDirt.css"; // same styling as your game
import { resolveBidding } from "./biddingEngine";

export default function FourInARow() {
  const location = useLocation();
  const { mode, currencyP1, currencyP2, markerHolder } =
    location.state || {
      mode: "normal",
      currencyP1: 0,
      currencyP2: 0,
      markerHolder: "P1",
    };

  // -------------- STATE -------------------

  const [cols, setCols] = useState(4);
  const [rows, setRows] = useState(4);

  const [board, setBoard] = useState([]);
  const [phase, setPhase] = useState("setup"); // setup → play/bidding → action → end
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);

  // bidding
  const [P1money, setP1money] = useState(currencyP1);
  const [P2money, setP2money] = useState(currencyP2);
  const [currentMarker, setCurrentMarker] = useState(markerHolder);

  const [bidP1, setBidP1] = useState(0);
  const [bidP2, setBidP2] = useState(0);
  const [bidError, setBidError] = useState("");
  const [useMarker, setUseMarker] = useState(false);

  const [awaitActor, setAwaitActor] = useState(null); // "P1" | "P2"
  const [previewCol, setPreviewCol] = useState(null);

  // -------------- START GAME -------------------

  const startGame = () => {
    setBoard(
      Array.from({ length: rows }, () => Array(cols).fill(null))
    );

    if (mode === "bidding") setPhase("bidding");
    else setPhase("play");

    setTurn(1);
    setWinner(null);

    setP1money(currencyP1);
    setP2money(currencyP2);
    setCurrentMarker(markerHolder);

    setBidP1(0);
    setBidP2(0);
    setBidError("");
    setUseMarker(false);
    setAwaitActor(null);
    setPreviewCol(null);
  };

  // -------------- DROP LOGIC -------------------

  const findRowForDrop = useCallback(
    (col) => {
      for (let r = rows - 1; r >= 0; r--) {
        if (board[r][col] === null) return r;
      }
      return null; // full
    },
    [board, rows]
  );

  const checkWinner = useCallback(
    (brd) => {
      const dirs = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const player = brd[r][c];
          if (!player) continue;

          for (let [dr, dc] of dirs) {
            let count = 1;

            for (let k = 1; k < 4; k++) {
              const nr = r + dr * k;
              const nc = c + dc * k;
              if (
                nr < 0 ||
                nr >= rows ||
                nc < 0 ||
                nc >= cols ||
                brd[nr][nc] !== player
              )
                break;
              count++;
            }

            if (count >= 4) return player;
          }
        }
      }

      // check draw
      if (brd[0].every((v) => v !== null)) return "draw";
      return null;
    },
    [rows, cols]
  );

  // -------------- HANDLE DROP -------------------

  const performDrop = (col, actor) => {
    const row = findRowForDrop(col);
    if (row === null) return false;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = actor;
    setBoard(newBoard);

    const w = checkWinner(newBoard);
    if (w) {
      setWinner(w === "draw" ? null : w);
      setPhase("end");
      return true;
    }

    return true;
  };

  // -------------- HANDLE CLICK -------------------

  const handleColumnClick = (col) => {
    if (winner || phase === "end") return;

    setPreviewCol(col);

    // normal mode
    if (mode !== "bidding") {
      const ok = performDrop(col, turn);
      if (!ok) return;

      if (!winner) {
        setTurn(turn === 1 ? 2 : 1);
      }
      return;
    }

    // bidding mode
    if (phase === "action" && awaitActor) {
      const actor = awaitActor === "P1" ? 1 : 2;
      const ok = performDrop(col, actor);
      if (!ok) return;

      setAwaitActor(null);
      setPhase("bidding");
      return;
    }

    // ignore clicks when bidding
  };

  // -------------- SUBMIT BIDS -------------------

  const submitBids = () => {
    if (phase !== "bidding") return;

    if (bidP1 > P1money) return setBidError("P1 overbids");
    if (bidP2 > P2money) return setBidError("P2 overbids");

    setBidError("");

    const r = resolveBidding({
      bidP1,
      bidP2,
      P1money,
      P2money,
      currentMarker,
      useMarker,
    });

    setP1money(r.newP1money);
    setP2money(r.newP2money);
    setCurrentMarker(r.newMarkerHolder);

    setAwaitActor(r.winner);

    setBidP1(0);
    setBidP2(0);
    setUseMarker(false);

    setPhase("action");
  };

  // --------------------------------------------
  return (
    <div className="kd-layout">
      {/* LEFT PANEL */}
      <div className="kd-left">
        <Link to="/">← Back</Link>

        {phase === "setup" && (
          <>
            <h3>Setup</h3>

            <input
              type="number"
              value={rows}
              min={4}
              onChange={(e) => {
  const v = Number(e.target.value);
  setRows(v < 4 ? 4 : v);
}}

            />

            <input
              type="number"
              value={cols}
              min={4}
              onChange={(e) => {
  const v = Number(e.target.value);
  setCols(v < 4 ? 4 : v);
}}

            />


            <button style={{ marginTop: 10 }} onClick={startGame}>
              Start Game
            </button>
          </>
        )}

        {mode === "normal" ? (
  <>
    <h3>How to Play (Normal Mode)</h3>
    <ul>
      <li>Players take turns dropping a disc into any column.</li>
      <li>The disc falls to the lowest empty slot in that column.</li>
      <li>First player to connect 4 discs in a row wins.</li>
      <li>Rows can be horizontal, vertical, or diagonal.</li>
      <li>If the board fills with no winner, the game ends in a draw.</li>
    </ul>
  </>
) : (
  <>
    <h3>How to Play (Bidding Mode)</h3>
    <ul>
      <li>Each turn, both players secretly choose a bid.</li>
      <li>Higher bid wins the right to place the next disc.</li>
      <li>The winner pays their bid amount to the opponent.</li>
      <li>If bids tie → the advantage token switches sides.</li>
      <li>The player with the advantage wins ties and places a disc.</li>
      <li>Winner of the bid chooses any column to drop their disc into.</li>
      <li>First to connect 4 discs in a row wins (horizontal, vertical, diagonal).</li>
      <li>If the board fills with no winner, the game ends in a draw.</li>
    </ul>
  </>
)}

      </div>

      {/* CENTER BOARD */}
      <div className="kd-center">
        <h2>
          {winner
            ? winner === null
              ? "Draw!"
              : `Winner: Player ${winner}`
            : mode === "bidding"
            ? phase === "bidding"
              ? "Submit Bids"
              : awaitActor
              ? `Winner: ${awaitActor} — Drop your coin`
              : "Waiting…"
            : `Player ${turn}'s Turn`}
        </h2>

        <div
          className="kd-board"
          style={{
            gridTemplateColumns: `repeat(${cols}, 48px)`,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={[
                  "kd-cell",
                  cell === 1 ? "p1" : "",
                  cell === 2 ? "p2" : "",
                  previewCol === c && r === 0 ? "selected" : "",
                ].join(" ")}
                onClick={() => handleColumnClick(c)}
              >
                {cell === 1 ? "●" : cell === 2 ? "○" : ""}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL — BIDDING */}
      {mode === "bidding" && (
        <div className="kd-right">
          <h2>Bidding</h2>

          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <div style={{ marginBottom: 6 }}>
              P1 Money: {P1money} {currentMarker === "P1" ? "🔸" : ""}
            </div>
            <div>
              P2 Money: {P2money} {currentMarker === "P2" ? "🔸" : ""}
            </div>
          </div>

          {bidError && <div className="error">{bidError}</div>}

          <div style={{ marginBottom: 10 }}>
            <label>P1 Bid</label>
            <input
              type="number"
              value={bidP1}
              onChange={(e) => setBidP1(Number(e.target.value))}
              min="0"
              style={{ display: "block" }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>P2 Bid</label>
            <input
              type="number"
              value={bidP2}
              onChange={(e) => setBidP2(Number(e.target.value))}
              min="0"
              style={{ display: "block" }}
            />
          </div>

          <label>
            Use Marker
            <input
              type="checkbox"
              checked={useMarker}
              onChange={() => setUseMarker(!useMarker)}
              style={{ marginLeft: 8 }}
            />
          </label>
          <button
            style={{ marginTop: 12 }}
            disabled={
              phase !== "bidding" ||
              awaitActor !== null ||
              bidP1 > P1money ||
              bidP2 > P2money
            }
            onClick={submitBids}
          >
            Submit Bids
          </button>
        </div>
      )}
    </div>
  );
}
