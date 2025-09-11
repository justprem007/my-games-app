import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameMenu from "./components/GameMenu";
import TicTacToe from "./components/TicTacToe";
import FourInARow from "./components/FourInARow";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameMenu />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/fourinarow" element={<FourInARow />} />
      </Routes>
    </Router>
  );
}
