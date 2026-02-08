import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GameMenu.css";

// SVG Component for Rupee Bag (Clean Emoji Style)
function RupeeBagIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}
    >
      {/* Bag Body - Standard Gold */}
      <path
        fill="#FFAC33"
        d="M29.56,12.56C29.56,7.5,25.86,5.19,20.89,4.42c1.07-2.31,0.59-4.2-1.33-4.2L16,0.21 c-1.89-0.08-2.48,1.79-1.5,4.19C9.27,5.1,5.27,7.49,5.27,12.56c0,2.37,0.85,5.21,1.96,8.22c1.55,4.18,3.95,10.73,3.98,10.82 c0.67,2.15,2.77,3.62,5.03,3.53l3.52-0.13c2.26-0.09,4.24-1.82,4.64-4.04c0.03-0.16,1.96-10.74,3.22-14.28 C28.79,16.65,29.56,14.61,29.56,12.56z"
      />
      {/* Tie String */}
      <path
        fill="#DD2E44"
        d="M17.41,9.08h11.23c0.41,0,0.75-0.34,0.75-0.75v0c0-0.41-0.34-0.75-0.75-0.75H17.41c-0.41,0-0.75,0.34-0.75,0.75 v0C16.66,8.74,17,9.08,17.41,9.08z"
      />
      {/* Rupee Symbol */}
      <text
        x="18"
        y="26"
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fill="#118C4F"
        fontFamily="sans-serif"
      >
        ₹
      </text>
    </svg>
  );
}

export default function GameMenu() {
  const location = useLocation();
  // Steps: 'intro' -> 'mode_selection' -> 'config' -> 'game_grid'
  // Initialize from location state if available (e.g. returning from GameInfo), otherwise default
  const [step, setStep] = useState(location.state?.step || "intro");

  const [mode, setMode] = useState(location.state?.mode || "normal"); // 'normal' | 'bidding'

  // Config State
  const [currencyP1, setCurrencyP1] = useState(0);
  const [currencyP2, setCurrencyP2] = useState(0);
  const [markerHolder, setMarkerHolder] = useState("P1");

  // Game List
  const gameList = [
    { name: "Tic Tac Toe", path: "/tictactoe", icon: "⭕", id: "tictactoe" },
    { name: "King Dirt", path: "/kingdirt", icon: "👑", id: "kingdirt" },
    { name: "Four In A Row", path: "/fourinarow", icon: "🟣", id: "fourinarow" },
    { name: "Stone Expansion", path: "/stoneexpansion", icon: "🌑", id: "stoneexpansion" },
    { name: "Clobber", path: "/clobber", icon: "⚔️", id: "clobber" },
  ];

  // STEP 1: INTRO ANIMATION TIMEOUT
  React.useEffect(() => {
    if (step === "intro") {
      const timer = setTimeout(() => {
        setStep("mode_selection");
      }, 2500); // 2.5 seconds intro
      return () => clearTimeout(timer);
    }
  }, [step]);

  // HANDLERS
  const handleModeConfirm = () => {
    if (mode === "normal") {
      setStep("game_grid");
    } else {
      setStep("config");
    }
  };

  const handleConfigConfirm = () => {
    setStep("game_grid");
  };

  // --- RENDERERS ---

  // 1. INTRO
  if (step === "intro") {
    return (
      <div className="container intro-container">
        <h1 className="intro-title">Combinatorial Games</h1>
      </div>
    );
  }

  // 2. MODE SELECTION
  if (step === "mode_selection") {
    return (
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '900',
          letterSpacing: '-0.02em',
          marginBottom: '15px',
          background: 'linear-gradient(135deg, #6B9AC4 0%, #97B8A0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'inline-block',
          textTransform: 'uppercase',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
          Combinatorial Games
        </h1>
        <h3 style={{
          fontSize: '1.8rem',
          marginTop: '0',
          marginBottom: '40px',
          color: 'var(--text-muted)',
          fontWeight: '600'
        }}>
          Select Play Mode
        </h3>

        <div className="mode-cards-container">
          {/* Normal Play Card */}
          <div
            className={`mode-select-card ${mode === 'normal' ? 'selected' : ''}`}
            onClick={() => setMode('normal')}
          >
            <h3>Normal Play</h3>
            <div className="mode-desc">
              Players take turns alternately and the one who makes the last move wins.
              <div style={{ marginTop: '12px' }}>
                <Link to="/game-info" state={{ mode: 'normal' }} style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                  Know more →
                </Link>
              </div>
            </div>
          </div>

          {/* Bidding Play Card */}
          <div
            className={`mode-select-card ${mode === 'bidding' ? 'selected' : ''}`}
            onClick={() => setMode('bidding')}
          >
            <h3>Bidding Play</h3>
            <div className="mode-desc">
              <div style={{ fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '10px' }}>
                At every turn, both players place a bid. The <strong>bid winner</strong> pays the winning amount to the opponent and then makes a move. The winning amount may or may not include the marker. <strong>If a player wins the bid but cannot make a move, they lose.</strong>
              </div>
              <div style={{ fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '10px', color: 'var(--text-muted)' }}>
                <strong>Note:</strong> Bid comparison is based <strong>only on the amount</strong> offered. The marker has <strong>no numerical value</strong> and does not affect which bid is higher.
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Cases:</strong>
                <ul style={{ textAlign: 'left', paddingLeft: '20px', fontSize: '0.85rem', marginTop: '8px' }}>
                  <li style={{ marginBottom: '6px' }}><strong>Case 1 — Higher bid (no marker):</strong> Higher bidder wins and pays. The marker stays with its current holder.</li>
                  <li style={{ marginBottom: '6px' }}><strong>Case 2 — Higher bid (marker included):</strong> A player may include the marker with their bid. If they win, they pay the bid and give the marker to the opponent.</li>
                  <li><strong>Case 3 — Tie:</strong> The marker holder wins, pays the bid, and gives the marker to the opponent.</li>
                </ul>
              </div>
              <div style={{ marginTop: '12px' }}>
                <Link to="/game-info" state={{ mode: 'bidding' }} style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                  Know more →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <button className="confirm-btn" onClick={handleModeConfirm}>
          Confirm
        </button>
      </div>
    );
  }

  // 3. CONFIGURATION (Bidding Only)
  if (step === "config") {
    return (
      <div className="container" style={{ maxWidth: '600px' }}>
        <h2 className="step-title">Set Initial budget</h2>

        <div className="config-form">
          <div className="form-group">
            <label>Initial Currency – Player 1</label>
            <input
              type="number"
              min="0"
              value={currencyP1}
              onChange={(e) => setCurrencyP1(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div className="form-group">
            <label>Initial Currency – Player 2</label>
            <input
              type="number"
              min="0"
              value={currencyP2}
              onChange={(e) => setCurrencyP2(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div className="form-group">
            <label>Tie-Breaking Marker Holder</label>
            <select value={markerHolder} onChange={(e) => setMarkerHolder(e.target.value)}>
              <option value="P1">Player 1</option>
              <option value="P2">Player 2</option>
            </select>
          </div>

          <div className="button-group">
            <button className="back-btn" onClick={() => setStep('mode_selection')}>Back</button>
            <button className="confirm-btn" onClick={handleConfigConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    );
  }

  // 4. GAME GRID
  return (
    <div className="container">
      <h1>
        {mode === "normal"
          ? "Alternating normal play combinatorial games"
          : "Bidding combinatorial games"}
      </h1>

      {mode === "bidding" && (
        <div className="status-bar">
          <span className="status-item"><RupeeBagIcon /> P1: {currencyP1}</span>
          <span className="status-item"><RupeeBagIcon /> P2: {currencyP2}</span>
          <span className="status-item">🚩 Marker: {markerHolder}</span>
          <button className="small-btn" onClick={() => setStep('config')}>⚙️ Edit</button>
        </div>
      )}

      {/* Game Grid */}
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

      <div style={{ marginTop: '30px', marginBottom: '20px' }}>
        <button
          className="back-btn"
          onClick={() => setStep('mode_selection')}
          style={{ fontSize: '0.9rem', padding: '10px 24px' }}
        >
          Reselect Playing Mode
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <Link
          to="/game-info"
          state={{ mode }}
          style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: '500' }}
        >
          {mode === 'normal' ? "Know more about Alternating normal play combinatorial games" : "Know more about Bidding combinatorial games"}
        </Link>
      </div>

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
