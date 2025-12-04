import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./KingDirt.css";
import { resolveBidding } from "./biddingEngine";

export default function KingDirt() {
  // ---------------------------
  // ROUTER INPUT
  // ---------------------------
  const location = useLocation();
  const { mode, currencyP1, currencyP2, markerHolder } =
    location.state || {
      mode: "normal",
      currencyP1: 0,
      currencyP2: 0,
      markerHolder: "P1",
    };

  // ---------------------------
  // STATE
  // ---------------------------
  const [size, setSize] = useState(5);
  const [phase, setPhase] = useState("setup"); // "setup" | "placement" | "play" | "bidding" | "action" | "end"
  const [board, setBoard] = useState([]);
  const [positions, setPositions] = useState({ 1: null, 2: null });
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);

  // Bidding
  const [P1money, setP1money] = useState(currencyP1);
  const [P2money, setP2money] = useState(currencyP2);
  const [currentMarker, setCurrentMarker] = useState(markerHolder);

  const [bidP1, setBidP1] = useState(0);
  const [bidP2, setBidP2] = useState(0);
  const [useMarker, setUseMarker] = useState(false);
  const [bidError, setBidError] = useState("");

  const [awaitActor, setAwaitActor] = useState(null); // "P1" or "P2" when bidding winner must act
  const [awaitActionType, setAwaitActionType] = useState(null); // "place" | "move"
  const [previewTarget, setPreviewTarget] = useState(null);

  // ---------------------------
  // START GAME
  // ---------------------------
  const startGame = () => {
    setBoard(Array.from({ length: size }, () => Array(size).fill(null)));
    if (mode === "bidding") {
      setPhase("bidding"); // first action is bidding
    } else {
      setPhase("placement");
    }

    setPositions({ 1: null, 2: null });
    setTurn(1);
    setWinner(null);

    if (mode === "bidding") {
      setP1money(currencyP1);
      setP2money(currencyP2);
      setCurrentMarker(markerHolder);
    } else {
      setP1money(0);
      setP2money(0);
    }

    setBidP1(0);
    setBidP2(0);
    setUseMarker(false);
    setBidError("");
    setAwaitActor(null);
    setAwaitActionType(null);
    setPreviewTarget(null);
  };

  // ---------------------------
  // LEGAL MOVES
  // ---------------------------
  const legalMoves = useCallback(
    (pos, boardRef = board) => {
      if (!pos) return [];
      const [r, c] = pos;
      const moves = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            if (boardRef[nr][nc] === null) moves.push([nr, nc]);
          }
        }
      }
      return moves;
    },
    [board, size]
  );

  // ---------------------------
  // ENDGAME CHECK
  // ---------------------------
  useEffect(() => {
    if (winner) return; // game already ended

    // Only check for endgame if the game is in play or action phase
    if (phase !== "play" && phase !== "action") return;

    // Bidding mode: don't declare winner until both kings are placed
    if (mode === "bidding") {
      if (!positions[1] || !positions[2]) return; // wait until both kings are placed
    }

    // Check legal moves for each player
    const p1Pos = positions[1];
    const p2Pos = positions[2];

    const p1Moves = p1Pos ? legalMoves(p1Pos) : [];
    const p2Moves = p2Pos ? legalMoves(p2Pos) : [];

    // Decide winner only if both kings are placed
    if (p1Pos && p2Pos) {
      if (p1Moves.length === 0 && p2Moves.length > 0) {
        setWinner(2);
        setPhase("end");
        return;
      }
      if (p2Moves.length === 0 && p1Moves.length > 0) {
        setWinner(1);
        setPhase("end");
        return;
      }
      if (p1Moves.length === 0 && p2Moves.length === 0) {
        // Both stuck — tie? Or pick based on rules (here we end as draw)
        setWinner(null);
        setPhase("end");
        return;
      }
    }
  }, [phase, winner, positions, legalMoves, mode]);

  // ---------------------------
  // CELL CLICK
  // ---------------------------
  const handleCellClick = (r, c) => {
    if (winner || phase === "end") return;
    if (!board.length) return; // safety

    if (board[r][c] !== null) {
      setPreviewTarget(null);
      return;
    }

    setPreviewTarget([r, c]);

    // ---------------------------
    // NORMAL MODE (UNCHANGED)
    // ---------------------------
    if (mode !== "bidding") {
      if (phase === "placement") {
        const newBoard = board.map((row) => [...row]);
        newBoard[r][c] = turn;
        setBoard(newBoard);
        setPositions((p) => ({ ...p, [turn]: [r, c] }));

        if (turn === 1) setTurn(2);
        else {
          setTurn(1);
          setPhase("play");
        }
        return;
      }

      if (phase === "play") {
        const from = positions[turn];
        if (!from) return;
        if (!legalMoves(from).some(([mr, mc]) => mr === r && mc === c)) return;

        const newBoard = board.map((row) => [...row]);
        newBoard[from[0]][from[1]] = "B";
        newBoard[r][c] = turn;
        setBoard(newBoard);
        const newPositions = { ...positions, [turn]: [r, c] };
        setPositions(newPositions);

        const other = turn === 1 ? 2 : 1;
        if (legalMoves(newPositions[other]).length === 0) {
          setWinner(turn);
          setPhase("end");
        } else {
          setTurn(other);
        }
      }

      return;
    }

    // ---------------------------
    // BIDDING MODE
    // ---------------------------
    // PLACEMENT phase in bidding mode
    if (phase === "placement") {
      const actor = positions[1] ? 2 : 1;
      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = actor;
      const newPositions = { ...positions, [actor]: [r, c] };
      setBoard(newBoard);
      setPositions(newPositions);

      // If both placed, start bidding instead of play
      if (newPositions[1] && newPositions[2]) {
        setPhase("bidding");
      }
      setPreviewTarget(null);
      return;
    }

    // ACTION phase in bidding mode
    if (phase === "action") {
      if (!awaitActor) return;
      const actor = awaitActor === "P1" ? 1 : 2;
      const other = actor === 1 ? 2 : 1;

      // centralized finish/cleanup
      const finishAction = (maybeWinner = null) => {
        setAwaitActor(null);
        setAwaitActionType(null);
        setPreviewTarget(null);
        if (maybeWinner) {
          setWinner(maybeWinner);
          setPhase("end");
        } else {
          // go back to bidding allow next bid round
          setPhase("bidding");
        }
      };

      // ----- PLACE (actor not placed yet) -----
      if (!positions[actor]) {
        const newBoard = board.map((r0) => [...r0]);
        newBoard[r][c] = actor;
        const newPositions = { ...positions, [actor]: [r, c] };
        setBoard(newBoard);
        setPositions(newPositions);

        // If in bidding mode and the other hasn't placed we must not run win checks
        if (mode === "bidding" && (!newPositions[1] || !newPositions[2])) {
          finishAction(null);
          return;
        }

        // both placed: perform checks using newBoard/newPositions
        const emptySquares = newBoard.flat().filter((cell) => cell === null).length;

        // check opponent if placed
        if (newPositions[other]) {
          const otherLegal = legalMoves(newPositions[other], newBoard);
          if (otherLegal.length === 0) {
            finishAction(actor); // actor wins (opponent stuck)
            return;
          }
        }

        // check actor legal moves (edge-case: board full or no adjacent empty)
        const actorLegal = legalMoves(newPositions[actor], newBoard);
        if (actorLegal.length === 0) {
          if (emptySquares === 0) finishAction(actor);
          else finishAction(other); // actor cannot move but board not full => actor loses
          return;
        }

        // no winner -> back to bidding
        finishAction(null);
        return;
      }

      // ----- MOVE (actor already placed) -----
      const from = positions[actor];
      if (!from) return;
      const legal = legalMoves(from);
      if (!legal.some(([mr, mc]) => mr === r && mc === c)) return;

      const newBoard = board.map((row) => [...row]);
      newBoard[from[0]][from[1]] = "B";
      newBoard[r][c] = actor;
      const newPositions = { ...positions, [actor]: [r, c] };
      setBoard(newBoard);
      setPositions(newPositions);

      // After move: compute empties and run checks on newBoard/newPositions
      const emptySquares = newBoard.flat().filter((cell) => cell === null).length;

      // If opponent has placed, check their legal moves (only if placed)
      if (newPositions[other]) {
        const otherLegal = legalMoves(newPositions[other], newBoard);
        if (otherLegal.length === 0) {
          finishAction(actor); // opponent stuck => actor wins
          return;
        }
      }

      // Check actor legal moves (maybe board full)
      const actorLegal = legalMoves(newPositions[actor], newBoard);
      if (actorLegal.length === 0) {
        if (emptySquares === 0) finishAction(actor);
        else finishAction(other);
        return;
      }

      // No winner -> clear awaitActor and return to bidding
      finishAction(null);
      return;
    }

    // If we are in bidding phase, clicks shouldn't place/move; players must submit bids first.
    // So ignore clicks in bidding phase (previewTarget can still show).
    return;
  };

  // ---------------------------
  // SUBMIT BIDS
  // ---------------------------
  const submitBids = () => {
    if (mode !== "bidding") return;
    if (phase !== "bidding") return; // only allow submit during bidding phase

    if (bidP1 < 0 || bidP2 < 0) return setBidError("Bids must be non-negative");
    if (bidP1 > P1money) return setBidError("P1 cannot bid more than they have");
    if (bidP2 > P2money) return setBidError("P2 cannot bid more than they have");

    setBidError("");

    const result = resolveBidding({
      bidP1,
      bidP2,
      P1money,
      P2money,
      currentMarker,
      useMarker,
    });

    setP1money(result.newP1money);
    setP2money(result.newP2money);
    setCurrentMarker(result.newMarkerHolder);

    setAwaitActor(result.winner);
    const actorNum = result.winner === "P1" ? 1 : 2;
    // use current positions state - correct here because submitBids occurs only during bidding
    setAwaitActionType(positions[actorNum] ? "move" : "place");

    // reset bids
    setBidP1(0);
    setBidP2(0);
    setUseMarker(false);
    setPreviewTarget(null);

    // Move into action phase — winner must now perform an action (place/move)
    setPhase("action");
  };

  // ---------------------------
  // ---------- RETURN ----------
  // ---------------------------
  return (
    <div className="kd-layout">
      {/* LEFT PANEL */}
      <div className="kd-left">
        <Link to="/">← Back</Link>

        {(phase === "setup" || !board.length) && (
          <>
            <h3>Setup</h3>
            <label>
              Board size:
              <input
                type="number"
                min="3"
                value={size}
                onChange={(e) => setSize(Math.max(3, Number(e.target.value)))}
              />
            </label>

            <button onClick={startGame} style={{ marginTop: 10 }}>
              Start Game
            </button>
          </>
        )}

        {mode === "normal" ? (
            <>
              <h3>How to Play (Normal Mode)</h3>
              <ul>
                <li>Each player places one king.</li>
                <li>Kings move 1 square; leaving a square blocks it.</li>
                <li>No legal move → you lose.</li>
              </ul>
            </>
          ) : (
            <>
              <h3>How to Play (Bidding Mode)</h3>
              <ul>
                <li>Both players submit bids each turn.</li>
                <li>Higher bid wins and pays their bid to the opponent.</li>
                <li>If marker is used or bids tie → marker transfers.</li>
                <li>Winner of the bid places/moves their king.</li>
                <li>No legal move remmaining→ you lose.</li>
                <li>If only one king is in play and he has no moves remaining, if all the squares are fulled, he wins else he loses</li>
              </ul>
            </>
          )}
      </div>

      {/* CENTER BOARD */}
      <div className="kd-center">
        <h2>
          {winner
            ? `Winner: Player ${winner}`
            : phase === "placement"
            ? "Placement Phase"
            : mode === "bidding"
            ? phase === "bidding"
              ? "Submit Bids"
              : phase === "action" && awaitActor
              ? `Winner: ${awaitActor} — ${awaitActionType === "place" ? "Place your king" : "Move your king"}`
              : phase === "action"
              ? "Waiting for winner to act"
              : `Player ${turn}'s Turn`
            : `Player ${turn}'s Turn`}
        </h2>

        {awaitActor && mode === "bidding" && (
          <p className="await-msg">
            Winner: {awaitActor} — {awaitActionType === "place" ? "Place your king" : "Move your king"}
          </p>
        )}

        {/* BOARD GRID */}
        <div
          className="kd-board"
          style={{
            gridTemplateColumns: `repeat(${size}, 48px)`,
          }}
        >
          {board.length > 0 &&
            board.map((row, ri) =>
              row.map((cell, ci) => {
                const isPreview =
                  previewTarget && previewTarget[0] === ri && previewTarget[1] === ci;

                const classNames = [
                  "kd-cell",
                  cell === "B" ? "blocked" : "",
                  cell === 1 ? "p1" : "",
                  cell === 2 ? "p2" : "",
                  isPreview ? "selected" : "",
                ].join(" ");

                return (
                  <div key={`${ri}-${ci}`} className={classNames} onClick={() => handleCellClick(ri, ci)}>
                    {cell === 1 ? "♚" : cell === 2 ? "♔" : ""}
                  </div>
                );
              })
            )}
        </div>
      </div>

      {/* RIGHT: BIDDING */}
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

          {bidError && (
            <div className="error" style={{ marginBottom: 10 }}>
              {bidError}
            </div>
          )}

          <div style={{ marginBottom: 10 }}>
            <label>P1 Bid</label>
            <input
              type="number"
              value={bidP1}
              onChange={(e) => setBidP1(Number(e.target.value))}
              min="0"
              style={{ display: "block", marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>P2 Bid</label>
            <input
              type="number"
              value={bidP2}
              onChange={(e) => setBidP2(Number(e.target.value))}
              min="0"
              style={{ display: "block", marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>
              Use Marker
              <input
                type="checkbox"
                checked={useMarker}
                onChange={() => setUseMarker(!useMarker)}
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>

          <button
            disabled={
              phase !== "bidding" ||
              awaitActor !== null ||
              bidError !== "" ||
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
