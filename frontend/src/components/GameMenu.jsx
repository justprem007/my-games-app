import React, { useState } from "react";
import { Link } from "react-router-dom";

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

      <h1>My Games</h1>

      {/* MODE SWITCH */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Mode: {mode === "normal" ? "Normal" : "Bidding"}
        </label>

        <label className="switch">
          <input type="checkbox" onChange={handleToggle} checked={mode === "bidding"} />
          <span className="slider round"></span>
        </label>
      </div>

      {/* POPUP FOR BIDDING MODE SETTINGS */}
      {showConfig && (
        <div className="modal">
          <div className="modal-content">
            <h2>Bidding Mode Setup</h2>

            <label>Initial Currency – Player 1:</label>
            <input
              type="number"
              value={currencyP1}
              onChange={(e) => setCurrencyP1(Number(e.target.value))}
            />

            <label>Initial Currency – Player 2:</label>
            <input
              type="number"
              value={currencyP2}
              onChange={(e) => setCurrencyP2(Number(e.target.value))}
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


        <Link to="/fourinarow">
          <button>Play Four In A Row</button>
        </Link>
      </div>
    </div>
  );
}
