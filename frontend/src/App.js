import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameMenu from "./components/GameMenu";
import TicTacToe from "./components/TicTacToe";
import FourInARow from "./components/FourInARow";
import KingDirt from "./components/KingDirt";
import StoneExpansion from "./components/StoneExpansion";



import GameInfo from "./components/GameInfo";
import Clobber from "./components/Clobber";


export default function App() {
  return (
    <div className="app-background">
      <Router>
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/game-info" element={<GameInfo />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/fourinarow" element={<FourInARow />} />
          <Route path="/kingdirt" element={<KingDirt />} />
          <Route path="/stoneexpansion" element={<StoneExpansion />} />
          <Route path="/clobber" element={<Clobber />} />
        </Routes>
      </Router>
    </div>
  );
}
