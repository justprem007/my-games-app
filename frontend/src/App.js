import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameMenu from "./components/GameMenu";
import TicTacToe from "./components/TicTacToe";
import FourInARow from "./components/FourInARow";
import KingDirt from "./components/KingDirt";
import StoneExpansion from "./components/StoneExpansion";



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameMenu />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/fourinarow" element={<FourInARow />} />
        <Route path="/kingdirt" element={<KingDirt />} />
        <Route path="/stoneexpansion" element={<StoneExpansion />} />
      </Routes>
    </Router>
  );
}
