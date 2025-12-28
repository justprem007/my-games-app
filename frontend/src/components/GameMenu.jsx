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
    // alert(
    //   `Bidding mode configured:\nP1 = ${currencyP1}\nP2 = ${currencyP2}\nMarker = ${markerHolder}`
    // );
  };

  return (
    <div className="container">

      <h1>Combinatorial Games</h1>

      <div
  style={{
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  }}
>
  <label
    style={{
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "5px",
    }}
  >
    Normal Play
    <span className="info-tooltip">
      ℹ️
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

  <label
    style={{
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "5px",
    }}
  >
    Bidding Play
    <span className="info-tooltip">
      ℹ️
      <span className="tooltip-text">
        Each turn, players submit a bid to decide who moves
        next. Ties are resolved using a tie breaking marker. Bids are deducted from your currency.
      </span>
    </span>
  </label>
</div>



      {/* POPUP FOR BIDDING MODE SETTINGS */}
      {showConfig && (
        <div className="modal">
          <div className="modal-content">
            <h2>Bidding Play Setup</h2>

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

            <button onClick={saveConfig}>Save</button>
          </div>
        </div>
      )}

      <div>
        <Link
          to="/tictactoe"
          state={{
            mode,
            currencyP1,
            currencyP2,
            markerHolder
          }}
        >
          <button>Play Tic Tac Toe</button>
        </Link>

        <Link
        to="/kingdirt"
        state={{
          mode,
          currencyP1,
          currencyP2,
          markerHolder
        }}
        >
          <button>Play King Dirt</button>
        </Link>


        <Link 
        to="/fourinarow"
         state={{
          mode,
          currencyP1,
          currencyP2,
          markerHolder
        }}>
          <button>Play Four In A Row</button>
        </Link>

        <Link 
        to="/stoneexpansion"
        state={{
          mode,
          currencyP1,
          currencyP2,
          markerHolder
        }}
      >
        <button>Play Stone Expansion</button>
      </Link>



      </div>
      <div
          style={{
            marginTop: "30px",
            fontSize: "1.5 rem",
            color: "#666",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "6px",fontSize: "4 rem"}}>Credits :</div>
          <div>Veeresh S Kambalyal (23B1309), B.Tech in Electrical Engineering, IIT Bombay</div>
          <div>Dr. Prem Kant (194193001), Ph.D in Combinatorial Game Theory, IEOR, IIT Bombay</div>
        </div>


    </div>
    
  );
}
