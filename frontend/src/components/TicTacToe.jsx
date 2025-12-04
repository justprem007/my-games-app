import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./TicTacToe.css";
import { resolveBidding } from "./biddingEngine";

export default function TicTacToe() {
  const location = useLocation();
  const { mode, currencyP1, currencyP2, markerHolder } = location.state || {
    mode: "normal",
    currencyP1: 0,
    currencyP2: 0,
    markerHolder: "P1",
  };

  const [isDraw, setIsDraw] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentMarker, setCurrentMarker] = useState(markerHolder);
  const [P1money, setP1money] = useState(currencyP1);
  const [P2money, setP2money] = useState(currencyP2);

  // NEW: who is allowed to place a tile after bidding
  const [awaitMoveFrom, setAwaitMoveFrom] = useState(null);

  const [bidP1, setBidP1] = useState(0);
  const [bidP2, setBidP2] = useState(0);
  const [useMarker, setUseMarker] = useState(false);

  const [bidError, setBidError] = useState("");
  const [winner, setWinner] = useState(null);
  const [moveBy, setMoveBy] = useState("P1");

  //-----------------------------------------------------
  // WINNER CHECK
  //-----------------------------------------------------
  const checkWinner = (b) => {
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
    for (let [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
  };

  //-----------------------------------------------------
  // NORMAL MODE MOVE
  //-----------------------------------------------------
  const handleNormalMove = (i) => {
    if (board[i] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[i] = moveBy === "P1" ? "1" : "2";
    setBoard(newBoard);

    const w = checkWinner(newBoard);
    if (w) {
      setWinner(w);
      return;
    }

    if (newBoard.every((c) => c !== null)) {
      setIsDraw(true);
      return;
    }

    setMoveBy(moveBy === "P1" ? "P2" : "P1");
  };

  //-----------------------------------------------------
  // AFTER BIDDING, WINNER MUST CLICK A TILE
  //-----------------------------------------------------
  const placeBiddingMove = (i) => {
    if (board[i] !== null || winner || isDraw) return;
    if (awaitMoveFrom === null) return; // nobody should move yet

    const newBoard = [...board];
    newBoard[i] = awaitMoveFrom === "P1" ? "1" : "2";
    setBoard(newBoard);

    const w = checkWinner(newBoard);
    if (w) {
      setWinner(w);
      setAwaitMoveFrom(null);
      return;
    }

    if (newBoard.every((c) => c !== null)) {
      setIsDraw(true);
      setAwaitMoveFrom(null);
      return;
    }

    // next turn → bidding again
    setAwaitMoveFrom(null);
  };

  //-----------------------------------------------------
  // RESOLVE BIDDING → THEN AWAIT MOVE FROM WINNER
  //-----------------------------------------------------
  const resolveBid = () => {
    if (winner || isDraw) return;

    const result = resolveBidding({
      bidP1,
      bidP2,
      P1money,
      P2money,
      currentMarker,
      useMarker,
    });

    // Update money + marker
    setP1money(result.newP1money);
    setP2money(result.newP2money);
    setCurrentMarker(result.newMarkerHolder);

    // Winner must now select a tile
    setAwaitMoveFrom(result.winner);

    // Reset bid inputs
    setBidP1(0);
    setBidP2(0);
    setUseMarker(false);
    setBidError("");
  };

  //-----------------------------------------------------
  // RESET GAME
  //-----------------------------------------------------
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setMoveBy("P1");
    setP1money(currencyP1);
    setP2money(currencyP2);
    setCurrentMarker(markerHolder);
    setBidP1(0);
    setBidP2(0);
    setUseMarker(false);
    setBidError("");
    setIsDraw(false);
    setAwaitMoveFrom(null);
  };

  //-----------------------------------------------------
  // RENDER
  //-----------------------------------------------------
  return (
    <div className="ttt-layout-3col">

      {/* LEFT SIDE — INSTRUCTIONS */}
      <div className="ttt-left">
        <div className="ttt-instructions">
        <Link to="/">← Back</Link>
          {mode === "normal" ? (
            <>
              <h3>How to Play (Normal Play)</h3>
              <ul>
                <li>Players take turns placing on empty tiles.</li>
                <li>First to complete a row, column or diagonal wins.</li>
                <li>If the board fills with no winner → Draw.</li>
              </ul>
            </>
          ) : (
            <>
              <h3>How to Play (Bidding Play)</h3>
              <ul>
                <li>Both players submit bids each turn.</li>
                <li>Higher bid wins and pays their bid to the opponent.</li>
                <li>If marker is used or bids tie → marker transfers.</li>
                <li>Winner of the bid chooses ANY empty tile.</li>
                <li>First to complete 3-in-a-row wins.</li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* CENTER — BOARD */}
      <div className="ttt-center">
        <h1>Tic Tac Toe ({mode === "bidding" ? "Bidding Play" : "Normal Play"})</h1>

        {mode === "bidding" && (
          <div className="bidding-info">
            <p>P1 Money: {P1money} {currentMarker === "P1" ? "🔸(Marker)" : ""}</p>
            <p>P2 Money: {P2money} {currentMarker === "P2" ? "🔸(Marker)" : ""}</p>
          </div>
        )}

        {awaitMoveFrom && (
          <p className="await-msg">
            Player {awaitMoveFrom} won the bid — select an empty tile!
          </p>
        )}

        <div className="ttt-board">
          {board.map((cell, i) => (
            <div
              key={i}
              className="ttt-cell"
              onClick={() => {
                if (mode === "normal") {
                  handleNormalMove(i);
                } else {
                  placeBiddingMove(i);
                }
              }}
            >
              {cell}
            </div>
          ))}
        </div>

        {winner && <h2>Winner: Player {winner}</h2>}
        {isDraw && !winner && <h2>Game is a Draw!</h2>}
        <button className="ttt-button" onClick={resetGame}>Reset Game</button>
      </div>

      {/* RIGHT — BIDDING PANEL */}
      {mode === "bidding" && (
        <div className="ttt-right">
          <h2>Bidding Panel</h2>

          {bidError && <p style={{ color: "red", fontWeight: "bold" }}>{bidError}</p>}

          <label>P1 Bid (Money: {P1money})</label>
          <input
            type="number"
            value={bidP1}
            min="0"
            onChange={(e) => {
              const v = Number(e.target.value);
              setBidP1(v);
              if (v > P1money) setBidError("P1 cannot bid more than they have");
              else if (bidP2 > P2money) setBidError("P2 bid too high");
              else setBidError("");
            }}
          />

          <label style={{ marginTop: "10px" }}>
            P2 Bid (Money: {P2money})
          </label>
          <input
            type="number"
            value={bidP2}
            min="0"
            onChange={(e) => {
              const v = Number(e.target.value);
              setBidP2(v);
              if (v > P2money) setBidError("P2 cannot bid more than they have");
              else if (bidP1 > P1money) setBidError("P1 bid too high");
              else setBidError("");
            }}
          />

          <label style={{ marginTop: "15px" }}>
            Use marker for {currentMarker}:{" "}
            <input
              type="checkbox"
              checked={useMarker}
              onChange={() => setUseMarker(!useMarker)}
            />
          </label>

          <button
            style={{ marginTop: "15px" }}
            disabled={
              awaitMoveFrom !== null || // cannot bid while move pending
              bidError !== "" ||
              bidP1 > P1money ||
              bidP2 > P2money
            }
            onClick={resolveBid}
          >
            Submit Bids
          </button>
        </div>
      )}

    </div>
  );
}
