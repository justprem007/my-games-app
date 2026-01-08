import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./GameMenu.css";

export default function GameMenu() {
  const [mode, setMode] = useState("normal"); // normal | bidding
  const [showConfig, setShowConfig] = useState(false);

  const [currencyP1, setCurrencyP1] = useState(0);
  const [currencyP2, setCurrencyP2] = useState(0);
  const [markerHolder, setMarkerHolder] = useState("P1");

  // When toggle is pressed
  const handleToggle = () => {
    if (mode === "normal") {
      setMode("bidding");
      setShowConfig(true); // show popup
    } else {
      setMode("normal");
    }
  };

  const saveConfig = () => {
    setShowConfig(false);
  };

  const gameList = [
    { name: "Tic Tac Toe", path: "/tictactoe", icon: "⭕", id: "tictactoe" },
    { name: "King Dirt", path: "/kingdirt", icon: "👑", id: "kingdirt" },
    { name: "Four In A Row", path: "/fourinarow", icon: "🟣", id: "fourinarow" },
    { name: "Stone Expansion", path: "/stoneexpansion", icon: "🌑", id: "stoneexpansion" },
  ];

  return (
    <div className="container">
      <h1>Combinatorial Games</h1>

      {/* Mode Toggle Section */
        /* Note: Reduced bottom margin on container via CSS for tighter look */
      }
      <div className="mode-toggle-container">
        <label className={`mode-label ${mode === 'normal' ? 'active' : ''}`}>
          Normal Play
          <span className="info-tooltip">
            ℹ
            <span className="tooltip-text">
              Players take turns normally without any bidding.
            </span>
          </span>
        </label>

        <label className="switch">
          <input
            type="checkbox"
            onChange={handleToggle}
            checked={mode === "bidding"}
          />
          <span className="slider round"></span>
        </label>

        <label className={`mode-label ${mode === 'bidding' ? 'active' : ''}`}>
          Bidding Play
          <span className="info-tooltip">
            ℹ
            <span className="tooltip-text">
              At the start of each turn, both players submit a bid for the right to make the next move.
              A bid may consist of coins alone, or coins together with the tie-breaking marker.
              The player with the higher bid wins.
              If both bids are equal, the player who holds the tie-breaking marker wins the bid by using it.
              The winner transfers everything they bid (coins and, if included, the marker) to the other player and then makes a move in the game.
            </span>
          </span>
        </label>
      </div>

      {/* Game Grid - Horizontal Row */}
      <div className="game-grid">
        {gameList.map((game) => (
          <Link
            key={game.path}
            to={game.path}
            state={{
              mode,
              currencyP1,
              currencyP2,
              markerHolder,
            }}
            className={`game-card ${game.id}`}
          >
            <div className="icon">{game.icon}</div>
            <h3>{game.name}</h3>
          </Link>
        ))}
      </div>

      {/* POPUP FOR BIDDING MODE SETTINGS */}
      {showConfig && (
        <div className="modal">
          <div className="modal-content">
            <h2>Bidding Setup</h2>

            <label>Initial Currency – Player 1:</label>
            <input
              type="number"
              min="0"
              value={currencyP1}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCurrencyP1(val < 0 ? 0 : val);
              }}
            />

            <label>Initial Currency – Player 2:</label>
            <input
              type="number"
              min="0"
              value={currencyP2}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCurrencyP2(val < 0 ? 0 : val);
              }}
            />

            <label>Who holds the tie-breaking marker?</label>
            <select value={markerHolder} onChange={(e) => setMarkerHolder(e.target.value)}>
              <option value="P1">Player 1</option>
              <option value="P2">Player 2</option>
            </select>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={saveConfig}>Save Configuration</button>
            </div>
          </div>
        </div>
      )}

      {/* Credits */}
      <div className="credits">
        <strong>Credits</strong>
        <div>Dr. Prem Kant (194193001), Ph.D in Combinatorial Game Theory, IEOR, IIT Bombay</div>
        <div style={{ marginTop: '8px', fontSize: '0.9em', opacity: 0.8 }}>
          I thank the other contributors for their help in game codes. Special thanks to Veeresh S Kambalyal (23B1309), B.Tech in Electrical Engineering, IIT Bombay.
        </div>
      </div>
    </div>
  );
}
